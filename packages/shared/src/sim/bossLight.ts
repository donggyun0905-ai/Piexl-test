// 태초의 빛: 아무 데로나 쏘는 레이저 빔 · 위에서 떨어지는 빛의 화살 · 빛·어둠 화살 15발 난사(벽에 튕김) · 벽에 빠르게 튕기는 화살 2발
// 기억력(흰 선이 차례로 깔리고 거꾸로 터짐) · 혼자 남으면(step 2) 그물(방향키 5개) · 검신 소환 · 네 방향 빔이 천천히 한 바퀴 · 거울(이동 반대) · 빛의 십자 · 프리즘 산개가 더해짐
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { fan, hitDamage, keepAway, ring, shotDamage } from "./bossKit";
import { summonHost, ultReady, updateHost } from "./bossUlts";
import { memoryLines, primevalMerge } from "./bossPrimeval";
import { mirrorPlayer } from "./bossBinds";
import { damagePlayer as damagePlayer_ } from "./combat";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, makeEnemy, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossLight", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 레이저 수·길이 · 빛의 화살 수·반경·흩어지는 거리 · 네 방향 빔 시간·처음 예고 · 한 틱에 도는 [cos, sin] · 빔 굵기(반) */
  LASERS: 7,
  LASER_LEN: 300,
  ARROWS: 12,
  ARROW_R: 20,
  ARROW_SPREAD: 90,
  /** 혼자 남았을 때 방 전체에 떨어지는 빛의 화살 수 */
  RAIN: 35,
  BEAM_TICKS: 420,
  BEAM_WARM: 45,
  BEAM_W: 6,
  /** 난사: 빛·어둠이 합쳐 벽에 튕기는 화살 15발 (빛 8 · 어둠 7) · 빠르기 */
  SCATTER_LIGHT: 8,
  SCATTER_DARK: 7,
  SCATTER_SPEED: 2.6,
  /** 검신 소환 체력 배율 */
  SWORDGOD_HP: 1.5,
};
export { R as BOSS_LIGHT_RULES };

type Vec = readonly [number, number];
type Pattern = "lasers" | "arrows" | "bounce" | "net" | "beams" | "cross" | "prism" | "memory" | "mirror" | "scatter" | "swordgod";

const EARLY: readonly Pattern[] = ["lasers", "arrows", "scatter", "memory", "bounce"];
const LATE: readonly Pattern[] = ["lasers", "net", "swordgod", "arrows", "memory", "beams", "mirror", "bounce", "cross", "prism"];
const BEAM_TURN: Vec = [0.99991, 0.0131];

/** 점과 반직선(o에서 d쪽으로 len) 사이 거리 */
function rayDist(px: number, py: number, ox: number, oy: number, d: Vec, len: number): number {
  const t = Math.max(0, Math.min(len, (px - ox) * d[0] + (py - oy) * d[1]));
  return Math.hypot(ox + d[0] * t - px, oy + d[1] * t - py);
}

/** 네 방향 빔: 지금 방향과 90도씩 돌린 셋 */
export function beamDirs(b: Vec): Vec[] {
  return [b, [-b[1], b[0]], [-b[0], -b[1]], [b[1], -b[0]]];
}

export function updateLight(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  primevalMerge(s, e);
  if (e.step === 2 && ultReady(e)) summonHost(s, e, spawned);
  updateHost(s, e);
  const p = s.player;
  // 네 방향 빔: 천천히 돌며 닿으면 피해 (처음 0.75초는 예고)
  if ((e.beamTicks ?? 0) > 0) {
    e.beamTicks = (e.beamTicks ?? 0) - 1;
    const b = e.beam ?? [1, 0];
    const r = normalize(b[0] * BEAM_TURN[0] - b[1] * BEAM_TURN[1], b[0] * BEAM_TURN[1] + b[1] * BEAM_TURN[0]) ?? [1, 0];
    e.beam = [r[0], r[1]];
    if (R.BEAM_TICKS - e.beamTicks > R.BEAM_WARM && beamDirs(e.beam).some((d) => rayDist(p.x, p.y, e.x, e.y, d, 400) < R.BEAM_W + p.r)) damagePlayer(s, hitDamage(s));
    return;
  }
  keepAway(s, e, toP, go, 90, ENEMIES.plight.speed);
  e.dirX = toP[0];
  if (e.timer > 0) return;
  const list = e.step === 2 ? LATE : EARLY;
  const pat = list[e.count % list.length]!;
  e.count++;
  e.timer = e.step === 2 ? 70 : 90;
  const rng = createRng(deriveSeed(s.seed, "plight", e.count, s.tick));
  if (pat === "lasers") {
    for (let i = 0; i < R.LASERS; i++) {
      const d = normalize(rng.nextFloat() * 2 - 1, rng.nextFloat() * 2 - 1) ?? [1, 0];
      addShape(s, 30 + i * 4, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + d[0] * R.LASER_LEN, toY: e.y + d[1] * R.LASER_LEN, width: 8, fx: "gleam" });
    }
  } else if (pat === "arrows" && e.step === 2) {
    // 혼자 남으면 방 전체에 빛의 화살 비 (차례로 떨어짐)
    for (let i = 0; i < R.RAIN; i++) {
      const x = ROOM_MIN_X + R.ARROW_R / 2 + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X - R.ARROW_R);
      const y = ROOM_MIN_Y + R.ARROW_R / 2 + rng.nextFloat() * (ROOM_MAX_Y - ROOM_MIN_Y - R.ARROW_R);
      addShape(s, 40 + i * 3, { x, y, radius: R.ARROW_R, damage: hitDamage(s), fx: "holy" });
    }
    e.timer = 110;
  } else if (pat === "arrows") {
    for (let i = 0; i < R.ARROWS; i++) {
      const x = p.x + (rng.nextFloat() * 2 - 1) * R.ARROW_SPREAD;
      const y = p.y + (rng.nextFloat() * 2 - 1) * R.ARROW_SPREAD;
      addShape(s, 40 + i * 3, { x, y, radius: R.ARROW_R, damage: hitDamage(s), fx: "holy" });
    }
  } else if (pat === "bounce") {
    fan(s, e, toP, [-1, 1], 3.6, { look: "arrow", bounces: 3 });
  } else if (pat === "scatter") {
    // 빛·어둠 화살 난사: 아무 방향으로나, 벽에 3번 튕김
    const dark = s.enemies.find((o) => o.kind === "pdark" && o.hp > 0);
    for (let i = 0; i < R.SCATTER_LIGHT + R.SCATTER_DARK; i++) {
      const from = i < R.SCATTER_LIGHT || !dark ? e : dark;
      const d = normalize(rng.nextFloat() * 2 - 1, rng.nextFloat() * 2 - 1) ?? [1, 0];
      const look = i < R.SCATTER_LIGHT ? ("larrow" as const) : ("darrow" as const);
      Object.assign(enemyShot(s, from.x, from.y, d[0], d[1], R.SCATTER_SPEED, shotDamage(s)), { look, bounces: 3, ticksLeft: 600 });
    }
  } else if (pat === "swordgod") {
    // 검신 소환 (한 번에 하나)
    if (!s.enemies.some((o) => o.kind === "swordgod" && o.hp > 0) && !spawned.some((o) => o.kind === "swordgod")) {
      const g = makeEnemy(s, "swordgod", e.x - toP[0] * 40, e.y - toP[1] * 40, R.SWORDGOD_HP, 60);
      g.noGold = true;
      spawned.push(g);
      addEffect(s, { kind: "burst", x: g.x, y: g.y, dirX: 0, dirY: 0, size: 16, maxTicks: 20 });
    }
  } else if (pat === "memory") {
    memoryLines(s, e);
    e.timer = 260;
  } else if (pat === "mirror") {
    // 거울: 5초 동안 이동 방향이 반대 + 그동안 빛의 화살
    mirrorPlayer(s);
    for (let i = 0; i < R.ARROWS; i++) addShape(s, 60 + i * 12, { x: p.x + (rng.nextFloat() * 2 - 1) * R.ARROW_SPREAD, y: p.y + (rng.nextFloat() * 2 - 1) * R.ARROW_SPREAD, radius: R.ARROW_R, damage: hitDamage(s), fx: "holy" });
  } else if (pat === "net") {
    Object.assign(enemyShot(s, e.x, e.y, toP[0], toP[1], 2.2, shotDamage(s) / 2), { r: 4, look: "net" as const, net: true });
  } else if (pat === "beams") {
    e.beam = [toP[0], toP[1]];
    e.beamTicks = R.BEAM_TICKS;
    e.timer = 40;
  } else if (pat === "cross") {
    // 빛의 십자: 플레이어를 지나는 가로·세로 선
    addShape(s, 45, { x: ROOM_MIN_X, y: p.y, radius: 0, damage: hitDamage(s), toX: ROOM_MAX_X, toY: p.y, width: 12, fx: "gleam" });
    addShape(s, 45, { x: p.x, y: ROOM_MIN_Y, radius: 0, damage: hitDamage(s), toX: p.x, toY: ROOM_MAX_Y, width: 12, fx: "gleam" });
  } else {
    // 프리즘 산개: 빛 구슬 고리 두 겹
    ring(s, e, 1, e.count, 1.0, { look: "light" });
    ring(s, e, 2, e.count + 1, 1.5, { look: "light" });
  }
}
