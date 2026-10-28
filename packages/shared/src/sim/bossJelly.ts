// 시즌 2 2단계 보스 번개 해파리: 보스방 바닥 곳곳에 얕은 물. 떠다니며 거리를 두고 차례로 ① 물 감전(예고 뒤 물 위 사람이 데미지) ② 천천히 떠도는 전기 방울
// ③ 세 갈래 번개 줄 ④ 가까이 오면 촉수 휘두르기. 체력 절반 아래면 감전이 길고 방울·줄이 늘어남 (감전은 sim/terrain)
import { TILE_SIZE } from "../constants";
import { ENEMIES } from "../content";
import { distTo, fan, half, hitDamage, keepAway, turn } from "./bossKit";
import { roomTerrain } from "./bossToad";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 감전: 예고 틱 · 감전 틱 (절반 아래면 더 김) */
  SHOCK_WARN: 60,
  SHOCK_TICKS: 90,
  SHOCK_TICKS_HALF: 140,
  /** 전기 방울: 수 · 빠르기 · 남는 틱 */
  ORBS: 3,
  ORB_SPEED: 0.55,
  ORB_TICKS: 260,
  /** 번개 줄: 길이 · 굵기 · 예고 틱 */
  BOLT_LEN: 170,
  BOLT_W: 5,
  BOLT_WARN: 34,
  /** 촉수: 가까울 때 범위 · 예고 틱 */
  SWEEP_R: 40,
  SWEEP_WARN: 26,
  /** 거리 두기 · 쉬는 틱 */
  KEEP: 80,
  REST: 75,
};
export { R as BOSS_JELLY_RULES };

type Vec = readonly [number, number];

/** 보스방 물: 양쪽 긴 물길 둘 + 가운데 아래 웅덩이 둘 (칸 [열, 행, 너비, 높이]) */
const WATER: readonly (readonly [number, number, number, number])[] = [[1, 2, 3, 8], [15, 2, 3, 8], [5, 8, 3, 2], [11, 8, 3, 2]];

function water(s: RunState): void {
  const t = roomTerrain(s);
  if (t.water.length === 0) for (const [c, r, w, h] of WATER) t.water.push([c * TILE_SIZE, r * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE]);
}

export function updateJelly(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  water(s);
  // 둥실둥실 거리를 두고 떠다님
  keepAway(s, e, toP, go, R.KEEP, ENEMIES.jelly.speed);
  e.dirX = toP[0];
  e.dirY = toP[1];
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    e.phase = "walk";
    e.timer = h ? R.REST - 25 : R.REST;
    return;
  }
  if (e.timer > 0) return;
  e.count++;
  // 가까이 붙으면 먼저 촉수
  if (distTo(s, e) < R.SWEEP_R + 8) {
    addShape(s, R.SWEEP_WARN, { x: e.x, y: e.y, radius: R.SWEEP_R, damage: hitDamage(s), fx: "vine" });
    e.phase = "windup";
    e.timer = R.SWEEP_WARN;
    return;
  }
  const pick = e.count % 3;
  if (pick === 1) {
    // 물 감전: 물이 번쩍이며 예고 → 그동안 물 위에 있으면 데미지
    const t = roomTerrain(s);
    t.shockAt = s.tick + R.SHOCK_WARN;
    t.shock = R.SHOCK_WARN + (h ? R.SHOCK_TICKS_HALF : R.SHOCK_TICKS);
    e.timer = h ? R.REST : R.REST + 20;
  } else if (pick === 2) {
    // 전기 방울: 천천히 플레이어 쪽으로 떠도는 공
    const n = R.ORBS + (h ? 2 : 0);
    const spread = Array.from({ length: n }, (_, i) => i - (n - 1) / 2);
    fan(s, e, toP, spread, R.ORB_SPEED, { look: "bolt", ticksLeft: R.ORB_TICKS, r: 5 });
    e.timer = h ? R.REST - 20 : R.REST;
  } else {
    // 세 갈래 번개 줄 (절반 아래면 다섯)
    const ks = h ? [-2, -1, 0, 1, 2] : [-1, 0, 1];
    for (const k of ks) {
      const d = turn(toP, k);
      addShape(s, R.BOLT_WARN, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + d[0] * R.BOLT_LEN, toY: e.y + d[1] * R.BOLT_LEN, width: R.BOLT_W, fx: "gleam" });
    }
    e.phase = "windup";
    e.timer = R.BOLT_WARN;
  }
}
