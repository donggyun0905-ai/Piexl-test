// 아수라 전용 아이템 20개: 하나하나가 귀신 주먹에 새 기술을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 효과는 sim/asura·asHit·asMoves·asAwake. 수치는 ASURA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "asura" as const, effect: true as const });

export const ASURA_PASSIVES = {
  /** 분쇄: 주먹 한 번의 피해를 6번으로 나눠 한 틱에 한 번씩 (합은 같지만 치명타·추가 피해가 6번 굴러감) */
  asCrush: P("asCrush", [{ stat: "damage", mul: 1.05 }]),
  /** 귀진: 몸 둘레 남색 영역 · 안에 들어온 적 머리 위에 다이아 표식 · 방어력 감소 (받는 피해 증가) */
  asField: P("asField", [{ stat: "maxHp", add: 15 }]),
  /** 파동: 모든 공격 끝에 앞으로 부채꼴 파동이 한 번 더 침 */
  asWave: P("asWave", [{ stat: "range", mul: 1.06 }]),
  /** 아수라(필살기): 공격마다 확률로 각성 10초 · 누를 때마다 1·2타 → 1·2타 → 3타(바닥 연속 강타) → 4타(기절·큰 피해) */
  asUlt: P("asUlt", [{ stat: "damage", mul: 1.1 }]),
  /** 연발: 공격마다 확률로 연속 펀치가 같이 나가 한 틱에 한 번씩 15번 약하게 때림 */
  asRapid: P("asRapid", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 악귀: 때릴 때마다 높은 확률로 붉게 터지며 추가 피해 (나눠 때리는 한 대 한 대에도) */
  asDemon: P("asDemon", [{ stat: "damage", mul: 1.06 }]),
  /** 철권: 주먹 피해가 크게 오름 */
  asIron: P("asIron", [{ stat: "damage", mul: 1.2 }]),
  /** 귀수 확장: 귀신 주먹이 더 넓게 닿음 */
  asReach: P("asReach", [{ stat: "range", mul: 1.08 }]),
  /** 수라장: 맞힐 때마다 공격이 빨라짐 (5번까지 쌓임, 잠깐 안 맞히면 사라짐) */
  asFury: P("asFury", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 귀문 개방: 아수라 각성이 15초 이어짐 */
  asGate: P("asGate", [{ stat: "maxHp", add: 10 }]),
  /** 육도: 아수라 각성 확률이 오름 */
  asSix: P("asSix", [{ stat: "luck", add: 3 }]),
  /** 천근추: 각성 4타 기절이 길어지고 더 넓게 내리침 */
  asWeight: P("asWeight", [{ stat: "damage", mul: 1.05 }]),
  /** 귀압: 파동 피해가 커지고 적을 밀쳐 냄 */
  asPress: P("asPress", [{ stat: "range", mul: 1.05 }]),
  /** 업화: 악귀가 터진 적이 불탐 */
  asHell: P("asHell", [{ stat: "damage", mul: 1.05 }]),
  /** 분노의 팔: 체력이 절반 아래면 피해가 커짐 */
  asRage: P("asRage", [{ stat: "maxHp", add: 10 }]),
  /** 귀갑: 받는 피해가 줄어듦 */
  asShell: P("asShell", [{ stat: "maxHp", add: 20 }]),
  /** 마수 연타: 연발이 더 자주 나가고 더 많이 때림 */
  asBarrage: P("asBarrage", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 육비 난무: 공격마다 귀신 주먹 하나가 가까운 적에게 날아가 때림 */
  asFlying: P("asFlying", [{ stat: "range", mul: 1.05 }]),
  /** 혼백 흡수: 처치하면 확률로 체력 회복 */
  asSoul: P("asSoul", [{ stat: "maxHp", add: 15 }]),
  /** 귀신 걸음: 대시한 뒤 다음 주먹이 2배로 넓게 닿음 */
  asStep: P("asStep", [{ stat: "moveSpeed", add: 0.08 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀, 확률은 0~1) */
export const ASURA_PERKS = {
  /** 분쇄: 나눠 때리는 수 (한 틱에 한 번) */
  asCrush: { n: 6 },
  /** 귀진: 영역 반지름 · 표식 적이 받는 피해 증가 (방어력 -5 몫) */
  asField: { r: 64, taken: 0.1 },
  /** 파동: 공격 뒤 파동까지 틱 · 반지름 · 부채꼴 너비(앞 방향과의 코사인, 작을수록 넓음) · 피해 배율 */
  asWave: { delay: 8, r: 70, arc: 0.45, mul: 0.5 },
  /** 아수라 각성: 공격마다 확률 */
  asUlt: { chance: 0.03 },
  /** 연발: 공격마다 확률 · 때리는 수(한 틱에 한 번) · 한 번 피해 배율(약함) · 반지름 */
  asRapid: { chance: 0.3, hits: 15, mul: 0.06, r: 34 },
  /** 악귀: 한 대마다 확률 · 그 한 대 피해에 더하는 배율 */
  asDemon: { chance: 0.6, mul: 0.35 },
  /** 귀수 확장: 주먹 크기 배율 */
  asReach: { size: 1.25 },
  /** 수라장: 쌓일 때마다 공격 속도 · 가장 많이 · 안 맞히면 사라지는 틱 */
  asFury: { add: 0.06, max: 5, keep: 120 },
  /** 귀문 개방: 각성 지속 틱 */
  asGate: { ticks: 900 },
  /** 육도: 각성 확률 */
  asSix: { chance: 0.05 },
  /** 천근추: 4타 기절 틱 · 4타 크기 배율 */
  asWeight: { stun: 150, size: 1.3 },
  /** 귀압: 파동 피해 배율 */
  asPress: { mul: 1.5 },
  /** 업화: 불타는 피해 (악귀 추가 피해의 배율) */
  asHell: { burn: 1 },
  /** 분노의 팔: 체력 비율 아래 · 피해 배율 */
  asRage: { below: 0.5, mul: 1.3 },
  /** 귀갑: 받는 피해 배율 */
  asShell: { taken: 0.85 },
  /** 마수 연타: 연발 확률 · 때리는 수 */
  asBarrage: { chance: 0.5, hits: 25 },
  /** 육비 난무: 피해 배율 · 빠르기 · 찾는 거리 · 반지름 · 사는 틱 */
  asFlying: { mul: 0.6, speed: 6, dist: 200, r: 6, life: 60 },
  /** 혼백 흡수: 처치마다 확률 · 회복량 */
  asSoul: { chance: 0.15, heal: 3 },
  /** 귀신 걸음: 대시 뒤 다음 주먹 크기 배율 */
  asStep: { size: 2 },
};
