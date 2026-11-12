// 백령(실베르, 영혼과 대태도를 다루는 오니 소녀): 무기는 대태도 하나. 누르면 바라보는 쪽 앞을 부채꼴로 벰
// 적을 처치하면 영혼이 저절로 쌓여 영혼 게이지가 참 → 3칸이 차면 머리 위에 유령팔이 나와 벨 때마다 에너지 참격이 같이 나감
// 그 뒤 칸마다 유령팔·참격이 조금씩 커지고 2배가 되면 멈춤 (게이지도 사라짐)
// 전용 패시브 20개는 itemsBaekryeong · 계산은 sim/baekryeong·baekSlash·baekSword
import type { WeaponDef } from "./content";

export const BAEK_WEAPONS = {
  /** 백령의 대태도: 앞을 부채꼴로 벰 (사거리 = 베는 거리) */
  byBlade: { id: "byBlade", kind: "soulBlade", damageMul: 1, attackSpeed: 1, range: 40, projectileSpeed: 4, exclusive: "baekryeong" },
} as const satisfies Record<string, WeaponDef>;

/** 대태도 베기 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율) */
export const BAEK_BLADE = {
  /** 베는 거리 (사거리 증가만큼 늘어남) · 부채꼴 넓이(바라보는 쪽과 이루는 각의 코사인이 이 값 이상) */
  reach: 34,
  arcCos: 0.25,
  /** 베기 피해 배율 · 다시 베기까지 틱 (공격 속도로 짧아짐) */
  mul: 1.2,
  cd: 28,
};

/** 영혼 게이지: 처치하면 1 (보스는 boss) · 칸마다 필요한 영혼 (1·2·3칸, 그 뒤는 needAfter) · 유령팔이 나오는 칸 · 그 뒤 칸마다 커지는 크기 · 가장 큰 크기 */
export const BAEK_SOUL = {
  need1: 15,
  need2: 25,
  need3: 35,
  needAfter: 40,
  boss: 10,
  armLv: 3,
  grow: 0.1,
  maxScale: 2,
  /** 유령팔이 커지는 만큼 공격 크기가 따라 커지는 비율 (0.5 = 손이 +10% 커지면 공격은 +5%) */
  hitGrow: 0.5,
};

/** 유령팔 에너지 참격: 반지름 · 한 틱에 나아가는 거리 · 사는 틱 · 피해 배율 (모두 유령팔 크기만큼 커짐, 사거리 증가도) */
export const BAEK_ARM = {
  r: 24,
  speed: 4.5,
  life: 24,
  mul: 1,
  /** 한 번에 있는 가장 많은 참격 수 */
  max: 10,
};
