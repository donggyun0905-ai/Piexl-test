// 라스트 보스 멸망의 용: 쉬지 않고 쏟는 불 숨결 · 벽 곳곳에서 솟는 불기둥 · 무적(불꽃 방벽, 불기둥이 쫓아옴, 벽에 튕기다 터지는 빠른 불덩이)
// 체력 10% 아래면 궁극기 염옥(bossUlts) · 꼬리로 바닥을 쾅쾅 쳐 원형 파동(대시로 넘기) · 체력 절반 아래면 숨결이 더 많고 빨라지고, 메테오 · 하늘로 날아올랐다 내려찍어 바위 파편 + 긴 꼬리 휘두르기 · 꼬리 한 바퀴 · 불꽃 고리가 더해짐
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { half, hitDamage, ring, shotDamage, turn } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { addWave, updateWaves } from "./bossWaves";
import { startHellfire, ultReady, updateHellfire } from "./bossUlts";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 숨결 빠르기·간격 (절반 아래면 더 빠르고 촘촘하게 세 갈래로) · 숨결이 좌우로 훑는 순서 (16방향 칸) */
  BREATH_SPEED: 2.2,
  BREATH_SPEED_HALF: 3.2,
  BREATH_EVERY: 4,
  BREATH_EVERY_HALF: 3,
  /** 불기둥 반경 · 벽에서 띄운 거리 · 메테오 반경 · 내려찍기 반경 · 바위 파편 수 · 긴 꼬리 휘두르기 반경 · 꼬리 한 바퀴 반경 · 날아다니는 빠르기 */
  PILLAR_R: 22,
  WALL_IN: 22,
  METEOR_R: 60,
  SLAM_R: 70,
  DEBRIS: 16,
  SWEEP_R: 110,
  TAIL_R: 80,
  AIR_SPEED: 2,
  /** 무적 중 불덩이 빠르기 · 마지막에 퍼지는 작은 불꽃 수 */
  GUARD_SPEED: 2.6,
  GUARD_SHARDS: 6,
  /** 꼬리로 바닥 치기: 횟수 · 간격 · 파동 빠르기·최대 반경 */
  POUNDS: 3,
  POUND_GAP: 40,
  WAVE_SPEED: 1.6,
  WAVE_MAX: 260,
};
export { R as BOSS_DRAGON_RULES };

type Vec = readonly [number, number];
type Pattern = "breath" | "pillars" | "guard" | "meteor" | "dive" | "tail" | "nova" | "quake";

/** 차례: 처음엔 숨결 → 불기둥 → 무적, 절반 아래면 메테오·내려찍기·꼬리·불꽃 고리가 끼어듦 */
const EARLY: readonly Pattern[] = ["breath", "pillars", "quake", "guard"];
const LATE: readonly Pattern[] = ["breath", "meteor", "dive", "quake", "pillars", "tail", "guard", "nova"];
/** 패턴마다 걸리는 틱 */
const LENGTH: Record<Pattern, number> = { breath: 130, pillars: 60, guard: 240, meteor: 90, dive: 175, tail: 50, nova: 60, quake: 150 };

const SWEEP = [-2, -1, 0, 1, 2, 1, 0, -1];

function rand(s: RunState, e: EnemyState, label: string): ReturnType<typeof createRng> {
  return createRng(deriveSeed(s.seed, "dragon", label, e.count, s.tick));
}

/** 벽 가까이 무작위 자리 */
function nearWall(rng: ReturnType<typeof createRng>): [number, number] {
  const side = rng.int(0, 3);
  const along = rng.nextFloat();
  const x = ROOM_MIN_X + R.WALL_IN + along * (ROOM_MAX_X - ROOM_MIN_X - R.WALL_IN * 2);
  const y = ROOM_MIN_Y + R.WALL_IN + along * (ROOM_MAX_Y - ROOM_MIN_Y - R.WALL_IN * 2);
  if (side === 0) return [x, ROOM_MIN_Y + R.WALL_IN];
  if (side === 1) return [x, ROOM_MAX_Y - R.WALL_IN];
  if (side === 2) return [ROOM_MIN_X + R.WALL_IN, y];
  return [ROOM_MAX_X - R.WALL_IN, y];
}

export function updateDragon(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  const p = s.player;
  updateWaves(s, e);
  if (ultReady(e)) startHellfire(s, e);
  updateHellfire(s, e);
  // 염옥 동안은 자기 패턴을 멈춤
  if (e.ultAt !== undefined) return;
  if (e.phase === "walk") {
    e.x += go[0] * ENEMIES.dragon.speed;
    e.y += go[1] * ENEMIES.dragon.speed;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    e.phase = "act";
    e.aux = 0;
    return;
  }
  const list = h ? LATE : EARLY;
  const pat = list[e.count % list.length]!;
  const t = e.aux ?? 0;
  e.aux = t + 1;
  if (pat === "breath") {
    // 플레이어 쪽으로 좌우를 훑으며 불덩이를 쉬지 않고 쏟음
    const every = h ? R.BREATH_EVERY_HALF : R.BREATH_EVERY;
    if (t % every === 0) {
      const at = SWEEP[Math.floor(t / (every * 2)) % SWEEP.length]!;
      for (const k of h ? [at - 1, at, at + 1] : [at]) {
        const d = turn(toP, k);
        Object.assign(enemyShot(s, e.x + d[0] * e.r, e.y + d[1] * e.r, d[0], d[1], h ? R.BREATH_SPEED_HALF : R.BREATH_SPEED, shotDamage(s)), { look: "fire" as const, r: 5 });
      }
    }
  } else if (pat === "pillars" && t === 0) {
    const rng = rand(s, e, "pillars");
    for (let i = 0; i < (h ? 12 : 8); i++) {
      const [x, y] = nearWall(rng);
      addShape(s, 50, { x, y, radius: R.PILLAR_R, damage: hitDamage(s), fx: "pillar" });
    }
    addShape(s, 50, { x: p.x, y: p.y, radius: R.PILLAR_R, damage: hitDamage(s), fx: "pillar" });
  } else if (pat === "guard") {
    // 무적: 불꽃 방벽을 두르고, 불기둥이 플레이어를 쫓아 솟음
    e.immune = t < LENGTH.guard - 1;
    if (t % 40 === 0) addShape(s, 40, { x: p.x, y: p.y, radius: R.PILLAR_R, damage: hitDamage(s), fx: "pillar" });
    // 빠른 불덩이: 벽에 3번 튕긴 뒤 한 번 더 닿으면 작은 불꽃으로 퍼짐
    if (t % 80 === 40) ring(s, e, 2, t, R.GUARD_SPEED, { look: "fire", r: 4, bounces: 3, shatter: R.GUARD_SHARDS, ticksLeft: 900 });
  } else if (pat === "meteor" && t === 0) {
    const rng = rand(s, e, "meteor");
    addShape(s, 80, { x: p.x, y: p.y, radius: R.METEOR_R, damage: hitDamage(s) * 1.5, fx: "meteor" });
    for (let i = 0; i < 3; i++) {
      const x = rng.int(ROOM_MIN_X + R.METEOR_R, ROOM_MAX_X - R.METEOR_R);
      const y = rng.int(ROOM_MIN_Y + R.METEOR_R, ROOM_MAX_Y - R.METEOR_R);
      addShape(s, 80 + i * 10, { x, y, radius: R.METEOR_R, damage: hitDamage(s) * 1.5, fx: "meteor" });
    }
  } else if (pat === "dive") {
    dive(s, e, t);
  } else if (pat === "tail" && t === 0) {
    addShape(s, 36, { x: e.x, y: e.y, radius: R.TAIL_R, damage: hitDamage(s), arc: -1, fx: "bslash" });
  } else if (pat === "quake" && t % R.POUND_GAP === 0 && t < R.POUNDS * R.POUND_GAP) {
    // 꼬리로 바닥을 쾅: 둥근 파동이 방 끝까지 퍼짐 (대시로 넘어감)
    addShape(s, 14, { x: e.x, y: e.y + e.r, radius: e.r, damage: hitDamage(s), fx: "meteor" });
    addWave(e, e.x, e.y + e.r, 14, R.WAVE_SPEED, R.WAVE_MAX, hitDamage(s));
  } else if (pat === "nova" && t % 20 === 0) {
    ring(s, e, 1, t / 20, 1.3, { look: "fire" });
  }
  if (e.aux >= LENGTH[pat]) {
    e.immune = false;
    e.air = false;
    e.count++;
    e.phase = "walk";
    e.timer = h ? 35 : 50;
  }
}

/** 하늘로 날아올라 그림자가 플레이어를 쫓음 → 그림자 자리에 크게 내려찍고 사방으로 바위 파편 → 긴 꼬리로 크게 휘두르기 (대시로 넘김) */
function dive(s: RunState, e: EnemyState, t: number): void {
  const p = s.player;
  if (t === 0) {
    e.air = true;
    e.immune = true;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 14 });
  }
  if (t < 100) {
    const d = normalize(p.x - e.x, p.y - e.y);
    if (d) {
      e.x += d[0] * R.AIR_SPEED;
      e.y += d[1] * R.AIR_SPEED;
    }
  } else if (t === 100) {
    addShape(s, 30, { x: e.x, y: e.y, radius: R.SLAM_R, damage: hitDamage(s) * 1.5, fx: "meteor" });
  } else if (t === 130) {
    e.air = false;
    e.immune = false;
    ring(s, e, 16 / R.DEBRIS, t, 2, { look: "rock" });
    for (const pr of s.projectiles.slice(-R.DEBRIS)) pr.r = 4;
  } else if (t === 145) {
    // 긴 꼬리가 크게 한 바퀴 (예고가 짧아 대시로 넘어야 함)
    addShape(s, 20, { x: e.x, y: e.y, radius: R.SWEEP_R, damage: hitDamage(s) * 1.2, arc: -1, fx: "bslash" });
  }
}
