// 빙설(실베르, 얼음 칼날의 해군 소녀): 무기 10개 모두 얼음 칼날(frostBlade) · 무기마다 공격 모양만 다름 (BS_STYLE)
// 늘 몸 둘레에 눈 내리는 얼음 영역(BS_FIELD) → 안에 들어온 적은 움직임·공격이 느려짐
// 전용 패시브 10개(빙설창·빙설무장·얼음가루 등)는 itemsBingseol · 계산은 sim/bingseol·bsShots·bsArms·bsUlt
import type { WeaponDef } from "./content";

const W = <T extends string>(id: T, attackSpeed: number, range: number) =>
  ({ id, kind: "frostBlade", damageMul: 1, attackSpeed, range, projectileSpeed: 4, exclusive: "bingseol" }) as const;

export const BINGSEOL_WEAPONS = {
  /** 얼음칼: 앞을 부채꼴로 벰 (기본) */
  bsBlade: W("bsBlade", 1, 40),
  /** 얼음 낫: 몸 둘레 넓게 휘둘러 벰 · 느림 */
  bsScythe: W("bsScythe", 0.8, 44),
  /** 서리 단검: 짧고 아주 빠르게 벰 */
  bsDagger: W("bsDagger", 1.7, 30),
  /** 빙하 대검: 멀리·세게 벰 · 아주 느림 */
  bsGreat: W("bsGreat", 0.6, 52),
  /** 고드름 창: 앞으로 길게 찌름 (줄 위 적 모두) */
  bsPike: W("bsPike", 1.1, 64),
  /** 빙인 투척: 얼음 칼날을 던짐 (관통 2) */
  bsShard: W("bsShard", 1.2, 160),
  /** 눈꽃 부채: 얼음 칼날 셋을 부채꼴로 던짐 */
  bsFan: W("bsFan", 0.9, 130),
  /** 서리 채찍: 좁고 길게 휘둘러 벰 */
  bsWhip: W("bsWhip", 1.2, 58),
  /** 빙륜: 몸 둘레를 한 바퀴 돌며 벰 */
  bsRing: W("bsRing", 1, 36),
  /** 눈보라 지팡이: 앞에 눈덩이를 쏴 터뜨림 · 얼음 영역이 넓음 */
  bsStaff: W("bsStaff", 1, 120),
} as const satisfies Record<string, WeaponDef>;

export type BingseolWeaponId = keyof typeof BINGSEOL_WEAPONS;

/**
 * 무기마다 공격 모양 (shape: 0 앞 부채꼴 · 1 앞 줄 찌르기 · 2 칼날 던지기 · 3 몸 둘레 원 · 4 눈덩이 터짐)
 * reach 베는 거리(사거리 증가만큼 늘어남) · arc 부채꼴 넓이(바라보는 쪽과 이루는 각의 코사인이 이 값 이상) · mul 피해 배율 · cd 다시 공격까지 틱
 * n 던지는 칼날 수 · spread 벌어지는 각도(라디안) · pierce 관통 수 · field 얼음 영역 크기 배율
 */
export const BS_STYLE: Record<BingseolWeaponId, { shape: number; reach: number; arc: number; mul: number; cd: number; n: number; spread: number; pierce: number; field: number }> = {
  bsBlade: { shape: 0, reach: 34, arc: 0.25, mul: 1.1, cd: 28, n: 1, spread: 0, pierce: 0, field: 1 },
  bsScythe: { shape: 0, reach: 40, arc: -0.45, mul: 1.2, cd: 34, n: 1, spread: 0, pierce: 0, field: 1 },
  bsDagger: { shape: 0, reach: 26, arc: 0.35, mul: 0.6, cd: 16, n: 1, spread: 0, pierce: 0, field: 0.9 },
  bsGreat: { shape: 0, reach: 50, arc: 0.1, mul: 2.2, cd: 44, n: 1, spread: 0, pierce: 0, field: 1 },
  bsPike: { shape: 1, reach: 62, arc: 9, mul: 1.15, cd: 28, n: 1, spread: 0, pierce: 0, field: 1 },
  bsShard: { shape: 2, reach: 0, arc: 0, mul: 0.95, cd: 24, n: 1, spread: 0, pierce: 2, field: 1 },
  bsFan: { shape: 2, reach: 0, arc: 0, mul: 0.7, cd: 30, n: 3, spread: 0.3, pierce: 0, field: 1 },
  bsWhip: { shape: 0, reach: 56, arc: 0.6, mul: 1, cd: 26, n: 1, spread: 0, pierce: 0, field: 1 },
  bsRing: { shape: 3, reach: 34, arc: 0, mul: 0.9, cd: 30, n: 1, spread: 0, pierce: 0, field: 1 },
  bsStaff: { shape: 4, reach: 22, arc: 0, mul: 1.1, cd: 30, n: 1, spread: 0, pierce: 0, field: 1.4 },
};

/** 얼음 영역: 반지름(사거리 증가만큼 늘어남) · 안의 적이 느려지는 틱(매 틱 다시 걸림) */
export const BS_FIELD = {
  r: 56,
  slow: 3,
};

/** 던지는 얼음 칼날·눈덩이: 한 틱에 나아가는 거리(투사체 속도만큼) · 반지름 · 사는 틱 (눈덩이는 사거리 끝에서 터짐) */
export const BS_SHOT = {
  speed: 4.5,
  r: 6,
  life: 40,
};
