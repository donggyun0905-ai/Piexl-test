// 아스모데우스의 화신체 추가 패턴 (모습마다 2개, sim/bossAsmo가 틱마다 부름)
// 욕망: 불꽃 꽃잎 회오리(돌아가는 5갈래 탄) · 불꽃 감옥(내 둘레 세 변 담 + 안쪽 폭발, 열린 한 변으로 빠져나가야)
// 검은 해: 검은 별 비(방 곳곳 + 내 자리에 차례로 떨어짐) · 교차 빛줄기(나를 지나는 십자 → 엑스자)
// 강철 군주: 강철 돌진(예고선 따라 순식간에 돌진, 끝에서 고리) · 붉은 칼날 폭풍(틈이 엇갈리는 칼날 고리 3번)
import { addWall, roomSpot } from "./asmoKit";
import { asmoPose } from "./bossAsmo";
import { hitDamage, shotDamage } from "./bossKit";
import { addWave } from "./bossWaves";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 모습마다 첫 패턴 · 두 번째 패턴: 처음 · 간격 */
  EX1_FIRST: 420,
  EX1_EVERY: 1300,
  EX2_FIRST: 780,
  EX2_EVERY: 1400,
  /** 불꽃 꽃잎 회오리: 길이 · 쏘는 간격 · 갈래 수 · 빠르기 · 탄 크기 · 도는 빠르기 */
  PETAL: 300,
  PETAL_EVERY: 9,
  PETALS: 5,
  PETAL_SPEED: 1.3,
  PETAL_SIZE: 8,
  PETAL_SPIN: 0.06,
  /** 불꽃 감옥: 반 크기 · 담이 남는 틱 · 폭발 예고 · 피해 배율 */
  CAGE_HALF: 48,
  CAGE: 170,
  CAGE_WARN: 100,
  CAGE_MUL: 1.8,
  /** 검은 별 비: 수 · 첫 예고 · 사이 틱 · 반경 · 피해 배율 · 내 자리를 노리는 간격(번째마다) */
  STARS: 14,
  STAR_WARN: 60,
  STAR_GAP: 12,
  STAR_R: 34,
  STAR_MUL: 1.2,
  STAR_AIM: 3,
  /** 교차 빛줄기: 십자 예고 · 엑스자 예고 · 굵기(반) · 피해 배율 */
  CROSS_WARN: 54,
  CROSS_WARN2: 96,
  CROSS_W: 14,
  CROSS_MUL: 1.3,
  /** 강철 돌진: 예고 · 길이 · 굵기(반) · 피해 배율 · 끝 고리 빠르기 · 반경 */
  CHARGE_WARN: 54,
  CHARGE_LEN: 260,
  CHARGE_W: 18,
  CHARGE_MUL: 1.6,
  CHARGE_RING: 1.8,
  CHARGE_RING_MAX: 160,
  /** 붉은 칼날 폭풍: 고리 수 · 고리 사이 틱 · 한 고리 탄 수 · 빠르기 · 탄 크기 · 피해 배율 */
  BLADES: 3,
  BLADE_GAP: 32,
  BLADE_N: 16,
  BLADE_SPEED: 1.5,
  BLADE_SIZE: 7,
  BLADE_MUL: 1.2,
};
export { R as BOSS_ASMO_EXTRA_RULES };

const shot = (s: RunState, e: EnemyState, x: number, y: number, v: readonly [number, number], speed: number, dmg: number, r: number) =>
  Object.assign(enemyShot(s, x, y, v[0], v[1], speed, dmg), { from: e.kind, look: "orbChaos", r });

/** 틱마다 (궁극기·지침이 아닐 때): 모습이 바뀌면 시간표를 새로 */
export function extraTick(s: RunState, e: EnemyState): void {
  if (e.amExForm !== e.amForm) {
    e.amExForm = e.amForm;
    e.amNextEx1 = s.tick + R.EX1_FIRST;
    e.amNextEx2 = s.tick + R.EX2_FIRST;
  }
  if (s.tick >= (e.amNextEx1 ?? Infinity)) {
    e.amNextEx1 = s.tick + R.EX1_EVERY;
    if (e.amForm === 1) e.amPetalEnd = s.tick + R.PETAL;
    else if (e.amForm === 2) starRain(s, e);
    else charge(s, e);
  }
  if (s.tick >= (e.amNextEx2 ?? Infinity)) {
    e.amNextEx2 = s.tick + R.EX2_EVERY;
    if (e.amForm === 1) cage(s, e);
    else if (e.amForm === 2) cross(s, e);
    else e.amBladeAt = s.tick;
  }
  petalTick(s, e);
  chargeTick(s, e);
  bladeTick(s, e);
}

/** 불꽃 꽃잎 회오리 */
function petalTick(s: RunState, e: EnemyState): void {
  if (e.amPetalEnd === undefined) return;
  if (s.tick >= e.amPetalEnd) {
    e.amPetalEnd = undefined;
    return;
  }
  if (s.tick % R.PETAL_EVERY !== 0) return;
  for (let k = 0; k < R.PETALS; k++) {
    const v = rot(s.tick * R.PETAL_SPIN + (k * Math.PI * 2) / R.PETALS);
    shot(s, e, e.x + v[0] * 16, e.y - 10 + v[1] * 16, v, R.PETAL_SPEED, shotDamage(s), R.PETAL_SIZE);
  }
  asmoPose(s, e, 3, 10);
}

/** 불꽃 감옥: 내 둘레 네 변 중 세 변에 불꽃 담 → 안쪽이 터짐 */
function cage(s: RunState, e: EnemyState): void {
  const h = R.CAGE_HALF;
  const x = Math.max(ROOM_MIN_X + h, Math.min(ROOM_MAX_X - h, s.player.x));
  const y = Math.max(ROOM_MIN_Y + h, Math.min(ROOM_MAX_Y - h, s.player.y));
  const open = (s.tick + e.id) % 4;
  const sides: [number, number, number, number][] = [
    [x - h, y - h, x + h, y - h],
    [x + h, y - h, x + h, y + h],
    [x + h, y + h, x - h, y + h],
    [x - h, y + h, x - h, y - h],
  ];
  sides.forEach((w, i) => i !== open && addWall(s, e, w[0], w[1], w[2], w[3], 12, R.CAGE));
  addShape(s, R.CAGE_WARN, { x, y, radius: h + 4, damage: hitDamage(s) * R.CAGE_MUL, fx: "bslash", from: "asmoslash" });
  asmoPose(s, e, 1, 50);
}

/** 검은 별 비 */
function starRain(s: RunState, e: EnemyState): void {
  for (let i = 0; i < R.STARS; i++) {
    const at = R.STAR_WARN + i * R.STAR_GAP;
    const [x, y] = i % R.STAR_AIM === 0 ? [s.player.x, s.player.y] : roomSpot(s, "asmoStar", i, 24);
    addShape(s, at, { x, y, radius: R.STAR_R, damage: hitDamage(s) * R.STAR_MUL, fx: "dark", from: "asmohole" });
  }
  asmoPose(s, e, 2, 60);
}

/** 교차 빛줄기: 나를 지나는 가로·세로 → 대각선 둘 */
function cross(s: RunState, e: EnemyState): void {
  const { x, y } = s.player;
  const dmg = hitDamage(s) * R.CROSS_MUL;
  const line = (warn: number, dx: number, dy: number) =>
    addShape(s, warn, { x: x - dx * 400, y: y - dy * 400, radius: 0, toX: x + dx * 400, toY: y + dy * 400, width: R.CROSS_W, damage: dmg, fx: "fake", from: "asmolaser" });
  line(R.CROSS_WARN, 1, 0);
  line(R.CROSS_WARN, 0, 1);
  line(R.CROSS_WARN2, Math.SQRT1_2, Math.SQRT1_2);
  line(R.CROSS_WARN2, Math.SQRT1_2, -Math.SQRT1_2);
  asmoPose(s, e, 4, 60);
}

/** 강철 돌진: 예고선 → 그 끝으로 순식간에 이동 · 끝에서 고리 */
function charge(s: RunState, e: EnemyState): void {
  const d = normalize(s.player.x - e.x, s.player.y - e.y) ?? [0, 1];
  const m = 24;
  const tx = Math.max(ROOM_MIN_X + m, Math.min(ROOM_MAX_X - m, e.x + d[0] * R.CHARGE_LEN));
  const ty = Math.max(ROOM_MIN_Y + m, Math.min(ROOM_MAX_Y - m, e.y + d[1] * R.CHARGE_LEN));
  addShape(s, R.CHARGE_WARN, { x: e.x, y: e.y, radius: 0, toX: tx, toY: ty, width: R.CHARGE_W, damage: hitDamage(s) * R.CHARGE_MUL, fx: "fake", from: "asmored" });
  e.amCharge = [Math.round(tx), Math.round(ty), s.tick + R.CHARGE_WARN, e.x, e.y];
  asmoPose(s, e, 1, R.CHARGE_WARN + 10);
}

function chargeTick(s: RunState, e: EnemyState): void {
  const c = e.amCharge;
  if (!c) return;
  if (s.tick < c[2]) {
    // 예고 동안 제자리 (걸어오는 만큼 되돌림)
    e.x = c[3];
    e.y = c[4];
    return;
  }
  e.amCharge = undefined;
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 30, maxTicks: 14, foe: true });
  e.x = c[0];
  e.y = c[1];
  addWave(e, c[0], c[1], 0, R.CHARGE_RING, R.CHARGE_RING_MAX, hitDamage(s));
  addEffect(s, { kind: "burst", x: c[0], y: c[1], dirX: 0, dirY: 0, size: 44, maxTicks: 18, foe: true });
}

/** 붉은 칼날 폭풍: 고리마다 반 칸씩 엇갈림 */
function bladeTick(s: RunState, e: EnemyState): void {
  if (e.amBladeAt === undefined) return;
  const t = s.tick - e.amBladeAt;
  if (t % R.BLADE_GAP !== 0) return;
  const i = t / R.BLADE_GAP;
  if (i >= R.BLADES) {
    e.amBladeAt = undefined;
    return;
  }
  for (let k = 0; k < R.BLADE_N; k++) {
    const v = rot(((k + (i % 2) * 0.5) * Math.PI * 2) / R.BLADE_N);
    shot(s, e, e.x, e.y, v, R.BLADE_SPEED, shotDamage(s) * R.BLADE_MUL, R.BLADE_SIZE);
  }
  asmoPose(s, e, 2, 20);
}
