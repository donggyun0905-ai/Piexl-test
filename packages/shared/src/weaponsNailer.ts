// 네일러(새벽의 성흔, 못 박는 심판관): 망치와 못 하나 + 스킬 넷(1 못 던지기 3단계 · 2 붉은 실 2단계 · 3 저주의 도화선 · 4 심판의 못비)
// 기본 공격은 망치 내려치기. 못이 박힌 적은 체력 줄 위에 못 ×개수 (한도 없음) → 3 저주의 도화선이 한 번에 터뜨림 (못 하나마다 공격력 33%를 한 덩어리 피해로)
// 맞힐수록 성흔(달빛의 힘)이 차고 가득 차면 달빛 각성 (공용 weaponsDawn.STIGMA). 계산은 sim/nailer·nailerSkills·nailerKit
import type { WeaponDef } from "./content";

export const NAILER_WEAPONS = {
  /** 심판관의 망치와 못: 악마의 영혼을 대지에 고정하는 거대한 못과 묵직한 망치 */
  nlHammer: { id: "nlHammer", kind: "nail", damageMul: 1, attackSpeed: 0.8, range: 50, projectileSpeed: 8, exclusive: "nailer" },
} as const satisfies Record<string, WeaponDef>;

/** 네일러 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const NAILER = {
  /** 기본 공격 망치 내려치기: 닿는 거리 · 부채꼴 폭(cos) · 피해 배율 · 밀침 */
  swingR: 46,
  swingCos: 0.25,
  swingMul: 1.2,
  swingPush: 5,
  /** 스킬 대기 틱 (1 못 던지기(3번째 뒤) · 2 붉은 실(2번째 뒤) · 3 저주의 도화선 · 4 심판의 못비) */
  cooldowns: [48, 600, 720, 3600],
  /** 1 못 던지기: 단계마다 못 빠르기 · 피해 배율 · 다음 단계까지 막는 틱 · 다음 단계를 누를 수 있는 틱(지나면 대기) */
  throwSpeed: [5, 8, 11],
  throwMul: [0.6, 0.7, 0.55],
  throwLock: 10,
  throwWindow: 150,
  /** 1 못 던지기 3단계: 못 수 · 사이 틱 · 날아가는 거리 */
  tripleN: 3,
  tripleGap: 5,
  throwRange: 260,
  /** 못이 적에 닿는 반지름 (적 크기에 더함) */
  nailHitR: 3,
  /** 2 붉은 실 1번: 노릴 적을 찾는 거리 · 돌진 한 틱 거리 · 적이 없을 때 돌진 거리 · 돌진 피해 배율 · 박는 못 · 고정 틱 · 2번을 누를 수 있는 틱 */
  tieReach: 240,
  tieStep: 9,
  tieEmpty: 100,
  tieMul: 0.8,
  tieNails: 5,
  tieFix: 150,
  tieWindow: 300,
  /** 2 붉은 실 2번: 망치 원 반지름 · 피해 배율 · 출혈 피해(공격력 배율) · 실을 따라 돌아가는 한 틱 거리 */
  smashR: 54,
  smashMul: 1.5,
  smashBleed: 0.6,
  backStep: 12,
  /** 3 저주의 도화선: 못 하나마다 공격력 배율 · 도화선이 타고 가는 틱 · 내 자리에 박는 못 범위 · 피해 배율 */
  perNail: 0.33,
  fuseTicks: 36,
  plantR: 30,
  plantMul: 0.5,
  /** 4 심판의 못비: 노릴 적을 찾는 거리 · 연달아 치는 수 · 사이 틱 · 양옆 못 자리(몸에서) · 못 빠르기 · 못 하나 피해 배율 */
  ultReach: 320,
  ultVolleys: 10,
  ultGap: 6,
  ultSide: 22,
  ultSpeed: 13,
  ultMul: 0.45,
  /** 성흔: 박힌 못마다 · 망치로 맞힌 적마다 · 처치 · 달빛 각성 중 피해 배율 · 각성 순간 달빛 폭발 반지름 · 피해 배율 · 무적 틱 */
  gainNail: 2,
  gainHit: 3,
  gainKill: 6,
  awakeMul: 1.3,
  awakeBurstR: 90,
  awakeBurstMul: 1.5,
  awakeInv: 30,
};
