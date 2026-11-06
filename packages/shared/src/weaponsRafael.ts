// 라파엘(성국, 폭풍의 사수): 천공의 마도 복합 대궁(에테르 스코프) 하나 + 스킬 넷(1 바람 걸음 · 2 폭풍 화살비 · 3 에테르 스코프 · 4 천공의 빛 화살)
// 기본: 멀리 있는 적일수록 화살 피해 증가(초장거리) · 방에서 가장 강한 적(보스·체력 큰 적)에 표적 → 표적이 받는 피해 증가, 쓰러뜨리면 스킬 대기 감소
// 기본 공격: 화살 둘(앞으로 곧게, 처음 닿은 적) → 3타 저격(표적을 향해 모든 적을 꿰뚫는 굵은 화살). 화살은 바로 닿는 줄 판정(시드 결정성)
// 계산은 sim/rafael·rafaelKit·rafaelSkills
import type { WeaponDef } from "./content";

export const RAFAEL_WEAPONS = {
  /** 천공의 마도 복합 대궁: 에테르 스코프를 단 거대한 마도공학 활 */
  rfBow: { id: "rfBow", kind: "skybow", damageMul: 1, attackSpeed: 0.9, range: 220, projectileSpeed: 9, exclusive: "rafael" },
} as const satisfies Record<string, WeaponDef>;

/** 라파엘 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const RAFAEL = {
  /** 기본 3연격 간격 (공격 간격 배율) · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 처음으로 */
  stepTime: [0.6, 0.6, 1.1],
  comboGap: 70,
  /** 1·2타 화살: 날아가는 거리 · 맞는 폭(절반) · 피해 배율 */
  arrowLen: 240,
  arrowW: 5,
  arrowMul: 0.9,
  /** 3타 저격: 거리 · 폭(절반) · 피해 배율 · 밀침 · 표적이 앞쪽(cos 이상)에 있으면 표적을 향함 */
  snipeLen: 300,
  snipeW: 8,
  snipeMul: 2.2,
  snipePush: 6,
  snipeAimCos: 0,
  /** 초장거리: 이 거리부터 피해가 늘기 시작 · 이 거리에서 가장 셈 · 가장 셀 때 더하는 피해 */
  nearD: 40,
  farD: 200,
  farBonus: 0.6,
  /** 표적: 다시 고르는 틱 · 표적이 받는 피해 더함 · 쓰러뜨리면 남은 스킬 대기를 이 비율만큼 줄임 */
  markEvery: 30,
  markTaken: 0.25,
  markRefund: 0.3,
  /** 스킬 대기 틱 (1 바람 걸음 · 2 폭풍 화살비 · 3 에테르 스코프 · 4 천공의 빛 화살) */
  cooldowns: [480, 720, 960, 3600],
  /** 1 바람 걸음: 뒤로 뛰는 틱 · 한 틱 거리 · 떠난 자리 돌풍 반지름 · 피해 배율 · 밀침 · 다음 공격이 저격 */
  stepTicks: 10,
  stepDist: 6,
  gustR: 44,
  gustMul: 0.6,
  gustPush: 18,
  /** 2 폭풍 화살비: 표적이 없을 때 앞 거리 · 반지름 · 떨어지기까지 틱 · 내리는 횟수 · 사이 틱 · 한 번 피해 배율 · 느려짐 틱 */
  stormAt: 130,
  stormR: 50,
  stormDelay: 30,
  stormN: 6,
  stormGap: 12,
  stormMul: 0.4,
  stormSlow: 30,
  /** 3 에테르 스코프: 틱 · 그동안 모든 기본 공격이 저격 · 피해 배율 · 거리 배율 */
  scopeTicks: 300,
  scopeMul: 1.3,
  scopeLen: 1.3,
  /** 4 천공의 빛 화살(궁극기): 모으는 틱 · 길이(방을 가로지름) · 폭(절반) · 피해 배율 · 밀침 · 끝 폭발 반지름 · 폭발 피해 배율 */
  ultCharge: 45,
  ultLen: 520,
  ultW: 22,
  ultMul: 6,
  ultPush: 20,
  ultBlastR: 60,
  ultBlastMul: 2,
};
