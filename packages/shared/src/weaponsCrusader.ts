// 크루세이더(새벽의 성흔, 성십자가의 거인 · 탱커): 거대한 십자가. 스킬 없이 성흔 게이지 (공용 weaponsDawn.STIGMA) + 속죄의 무게
// 기본 공격은 내려찍기: 누르면 십자가를 머리 위로 들어 올리고(버팀: 받는 피해 감소·느리게 걸음) → 앞 땅을 내리찍음
// 찍은 자리에서 땅이 십자가 모양으로 갈라져 나감 (앞 긴 팔 · 양옆 · 뒤 짧은 팔, 마디마다 차례로 돌판이 솟음)
// 속죄의 무게: 받은 피해·맞힌 적만큼 참 → 가득 차면 다음 내려찍기 때 하늘에서 심판의 십자가가 떨어짐
// 대시: 성벽 돌진 (앞 적을 십자가로 밀고 가다 끝에서 들이받음 · 벽에 부딪히면 더 아픔) · 성흔 → 성십자가 강림 각성 (거인화). 계산은 sim/crusader·crusaderKit
import type { WeaponDef } from "./content";

export const CRUSADER_WEAPONS = {
  /** 성십자가: 악마를 짓눌러 부수는 거대한 돌 십자가 */
  crCross: { id: "crCross", kind: "greatCross", damageMul: 1, attackSpeed: 0.7, range: 50, projectileSpeed: 8, exclusive: "crusader" },
} as const satisfies Record<string, WeaponDef>;

/** 크루세이더 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const CRUSADER = {
  /** 한 번 공격 시간 중 들어 올리는 몫 · 내려찍은 뒤 쉬는 몫 (공격 속도 따름) · 들어 올리는 동안 이동 배율 */
  windT: 0.38,
  recoverT: 0.62,
  windMove: 0.4,
  /** 버팀: 십자가를 들어 올리는 동안 받는 피해 배율 */
  braceCut: 0.5,
  /** 내려찍기: 찍는 자리 앞 거리 · 반지름 · 피해 배율 · 밀침 · 기절 틱 (사거리 증가 따름) */
  slamFwd: 26,
  slamR: 26,
  slamMul: 1.6,
  slamPush: 6,
  slamStun: 12,
  /** 십자 균열: 마디 길이 · 마디 반지름 · 마디 사이 틱 · 피해 배율 · 앞 팔 마디 수 · 양옆 팔 · 뒤 팔 */
  segLen: 17,
  segW: 10,
  segGap: 3,
  segMul: 0.9,
  armLong: 4,
  armSide: 2,
  armBack: 1,
  /** 속죄의 무게: 가득 · 받은 피해 1마다 · 내려찍기에 맞은 적마다 */
  weightMax: 100,
  weightPerHp: 1.5,
  weightPerHit: 3,
  /** 심판의 십자가: 떨어지는 틱 · 반지름 · 피해 배율 · 기절 틱 · 밀침 */
  judgeFall: 24,
  judgeR: 44,
  judgeMul: 2.6,
  judgeStun: 45,
  judgePush: 12,
  /** 성벽 돌진 (대시): 앞 적을 잡는 거리 · 끝에서 들이받는 피해 배율 · 기절 틱 · 벽에 부딪힌 피해 배율 · 벽 기절 틱 · 보스는 한 번 피해 배율 */
  ramR: 14,
  ramMul: 1.2,
  ramStun: 30,
  wallMul: 1.8,
  wallStun: 50,
  bossMul: 0.8,
  /** 성흔: 맞힐 때 · 처치 · 심판의 십자가 */
  gainHit: 1,
  gainKill: 3,
  gainJudge: 8,
  /** 성십자가 강림 (각성): 처음 거대한 십자가 반지름 · 피해 배율 · 기절 틱 · 잠깐 무적 틱 · 받는 피해 배율 · 그림 크기 */
  awakeR: 90,
  awakeMul: 2.5,
  awakeStun: 60,
  awakeInv: 40,
  awakeCut: 0.6,
  awakeScale: 1.35,
  /** 거인의 발걸음 (각성 중 걸으면): 간격 틱 · 반지름 · 피해 배율 */
  stepEvery: 22,
  stepR: 30,
  stepMul: 0.45,
};
