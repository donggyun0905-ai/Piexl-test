// 켈베로스 공용 (sim/bossCerberus·bossCerbTrio): 기둥 방 · 용암 지대(밟으면 데임 · 분출) · 지옥불 브레스(기둥 뒤만 안전) · 무너지는 바닥 · 시간차 탄
import { ROOM_COLS, ROOM_ROWS, TILE_SIZE } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { throughDash } from "./bossGrip";
import { damagePlayer, envDamage } from "./combat";
import { arenaGrid, makeArena } from "./bossPrimeval";
import { wallBetween } from "./layout";
import { eachSeat, seatNo } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 용암 지대: 밟고 있으면 피해 · 간격(틱) */
  LAVA_DMG: 6,
  LAVA_EVERY: 30,
  /** 용암 분출: 부풀어 오르는 예고 틱 · 지옥불 기둥이 남는 틱 · 기둥 피해 · 간격 · 지대마다 탄 고리 간격 · 탄 빠르기 */
  SWELL: 90,
  ERUPT: 180,
  ERUPT_DMG: 16,
  ERUPT_EVERY: 20,
  RING_GAP: 24,
  RING_SPEED: 1.25,
  /** 분출 탄 크기(반지름) · 피해 */
  RING_R: 6,
  RING_DMG: 13,
  /** 지옥불 브레스: 머리 빛이 깜박이는 예고 틱 · 뿜는 틱 · 기둥 그림자 밖이면 최대 체력의 몇 % 피해 (대시로 못 피함) */
  BREATH_WARN: 120,
  BREATH_TICKS: 90,
  BREATH_HP: 0.35,
  /** 무너지는 바닥: 금이 가는 예고 틱 · 한 번에 무너지는 구역 수 · 무리 사이 틱 · 다 무너진 뒤 버티는 틱 · 떨어지면 피해 */
  CRACK: 60,
  FLOOR_WAVE: 4,
  FLOOR_GAP: 55,
  FLOOR_HOLD: 600,
  FALL_DMG: 20,
};
export { R as BOSS_CERB_KIT_RULES };

/** 무너지는 바닥 구역 (가로 · 세로) */
export const FLOOR_COLS = 6;
export const FLOOR_ROWS = 4;

/** 기둥 6개 (2×2칸 왼쪽 위 [열, 행], 29×17칸 방): 가운데 줄 둘 · 양옆 위아래 넷 · 가운데(계단)·켈베로스 앞·시작 자리는 비움 */
const PILLARS = [5, 5, 22, 5, 9, 8, 18, 8, 5, 11, 22, 11];
/** 용암 지대 두 가지 (시드로 하나) [열, 행, 너비, 높이] */
const LAVA_SETS = [
  [2, 8, 2, 2, 25, 8, 2, 2, 8, 11, 3, 1, 18, 11, 3, 1, 6, 3, 3, 1, 20, 3, 3, 1, 2, 13, 2, 2, 25, 13, 2, 2],
  [3, 7, 2, 1, 24, 7, 2, 1, 8, 4, 1, 3, 20, 4, 1, 3, 2, 11, 2, 3, 25, 11, 2, 3, 9, 13, 3, 1, 17, 13, 3, 1],
];

/** 켈베로스 방 기둥 (s.arena, 칸 배열은 bossPrimeval.arenaGrid). 방 크기가 다르면 가운데에 맞춤 */
export function cerbArena(): number[] {
  const shift = Math.floor((ROOM_COLS - 29) / 2);
  return PILLARS.map((v, i) => (i % 2 === 0 ? v + shift : v));
}

/** 라스트 보스 연습장 방: 태초의 빛과 어둠은 상자 벽 · 켈베로스는 기둥 · 나머지는 빈 방 */
export const lastArena = (s: RunState, kind: string): number[] | undefined => (kind === "plight" || kind === "pdark" ? makeArena(s) : kind === "cerberus" ? cerbArena() : undefined);

/** 용암 지대 고르기 (시드) */
export function cerbLavaSet(s: RunState): number[] {
  const shift = Math.floor((ROOM_COLS - 29) / 2);
  return LAVA_SETS[createRng(deriveSeed(s.seed, "cerbLava", s.floor)).int(0, LAVA_SETS.length - 1)]!.map((v, i) => (i % 4 === 0 ? v + shift : v));
}

/** (x, y)가 용암 지대 안인지 */
export function inLava(lava: readonly number[], x: number, y: number): boolean {
  for (let i = 0; i < lava.length; i += 4) {
    const l = lava[i]! * TILE_SIZE;
    const t = lava[i + 1]! * TILE_SIZE;
    if (x >= l && x < l + lava[i + 2]! * TILE_SIZE && y >= t && y < t + lava[i + 3]! * TILE_SIZE) return true;
  }
  return false;
}

/** 용암 지대가 분출 중인지 · 부풀어 오르는 중인지 */
export const erupting = (s: RunState, e: EnemyState) => e.cbErupt !== undefined && s.tick >= e.cbErupt - R.ERUPT && s.tick < e.cbErupt;
export const swelling = (s: RunState, e: EnemyState) => e.cbSwell !== undefined && s.tick >= e.cbSwell && s.tick < e.cbSwell + R.SWELL;

/** 용암 분출 시작 (부풀어 오름 → 터짐). rings = 지대마다 탄 고리 수 */
export function startErupt(s: RunState, e: EnemyState): void {
  e.cbSwell = s.tick;
  e.cbErupt = s.tick + R.SWELL + R.ERUPT;
  e.cbErupts = (e.cbErupts ?? 0) + 1;
}

/** 틱마다: 용암 지대 피해 · 분출(지옥불 기둥 + 지대마다 탄 고리) */
export function lavaTick(s: RunState, e: EnemyState): void {
  const lava = e.cbLava;
  if (!lava) return;
  const hot = erupting(s, e);
  if (s.tick % (hot ? R.ERUPT_EVERY : R.LAVA_EVERY) === 0)
    eachSeat(
      s,
      () => {
        const p = s.player;
        if (p.dashTicks > 0 || !inLava(lava, p.x, p.y)) return;
        if (hot) damagePlayer(s, R.ERUPT_DMG, "cerbflame");
        else envDamage(s, R.LAVA_DMG);
      },
      true,
    );
  if (!hot || e.cbSwell === undefined) return;
  // 터진 뒤 RING_GAP마다 탄 고리 (두 번째 분출부터 세 겹, 두 번째 고리는 반 칸 엇갈림)
  const since = s.tick - (e.cbSwell + R.SWELL);
  const rings = (e.cbErupts ?? 1) >= 2 ? 3 : 2;
  if (since % R.RING_GAP !== 0 || since / R.RING_GAP >= rings) return;
  const k = since / R.RING_GAP;
  for (let i = 0; i < lava.length; i += 4) {
    const x = (lava[i]! + lava[i + 2]! / 2) * TILE_SIZE;
    const y = (lava[i + 1]! + lava[i + 3]! / 2) * TILE_SIZE;
    for (let d = k % 2; d < 16; d += 2) {
      const v = DIR16[d]!;
      Object.assign(enemyShot(s, x, y, v[0], v[1], R.RING_SPEED, R.RING_DMG), { from: "cerberus", look: "fire", r: R.RING_R });
    }
  }
  if (k === 0) for (let i = 0; i < lava.length; i += 4) addEffect(s, { kind: "burst", x: (lava[i]! + lava[i + 2]! / 2) * TILE_SIZE, y: (lava[i + 1]! + lava[i + 3]! / 2) * TILE_SIZE, dirX: 0, dirY: 0, size: 18, maxTicks: 20, foe: true });
}

/** 두 번째 분출 뒤: 용암 지대가 한 칸씩 넓어짐 (방 안까지만) */
export function growLava(e: EnemyState): void {
  const lava = e.cbLava;
  if (!lava) return;
  for (let i = 0; i < lava.length; i += 4) {
    lava[i] = Math.max(1, lava[i]! - 1);
    lava[i + 2] = Math.min(ROOM_COLS - 1 - lava[i]!, lava[i + 2]! + 2);
    lava[i + 1] = Math.max(1, lava[i + 1]! - 1);
    lava[i + 3] = Math.min(ROOM_ROWS - 1 - lava[i + 1]!, lava[i + 3]! + 2);
  }
}

/** 보스 머리(hx, hy)에서 플레이어가 보이는지 (기둥·벽이 가리면 false) */
export function exposed(s: RunState, hx: number, hy: number): boolean {
  if (!s.arena) return true;
  return !wallBetween(arenaGrid(s.arena), hx, hy, s.player.x, s.player.y);
}

/** 지옥불 브레스 예고 시작 */
export function startBreath(s: RunState, e: EnemyState): void {
  e.cbBreathWarn = s.tick;
  e.cbBreath = s.tick + R.BREATH_WARN;
  e.cbBurned = [];
}

/** 브레스를 뿜는 중인지 */
export const breathing = (s: RunState, e: EnemyState) => e.cbBreath !== undefined && s.tick >= e.cbBreath && s.tick < e.cbBreath + R.BREATH_TICKS;
/** 브레스 예고 중이거나 뿜는 중 */
export const breathBusy = (s: RunState, e: EnemyState) => e.cbBreathWarn !== undefined && s.tick >= e.cbBreathWarn && s.tick < (e.cbBreath ?? 0) + R.BREATH_TICKS;

/** 틱마다: 브레스 중 기둥 그림자 밖이면 한 번 큰 피해 (대시로 못 피함) */
export function breathTick(s: RunState, e: EnemyState, hx: number, hy: number): void {
  if (!breathing(s, e)) return;
  eachSeat(
    s,
    () => {
      const seat = seatNo(s);
      if ((e.cbBurned ??= []).includes(seat) || !exposed(s, hx, hy)) return;
      e.cbBurned.push(seat);
      throughDash(s, () => damagePlayer(s, s.player.stats.maxHp * R.BREATH_HP, "cerbflame"));
    },
    true,
  );
}

/** 무너지는 바닥 구역 i의 [왼, 위, 오른, 아래] */
export function cellRect(i: number): [number, number, number, number] {
  const w = (ROOM_MAX_X - ROOM_MIN_X) / FLOOR_COLS;
  const h = (ROOM_MAX_Y - ROOM_MIN_Y) / FLOOR_ROWS;
  const c = i % FLOOR_COLS;
  const r = Math.floor(i / FLOOR_COLS);
  return [ROOM_MIN_X + c * w, ROOM_MIN_Y + r * h, ROOM_MIN_X + (c + 1) * w, ROOM_MIN_Y + (r + 1) * h];
}

const cellOf = (x: number, y: number) => {
  const c = Math.min(FLOOR_COLS - 1, Math.max(0, Math.floor(((x - ROOM_MIN_X) / (ROOM_MAX_X - ROOM_MIN_X)) * FLOOR_COLS)));
  const r = Math.min(FLOOR_ROWS - 1, Math.max(0, Math.floor(((y - ROOM_MIN_Y) / (ROOM_MAX_Y - ROOM_MIN_Y)) * FLOOR_ROWS)));
  return r * FLOOR_COLS + c;
};

/** 구역에 기둥이 걸리는지 */
function hasPillar(s: RunState, i: number): boolean {
  const [l, t, r, b] = cellRect(i);
  const a = s.arena ?? [];
  for (let k = 0; k < a.length; k += 2) {
    const x = a[k]! * TILE_SIZE;
    const y = a[k + 1]! * TILE_SIZE;
    if (x < r && x + TILE_SIZE * 2 > l && y < b && y + TILE_SIZE * 2 > t) return true;
  }
  return false;
}

/** 무너지는 바닥 시작 (start틱 뒤부터 금이 감): 기둥 없는 구역 하나만 남김 */
export function startFloor(s: RunState, e: EnemyState, start: number): void {
  const rng = createRng(deriveSeed(s.seed, "cerbFloor", s.floor, e.cbBig ?? 0));
  const all = Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, (_, i) => i);
  const open = all.filter((i) => !hasPillar(s, i));
  const safe = open[rng.int(0, open.length - 1)]!;
  const order = all.filter((i) => i !== safe);
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const at = s.tick + start;
  const waves = Math.ceil(order.length / R.FLOOR_WAVE);
  e.cbFloor = { order, safe, at, end: at + R.CRACK + (waves - 1) * R.FLOOR_GAP + R.FLOOR_HOLD };
}

/** 구역 i가 무너지는 틱 (남는 구역은 무한) */
export function fallTick(e: EnemyState, i: number): number {
  const f = e.cbFloor;
  if (!f) return Infinity;
  const k = f.order.indexOf(i);
  return k < 0 ? Infinity : f.at + R.CRACK + Math.floor(k / R.FLOOR_WAVE) * R.FLOOR_GAP;
}

/** 무너지는 바닥이 진행 중인지 (모이는 시간 포함) */
export const floorBusy = (s: RunState, e: EnemyState | undefined) => !!e?.cbFloor && s.tick < e.cbFloor.end;
/** 다 무너지고 버티는 중인지 */
export const floorHold = (s: RunState, e: EnemyState) => !!e.cbFloor && s.tick >= e.cbFloor.end - R.FLOOR_HOLD && s.tick < e.cbFloor.end;

/** 틱마다: 무너진 구역에 서 있으면 떨어짐 (피해 + 남은 구역 가운데로, 대시 중이면 넘어감) */
export function floorTick(s: RunState, e: EnemyState): void {
  const f = e.cbFloor;
  if (!f) return;
  if (s.tick >= f.end) {
    delete e.cbFloor;
    return;
  }
  const [l, t, r, b] = cellRect(f.safe);
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (p.dashTicks > 0 || s.tick < fallTick(e, cellOf(p.x, p.y))) return;
      throughDash(s, () => damagePlayer(s, R.FALL_DMG, "cerberus"));
      p.x = p.prevX = (l + r) / 2;
      p.y = p.prevY = (t + b) / 2;
      p.invulnTicks = Math.max(p.invulnTicks, 60);
      addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 16 });
    },
    true,
  );
}

/** 가장 가까운 사람 쪽 방향 (협동이면 그때 가장 가까운 자리) */
export function aimAt(s: RunState, x: number, y: number): [number, number] {
  return normalize(s.player.x - x, s.player.y - y) ?? [0, 1];
}

/** 페이즈 2 지휘자 (켈베로스, 세 사람이 찾음) */
export const cerbDirector = (s: RunState) => s.enemies.find((o) => o.kind === "cerberus" && o.hp > 0);
