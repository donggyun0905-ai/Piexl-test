// 백인장 전용 아이템 20: 콤보 3(적색 난무·선혈 회전참·섬광 돌진베기) · 확률 원거리 기술 4 · 스킬 개방 4(숫자 키 1~4) · 보조 9(드론 4·콤보 2·확률 1·스킬/생존 2)
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
  /** 편대 증설: 미니 창 드론이 늘어남 */
  bjFleet: P("bjFleet", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 과열 드릴: 드론이 더 세게·더 자주 찌름 */
  bjHeat: P("bjHeat", [{ stat: "damage", mul: 1.05 }]),
  /** 혈흔: 드론에 찔린 적은 출혈 */
  bjStain: P("bjStain", [{ stat: "luck", add: 2 }]),
  /** 표적 공유: 적안 표식이 붙은 적을 드론 전부가 먼저 노리고 더 세게 찌름 */
  bjShare: P("bjShare", [{ stat: "range", mul: 1.05 }]),
  /** 연환: 섬광 돌진베기까지 콤보를 끝내면 잠깐 공격이 빨라짐 */
  bjChain: P("bjChain", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 잔월: 기본 공격의 검격이 앞으로 날아가 줄 위의 적을 한 번 더 벰 */
  bjWane: P("bjWane", [{ stat: "range", mul: 1.06 }]),
  /** 날개 과부하: 확률 원거리 기술 4종이 더 자주 나감 */
  bjOverload: P("bjOverload", [{ stat: "damage", mul: 1.05 }]),
  /** 사신의 계약: 표식·출혈·죽음이 걸린 적을 처치하면 체력 회복 · 스킬 대기 감소 */
  bjPact: P("bjPact", [{ stat: "maxHp", add: 15 }]),
  /** 강철 날개: 받는 피해 감소 · 섬광 돌진베기가 끝난 뒤 잠깐 더 무적 */
  bjSteel: P("bjSteel", [{ stat: "maxHp", add: 20 }]),
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
  /** 종언의 붉은 날개: 대기 틱 · 한 번 피해 배율 · 날아가는 미니 드론 수 (한 틱에 한 기) · 드론이 날아가 꽂히기까지 틱 */
  bjEnd: { cd: 3600, mul: 0.12, hits: 180, fly: 12 },
  /** 편대 증설: 드론 수 */
  bjFleet: { n: 8 },
  /** 과열 드릴: 한 번 찌르는 피해 배율 · 다시 찌르기까지 틱 */
  bjHeat: { mul: 0.2, cd: 21 },
  /** 혈흔: 출혈 틱 · 0.5초 피해 배율 */
  bjStain: { ticks: 180, mul: 0.1 },
  /** 표적 공유: 표식 붙은 적에게 드론 피해 배율 */
  bjShare: { mul: 2 },
  /** 연환: 지속 틱 · 공격 속도 배율 */
  bjChain: { ticks: 300, speed: 1.3 },
  /** 잔월: 날아가는 거리 · 맞히는 너비 · 피해 배율 */
  bjWane: { len: 110, w: 12, mul: 0.6 },
  /** 날개 과부하: 확률 기술마다 더하는 확률 */
  bjOverload: { add: 0.05 },
  /** 사신의 계약: 회복량 · 줄어드는 스킬 대기 틱 */
  bjPact: { heal: 2, cut: 60 },
  /** 강철 날개: 받는 피해 배율 · 돌진베기 뒤 무적 틱 */
  bjSteel: { taken: 0.88, invuln: 30 },
};
