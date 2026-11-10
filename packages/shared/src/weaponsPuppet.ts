// 인형술사(실베르, 붉은 실로 인형을 부리는 소녀): 무기는 실을 매단 손 하나. 마우스 자리가 곧 커다란 손(반투명)
// 꾹 누르기 = 손 아래 적에게 실을 걸어 조종 게이지를 채움 → 가득 차면 머리 위에 나무 왕관이 씌워지고 아군이 되어 같이 싸움 (보스 빼고 · 왕관 최대 3)
//   게이지를 채우는 동안 그 적이 피해를 받거나 나를 때리면 0으로 · 손이 그 적을 떠나면 조금씩 줄어듦
// 짧게 클릭 = 손 크기만큼 아래로 실을 내리쳐 공격. 계산은 sim/puppet · 전용 패시브 20개는 itemsPuppet·sim/puppetDolls·puppetFriends
import type { WeaponDef } from "./content";

export const PUPPET_WEAPONS = {
  /** 인형술사의 손: 꾹 눌러 조종 · 짧게 눌러 실 내리치기 (사거리 = 손이 닿는 거리) */
  ppHand: { id: "ppHand", kind: "puppetHand", damageMul: 1, attackSpeed: 1, range: 140, projectileSpeed: 4, exclusive: "puppeteer" },
} as const satisfies Record<string, WeaponDef>;

/** 인형술사 손 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율) */
export const PUPPET_HAND = {
  /** 손이 닿는 가장 먼 거리 · 손 크기(내리치는 반지름) (사거리 증가만큼 늘어남) */
  reach: 140,
  handR: 20,
  /** 이 틱보다 짧게 누르면 클릭(실 내리치기), 길게 누르면 꾹(조종) */
  tap: 10,
  /** 실 내리치기: 피해 배율 · 다시 내리치기까지 틱 (공격 속도로 짧아짐) */
  strikeMul: 1.3,
  strikeCd: 16,
  /** 조종: 가득 차는 틱 (적 최대 체력 hpRef마다 1배씩 더 걸림, 최대 slowMax배) · 손이 떠났을 때 틱마다 줄어드는 양 */
  charmTicks: 80,
  hpRef: 120,
  slowMax: 3,
  decay: 0.004,
  /** 나무 왕관(아군) 최대 수 */
  crowns: 3,
  /** 왕관 쓴 아군: 체력 배율(원래 최대 체력) · 공격 피해 배율 · 공격 간격 틱 · 보는 거리 · 따라오는 거리 · 이동 빠르기 배율(최소 minSpeed) · 몸에 닿은 적에게 맞는 간격 */
  allyHp: 1.5,
  allyMul: 0.9,
  allyRate: 40,
  allySight: 150,
  allyFollow: 36,
  allySpeed: 1.1,
  minSpeed: 0.6,
  allyHurtCd: 30,
  /** 미니 인형(전용 패시브 8종): 실로 때릴 때 나올 확률(가진 인형 하나마다 더함) · 빠르기 · 터지는 반지름 · 피해 배율 · 날아가는 가장 긴 틱 · 한 번에 있는 가장 많은 수 */
  dollChance: 0.12,
  dollSpeed: 3.2,
  dollR: 26,
  dollMul: 1.4,
  dollTicks: 120,
  dollMax: 8,
};
