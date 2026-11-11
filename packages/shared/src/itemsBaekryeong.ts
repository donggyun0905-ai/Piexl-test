// 백령 전용 아이템 20개: 하나하나가 대태도·유령팔·영혼에 새 기술·능력을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 효과는 sim/baekryeong·baekSlash·baekSword·baekSoul. 수치는 BAEK_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "baekryeong" as const, effect: true as const });

export const BAEK_PASSIVES = {
  /** 혼령참: 유령팔 참격에 망령이 같이 날아감 */
  byWraith: P("byWraith", [{ stat: "damage", mul: 1.06 }]),
  /** 삼위령: 날아가는 망령이 셋 */
  byTrinity: P("byTrinity", [{ stat: "range", mul: 1.05 }]),
  /** 위백도: 망령에 닿은 적에게 검무 소용돌이 추가 피해 3번 */
  byWhirl: P("byWhirl", [{ stat: "maxHp", add: 10 }]),
  /** (진)대태도: 유령팔이 벨 때 확률로 하늘에서 큰 대태도가 떨어짐 */
  byGreat: P("byGreat", [{ stat: "damage", mul: 1.08 }]),
  /** (진)대태도-랑: 대태도가 떨어진 곳 뒤로 맵 끝까지 대태도가 이어 떨어짐 */
  byGreatWolf: P("byGreatWolf", [{ stat: "attackSpeed", add: 0.06 }]),
  /** (진)대태도-백: 유령팔이 벨 때 확률로 범위 끝에 대태도가 꽂혀 둘레 적에게 번개 */
  byGreatWhite: P("byGreatWhite", [{ stat: "maxHp", add: 15 }]),
  /** 영혼 포식: 처치하면 영혼이 더 쌓임 */
  byFeast: P("byFeast", [{ stat: "luck", add: 2 }]),
  /** 혼 흡수: 처치하면 확률로 체력 회복 */
  byDrain: P("byDrain", [{ stat: "maxHp", add: 15 }]),
  /** 오니의 뿔: 대태도 베기가 더 넓게 닿음 */
  byHorn: P("byHorn", [{ stat: "range", mul: 1.1 }]),
  /** 넓은 참격: 유령팔 참격이 더 큼 */
  byWide: P("byWide", [{ stat: "damage", mul: 1.05 }]),
  /** 이연참: 유령팔 참격이 확률로 한 번 더 */
  byTwin: P("byTwin", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 청혼불: 백령의 모든 공격에 맞은 적에게 청염 상태이상 */
  byFlame: P("byFlame", [{ stat: "damage", mul: 1.05 }]),
  /** 유령 걸음: 대시가 끝난 자리에 혼불이 터짐 */
  byStep: P("byStep", [{ stat: "moveSpeed", add: 0.08 }]),
  /** 혼의 가호: 받는 피해 감소 */
  byGuard: P("byGuard", [{ stat: "maxHp", add: 20 }]),
  /** 원혼: 영혼 게이지 칸마다 피해가 오름 */
  byHaunt: P("byHaunt", [{ stat: "damage", mul: 1.04 }]),
  /** 귀신 들림: 체력이 절반 아래면 공격이 빨라짐 */
  byPossess: P("byPossess", [{ stat: "attackSpeed", add: 0.08 }]),
  /** 저승 베기: 체력이 적은 적에게 베기 피해가 커짐 */
  byReaper: P("byReaper", [{ stat: "damage", mul: 1.06 }]),
  /** 혼등: 처치하면 확률로 혼불이 가까운 적에게 날아감 */
  byWisp: P("byWisp", [{ stat: "luck", add: 2 }]),
  /** 서리 혼: 유령팔 참격·망령에 닿은 적이 느려짐 */
  byFrost: P("byFrost", [{ stat: "range", mul: 1.05 }]),
  /** 혼 부름: 영혼 게이지 칸에 필요한 영혼이 줄어듦 */
  byCall: P("byCall", [{ stat: "luck", add: 3 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱, 거리는 픽셀, 확률은 0~1) */
export const BAEK_PERKS = {
  /** 혼령참: 망령 수 · 피해 배율 · 한 틱에 나아가는 거리 · 사는 틱 · 반지름 */
  byWraith: { n: 1, mul: 0.7, speed: 4, life: 50, r: 10 },
  /** 삼위령: 망령 수 · 벌어지는 각도(라디안) */
  byTrinity: { n: 3, spread: 0.35 },
  /** 위백도: 추가 피해 수 · 몇 틱마다 · 피해 배율 · 소용돌이 반지름 */
  byWhirl: { hits: 3, every: 8, mul: 0.35, r: 22 },
  /** (진)대태도: 확률 · 떨어지기까지 틱 · 반지름 · 피해 배율 */
  byGreat: { chance: 0.25, delay: 18, r: 20, mul: 2.2 },
  /** (진)대태도-랑: 다음 대태도까지 거리 · 몇 틱마다 하나씩 · 피해 배율(대태도의) · 범위 배율(대태도의) · 가장 많이 이어지는 수 */
  byGreatWolf: { gap: 22, every: 5, mul: 0.8, size: 0.7, max: 30 },
  /** (진)대태도-백: 확률 · 꽂혀 있는 틱 · 범위 반지름 · 몇 틱마다 번개 · 피해 배율 (맵에 하나만, 사라져야 다시 생김) */
  byGreatWhite: { chance: 0.2, life: 300, r: 56, every: 30, mul: 0.5 },
  /** 영혼 포식: 처치마다 더 쌓이는 영혼 */
  byFeast: { extra: 1 },
  /** 혼 흡수: 확률 · 회복 */
  byDrain: { chance: 0.12, heal: 2 },
  /** 오니의 뿔: 베는 거리·넓이 배율 */
  byHorn: { size: 1.25 },
  /** 넓은 참격: 참격 크기 배율 */
  byWide: { size: 1.3 },
  /** 이연참: 확률 · 한 번 더 나가기까지 틱 */
  byTwin: { chance: 0.3, delay: 8 },
  /** 청혼불: 청염 상태이상 한 번 피해 배율 (공격력 ×, 블루 플레임과 같은 청염: 0.5초마다 · 2.5초) */
  byFlame: { mul: 0.32 },
  /** 유령 걸음: 반지름 · 피해 배율 */
  byStep: { r: 40, mul: 1 },
  /** 혼의 가호: 받는 피해 배율 */
  byGuard: { taken: 0.88 },
  /** 원혼: 게이지 칸마다 오르는 피해 */
  byHaunt: { per: 0.02 },
  /** 귀신 들림: 체력 비율 아래 · 공격 속도 배율 */
  byPossess: { below: 0.5, speed: 1.3 },
  /** 저승 베기: 적 체력 비율 아래 · 베기 피해 배율 */
  byReaper: { below: 0.25, mul: 2 },
  /** 혼등: 확률 · 피해 배율 · 찾는 거리 */
  byWisp: { chance: 0.25, mul: 0.8, dist: 200 },
  /** 서리 혼: 느려지는 틱 */
  byFrost: { slow: 60 },
  /** 혼 부름: 필요한 영혼 배율 */
  byCall: { need: 0.7 },
};
