// 패왕전 시간 제한 · 자기장. 판마다 정해진 시간이 지나면 남은 체력 비율이 높은 편이 이김 (데스매치는 레벨·처치가 높은 사람)
// 자기장(5대5·대난투): 1분마다 다음 원(흰 테두리로 미리 보임)으로 줄어듦. 원 밖에 있으면 0.5초마다 피해, 단계가 오를수록 셈
// AI는 원 밖이면 원 가운데로 돌아옴. 수치는 paewangDefs.PW_MODE(timeSec·zone)·PW.zone
import { ROOM_CX, ROOM_CY, ROOM_HEIGHT, ROOM_WIDTH, TICK_RATE, TILE_SIZE } from "../constants";
import { PW_ARENAS } from "../paewangMaps";
import { PW, PW_MODE } from "../paewangDefs";
import { createRng, deriveSeed } from "../rng";
import { damagePlayer } from "./combat";
import { eachSeat } from "./party";
import { recapEnv } from "./pvpRecap";
import { inPlay } from "./pvpWorld";
import type { RunState, TickInput } from "./types";
import { rot } from "./orbit";
import { normalize } from "./util";

/** 지금 판이 시작한 틱 (3·2·1이 끝난 때) */
export const roundStart = (s: RunState) => s.pvp!.readyAt ?? PW.ready;

/** 이 판이 끝나는 틱 (시간 제한) */
export const roundEnd = (s: RunState) => roundStart(s) + PW_MODE[s.pvp!.mode].timeSec * TICK_RATE;

/** 화면용: 남은 초 (0 아래로 안 감) */
export const pvpTimeLeft = (s: RunState) => Math.max(0, Math.ceil((roundEnd(s) - Math.max(s.tick, roundStart(s))) / TICK_RATE));

export interface PwZone {
  /** 지금 원 (가운데·반지름) · 다음에 줄어들 원 · 단계 (0부터, 피해가 셈) */
  x: number;
  y: number;
  r: number;
  tx: number;
  ty: number;
  tr: number;
  phase: number;
}

const MIN = 60 * TICK_RATE;
/** 대결마다 자기장 (기간토마키아는 길고 천천히) */
const tune = (s: RunState) => PW_MODE[s.pvp!.mode].zoneTune ?? { every: MIN, shrink: PW.zone.shrink, minR: PW.zone.minR };

/** 단계 k가 끝났을 때의 원 (시드로 정해 늘 같음): 0단계는 경기장 전체, 그 뒤 앞 원 안에서 작아짐 */
function circleAt(s: RunState, k: number): [number, number, number] {
  // 기간토마키아: 들판(outCols)만 (오른쪽 실내 구역 빼고)
  const out = PW_ARENAS[s.pvp!.arena].outCols;
  const w = out ? out * TILE_SIZE : ROOM_WIDTH;
  let x = out ? w / 2 : ROOM_CX;
  let y = ROOM_CY;
  let r = Math.hypot(w, ROOM_HEIGHT) / 2 + 8;
  for (let i = 1; i <= k; i++) {
    const nr = Math.max(tune(s).minR, r * tune(s).shrink);
    const rng = createRng(deriveSeed(s.seed, "pwZone", s.pvp!.round ?? 1, i));
    // 새 원은 앞 원 안에 (가운데가 앞 원 가운데에서 r - nr 안)
    const a = rng.nextFloat() * Math.PI * 2;
    const d = rng.nextFloat() * (r - nr) * 0.8;
    const [ca, sa] = rot(a);
    x += ca * d;
    y += sa * d;
    r = nr;
  }
  return [x, y, r];
}

/** 지금 자기장 (없는 대결이면 undefined). 1분마다: 앞 40초는 다음 원을 보여 주고, 뒤 20초 동안 그 원까지 줄어듦 */
export function pvpZone(s: RunState): PwZone | undefined {
  const pv = s.pvp;
  if (!pv || !PW_MODE[pv.mode].zone || pv.practice) return undefined;
  const t = Math.max(0, s.tick - roundStart(s));
  const every = tune(s).every;
  const phase = Math.floor(t / every);
  const [x0, y0, r0] = circleAt(s, phase);
  const [tx, ty, tr] = circleAt(s, phase + 1);
  const into = t - phase * every;
  const k = Math.max(0, Math.min(1, (into - (every - PW.zone.shrinkTicks)) / PW.zone.shrinkTicks));
  return { x: x0 + (tx - x0) * k, y: y0 + (ty - y0) * k, r: r0 + (tr - r0) * k, tx, ty, tr, phase };
}

/** 자기장으로 셀 자리: 기간토마키아 건물 안(실내 구역)이면 그 건물 들판 문 자리 */
export function zonePos(s: RunState, x: number, y: number): [number, number] {
  const a = PW_ARENAS[s.pvp!.arena];
  if (!a.outCols || x < a.outCols * TILE_SIZE) return [x, y];
  const [c, r] = [x / TILE_SIZE, y / TILE_SIZE];
  const b = a.buildings?.find((bd) => bd.inside.some(([x0, y0, w, h]) => c >= x0 - 1 && c < x0 + w + 1 && r >= y0 - 1 && r < y0 + h + 1));
  return b ? [(b.out[0] + b.out[2] / 2) * TILE_SIZE, (b.out[1] + b.out[3] + 1) * TILE_SIZE] : [x, y];
}

/** 틱마다: 원 밖 사람은 0.5초마다 피해 (단계마다 셈) */
export function updateZone(s: RunState): void {
  const z = pvpZone(s);
  if (!z || s.tick <= roundStart(s) || s.tick % PW.zone.every !== 0) return;
  eachSeat(s, (i) => {
    const p = s.player;
    const [px, py] = zonePos(s, p.x, p.y);
    if (!inPlay(s, i) || Math.hypot(px - z.x, py - z.y) <= z.r) return;
    const before = p.hp;
    damagePlayer(s, p.stats.maxHp * PW.zone.dmg * (1 + z.phase * PW.zone.grow));
    recapEnv(s, before);
  });
}

/** AI: 원 밖이거나 곧 줄어들 원 밖이면 원 가운데 쪽으로 걸음 (싸움보다 먼저) */
export function zoneSteer(s: RunState, input: TickInput): TickInput {
  const z = pvpZone(s);
  if (!z) return input;
  const p = s.player;
  // 건물 안이면 문 자리로 셈 (나가는 길은 pwGiga.gigaSteer)
  if (zonePos(s, p.x, p.y)[0] !== p.x) return input;
  const out = Math.hypot(p.x - z.x, p.y - z.y) > z.r - 6;
  const soon = Math.hypot(p.x - z.tx, p.y - z.ty) > z.tr - 6 && z.r - z.tr > 1;
  if (!out && !soon) return input;
  const [cx, cy] = out ? [z.x, z.y] : [z.tx, z.ty];
  const d = normalize(cx - p.x, cy - p.y);
  return d ? { ...input, moveX: Math.round(d[0] * 100), moveY: Math.round(d[1] * 100) } : input;
}

/** 시간이 다 되면 이긴 편: 남은 사람(싸우는 중 + 토너먼트 기다리는 중)이 많은 편, 같으면 싸우는 사람 체력 비율(체력 합 / 최대 체력 합)이 큰 편
 *  · 데스매치는 레벨, 같으면 처치 */
export function timeWinner(s: RunState): number | undefined {
  const pv = s.pvp!;
  if (s.tick < roundEnd(s) || pv.practice) return undefined;
  if (pv.mode === "gungame") return pv.seats.reduce((a, b) => (b.lv * 1000 + b.kills > a.lv * 1000 + a.kills ? b : a)).team;
  const sum: Record<number, [number, number, number]> = {};
  eachSeat(s, (i) => {
    const seat = pv.seats[i]!;
    const v = (sum[seat.team] ??= [0, 0, 0]);
    if (inPlay(s, i)) {
      v[0]++;
      v[1] += Math.max(0, s.player.hp);
      v[2] += s.player.stats.maxHp;
    } else if (!seat.on && seat.deaths === 0) v[0]++;
  });
  let win = -1;
  let best = -1;
  for (const [team, [n, hp, max]] of Object.entries(sum)) {
    const score = n * 10 + (max ? hp / max : 0);
    if (score > best) [best, win] = [score, Number(team)];
  }
  return win;
}
