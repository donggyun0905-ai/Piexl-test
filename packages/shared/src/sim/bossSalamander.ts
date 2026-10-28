// 시즌 2 1단계 보스 불도롱뇽: 보스방에 용암 웅덩이 넷. 차례로 ① 불길을 남기며 돌진 ② 가까운 용암 웅덩이로 잠수(맞지 않음) → 플레이어 발밑에서 솟구침 ③ 튕기는 불덩이 뱉기
// 체력 절반 아래면 더 자주 · 솟구칠 때 불꽃 고리. 용암은 사람을 데게 함 (sim/terrain)
import { TILE_SIZE } from "../constants";
import { ENEMIES } from "../content";
import { fan, half, hitDamage, ring } from "./bossKit";
import { roomTerrain } from "./bossToad";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 돌진: 예고 틱 · 빠르기 · 틱 · 불길 간격 · 불길 범위 */
  DASH_WARN: 32,
  DASH_SPEED: 2.7,
  DASH_TICKS: 50,
  TRAIL_EVERY: 6,
  TRAIL_R: 11,
  /** 잠수: 웅덩이로 가는 빠르기 · 잠긴 틱 · 솟구치는 예고 틱·범위 */
  SWIM_SPEED: 3,
  UNDER: 50,
  RISE_WARN: 45,
  RISE_R: 32,
  /** 쉬는 틱 */
  REST: 70,
};
export { R as BOSS_SALAMANDER_RULES };

type Vec = readonly [number, number];

/** 보스방 용암 웅덩이 넷 (양쪽 위·아래, 칸 [열, 행]) */
const POOLS: readonly (readonly [number, number])[] = [[1, 3], [16, 3], [1, 8], [16, 8]];

function pools(s: RunState): [number, number, number, number][] {
  const t = roomTerrain(s);
  if (t.lava.length === 0) for (const [c, r] of POOLS) t.lava.push([c * TILE_SIZE, r * TILE_SIZE, 2 * TILE_SIZE, 2 * TILE_SIZE]);
  return t.lava;
}

export function updateSalamander(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  const lava = pools(s);
  if (e.phase === "walk") {
    e.x += go[0] * ENEMIES.salamander.speed;
    e.y += go[1] * ENEMIES.salamander.speed;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    e.count++;
    const pick = e.count % 3;
    if (pick === 1) {
      // 돌진: 플레이어 쪽 긴 선 예고
      e.phase = "windup";
      e.timer = R.DASH_WARN;
      addShape(s, R.DASH_WARN, { x: e.x, y: e.y, radius: 0, damage: 0, toX: e.x + toP[0] * R.DASH_SPEED * R.DASH_TICKS, toY: e.y + toP[1] * R.DASH_SPEED * R.DASH_TICKS, width: 8 });
    } else if (pick === 2) {
      // 가장 가까운 용암 웅덩이로 헤엄쳐 감
      let best = lava[0]!;
      let bd = Infinity;
      for (const r of lava) {
        const d = (r[0] + r[2] / 2 - e.x) ** 2 + (r[1] + r[3] / 2 - e.y) ** 2;
        if (d < bd) [bd, best] = [d, r];
      }
      e.phase = "act";
      e.step = 0;
      e.auxX = best[0] + best[2] / 2;
      e.auxY = best[1] + best[3] / 2;
      e.timer = 999;
    } else {
      fan(s, e, toP, h ? [-2, -1, 0, 1, 2] : [-1, 0, 1], 1.7, { look: "fire", bounces: 1 });
      e.timer = h ? R.REST - 25 : R.REST;
    }
  } else if (e.phase === "windup") {
    if (e.timer > 0) return;
    e.phase = "charge";
    e.timer = R.DASH_TICKS;
  } else if (e.phase === "charge") {
    // 돌진하며 지나간 자리에 불길
    e.x += e.dirX * R.DASH_SPEED;
    e.y += e.dirY * R.DASH_SPEED;
    if (e.timer % R.TRAIL_EVERY === 0) addShape(s, 14, { x: e.x, y: e.y, radius: R.TRAIL_R, damage: Math.round(hitDamage(s) * 0.5), fx: "meteor" });
    if (e.timer > 0) return;
    e.phase = "walk";
    e.timer = h ? R.REST - 25 : R.REST;
  } else if (e.phase === "act") {
    const st = e.step ?? 0;
    if (st === 0) {
      // 웅덩이까지 헤엄 (닿으면 잠수)
      const dx = (e.auxX ?? e.x) - e.x;
      const dy = (e.auxY ?? e.y) - e.y;
      const d = Math.hypot(dx, dy);
      if (d > R.SWIM_SPEED) {
        e.x += (dx / d) * R.SWIM_SPEED;
        e.y += (dy / d) * R.SWIM_SPEED;
        return;
      }
      e.step = 1;
      e.immune = true;
      e.air = true;
      e.timer = R.UNDER;
    } else if (st === 1) {
      if (e.timer > 0) return;
      // 플레이어 발밑에 솟구칠 자리 예고
      e.step = 2;
      e.auxX = s.player.x;
      e.auxY = s.player.y;
      e.timer = R.RISE_WARN;
      addShape(s, R.RISE_WARN, { x: s.player.x, y: s.player.y, radius: R.RISE_R * (h ? 1.2 : 1), damage: hitDamage(s), fx: "meteor" });
    } else {
      if (e.timer > 0) return;
      e.x = e.prevX = e.auxX ?? e.x;
      e.y = e.prevY = e.auxY ?? e.y;
      e.immune = false;
      e.air = false;
      if (h) ring(s, e, 2, e.count, 1.4, { look: "fire" });
      e.phase = "walk";
      e.timer = h ? R.REST - 20 : R.REST;
    }
  }
}
