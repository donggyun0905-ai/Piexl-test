// 정령사(비르디아) 무기: 대정령 10. 본인 공격은 낮은 마법인 매직 미사일뿐, 대정령과 작은 정령 셋이 싸움 (계산은 sim/spirit)
// 작은 정령 열두 종류 중 셋이 곁에 있고, 30초마다 하나가 떠나고 무작위로 새 정령이 옴
import type { WeaponDef } from "./content";

/** 대정령 (무기): 티탄코어 · 아이언하이드 · 크로노스파이어 · 나이트위버 · 엄브라 · 베놈하이드 · 이드라(어른이 된 미래의 이드라, 여신) · 브라이어하트 · 실반가드 · 아비스루인 */
export type GreatSpirit = "titanCore" | "ironHide" | "chronoSpire" | "nightWeaver" | "umbra" | "venomHide" | "idra" | "briarHeart" | "sylvanGuard" | "abyssRuin";
/** 작은 정령 12: 강철 · 중력 · 용광로 · 광맥 · 그림자 · 강철실 · 독기 · 허공 · 세계수 · 가시덩굴 · 포자 · 대지 */
export const SMALL_SPIRITS = ["steel", "gravity", "furnace", "vein", "shadow", "steelThread", "miasma", "void", "worldTree", "thornVine", "spore", "earth"] as const;
export type SmallSpirit = (typeof SMALL_SPIRITS)[number];

const G = (id: string, great: GreatSpirit, attackSpeed = 2, range = 120) =>
  ({ id, kind: "pact", damageMul: 1, attackSpeed, range, projectileSpeed: 2.6, great, exclusive: "spiritist" }) as const;

export const SPIRIT_WEAPONS = {
  /** 티탄코어 (처음 무기): 거대한 바위 거인, 적 위에 돌주먹이 나타나 내려찍어 기절 */
  titanCoreSpirit: G("titanCoreSpirit", "titanCore"),
  /** 아이언하이드: 강철 짐승, 곁의 적을 밀쳐 내고 받는 피해 감소 */
  ironHide: G("ironHide", "ironHide"),
  /** 크로노스파이어: 시간의 탑, 둘레 적을 느리게 · 작은 정령이 빨라짐 */
  chronoSpire: G("chronoSpire", "chronoSpire"),
  /** 나이트위버: 밤의 거미 여인, 실로 적 넷을 묶음 */
  nightWeaver: G("nightWeaver", "nightWeaver"),
  /** 엄브라: 그림자, 가장 강한 적 쪽으로 굵은 그림자 레이저 */
  umbra: G("umbra", "umbra"),
  /** 베놈하이드: 독 비늘 뱀, 앞쪽에 독가스 넷을 부채꼴로 뿌림 */
  venomHide: G("venomHide", "venomHide"),
  /** 이드라: 세계수의 여신(어른이 된 이드라), 회복 + 꽃 폭발 */
  idraSpirit: G("idraSpirit", "idra"),
  /** 브라이어하트: 가시 심장, 한 줄로 가시덩굴을 뻗어 묶음 */
  briarHeart: G("briarHeart", "briarHeart"),
  /** 실반가드: 숲의 수호 궁수, 주문을 외며 모았다가 거대한 마법 화살이 꿰뚫음 */
  sylvanGuard: G("sylvanGuard", "sylvanGuard"),
  /** 아비스루인: 심연의 파멸, 무작위 적 셋 머리 위에 알 수 없는 입방체가 나타나 내리찍고 터짐 */
  abyssRuin: G("abyssRuin", "abyssRuin"),
} as const satisfies Record<string, WeaponDef>;

/** 대정령마다: 공격 사이 틱 · 피해 배율 · 반경 */
export const GREAT_SPIRITS: Record<GreatSpirit, { every: number; mul: number; r: number }> = {
  titanCore: { every: 150, mul: 3, r: 40 },
  ironHide: { every: 90, mul: 1.5, r: 30 },
  chronoSpire: { every: 120, mul: 1.2, r: 0 },
  nightWeaver: { every: 120, mul: 1.2, r: 0 },
  umbra: { every: 150, mul: 4, r: 10 },
  venomHide: { every: 160, mul: 0.8, r: 18 },
  idra: { every: 180, mul: 1.5, r: 40 },
  briarHeart: { every: 120, mul: 1.4, r: 10 },
  sylvanGuard: { every: 160, mul: 5, r: 14 },
  abyssRuin: { every: 160, mul: 1.6, r: 22 },
};

/** 정령사 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const SPIRIT = {
  /** 매직 미사일 피해 배율 */
  missileMul: 0.25,
  /** 작은 정령: 수 · 바뀌는 주기 · 공격 사이 틱 · 피해 배율 · 사거리 */
  small: 3,
  swapTicks: 1800,
  smallEvery: 50,
  smallMul: 0.3,
  smallRange: 100,
  /** 아이언하이드 받는 피해 · 크로노스파이어 작은 정령 빠르기 · 이드라 회복 */
  ironTaken: 0.75,
  chronoHaste: 0.7,
  idraHeal: 5,
  /** 돌주먹·입방체가 떨어지기까지 틱 · 실반가드 주문 틱 · 독가스 구름 수·벌림·남는 틱·맞히는 주기 */
  fistDrop: 14,
  cubeDrop: 26,
  chantTicks: 36,
  gasClouds: 4,
  gasSpread: 0.38,
  gasTicks: 150,
  gasEvery: 20,
} as const;
