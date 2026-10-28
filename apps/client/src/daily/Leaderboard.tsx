import type { TextKey } from "../i18n";
import { formatTime } from "../game/hudText";

export interface BoardEntry {
  rank: number;
  nickname: string;
  score: number;
  floor: number;
  won: boolean;
  ticks: number;
  character: string;
  verified: boolean;
}

/** 순위표 (상위 30명) */
export function Leaderboard({ entries, t }: { entries: BoardEntry[]; t: (key: TextKey) => string }) {
  if (entries.length === 0) return <p className="account-note">{t("boardEmpty")}</p>;
  return (
    <ol className="leaderboard">
      {entries.map((e) => (
        <li key={e.rank}>
          <span className="lb-rank">{e.rank}</span>
          <span className={`lb-char ${e.character}`} />
          <span className="lb-name">
            {e.nickname}
            {/* 1~3위는 서버가 판을 다시 돌려 확인하는 동안 표시 */}
            {e.rank <= 3 && !e.verified && (
              <small className="lb-checking" title={t("boardChecking")}>
                {" "}⏳
              </small>
            )}
          </span>
          <span className="lb-floor">
            {e.won ? "★" : `${t("floor")} ${e.floor}`} · {formatTime(e.ticks)}
          </span>
          <strong className="lb-score">{e.score.toLocaleString()}</strong>
        </li>
      ))}
    </ol>
  );
}
