// 헬피스트(새벽의 성흔, 적혈의 주먹): 악마가 깃든 붉은 주먹. 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA)
// 기본 공격은 주먹 세 박자: 1 주먹 후리기(앞 부채꼴) → 2 악마 왼팔 내려찍기(앞 부채꼴 충격 · 땅이 갈라져 남음) → 3 균열 파쇄(갈라진 땅이 붉은 유리처럼 깨지며 그 위 적을 벰)
// 성흔이 가득 찬 적혈 각성 중에는 기본 공격이 모두 허공검격(왼손 검지로 적을 가리키고 공중을 그으면 그 적 자리에 X자 검격)
// 악마화: 맞힐수록 쌓여 팔이 자라 모든 공격이 더 멀리 닿음 (한참 안 맞히면 하나씩 빠짐)
// 성흔이 가득 차면 적혈 각성: 달빛 각성과 달리 피해 배율 대신 공격 속도 · 회복 · 악마화 가득 · 허공검격 여럿 동시. 계산은 sim/hellfist·hellfistKit
import type { WeaponDef } from "./content";

export const HELLFIST_WEAPONS = {
  /** 적혈의 주먹: 악마의 신체를 이식한 붉은 주먹 */
  hfFist: { id: "hfFist", kind: "hellArm", damageMul: 1, attackSpeed: 1, range: 50, projectileSpeed: 8, exclusive: "hellfist" },
} as const satisfies Record<string, WeaponDef>;

/** 헬피스트 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const HELLFIST = {
  /** 박자 간격 배율 (후리기 · 내려찍기 · 균열 파쇄, 공격 속도 따름) · 각성 중 허공검격 간격 배율 · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 다시 1타부터 */
  stepTime: [0.6, 0.95, 1.1],
  clawTime: 0.8,
  comboGap: 50,
  /** 1타 후리기: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 밀침 */
  jabR: 50,
  jabCos: 0.2,
  jabMul: 0.9,
  jabPush: 4,
  /** 2타 내려찍기: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 밀침 */
  smashR: 58,
  smashCos: 0.1,
  smashMul: 1.5,
  smashPush: 9,
  /** 3타 균열 파쇄: 갈라진 땅이 남는 틱 · 피해 배율 · 밀침 */
  crackTicks: 150,
  shatterMul: 1.6,
  shatterPush: 6,
  /** 허공검격 (적혈 각성 중 기본 공격): 가리키는 거리 · 가리킬 수 있는 폭(cos) · 검격 줄 수 · 줄마다 피해 배율 · 둘레 반지름 · 둘레 적 피해 배율 */
  clawRange: 170,
  clawCos: 0.35,
  clawHits: 3,
  clawMul: 0.55,
  clawSplash: 20,
  splashMul: 0.5,
  /** 악마화: 최대 스택 · 스택마다 사거리 배율 더함 · 마지막으로 맞힌 뒤 이 틱이 지나면 · 이 틱마다 하나씩 빠짐 */
  rageMax: 10,
  ragePer: 0.04,
  rageHold: 150,
  rageDecay: 20,
  /** 성흔: 후리기로 맞힌 적마다 · 내려찍기 · 균열 파쇄 */
  gainJab: 2,
  gainSmash: 3,
  gainShatter: 4,
  /** 적혈 각성 (기본 공격이 모두 허공검격): 공격 속도 배율 · 더하는 사거리 배율 · 허공검격 대상 수 · 맞힌 적마다 회복(최대 체력 대비) · 한 번 공격에 회복 최대(최대 체력 대비) */
  awakeSpeed: 1.5,
  awakeReach: 1.15,
  awakeTargets: 3,
  awakeHeal: 0.004,
  awakeHealCap: 0.02,
  /** 각성 순간 지옥불 폭발 반지름 · 피해 배율 · 무적 틱 */
  awakeBurstR: 90,
  awakeBurstMul: 1.6,
  awakeInv: 30,
};
