// 타워 디펜스 맵마다 최고 기록 (이 기기에만 저장)
import { TD_MAPS, type TdMapId, type TdState } from "@pixel-rogue/shared";
import { flushUnlockStats, mark } from "../unlock/unlockStats";
import { loadText, saveText } from "../storage";

const KEY = "tdBest";

/** 맵마다 난이도 별 수 (TD_MAPS 순서, 맵 고르기 화면) · 캐릭터 해금: ★5 이상 맵 클리어 */
export const TD_STARS = [1, 2, 2, 3, 3, 4, 5, 7];

export interface TdBest {
  /** 막아 낸 마지막 라운드 (클리어면 20) */
  round: number;
  won: boolean;
  lives: number;
}

export function loadTdBest(): Partial<Record<TdMapId, TdBest>> {
  try {
    return JSON.parse(loadText(KEY) ?? "{}") as Partial<Record<TdMapId, TdBest>>;
  } catch {
    return {};
  }
}

/** 판이 끝나면 더 좋은 기록만 남김 (클리어 > 라운드 > 남은 목숨) */
export function saveTdResult(td: TdState): void {
  const all = loadTdBest();
  const won = td.phase === "won";
  if (won && (TD_STARS[TD_MAPS.findIndex((m) => m.id === td.mapId)] ?? 0) >= 5) {
    mark("tdFive");
    flushUnlockStats();
  }
  const now: TdBest = { round: won ? td.round : td.round - 1, won, lives: td.lives };
  const old = all[td.mapId];
  const better = !old || (now.won && !old.won) || (now.won === old.won && (now.round > old.round || (now.round === old.round && now.lives > old.lives)));
  if (!better) return;
  all[td.mapId] = now;
  saveText(KEY, JSON.stringify(all));
}
