// 미류 전용 아이템 10개: 물길 3 · 흘리기 2 · 칼날 2 · 해룡 3. 효과는 sim/miryu·miryuCuts·miryuFlow. 수치는 MIRYU_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "miryu" as const, effect: true as const });

export const MIRYU_PASSIVES = {
  // ── 물길 ──
  /** 잔물결: 물길이 오래 남고 더 많이 남음 */
  mrRipple: P("mrRipple"),
  /** 물길 타기: 내 물길 위에서 더 빨리 움직이고 빨리 벰 */
  mrSurf: P("mrSurf", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 물줄기 걸음: 대시한 길이 물길이 되고, 대시로 탄을 더 넓게 흘림 */
  mrCourse: P("mrCourse", [{ stat: "moveSpeed", add: 0.1 }]),
  // ── 흘리기 ──
  /** 흘려 넘기기: 탄을 받는 거리가 넓고, 받을 때마다 체력 회복 */
  mrParry: P("mrParry"),
  /** 회류: 탄 하나에 물방울 둘 · 되돌린 물칼날이 적을 쫓아감 */
  mrReturn: P("mrReturn"),
  // ── 칼날 ──
  /** 해룡의 뿔: 휘는 칼날이 하나 더 · 더 세게 */
  mrHorn: P("mrHorn", [{ stat: "damage", add: 1 }]),
  /** 폭포: 물길이 사라질 때 무너져 내리며 벰 */
  mrCascade: P("mrCascade"),
  // ── 해룡 ──
  /** 해룡 비늘: 해류 게이지가 절반 넘게 차 있으면 받는 피해 줄어듦 */
  mrScale: P("mrScale", [{ stat: "maxHp", add: 10 }]),
  /** 용의 숨결: 해류 게이지가 빨리 참 */
  mrBreath: P("mrBreath", [{ stat: "damage", add: 1 }]),
  /** 천류: 해룡이 더 크고 세며 폭포가 넓음 */
  mrSky: P("mrSky"),
} as const satisfies Record<string, PassiveDef>;

/** 미류 아이템 수치 */
export const MIRYU_PERKS = {
  /** 잔물결: 물길 시간 배율 · 최대 개수 더함 */
  mrRipple: { life: 1.6, more: 4 },
  /** 물길 타기: 물길 위 이동 배율 · 공격 속도 배율 */
  mrSurf: { move: 1.5, speed: 1.2 },
  /** 물줄기 걸음: 대시 중 탄 받는 거리 배율 */
  mrCourse: { catch: 1.6 },
  /** 흘려 넘기기: 받는 거리 배율 · 받을 때 회복(최대 체력 비율) */
  mrParry: { reach: 1.5, heal: 0.01 },
  /** 회류: 탄 하나에 물방울 수 */
  mrReturn: { per: 2 },
  /** 해룡의 뿔: 휘는 칼날 더함 · 피해 배율 */
  mrHorn: { more: 1, mul: 1.4 },
  /** 폭포: 무너질 때 피해 배율 · 반지름 */
  mrCascade: { mul: 0.5, r: 20 },
  /** 해룡 비늘: 게이지 기준(비율) · 받는 피해 배율 */
  mrScale: { at: 0.5, taken: 0.85 },
  /** 용의 숨결: 게이지 차는 배율 */
  mrBreath: { gain: 1.5 },
  /** 천류: 해룡 크기 배율 · 피해 배율 · 폭포 반지름 배율 */
  mrSky: { size: 1.4, mul: 1.25, fall: 1.3 },
};
