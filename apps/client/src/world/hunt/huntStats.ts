// 지도에서 걸을 때 내 체력: 본편 판과 같은 값 (createRun + 낀 장신구 → recalcStats, 레이드·지도 전투와 같은 길) · 판이 끝나면 남은 몫을 이어 받음
// 같은 캐릭터·장신구면 다시 계산하지 않음 (판 하나 만드는 값이 커서)
import { accExtras, createRun, recalcStats, type AccTotals, type CharacterId, type PlayerState } from "@pixel-rogue/shared";
import { myAccTotals } from "../../event/acc/accStore";

export interface HuntStats {
  maxHp: number;
  /** 1초 회복 (장신구 재생) */
  regen: number;
}

let last: { key: string; st: HuntStats } | null = null;

export function huntStats(who: CharacterId, acc: AccTotals | undefined = myAccTotals()): HuntStats {
  const key = `${who}|${JSON.stringify(acc ?? null)}`;
  if (last?.key === key) return last.st;
  const s = createRun(1, who);
  s.player.acc = acc;
  recalcStats(s);
  const ex = accExtras({ acc } as PlayerState) ?? {};
  last = { key, st: { maxHp: Math.round(s.player.stats.maxHp), regen: (ex.regen ?? 0) / 10 } };
  return last.st;
}
