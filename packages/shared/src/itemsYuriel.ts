// 유리엘 전용 아이템 20개: 단죄·정화 5 · 철퇴·사슬 5 · 결계·수호 5 · 치유·스킬 5. 효과는 sim/yuriel·yurielKit·yurielSkills. 수치는 YURIEL_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "yuriel" as const, effect: true as const });

export const YURIEL_PASSIVES = {
  // ── 단죄·정화 ──
  /** 이단 심문: 단죄가 더 빨리 쌓임 (맞힐 때 가끔 둘) */
  yrInquest: P("yrInquest", [{ stat: "luck", add: 1 }]),
  /** 정화의 불길: 정화의 빛 피해 증가 */
  yrPyre: P("yrPyre", [{ stat: "damage", add: 1 }]),
  /** 넓은 정화: 정화의 빛이 더 넓게 터짐 */
  yrBloom: P("yrBloom", [{ stat: "maxHp", add: 10 }]),
  /** 죄의 낙인: 단죄가 쌓인 적이 받는 피해 증가 */
  yrStigma: P("yrStigma", [{ stat: "damage", add: 1 }]),
  /** 자비 없음: 정화가 터진 적이 잠깐 기절 */
  yrNoMercy: P("yrNoMercy"),
  // ── 철퇴·사슬 ──
  /** 무거운 철퇴: 1·2타 피해 증가 */
  yrHeavy: P("yrHeavy", [{ stat: "damage", add: 1 }]),
  /** 긴 사슬: 사슬 철퇴 한 바퀴가 더 넓음 */
  yrChain: P("yrChain", [{ stat: "range", add: 10 }]),
  /** 집행자의 손목: 공격 속도 · 1·2타가 더 넓은 부채꼴 */
  yrWrist: P("yrWrist", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 성수 세례: 3타에 맞은 적에게 단죄 하나 더 */
  yrBaptism: P("yrBaptism", [{ stat: "maxHp", add: 10 }]),
  /** 집행의 무게: 집행의 철퇴가 더 넓고 오래 기절 */
  yrVerdict: P("yrVerdict", [{ stat: "damage", add: 1 }]),
  // ── 결계·수호 ──
  /** 넓은 성역: 결계가 더 넓음 */
  yrSanct: P("yrSanct", [{ stat: "maxHp", add: 10 }]),
  /** 굳건한 결계: 결계 안에서 받는 피해 더 감소 */
  yrBulwark: P("yrBulwark", [{ stat: "maxHp", add: 10 }]),
  /** 영원한 기도: 수호 결계가 더 오래 감 */
  yrVigil: P("yrVigil"),
  /** 빛의 가시: 결계 안 적이 더 자주 빛 피해 */
  yrThorn: P("yrThorn", [{ stat: "luck", add: 1 }]),
  /** 성국의 수호자: 방에 들어서면 잠깐 보호막 */
  yrGuard: P("yrGuard", [{ stat: "maxHp", add: 10 }]),
  // ── 치유·스킬 ──
  /** 성녀의 손길: 모든 회복량 증가 */
  yrTouch: P("yrTouch", [{ stat: "maxHp", add: 10 }]),
  /** 성수 수정구: 정화의 빛 대기 감소 · 더 넓음 */
  yrOrb: P("yrOrb"),
  /** 넘치는 은총: 체력이 가득일 때 회복하면 보호막으로 */
  yrGrace: P("yrGrace", [{ stat: "maxHp", add: 10 }]),
  /** 천상의 철퇴: 성녀의 단죄 피해 증가 · 강림이 더 오래 감 */
  yrHeaven: P("yrHeaven", [{ stat: "damage", add: 1 }]),
  /** 경건한 기도: 모든 스킬 대기 감소 */
  yrPrayer: P("yrPrayer"),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const YURIEL_PERKS = {
  /** 이단 심문: 맞힐 때 단죄가 하나 더 쌓이는 확률 */
  yrInquest: { chance: 0.35 },
  /** 정화의 불길: 정화의 빛 피해 배율 */
  yrPyre: { mul: 1.4 },
  /** 넓은 정화: 정화가 터지는 반지름 배율 */
  yrBloom: { r: 1.6 },
  /** 죄의 낙인: 단죄 하나마다 받는 피해 더함 */
  yrStigma: { taken: 0.04 },
  /** 자비 없음: 기절 틱 */
  yrNoMercy: { stun: 30 },
  /** 무거운 철퇴: 1·2타 피해 배율 */
  yrHeavy: { mul: 1.3 },
  /** 긴 사슬: 한 바퀴 반지름 배율 */
  yrChain: { r: 1.3 },
  /** 집행자의 손목: 부채꼴 cos (원래 값 대신, 작을수록 넓음) */
  yrWrist: { cos: -0.2 },
  /** 성수 세례: 3타에 더 쌓는 단죄 */
  yrBaptism: { more: 1 },
  /** 집행의 무게: 반지름 배율 · 기절 배율 */
  yrVerdict: { r: 1.3, stun: 1.5 },
  /** 넓은 성역: 결계 반지름 배율 */
  yrSanct: { r: 1.3 },
  /** 굳건한 결계: 받는 피해 배율 (원래 값 대신) */
  yrBulwark: { taken: 0.55 },
  /** 영원한 기도: 수호 결계 틱 더함 */
  yrVigil: { more: 180 },
  /** 빛의 가시: 빛 피해 간격 배율 */
  yrThorn: { every: 0.6 },
  /** 성국의 수호자: 보호막 (최대 체력 비율) */
  yrGuard: { shield: 0.2 },
  /** 성녀의 손길: 회복 배율 */
  yrTouch: { heal: 1.4 },
  /** 성수 수정구: 정화의 빛 대기 배율 · 반지름 배율 */
  yrOrb: { cd: 0.7, r: 1.25 },
  /** 넘치는 은총: 넘친 회복을 보호막으로 바꾸는 비율 · 보호막 최대 (최대 체력 비율) */
  yrGrace: { keep: 0.5, cap: 0.3 },
  /** 천상의 철퇴: 피해 배율 · 강림 틱 더함 */
  yrHeaven: { mul: 1.4, more: 180 },
  /** 경건한 기도: 스킬 대기 배율 */
  yrPrayer: { cd: 0.85 },
};
