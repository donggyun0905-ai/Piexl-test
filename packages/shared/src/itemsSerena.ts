// 세레나 전용 아이템 20개: 가시·마비 5 · 사슬·비수 5 · 무희·치명 5 · 스킬·환혹 5. 효과는 sim/serena·serenaKit·serenaSkills·serenaCrit. 수치는 SERENA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "serena" as const, effect: true as const });

export const SERENA_PASSIVES = {
  // ── 가시·마비 ──
  /** 장미 가시: 가시가 더 많이 쌓임 */
  snThorn: P("snThorn", [{ stat: "maxHp", add: 10 }]),
  /** 미늘: 가시 피해 증가 */
  snBarb: P("snBarb", [{ stat: "damage", add: 1 }]),
  /** 마취 향: 마비가 더 오래 감 */
  snNumb: P("snNumb", [{ stat: "maxHp", add: 10 }]),
  /** 맹독 꽃: 마비된 적이 받는 피해 더 증가 */
  snVenom: P("snVenom", [{ stat: "damage", add: 1 }]),
  /** 가시 꽃망울: 가시가 가득 찬 적을 쓰러뜨리면 가시가 터져 둘레로 옮음 */
  snBloom: P("snBloom"),
  // ── 사슬·비수 ──
  /** 두 겹 사슬: 도는 사슬 채찍 +1 */
  snChain: P("snChain"),
  /** 긴 사슬: 도는 사슬 채찍이 더 크게 돎 */
  snReach: P("snReach", [{ stat: "range", add: 5 }]),
  /** 빠른 손목: 도는 사슬 채찍이 같은 적을 더 자주 침 */
  snSpin: P("snSpin", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 벼린 비수: 도는 사슬 채찍 피해 증가 */
  snEdge: P("snEdge", [{ stat: "damage", add: 1 }]),
  /** 에테르 결정: 빛 피해 추가 증가 */
  snEther: P("snEther", [{ stat: "luck", add: 1 }]),
  // ── 무희·치명 ──
  /** 무희의 눈길: 치명타 확률 증가 */
  snGrace: P("snGrace", [{ stat: "luck", add: 1 }]),
  /** 치명적인 입맞춤: 치명타 피해 증가 */
  snFatal: P("snFatal"),
  /** 끝없는 박자: 환혹의 회오리를 한 번 더 휘저음 */
  snTempo: P("snTempo", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 긴 소매: 1·2타 채찍이 더 멀리 닿음 */
  snLash: P("snLash", [{ stat: "range", add: 5 }]),
  /** 신기루 베일: 환혹의 스텝 뒤 잠시 주는 피해 증가 */
  snMirage: P("snMirage", [{ stat: "moveSpeed", add: 0.1 }]),
  // ── 스킬·환혹 ──
  /** 날개 신: 환혹의 스텝 거리·피해 증가 */
  snWing: P("snWing", [{ stat: "moveSpeed", add: 0.1 }]),
  /** 매혹의 향수: 매혹이 더 넓고 오래 감 */
  snPerfume: P("snPerfume"),
  /** 비수 꾸러미: 맹독 비수를 더 많이·넓게 던짐 */
  snQuiver: P("snQuiver"),
  /** 한밤의 무대: 환혹의 무도가 더 오래 감 */
  snNight: P("snNight", [{ stat: "maxHp", add: 10 }]),
  /** 뮤즈의 축복: 모든 스킬 대기 감소 */
  snMuse: P("snMuse"),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 */
export const SERENA_PERKS = {
  /** 장미 가시: 가시 최대 더함 */
  snThorn: { more: 3 },
  /** 미늘: 가시 피해 배율 */
  snBarb: { mul: 1.6 },
  /** 마취 향: 마비 틱 배율 */
  snNumb: { mul: 1.6 },
  /** 맹독 꽃: 마비된 적이 받는 피해 더함 */
  snVenom: { taken: 0.15 },
  /** 가시 꽃망울: 옮는 반지름 · 터지는 피해(공격력 배율) · 둘레 적에 옮는 가시 */
  snBloom: { r: 45, mul: 0.8, thorns: 3 },
  /** 두 겹 사슬: 사슬 채찍 더함 */
  snChain: { more: 1 },
  /** 긴 사슬: 도는 반지름 배율 */
  snReach: { r: 1.25 },
  /** 빠른 손목: 다시 치는 틱 배율 */
  snSpin: { every: 0.6 },
  /** 벼린 비수: 사슬 피해 배율 */
  snEdge: { mul: 1.4 },
  /** 에테르 결정: 빛 피해 배율 */
  snEther: { mul: 2 },
  /** 무희의 눈길: 치명타 확률 더함 */
  snGrace: { crit: 0.1 },
  /** 치명적인 입맞춤: 치명타 배율 더함 */
  snFatal: { critMul: 0.5 },
  /** 끝없는 박자: 회오리 횟수 더함 */
  snTempo: { more: 1 },
  /** 긴 소매: 1·2타 닿는 거리 배율 */
  snLash: { r: 1.3 },
  /** 신기루 베일: 스텝 뒤 틱 · 주는 피해 배율 */
  snMirage: { ticks: 120, mul: 1.3 },
  /** 날개 신: 스텝 거리 배율 · 피해 배율 */
  snWing: { dist: 1.4, mul: 1.5 },
  /** 매혹의 향수: 반지름 배율 · 매혹 틱 배율 */
  snPerfume: { r: 1.25, ticks: 1.5 },
  /** 비수 꾸러미: 비수 더함 · 부채꼴 폭(cos) */
  snQuiver: { more: 4, cos: 0.25 },
  /** 한밤의 무대: 무도 틱 더함 */
  snNight: { more: 180 },
  /** 뮤즈의 축복: 스킬 대기 배율 */
  snMuse: { cd: 0.85 },
};
