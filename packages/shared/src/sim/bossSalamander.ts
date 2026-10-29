// 시즌 2 1단계 보스 불도롱뇽: 보스방에 용암 웅덩이 넷. 차례로 ① 불길을 남기며 돌진 (벽에 부딪히면 불꽃 고리를 터뜨리고 잠깐 비틀거림)
// ② 가까운 용암 웅덩이로 잠수(맞지 않음, 가는 길이 막히거나 늦으면 그 자리 땅속으로) → 플레이어 발밑에서 솟구침 ③ 튕기는 불덩이 뱉기 ④ 플레이어 둘레 용암 분출
// 체력 절반 아래면 더 자주 · 솟구칠 때 불꽃 고리 · 분출이 더 많음. 용암은 사람을 데게 함 (sim/terrain)
import { TILE_SIZE } from "../constants";
import { ENEMIES } from "../content";
import { fan, half, hitDamage, ring } from "./bossKit";
import { roomTerrain } from "./bossToad";
import { addShape } from "./hazards";
import { rot } from "./orbit";
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
  /** 웅덩이까지 헤엄칠 수 있는 최대 틱 (넘거나 막히면 그 자리에서 잠수) */
  SWIM_MAX: 80,
  /** 돌진하다 벽에 부딪힘: 비틀거리는 틱 */
  BONK_REST: 55,
  /** 용암 분출: 예고 틱 · 범위 · 플레이어에게서 떨어진 거리 · 개수(절반 아래면 +2) */
  ERUPT_WARN: 40,
  ERUPT_R: 24,
  ERUPT_DIST: 44,
  ERUPT_N: 3,
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
    const pick = e.count % 4;
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
      e.timer = R.SWIM_MAX;
      e.aux = 1e9;
    } else if (pick === 3) {
      // 용암 분출: 플레이어 자리와 둘레 몇 군데에 붉은 원 예고 → 터짐
      const n = R.ERUPT_N + (h ? 2 : 0);
      addShape(s, R.ERUPT_WARN, { x: s.player.x, y: s.player.y, radius: R.ERUPT_R, damage: hitDamage(s), fx: "meteor" });
      for (let i = 0; i < n; i++) {
        const [cx, cy] = rot((i / n) * Math.PI * 2 + e.count);
        addShape(s, R.ERUPT_WARN + 6 * (i + 1), { x: s.player.x + cx * R.ERUPT_DIST, y: s.player.y + cy * R.ERUPT_DIST, radius: R.ERUPT_R, damage: hitDamage(s), fx: "meteor" });
      }
      e.timer = h ? R.REST - 15 : R.REST;
    } else {
      fan(s, e, toP, h ? [-2, -1, 0, 1, 2] : [-1, 0, 1], 1.7, { look: "fire", bounces: 1 });
      e.timer = h ? R.REST - 25 : R.REST;
    }
  } else if (e.phase === "windup") {
    if (e.timer > 0) return;
    e.phase = "charge";
    e.timer = R.DASH_TICKS;
    e.auxX = e.x;
    e.auxY = e.y;
  } else if (e.phase === "charge") {
    // 벽에 막혀 지난 틱보다 거의 못 갔으면: 불꽃 고리를 터뜨리고 비틀거림 (공격할 틈)
    if (e.timer < R.DASH_TICKS - 2 && Math.hypot(e.x - (e.auxX ?? e.x), e.y - (e.auxY ?? e.y)) < R.DASH_SPEED * 0.4) {
      ring(s, e, h ? 1 : 2, e.count, 1.3, { look: "fire" });
      e.phase = "walk";
      e.timer = R.BONK_REST;
      return;
    }
    e.auxX = e.x;
    e.auxY = e.y;
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
      // 웅덩이까지 헤엄 (닿으면 잠수). 벽·기둥에 막혀 가까워지지 않거나 너무 오래 걸리면 그 자리 땅속으로 잠수
      const dx = (e.auxX ?? e.x) - e.x;
      const dy = (e.auxY ?? e.y) - e.y;
      const d = Math.hypot(dx, dy);
      const stuck = e.timer < R.SWIM_MAX - 6 && d > (e.aux ?? 1e9) - 0.3;
      e.aux = d;
      if (d > R.SWIM_SPEED && !stuck && e.timer > 0) {
        e.x += (dx / d) * R.SWIM_SPEED;
        e.y += (dy / d) * R.SWIM_SPEED;
        return;
      }
      if (d > R.SWIM_SPEED) addShape(s, 16, { x: e.x, y: e.y, radius: 14, damage: 0, fx: "meteor" });
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
