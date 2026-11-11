// 백인장 전용 아이템: 콤보 3(적색 난무·선혈 회전참·섬광 돌진베기) · 확률 원거리 기술 4 · 스킬 개방 4(숫자 키 1~4)
// 효과는 sim/baekinjang·bjCombo·bjProcs·bjSkills·bjVolley. 수치는 BJ_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "baekinjang" as const, effect: true as const });

export const BAEKINJANG_PASSIVES = {
  /** 적색 난무: 기본 공격 다음 클릭 · 붉은 칼날이 좌우로 이어지고 마지막에 한꺼번에 터짐 (2타) */
  bjFlurry: P("bjFlurry", [{ stat: "damage", mul: 1.05 }]),
  /** 선혈 회전참: 그다음 클릭 · 몸을 돌려 둘레를 붉은 원형 칼날로 크게 벰 (4타) */
  bjSpin: P("bjSpin", [{ stat: "range", mul: 1.05 }]),
  /** 섬광 돌진베기: 그다음 클릭 · 앞으로 길게 돌진하며 크게 한 번 벰 */
  bjDash: P("bjDash", [{ stat: "moveSpeed", add: 0.06 }]),
  /** 붉은 날개 폭우: 공격마다 확률 · 날개에서 붉은 칼날 수십 개가 앞으로 쏟아짐 (15타) */
  bjRain: P("bjRain", [{ stat: "damage", mul: 1.05 }]),
  /** 추적 침격: 공격마다 확률 · 드릴이 한 적에게 잇달아 꽂힘 (15타) */
  bjNeedle: P("bjNeedle", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 관통 나선창: 공격마다 확률 · 거대한 나선 창이 곧게 꿰뚫음 (강한 1타) */
  bjSpear: P("bjSpear", [{ stat: "damage", mul: 1.06 }]),
  /** 기계익 충격파: 공격마다 확률 · 날개를 펼쳐 몸 둘레 넓게 충격파 (1타) */
  bjShock: P("bjShock", [{ stat: "maxHp", add: 15 }]),
  /** 적안 표식 (스킬 1): 한 적에게 침을 꽂고 표식 · 받는 피해·치명타로 맞을 확률 증가 */
  bjEye: P("bjEye", [{ stat: "luck", add: 2 }]),
  /** 혈철 감옥 (스킬 2): 칼날 감옥에 가두고 계속 벰 · 보스는 갇히지 않는 대신 큰 피해와 출혈 */
  bjPrison: P("bjPrison", [{ stat: "maxHp", add: 10 }]),
  /** 사신의 팔연참 (스킬 3): 여덟 번 베고 별 모양으로 터짐 · 죽음 상태이상 */
  bjReaper: P("bjReaper", [{ stat: "damage", mul: 1.08 }]),
  /** 종언의 붉은 날개 (스킬 4·궁극기): 미니 드론 180기가 180번 찌름 · 끝에 살아남은 적에게 쌓인 피해를 한 번 더 */
  bjEnd: P("bjEnd", [{ stat: "damage", mul: 1.1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀, 확률은 0~1) */
export const BJ_PERKS = {
  /** 적색 난무: 치는 거리 · 반지름 · 한 번 피해 배율 · 때리는 수 · 간격 틱 · 다시 누르기까지 틱 */
  bjFlurry: { reach: 26, r: 38, mul: 0.8, hits: 2, every: 6, cd: 22 },
  /** 선혈 회전참: 몸 둘레 반지름 · 한 번 피해 배율 · 때리는 수 · 간격 틱 · 다시 누르기까지 틱 */
  bjSpin: { r: 54, mul: 0.6, hits: 4, every: 4, cd: 26 },
  /** 섬광 돌진베기: 한 틱에 가는 거리 · 가는 틱 · 피해 배율 · 맞히는 너비 · 다시 누르기까지 틱 */
  bjDash: { step: 9, ticks: 10, mul: 3, w: 14, cd: 30 },
  /** 붉은 날개 폭우: 공격마다 확률 · 닿는 거리 · 부채꼴 너비(코사인) · 한 번 피해 배율 · 때리는 수 · 간격 틱 */
  bjRain: { chance: 0.12, len: 150, arc: 0.8, mul: 0.2, hits: 15, every: 2 },
  /** 추적 침격: 공격마다 확률 · 찾는 거리 · 한 번 피해 배율 · 때리는 수 · 간격 틱 */
  bjNeedle: { chance: 0.15, dist: 240, mul: 0.22, hits: 15, every: 3 },
  /** 관통 나선창: 공격마다 확률 · 길이 · 맞히는 너비 · 피해 배율 */
  bjSpear: { chance: 0.1, len: 260, w: 16, mul: 4 },
  /** 기계익 충격파: 공격마다 확률 · 반지름 · 피해 배율 */
  bjShock: { chance: 0.1, r: 110, mul: 2.2 },
  /** 적안 표식: 대기 틱 · 찾는 거리 · 피해 배율 · 표식 틱 · 받는 피해 증가 · 치명타로 맞을 확률 증가 */
  bjEye: { cd: 480, dist: 260, mul: 2, ticks: 480, taken: 0.1, crit: 0.15 },
  /** 혈철 감옥: 대기 틱 · 찾는 거리 · 반지름 · 한 번 피해 배율 · 때리는 수 · 간격 틱 · 보스 큰 피해 배율 · 보스 출혈 틱 · 출혈 0.5초 피해 배율 */
  bjPrison: { cd: 840, dist: 220, r: 46, mul: 0.35, hits: 15, every: 12, bossMul: 6, bleed: 300, bleedMul: 0.3 },
  /** 사신의 팔연참: 대기 틱 · 찾는 거리 · 반지름 · 한 번 피해 배율 · 때리는 수 · 간격 틱 · 마지막 별 폭발 배율 · 죽음 틱 · 1초마다 최대 체력 비율 · 보스는 이 값으로 나눔(반감) */
  bjReaper: { cd: 1200, dist: 220, r: 60, mul: 0.7, hits: 8, every: 4, star: 2, death: 300, pct: 0.02, bossDiv: 2 },
  /** 종언의 붉은 날개: 대기 틱 · 한 번 피해 배율 · 때리는 수 (한 틱에 한 번) */
  bjEnd: { cd: 3600, mul: 0.12, hits: 180 },
};
