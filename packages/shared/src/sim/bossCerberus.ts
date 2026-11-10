// 시즌 3 라스트 보스 켈베로스: 네 사슬에 묶인 세 머리 지옥견 (방 위쪽 가운데, 움직이지 않음). 흰 쉴드부터 깎음 (진짜 체력은 잠김)
// 페이즈 1 머리마다 따로: 왼쪽 땅 가르기·용암 바위 / 가운데 화염볼 5연발·지옥불 브레스(기둥 뒤만 안전) / 오른쪽 검기·전역 검기 3연(대시로 넘음)
// + 세 머리 동시 공격 · 용암 분출(쉴드 66%·33%, 그 뒤 45초마다). 쉴드가 깨지면 사슬이 끊기고 세 사람(권귀·염희·검귀)으로 갈라짐 → 페이즈 2 (sim/bossCerbTrio)
// 페이즈 2: 켈베로스는 보이지 않는 지휘자 (체력 = 세 사람 체력의 합) · 큰 패턴 셋 (무너지는 바닥 · 바위 비 · 염희 빨아들이기)
import { CERB_TRIO, ENEMIES } from "../content";
import { ROOM_CX } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { hitDamage, turn } from "./bossKit";
import { addWave, updateWaves } from "./bossWaves";
import { aimAt, breathBusy, breathTick, cerbLavaSet, floorBusy, floorHold, floorTick, growLava, lavaTick, startBreath, startErupt, startFloor, cellRect } from "./cerbKit";
import { addShape } from "./hazards";
import { startPull } from "./bossCerbTrio";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, enemyShot, makeEnemy, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 쉴드 = 최대 체력(세 사람 체력의 합)의 몇 배 (5600 × 0.715 ≒ 4000 → 쉴드 + 세 사람 ≒ 9600, 멸망의 용과 같음) */
  SHIELD: 0.715,
  /** 머리 공격 사이 틱 (쉴드 40% 아래면 GAP_FAST) */
  GAP: 75,
  GAP_FAST: 58,
  /** 땅 가르기: 예고 · 굵기(반) · 갈라지는 갈래 길이 · 남는 불길 피해 배율 */
  CRACK_WARN: 48,
  CRACK_W: 9,
  CRACK_BRANCH: 46,
  CRACK_BURN: 0.35,
  /** 용암 바위: 수 · 예고 · 반경 · 내 둘레 퍼짐 */
  ROCKS: 6,
  ROCK_WARN: 60,
  ROCK_R: 16,
  ROCK_SPREAD: 46,
  /** 화염볼: 수 · 간격 · 빠르기 · 크기(반지름) · 피해(큰 공격 피해의 몇 배) (세 머리 동시면 TRIPLE_FIRE발 · TRIPLE_FIRE_GAP 간격) */
  FIRE: 5,
  FIRE_GAP: 12,
  FIRE_SPEED: 1.9,
  FIRE_R: 9,
  FIRE_MUL: 0.8,
  /** 검기: 수 · 간격 · 빠르기 */
  QI: 4,
  QI_GAP: 18,
  QI_SPEED: 2.1,
  /** 검기(거대 붉은 검기) 크기(반지름) · 피해 (큰 공격 피해의 몇 배) */
  QI_R: 10,
  QI_MUL: 0.9,
  /** 전역 검기 3연 (붉은 원형 파동, 대시로 넘음): 수 · 간격 · 빠르기 · 피해 배율 · 오른쪽 머리 몇 번째마다 */
  SWEEPS: 3,
  SWEEP_GAP: 60,
  SWEEP_SPEED: 2.4,
  SWEEP_MUL: 0.7,
  SWEEP_EVERY: 3,
  /** 지옥불 브레스: 처음 · 간격 (쉴드 40% 아래면 BREATH_FAST) */
  BREATH_FIRST: 600,
  BREATH_EVERY: 1650,
  BREATH_FAST: 1200,
  /** 세 머리 동시 공격: 쉴드가 이 비율 아래부터 · 간격 · 바위 수 · 화염볼 · 파동 간격(대시 재사용 0.75초 + 조금) */
  TRIPLE_FROM: 0.8,
  TRIPLE_EVERY: 2000,
  TRIPLE_ROCKS: 10,
  TRIPLE_FIRE: 15,
  TRIPLE_FIRE_GAP: 8,
  TRIPLE_GAP: 52,
  /** 용암 분출: 그 뒤 간격 */
  ERUPT_EVERY: 2700,
  /** 갈라지기: 사슬이 끊기고 세 사람이 서기까지 틱 */
  SPLIT: 180,
  /** 페이즈 2 큰 패턴: 처음 · 사이 틱 · 바위 비 수 · 간격 · 예고 · 반경 */
  BIG_FIRST: 1200,
  BIG_GAP: 900,
  RAIN: 18,
  RAIN_GAP: 9,
  RAIN_WARN: 60,
  RAIN_R: 17,
};
export { R as BOSS_CERBERUS_RULES };

type Vec = readonly [number, number];
/** 머리 자리 (몸 가운데에서) */
export const HEAD_OFS: readonly Vec[] = [[-20, 2], [0, -6], [20, 2]];
/** 머리 차례: 왼쪽 · 오른쪽 · 가운데(화염볼) */
const ORDER = [0, 2, 1, 0, 1, 2];

const shieldMax = (e: EnemyState) => Math.round(e.maxHp * R.SHIELD);
/** 남은 쉴드 비율 */
export const shieldLeft = (e: EnemyState) => (e.ward ?? 0) / shieldMax(e);
const pose = (s: RunState, e: EnemyState, f: number, ticks: number) => {
  e.cbPose = f;
  e.cbPoseEnd = s.tick + ticks;
};

export function updateCerberus(s: RunState, e: EnemyState, _toP: Vec, _go: Vec, spawned: EnemyState[]): void {
  e.stunTicks = 0;
  if (e.cbPhase === undefined) {
    e.cbPhase = 1;
    e.ward = shieldMax(e);
    e.cbLava = cerbLavaSet(s);
    e.cbNextBreath = s.tick + R.BREATH_FIRST;
    e.cbNextTriple = s.tick + R.BREATH_FIRST + R.TRIPLE_EVERY / 2;
    e.timer = 90;
  }
  // 묶여 있음: 늘 같은 자리
  e.x = e.prevX = ROOM_CX;
  e.y = e.prevY = ROOM_MIN_Y + 56;
  if ((e.cbPoseEnd ?? 0) <= s.tick) e.cbPose = 0;
  lavaTick(s, e);
  updateWaves(s, e);
  volleyTick(s, e);
  if (e.cbPhase === 2) return director(s, e);
  // 쉴드만 깎임 (진짜 체력은 잠김)
  e.hp = e.maxHp;
  if (e.cbSplit !== undefined) return splitTick(s, e, spawned);
  if ((e.ward ?? 0) <= 0) {
    e.cbSplit = s.tick;
    e.immune = true;
    s.hazards = [];
    s.projectiles = s.projectiles.filter((p) => p.fromPlayer);
    e.waves = [];
    e.cbErupt = e.cbSwell = e.cbBreath = e.cbBreathWarn = undefined;
    e.cbCut = 0;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 60, maxTicks: 30 });
    return;
  }
  const head = [e.x + HEAD_OFS[1]![0], e.y + HEAD_OFS[1]![1]] as const;
  breathTick(s, e, head[0], head[1]);
  const left = shieldLeft(e);
  // 용암 분출: 쉴드 66%·33%에서 한 번씩, 그 뒤 45초마다
  const n = e.cbErupts ?? 0;
  if ((n === 0 && left < 0.66) || (n === 1 && left < 0.33) || (n >= 2 && s.tick >= (e.cbNextErupt ?? Infinity))) {
    startErupt(s, e);
    if (e.cbErupts === 2) growLava(e);
    e.cbNextErupt = s.tick + R.ERUPT_EVERY;
    pose(s, e, 3, 90);
  }
  if (breathBusy(s, e)) {
    e.cbHead = 1;
    if (s.tick === e.cbBreath) pose(s, e, 1, 90);
    return;
  }
  if (s.tick >= (e.cbNextBreath ?? 0)) {
    startBreath(s, e);
    e.cbNextBreath = s.tick + (left < 0.4 ? R.BREATH_FAST : R.BREATH_EVERY);
    return;
  }
  if (left < R.TRIPLE_FROM && s.tick >= (e.cbNextTriple ?? 0)) {
    e.cbNextTriple = s.tick + R.TRIPLE_EVERY;
    return triple(s, e);
  }
  if (e.timer > 0) return;
  const h = ORDER[e.count % ORDER.length]!;
  e.count++;
  e.cbHead = h;
  e.timer = left < 0.4 ? R.GAP_FAST : R.GAP;
  if (h === 0) {
    if (e.count % 2 === 0) crack(s, e);
    else rocks(s, e, R.ROCKS);
    pose(s, e, 0, 40);
  } else if (h === 1) {
    // 화염볼: 틱마다 volleyTick이 하나씩
    e.cbFire = R.FIRE;
    e.cbFireGap = R.FIRE_GAP;
    pose(s, e, 1, 50);
  } else {
    e.cbRight = (e.cbRight ?? 0) + 1;
    if (e.cbRight % R.SWEEP_EVERY === 0) {
      sweeps(s, e, R.SWEEP_GAP);
      e.timer += R.SWEEP_GAP * R.SWEEPS;
    } else e.cbQi = R.QI;
    pose(s, e, 2, 50);
  }
}

/** 왼쪽 머리: 땅 가르기 (나를 향한 굵은 선 + 끝에서 세 갈래 · 갈라진 자리에 남는 불길 두 번) */
function crack(s: RunState, e: EnemyState): void {
  const [ox, oy] = HEAD_OFS[0]!;
  const x = e.x + ox;
  const y = e.y + oy + 8;
  const d = aimAt(s, x, y);
  const len = Math.hypot(s.player.x - x, s.player.y - y) + 30;
  const ex = x + d[0] * len;
  const ey = y + d[1] * len;
  const dmg = hitDamage(s);
  const line = { x, y, radius: 0, toX: ex, toY: ey, width: R.CRACK_W, fx: "spike" as const };
  addShape(s, R.CRACK_WARN, { ...line, damage: dmg });
  for (const k of [-2, 0, 2]) {
    const b = turn(d, k);
    addShape(s, R.CRACK_WARN + 8, { x: ex, y: ey, radius: 0, toX: ex + b[0] * R.CRACK_BRANCH, toY: ey + b[1] * R.CRACK_BRANCH, width: R.CRACK_W - 2, damage: dmg * 0.8, fx: "spike" }, 4);
  }
  for (const t of [40, 80]) addShape(s, R.CRACK_WARN + t, { ...line, width: R.CRACK_W - 3, damage: dmg * R.CRACK_BURN, by: "cerbflame", fx: "gleam" }, R.CRACK_WARN);
}

/** 용암 바위: 내 자리 + 둘레 (시드로 흩어짐) */
function rocks(s: RunState, e: EnemyState, n: number, delay = 0): void {
  const rng = createRng(deriveSeed(s.seed, "cerbRock", e.id, s.tick));
  const p = s.player;
  for (let i = 0; i < n; i++) {
    const v = DIR16[rng.int(0, 15)]!;
    const k = i === 0 ? 0 : rng.int(10, R.ROCK_SPREAD + (n > R.ROCKS ? 30 : 0));
    const x = Math.max(ROOM_MIN_X + 8, Math.min(ROOM_MAX_X - 8, p.x + v[0] * k));
    const y = Math.max(ROOM_MIN_Y + 8, Math.min(ROOM_MAX_Y - 8, p.y + v[1] * k));
    addShape(s, R.ROCK_WARN + delay + i * 3, { x, y, radius: R.ROCK_R, damage: hitDamage(s) * 0.7, fx: "meteor" }, delay);
  }
}

/** 틱마다: 남은 화염볼·검기를 간격마다 하나씩 (기둥에 막힘) */
function volleyTick(s: RunState, e: EnemyState): void {
  if ((e.cbFire ?? 0) > 0 && s.tick % (e.cbFireGap ?? R.FIRE_GAP) === 0) {
    const [ox, oy] = HEAD_OFS[1]!;
    const d = aimAt(s, e.x + ox, e.y + oy);
    Object.assign(enemyShot(s, e.x + ox, e.y + oy + 6, d[0], d[1], R.FIRE_SPEED, hitDamage(s) * R.FIRE_MUL), { from: "cerbflame", look: "fire", r: R.FIRE_R });
    e.cbFire!--;
  }
  if ((e.cbQi ?? 0) > 0 && s.tick % R.QI_GAP === 0) {
    const [ox, oy] = HEAD_OFS[2]!;
    const k = (e.cbQi ?? 0) - 2;
    const d = turn(aimAt(s, e.x + ox, e.y + oy), k % 2 === 0 ? 0 : k);
    Object.assign(enemyShot(s, e.x + ox, e.y + oy + 6, d[0], d[1], R.QI_SPEED, hitDamage(s) * R.QI_MUL), { from: "cerbblade", look: "bigwave", r: R.QI_R });
    e.cbQi!--;
  }
}

/** 오른쪽 머리 전역 검기 3연: 붉은 원형 파동 (기둥도 못 막음, 대시 무적으로 넘음) */
function sweeps(s: RunState, e: EnemyState, gap: number): void {
  const [ox, oy] = HEAD_OFS[2]!;
  for (let i = 0; i < R.SWEEPS; i++) addWave(e, e.x + ox, e.y + oy, 30 + i * gap, R.SWEEP_SPEED, 560, hitDamage(s) * R.SWEEP_MUL);
}

/** 세 머리 동시: 바위 10곳 두 번 · 화염볼 15연발 · 전역 검기 3연 (간격이 대시 재사용과 거의 같음) */
function triple(s: RunState, e: EnemyState): void {
  e.cbHead = 3;
  pose(s, e, 3, 120);
  rocks(s, e, R.TRIPLE_ROCKS);
  rocks(s, e, R.TRIPLE_ROCKS, 90);
  e.cbFire = R.TRIPLE_FIRE;
  e.cbFireGap = R.TRIPLE_FIRE_GAP;
  sweeps(s, e, R.TRIPLE_GAP);
  e.timer = 30 + R.TRIPLE_GAP * R.SWEEPS + 60;
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 50, maxTicks: 24 });
}

/** 갈라지기: 사슬 넷이 하나씩 끊기고(aux = 끊긴 수) 세 사람이 섬 */
function splitTick(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const t = s.tick - e.cbSplit!;
  pose(s, e, 3, 2);
  const cut = Math.min(4, Math.floor(t / 24));
  if (cut > (e.cbCut ?? 0)) {
    e.cbCut = cut;
    addEffect(s, { kind: "burst", x: e.x + (cut % 2 === 0 ? 40 : -40), y: e.y + 10, dirX: 0, dirY: 0, size: 20, maxTicks: 18 });
  }
  if (t < R.SPLIT) return;
  const mul = e.maxHp / ENEMIES.cerberus.hp;
  CERB_TRIO.forEach((kind, i) => {
    const b = makeEnemy(s, kind, ROOM_CX + (i - 1) * 120, ROOM_MIN_Y + (i === 1 ? 40 : 60), mul, 90 + i * 30);
    spawned.push(b);
    addEffect(s, { kind: "burst", x: b.x, y: b.y, dirX: 0, dirY: 0, size: 30, maxTicks: 24 });
  });
  e.cbPhase = 2;
  e.air = true;
  e.cbNextBig = s.tick + R.BIG_FIRST;
  e.cbBig = 0;
}

/** 페이즈 2 지휘자: 체력 = 세 사람의 합 · 무너지는 바닥 · 바위 비 · 염희 빨아들이기 */
function director(s: RunState, e: EnemyState): void {
  e.immune = true;
  const trio = s.enemies.filter((o) => (CERB_TRIO as readonly string[]).includes(o.kind) && o.hp > 0);
  if (trio.length === 0) {
    e.immune = false;
    e.hp = 0;
    return;
  }
  e.hp = Math.max(1, trio.reduce((sum, o) => sum + o.hp, 0));
  floorTick(s, e);
  // 다 무너진 뒤 버티는 동안: 남은 구역 둘레에 약한 공격
  if (floorHold(s, e) && s.tick % 150 === 0) {
    const [l, t, r, b] = cellRect(e.cbFloor!.safe);
    for (const [x, y] of [[l, t], [r, b], [(l + r) / 2, t]] as const) addShape(s, 50, { x, y, radius: 16, damage: hitDamage(s) * 0.5, fx: "meteor" });
  }
  if (floorBusy(s, e) || s.tick < (e.cbNextBig ?? 0)) return;
  const flame = trio.find((o) => o.kind === "cerbflame");
  const big = ["floor", "rain", "pull"][(e.cbBig ?? 0) % 3]!;
  e.cbBig = (e.cbBig ?? 0) + 1;
  e.cbNextBig = s.tick + R.BIG_GAP;
  if (big === "floor" && trio.length === CERB_TRIO.length) {
    // 셋이 모여 동시에 바닥을 내려찍음 (모이는 1.5초 무적, sim/bossCerbTrio)
    startFloor(s, e, 90);
    e.cbNextBig = e.cbFloor!.end + R.BIG_GAP / 2;
  } else if (big === "pull" && flame) startPull(s, flame);
  else rain(s, e);
}

/** 바위 비: 방 곳곳 + 내 자리 (맞으면 기절·화상) */
function rain(s: RunState, e: EnemyState): void {
  const rng = createRng(deriveSeed(s.seed, "cerbRain", e.cbBig ?? 0));
  for (let i = 0; i < R.RAIN; i++) {
    const mine = i % 6 === 0;
    const x = mine ? s.player.x : rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10);
    const y = mine ? s.player.y : rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10);
    addShape(s, R.RAIN_WARN + i * R.RAIN_GAP, { x, y, radius: R.RAIN_R, damage: hitDamage(s) * 0.6, by: "cerberus", fx: "meteor" }, i * R.RAIN_GAP);
  }
}
