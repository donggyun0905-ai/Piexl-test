// 유리엘(성국, 단죄의 성녀): 성수 수정구 & 사슬 집행의 철퇴 하나 + 스킬 넷(1 정화의 빛 · 2 집행의 철퇴 · 3 수호 결계 · 4 성녀의 단죄)
// 기본: 맞힌 적에게 단죄가 쌓이고(최대 5), 가득 차면 정화의 빛이 터져 큰 빛 피해 + 체력 회복. 결계 안에서 나는 덜 맞고 회복, 적은 느려지고 더 맞음
// 기본 공격: 철퇴 휘두르기 둘(앞 부채꼴) → 3타 사슬 철퇴 한 바퀴(둘레, 맞힌 적 수만큼 회복). 계산은 sim/yuriel·yurielKit·yurielSkills
import type { WeaponDef } from "./content";

export const YURIEL_WEAPONS = {
  /** 성수 수정구 & 집행의 철퇴: 성수를 담은 수정구와 사슬이 달린 집행의 철퇴 */
  yrFlail: { id: "yrFlail", kind: "sanctum", damageMul: 1, attackSpeed: 0.8, range: 60, projectileSpeed: 7, exclusive: "yuriel" },
} as const satisfies Record<string, WeaponDef>;

/** 유리엘 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const YURIEL = {
  /** 기본 3연격 간격 (공격 간격 배율) · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 처음으로 */
  stepTime: [0.7, 0.7, 1.2],
  comboGap: 70,
  /** 1·2타 철퇴 휘두르기: 거리 · 부채꼴(cos 이상) · 피해 배율 · 밀침 */
  swingR: 58,
  swingCos: 0.2,
  swingMul: 1,
  swingPush: 4,
  /** 3타 사슬 철퇴 한 바퀴: 둘레 반지름 · 피해 배율 · 밀침 · 맞힌 적 하나마다 회복 (최대 체력 비율) · 회복 최대 적 수 */
  spinR: 72,
  spinMul: 1.4,
  spinPush: 10,
  spinHeal: 0.01,
  spinHealMax: 5,
  /** 단죄: 가득 차는 수 · 정화의 빛 피해 배율(빛 피해) · 정화가 터지는 반지름 · 터질 때 회복 (최대 체력 비율) */
  sinMax: 5,
  purgeMul: 2,
  purgeR: 36,
  purgeHeal: 0.03,
  /** 결계(수호 결계·성녀의 단죄): 안에서 내가 받는 피해 배율 · 1초마다 회복 (최대 체력 비율) · 안의 적이 받는 피해 더함 · 안의 적 빛 피해 간격 틱 · 피해 배율 */
  wardTaken: 0.7,
  wardHeal: 0.02,
  wardFoeTaken: 0.15,
  wardEvery: 30,
  wardMul: 0.3,
  /** 스킬 대기 틱 (1 정화의 빛 · 2 집행의 철퇴 · 3 수호 결계 · 4 성녀의 단죄) */
  cooldowns: [480, 600, 960, 3600],
  /** 1 정화의 빛: 둘레 반지름 · 피해 배율(빛) · 회복 (최대 체력 비율) · 단죄 더함 */
  lightR: 84,
  lightMul: 0.8,
  lightHeal: 0.12,
  lightSin: 2,
  /** 2 집행의 철퇴: 던지는 거리 · 떨어지기까지 틱 · 반지름 · 피해 배율 · 기절 틱 · 단죄 더함 · 끌어당김 */
  maceAt: 120,
  maceDelay: 14,
  maceR: 48,
  maceMul: 1.8,
  maceStun: 36,
  maceSin: 2,
  macePull: 30,
  /** 3 수호 결계: 내 자리에 · 반지름 · 틱 */
  wardR: 92,
  wardTicks: 360,
  /** 4 성녀의 단죄(궁극기): 내리꽂히기까지 틱 · 방의 모든 적 피해 배율(빛) · 회복 (최대 체력 비율) · 성녀 강림 틱(기본 공격마다 정화 · 몸 둘레 결계) · 강림 결계 반지름 */
  ultDelay: 40,
  ultMul: 3,
  ultHeal: 0.4,
  ultTicks: 480,
  ultWardR: 80,
};
