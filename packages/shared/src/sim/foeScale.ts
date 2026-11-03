// 후반 강화 (2026-11-03: 초반은 어렵고 후반이 쉬워 지루하다는 평가): 이 층(세기)부터 층마다 몬스터·보스 체력과 주는 피해가 더 오름
// 기존 층마다 오름(rooms 체력 · bosses.bossHpMul · 탄·근접 피해)에 곱해짐 · 무한 모드는 자기 강화(endless)가 있어 MAX_STEP까지만
import { depth } from "./hero";
import type { RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 세기(층)를 넘은 층마다 한 단계 */
  FROM: 3,
  /** 가장 많은 단계 (6층 = 3단계) */
  MAX_STEP: 3,
  /** 단계마다 몬스터 체력 + · 보스 체력 + */
  HP: 0.15,
  BOSS_HP: 0.15,
  /** 단계마다 몬스터·보스가 주는 피해 + */
  DMG: 0.1,
};
export { R as FOE_SCALE_RULES };

/** 후반 단계 (0 = 3층까지) */
export const lateStep = (d: number) => Math.min(R.MAX_STEP, Math.max(0, d - R.FROM));
/** 몬스터 체력 배율 · 보스 체력 배율 */
export const lateHp = (d: number) => 1 + R.HP * lateStep(d);
export const lateBossHp = (d: number) => 1 + R.BOSS_HP * lateStep(d);
/** 적이 주는 피해 배율 (던전만: 패왕전·광야의 새벽 빼고, 지형 피해는 combat이 뺌) */
export const lateDmg = (s: RunState) => (s.pvp || s.swarm ? 1 : 1 + R.DMG * lateStep(depth(s)));
