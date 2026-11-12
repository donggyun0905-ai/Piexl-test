// 기어스(실베르, 은빛 쌍방패 기사 메이드): 무기는 쌍방패 하나. 누르면 앞을 두 방패로 강타 (피해는 약하지만 여러 번 때림)
// 대시: 푸른 보석 기계 구체로 변해 그 방향으로 계속 굴러감 (무적 없음 · 받는 피해 감소) · 벽에 튕김 · 적에게 부딪히면 서로 피해 · 다시 누르면 풀림
// 공격력 증가 아이템은 반만 적용 (방어력이 높고 타수로 싸우는 캐릭터) · 전용 패시브 20은 itemsGears · 계산은 sim/gears·geKit·geProcs·geBall
import type { WeaponDef } from "./content";

export const GEARS_WEAPONS = {
  /** 은빛 쌍방패: 앞을 두 방패로 강타 (사거리 = 치는 거리) */
  geShields: { id: "geShields", kind: "twinShield", damageMul: 1, attackSpeed: 1, range: 40, projectileSpeed: 4, exclusive: "gears" },
} as const satisfies Record<string, WeaponDef>;

/** 기본 공격·몸 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율 · 거리는 사거리 증가만큼 늘어남) */
export const GE_ATTACK = {
  /** 쌍방패 강타: 치는 자리까지 거리 · 반지름 · 때리는 수 · 한 대 피해 배율 · 때리는 간격 틱 · 다시 치기까지 틱 */
  reach: 24,
  r: 30,
  hits: 2,
  mul: 0.55,
  gap: 4,
  cd: 24,
  /** 기본 방어력: 받는 피해 배율 */
  taken: 0.8,
  /** 공격력 증가 아이템이 적용되는 비율 (0.5 = 반만) */
  dmgItem: 0.5,
};

/** 대시 구체: 빠르기(이동 속도 ×) · 받는 피해 배율 · 부딪힌 적 피해 배율 · 같은 적을 다시 칠 때까지 틱 · 켜고 끄는 사이 틱 */
export const GE_BALL = {
  speed: 2.4,
  taken: 0.7,
  mul: 1,
  again: 20,
  toggle: 10,
  /** 부딪힘 판정에 더하는 거리 */
  pad: 2,
  /** 구체 크기: 반지름 = 몸 반지름 × 이 값 (벽·적 부딪힘 판정과 그림이 같이 커짐 · 맞는 판정은 몸 그대로) */
  size: 3.25,
  /** 튕길 때마다 빨라지는 비율 (벽·적 모두) · 최대 쌓이는 수 (구체를 풀면 처음부터) */
  bounceAdd: 0.12,
  bounceMax: 10,
};
