// 레비아탄 페이즈 2 심연고래: 수면 위 방 (늘 느려짐, terrain 물) · 고래는 물 아래 그림자로 돌다가 랜덤한 자리에서 떠올라 공격 하나 → 다시 잠김
// 잠수 중 무적 · 기본 공격 물 탄환 · 푸른 지진 3번(원형 파동, 대시로 넘음) · 물기둥 세 줄 / 패턴 맵 곳곳 물기둥 · 사슬 팔(기절 1.5초)
import { createRng, deriveSeed } from "../rng";
import { hitDamage, turn } from "./bossKit";
import { addWave, updateWaves } from "./bossWaves";
import { addShape } from "./hazards";
import { levPose } from "./bossLeviathan";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 잠수 틱 (체력 절반 아래면 UNDER_FAST) · 떠오르는 예고 · 올라와 있는 틱 · 잠기는 틱 · 물 아래 헤엄 빠르기 · 떠오를 자리는 나에게서 이만큼 떨어진 곳 */
  UNDER: 240,
  UNDER_FAST: 170,
  RISE: 60,
  UP: 170,
  DIVE: 30,
  SWIM: 1.6,
  FAR: 70,
  /** 떠오를 때 물보라 반경 · 피해 배율 */
  SPLASH_R: 30,
  SPLASH_MUL: 0.8,
  /** 물 탄환: 수 · 간격 · 빠르기 · 크기 · 피해 배율 */
  SPRAY: 40,
  SPRAY_GAP: 3,
  SPRAY_SPEED: 1.7,
  SPRAY_R: 4,
  SPRAY_MUL: 0.45,
  /** 푸른 지진 (원형 파동, 대시로 넘음): 수 · 간격 · 빠르기 · 피해 배율 */
  QUAKES: 3,
  QUAKE_GAP: 52,
  QUAKE_SPEED: 2.4,
  QUAKE_MUL: 0.75,
  /** 물기둥 세 줄 (나를 향해 다가옴): 줄마다 수 · 간격(거리) · 예고 · 하나 사이 틱 · 반경 · 피해 배율 */
  LINE_STEPS: 9,
  LINE_STEP: 20,
  LINE_WARN: 30,
  LINE_GAP: 9,
  LINE_R: 13,
  LINE_MUL: 0.7,
  /** 맵 곳곳 물기둥 (패턴 1): 간격 · 수 · 예고 · 반경 · 피해 배율 */
  GEYSER_EVERY: 120,
  GEYSERS: 2,
  GEYSER_WARN: 48,
  GEYSER_R: 16,
  GEYSER_MUL: 0.55,
  /** 사슬 팔 (패턴 2, 기절 1.5초 foeStatus): 간격 · 그림자가 따라오는 틱 · 멈춘 뒤 솟는 틱 · 반경 · 수 · 피해 배율 */
  ARM_EVERY: 480,
  ARM_FOLLOW: 72,
  ARM_WARN: 24,
  ARM_R: 14,
  ARMS: 3,
  ARM_MUL: 0.4,
};
export { R as BOSS_LEV_WHALE_RULES };

type Vec = readonly [number, number];

/** 고래가 물 위에 있는지 (그리기: 머리 선명 · 아니면 그림자) */
export const whaleUp = (e: EnemyState) => e.lhUp === 1 || e.lhUp === 2;

export function updateLevWhale(s: RunState, e: EnemyState, _toP: Vec): void {
  e.stunTicks = 0;
  if (e.lhUp === undefined) {
    e.lhUp = 0;
    e.lhAt = s.tick;
    e.lhNextGeyser = s.tick + R.GEYSER_EVERY;
    e.lhNextArm = s.tick + R.ARM_EVERY / 2;
    pickSpot(s, e);
  }
  if ((e.lhPoseEnd ?? 0) <= s.tick) e.lhPose = 0;
  updateWaves(s, e);
  sprayTick(s, e);
  patterns(s, e);
  const t = s.tick - (e.lhAt ?? s.tick);
  const next = (st: number) => {
    e.lhUp = st;
    e.lhAt = s.tick;
  };
  if (e.lhUp === 0) {
    // 물 아래: 무적, 그림자만 헤엄쳐 떠오를 자리로
    e.immune = e.air = true;
    const d = normalize((e.lhTx ?? e.x) - e.x, (e.lhTy ?? e.y) - e.y);
    const far = Math.hypot((e.lhTx ?? e.x) - e.x, (e.lhTy ?? e.y) - e.y);
    if (d && far > R.SWIM) {
      e.x += d[0] * R.SWIM;
      e.y += d[1] * R.SWIM;
      e.dirX = d[0];
    }
    if (t >= (e.hp * 2 < e.maxHp ? R.UNDER_FAST : R.UNDER)) {
      e.x = e.lhTx ?? e.x;
      e.y = e.lhTy ?? e.y;
      addShape(s, R.RISE, { x: e.x, y: e.y, radius: R.SPLASH_R, damage: hitDamage(s) * R.SPLASH_MUL, fx: "pillar", from: "levsplash" });
      levPose(s, e, 0, R.RISE);
      next(1);
    }
  } else if (e.lhUp === 1) {
    if (t >= R.RISE) {
      e.immune = e.air = false;
      attack(s, e);
      next(2);
    }
  } else if (e.lhUp === 2) {
    if (t >= R.UP) {
      levPose(s, e, 3, R.DIVE);
      e.immune = true;
      next(3);
    }
  } else if (t >= R.DIVE) {
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 20, maxTicks: 16, foe: true });
    pickSpot(s, e);
    next(0);
  }
}

/** 떠오를 자리 (나에게서 FAR 이상 떨어진 곳, 시드) */
function pickSpot(s: RunState, e: EnemyState): void {
  const rng = createRng(deriveSeed(s.seed, "levWhale", e.id, s.tick));
  for (let i = 0; i < 12; i++) {
    e.lhTx = rng.int(ROOM_MIN_X + 40, ROOM_MAX_X - 40);
    e.lhTy = rng.int(ROOM_MIN_Y + 40, ROOM_MAX_Y - 30);
    if (Math.hypot(e.lhTx - s.player.x, e.lhTy - s.player.y) >= R.FAR) return;
  }
}

/** 올라와서 공격 하나 (차례로): 물 탄환 · 푸른 지진 3번 · 물기둥 세 줄 */
function attack(s: RunState, e: EnemyState): void {
  const k = e.count % 3;
  e.count++;
  if (k === 0) {
    e.lhSpray = R.SPRAY;
    levPose(s, e, 2, R.SPRAY * R.SPRAY_GAP);
  } else if (k === 1) {
    for (let i = 0; i < R.QUAKES; i++) addWave(e, e.x, e.y, 20 + i * R.QUAKE_GAP, R.QUAKE_SPEED, 600, hitDamage(s) * R.QUAKE_MUL);
    levPose(s, e, 4, 20 + R.QUAKE_GAP * R.QUAKES);
  } else {
    const aim = normalize(s.player.x - e.x, s.player.y - e.y) ?? [0, 1];
    for (const k2 of [-2, 0, 2]) {
      const d = turn(aim, k2);
      for (let i = 0; i < R.LINE_STEPS; i++) {
        const x = e.x + d[0] * (28 + i * R.LINE_STEP);
        const y = e.y + d[1] * (28 + i * R.LINE_STEP);
        if (x < ROOM_MIN_X || x > ROOM_MAX_X || y < ROOM_MIN_Y || y > ROOM_MAX_Y) break;
        addShape(s, R.LINE_WARN + i * R.LINE_GAP, { x, y, radius: R.LINE_R, damage: hitDamage(s) * R.LINE_MUL, fx: "pillar", from: "levpillar" }, i * R.LINE_GAP);
      }
    }
    levPose(s, e, 1, 60);
  }
}

/** 틱마다: 남은 물 탄환을 하나씩 (나를 향해 좌우로 흔들며 넓게) */
function sprayTick(s: RunState, e: EnemyState): void {
  if ((e.lhSpray ?? 0) <= 0 || s.tick % R.SPRAY_GAP !== 0) return;
  const n = e.lhSpray!;
  e.lhSpray = n - 1;
  const aim = normalize(s.player.x - e.x, s.player.y - e.y) ?? [0, 1];
  const d = turn(aim, [0, -2, 1, -1, 2, -3, 3, 0][n % 8]!);
  Object.assign(enemyShot(s, e.x + aim[0] * 14, e.y + aim[1] * 14 - 6, d[0], d[1], R.SPRAY_SPEED, hitDamage(s) * R.SPRAY_MUL), { from: "levwhale", look: "wave", r: R.SPRAY_R });
}

/** 패턴: 맵 곳곳 물기둥 · 사슬 팔 (그림자가 내 발밑을 따라오다 멈추고 솟아 묶음) */
function patterns(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (s.tick >= (e.lhNextGeyser ?? 0)) {
    e.lhNextGeyser = s.tick + R.GEYSER_EVERY;
    const rng = createRng(deriveSeed(s.seed, "levGeyser", e.id, s.tick));
    for (let i = 0; i < R.GEYSERS; i++) {
      const x = rng.int(ROOM_MIN_X + 10, ROOM_MAX_X - 10);
      const y = rng.int(ROOM_MIN_Y + 10, ROOM_MAX_Y - 10);
      addShape(s, R.GEYSER_WARN, { x, y, radius: R.GEYSER_R, damage: hitDamage(s) * R.GEYSER_MUL, fx: "pillar", from: "levpillar" });
    }
  }
  if (s.tick >= (e.lhNextArm ?? 0)) {
    e.lhNextArm = s.tick + R.ARM_EVERY;
    e.lhArmAt = s.tick;
  }
  if (e.lhArmAt !== undefined && s.tick - e.lhArmAt === R.ARM_FOLLOW) {
    const rng = createRng(deriveSeed(s.seed, "levArm", e.id, s.tick));
    for (let i = 0; i < R.ARMS; i++) {
      const v = DIR16[rng.int(0, 15)]!;
      const k = i === 0 ? 0 : rng.int(24, 56);
      addShape(s, R.ARM_WARN, { x: p.x + v[0] * k, y: p.y + v[1] * k, radius: R.ARM_R, damage: hitDamage(s) * R.ARM_MUL, by: "levwhale", fx: "spike", from: "levarm" });
    }
    e.lhArmAt = undefined;
  }
}
