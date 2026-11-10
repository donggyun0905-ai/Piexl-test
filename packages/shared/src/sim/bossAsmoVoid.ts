// 아스모데우스의 화신체 75~51줄: 검은 해의 화신 (날개·블랙홀, 방 위쪽에 떠서 조금씩 옮겨 다님)
// 기본 공격: 3초 빨아들이고 내려찍기 · 블랙홀을 놓고 하나씩 터뜨림 (범위 + 탄막)
// 패턴 1 단 하나의 빈자리 (방 전체 공격, 빈자리만 안전) · 2 굶주린 미니 블랙홀 (내 공격을 먹고 먹은 만큼 되돌림) · 3 벽 세 곳 보라 레이저
import { ROOM_CX } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { pullTo, roomSpot } from "./asmoKit";
import { asmoLines, asmoPose } from "./bossAsmo";
import { hitDamage, shotDamage } from "./bossKit";
import { damagePlayer } from "./combat";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, enemyShot, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 공격 사이 틱 · 떠다니는 빠르기 */
  GAP: 156,
  SPEED: 0.4,
  /** 빨아들이고 내려찍기: 빨아들이는 틱 · 내려찍는 반경 · 피해 배율 */
  SUCK: 180,
  SLAM_R: 66,
  SLAM_MUL: 1.6,
  /** 블랙홀 터뜨리기: 수 · 첫 예고 · 사이 · 반경 · 피해 배율 · 탄 빠르기 */
  HOLES: 4,
  HOLE_WARN: 90,
  HOLE_GAP: 30,
  HOLE_R: 48,
  HOLE_MUL: 1.1,
  HOLE_SHOT: 1.3,
  /** 단 하나의 빈자리: 처음 · 간격 · 찾는 틱 · 반경 · 빈자리 밖 피해 배율 · 이 줄 아래면 한 번 더 · 두 번째 찾는 틱 */
  SAFE_FIRST: 600,
  SAFE_EVERY: 1500,
  SAFE_WARN: 180,
  SAFE_R: 18,
  SAFE_MUL: 2.4,
  SAFE_TWICE: 60,
  SAFE_WARN2: 150,
  /** 굶주린 미니 블랙홀: 처음 · 간격 · 먹는 틱 · 되돌리는 비율 · 한 발 피해 최대 · 탄 최대 수 */
  EAT_FIRST: 1100,
  EAT_EVERY: 2100,
  EAT: 420,
  EAT_BACK: 0.15,
  EAT_SHOT_MAX: 30,
  EAT_SHOTS: 48,
  /** 보라 레이저: 처음 · 간격 · 줄기 수 · 줄기 사이 · 예고 · 피해 배율 */
  LASER_FIRST: 350,
  LASER_EVERY: 1200,
  LASERS: 5,
  LASER_GAP: 72,
  LASER_WARN: 54,
  LASER_MUL: 1.1,
};
export { R as BOSS_ASMO_VOID_RULES };

type Vec = readonly [number, number];
/** 벽마다 나누는 구역 수 */
export const LASER_ZONES = 5;
/** 미니 블랙홀 k의 자리 (보스 둘레를 돎) */
export function eatSpot(s: RunState, e: EnemyState, k: number): [number, number] {
  const v = rot(s.tick * 0.03 + (k * Math.PI * 2) / 3);
  return [e.x + v[0] * 44, e.y + v[1] * 28];
}
export const eating = (s: RunState, e: EnemyState) => e.amEatEnd !== undefined && s.tick < e.amEatEnd;

export function voidTick(s: RunState, e: EnemyState, toP: Vec): void {
  if (e.amNextSafe === undefined) {
    e.amNextSafe = s.tick + R.SAFE_FIRST;
    e.amNextEat = s.tick + R.EAT_FIRST;
    e.amNextLaser = s.tick + R.LASER_FIRST;
  }
  e.dirX = toP[0];
  // 방 위쪽에서 나를 따라 옆으로 천천히
  const tx = Math.max(ROOM_MIN_X + 40, Math.min(ROOM_MAX_X - 40, s.player.x));
  e.x += Math.sign(tx - e.x) * Math.min(Math.abs(tx - e.x), R.SPEED);
  e.y += (ROOM_MIN_Y + 56 - e.y) * 0.05;
  suckTick(s, e);
  holeTick(s, e);
  safeTick(s, e);
  laserTick(s, e);
  if (s.tick >= (e.amNextEat ?? Infinity)) {
    e.amNextEat = s.tick + R.EAT_EVERY;
    e.amEatEnd = s.tick + R.EAT;
    e.amEaten = 0;
  }
  if (e.timer > 0 || e.amSuckEnd !== undefined) return;
  e.timer = R.GAP;
  if (e.count++ % 2 === 0) {
    e.amSuckEnd = s.tick + R.SUCK;
    e.amSuckX = e.x;
    e.amSuckY = e.y + 24;
    addShape(s, R.SUCK, { x: e.amSuckX, y: e.amSuckY, radius: R.SLAM_R, damage: hitDamage(s) * R.SLAM_MUL, fx: "dark", from: "asmoslam" });
    asmoPose(s, e, 1, R.SUCK);
  } else {
    const holes: [number, number, number][] = [];
    for (let i = 0; i < R.HOLES; i++) {
      const [x, y] = roomSpot(s, "asmoHole", i, 40);
      const at = R.HOLE_WARN + i * R.HOLE_GAP;
      // 하나는 내 자리 둘레
      const hx = i === 0 ? s.player.x : x;
      const hy = i === 0 ? s.player.y : y;
      addShape(s, at, { x: hx, y: hy, radius: R.HOLE_R, damage: hitDamage(s) * R.HOLE_MUL, fx: "dark", from: "asmohole" });
      holes.push([hx, hy, s.tick + at]);
    }
    e.amHoles = holes;
    asmoPose(s, e, 2, 60);
  }
}

/** 빨아들이는 동안 보스 앞으로 끌림 (대시·걷기로 버팀) */
function suckTick(s: RunState, e: EnemyState): void {
  if (e.amSuckEnd === undefined) return;
  if (s.tick >= e.amSuckEnd) {
    e.amSuckEnd = undefined;
    return;
  }
  pullTo(s, e.amSuckX ?? e.x, e.amSuckY ?? e.y);
}

/** 블랙홀이 터지는 순간 탄막 12발 (틈 있음) */
function holeTick(s: RunState, e: EnemyState): void {
  for (const h of e.amHoles ?? []) {
    if (h[2] !== s.tick) continue;
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 3) continue;
      const v = DIR16[i]!;
      Object.assign(enemyShot(s, h[0], h[1], v[0], v[1], R.HOLE_SHOT, shotDamage(s)), { from: e.kind, look: "orbChaos", r: 6 });
    }
  }
  if ((e.amHoles ?? []).every((h) => h[2] <= s.tick)) e.amHoles = undefined;
}

/** 단 하나의 빈자리: 빈자리 밖은 모두 맞음 (대시로도 못 피함), 줄이 적으면 빈자리가 한 번 더 옮겨 감 */
function safeTick(s: RunState, e: EnemyState): void {
  if (s.tick >= (e.amNextSafe ?? Infinity)) {
    e.amNextSafe = s.tick + R.SAFE_EVERY;
    const a = roomSpot(s, "asmoSafe", 0);
    e.amSafe = [[a[0], a[1], s.tick + R.SAFE_WARN]];
    if (asmoLines(e) <= R.SAFE_TWICE) {
      const b = roomSpot(s, "asmoSafe", 1);
      e.amSafe.push([b[0], b[1], s.tick + R.SAFE_WARN + R.SAFE_WARN2]);
    }
    asmoPose(s, e, 3, R.SAFE_WARN);
  }
  const now = e.amSafe?.[0];
  if (!now || s.tick < now[2]) return;
  eachSeat(
    s,
    () => {
      const p = s.player;
      if (Math.hypot(p.x - now[0], p.y - now[1]) > R.SAFE_R) damagePlayer(s, hitDamage(s) * R.SAFE_MUL, "asmodeus");
    },
    true,
  );
  addEffect(s, { kind: "burst", x: ROOM_CX, y: (ROOM_MIN_Y + ROOM_MAX_Y) / 2, dirX: 0, dirY: 0, size: 120, maxTicks: 24, foe: true, from: "asmosafe" });
  e.amSafe!.shift();
  if (e.amSafe!.length === 0) e.amSafe = undefined;
}

/** 틱마다 (모습과 상관없이): 미니 블랙홀이 먹는 동안 체력이 줄지 않고 먹은 만큼 쌓임 → 끝나면 되돌려 난사 */
export function eatTick(s: RunState, e: EnemyState): void {
  if (e.amEatEnd === undefined) return;
  if (s.tick < e.amEatEnd) {
    const was = e.amHpWas ?? e.hp;
    if (e.hp < was) {
      e.amEaten = (e.amEaten ?? 0) + (was - e.hp);
      e.hp = was;
    }
    return;
  }
  e.amEatEnd = undefined;
  const total = (e.amEaten ?? 0) * R.EAT_BACK;
  e.amEaten = 0;
  if (total <= 0) return;
  const per = Math.min(R.EAT_SHOT_MAX, Math.max(shotDamage(s), total / R.EAT_SHOTS));
  const n = Math.min(R.EAT_SHOTS, Math.ceil(total / per));
  const rng = createRng(deriveSeed(s.seed, "asmoEat", e.id, s.tick));
  for (let i = 0; i < n; i++) {
    const [x, y] = eatSpot(s, e, i % 3);
    const v = DIR16[rng.int(0, 15)]!;
    Object.assign(enemyShot(s, x, y, v[0], v[1], 1 + rng.nextFloat() * 0.8, per), { from: e.kind, look: "orbChaos", r: 6 + Math.min(8, Math.round(per / 5)) });
  }
  for (let k = 0; k < 3; k++) {
    const [x, y] = eatSpot(s, e, k);
    addEffect(s, { kind: "burst", x, y, dirX: 0, dirY: 0, size: 20 + Math.min(40, n), maxTicks: 20, foe: true });
  }
}

/** 보라 레이저: 위 · 왼쪽 · 오른쪽 벽을 5구역씩 → 고른 구역에서 반대쪽 벽까지 (늘 안전한 칸 하나는 남김) */
export function laserVolley(s: RunState, salt: number): void {
  const rng = createRng(deriveSeed(s.seed, "asmoLaser", s.tick, salt));
  const w = (ROOM_MAX_X - ROOM_MIN_X) / LASER_ZONES;
  const h = (ROOM_MAX_Y - ROOM_MIN_Y) / LASER_ZONES;
  // 안전한 칸 (열 c, 줄 r): 위 레이저는 c 열을, 옆 레이저는 r 줄을 피함
  const c = rng.int(0, LASER_ZONES - 1);
  const r = rng.int(0, LASER_ZONES - 1);
  const pick = (skip: number, n: number) => {
    const list = [0, 1, 2, 3, 4].filter((i) => i !== skip);
    for (let i = list.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list.slice(0, n);
  };
  const dmg = hitDamage(s) * R.LASER_MUL;
  for (const i of pick(c, rng.int(1, 3))) {
    const x = ROOM_MIN_X + (i + 0.5) * w;
    addShape(s, R.LASER_WARN, { x, y: ROOM_MIN_Y, radius: 0, toX: x, toY: ROOM_MAX_Y, width: w / 2 - 2, damage: dmg, fx: "fake", from: "asmolaser" });
  }
  for (const side of [0, 1]) {
    for (const i of pick(r, rng.int(1, 2))) {
      const y = ROOM_MIN_Y + (i + 0.5) * h;
      addShape(s, R.LASER_WARN, { x: side === 0 ? ROOM_MIN_X : ROOM_MAX_X, y, radius: 0, toX: side === 0 ? ROOM_MAX_X : ROOM_MIN_X, toY: y, width: h / 2 - 2, damage: dmg, fx: "fake", from: "asmolaser" });
    }
  }
}

/** 레이저 시작 (gap: 줄기 사이 틱) */
export function startLasers(s: RunState, e: EnemyState, gap = R.LASER_GAP): void {
  e.amLasers = R.LASERS;
  e.amLaserAt = s.tick;
  e.amLaserGap = gap;
}

/** 틱마다: 레이저 줄기 (모습과 상관없이, 화신의 기억에서도 씀) */
export function laserTick(s: RunState, e: EnemyState): void {
  if (e.amForm === 2 && s.tick >= (e.amNextLaser ?? Infinity)) {
    e.amNextLaser = s.tick + R.LASER_EVERY;
    startLasers(s, e);
    asmoPose(s, e, 4, 60);
  }
  if ((e.amLasers ?? 0) <= 0 || s.tick < (e.amLaserAt ?? 0)) return;
  laserVolley(s, e.amLasers!);
  e.amLasers = e.amLasers! - 1;
  e.amLaserAt = s.tick + (e.amLaserGap ?? R.LASER_GAP);
}
