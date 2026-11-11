// 래빗 전용 아이템 20개: 하나하나가 망치·땅울림에 새 기술·능력을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 효과는 sim/rabbit·rabbitMarks·rabbitUlt. 수치는 RABBIT_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "rabbit" as const, effect: true as const });

export const RABBIT_PASSIVES = {
  /** 땅울림: 내리찍은 곳 앞으로 땅울림이 맵 끝까지 이어짐 */
  rbQuake: P("rbQuake", [{ stat: "damage", mul: 1.06 }]),
  /** 세 갈래 땅울림: 땅울림이 세 방향으로 나아감 */
  rbTriple: P("rbTriple", [{ stat: "range", mul: 1.05 }]),
  /** 토끼인장: 망치로 찍은 곳에서 토끼가 나와 터짐 (땅울림 파동에서는 안 나옴) */
  rbSeal: P("rbSeal", [{ stat: "maxHp", add: 10 }]),
  /** 홈런!: 공격마다 확률로 망치를 아주 크게 휘두름 · 3배 밀침 · 확률로 맵 밖으로 날려 버림 (보스 빼고) */
  rbHomerun: P("rbHomerun", [{ stat: "damage", mul: 1.05 }]),
  /** 슈퍼 럭키!: 래빗 전용 아이템 7개 이상이면 공격할 때 확률로 초거대 망치 (쿨타임 30초) */
  rbLucky: P("rbLucky", [{ stat: "luck", add: 3 }]),
  /** 당근 간식: 처치하면 확률로 체력 회복 */
  rbCarrot: P("rbCarrot", [{ stat: "maxHp", add: 15 }]),
  /** 긴 귀: 망치가 더 멀리·크게 닿음 */
  rbEars: P("rbEars", [{ stat: "range", mul: 1.1 }]),
  /** 깡총 뛰기: 대시가 끝난 자리에 땅울림 */
  rbHop: P("rbHop", [{ stat: "moveSpeed", add: 0.08 }]),
  /** 네잎클로버: 홈런·슈퍼 럭키·토끼 확률이 오름 */
  rbClover: P("rbClover", [{ stat: "luck", add: 3 }]),
  /** 방울: 세 번 찍을 때마다 방울 소리 파동이 둘레 적을 묶음 */
  rbBell: P("rbBell", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 유령 망치: 찍을 때 확률로 반투명한 유령 망치가 다른 적 위에 떨어짐 */
  rbGhost: P("rbGhost", [{ stat: "damage", mul: 1.05 }]),
  /** 묵직한 망치: 찍힌 적이 잠깐 기절 */
  rbHeavy: P("rbHeavy", [{ stat: "damage", mul: 1.1 }]),
  /** 쿵쿵쿵: 쉬지 않고 찍을수록 피해가 쌓여 오름 */
  rbStomp: P("rbStomp", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 여진: 땅울림 파동이 맵 끝에 닿으면 크게 터짐 */
  rbAfter: P("rbAfter", [{ stat: "damage", mul: 1.05 }]),
  /** 갈라진 땅: 찍은 자리에 금이 남아 적을 느리게 하고 조금씩 피해 */
  rbCrack: P("rbCrack", [{ stat: "range", mul: 1.05 }]),
  /** 달토끼: 체력이 절반 아래면 공격이 빨라짐 */
  rbMoon: P("rbMoon", [{ stat: "maxHp", add: 10 }]),
  /** 폭신한 솜털: 받는 피해 감소 */
  rbFluff: P("rbFluff", [{ stat: "maxHp", add: 20 }]),
  /** 왕망치: 망치·땅울림이 더 커지고 세짐 */
  rbMega: P("rbMega", [{ stat: "damage", mul: 1.08 }]),
  /** 럭키 피버: 홈런이 터지면 잠깐 공격이 빨라짐 */
  rbFever: P("rbFever", [{ stat: "attackSpeed", add: 0.08 }]),
  /** 별사탕: 찍을 때 확률로 별이 튀어 가까운 적들에게 날아감 */
  rbStar: P("rbStar", [{ stat: "luck", add: 2 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱, 거리는 픽셀, 확률은 0~1) */
export const RABBIT_PERKS = {
  /** 토끼인장: 나올 확률 · 터지기까지 틱 · 반지름 · 피해 배율 */
  rbSeal: { chance: 0.35, delay: 28, r: 38, mul: 1.6 },
  /** 세 갈래 땅울림: 세 갈래로 나갈 확률 (안 나오면 땅울림이 있을 때 한 갈래) */
  rbTriple: { chance: 0.35 },
  /** 홈런: 확률 · 망치 크기 배율 · 피해 배율 · 밀치는 배수(보통 밀림의 몇 배) · 맵 밖으로 날아갈 확률 */
  rbHomerun: { chance: 0.1, size: 2, mul: 2, knock: 3, fly: 0.3 },
  /** 슈퍼 럭키: 필요한 래빗 전용 아이템 수 · 확률 · 쿨타임 틱 */
  rbLucky: { need: 7, chance: 0.03, cd: 1800 },
  /** 당근 간식: 확률 · 회복 */
  rbCarrot: { chance: 0.12, heal: 2 },
  /** 긴 귀: 거리·크기 배율 */
  rbEars: { size: 1.25 },
  /** 깡총 뛰기: 피해 배율 · 크기 배율 */
  rbHop: { mul: 1, size: 1.2 },
  /** 네잎클로버: 확률 배율 */
  rbClover: { mul: 1.5 },
  /** 방울: 찍을 때 울릴 확률 · 반지름 · 묶는 틱 · 피해 배율 */
  rbBell: { chance: 0.3, r: 60, stun: 40, mul: 0.6 },
  /** 유령 망치: 확률 · 떨어지기까지 틱 · 반지름 · 피해 배율 · 찾는 거리 */
  rbGhost: { chance: 0.3, delay: 16, r: 26, mul: 1, dist: 220 },
  /** 묵직한 망치: 맞은 적마다 기절할 확률 · 기절 틱 */
  rbHeavy: { chance: 0.3, stun: 20 },
  /** 쿵쿵쿵: 한 번마다 오르는 피해 · 가장 많이 쌓이는 수 · 이 틱 동안 안 찍으면 처음부터 */
  rbStomp: { add: 0.1, max: 6, keep: 90 },
  /** 여진: 반지름 · 피해 배율 */
  rbAfter: { r: 46, mul: 1.4 },
  /** 갈라진 땅: 남는 틱 · 반지름 배율 · 느려지는 틱 · 몇 틱마다 피해 · 피해 배율 */
  rbCrack: { ticks: 150, size: 1.1, slow: 30, every: 30, mul: 0.25 },
  /** 달토끼: 체력 비율 아래 · 공격 속도 배율 */
  rbMoon: { below: 0.5, speed: 1.3 },
  /** 폭신한 솜털: 받는 피해 배율 */
  rbFluff: { taken: 0.88 },
  /** 왕망치: 크기 배율 · 피해 배율 */
  rbMega: { size: 1.3, mul: 1.2 },
  /** 럭키 피버: 남는 틱 · 공격 속도 배율 */
  rbFever: { ticks: 240, speed: 1.4 },
  /** 별사탕: 확률 · 별 수 · 거리 · 피해 배율 */
  rbStar: { chance: 0.2, n: 3, dist: 200, mul: 0.6 },
};

