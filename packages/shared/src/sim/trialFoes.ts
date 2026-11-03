// 시련 뒤 몬스터 강화: 이 판에 시련으로 얻은 점수 비율만큼 그 뒤 나오는 모든 적(보스 포함)의 체력·주는 피해가 오름
// 700점까지는 보상만큼 적도 세져 강해진 느낌이 거의 그대로 · 700점을 넘긴 몫은 적이 더 세지지 않아 그만큼 강해짐
// 시련 중(1 암흑 · 3 보스 다섯 · 4 끝없는) 몬스터를 잡을 때마다 이동 속도가 점점 느려짐 (최대 절반, 시련이 끝나면 풀림)
import { ENEMIES } from "../enemyDefs";
import type { EnemyState, PlayerState, RunState } from "./types";
import { hiddenDmg, hiddenKill } from "./hiddenFoes";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 점수까지만 적이 세짐 (넘긴 몫은 그대로 내 몫) */
  CAP: 700,
  /** CAP 점수일 때 적 체력 + · 주는 피해 + */
  HP: 0.35,
  DMG: 0.25,
  /** 시련 1·3·4 중 처치 하나마다 이동 속도 - (보통 적 · 보스) · 가장 느려졌을 때 배율 */
  SLOW_KILL: 0.01,
  SLOW_BOSS: 0.1,
  SLOW_MIN: 0.5,
};
export { R as TRIAL_FOE_RULES };

/** 시련 점수 비율 (0 ~ 1) */
const ratio = (p: PlayerState) => Math.min(p.trial?.total ?? 0, R.CAP) / R.CAP;
/** 적 체력 배율 */
export const trialFoeHp = (p: PlayerState) => 1 + R.HP * ratio(p);
/** 적이 주는 피해 배율 (s·from이 있으면 숨은 시련 몬스터 배율도) */
export const trialFoeDmg = (p: PlayerState, s?: RunState, from?: string) => (1 + R.DMG * ratio(p)) * (s ? hiddenDmg(s, from) : 1);

/** 시련 몬스터 처치 (combat): 잡은 수 · 1·3·4 시련이면 느려짐을 쌓음 · 시련의 방이 아니면 숨은 시련 (바다 비눗방울) */
export function trialKill(s: RunState, e: EnemyState): void {
  const run = s.trialRun;
  if (!run) return hiddenKill(s, e);
  run.got = (run.got ?? 0) + 1;
  if (run.kind === 2) return;
  run.slow = (run.slow ?? 0) + (ENEMIES[e.kind].boss === true ? R.SLOW_BOSS : R.SLOW_KILL);
}
/** 시련 중 이동 속도 배율 (시련 방 안에서만) */
export const trialMoveMul = (s: RunState) => (s.trialRun && s.trialRun.room === s.roomId ? Math.max(R.SLOW_MIN, 1 - (s.trialRun.slow ?? 0)) : 1);
