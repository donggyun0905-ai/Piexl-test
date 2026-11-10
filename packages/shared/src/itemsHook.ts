// 훅 전용 아이템 10개: 갈고리 3 · 산탄총 3 · 해적 4. 효과는 sim/hook·hookShot. 수치는 HOOK_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "hook" as const, effect: true as const });

export const HOOK_PASSIVES = {
  // ── 갈고리 ──
  /** 닻사슬: 갈고리가 더 멀리 */
  hkChain: P("hkChain"),
  /** 네 갈래 갈고리: 더 많은 적이 걸림 */
  hkGrapnel: P("hkGrapnel"),
  /** 밧줄 그네: 벽으로 날아가 내릴 때 둘레에 충격파 · 날아가는 동안 무적 */
  hkSwing: P("hkSwing"),
  // ── 산탄총 ──
  /** 쌍발 연사: 둘째 총열이 한 박자 뒤 한 번 더 */
  hkDoubleTap: P("hkDoubleTap"),
  /** 흑색 화약: 산탄 피해 + */
  hkPowder: P("hkPowder", [{ stat: "damage", add: 1 }]),
  /** 난파선: 벽에 부딪힌 적 피해·기절 + */
  hkWreck: P("hkWreck"),
  // ── 해적 ──
  /** 약탈: 끌어와 쏜 적이 쓰러지면 금화 */
  hkPlunder: P("hkPlunder"),
  /** 럼주 한 병: 끌어온 적마다 체력 회복 */
  hkRum: P("hkRum", [{ stat: "maxHp", add: 10 }]),
  /** 해골 깃발: 산탄에 맞은 적이 겁먹어 느려짐 */
  hkJolly: P("hkJolly"),
  /** 자유의 돛: 이동 속도 + · 받는 피해 줄어듦 */
  hkFreedom: P("hkFreedom", [{ stat: "moveSpeed", add: 0.1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 훅 아이템 수치 */
export const HOOK_PERKS = {
  /** 닻사슬: 갈고리 거리 배율 */
  hkChain: { reach: 1.3 },
  /** 네 갈래 갈고리: 걸리는 적 수 더함 */
  hkGrapnel: { catch: 2 },
  /** 밧줄 그네: 충격파 반지름 · 피해 배율 */
  hkSwing: { r: 40, mul: 1.2 },
  /** 쌍발 연사: 둘째 발 늦춤(틱) · 피해 배율 */
  hkDoubleTap: { delay: 10, mul: 0.5 },
  /** 흑색 화약: 산탄 피해 배율 */
  hkPowder: { mul: 1.25 },
  /** 난파선: 난파 피해 배율 · 기절 배율 */
  hkWreck: { mul: 2, stun: 1.5 },
  /** 약탈: 쓰러뜨린 적마다 금화 */
  hkPlunder: { gold: 1 },
  /** 럼주 한 병: 끌어온 적마다 회복(최대 체력 비율) */
  hkRum: { heal: 0.01 },
  /** 해골 깃발: 느려짐 틱 */
  hkJolly: { slow: 90 },
  /** 자유의 돛: 받는 피해 배율 */
  hkFreedom: { taken: 0.9 },
};
