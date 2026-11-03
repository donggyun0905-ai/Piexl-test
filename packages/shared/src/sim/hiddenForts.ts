// 숨은 시련 3 공성전 · 4 안개숲
// 공성전: 성벽 두 줄(보스만 한 체력, 닿아도 안 아픔·못 넘어감). 맨 위 스켈레톤 궁병 · 두 벽 사이 포격수 · 아래 방패 가디언.
//   아래 벽을 부수면 포격수, 위 벽을 부수면 궁병이 무너짐. 궁병이 남아 있는 동안 양옆 벽에서 폭발풍뎅이가 계속 나옴
// 안개숲: 들어온 자리·살포기 둘레 말고는 독가스. 베놈은 독가스가 있는 동안 계속 다시 나옴, 탄 쏘는 적은 독가스 안에서 숨어(안 맞음) 쏨.
//   살포기(1~2대, 보스만 한 체력)를 모두 부수면 3초 뒤 독가스가 걷힘
import { ROOM_CX, ROOM_CY, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { TERRAIN } from "../terrainDefs";
import { depth } from "./hero";
import { fortTick, hNote, hSpawn, makeFort, wipe } from "./hiddenKit";
import type { HiddenTrialState } from "./hiddenTrialTypes";
import { statusImmune } from "./remnant";
import { spot } from "./trialRun";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 공성전: 성벽 하나 체력(그 층 보스 체력 배율) · 아래 벽·위 벽 높이(방 위 끝에서) · 조각 반경 · 조각 간격 */
  WALL_HP: 1,
  WALL_LOW: 66,
  WALL_HIGH: 30,
  WALL_R: 10,
  WALL_GAP: 18,
  /** 스켈레톤 궁병 · 포격수 · 방패 가디언 수 (깊이 셋마다 하나씩 더) */
  ARCHERS: 5,
  MORTARS: 4,
  GUARDS: 4,
  /** 폭발풍뎅이: 양옆 벽에서 나오는 간격(틱) · 한꺼번에 최대 */
  BUG_EVERY: 120,
  BUG_MAX: 6,
  /** 안개숲: 살포기 체력(그 층 보스 체력 배율, 두 대면 √2로 나눔) · 살포기 반경 · 살포기 둘레 맑은 자리 · 들어온 자리 맑은 반경 */
  SPRAY_HP: 1,
  SPRAY_R: 9,
  SPRAY_POCKET: 20,
  ENTRY_POCKET: 30,
  /** 베놈 수(독가스가 있는 동안 다시 나옴) · 다시 나오는 간격(틱) · 탄 쏘는 적 수 · 살포기를 다 부순 뒤 독가스가 걷히는 틱(3초) */
  VENOMS: 6,
  VENOM_EVERY: 90,
  SPITTERS: 5,
  GAS_FADE: 180,
};
export { R as HIDDEN_FORT_RULES };

/** 한 줄 성벽 조각 자리 */
function row(y: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = ROOM_MIN_X + R.WALL_R; x <= ROOM_MAX_X - R.WALL_R; x += R.WALL_GAP) pts.push([x, y]);
  return pts;
}

/** 줄로 늘어선 적 (immune: 벽 뒤라 안 맞음) */
function line(s: RunState, kind: "skelarcher" | "mortar", n: number, y: number, into: EnemyState[]): void {
  for (let i = 0; i < n; i++) hSpawn(s, kind, ROOM_MIN_X + 20 + ((ROOM_MAX_X - ROOM_MIN_X - 40) * (i + 0.5)) / n, y, 1, into).immune = true;
}

export function startSiege(s: RunState, h: HiddenTrialState, into: EnemyState[]): void {
  const low = ROOM_MIN_Y + R.WALL_LOW;
  const high = ROOM_MIN_Y + R.WALL_HIGH;
  h.forts = [makeFort(s, "wall", row(low), R.WALL_R, R.WALL_HP, into), makeFort(s, "wall", row(high), R.WALL_R, R.WALL_HP, into)];
  const extra = Math.floor(depth(s) / 3);
  line(s, "skelarcher", R.ARCHERS + extra, ROOM_MIN_Y + 10, into);
  line(s, "mortar", R.MORTARS + extra, (low + high) / 2, into);
  const rng = createRng(deriveSeed(s.seed, "hiddenSiege", s.floor));
  for (let i = 0; i < R.GUARDS + extra; i++) hSpawn(s, "guardian", rng.int(ROOM_MIN_X + 20, ROOM_MAX_X - 20), rng.int(low + 30, ROOM_MAX_Y - 50), 1, into);
}

/** 공성전 틱: 벽이 남아 있으면 true */
export function siegeTick(s: RunState, h: HiddenTrialState): boolean {
  const [low, high] = h.forts as [NonNullable<HiddenTrialState["forts"]>[0], NonNullable<HiddenTrialState["forts"]>[0]];
  if (fortTick(s, low)) {
    wipe(s, "mortar");
    hNote(s, h, "wall1");
  }
  if (fortTick(s, high)) {
    wipe(s, "skelarcher");
    hNote(s, h, "wall2");
  }
  const ly = low.xy[0]![1];
  const hy = high.xy[0]![1];
  // 서 있는 가장 아래 벽 밑으로만 다님 (사람·아래쪽 적)
  const top = !low.down ? ly : !high.down ? hy : null;
  const p = s.player;
  if (top !== null) {
    p.y = Math.max(p.y, top + R.WALL_R + p.r);
    for (const e of s.enemies) if (!e.immune && e.kind !== "fort") e.y = Math.max(e.y, top + R.WALL_R + e.r);
  }
  // 벽 뒤 적은 자기 줄에
  for (const e of s.enemies) {
    if (e.kind === "skelarcher" && e.immune) e.y = Math.min(Math.max(e.y, ROOM_MIN_Y + e.r), hy - R.WALL_R - e.r);
    if (e.kind === "mortar" && e.immune) e.y = Math.min(Math.max(e.y, hy + R.WALL_R + e.r), ly - R.WALL_R - e.r);
  }
  // 궁병이 남아 있으면 양옆 벽에서 폭발풍뎅이
  if (!high.down && (s.tick - h.at) % R.BUG_EVERY === R.BUG_EVERY - 1 && s.enemies.filter((e) => e.kind === "bombbug").length < R.BUG_MAX) {
    const rng = createRng(deriveSeed(s.seed, "hiddenBug", s.tick));
    const y0 = (top ?? ROOM_MIN_Y) + R.WALL_R + 12;
    hSpawn(s, "bombbug", ROOM_MIN_X + 8, rng.int(y0, ROOM_MAX_Y - 16), 1, s.enemies);
    hSpawn(s, "bombbug", ROOM_MAX_X - 8, rng.int(y0, ROOM_MAX_Y - 16), 1, s.enemies);
  }
  return !low.down || !high.down;
}

/** 독가스가 없는 자리인지 */
export const inPocket = (h: HiddenTrialState, x: number, y: number) => (h.pockets ?? []).some(([px, py, r]) => (x - px) ** 2 + (y - py) ** 2 < r * r);
/** 안개숲 독가스가 깔려 있는지 */
export const fogOn = (s: RunState, h: HiddenTrialState) => h.kind === 4 && (h.gasOff === undefined || s.tick < h.gasOff);

export function startFog(s: RunState, h: HiddenTrialState, into: EnemyState[]): void {
  const rng = createRng(deriveSeed(s.seed, "hiddenFog", s.floor));
  const n = rng.int(1, 2);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? rng.int(ROOM_MIN_X + 40, ROOM_MAX_X - 40) : i === 0 ? rng.int(ROOM_MIN_X + 30, ROOM_CX - 30) : rng.int(ROOM_CX + 30, ROOM_MAX_X - 30);
    pts.push([x, rng.int(ROOM_MIN_Y + 24, ROOM_CY - 10)]);
  }
  h.forts = pts.map((pt) => makeFort(s, "sprayer", [pt], R.SPRAY_R, R.SPRAY_HP / Math.sqrt(n), into));
  h.pockets = [[s.player.x, s.player.y, R.ENTRY_POCKET], ...pts.map(([x, y]): [number, number, number] => [x, y, R.SPRAY_POCKET])];
  for (let i = 0; i < R.VENOMS; i++) hSpawn(s, "venom", ...spot(s, rng, ENEMIES.venom.radius), 1, into);
  for (let i = 0; i < R.SPITTERS + Math.floor(depth(s) / 3); i++) hSpawn(s, "spitter", ...spot(s, rng, ENEMIES.spitter.radius), 1, into);
}

/** 안개숲 틱: 독가스가 있으면 true */
export function fogTick(s: RunState, h: HiddenTrialState): boolean {
  for (const f of h.forts ?? []) fortTick(s, f);
  if (h.gasOff === undefined && (h.forts ?? []).every((f) => f.down)) {
    h.gasOff = s.tick + R.GAS_FADE;
    hNote(s, h, "spray");
  }
  const gas = fogOn(s, h);
  if (!gas && h.note?.code === "spray") hNote(s, h, "gasOff");
  // 탄 쏘는 적: 독가스 안에서는 숨어서 안 맞음
  for (const e of s.enemies) if (e.kind === "spitter") e.immune = gas && !inPocket(h, e.x, e.y);
  if (!gas) return false;
  const p = s.player;
  if (!inPocket(h, p.x, p.y)) {
    p.corrode = TERRAIN.corrodeTicks;
    if (!statusImmune(p)) p.poison = Math.max(p.poison ?? 0, TERRAIN.poisonTicks);
  }
  if ((s.tick - h.at) % R.VENOM_EVERY === R.VENOM_EVERY - 1 && s.enemies.filter((e) => e.kind === "venom").length < R.VENOMS) {
    hSpawn(s, "venom", ...spot(s, createRng(deriveSeed(s.seed, "hiddenVenom", s.tick)), ENEMIES.venom.radius), 1, s.enemies);
  }
  return true;
}
