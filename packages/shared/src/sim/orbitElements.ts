// 원소술사 원소(불·물·땅·번개·풀)와 행성 8개의 효과 (피해는 orbit에서 따로)
import { ENEMIES } from "../content";
import { blastAt, damageEnemy, healPlayer, ignite } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, keepInRoom, roomGrid } from "./util";

export type Element = "fire" | "water" | "earth" | "thunder" | "grass";
export const ELEMENTS: readonly Element[] = ["fire", "water", "earth", "thunder", "grass"];
/** 행성 8개: 빙결 · 범위 · 밀치기 · 불 · 흡혈 · 둔화 · 공격 늦추기 · 보호막 */
export type Planet = "freeze" | "area" | "push" | "burn" | "leech" | "slow" | "stall" | "guard";
export const PLANETS: readonly Planet[] = ["freeze", "area", "push", "burn", "leech", "slow", "stall", "guard"];

/** 원소: 물 둔화 틱 · 땅 밀치기 · 번개 추가 피해 · 풀 범위 */
const WATER_SLOW = 90;
const EARTH_PUSH = 14;
const THUNDER_ADD = 0.8;
const GRASS_RADIUS = 26;
/** 풀·범위 행성의 주변 피해 비율 */
const SIDE_MUL = 0.5;

/** 원소 효과 (피해는 따로) */
export function elementEffect(s: RunState, e: EnemyState, el: Element, dmg: number, dx: number, dy: number): void {
  const boss = ENEMIES[e.kind].boss;
  if (el === "fire") ignite(e, dmg);
  else if (el === "water") e.slowTicks = Math.max(e.slowTicks ?? 0, WATER_SLOW);
  else if (el === "earth" && !boss && e.kind !== "dummy") {
    e.x += dx * EARTH_PUSH;
    e.y += dy * EARTH_PUSH;
    keepInRoom(e, roomGrid(s));
  } else if (el === "thunder") {
    damageEnemy(s, e, dmg * THUNDER_ADD, dx, dy);
    addEffect(s, { kind: "bolt", x: e.x, y: e.y - 18, dirX: 0, dirY: 0, size: 0, maxTicks: 8, toX: e.x, toY: e.y });
  } else if (el === "grass") {
    for (const o of s.enemies) if (o.hp > 0 && dist2(o, e) <= GRASS_RADIUS * GRASS_RADIUS) ignite(o, dmg * SIDE_MUL);
    addEffect(s, { kind: "verdant", x: e.x, y: e.y, dirX: 0, dirY: 0, size: GRASS_RADIUS, maxTicks: 14 });
  }
}

export function planetEffect(s: RunState, e: EnemyState, pl: Planet, dmg: number, dx: number, dy: number): void {
  const p = s.player;
  const boss = ENEMIES[e.kind].boss;
  if (pl === "freeze") e.stunTicks = boss ? 30 : 60;
  else if (pl === "area") blastAt(s, e.x, e.y, 22, dmg * SIDE_MUL, { exclude: e });
  else if (pl === "push") elementEffect(s, e, "earth", dmg, dx * 1.6, dy * 1.6);
  else if (pl === "burn") ignite(e, dmg);
  else if (pl === "leech") healPlayer(s, dmg * 0.1);
  else if (pl === "slow") e.slowTicks = Math.max(e.slowTicks ?? 0, 120);
  else if (pl === "stall") e.timer += 40;
  else p.shieldPts = Math.min(p.stats.maxHp * 0.2, (p.shieldPts ?? 0) + 2);
}
