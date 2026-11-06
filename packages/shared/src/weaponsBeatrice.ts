// 베아트리스(성국, 심판의 불꽃): 사멸·절멸의 쌍검 하나 + 스킬 넷(1 태양 검날 · 2 일식의 춤 · 3 태양의 낙인 · 4 자애)
// 기본 공격: 왼→오 베기 · 오→왼 베기로 X자 → 3타가 그 X자를 다시 X로 베어 터뜨림
// 나를 때린 적에게 '악'이 쌓임(최대 10) → 10이면 '처단'(X자 10개) · 처단으로 지운 악 100개마다 '심판'(방 전체 X자 태양 검격)
// 체력이 적을수록 재생력(최대 30)·화염 계수(최대 공격력의 200%, 자애 중 400%)가 오름. 계산은 sim/beatrice·beatriceSkills·beatriceKit
import type { WeaponDef } from "./content";

export const BEATRICE_WEAPONS = {
  /** 사멸·절멸의 쌍검: 성스러운 백은과 꺼지지 않는 화염의 성석이 박힌 두 자루 */
  btTwin: { id: "btTwin", kind: "judgment", damageMul: 1.2, attackSpeed: 1, range: 60, projectileSpeed: 7, exclusive: "beatrice" },
} as const satisfies Record<string, WeaponDef>;

/** 베아트리스 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀, 각은 라디안) */
export const BEATRICE = {
  /** 기본 3연격 간격 (공격 간격 배율) · 이 틱 동안 안 베면 처음으로 */
  stepTime: [0.55, 0.55, 0.95],
  comboGap: 60,
  /** 1·2타 대각선 베기 (둘이 겹쳐 X자): 칼선 반 길이 · 맞는 폭(절반) · 피해 배율 */
  slashLen: 42,
  slashW: 16,
  slashMul: 1,
  /** X자 가운데까지 앞쪽 거리 · 3타 X자 터뜨림 반지름 · 피해 배율 · 밀어냄 */
  crossAt: 34,
  crossR: 40,
  crossMul: 1.7,
  crossPush: 8,
  /** 화염 계수: 체력이 가득일 때 · 체력이 바닥일 때 최대 · 자애 중 최대 (공격력 배율) */
  fireMin: 0.4,
  fireMax: 2,
  fireUlt: 4,
  /** 재생력: 체력이 바닥일 때 최대 (재생력 10 = 초당 체력 1) */
  regenMax: 30,
  /** 악: 최대 · 하나마다 받는 피해 더함 · 처단 X자 수 · X자 사이 틱 · X자 하나 피해 배율 · 화염 몫(화염 계수 배율) · 처단 반지름 */
  evilMax: 10,
  evilTaken: 0.04,
  execN: 10,
  execGap: 4,
  execMul: 0.5,
  execFire: 0.2,
  execR: 26,
  /** 나를 때린 적을 찾는 거리 (때린 적 종류가 없을 때 가장 가까운 적) */
  blameR: 220,
  /** 심판: 지운 악 몇 개마다 · 예고 틱 · 피해 배율 · 화염 몫 */
  judgeAt: 100,
  judgeWarn: 40,
  judgeMul: 5,
  judgeFire: 3,
  /** 화상: 최대 겹 · 남는 틱 · 피해 간격 · 겹 하나 피해(공격력 × 화염 계수 배율) */
  burnMax: 5,
  burnTicks: 240,
  burnEvery: 30,
  burnMul: 0.06,
  /** 스킬 대기 틱 (1 태양 검날 · 2 일식의 춤 · 3 태양의 낙인 · 4 자애) */
  cooldowns: [1080, 420, 540, 3600],
  /** 1 태양 검날: 유지 틱 · 공격 속도 배율 · 기본 공격 화염 더함(화염 계수 배율) */
  solarTicks: 600,
  solarSpeed: 1.3,
  solarFire: 0.35,
  /** 2 일식의 춤: 돌진 틱 · 한 틱 거리 · 피해 배율 · 화염 몫 · 강화 베기 둘 피해 배율 · 강화 베기 거리 · 두 번째 베기까지 틱 */
  danceTicks: 10,
  danceStep: 11,
  danceMul: 1.5,
  danceFire: 0.6,
  twinMul: 1.2,
  twinLen: 52,
  twinGap: 7,
  /** 3 태양의 낙인: 빠르기 · 거리 · 폭(절반) · 피해 배율 · 화염 몫 · 더하는 악 */
  brandSpeed: 8,
  brandRange: 280,
  brandW: 22,
  brandMul: 2,
  brandFire: 0.8,
  brandEvil: 2,
  /** 4 자애: 유지 틱 · 끝난 뒤 회복 불가 틱 */
  graceTicks: 600,
  noHealTicks: 600,
};
