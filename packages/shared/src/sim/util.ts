// 수치·도우미
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { ENEMIES, WEAPONS, type EnemyKind, type WeaponDef } from "../content";
import { pushOutOfTiles, shapeGrid, type TileGrid } from "./layout";
import { arenaGrid } from "./bossPrimeval";
import { swarmGrid } from "./swarmGrid";
import { pwGrid } from "./paewangGrid";
import { tabooUp } from "./taboo";
import { trialFoeHp } from "./trialFoes";
import type { Body, DotKind, EffectState, EnemyState, PlayerState, ProjectileState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  A: 0.9238795325112867,
  B: 0.3826834323650898,
  H: 0.7071067811865476,
};
export { R as UTIL_RULES };

// ───────── 수치 ─────────

export const PLAYER_RADIUS = 5;
export const DASH_TICKS = 9;
export const DASH_COOLDOWN = 45;
export const DASH_SPEED_MUL = 3.2;
export const HIT_INVULN_TICKS = 36;
/** 잠긴 문을 억지로 나갈 때 내는 체력 (최대 체력 비율) */
export const FLEE_COST = 0.2;
/** 출구 구멍 절반 폭 (픽셀) */
export const DOOR_HALF = 8;
/** 위쪽 벽 출구의 가로 가운데 (방 크기에 따라 바뀜, constants) */
export { EXIT_X } from "../constants";
export const KNOCKBACK = 4;
/** 가만히 서 있었다고 보는 틱 수 (0.5초): 숨 고르기·방패 자세·마력 과충전 */
export const STILL_TICKS = 30;
/** 결벽증: 맞은 뒤 빨라지는 틱 (3초) */
export const RUSH_TICKS = 180;

/** 벽 안쪽 범위 (지금 방 크기를 따름, constants) */
export { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";

// ───────── 도우미 ─────────

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** 지금 방의 칸 배열 (네모 방이면 null) */
export function roomGrid(s: RunState): TileGrid | null {
  if (s.arena) return arenaGrid(s.arena);
  // 패왕전·무한 모드 AI 대결: 경기장마다 벽·나무·물 (sim/paewangGrid)
  const pa = s.pvp?.arena ?? s.pw?.arena;
  if (pa) return pwGrid(pa);
  // 광야의 새벽: 맵마다 건물·바위·물웅덩이 (들판은 테두리만)
  if (s.swarm) return s.swarm.map && s.swarm.map !== "plains" ? swarmGrid(s.swarm.map) : null;
  const room = s.map.rooms[s.roomId];
  return room ? shapeGrid(room.shape) : null;
}

/** 방 벽 안으로, 방 안 벽·기둥·구덩이 밖으로 */
export function keepInRoom(b: Body, g: TileGrid | null = null): void {
  b.x = clamp(b.x, ROOM_MIN_X + b.r, ROOM_MAX_X - b.r);
  b.y = clamp(b.y, ROOM_MIN_Y + b.r, ROOM_MAX_Y - b.r);
  // 칸 배열의 테두리도 벽이라 밀어낸 뒤에도 방 밖으로 나가지 않음
  if (g) pushOutOfTiles(g, b);
}

/** 길이 1로 맞춤. 길이가 0이면 null */
export function normalize(x: number, y: number): [number, number] | null {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return null;
  return [x / len, y / len];
}

export function dist2(a: Pick<Body, "x" | "y">, b: Pick<Body, "x" | "y">): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function weaponOf(p: PlayerState): WeaponDef {
  return WEAPONS[p.weaponId];
}

/** 치명타 표시: 적이 맞은 틱(피해 숫자) · 판 전체 수(소리). 화면용이라 게임 결과에는 영향 없음 */
export function markCrit(s: RunState, e: EnemyState): void {
  e.critTick = s.tick;
  s.crits = (s.crits ?? 0) + 1;
}

/** 상태이상 피해 기록 (화면 피해 숫자 색용, 게임 결과에는 영향 없음) */
export function markDot(s: RunState, e: EnemyState, kind: DotKind, amount: number): void {
  if (amount <= 0) return;
  if (e.dotTick !== s.tick) {
    e.dotTick = s.tick;
    e.dotAmt = {};
  }
  e.dotAmt![kind] = (e.dotAmt![kind] ?? 0) + amount;
}

export function addEffect(s: RunState, e: Omit<EffectState, "ticks">): void {
  // 협동: 그때 꺼내 놓은 사람 자리 (그 사람 둘레·몸을 따라 그림)
  s.effects.push(s.party ? { seat: s.seat ?? 0, ...e, ticks: e.maxTicks } : { ...e, ticks: e.maxTicks });
}

/** 16방향 단위 벡터 (0 = 오른쪽, 시계 방향). 삼각함수 없이 고리 모양 탄을 만들기 위한 고정 값 */
export const DIR16: readonly (readonly [number, number])[] = [
  [1, 0], [R.A, R.B], [R.H, R.H], [R.B, R.A], [0, 1], [-R.B, R.A], [-R.H, R.H], [-R.A, R.B],
  [-1, 0], [-R.A, -R.B], [-R.H, -R.H], [-R.B, -R.A], [0, -1], [R.B, -R.A], [R.H, -R.H], [R.A, -R.B],
];

/** 적 탄 하나 */
export function enemyShot(s: RunState, x: number, y: number, dx: number, dy: number, speed: number, damage: number): ProjectileState {
  const pr: ProjectileState = {
    id: s.nextId++,
    fromPlayer: false,
    x,
    y,
    prevX: x,
    prevY: y,
    r: 3,
    // 금기: 빠른 탄
    vx: dx * speed * tabooUp(s, "bulletSpeed"),
    vy: dy * speed * tabooUp(s, "bulletSpeed"),
    damage,
    ticksLeft: 240,
  };
  s.projectiles.push(pr);
  return pr;
}

/** 적 하나 만들기 (체력 배율 적용) */
export function makeEnemy(s: RunState, kind: EnemyKind, x: number, y: number, hpMul: number, timer: number): EnemyState {
  const def = ENEMIES[kind];
  // 시련 점수만큼 적이 세짐 (sim/trialFoes)
  const hp = Math.round(def.hp * hpMul * trialFoeHp(s.player));
  return {
    id: s.nextId++,
    kind,
    x,
    y,
    prevX: x,
    prevY: y,
    r: def.radius,
    hp,
    maxHp: hp,
    timer,
    phase: "walk",
    dirX: 0,
    dirY: 0,
    hitFlash: 0,
    count: 0,
    noGold: false,
    ...(def.shield ? { shield: def.shield } : {}),
  };
}

/** 공격 방식 아이템(패시브)을 갖고 있는지 */
export function hasPerk(p: { passives: readonly string[] }, id: string): boolean {
  return p.passives.includes(id);
}

/**
 * 여러 발: 가운데 한 발 + 양옆으로 spread만큼씩 돌린 방향 (홀수 발).
 * 삼각함수 대신 정해 둔 cos·sin 값을 곱해 돌림 (기기마다 결과가 같게)
 */
export function shotDirs(x: number, y: number, shots: number, spread?: readonly [number, number]): [number, number][] {
  const out: [number, number][] = [[x, y]];
  if (shots <= 1 || !spread) return out;
  const [c, sn] = spread;
  let lx = x, ly = y, rx = x, ry = y;
  for (let i = 0; i < (shots - 1) / 2; i++) {
    [lx, ly] = [lx * c - ly * sn, lx * sn + ly * c];
    [rx, ry] = [rx * c + ry * sn, -rx * sn + ry * c];
    out.push([lx, ly], [rx, ry]);
  }
  return out;
}

/** 점과 선분(a→b) 사이 거리의 제곱 */
export function segDist2(e: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((e.x - a.x) * vx + (e.y - a.y) * vy) / len2));
  const dx = a.x + vx * t - e.x;
  const dy = a.y + vy * t - e.y;
  return dx * dx + dy * dy;
}
