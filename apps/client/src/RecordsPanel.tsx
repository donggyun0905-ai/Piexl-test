// 이 기기의 기록: 누적 판 수·클리어·최단 클리어, 최근 10판
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "./i18n";
import { formatTime } from "./game/hudText";
import { loadBest, loadHistory, loadTotals } from "./records";

const NAME: Record<CharacterId, TextKey> = { warden: "warden", drifter: "drifter", mage: "mage", mystic: "mystic", engineer: "engineer", elementalist: "elementalist", brawler: "brawler", doctor: "doctor", gunner: "gunner", beast: "beast", ninja: "ninja", chronomancer: "chronomancer", summoner: "summoner", novice: "novice", bedouin: "bedouin", general: "general", imugi: "imugi", apostle: "apostle", stargazer: "stargazer", duck: "duck", abandoned: "abandoned", titan: "titan", oni: "oni", scribe: "scribe" };

export function RecordsPanel({ t }: { t: (key: TextKey) => string }) {
  const totals = loadTotals();
  const best = loadBest();
  const history = loadHistory();
  if (totals.runs === 0 && history.length === 0) return <p>{t("recordsEmpty")}</p>;
  return (
    <>
      <dl className="records-summary">
        <dt>{t("recordsSummary")}</dt>
        <dd>
          {totals.runs} {t("recordsRuns")} · {totals.wins} {t("recordsWins")}
        </dd>
        {best && (
          <>
            <dt>{t("bestScore")}</dt>
            <dd>
              {best.score.toLocaleString()} ({t(NAME[best.characterId])})
            </dd>
          </>
        )}
        {totals.fastestWin > 0 && (
          <>
            <dt>{t("recordsFastest")}</dt>
            <dd>{formatTime(totals.fastestWin)}</dd>
          </>
        )}
      </dl>
      <h3>{t("recordsRecent")}</h3>
      <ul className="records-list">
        {history.map((r, i) => (
          <li key={i} className={r.won ? "win" : ""}>
            <span>{r.date}</span>
            <span>
              {t(NAME[r.characterId])}
              {r.coop ? ` · ${t("coopRecord").replace("{n}", String(r.coop))} · ${t("kills")} ${r.kills}` : ""}
            </span>
            <span>
              {t("floor")} {r.floor}
            </span>
            <span>{formatTime(r.ticks)}</span>
            <strong>{r.score.toLocaleString()}</strong>
            {r.won && <em>{t("recordsWin")}</em>}
          </li>
        ))}
      </ul>
    </>
  );
}
