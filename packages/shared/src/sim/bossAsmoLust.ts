// 아스모데우스의 화신체 100~76줄: 욕망의 화신 (보라 불꽃 마술사, 거리를 두고 맴돎)
// 기본 공격: 보라 불꽃 베기(지나간 자리에 불꽃 담) · 꺾이는 마창(벽에 2번 튕김) · 욕망의 구슬(따라오다 터짐, 불꽃 담을 지움) · 다섯 구슬 순서
// 패턴: 매혹의 눈(보스 쪽으로 움직이면 끌려감) · 욕망의 잔상(1.5초 전 내 자리를 따라옴) · 두 빛의 바닥(불꽃 색과 같은 칸만 안전)
import { createRng, deriveSeed } from "../rng";
import { addWall, charmCheck, clearWalls, startChess, startTrail } from "./asmoKit";
import { asmoPose } from "./bossAsmo";
import { hitDamage, keepAway, shotDamage } from "./bossKit";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 공격 사이 틱 · 유지하는 거리 · 이동 빠르기 */
  GAP: 150,
  KEEP: 60,
  SPEED: 0.6,
  /** 보라 불꽃 베기: 예고 · 반경 · 피해 배율 · 불꽃 담 길이(반) · 남는 틱 */
  SLASH_WARN: 30,
  SLASH_R: 70,
  SLASH_MUL: 1,
  WALL_HALF: 60,
  WALL: 240,
  /** 꺾이는 마창: 예고 · 굵기(반) · 튕김 수 · 피해 배율 */
  LANCE_WARN: 48,
  LANCE_W: 5,
  BOUNCES: 2,
  LANCE_MUL: 1.1,
  /** 욕망의 구슬: 따라오는 틱 · 빠르기 · 닿으면 터지는 거리 · 탄 빠르기 · 불꽃 담을 지우는 반경 */
  ORB_LIFE: 180,
  ORB_SPEED: 0.7,
  ORB_HIT: 12,
  ORB_SHOT: 1.4,
  ORB_CLEAR: 46,
  /** 다섯 구슬: 깜빡이는 간격 · 날아오는 간격 · 보스 둘레 반경 · 빠르기 · 피해 배율 */
  FIVE_BLINK: 20,
  FIVE_GAP: 24,
  FIVE_R: 30,
  FIVE_SPEED: 2.4,
  FIVE_MUL: 1.4,
  /** 매혹의 눈: 처음 · 간격 · 예고(눈이 빛남) */
  CHARM_FIRST: 600,
  CHARM_EVERY: 1200,
  CHARM_WARN: 120,
  /** 욕망의 잔상: 처음 · 간격 · 길이 */
  TRAIL_FIRST: 900,
  TRAIL_EVERY: 1500,
  TRAIL: 480,
  /** 두 빛의 바닥: 처음 · 간격 · 길이 */
  CHESS_FIRST: 1200,
  CHESS_EVERY: 1800,
  CHESS: 540,
};
export { R as BOSS_ASMO_LUST_RULES };

type Vec = readonly [number, number];
/** 다섯 구슬 k번째 자리 */
export const fiveSpot = (e: EnemyState, k: number): [number, number] => {
  const v = rot((k * Math.PI * 2) / 5 - Math.PI / 2);
  return [e.x + v[0] * R.FIVE_R, e.y - 16 + v[1] * R.FIVE_R];
};
/** 다섯 구슬이 깜빡이는 동안 (화면): 지금 깜빡이는 순서 번호 (-1 = 깜빡임 끝) */
export const fiveBlink = (s: RunState, e: EnemyState) => (e.amFiveAt === undefined ? -1 : Math.floor((s.tick - e.amFiveAt) / R.FIVE_BLINK));

export function lustTick(s: RunState, e: EnemyState, toP: Vec): void {
  if (e.amNextCharm === undefined) {
    e.amNextCharm = s.tick + R.CHARM_FIRST;
    e.amNextTrail = s.tick + R.TRAIL_FIRST;
    e.amNextChess = s.tick + R.CHESS_FIRST;
  }
  e.dirX = toP[0];
  keepAway(s, e, toP, toP, R.KEEP, R.SPEED);
  patterns(s, e);
  orbTick(s, e);
  fiveTick(s, e);
  if (e.timer > 0) return;
  e.timer = R.GAP;
  const k = e.count++ % 4;
  const p = s.player;
  const d = normalize(p.x - e.x, p.y - e.y) ?? [0, 1];
  if (k === 0) {
    addShape(s, R.SLASH_WARN, { x: e.x, y: e.y, radius: R.SLASH_R, damage: hitDamage(s) * R.SLASH_MUL, dirX: d[0], dirY: d[1], arc: 0, fx: "bslash", from: "asmoslash" });
    // 지나간 자리에 불꽃 담 (베기 방향에 가로로)
    const cx = e.x + d[0] * R.SLASH_R * 0.8;
    const cy = e.y + d[1] * R.SLASH_R * 0.8;
    addWall(s, e, cx + d[1] * R.WALL_HALF, cy - d[0] * R.WALL_HALF, cx - d[1] * R.WALL_HALF, cy + d[0] * R.WALL_HALF, R.SLASH_WARN, R.WALL);
    asmoPose(s, e, 1, 40);
  } else if (k === 1) {
    const pts = bouncePath(e.x, e.y, d[0], d[1], R.BOUNCES);
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x, y] = pts[i]!;
      const [tx, ty] = pts[i + 1]!;
      addShape(s, R.LANCE_WARN + i * 8, { x, y, radius: 0, toX: tx, toY: ty, width: R.LANCE_W, damage: hitDamage(s) * R.LANCE_MUL, fx: "fake", from: "asmolance" });
    }
    asmoPose(s, e, 2, 50);
  } else if (k === 2) {
    e.amOrb = [e.x, e.y - 40, s.tick + R.ORB_LIFE];
    asmoPose(s, e, 3, 50);
  } else {
    const rng = createRng(deriveSeed(s.seed, "asmoFive", e.id, s.tick));
    const order = [0, 1, 2, 3, 4];
    for (let i = 4; i > 0; i--) {
      const j = rng.int(0, i);
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    e.amFive = order;
    e.amFiveAt = s.tick;
    asmoPose(s, e, 4, R.FIVE_BLINK * 5 + R.FIVE_GAP * 5);
  }
}

/** 방 벽에 n번 튕기는 길 (점 목록) */
export function bouncePath(x: number, y: number, dx: number, dy: number, n: number): [number, number][] {
  const pts: [number, number][] = [[x, y]];
  for (let i = 0; i <= n; i++) {
    const tx = dx > 0 ? (ROOM_MAX_X - x) / dx : dx < 0 ? (ROOM_MIN_X - x) / dx : Infinity;
    const ty = dy > 0 ? (ROOM_MAX_Y - y) / dy : dy < 0 ? (ROOM_MIN_Y - y) / dy : Infinity;
    const t = Math.min(tx, ty);
    x += dx * t;
    y += dy * t;
    pts.push([x, y]);
    if (tx <= ty) dx = -dx;
    if (ty <= tx) dy = -dy;
  }
  return pts;
}

/** 매혹의 눈 · 욕망의 잔상 · 두 빛의 바닥 */
function patterns(s: RunState, e: EnemyState): void {
  if (s.tick >= (e.amNextCharm ?? Infinity)) {
    e.amNextCharm = s.tick + R.CHARM_EVERY;
    e.amCharmAt = s.tick + R.CHARM_WARN;
  }
  if (e.amCharmAt !== undefined && s.tick >= e.amCharmAt) {
    e.amCharmAt = undefined;
    charmCheck(s, e);
  }
  if (s.tick >= (e.amNextTrail ?? Infinity)) {
    e.amNextTrail = s.tick + R.TRAIL_EVERY;
    startTrail(s, e, R.TRAIL);
  }
  if (s.tick >= (e.amNextChess ?? Infinity)) {
    e.amNextChess = s.tick + R.CHESS_EVERY;
    startChess(s, e, R.CHESS);
  }
}

/** 욕망의 구슬: 나를 천천히 따라오다 (닿거나 시간이 되면) 8방향으로 터짐 · 둘레 불꽃 담이 사라짐 */
function orbTick(s: RunState, e: EnemyState): void {
  const o = e.amOrb;
  if (!o) return;
  const p = s.player;
  const d = Math.hypot(p.x - o[0], p.y - o[1]);
  if (d > 1) {
    o[0] += ((p.x - o[0]) / d) * R.ORB_SPEED;
    o[1] += ((p.y - o[1]) / d) * R.ORB_SPEED;
  }
  if (s.tick < o[2] && d > R.ORB_HIT + p.r) return;
  e.amOrb = undefined;
  for (let i = 0; i < 16; i += 2) {
    const v = DIR16[i]!;
    Object.assign(enemyShot(s, o[0], o[1], v[0], v[1], R.ORB_SHOT, shotDamage(s)), { from: e.kind, look: "orbChaos", r: 3 });
  }
  clearWalls(e, o[0], o[1], R.ORB_CLEAR);
  addEffect(s, { kind: "burst", x: o[0], y: o[1], dirX: 0, dirY: 0, size: 26, maxTicks: 18, foe: true });
}

/** 다섯 구슬: 깜빡인 순서대로 하나씩 내 자리로 날아옴 */
function fiveTick(s: RunState, e: EnemyState): void {
  if (!e.amFive || e.amFiveAt === undefined) return;
  const t = s.tick - e.amFiveAt - R.FIVE_BLINK * 5;
  if (t < 0 || t % R.FIVE_GAP !== 0) return;
  const i = t / R.FIVE_GAP;
  const k = e.amFive[i];
  if (k === undefined) {
    e.amFive = e.amFiveAt = undefined;
    return;
  }
  const [x, y] = fiveSpot(e, k);
  const d = normalize(s.player.x - x, s.player.y - y) ?? [0, 1];
  Object.assign(enemyShot(s, x, y, d[0], d[1], R.FIVE_SPEED, shotDamage(s) * R.FIVE_MUL), { from: e.kind, look: "orbChaos", r: 5 });
}
