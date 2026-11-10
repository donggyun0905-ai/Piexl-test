// 아스모데우스의 화신체 50~0줄: 강철 군주의 화신 (붉은 갑옷, 느리게 걸어서 다가옴)
// 기본 공격: 붉은 베기 2연(두 번째 자리에 결정 조각) · 붉은 고리 구슬(내 자리에서 고리가 퍼짐) · 하늘 결정 창 7개(꽂히면 잠깐 벽)
// 패턴: 강철의 몸 (앞에서 맞는 피해 -90%, 등 뒤로 돌아야) · 톱니 날 고리 · 화신의 기억 (30줄·15줄: 두 빛의 바닥 + 보라 레이저)
import { addBlock, startChess } from "./asmoKit";
import { asmoLines, asmoPose, asmoTired } from "./bossAsmo";
import { startLasers } from "./bossAsmoVoid";
import { hitDamage } from "./bossKit";
import { addWave } from "./bossWaves";
import { envDamage } from "./combat";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import { eachSeat } from "./party";
import type { EnemyState, RunState } from "./types";
import { normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 공격 사이 틱 · 걷는 빠르기 · 이만큼 가까우면 멈춤 */
  GAP: 146,
  SPEED: 0.4,
  NEAR: 44,
  /** 붉은 베기 2연: 예고 · 두 번째 예고 · 반경 · 피해 배율 · 결정 조각 수 · 조각 예고 · 반경 */
  SLASH_WARN: 36,
  SLASH_WARN2: 60,
  SLASH_R: 108,
  SLASH_MUL: 1.2,
  SHARDS: 3,
  SHARD_WARN: 120,
  SHARD_R: 20,
  /** 붉은 고리 구슬: 날아가는 틱 · 고리 빠르기 · 고리 최대 반경 · 피해 배율 */
  RING_WAIT: 48,
  RING_SPEED: 1.6,
  RING_MAX: 200,
  RING_MUL: 1,
  /** 하늘 결정 창: 수 · 사이 거리 · 첫 예고 · 사이 틱 · 반경 · 피해 배율 · 벽으로 남는 틱 */
  SPEARS: 7,
  SPEAR_STEP: 28,
  SPEAR_WARN: 40,
  SPEAR_GAP: 12,
  SPEAR_R: 20,
  SPEAR_MUL: 1,
  SPEAR_BLOCK: 300,
  /** 강철의 몸: 처음 · 간격 · 길이 · 앞에서 받는 피해 배율 · 돌아보는 빠르기 (0~1) */
  ARMOR_FIRST: 500,
  ARMOR_EVERY: 1800,
  ARMOR: 360,
  ARMOR_TAKEN: 0.1,
  ARMOR_TURN: 0.02,
  /** 톱니 날 고리: 처음 · 간격 · 길이 · 날 수 · 가장 안 · 가장 바깥 반경 · 날 반경 · 피해 · 피해 간격 */
  SAW_FIRST: 1100,
  SAW_EVERY: 1500,
  SAW: 480,
  SAWS: 6,
  SAW_IN: 24,
  SAW_OUT: 150,
  SAW_R: 14,
  SAW_DMG: 14,
  SAW_EVERY_HIT: 30,
  /** 화신의 기억: 줄 · 두 빛의 바닥 길이 · 그때 색 바뀌는 간격 · 레이저 사이 */
  MEMORY_1: 30,
  MEMORY_2: 15,
  MEMORY: 480,
  MEMORY_CHESS_GAP: 150,
  MEMORY_LASER_GAP: 96,
};
export { R as BOSS_ASMO_LORD_RULES };

type Vec = readonly [number, number];

/** 강철의 몸 중 */
export const armored = (s: RunState, e: EnemyState) => (e.amArmor ?? 0) > s.tick;
/** 받는 피해 배율 (classTaken): 강철의 몸은 앞에서 맞으면 적게 · 지쳤으면 더 아픔 */
export function asmoTaken(s: RunState, e: EnemyState): number {
  if (e.kind !== "asmodeus") return 1;
  let k = asmoTired(s, e);
  if (armored(s, e)) {
    const p = s.player;
    if ((p.x - e.x) * (e.amFaceX ?? 0) + (p.y - e.y) * (e.amFaceY ?? 1) > 0) k *= R.ARMOR_TAKEN;
  }
  return k;
}
/** 톱니 날 k의 자리 */
export function sawSpot(s: RunState, e: EnemyState, k: number): [number, number] {
  const t = s.tick - (e.amSawAt ?? s.tick);
  // 0 → 1 → 0 두 번 (퍼졌다 돌아옴)
  const w = (t % (R.SAW / 2)) / (R.SAW / 2);
  const out = R.SAW_IN + (R.SAW_OUT - R.SAW_IN) * (w < 0.5 ? w * 2 : 2 - w * 2);
  const v = rot(t * 0.035 + (k * Math.PI * 2) / R.SAWS);
  return [e.x + v[0] * out, e.y + v[1] * out];
}
export const sawing = (s: RunState, e: EnemyState) => e.amSawAt !== undefined && s.tick < e.amSawAt + R.SAW;

export function lordTick(s: RunState, e: EnemyState, toP: Vec): void {
  if (e.amNextArmor === undefined) {
    e.amNextArmor = s.tick + R.ARMOR_FIRST;
    e.amNextSaw = s.tick + R.SAW_FIRST;
    e.amMemory = 0;
    e.amFaceX = toP[0];
    e.amFaceY = toP[1];
  }
  e.dirX = toP[0];
  if (Math.hypot(s.player.x - e.x, s.player.y - e.y) > R.NEAR && !armored(s, e)) {
    e.x += toP[0] * R.SPEED;
    e.y += toP[1] * R.SPEED;
  }
  patterns(s, e, toP);
  if (e.timer > 0) return;
  e.timer = R.GAP;
  const k = e.count++ % 3;
  const p = s.player;
  const dmg = hitDamage(s);
  if (k === 0) {
    addShape(s, R.SLASH_WARN, { x: e.x, y: e.y, radius: R.SLASH_R, damage: dmg * R.SLASH_MUL, dirX: toP[0], dirY: toP[1], arc: 0, fx: "bslash", from: "asmored" });
    addShape(s, R.SLASH_WARN2, { x: e.x, y: e.y, radius: R.SLASH_R, damage: dmg * R.SLASH_MUL, dirX: -toP[0], dirY: -toP[1], arc: 0, fx: "bslash", from: "asmored" });
    for (let i = 1; i <= R.SHARDS; i++) {
      const v = rot(i * 1.9);
      addShape(s, R.SHARD_WARN, { x: e.x - toP[0] * 40 + v[0] * 30, y: e.y - toP[1] * 40 + v[1] * 30, radius: R.SHARD_R, damage: dmg * 0.7, fx: "spike", from: "asmospear" });
    }
    asmoPose(s, e, 1, 60);
  } else if (k === 1) {
    // 구슬이 내 자리에 떨어지면 고리가 퍼짐 (안쪽은 안전 → 대시로 넘거나 바깥으로 멀리)
    addWave(e, p.x, p.y, R.RING_WAIT, R.RING_SPEED, R.RING_MAX, dmg * R.RING_MUL);
    addShape(s, R.RING_WAIT, { x: p.x, y: p.y, radius: 10, damage: 0, fx: "spike", from: "asmoring" });
    asmoPose(s, e, 2, 50);
  } else {
    const d = normalize(p.x - e.x, p.y - e.y) ?? [0, 1];
    for (let i = 0; i < R.SPEARS; i++) {
      const x = p.x + d[0] * (i - 3) * R.SPEAR_STEP;
      const y = p.y + d[1] * (i - 3) * R.SPEAR_STEP;
      addShape(s, R.SPEAR_WARN + i * R.SPEAR_GAP, { x, y, radius: R.SPEAR_R, damage: dmg * R.SPEAR_MUL, fx: "spike", from: "asmospear" });
    }
    asmoPose(s, e, 3, 70);
  }
}

/** 창이 꽂히는 틱마다 그 자리에 벽 (위험 표시가 터진 자리) */
function spearWalls(s: RunState, e: EnemyState): void {
  for (const h of s.hazards ?? []) if (h.from === "asmospear" && h.tick === s.tick + 1) addBlock(s, e, h.x, h.y, R.SPEAR_BLOCK);
}

/** 강철의 몸 · 톱니 날 고리 · 화신의 기억 */
function patterns(s: RunState, e: EnemyState, toP: Vec): void {
  spearWalls(s, e);
  if (s.tick >= (e.amNextArmor ?? Infinity)) {
    e.amNextArmor = s.tick + R.ARMOR_EVERY;
    e.amArmor = s.tick + R.ARMOR;
  }
  // 늘 나를 천천히 돌아봄 (강철의 몸일 때 등 뒤가 약점)
  const fx = (e.amFaceX ?? 0) + (toP[0] - (e.amFaceX ?? 0)) * R.ARMOR_TURN;
  const fy = (e.amFaceY ?? 1) + (toP[1] - (e.amFaceY ?? 1)) * R.ARMOR_TURN;
  const f = normalize(fx, fy) ?? [0, 1];
  e.amFaceX = f[0];
  e.amFaceY = f[1];
  if (s.tick >= (e.amNextSaw ?? Infinity)) {
    e.amNextSaw = s.tick + R.SAW_EVERY;
    e.amSawAt = s.tick;
    asmoPose(s, e, 4, 60);
  }
  if (sawing(s, e) && s.tick % R.SAW_EVERY_HIT === 0) {
    eachSeat(
      s,
      () => {
        const p = s.player;
        for (let k = 0; k < R.SAWS; k++) {
          const [x, y] = sawSpot(s, e, k);
          if (p.dashTicks <= 0 && Math.hypot(p.x - x, p.y - y) < R.SAW_R + p.r) {
            envDamage(s, R.SAW_DMG);
            break;
          }
        }
      },
      true,
    );
  }
  const m = e.amMemory ?? 0;
  const lines = asmoLines(e);
  if ((m === 0 && lines <= R.MEMORY_1) || (m === 1 && lines <= R.MEMORY_2)) {
    e.amMemory = m + 1;
    startChess(s, e, R.MEMORY, R.MEMORY_CHESS_GAP);
    startLasers(s, e, R.MEMORY_LASER_GAP);
  }
}
