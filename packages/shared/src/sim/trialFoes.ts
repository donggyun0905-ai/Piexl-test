// 시련 뒤 몬스터 강화: 이 판에 시련으로 얻은 점수 비율만큼 그 뒤 나오는 모든 적(보스 포함)의 체력·주는 피해가 오름
// 700점까지는 보상만큼 적도 세져 강해진 느낌이 거의 그대로 · 700점을 넘긴 몫은 적이 더 세지지 않아 그만큼 강해짐
import type { PlayerState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 점수까지만 적이 세짐 (넘긴 몫은 그대로 내 몫) */
  CAP: 700,
  /** CAP 점수일 때 적 체력 + · 주는 피해 + */
  HP: 0.35,
  DMG: 0.25,
};
export { R as TRIAL_FOE_RULES };

/** 시련 점수 비율 (0 ~ 1) */
const ratio = (p: PlayerState) => Math.min(p.trial?.total ?? 0, R.CAP) / R.CAP;
/** 적 체력 배율 */
export const trialFoeHp = (p: PlayerState) => 1 + R.HP * ratio(p);
/** 적이 주는 피해 배율 */
export const trialFoeDmg = (p: PlayerState) => 1 + R.DMG * ratio(p);
