// 패왕전 기록 (이 기기에만): 모드마다 이긴 횟수 · 이기면 보상을 로비 칩으로
import { PW_MODE, type PwMode } from "@pixel-rogue/shared";
import { addChips } from "../lobby/chips";
import { loadText, saveText } from "../storage";
import { flushUnlockStats, setCount, unlockStats } from "../unlock/unlockStats";

type Saved = Partial<Record<PwMode, number>>;

function load(): Saved {
  try {
    return JSON.parse(loadText("pwWins") ?? "{}") as Saved;
  } catch {
    return {};
  }
}

export const pwWins = (mode: PwMode): number => load()[mode] ?? 0;

/** 판이 끝나면: 이겼으면 횟수 +1, 보상 칩. 받은 칩 수 */
export function savePwResult(mode: PwMode, won: boolean): number {
  // 1대1 연승 (캐릭터 해금: 잔영)
  if (mode === "duel") {
    const n = won ? (unlockStats().count.duelStreak ?? 0) + 1 : 0;
    setCount("duelStreak", n);
    if (n > (unlockStats().count.duelBest ?? 0)) setCount("duelBest", n);
    flushUnlockStats();
  }
  if (!won) return 0;
  const all = load();
  all[mode] = (all[mode] ?? 0) + 1;
  saveText("pwWins", JSON.stringify(all));
  addChips(PW_MODE[mode].reward);
  return PW_MODE[mode].reward;
}
