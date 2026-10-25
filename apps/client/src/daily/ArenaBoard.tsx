// 레이드 아레나 순위표 (전체 기간): 깬 레벨이 높은 순, 같으면 빠른 시간 순
import { ARENA_LEVELS } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiGet } from "../api";
import type { TextKey } from "../i18n";
import { raidTime } from "./raidTime";

interface Entry {
  rank: number;
  nickname: string;
  level: number;
  ticks: number;
  character: string;
}

export function ArenaBoard({ t, onBack }: { t: (key: TextKey) => string; onBack: () => void }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void apiGet<{ entries: Entry[] }>("/api/arena/board").then((res) => {
      if (res.ok && res.data) setEntries(res.data.entries);
      else setError(t("errOffline"));
    });
  }, [t]);

  return (
    <div className="select-screen daily-screen">
      <h2>⚔ {t("arenaButton")}</h2>
      <p className="account-note">{t("arenaBoardNote")}</p>
      {error && <p className="form-error">{error}</p>}
      <div className="board-wrap">
        {!entries ? (
          !error && <p>…</p>
        ) : entries.length === 0 ? (
          <p className="account-note">{t("boardEmpty")}</p>
        ) : (
          <ol className="leaderboard">
            {entries.map((e) => (
              <li key={e.rank}>
                <span className="lb-rank">{e.rank}</span>
                <span className={`lb-char ${e.character}`} />
                <span className="lb-name">{e.nickname}</span>
                <span className="lb-floor">{raidTime(e.ticks)}</span>
                <strong className="lb-score">{e.level >= ARENA_LEVELS ? "★ Lv 15" : `Lv ${e.level}`}</strong>
              </li>
            ))}
          </ol>
        )}
      </div>
      <button type="button" className="secondary" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}
