// 장수 전용 아이템 (창·검일 때 효과). 효과는 sim/general·generalLegends. 수치는 GENERAL_PERKS
import type { PassiveDef } from "./items";

export const GENERAL_PASSIVES = {
  /** 숨겨진 힘: 콤보 마지막에 그 무기 주인(당대 최고의 장수)의 필살기를 씀 */
  hiddenPower: { id: "hiddenPower", mods: [], exclusive: "general", effect: true },
  /** 적토마: 이동 속도 +0.2, 돌진 거리 2배 */
  redHare: { id: "redHare", mods: [{ stat: "moveSpeed", add: 0.2 }], exclusive: "general", effect: true },
  /** 철벽진: 콤보 묶음 사이 쉬는 동안 받는 피해 -30% */
  ironWall: { id: "ironWall", mods: [], exclusive: "general", effect: true },
  /** 창술 달인: 사거리 +25% */
  spearMastery: { id: "spearMastery", mods: [{ stat: "range", mul: 1.25 }], exclusive: "general" },
  /** 함성: 콤보를 끝까지 하면 4초 동안 피해 +20% */
  warCry: { id: "warCry", mods: [], exclusive: "general", effect: true },
  /** 피 묻은 칼날: 찌르기에 맞은 적이 출혈 */
  bloodBlade: { id: "bloodBlade", mods: [], exclusive: "general", effect: true },
  /** 명장의 기세: 적을 쓰러뜨리면 다음 기술 피해 2배 */
  momentum: { id: "momentum", mods: [], exclusive: "general", effect: true },
  /** 갑옷 꿰뚫기: 보스에게 피해 +30% */
  armorPierce: { id: "armorPierce", mods: [], exclusive: "general", effect: true },
  /** 불굴: 체력 30% 이하면 콤보 사이에 쉬지 않음 */
  unbreakable: { id: "unbreakable", mods: [], exclusive: "general", effect: true },
  /** 무인의 혼: 공격 속도 +15%, 최대 체력 +15 */
  martialSoul: { id: "martialSoul", mods: [{ stat: "attackSpeed", mul: 1.15 }, { stat: "maxHp", add: 15 }], exclusive: "general" },
  /** 충의: 콤보를 끝까지 하면 최대 체력의 2% 회복 */
  loyalty: { id: "loyalty", mods: [], exclusive: "general", effect: true },
  /** 군기: 돌진 내리꽂기 폭발 범위 +60% */
  warBanner: { id: "warBanner", mods: [], exclusive: "general", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 장수 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const GENERAL_PERKS = {
  redHare: { lunge: 2 },
  ironWall: { taken: 0.7 },
  warCry: { damage: 1.2, ticks: 240 },
  momentum: { damage: 2 },
  armorPierce: { damage: 1.3 },
  unbreakable: { below: 0.3 },
  loyalty: { heal: 0.02 },
  warBanner: { area: 1.6 },
};
