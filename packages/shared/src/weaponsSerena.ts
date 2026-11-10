// 세레나(성국, 환혹의 무희): 강철 가시 채찍 & 맹독성 에테르 비수 하나 + 스킬 넷(1 환혹의 스텝 · 2 매혹 · 3 맹독 비수 · 4 환혹의 무도)
// 기본: 비수 달린 사슬 채찍 둘이 몸 둘레를 크게 돌며 적 사이를 휘저음 (낮은 피해 · 치명타 · 빛 피해 추가)
// 기본 공격: 채찍 휘두르기 둘 → 3타 환혹의 회오리(여러 사슬 채찍이 둘레를 연달아 크게 휘저음). 맞힌 적에 가시 → 가득 차면 마비
// 계산은 sim/serena·serenaKit·serenaSkills
import type { WeaponDef } from "./content";

export const SERENA_WEAPONS = {
  /** 강철 가시 채찍 & 맹독성 에테르 비수: 춤추듯 휘날리는 가시 사슬 끝에 빛나는 비수 */
  snWhip: { id: "snWhip", kind: "nightmare", damageMul: 1, attackSpeed: 1, range: 70, projectileSpeed: 7, exclusive: "serena" },
} as const satisfies Record<string, WeaponDef>;

/** 세레나 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const SERENA = {
  /** 기본 치명타 확률 · 치명타 배율 */
  critChance: 0.25,
  critMul: 1.8,
  /** 기본 3연격 간격 (공격 간격 배율) · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 처음으로 */
  stepTime: [0.55, 0.55, 1.2],
  comboGap: 70,
  /** 1·2타 채찍: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 */
  whipR: 72,
  whipCos: -0.1,
  whipMul: 0.6,
  /** 3타 환혹의 회오리: 휘젓는 횟수 · 사이 틱 · 반지름 · 한 번 피해 배율 · 밀침 */
  whirlN: 3,
  whirlGap: 8,
  whirlR: 88,
  whirlMul: 0.45,
  whirlPush: 3,
  /** 빛 피해 추가: 사슬·채찍에 맞을 때마다 그 피해의 이만큼을 빛 피해로 한 번 더 */
  lightMul: 0.3,
  /** 도는 사슬 채찍(기본): 개수 · 반지름 · 안팎으로 휘젓는 폭(반지름 비율) · 한 틱 도는 각 · 휘젓는 빠르기 · 맞는 반지름 · 피해 배율 · 같은 적을 다시 치는 틱 */
  orbN: 2,
  orbR: 62,
  orbSway: 0.35,
  orbSpin: 0.055,
  orbWave: 0.09,
  orbHitR: 9,
  orbMul: 0.35,
  orbEvery: 24,
  /** 가시: 최대 개수 · 남는 틱 · 피해 간격 틱 · 가시 하나마다 피해(공격력 배율) */
  thornMax: 5,
  thornTicks: 240,
  thornEvery: 30,
  thornMul: 0.08,
  /** 마비(가시가 가득 차면): 틱 · 느려짐 틱 · 받는 피해 더함 */
  numbTicks: 120,
  numbTaken: 0.15,
  /** 스킬 대기 틱 (1 환혹의 스텝 · 2 매혹 · 3 맹독 비수 · 4 환혹의 무도) */
  cooldowns: [600, 840, 600, 3600],
  /** 1 환혹의 스텝 (3번 연달아 돌진, 돌진마다 / - \\ 로 기울어진 사슬 회전): 돌진 수 · 돌진 틱 · 한 틱 거리 · 맞는 폭(절반) · 피해 배율 · 가시 더함 · 돌진마다 둘레 회전 반지름 · 회전 피해 배율 */
  stepN: 3,
  stepTicks: 11,
  stepDist: 5.5,
  stepW: 20,
  stepMul: 0.55,
  stepThorns: 1,
  stepSpinR: 60,
  stepSpinMul: 0.4,
  /** 2 매혹: 반지름 · 매혹 틱(멈춘 채 나에게 끌려옴, 보스는 느려지기만) · 한 틱 끌려오는 거리 · 받는 피해 더함 · 가시 더함 · 피해 배율 */
  charmR: 110,
  charmTicks: 120,
  charmPull: 0.7,
  charmTaken: 0.25,
  charmThorns: 2,
  charmMul: 0.5,
  /** 3 맹독 비수: 비수 수 · 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 가시 더함 · 독(공격력 배율, 0.5초마다) · 독 틱 */
  knifeN: 7,
  knifeR: 150,
  knifeCos: 0.55,
  knifeMul: 1.2,
  knifeThorns: 3,
  knifePoison: 0.2,
  knifePoisonTicks: 180,
  /** 4 환혹의 무도(궁극기): 유지 틱 · 사슬 채찍 수 · 반지름 배율 · 사슬 피해 배율 · 시작할 때 방의 모든 적 가시 더함 */
  ultTicks: 480,
  ultOrbN: 6,
  ultOrbR: 1.4,
  ultOrbMul: 2,
  ultThorns: 2,
  /** 무도 중 사슬이 도는 길: 꽃잎 수 · 꽃 안쪽 반지름 비율(꽃잎 사이 오목한 곳) · 꽃이 한 틱 도는 각 (화면의 발밑 꽃과 같음) */
  ultPetals: 8,
  ultInner: 0.5,
  ultPetalSpin: 0.02,
};
