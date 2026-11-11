// 원소술사 원소(불·물·땅·번개·풀)와 행성 8개의 효과 (피해는 orbit에서 따로)
import { ENEMIES } from "../content";
import { blastAt as blastAt_, dotDamage, healPlayer, ignite } from "./combat";
import type { DotKind, EnemyState, RunState } from "./types";
import { addEffect, dist2, keepInRoom, roomGrid } from "./util";
import { raiseShield } from "./imugiMods";
import { srcFn } from "./dmgSrc";
const blastAt = srcFn("orbitElements", () => blastAt_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 원소: 물 둔화 틱 · 땅 밀치기 · 번개 추가 피해 · 풀 범위 */
  WATER_SLOW: 90,
  EARTH_PUSH: 14,
  THUNDER_ADD: 0.8,
  GRASS_RADIUS: 26,
  /** 풀·범위 행성의 주변 피해 비율 */
  SIDE_MUL: 0.5,
  /** 땅 기절 틱 (보스 절반) · 풀 독 틱·독 피해 배율(0.5초마다) · 행성 상태이상 피해 배율 · 행성 둔화 틱 */
  EARTH_STUN: 18,
  POISON_TICKS: 150,
  POISON_MUL: 0.2,
  PLANET_DOT: 0.3,
  PLANET_SLOW: 60,
  /** 물(물결)·땅(부식) 상태이상 피해 배율 · 무기마다 상태이상 피해 배율(빛 광휘·은하수 공허·중력 저주·갓 핸드 황금·별 폭풍) */
  ELEMENT_DOT: 0.4,
  WEAPON_DOT: 0.3,
  /** 빛 구슬: 경직 틱(0.5초, 보스 절반) · 맞힐 때 빛이 터질 확률 · 반경 · 공격력 배율 */
  LIGHT_STUN: 30,
  LIGHT_BURST: 0.3,
  LIGHT_R: 20,
  LIGHT_MUL: 1,
};
export { R as ORBIT_ELEMENTS_RULES };

export type Element = "fire" | "water" | "earth" | "thunder" | "grass";
export const ELEMENTS: readonly Element[] = ["fire", "water", "earth", "thunder", "grass"];
/** 행성 8개: 빙결 · 범위 · 밀치기 · 불 · 흡혈 · 둔화 · 공격 늦추기 · 보호막 */
export type Planet = "freeze" | "area" | "push" | "burn" | "leech" | "slow" | "stall" | "guard";
export const PLANETS: readonly Planet[] = ["freeze", "area", "push", "burn", "leech", "slow", "stall", "guard"];

/** 빛 구슬: 광휘 · 경직 · 가끔 빛이 터짐 (r: 0~1 시드 랜덤) */
export function lightEffect(s: RunState, e: EnemyState, dmg: number, r: number): void {
  weaponDot(s, e, "radiance", dmg);
  if (e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? R.LIGHT_STUN / 2 : R.LIGHT_STUN);
  if (r >= R.LIGHT_BURST) return;
  blastAt(s, e.x, e.y, R.LIGHT_R, dmg * R.LIGHT_MUL, { still: true });
  addEffect(s, { kind: "elLight", x: e.x, y: e.y, dirX: 0, dirY: 0, size: R.LIGHT_R, maxTicks: 16 });
}

/** 무기마다 상태이상 피해 (빛 광휘 · 은하수 공허 · 중력 저주 · 갓 핸드 황금 · 별 폭풍) */
export function weaponDot(s: RunState, e: EnemyState, kind: DotKind, dmg: number): void {
  dotDamage(s, e, kind, dmg * R.WEAPON_DOT);
}

/** 독: 정해진 틱 동안 0.5초마다 (status) */
function poison(e: EnemyState, dmg: number): void {
  e.poisonTicks = Math.max(e.poisonTicks ?? 0, R.POISON_TICKS);
  e.poisonDmg = Math.max(e.poisonDmg ?? 0, dmg * R.POISON_MUL);
}

/** 원소 효과 = 원소에 맞는 상태이상 (피해는 따로): 불 화상 · 물 둔화 · 땅 밀침+기절 · 번개 감전 · 풀 둘레 독 */
export function elementEffect(s: RunState, e: EnemyState, el: Element, dmg: number, dx: number, dy: number): void {
  const boss = ENEMIES[e.kind].boss;
  if (el === "fire") ignite(e, dmg);
  else if (el === "water") {
    e.slowTicks = Math.max(e.slowTicks ?? 0, R.WATER_SLOW);
    dotDamage(s, e, "tide", dmg * R.ELEMENT_DOT);
  } else if (el === "earth" && e.kind !== "dummy") {
    dotDamage(s, e, "rot", dmg * R.ELEMENT_DOT);
    e.stunTicks = Math.max(e.stunTicks ?? 0, boss ? R.EARTH_STUN / 2 : R.EARTH_STUN);
    if (boss) return;
    e.x += dx * R.EARTH_PUSH;
    e.y += dy * R.EARTH_PUSH;
    keepInRoom(e, roomGrid(s));
  } else if (el === "thunder") {
    dotDamage(s, e, "shock", dmg * R.THUNDER_ADD);
    addEffect(s, { kind: "bolt", x: e.x, y: e.y - 18, dirX: 0, dirY: 0, size: 0, maxTicks: 8, toX: e.x, toY: e.y });
  } else if (el === "grass") {
    for (const o of s.enemies) if (o.hp > 0 && dist2(o, e) <= R.GRASS_RADIUS * R.GRASS_RADIUS) poison(o, dmg);
    addEffect(s, { kind: "verdant", x: e.x, y: e.y, dirX: 0, dirY: 0, size: R.GRASS_RADIUS, maxTicks: 14 });
  }
}

export function planetEffect(s: RunState, e: EnemyState, pl: Planet, dmg: number, dx: number, dy: number): void {
  const p = s.player;
  const boss = ENEMIES[e.kind].boss;
  // 행성마다 상태이상: 빙결 · 범위+감전 · 밀침(땅 기절 대신 둔화) · 화상 · 흡혈+독 · 둔화 · 공격 늦추기+서리 · 보호막+광휘
  if (pl === "freeze") {
    e.stunTicks = boss ? 30 : 60;
    dotDamage(s, e, "frost", dmg * R.PLANET_DOT);
  }
  else if (pl === "area") {
    blastAt(s, e.x, e.y, 22, dmg * R.SIDE_MUL, { exclude: e });
    dotDamage(s, e, "shock", dmg * R.PLANET_DOT);
  } else if (pl === "push") {
    if (!boss && e.kind !== "dummy") {
      e.x += dx * 1.6 * R.EARTH_PUSH;
      e.y += dy * 1.6 * R.EARTH_PUSH;
      keepInRoom(e, roomGrid(s));
    }
    if (!boss) e.slowTicks = Math.max(e.slowTicks ?? 0, R.PLANET_SLOW);
    dotDamage(s, e, "rot", dmg * R.PLANET_DOT);
  } else if (pl === "burn") ignite(e, dmg);
  else if (pl === "leech") {
    healPlayer(s, dmg * 0.1);
    poison(e, dmg);
    dotDamage(s, e, "bleed", dmg * R.PLANET_DOT);
  } else if (pl === "slow") {
    e.slowTicks = Math.max(e.slowTicks ?? 0, 120);
    dotDamage(s, e, "tide", dmg * R.PLANET_DOT);
  }
  else if (pl === "stall") {
    e.timer += 40;
    dotDamage(s, e, "frost", dmg * R.PLANET_DOT);
  } else {
    raiseShield(p, 2, p.stats.maxHp * 0.2);
    dotDamage(s, e, "radiance", dmg * R.PLANET_DOT);
  }
}
