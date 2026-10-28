// 제천대성 공용 도우미: 위험 표시(강해진 뒤면 범위·피해 키우고 깜박임) · 피해 · 범위 배율 · 무작위
import { createRng, deriveSeed } from "../rng";
import { hitDamage } from "./bossKit";
import type { Hazard } from "./fxTypes";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 근두운에서 내려선 뒤: 범위 배율 · 피해 배율 */
  FOOT_RANGE: 1.3,
  FOOT_DMG: 1.25,
};
export { R as SAGE_KIT_RULES };

/** 강해진 뒤면 범위를 키우고 터지기 직전 깜박임 (피해는 sageDmg가 키움) */
export function hz(s: RunState, e: EnemyState, warn: number, h: Omit<Hazard, "tick" | "start">, appear = 0): void {
  const foot = !!e.sage?.foot;
  const k = foot ? R.FOOT_RANGE : 1;
  addShape(s, warn, { ...h, radius: h.radius * k, ...(h.width !== undefined ? { width: h.width * k } : {}), cue: foot || h.cue }, appear);
}

/** 피해 (강해지면 더) */
export const sageDmg = (s: RunState, e: EnemyState, mul = 1) => hitDamage(s) * mul * (e.sage?.foot ? R.FOOT_DMG : 1);
export const sageRange = (e: EnemyState) => (e.sage?.foot ? R.FOOT_RANGE : 1);

export const sageRng = (s: RunState, e: EnemyState, tag: string) => createRng(deriveSeed(s.seed, "sage", tag, e.id, s.tick));

