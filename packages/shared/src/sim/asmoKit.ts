// 아스모데우스의 화신체 공용 (sim/bossAsmo·bossAsmoLust·bossAsmoVoid·bossAsmoLord·asmoUlts)
// 불꽃 담(선, 막히고 닿으면 피해) · 결정 창 벽(원, 막힘) · 빨아들이기 · 두 빛의 바닥(체스판) · 욕망의 잔상 · 매혹의 눈
import { createRng, deriveSeed } from "../rng";
import type { AsmoWall } from "./asmoTypes";
import { envDamage, damagePlayer } from "./combat";
import { eachSeat, seatNo } from "./party";
import type { EnemyState, RunState } from "./types";
import { keepInRoom, roomGrid, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 불꽃 담: 굵기(반) · 닿으면 피해 · 피해 간격(틱) */
  WALL_W: 5,
  WALL_DMG: 4,
  WALL_EVERY: 20,
  /** 결정 창 벽 반경 */
  BLOCK_R: 10,
  /** 빨아들이기 힘 (틱마다, 걷기 1.3보다 약해서 계속 걸으면 버팀) */
  PULL: 0.85,
  /** 두 빛의 바닥: 칸 크기 · 색이 바뀌는 간격 · 바뀐 뒤 판정까지 · 피해 배율(hitDamage) */
  CHESS_CELL: 40,
  CHESS_GAP: 120,
  CHESS_HIT: 18,
  CHESS_MUL: 0.7,
  /** 욕망의 잔상: 따라오는 늦음(틱) · 닿는 거리 · 피해 · 피해 간격 */
  TRAIL_LAG: 90,
  TRAIL_R: 8,
  TRAIL_DMG: 8,
  TRAIL_EVERY: 30,
  /** 매혹: 끌려가는 틱 · 보스 쪽으로 움직였다고 보는 빠르기 */
  CHARM: 120,
  CHARM_MOVE: 0.2,
};
export { R as BOSS_ASMO_KIT_RULES };

/** 화신체 (방에 있으면) */
export const asmoBoss = (s: RunState) => s.enemies.find((o) => o.kind === "asmodeus" && o.hp > 0);

/** 선분 위 가장 가까운 점까지 */
function nearOnSeg(px: number, py: number, w: AsmoWall): [number, number] {
  const vx = w[2] - w[0];
  const vy = w[3] - w[1];
  const t = Math.max(0, Math.min(1, ((px - w[0]) * vx + (py - w[1]) * vy) / (vx * vx + vy * vy || 1)));
  return [w[0] + vx * t, w[1] + vy * t];
}

/** 불꽃 담 하나 (from틱에 생겨 ticks 동안) */
export function addWall(s: RunState, e: EnemyState, x: number, y: number, tx: number, ty: number, from: number, ticks: number): void {
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  (e.amWalls ??= []).push([clamp(x, ROOM_MIN_X, ROOM_MAX_X), clamp(y, ROOM_MIN_Y, ROOM_MAX_Y), clamp(tx, ROOM_MIN_X, ROOM_MAX_X), clamp(ty, ROOM_MIN_Y, ROOM_MAX_Y), s.tick + from, s.tick + from + ticks]);
}

/** 결정 창 벽 하나 */
export const addBlock = (s: RunState, e: EnemyState, x: number, y: number, ticks: number) => (e.amBlocks ??= []).push([Math.round(x), Math.round(y), s.tick + ticks]);

/** 틱마다: 담·벽이 사람을 밀어냄 (담은 닿으면 피해) */
export function wallTick(s: RunState, e: EnemyState): void {
  e.amWalls = (e.amWalls ?? []).filter((w) => w[5] > s.tick);
  e.amBlocks = (e.amBlocks ?? []).filter((b) => b[2] > s.tick);
  eachSeat(
    s,
    () => {
      const p = s.player;
      for (const w of e.amWalls!) {
        if (s.tick < w[4]) continue;
        const [nx, ny] = nearOnSeg(p.x, p.y, w);
        if (push(p, nx, ny, R.WALL_W + p.r) && (s.tick - w[4]) % R.WALL_EVERY === 0) envDamage(s, R.WALL_DMG);
      }
      for (const b of e.amBlocks!) push(p, b[0], b[1], R.BLOCK_R + p.r);
      keepInRoom(p, roomGrid(s));
    },
    true,
  );
}

/** 점 (x, y)에서 반경 d 밖으로 밀어냄 (밀었으면 true) */
function push(p: RunState["player"], x: number, y: number, d: number): boolean {
  const dx = p.x - x;
  const dy = p.y - y;
  const l = Math.hypot(dx, dy);
  if (l >= d) return false;
  const k = l < 0.01 ? [p.x - p.prevX || 1, p.y - p.prevY] : [dx / l, dy / l];
  const n = Math.hypot(k[0]!, k[1]!) || 1;
  p.x = x + (k[0]! / n) * d;
  p.y = y + (k[1]! / n) * d;
  return true;
}

/** 반경 r 안의 불꽃 담을 지움 (욕망의 구슬이 터지면) */
export function clearWalls(e: EnemyState, x: number, y: number, r: number): void {
  e.amWalls = (e.amWalls ?? []).filter((w) => {
    const [nx, ny] = nearOnSeg(x, y, w);
    return Math.hypot(nx - x, ny - y) > r;
  });
}

/** (x, y)로 빨아들임 (대시 중이면 버팀) */
export function pullTo(s: RunState, x: number, y: number, k = R.PULL): void {
  eachSeat(
    s,
    () => {
      const p = s.player;
      const d = Math.hypot(x - p.x, y - p.y);
      if (p.dashTicks > 0 || d < 2) return;
      p.x += ((x - p.x) / d) * Math.min(d, k);
      p.y += ((y - p.y) / d) * Math.min(d, k);
    },
    true,
  );
}

/** 두 빛의 바닥 시작 */
export function startChess(s: RunState, e: EnemyState, ticks: number, gap = R.CHESS_GAP): void {
  e.amChessAt = s.tick;
  e.amChessEnd = s.tick + ticks;
  e.amChessGap = gap;
}

/** 지금 안전한 색 (0 보라 · 1 분홍, 보스 머리 불꽃 색) */
export const chessSafe = (s: RunState, e: EnemyState) => Math.floor((s.tick - (e.amChessAt ?? 0)) / (e.amChessGap ?? R.CHESS_GAP)) % 2;
/** 이 자리 칸 색 */
export const chessColor = (x: number, y: number) => (Math.floor((x - ROOM_MIN_X) / R.CHESS_CELL) + Math.floor((y - ROOM_MIN_Y) / R.CHESS_CELL)) % 2;
export const chessOn = (s: RunState, e: EnemyState) => e.amChessEnd !== undefined && s.tick < e.amChessEnd;

/** 틱마다: 색이 바뀐 뒤 CHESS_HIT틱에 다른 색 칸 위 사람이 맞음 */
export function chessTick(s: RunState, e: EnemyState, dmg: number): void {
  if (!chessOn(s, e)) return;
  const t = s.tick - e.amChessAt!;
  if (t % (e.amChessGap ?? R.CHESS_GAP) !== R.CHESS_HIT) return;
  const safe = chessSafe(s, e);
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (chessColor(p.x, p.y) !== safe) damagePlayer(s, dmg * R.CHESS_MUL, "asmodeus");
    },
    true,
  );
}

/** 욕망의 잔상 시작 · 지금 잔상 자리 (없으면 null) */
export function startTrail(s: RunState, e: EnemyState, ticks: number): void {
  e.amTrailEnd = s.tick + ticks;
  e.amTrail = [];
}
export function trailAt(e: EnemyState, seat: number): [number, number] | null {
  const t = e.amTrail?.[seat];
  if (!t || t.length < R.TRAIL_LAG * 2) return null;
  return [t[0]!, t[1]!];
}

/** 틱마다: 지난 자리를 기록하고, 잔상에 닿으면 피해 */
export function trailTick(s: RunState, e: EnemyState): void {
  if (e.amTrailEnd === undefined) return;
  if (s.tick >= e.amTrailEnd) {
    e.amTrailEnd = e.amTrail = undefined;
    return;
  }
  eachSeat(
    s,
    () => {
      const p = s.player;
      const seat = seatNo(s);
      const t = ((e.amTrail ??= [])[seat] ??= []);
      t.push(Math.round(p.x), Math.round(p.y));
      if (t.length > R.TRAIL_LAG * 2) t.splice(0, 2);
      const g = trailAt(e, seat);
      if (g && Math.hypot(g[0] - p.x, g[1] - p.y) < R.TRAIL_R + p.r && s.tick % R.TRAIL_EVERY === 0) envDamage(s, R.TRAIL_DMG);
    },
    true,
  );
}

/** 매혹 판정: 그 순간 보스 쪽으로 움직이던 사람은 보스에게 끌려 걸어감 (공격은 됨) */
export function charmCheck(s: RunState, e: EnemyState): void {
  eachSeat(
    s,
    () => {
      const p = s.player;
      const mx = p.x - p.prevX;
      const my = p.y - p.prevY;
      const d = Math.hypot(e.x - p.x, e.y - p.y) || 1;
      if (p.dashTicks > 0 || ((mx * (e.x - p.x)) + my * (e.y - p.y)) / d < R.CHARM_MOVE) return;
      p.lureTicks = R.CHARM;
      p.lureId = e.id;
    },
    true,
  );
}

/** 방 안 무작위 자리 (가장자리 margin 떼고) */
export function roomSpot(s: RunState, salt: string, n: number, margin = 30): [number, number] {
  const rng = createRng(deriveSeed(s.seed, salt, s.tick, n));
  return [rng.int(ROOM_MIN_X + margin, ROOM_MAX_X - margin), rng.int(ROOM_MIN_Y + margin, ROOM_MAX_Y - margin)];
}
