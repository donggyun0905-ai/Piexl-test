// 별지기(히든) 전용 무기: 공격하면 그 자리에 별을 박음. 가까운 별끼리 빛줄기로 이어져 지나가는 적을 태우고,
// 별이 가득 차면 별자리가 완성되어 모든 별이 한꺼번에 터짐. 무기마다 별 모양이 다름. 계산은 sim/star
import type { WeaponDef } from "./content";

/** 무기마다 별 종류 */
export type StarStyle = "plain" | "comet" | "twin" | "blackhole" | "nova" | "polaris" | "meteor" | "galaxy" | "frost" | "sun";

const W = (id: string, star: StarStyle, damageMul = 1, attackSpeed = 1.4, range = 120) =>
  ({ id, kind: "star", damageMul, attackSpeed, range, projectileSpeed: 0, star, exclusive: "stargazer" }) as const;

export const STAR_WEAPONS = {
  /** 별자리 지팡이 (처음 무기): 기본 별 */
  starStaff: W("starStaff", "plain"),
  /** 혜성 꼬리: 별을 박을 때 나에서 별까지 지나가는 길의 적도 모두 때림 */
  cometTail: W("cometTail", "comet", 1.1),
  /** 쌍둥이 별: 별을 두 개씩 나란히 박음 */
  twinStars: W("twinStars", "twin", 0.85),
  /** 검은 별: 별이 둘레 적을 천천히 끌어당김 */
  blackStar: W("blackStar", "blackhole"),
  /** 초신성의 심장: 별 3개면 별자리 완성, 터지는 힘이 아주 셈 */
  novaHeart: W("novaHeart", "nova", 1.2, 1.2),
  /** 북극성: 나도 별 하나 (나와 가까운 별 사이에도 빛줄기) */
  polaris: W("polaris", "polaris"),
  /** 유성우: 별을 박을 때 둘레에 유성이 2개 더 떨어짐 */
  meteorShower: W("meteorShower", "meteor", 0.9),
  /** 은하수: 빛줄기가 훨씬 멀리 이어지고 별을 7개까지 (빛줄기는 조금 약함) */
  milkyWay: W("milkyWay", "galaxy", 1, 1.5, 140),
  /** 얼음별: 빛줄기에 닿은 적이 느려짐 */
  frostStar: W("frostStar", "frost"),
  /** 작은 태양: 빛줄기·터짐이 적을 불태움 */
  tinySun: W("tinySun", "sun", 1.05),
} as const satisfies Record<string, WeaponDef>;

/** 무기마다 빛깔 (별·빛줄기) */
export const STAR_COLORS: Record<StarStyle, string> = {
  plain: "#fff2a8",
  comet: "#8ad8ff",
  twin: "#ffb0e0",
  blackhole: "#b07aff",
  nova: "#ff9a4a",
  polaris: "#e8f4ff",
  meteor: "#ffd27a",
  galaxy: "#c8b0ff",
  frost: "#9af0ff",
  sun: "#ff6a3a",
};

/** 별지기 수치 (배율은 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const STAR = {
  /** 별 자리: 이만큼 가까운 별이 있으면 다른 적 · 모두 별이 있으면 적 둘레 이 거리에 마주 보게 */
  spotGap: 12,
  ring: 18,
  /** 별: 남는 틱 · 박힐 때 때리는 반경·배율 · 최대 수 */
  life: 420,
  placeR: 14,
  placeMul: 0.8,
  max: 5,
  /** 빛줄기: 이어지는 거리 · 때리는 간격 · 배율 · 닿는 두께 */
  link: 75,
  lineEvery: 10,
  lineMul: 0.35,
  lineW: 3,
  /** 별자리 완성: 별마다 터지는 반경·배율 */
  burstR: 34,
  burstMul: 2,
  /** 혜성 꼬리: 지나간 길 배율 · 쌍둥이: 두 별 사이 거리 */
  cometMul: 0.6,
  twinGap: 20,
  /** 검은 별: 끄는 반경·세기 */
  pullR: 46,
  pull: 0.6,
  /** 초신성: 최대 별·터지는 반경·배율 */
  nova: { max: 3, burstR: 46, burstMul: 4 },
  /** 유성우: 유성 수·떨어지는 거리·반경·배율 */
  meteor: { n: 2, spread: 26, r: 12, mul: 0.7 },
  /** 은하수: 이어지는 거리·빛줄기·최대 별 배율 */
  galaxy: { link: 1.8, lineMul: 0.75, max: 7 },
  /** 얼음별: 느려지는 틱 · 작은 태양: 불 세기 (공격력 배율) */
  frostSlow: 30,
  sunBurn: 0.6,
};
