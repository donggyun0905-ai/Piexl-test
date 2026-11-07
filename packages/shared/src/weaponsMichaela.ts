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
  /** 던지기 기술: 거리 · 폭(절반) · 처음 닿은 적 피해 배율 (떨어진 자리에 무기가 박히고 다른 종류의 새 무기를 꺼냄) */
  throwLen: 200,
  throwW: 6,
  throwMul: 1.2,
  /** 일제 폭파 폭발: 반지름 · 차례로 터지는 사이 틱 */
  blastR: 40,
  chainDelay: 6,
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
  /** 줍기: 몸에서 이 거리 안이면 바꿔 듦 → 그 무기의 기술 둘이 이 틱 사이로 나감 */
  pickR: 8,
  touchGap: 12,
  /** 대시: 이 거리 안의 박힌 무기로 순간 이동 (대시 쪽을 먼저, cos 이상) · 무적 틱 */
  dashR: 150,
  dashCos: 0.3,
  dashInv: 12,
  /** 스킬 대기 틱 (1 무기 비 · 2 칼날 교대 · 3 일제 폭파 · 4 무한의 무기고) */
  cooldowns: [480, 360, 840, 3600],
  /** 1 무기 비: 앞 거리 · 퍼지는 반지름 · 수 · 첫 무기까지 틱 · 피해 배율 */
  stormAt: 110,
  stormR: 70,
  stormN: 6,
  stormDelay: 20,
  stormMul: 0.7,
  /** 2 칼날 교대: 이 거리 안 가장 가까운 박힌 무기로 (그 무기 기술 피해 배율) · 콤보 더함 */
  shiftR: 220,
  shiftMul: 1.5,
  shiftCombo: 2,
  /** 2 칼날 교대 뒤 이 틱 안에 잡은 무기로 적을 잡으면 2번 대기 초기화 */
  shiftResetT: 90,
  /** 3 일제 폭파: 박힌 무기가 모두 차례로 터짐(사라짐) · 사이 틱 · 피해 배율 */
  detGap: 4,
  detMul: 1,
  /** 4 무한의 무기고(궁극기): 틱 · 무기가 모든 적에게 한꺼번에 쏟아지는 간격 · 피해 배율 · 그동안 기본 공격이 모두 투척 */
  ultTicks: 480,
  ultEvery: 15,
  ultMul: 0.7,
  /** 4 무한의 무기고: 한 번에 적마다 떨어지는 수 · 맵 곳곳에 같이 떨어지는 수 · 곳곳 피해 배율 */
  ultPerFoe: 1,
  ultScatter: 4,
  ultScatterMul: 0.5,
};

/** 무기 기술 수치 (무기마다 어떤 기술을 쓰는지는 michaelaWeaponMoves) · 배율 1 = 공격력 100% */
export const MICHAELA_MOVES = {
  /** 베기: 앞 부채꼴 거리 · cos 이상 · 피해 배율 */
  slashR: 60,
  slashCos: 0.2,
  slashMul: 1,
  /** 내려찍기: 앞 거리 · 반지름 · 피해 배율 · 기절 틱 */
  slamAt: 34,
  slamR: 36,
  slamMul: 1.4,
  slamStun: 20,
  /** 휘두르기: 넓은 부채꼴 거리 · cos 이상 · 피해 배율 · 밀침 */
  sweepR: 72,
  sweepCos: -0.3,
  sweepMul: 1.1,
  sweepPush: 12,
  /** 회전 베기: 둘레 반지름 · 피해 배율 */
  spinR: 62,
  spinMul: 1.1,
  /** 찌르기: 길이 · 폭(절반) · 피해 배율 */
  thrustLen: 100,
  thrustW: 8,
  thrustMul: 1.2,
  /** 돌진 찌르기: 앞으로 나아가는 거리 · 폭(절반) · 피해 배율 */
  lungeDist: 70,
  lungeW: 12,
  lungeMul: 1.4,
  /** 세 갈래 던지기: 양옆 각(cos·sin) · 한 갈래 피해 배율 (가운데만 박힘) */
  fanC: 0.94,
  fanS: 0.34,
  fanMul: 0.8,
  /** X 베기: 거리 · cos 이상 · 한 번 피해 배율 (두 번) */
  crossR: 60,
  crossCos: 0.3,
  crossMul: 0.8,
  /** 땅 가르기: 길이 · 폭(절반) · 피해 배율 · 느려짐 틱 */
  quakeLen: 150,
  quakeW: 16,
  quakeMul: 1.3,
  quakeSlow: 40,
  /** 올려베기: 거리 · cos 이상 · 피해 배율 · 크게 밀침 */
  riseR: 58,
  riseCos: 0.4,
  riseMul: 1.3,
  risePush: 22,
  /** 회오리: 둘레 반지름 · 한 번 피해 배율 · 횟수 · 사이 틱 */
  whirlR: 70,
  whirlMul: 0.55,
  whirlN: 3,
  whirlGap: 10,
  /** 칼비: 앞 거리 · 퍼지는 반지름 · 수 · 피해 배율 (떨어진 무기는 박힘) */
  skyAt: 90,
  skyR: 50,
  skyN: 3,
  skyMul: 0.7,
  /** 꿰뚫는 빛 창: 길이 · 폭(절반) · 피해 배율 (줄 위 모두) */
  pierceLen: 260,
  pierceW: 10,
  pierceMul: 1.6,
};

/** 무기 속성 8가지 (그림 무기마다 하나, michaelaWeaponList): 0 성은 · 1 빙결 · 2 홍염 · 3 혈월 · 4 천광 · 5 자전 · 6 비취 · 7 청해. 맞힐 때·터질 때 속성 효과 */
export const MICHAELA_ELEM = {
  /** 성은(은빛 대검): 피해 배율 · 더 밀침 */
  silverMul: 1.25,
  silverPush: 6,
  /** 빙결(하늘색 수정): 얼음 피해 (그 피해 대비) · 느려짐 틱 */
  frostMul: 0.2,
  frostSlow: 40,
  /** 홍염(붉은 불꽃): 화상 세기 (공격력 배율, 0.5초마다 그 25%) */
  flameBurn: 1,
  /** 혈월(검붉은 마검): 출혈 피해 (그 피해 대비) */
  bloodMul: 0.35,
  /** 천광(금빛 빛): 빛 피해 (그 피해 대비) */
  holyMul: 0.3,
  /** 자전(보라 번개): 이 거리 안 다른 적 하나에게 번개 (그 피해 대비) */
  stormR: 70,
  stormMul: 0.5,
  /** 비취(초록 독): 독 세기 (공격력 배율, 0.5초마다) · 틱 */
  jadePoison: 0.2,
  jadeTicks: 180,
  /** 청해(청록 물결): 물결 피해 (그 피해 대비) · 더 밀침 */
  tideMul: 0.2,
  tidePush: 10,
};
