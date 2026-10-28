// 랭크전 화면 조각: 상대 찾는 중(방에 들어가기 전) · 끝난 뒤 내 점수 변화(로고 · 티어 · +점수)
import { WaitGames } from "./WaitGames";
import { rankOf, type RankChange, type RankQueue } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { RankEmblem } from "./RankEmblem";
import { QUEUE_NAME, tierText } from "./RankPanel";

export function RankFinding({ queue, error, t, onBack }: { queue: RankQueue; error: string; t: (k: TextKey) => string; onBack: () => void }) {
  return (
    <div className="td-maps rank-finding">
      <h2>
        🏆 {t("rankTitle")} · {t(QUEUE_NAME[queue])}
      </h2>
      {error ? <p className="error">{error}</p> : <p className="hint rank-finding-dots">{t("rankFinding")}</p>}
      <WaitGames t={t} />
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}

/** 결과 창 안: 점수 반영 중 · 반영 안 됨 · 내 점수 변화 */
export function RankOutcome({ changes, me, t }: { changes: RankChange[] | null; me: string; t: (k: TextKey) => string }) {
  if (!changes) return <p className="hint">{t("rankWaiting")}</p>;
  const mine = changes.find((c) => c.pid === me);
  if (!mine) return <p className="hint">{t("rankVoid")}</p>;
  const diff = mine.after - mine.before;
  const r = rankOf(mine.after);
  return (
    <div className={`rank-outcome ${r.tier}`}>
      <RankEmblem tier={r.tier} div={r.div} size={56} />
      <span>
        <b>{tierText(t, mine.after, 0)}</b>
        <small>
          {t("rankPoints").replace("{n}", String(mine.after))}{" "}
          <em className={diff >= 0 ? "up" : "down"}>{(diff >= 0 ? t("rankUp") : t("rankDown")).replace("{n}", String(diff))}</em>
        </small>
      </span>
    </div>
  );
}
