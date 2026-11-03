// 숨은 시련 판정 (다른 계산 파일을 부르지 않는 작은 파일 · combat·trialFoes·elite·modeStats·specialRooms가 씀)
// 지금 진행 중인 시련 · 시련 몬스터 피해 배율 · 어둠의 세계 사거리 상한 · 죽음의 바다 처치 자리 비눗방울
import type { HiddenTrialState } from "./hiddenTrialTypes";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 하이오크 부락: 하이오크가 주는 피해 배율 */
  ORC_DMG: 1.5,
  /** 어둠의 세계: 마지막 라운드 그림자가 주는 피해 배율 · 사거리 상한(단검) */
  DARK_BIG: 3,
  DARK_RANGE: 18,
  /** 죽음의 바다: 비눗방울 반경 · 남는 틱 (3초) */
  BUBBLE_R: 14,
  BUBBLE_TICKS: 180,
};
export { R as HIDDEN_FOE_RULES };

/** 지금 이 방에서 진행 중인 숨은 시련 (없으면 undefined) */
export function hiddenOn(s: RunState): HiddenTrialState | undefined {
  const h = s.hidden;
  return h && h.on && !h.done && h.room === s.roomId && h.floor === s.floor ? h : undefined;
}

/** 시련 중: 방이 잠김 (specialRooms.roomLocked) */
export const hiddenBusy = (s: RunState) => !!hiddenOn(s);

/** 시련 몬스터가 주는 피해 배율 (trialFoes.trialFoeDmg) */
export function hiddenDmg(s: RunState, from?: string): number {
  const h = hiddenOn(s);
  if (h?.kind === 1 && from === "highorc") return R.ORC_DMG;
  if (h?.kind === 2 && h.round >= 3 && from === "lurker") return R.DARK_BIG;
  return 1;
}

/** 어둠의 세계 사거리 상한 (modeStats) */
export const hiddenRange = (s: RunState, range: number) => (hiddenOn(s)?.kind === 2 ? Math.min(range, R.DARK_RANGE) : range);

/** 시련 몬스터 처치 (trialFoes.trialKill): 죽음의 바다면 그 자리에 비눗방울 */
export function hiddenKill(s: RunState, e: EnemyState): void {
  const h = hiddenOn(s);
  if (h?.kind === 5 && e.kind !== "fort") (h.bubbles ??= []).push([Math.round(e.x), Math.round(e.y), s.tick + R.BUBBLE_TICKS]);
}

/** 비눗방울 반경 (hiddenSea·화면) */
export const SEA_BUBBLE_R = () => R.BUBBLE_R;
