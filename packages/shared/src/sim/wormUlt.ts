// 데스웜 필살기 (체력 10% 아래 한 번): 맵 가운데에 머리만 내밀고 무적 · 둘레에 동그란 모래지옥(안에 있으면 조금씩 끌려감)
// 입에서 몬스터 떼(땅 골렘 · 슬라임)와 독액이 사방으로 · 독액은 바닥에 닿으면 독 웅덩이 · 몬스터를 다 잡을 때까지 무적이 이어짐
import { ROOM_CX, ROOM_CY } from "../constants";
import { createRng, deriveSeed } from "../rng";
import type { EnemyKind } from "../content";
import { poisonPlayer } from "./bossGrip";
import { depth } from "./hero";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 모래지옥 반경 · 끌려가는 빠르기 */
  PIT_R: 150,
  PULL: 0.32,
  /** 몬스터 떼: 몇 번 · 간격 · 한 번에 골렘 · 슬라임 수 */
  WAVES: 3,
  WAVE_GAP: 140,
  GOLEMS: 3,
  SLIMES: 3,
  /** 독액: 간격 · 한 번에 수 · 날아가는 빠르기 · 가장 짧은·긴 날아가는 틱 */
  GLOB_GAP: 60,
  GLOBS: 4,
  GLOB_SPEED: 1.6,
  GLOB_MIN: 30,
  GLOB_MAX: 110,
  /** 독 웅덩이 반경 · 남는 틱 */
  POOL_R: 20,
  POOL_LIFE: 300,
};
export { R as WORM_ULT_RULES };

export const WORM_PIT_R = R.PIT_R;
export const WORM_POOL_R = R.POOL_R;

export function startWormUlt(s: RunState, e: EnemyState): void {
  e.ultAt = s.tick;
  e.x = ROOM_CX;
  e.y = ROOM_CY;
  e.air = false;
  e.phase = "act";
  delete e.wormPath;
  e.brood = [];
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2, maxTicks: 24 });
}

/** 입에서 몬스터 떼 */
function brood(s: RunState, e: EnemyState, wave: number, spawned: EnemyState[]): void {
  const kinds: EnemyKind[] = [...Array<EnemyKind>(R.GOLEMS).fill("golem"), ...Array<EnemyKind>(R.SLIMES).fill("slime")];
  const hpMul = 1 + 0.15 * (depth(s) - 1);
  kinds.forEach((k, i) => {
    const d = DIR16[(Math.floor((i * 16) / kinds.length) + wave * 3) % 16]!;
    const m = makeEnemy(s, k, e.x + d[0] * (e.r + 14), e.y + d[1] * (e.r + 14), hpMul, 30);
    spawned.push(m);
    e.brood!.push(m.id);
  });
}

export function updateWormUlt(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const t = s.tick - e.ultAt!;
  const p = s.player;
  e.x = ROOM_CX;
  e.y = ROOM_CY;
  e.air = false;
  // 모래지옥: 안에 있으면 머리 쪽으로 끌려감
  const dx = e.x - p.x;
  const dy = e.y - p.y;
  const d = Math.hypot(dx, dy);
  if (d < R.PIT_R && d > 1) {
    p.x += (dx / d) * R.PULL;
    p.y += (dy / d) * R.PULL;
  }
  if (t % R.WAVE_GAP === 30 && t < R.WAVES * R.WAVE_GAP) brood(s, e, Math.floor(t / R.WAVE_GAP), spawned);
  if (t % R.GLOB_GAP === 0) {
    // 독액: 사방으로 날아가 바닥에 떨어짐
    const rng = createRng(deriveSeed(s.seed, "wormGlob", e.id, t));
    for (let i = 0; i < R.GLOBS; i++) {
      const v = DIR16[(rng.int(0, 15) + i * 3) % 16]!;
      (e.globs ??= []).push({ x: e.x, y: e.y, vx: v[0] * R.GLOB_SPEED, vy: v[1] * R.GLOB_SPEED, t: rng.int(R.GLOB_MIN, R.GLOB_MAX) });
    }
  }
  // 몬스터가 다 나오고 다 쓰러지면 끝
  const alive = s.enemies.some((o) => e.brood?.includes(o.id) && o.hp > 0) || spawned.length > 0;
  if (t >= R.WAVES * R.WAVE_GAP && !alive) {
    e.ultAt = undefined;
    e.brood = [];
    e.phase = "walk";
    e.timer = 60;
    e.air = true;
    e.immune = true;
  }
}

/** 날아가는 독액 · 바닥 독 웅덩이 (필살기가 끝나도 웅덩이는 남은 틱만큼) */
export function updatePools(s: RunState, e: EnemyState): void {
  const p = s.player;
  for (const g of e.globs ?? []) {
    g.x += g.vx;
    g.y += g.vy;
    if (--g.t <= 0) (e.pools ??= []).push({ x: g.x, y: g.y, t: R.POOL_LIFE });
  }
  if (e.globs) e.globs = e.globs.filter((g) => g.t > 0);
  if (!e.pools) return;
  for (const pool of e.pools) {
    pool.t--;
    const rr = R.POOL_R + p.r;
    if ((pool.x - p.x) ** 2 + (pool.y - p.y) ** 2 < rr * rr && p.dashTicks <= 0) poisonPlayer(s);
  }
  e.pools = e.pools.filter((pool) => pool.t > 0);
}
