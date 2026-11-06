// 가브리엘(성국, 철옹의 방패): 불멸의 성벽 방패 & 단조 해머 하나 + 스킬 넷(1 방패 돌진 · 2 중력 붕괴 · 3 성벽 · 4 불멸의 성벽)
// 기본 공격: 내려찍기 · 휘두르기 → 3타 대지 강타(하늘에서 빛의 망치가 내리꽂힘 · 기절 · 압박). 철옹: 받는 피해 절반
// 압박: 대지 진동·중력에 맞은 적이 느려짐. 계산은 sim/gabriel·gabrielSkills·gabrielKit
import type { WeaponDef } from "./content";

export const GABRIEL_WEAPONS = {
  /** 불멸의 성벽 방패 & 단조 해머: 거대한 타일 모양 파열형 방패와 빛을 머금은 단조 해머 */
  gbHammer: { id: "gbHammer", kind: "bastion", damageMul: 1.25, attackSpeed: 0.9, range: 60, projectileSpeed: 7, exclusive: "gabriel" },
} as const satisfies Record<string, WeaponDef>;

/** 가브리엘 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const GABRIEL = {
  /** 기본 3연격 간격 (공격 간격 배율) · 이 틱 동안 안 치면 처음으로 */
  stepTime: [0.6, 0.6, 1.05],
  comboGap: 70,
  /** 1·2타 망치: 닿는 거리 · 부채꼴 폭(cos, 1타 내려찍기 · 2타 휘두르기) · 피해 배율 · 밀침 */
  swingR: 50,
  swingCos: [0.4, 0],
  swingMul: 1.1,
  swingPush: 6,
  /** 3타 대지 강타: 앞으로 떨어지는 거리 · 반지름 · 피해 배율 · 기절 틱 · 밀침 */
  slamAt: 30,
  slamR: 46,
  slamMul: 1.8,
  slamStun: 30,
  slamPush: 6,
  /** 빛의 망치가 하늘에서 내려와 땅에 닿기까지 틱 */
  dropTicks: 8,
  /** 떨어진 빛의 망치가 밀쳐내는 거리 */
  dropPush: 4,
  /** 철옹: 받는 피해 배율 (적의 모든 공격을 절반으로) */
  halve: 0.5,
  /** 압박: 느려지는 틱 (대지 강타·중력 붕괴·성벽 진동) */
  pressTicks: 90,
  /** 스킬 대기 틱 (1 방패 돌진 · 2 중력 붕괴 · 3 성벽 · 4 불멸의 성벽) */
  cooldowns: [480, 720, 960, 3600],
  /** 1 방패 돌진: 돌진 틱 · 한 틱 거리 · 맞는 폭(절반) · 피해 배율 · 밀침 · 기절 틱 */
  bashTicks: 10,
  bashDist: 9,
  bashW: 18,
  bashMul: 1.2,
  bashPush: 12,
  bashStun: 40,
  /** 2 중력 붕괴: 앞으로 떨어지는 거리 · 끌어당기는 반지름 · 끌어당김 · 망치 반지름 · 피해 배율 · 떨어지기까지 틱 */
  wellAt: 70,
  wellR: 80,
  wellPull: 24,
  wellHitR: 50,
  wellMul: 2,
  wellDelay: 30,
  /** 중력 붕괴 망치의 기절 틱 */
  wellStun: 20,
  /** 3 성벽: 보호막(최대 체력 비율) · 둘레 진동 반지름 · 피해 배율 · 밀침 */
  wallShield: 0.3,
  wallR: 70,
  wallMul: 1,
  wallPush: 14,
  /** 4 불멸의 성벽(궁극기): 유지 틱 · 영역 반지름 · 영역 안 보호막 · 영역 안에서 차오르는 양(틱마다) · 끝난 뒤 줄어드는 양(틱마다) */
  ultTicks: 600,
  ultR: 120,
  ultShield: 100,
  ultRegen: 0.5,
  /** 궁극기를 쓸 때 거대한 빛의 망치: 반지름(영역 대비) · 피해 배율 */
  ultSlamR: 0.6,
  ultSlamMul: 2.5,
  ultDecay: 0.35,
  /** 궁극기 중 기본 공격마다 빛의 망치 추가타: 반지름 · 피해(최대 체력 비율) */
  ultHitR: 40,
  ultHpMul: 0.2,
};
