// 라스트 보스 태초의 빛과 어둠 (공통): 상자 벽 6개가 놓인 큰 방 · 둘의 체력 합이 절반이 되면 더 많은 쪽만 남아 체력이 다 차고 패턴이 늘어남
// 플레이어에게 거는 것: 빛의 그물(방향키 5개를 맞게 눌러야 풀림, 틀리면 3초 못 움직임) · 어둠(유령에 닿을수록 짙어지고 5번이면 쓰러짐) · 다크 오라(방을 가로지르는 선)
import { ROOM_COLS, ROOM_ROWS } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { damagePlayer } from "./combat";
import { TILE_FLOOR, TILE_WALL, type TileGrid } from "./layout";
import type { EnemyState, RunState } from "./types";
import { depth } from "./hero";
import { addEffect, dist2, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { addShape } from "./hazards";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 상자 벽 수 (2×2칸) */
  BOXES: 6,
  /** 그물: 눌러야 하는 방향 수 · 틀리면 못 움직이는 틱 */
  NET_KEYS: 5,
  NET_STUN: 180,
  GHOST_TOUCH_WAIT: 60,
  /** 다크 오라 선 빠르기 · 굵기(반) */
  SWEEP_SPEED: 1.3,
  SWEEP_W: 8,
  /** 기억력: 선 수 · 하나씩 깔리는 간격 · 다 깔린 뒤 기다림 · 거꾸로 터지는 간격 · 굵기(반) */
  MEMORY_LINES: 6,
  MEMORY_SHOW: 24,
  MEMORY_HOLD: 30,
  MEMORY_FIRE: 22,
  MEMORY_W: 7,
};
export { R as BOSS_PRIMEVAL_RULES };

/** 어둠: 유령에 닿으면 짙어지는 틱 (5초) · 쓰러지는 횟수 · 같은 유령에 다시 닿기까지 */
export const DARK_TICKS = 300;
export const DARK_DEATH = 5;

const grids = new WeakMap<number[], TileGrid>();

/** 상자 벽 자리 (칸 [열, 행] 쌍을 펼친 목록) — 보스 시작 자리·플레이어 시작 자리·가운데 줄은 비움 */
export function makeArena(s: RunState): number[] {
  const rng = createRng(deriveSeed(s.seed, "arena", s.floor));
  const out: number[] = [];
  const mid = Math.floor(ROOM_COLS / 2);
  const midRow = Math.floor(ROOM_ROWS / 2);
  for (let tries = 0; tries < 200 && out.length < R.BOXES * 2; tries++) {
    const c = rng.int(2, ROOM_COLS - 4);
    const r = rng.int(2, ROOM_ROWS - 4);
    if (Math.abs(c - mid) <= 2 && (r <= 3 || r >= ROOM_ROWS - 5)) continue;
    // 보스를 잡으면 가운데에 계단이 생기니 가운데 둘레도 비워 둠
    if (c >= mid - 3 && c <= mid + 2 && r >= midRow - 3 && r <= midRow + 2) continue;
    let ok = true;
    for (let i = 0; i < out.length; i += 2) if (Math.abs(out[i]! - c) < 3 && Math.abs(out[i + 1]! - r) < 3) ok = false;
    if (ok) out.push(c, r);
  }
  return out;
}

/** 상자 벽이 놓인 칸 배열 (테두리는 벽) */
export function arenaGrid(boxes: number[]): TileGrid {
  const hit = grids.get(boxes);
  if (hit && hit.length === ROOM_COLS * ROOM_ROWS) return hit;
  const g = new Uint8Array(ROOM_COLS * ROOM_ROWS).fill(TILE_FLOOR);
  for (let row = 0; row < ROOM_ROWS; row++) {
    for (let col = 0; col < ROOM_COLS; col++) if (row === 0 || col === 0 || row === ROOM_ROWS - 1 || col === ROOM_COLS - 1) g[row * ROOM_COLS + col] = TILE_WALL;
  }
  for (let i = 0; i < boxes.length; i += 2) {
    for (const [dc, dr] of [[0, 0], [1, 0], [0, 1], [1, 1]] as const) g[(boxes[i + 1]! + dr) * ROOM_COLS + boxes[i]! + dc] = TILE_WALL;
  }
  grids.set(boxes, g);
  return g;
}

/** 빛·어둠 짝: 둘 다 살아 있으면 체력 합이 절반 아래일 때, 짝이 먼저 쓰러졌으면 바로 — 남은 쪽만 체력이 다 차고 강해짐 (step 2) */
export function primevalMerge(s: RunState, e: EnemyState): void {
  if (e.step === 2) return;
  const partner = s.enemies.find((o) => (o.kind === "plight" || o.kind === "pdark") && o !== e && o.hp > 0);
  if (partner && partner.step === 2) return;
  if (partner && e.hp + partner.hp > (e.maxHp + partner.maxHp) / 2) return;
  if (partner && partner.hp > e.hp) return;
  if (partner) s.enemies.splice(s.enemies.indexOf(partner), 1);
  e.step = 2;
  // 혼자 남은 쪽은 체력이 2배로 늘고 다 참
  e.maxHp *= 2;
  e.hp = e.maxHp;
  e.count = 0;
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 4, maxTicks: 30 });
}

/** 빛의 그물에 걸림: 눌러야 할 방향 5개 (0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽) */
export function netPlayer(s: RunState, id: number): void {
  const p = s.player;
  if ((p.netSeq?.length ?? 0) > 0 || (p.netStun ?? 0) > 0) return;
  const rng = createRng(deriveSeed(s.seed, "net", id));
  p.netSeq = Array.from({ length: R.NET_KEYS }, () => rng.int(0, 3));
  p.netLast = -1;
}

/** 이동 입력 → 방향 (가장 크게 민 쪽, 없으면 -1) */
export function dirOf(mx: number, my: number): number {
  if (Math.abs(mx) < 0.5 && Math.abs(my) < 0.5) return -1;
  return Math.abs(mx) > Math.abs(my) ? (mx > 0 ? 1 : 3) : my > 0 ? 2 : 0;
}

/** 틱마다 (플레이어 이동 전): 어둠이 옅어짐 · 그물·못 움직임 (그물에 걸려 있으면 이동 대신 방향 누르기, 새로 누른 방향만 셈) */
export function netMove(s: RunState, mx: number, my: number): [number, number] {
  const p = s.player;
  if ((p.darkTicks ?? 0) > 0 && --p.darkTicks! === 0) p.darkStacks = 0;
  if ((p.netStun ?? 0) > 0) {
    p.netStun = (p.netStun ?? 0) - 1;
    return [0, 0];
  }
  const seq = p.netSeq;
  if (!seq || seq.length === 0) return [mx, my];
  const d = dirOf(mx, my);
  if (d >= 0 && d !== p.netLast) {
    if (d === seq[0]) seq.shift();
    else {
      // 틀림: 그물은 풀리지만 3초 못 움직임
      p.netSeq = [];
      p.netStun = R.NET_STUN;
    }
  }
  p.netLast = d;
  return [0, 0];
}

/** 어둠의 유령: 천천히 아무 데나 떠돌고, 닿으면 어둠이 짙어짐 (5초 안에 5번이면 쓰러짐). 맞지 않음 */
export function updateGhost(s: RunState, e: EnemyState): void {
  const p = s.player;
  e.immune = true;
  if (e.timer-- <= 0) {
    const rng = createRng(deriveSeed(s.seed, "ghost", e.id, s.tick));
    e.dirX = rng.nextFloat() * 2 - 1;
    e.dirY = rng.nextFloat() * 2 - 1;
    e.timer = 90;
  }
  e.x += e.dirX * 0.4;
  e.y += e.dirY * 0.4;
  if ((e.aux ?? 0) > 0) e.aux = (e.aux ?? 0) - 1;
  const rr = e.r + p.r;
  if ((e.aux ?? 0) === 0 && dist2(e, p) < rr * rr && p.dashTicks === 0) {
    e.aux = R.GHOST_TOUCH_WAIT;
    p.darkStacks = (p.darkStacks ?? 0) + 1;
    p.darkTicks = DARK_TICKS;
    if (p.darkStacks >= DARK_DEATH) {
      p.hp = 0;
      p.invulnTicks = 0;
    }
  }
}

/** 틱마다: 다크 오라 선이 방을 가로질러 감 (대시 무적으로만 넘어갈 수 있음) */
export function primevalTick(s: RunState, e: EnemyState): void {
  const p = s.player;
  const keep: NonNullable<EnemyState["sweeps"]> = [];
  for (const sw of e.sweeps ?? []) {
    if (sw.wait > 0) {
      sw.wait--;
      keep.push(sw);
      continue;
    }
    sw.pos += sw.dir * R.SWEEP_SPEED;
    const at = sw.x ? p.x : p.y;
    if (Math.abs(at - sw.pos) < R.SWEEP_W + p.r) damagePlayer(s, e.kind === "pdark" ? 10 + 2 * depth(s) : 0);
    const end = sw.x ? (sw.dir > 0 ? ROOM_MAX_X : ROOM_MIN_X) : sw.dir > 0 ? ROOM_MAX_Y : ROOM_MIN_Y;
    if ((sw.dir > 0 && sw.pos < end) || (sw.dir < 0 && sw.pos > end)) keep.push(sw);
  }
  e.sweeps = keep;
}

/** 기억력: 흰 선이 방에 하나씩 차례로 깔리고, 다 깔리면 마지막 선부터 거꾸로 하나씩 터짐 (순서를 기억해 피함) */
export function memoryLines(s: RunState, e: EnemyState): void {
  const rng = createRng(deriveSeed(s.seed, "memory", e.id, e.count));
  const fireAt = R.MEMORY_LINES * R.MEMORY_SHOW + R.MEMORY_HOLD;
  for (let i = 0; i < R.MEMORY_LINES; i++) {
    const across = rng.nextFloat() < 0.5;
    const h = across
      ? { x: ROOM_MIN_X, y: rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10), toX: ROOM_MAX_X }
      : { x: rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10), y: ROOM_MIN_Y, toY: ROOM_MAX_Y };
    const shape = { ...h, toX: h.toX ?? h.x, toY: "toY" in h ? h.toY : h.y, radius: 0, damage: 12 + 2 * depth(s), width: R.MEMORY_W, fx: "memory" as const };
    addShape(s, fireAt + (R.MEMORY_LINES - 1 - i) * R.MEMORY_FIRE, shape, i * R.MEMORY_SHOW);
  }
}
