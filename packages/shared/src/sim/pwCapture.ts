// 패왕전 점령전 (docs/PW_MODES.md 3): 점령 구역 안에 우리 편만 있으면 점령도가 오르고 100%면 승리 · 시간이 다 되면 점령도가 높은 편
// 버프 자리(F를 누르고 3초 가만히 → 버프, 1분 뒤 다시 생김) · 낭떠러지(떨어지면 쓰러짐) · 점프대(밟으면 정한 곳으로 뛰어감)
// AI는 싸울 상대가 안 보이면 구역(낭떠러지 맵은 점프대 먼저)이나 버프 자리로 걸어감. 수치는 pwRules.PW_CAP
import { TICK_RATE, TILE_SIZE } from "../constants";
import { PW_MODE } from "../paewangDefs";
import type { PwArenaDef } from "../paewangMapKit";
import { PW_ARENAS, type PwArenaId } from "../paewangMaps";
import { PW_CAP } from "../pwRules";
import { distanceField, TILE_PIT, walkToward, type TileGrid } from "./layout";
import { inRect, pwGrid, spotXY } from "./paewangGrid";
import { eachSeat, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { roundEnd } from "./pvpZone";
import type { RunState, TickInput } from "./types";
import { addEffect } from "./util";

const arenaOf = (s: RunState): PwArenaDef => PW_ARENAS[s.pvp!.arena];

/** 점령전 판인지 */
export const isCapture = (s: RunState): boolean => !!s.pvp && PW_MODE[s.pvp.mode].rule === "capture";

/** 점령전 상태 (처음 부를 때 만듦) */
const capOf = (s: RunState) => (s.pvp!.cap ??= { prog: {}, buffAt: (arenaOf(s).buffs ?? []).map(() => 0) });

/** 점령 구역 안인지 (픽셀) */
export function inCapZone(a: PwArenaDef, x: number, y: number): boolean {
  const z = a.zone;
  if (z?.rect) return inRect(x, y, z.rect);
  if (!z?.circle) return false;
  const [c, r, rad] = z.circle;
  const [cx, cy] = spotXY([c, r]);
  return (x - cx) ** 2 + (y - cy) ** 2 <= (rad * TILE_SIZE) ** 2;
}

/** 점령 구역 가운데 (픽셀) */
export function capCenter(a: PwArenaDef): [number, number] {
  const z = a.zone;
  if (z?.rect) return [(z.rect[0] + z.rect[2] / 2) * TILE_SIZE, (z.rect[1] + z.rect[3] / 2) * TILE_SIZE];
  return z?.circle ? spotXY([z.circle[0], z.circle[1]]) : [0, 0];
}

/** 닿는 거리 안의 먹을 수 있는 버프 자리 번호 (없으면 -1) */
export function nearBuff(s: RunState, x: number, y: number): number {
  const at = s.pvp?.cap?.buffAt;
  return (arenaOf(s).buffs ?? []).findIndex((b, k) => {
    const [bx, by] = spotXY(b);
    return (at?.[k] ?? 0) <= s.tick && (bx - x) ** 2 + (by - y) ** 2 <= PW_CAP.buffReach ** 2;
  });
}

function grantBuff(s: RunState, k: number): void {
  const p = s.player;
  const b = PW_CAP.buff;
  capOf(s).buffAt[k] = s.tick + PW_CAP.buffBack;
  p.pwBuffs = [...(p.pwBuffs ?? []), { t: b.t, dmg: b.dmg, rate: b.rate, move: b.move, regen: b.regen }];
  addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 24 });
}

/** 자리마다 움직이기 전 (사람·AI 같음): 점프 중이면 날아감 · 점프대를 밟으면 뜀 · 버프 자리 버티기 */
export function capInput(s: RunState, input: TickInput): TickInput {
  if (!isCapture(s)) return input;
  const seat = s.pvp!.seats[seatNo(s)]!;
  const p = s.player;
  const a = arenaOf(s);
  const still: TickInput = { ...input, moveX: 0, moveY: 0, dash: false, attack: false, skill: 0 };
  if (seat.jump) {
    const j = seat.jump;
    const k = Math.min(1, ++j.t / PW_CAP.jumpTicks);
    p.x = j.fx + (j.tx - j.fx) * k;
    p.y = j.fy + (j.ty - j.fy) * k;
    if (k >= 1) {
      seat.jump = undefined;
      seat.landAt = s.tick;
      addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 12 });
    }
    return still;
  }
  const pad = s.tick - (seat.landAt ?? -1e9) > PW_CAP.jumpRest ? a.jumps?.find((j) => inRect(p.x, p.y, j.pad)) : undefined;
  if (pad) {
    const [tx, ty] = spotXY(pad.to);
    seat.jump = { fx: p.x, fy: p.y, tx, ty, t: 0 };
    seat.chan = undefined;
    return still;
  }
  const cap = capOf(s);
  if (seat.chan) {
    // 움직이거나 공격하면 끊김 · 그새 누가 먹었으면 끝
    if (input.moveX || input.moveY || input.dash || input.attack || input.skill || cap.buffAt[seat.chan.k]! > s.tick) seat.chan = undefined;
    else if (s.tick >= seat.chan.end) {
      grantBuff(s, seat.chan.k);
      seat.chan = undefined;
    }
    return input;
  }
  if (input.interact) {
    const k = nearBuff(s, p.x, p.y);
    if (k >= 0) seat.chan = { k, end: s.tick + PW_CAP.buffHold };
  }
  return input;
}

/** 틱마다 (모두 움직인 뒤): 낭떠러지에 선 사람은 떨어짐 · 구역 안에 한 편만 있으면 그 편 점령도가 오름 */
export function capTick(s: RunState): void {
  if (!isCapture(s) || s.pvp!.winner !== undefined || s.tick <= (s.pvp!.readyAt ?? 0)) return;
  const pv = s.pvp!;
  const a = arenaOf(s);
  const cap = capOf(s);
  const inside = new Set<number>();
  eachSeat(s, (i) => {
    const seat = pv.seats[i]!;
    const p = s.player;
    if (!inPlay(s, i) || seat.jump) return;
    if (a.cliffs?.some((c) => inRect(p.x, p.y, c))) {
      p.hp = 0;
      addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 10, maxTicks: 20 });
      return;
    }
    if (inCapZone(a, p.x, p.y)) inside.add(seat.team);
  });
  if (inside.size !== 1) return;
  const team = [...inside][0]!;
  cap.prog[team] = Math.min(100, (cap.prog[team] ?? 0) + 100 / (PW_CAP.fullSec * TICK_RATE));
}

/** 이긴 편: 100%가 된 편 · 시간이 다 되면 점령도가 높은 편 (같으면 -1 비김) · 아직이면 undefined */
export function capWinner(s: RunState): number | undefined {
  const cap = capOf(s);
  for (const [team, v] of Object.entries(cap.prog)) if (v >= 100) return Number(team);
  if (s.tick < roundEnd(s)) return undefined;
  const a = cap.prog[0] ?? 0;
  const b = cap.prog[1] ?? 0;
  return a === b ? -1 : a > b ? 0 : 1;
}

// ───────── AI ─────────

const grids = new Map<PwArenaId, TileGrid>();
const fields = new Map<string, Int16Array>();

/** AI 길 찾기 칸: 낭떠러지도 막힘으로 봄 */
function botGrid(id: PwArenaId): TileGrid {
  let g = grids.get(id);
  if (g) return g;
  const a = PW_ARENAS[id];
  g = pwGrid(id).slice();
  for (const [c0, r0, w, h] of a.cliffs ?? []) for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) g[r * a.cols + c] = TILE_PIT;
  grids.set(id, g);
  return g;
}

/** 낭떠러지에 둘러싸인 섬 안인지 (낭떠러지 전체를 감싸는 네모) */
function onIsland(a: PwArenaDef, x: number, y: number): boolean {
  const cl = a.cliffs ?? [];
  if (!cl.length) return true;
  const c0 = Math.min(...cl.map((c) => c[0]));
  const r0 = Math.min(...cl.map((c) => c[1]));
  const c1 = Math.max(...cl.map((c) => c[0] + c[2]));
  const r1 = Math.max(...cl.map((c) => c[1] + c[3]));
  return inRect(x, y, [c0, r0, c1 - c0, r1 - r0]);
}

/** 낭떠러지 쪽으로 걸어가려 하면 옆(안 되면 뒤)으로 비켜 걸음 (멈춰 서 있지 않게) */
function cliffGuard(s: RunState, input: TickInput): TickInput {
  const cl = arenaOf(s).cliffs;
  if (!cl || (!input.moveX && !input.moveY)) return input;
  const p = s.player;
  const fall = (mx: number, my: number) => cl.some((c) => inRect(p.x + (mx / 100) * 14, p.y + (my / 100) * 14, c));
  if (!fall(input.moveX, input.moveY)) return input;
  const side = seatNo(s) % 2 ? 1 : -1;
  const tries: [number, number][] = [[-input.moveY * side, input.moveX * side], [input.moveY * side, -input.moveX * side], [-input.moveX, -input.moveY]];
  const ok = tries.find(([mx, my]) => !fall(mx, my));
  return ok ? { ...input, moveX: ok[0], moveY: ok[1], dash: false } : { ...input, moveX: 0, moveY: 0, dash: false };
}

/** AI 입력 다듬기: 상대가 안 보이면 버프 자리(홀수 자리 AI)·구역으로 · 버프 자리 옆이면 가만히 F */
export function capSteer(s: RunState, input: TickInput): TickInput {
  if (!isCapture(s)) return input;
  const i = seatNo(s);
  const seat = s.pvp!.seats[i]!;
  const p = s.player;
  const a = arenaOf(s);
  if (seat.chan) return { ...input, moveX: 0, moveY: 0, attack: false };
  // 싸우는 중이어도 구역 밖이면 반은 구역 쪽으로 걸으며 싸움 (공격은 그대로)
  if (input.attack && (i % 2 === 1 || inCapZone(a, p.x, p.y))) return cliffGuard(s, input);
  if (nearBuff(s, p.x, p.y) >= 0) return { ...input, moveX: 0, moveY: 0, interact: true };
  let goal = capCenter(a);
  let toBuff = false;
  const cap = capOf(s);
  if (i % 2 === 1) {
    for (const [k, b] of (a.buffs ?? []).entries()) {
      const at = spotXY(b);
      if (cap.buffAt[k]! <= s.tick && (at[0] - p.x) ** 2 + (at[1] - p.y) ** 2 < 260 ** 2) [goal, toBuff] = [at, true];
    }
  }
  if (a.jumps && !onIsland(a, p.x, p.y) && !toBuff) {
    let best = Infinity;
    for (const j of a.jumps) {
      const at = spotXY([j.pad[0] + (j.pad[2] >> 1), j.pad[1]]);
      const d = (at[0] - p.x) ** 2 + (at[1] - p.y) ** 2;
      if (onIsland(a, ...spotXY(j.to)) && d < best) [best, goal] = [d, at];
    }
  } else if (inCapZone(a, p.x, p.y) && (goal[0] - p.x) ** 2 + (goal[1] - p.y) ** 2 < (3 * TILE_SIZE) ** 2) {
    return { ...input, moveX: 0, moveY: 0 };
  }
  const id = s.pvp!.arena;
  const key = `${id}:${Math.floor(goal[0] / TILE_SIZE)},${Math.floor(goal[1] / TILE_SIZE)}`;
  let field = fields.get(key);
  if (!field) fields.set(key, (field = distanceField(botGrid(id), goal[0], goal[1])));
  const dir = walkToward(botGrid(id), field, p, goal[0], goal[1]);
  return dir ? cliffGuard(s, { ...input, moveX: Math.round(dir[0] * 100), moveY: Math.round(dir[1] * 100) }) : input;
}
