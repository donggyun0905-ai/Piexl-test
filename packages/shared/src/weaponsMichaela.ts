// 미카엘라(성국, 공허의 인도자): 무한의 무기 보관소(떠다니는 소형 투창과 검의 비행 집합체) 하나 + 스킬 넷(1 무기 비 · 2 칼날 교대 · 3 일제 폭파 · 4 무한의 무기고)
// 방에 들어서면 포탈에서 무기가 쏟아져 곳곳에 박힘. 몸에 닿으면 그 무기로 바꿔 듦 · 대시하면 범위 안의 박힌 무기로 순간 이동해 바꿔 듦
// 바꿀 때·던질 때마다 콤보가 쌓여(피해 증가) 폭발이 일고, 폭발 둘레에 박힌 무기가 있으면 연달아 터짐. 계산은 sim/michaela·michaelaKit·michaelaSkills
import type { WeaponDef } from "./content";

export const MICHAELA_WEAPONS = {
  /** 무한의 무기 보관소: 공중에 떠다니는 무수한 소형 투창과 검 */
  mcArmory: { id: "mcArmory", kind: "armory", damageMul: 1, attackSpeed: 1, range: 60, projectileSpeed: 9, exclusive: "michaela" },
} as const satisfies Record<string, WeaponDef>;

/** 미카엘라 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const MICHAELA = {
  /** 기본 3연격 간격 (공격 간격 배율) · 공격할 수 있게 된 뒤 이 틱 동안 안 치면 처음으로 */
  stepTime: [0.6, 0.6, 1],
  comboGap: 70,
  /** 검을 들었을 때 1·2타 베기: 거리 · 부채꼴(cos 이상) · 피해 배율 · 밀침 */
  swordR: 56,
  swordCos: 0.3,
  swordMul: 1,
  swordPush: 4,
  /** 투창을 들었을 때 1·2타 찌르기: 길이 · 폭(절반) · 피해 배율 */
  spearLen: 100,
  spearW: 8,
  spearMul: 1.1,
  /** 3타 투척: 거리 · 폭(절반) · 처음 닿은 적 피해 배율 · 떨어진 자리에 박혀 폭발 */
  throwLen: 200,
  throwW: 6,
  throwMul: 1.2,
  /** 폭발: 반지름 · 피해 배율 · 연쇄: 둘레 이 거리 안의 박힌 무기도 터짐 · 연쇄 사이 틱 · 연쇄 피해 배율 · 한 무기가 다시 터질 수 있기까지 틱 */
  blastR: 40,
  blastMul: 0.8,
  chainR: 70,
  chainDelay: 6,
  chainMul: 0.5,
  chainCd: 60,
  /** 콤보: 최대 · 하나마다 피해 더함 · 바꾸거나 던지지 않으면 이 틱 뒤 0 */
  comboMax: 20,
  comboStep: 0.03,
  comboKeep: 180,
  /** 박힌 무기: 최대 수 · 방에 들어설 때 쏟아지는 수 · 벽에서 떨어진 거리 · 떨어질 때 맞히는 반지름 · 피해 배율 */
  maxBlades: 14,
  rainN: 8,
  rainEdge: 24,
  fallR: 16,
  fallMul: 0.5,
  /** 줍기: 몸에서 이 거리 안이면 바꿔 듦 · 바꿀 때 폭발 반지름 · 피해 배율 */
  pickR: 8,
  swapR: 36,
  swapMul: 0.6,
  /** 대시: 이 거리 안의 박힌 무기로 순간 이동 (대시 쪽을 먼저, cos 이상) · 도착 베기 반지름 · 피해 배율 · 무적 틱 */
  dashR: 150,
  dashCos: 0.3,
  dashHitR: 50,
  dashMul: 1.2,
  dashInv: 12,
  /** 스킬 대기 틱 (1 무기 비 · 2 칼날 교대 · 3 일제 폭파 · 4 무한의 무기고) */
  cooldowns: [480, 360, 840, 3600],
  /** 1 무기 비: 앞 거리 · 퍼지는 반지름 · 수 · 첫 무기까지 틱 · 피해 배율 */
  stormAt: 110,
  stormR: 70,
  stormN: 6,
  stormDelay: 20,
  stormMul: 0.7,
  /** 2 칼날 교대: 이 거리 안 가장 가까운 박힌 무기로 · 도착 피해 배율 · 콤보 더함 */
  shiftR: 220,
  shiftMul: 1.5,
  shiftCombo: 2,
  /** 3 일제 폭파: 박힌 무기가 모두 차례로 터짐(사라짐) · 사이 틱 · 피해 배율 */
  detGap: 4,
  detMul: 1,
  /** 4 무한의 무기고(궁극기): 틱 · 무기가 적에게 쏟아지는 간격 · 피해 배율 · 그동안 기본 공격이 모두 투척 */
  ultTicks: 480,
  ultEvery: 15,
  ultMul: 0.7,
};
