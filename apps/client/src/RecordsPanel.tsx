// 이 기기의 기록: 누적 판 수·클리어·최단 클리어, 최근 10판
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "./i18n";
import { formatTime } from "./game/hudText";
import { loadBest, loadHistory, loadTotals } from "./records";

const NAME: Record<CharacterId, TextKey> = { warden: "warden", drifter: "drifter", mage: "mage", mystic: "mystic", engineer: "engineer", elementalist: "elementalist", brawler: "brawler", doctor: "doctor", gunner: "gunner", beast: "beast", ninja: "ninja", chronomancer: "chronomancer", summoner: "summoner", novice: "novice", bedouin: "bedouin", general: "general", imugi: "imugi", apostle: "apostle", stargazer: "stargazer", duck: "duck", abandoned: "abandoned", titan: "titan", oni: "oni", scribe: "scribe", idra: "idra", byeonhui: "byeonhui", fly: "fly", elder: "elder", ren: "ren", spiritist: "spiritist", plague: "plague", slayer: "slayer", eater: "eater", mukin: "mukin", samyeol: "samyeol", automata: "automata", rider: "rider", bomber: "bomber", artifacter: "artifacter", punk: "punk", collector: "collector", tracker: "tracker", forgotten: "forgotten", remnant: "remnant", wanderer: "wanderer", silk: "silk", pungryu: "pungryu", leo: "leo", onyx: "onyx", fenrir: "fenrir", eclipse: "eclipse", thorken: "thorken", levia: "levia", tail: "tail", madQueen: "madQueen", hook: "hook", orca: "orca", wave: "wave", miryu: "miryu", beatrice: "beatrice", ian: "ian", gabriel: "gabriel", serena: "serena", rafael: "rafael", yuriel: "yuriel", michaela: "michaela", blast: "blast", nailer: "nailer", scissors: "scissors", hellfist: "hellfist", silverBullet: "silverBullet", blueFlame: "blueFlame", lunatic: "lunatic", incision: "incision", crusader: "crusader", joker: "joker", shadowing: "shadowing", puppeteer: "puppeteer", rabbit: "rabbit", baekryeong: "baekryeong", bingseol: "bingseol", asura: "asura", miner: "miner", voyager: "voyager", zeus: "zeus", pilgrim: "pilgrim", fallenKing: "fallenKing", lux: "lux" };

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
