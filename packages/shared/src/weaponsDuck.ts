// 오리(히든 캐릭터) 전용 무기: 꽥 음파가 앞쪽 적을 모두 밀치며 때리고, 4번째마다 둘레 전체에 큰 꽥(기절).
// 새끼 오리가 줄지어 따라오며 적 탄을 막고, 내가 꽥 할 때 같이 꽥 함. 계산은 sim/duck·ducklings
import type { WeaponDef } from "./content";

/** cone 부채꼴 꽥 · feather 깃털 부채(뚫음) · egg 황금알(던져서 폭발) · splash 물웅덩이(둘레·둔화) · bubble 거품(느리게 날아가 터짐) · swan 백조(체력이 낮을수록 셈) */
export type QuackStyle = "cone" | "feather" | "egg" | "splash" | "bubble" | "swan";

const Q = (id: string, quack: QuackStyle, damageMul: number, attackSpeed: number, range: number, ducklings: number, extra: Partial<WeaponDef> = {}) =>
  ({ id, kind: "quack", damageMul, attackSpeed, range, projectileSpeed: 0, quack, ducklings, exclusive: "duck", ...extra }) as const;

export const DUCK_WEAPONS = {
  /** 고무 오리 (처음 무기): 앞쪽 부채꼴 꽥 · 새끼 2 */
  rubberDuck: Q("rubberDuck", "cone", 1.3, 2.5, 46, 2, { arcCos: 0.5 }),
  /** 확성기: 좁고 멀리 가는 꽥 */
  megaphone: Q("megaphone", "cone", 1.7, 1.8, 110, 2, { arcCos: 0.9 }),
  /** 깃털 부채: 깃털 5개가 적 2명을 뚫음 */
  featherFan: Q("featherFan", "feather", 0.8, 2.4, 110, 2, { projectileSpeed: 3.6, shots: 5, spread: [0.9659, 0.2588], pierce: 2 }),
  /** 황금알: 겨눈 곳에 알을 던져 크게 터짐 */
  goldenEgg: Q("goldenEgg", "egg", 2.6, 1.1, 110, 2, { blast: 30 }),
  /** 엄마 오리: 꽥은 약하지만 새끼 6마리 */
  motherDuck: Q("motherDuck", "cone", 0.9, 2.4, 40, 6, { arcCos: 0.5 }),
  /** 물웅덩이: 둘레 전체에 물보라, 맞은 적 1초 느려짐 */
  puddleStomp: Q("puddleStomp", "splash", 1.3, 1.8, 42, 2, { arcCos: -1 }),
  /** 천둥 꽥: 2번째마다 큰 꽥 */
  thunderQuack: Q("thunderQuack", "cone", 1.3, 2, 50, 2, { arcCos: 0.4, bigEvery: 2 }),
  /** 백조의 노래: 체력이 낮을수록 피해 증가 (최대 2배) */
  swanSong: Q("swanSong", "swan", 1.4, 2.2, 70, 2, { arcCos: 0.4 }),
  /** 거품 꽥: 느린 거품이 적에 닿으면 터짐 */
  bubbleQuack: Q("bubbleQuack", "bubble", 1.5, 1.6, 120, 3, { projectileSpeed: 1.8, blast: 26 }),
  /** 왕관 오리: 세고 넓은 꽥, 3번째마다 큰 꽥 · 새끼 4 */
  crownDuck: Q("crownDuck", "cone", 2, 2.2, 60, 4, { arcCos: 0.3, bigEvery: 3 }),
} as const satisfies Record<string, WeaponDef>;

/** 오리 공용 수치 (시간은 틱, 거리는 픽셀) */
export const DUCK = {
  /** 큰 꽥: 몇 번째마다 · 범위(무기 사거리 배율, 최소) · 피해 배율 · 기절(보스는 절반) · 밀침 */
  big: { every: 4, rangeMul: 1.2, minRange: 44, damage: 1.5, stun: 30, push: 8 },
  /** 꽥에 맞은 적 밀침 (보스 제외) */
  push: 4,
  /** 물웅덩이 둔화 */
  splashSlow: 60,
  /** 황금알이 떨어지기까지 */
  eggTicks: 20,
  /** 백조: 잃은 체력 비율만큼 더 셈 (최대 ×2) */
  swanMax: 2,
  /** 새끼 오리: 줄 간격 · 몸 크기 · 꽥 피해 배율 · 꽥 범위 · 탄 막은 뒤 다시 막기까지 */
  chick: { gap: 7, r: 3, echo: 0.4, echoRange: 60, block: 60 },
} as const;
