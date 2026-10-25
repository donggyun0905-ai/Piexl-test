// 아티팩터(테라코어, 시즌 2): 팔에 푸른빛 문신이 가득한 제작자. 무기는 리펄스 총 딱 하나. 계산은 sim/artifacter
import type { WeaponDef } from "./content";

export const ARTIFACTER_WEAPONS = {
  /** 리펄스 총: 푸른 반발탄이 맞은 자리를 터뜨리며 적을 밀어냄 */
  afRepulsor: { id: "afRepulsor", kind: "repulse", damageMul: 1.2, attackSpeed: 1.6, range: 130, projectileSpeed: 3.6, exclusive: "artifacter" },
} as const satisfies Record<string, WeaponDef>;

/** 아티팩터 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const ARTIFACTER = {
  /** 반발탄: 맞은 자리 폭발 반경 · 밀침 */
  blastR: 14,
  push: 10,
  /** 제작 게이지: 쓰러뜨린 적 이만큼마다 아이템 하나를 만듦 · 그때 숨겨진 아이템이 나올 확률 */
  craftEvery: 20,
  hiddenChance: 0.12,
};
