// 조커(실베르, 튕기는 카드 투척자): 무기 셋(트럼프 카드 · 사신의 낫 · 장난감 총) 모두 한 장씩 던져 벽에 끝없이 튕김
// 피해는 공격력과 상관없는 고정 피해(처음 4) · 벽에 튕길 때마다 +4 (15번까지) · 판 위 카드가 한도(15장)를 넘으면 가장 먼저 던진 카드가 사라짐
// 투사체 속도가 빠를수록 카드가 빨리 튕기며 세짐. 계산은 sim/joker · 카드뽑기(전용 패시브)는 sim/jokerDraw
import type { WeaponDef } from "./content";

export const JOKER_WEAPONS = {
  /** 트럼프 카드: 기본 (보통 크기·보통 빠르기) */
  jkCards: { id: "jkCards", kind: "jokerCard", damageMul: 1, attackSpeed: 1.4, range: 220, projectileSpeed: 5, exclusive: "joker" },
  /** 사신의 낫: 크고 느리게 돌며 날아감 · 지나가는 적을 더 자주 벰 · 던지는 간격이 김 */
  jkScythe: { id: "jkScythe", kind: "jokerCard", damageMul: 1, attackSpeed: 0.9, range: 220, projectileSpeed: 3.6, exclusive: "joker" },
  /** 장난감 총: 작은 탄을 빠르게 자주 쏨 · 튕길 때 느는 피해는 조금 적음 */
  jkToyGun: { id: "jkToyGun", kind: "jokerCard", damageMul: 1, attackSpeed: 2.2, range: 220, projectileSpeed: 7, exclusive: "joker" },
} as const satisfies Record<string, WeaponDef>;

export type JokerWeaponId = keyof typeof JOKER_WEAPONS;

/** 무기마다 다른 점 (r = 카드 크기 · hitCd = 같은 적을 다시 맞히기까지 틱 · gain = 튕길 때 느는 피해) */
export const JOKER_STYLE: Record<JokerWeaponId, { r: number; hitCd: number; gain: number }> = {
  jkCards: { r: 4, hitCd: 18, gain: 4 },
  jkScythe: { r: 8, hitCd: 9, gain: 4 },
  jkToyGun: { r: 3, hitCd: 18, gain: 3 },
};

/** 조커 수치 (시간은 틱(60 = 1초), 거리는 픽셀) */
export const JOKER_CARD = {
  /** 처음 고정 피해 (공격력과 상관없음) */
  base: 4,
  /** 판 위에 남는 카드 한도 (넘으면 가장 먼저 던진 카드가 사라짐) */
  max: 15,
  /** 피해가 느는 튕김 횟수 상한 (넘게 튕겨도 피해는 그대로 · 기본 카드 최대 4 + 4 × 15 = 64) */
  maxBounce: 15,
  /** 한 번에 움직이는 가장 긴 거리 (빠른 카드가 벽을 뚫지 않게 나눠 움직임) */
  step: 5,
};

/** 카드뽑기 (전용 패시브 jkDraw): 맞힐 때마다 게이지 → 가득이면 머리 위 카드 셋이 섞이다 한 장이 뒤집힘 */
export const JOKER_DRAW = {
  /** 게이지 가득 (맞힌 횟수) */
  max: 40,
  /** 섞이고 뒤집히는 연출 틱 (끝나면 효과) */
  flipTicks: 90,
  /** 효과 시간 (10초) */
  buffTicks: 600,
  /** 붉은 일식: 받는 피해 배율 · 카드 처음 고정 피해 */
  eclipseTaken: 1.3,
  eclipseBase: 16,
  /** 세계수: 체력 회복 */
  treeHeal: 20,
};

/** 달 카드: 히든 캐릭터 아홉의 힘 중 하나를 10초 동안 (every = 간격 틱 · dmg = 고정 피해 · r = 반지름) */
export const JOKER_MOON = {
  /** 별지기 · 별똥별: 무작위 적 하나에 별이 떨어짐 */
  stargazer: { every: 30, dmg: 14, r: 28 },
  /** 오리 · 꽥 충격파: 둘레를 밀쳐 냄 */
  duck: { every: 40, dmg: 8, r: 64, push: 16 },
  /** 서기관 · 먹 글자: 가장 가까운 적에게 글자가 박힘 */
  scribe: { every: 24, dmg: 12, r: 16 },
  /** 에테르 광부 · 에테르 분출: 가장 가까운 적 자리에서 결정이 솟음 */
  miner: { every: 45, dmg: 18, r: 40 },
  /** 운명의 여행자 · 운명: 카드 피해 배율 */
  voyager: { mul: 2 },
  /** 제우스 · 낙뢰: 무작위 적 몇에게 번개 */
  zeus: { every: 40, dmg: 16, n: 3, r: 14 },
  /** 차원의 순례자 · 차원 균열: 조준한 쪽으로 길게 갈라짐 */
  pilgrim: { every: 50, dmg: 18, len: 180, w: 14 },
  /** 몰락한 왕 · 왕의 위엄: 받는 피해 배율 · 둘레 위압 */
  fallenKing: { taken: 0.5, every: 60, dmg: 14, r: 56 },
  /** 빛의 사도 · 빛의 축복: 회복 · 둘레 빛 */
  lux: { every: 30, heal: 2, dmg: 10, r: 44 },
};

export type MoonHero = keyof typeof JOKER_MOON;
/** 달 카드에서 뽑는 순서 (화면 이름 순서도 이것) */
export const MOON_HEROES: readonly MoonHero[] = ["stargazer", "duck", "scribe", "miner", "voyager", "zeus", "pilgrim", "fallenKing", "lux"];
