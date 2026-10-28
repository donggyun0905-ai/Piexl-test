// 패왕전 결과 창: 승패 · 받은 칩 · 처치/데스·레벨·순위 · 점수판 · 다시/나가기 (혼자·같이 하기 같이 씀)
import { pvpResult, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { PwBoard } from "./PwBoard";

interface Props {
  run: RunState;
  me: number;
  names?: readonly string[];
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  onRetry?: () => void;
  /** 관전자: 승패·보상 없이 점수판만 */
  watching?: boolean;
}

export function PwResult({ run, me, names, lang, t, onExit, onRetry, watching = false }: Props) {
  const r = pvpResult(run, me);
  const mode = run.pvp!.mode;
  return (
    <div className="game-overlay">
      <div className="modal pw-result">
        <h2>{watching ? t("pwBoard") : t(r.won ? "pwWin" : "pwLose")}</h2>
        {!watching && r.reward > 0 && <p className="pw-chips">🪙 {t("pwGot").replace("{n}", r.reward.toLocaleString())}</p>}
        {!watching && <p className="result-line">
          {t("pwKills").replace("{n}", String(r.kills))} · {r.deaths}D{mode === "gungame" && ` · ${t("pwLevel").replace("{lv}", String(r.lv))}`}
          {mode === "brawl" && r.place > 0 && ` · ${t("pwPlace").replace("{n}", String(r.place))}`}
        </p>}
        <PwBoard run={run} me={me} names={names} lang={lang} t={t} />
        <div className="modal-actions">
          <button type="button" onClick={onExit}>
            {t("pwToModes")}
          </button>
          {onRetry && (
            <button type="button" onClick={onRetry}>
              {t("pwAgain")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
