// 타워 디펜스 일시정지·결과 창 (결과: 승리/패배 · 가장 활약한 타워 3개)
import type { TdState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { TdPortrait } from "./TdScreen";

interface Props {
  td: TdState;
  t: (key: TextKey) => string;
  paused: boolean;
  onResume: () => void;
  onRetry: () => void;
  onExit: () => void;
}

export function TdOverlay({ td, t, paused, onResume, onRetry, onExit }: Props) {
  const over = td.phase === "won" || td.phase === "lost";
  if (!over && !paused) return null;
  if (!over) {
    return (
      <div className="td-overlay">
        <div className="modal td-result">
          <h2>{t("tdPause")}</h2>
          <button type="button" className="primary big" onClick={onResume}>
            {t("tdResume")}
          </button>
          <p className="hint">{t("tdQuitAsk")}</p>
          <button type="button" className="outline" onClick={onExit}>
            {t("tdQuit")}
          </button>
        </div>
      </div>
    );
  }
  const won = td.phase === "won";
  const mvp = [...td.towers].sort((a, b) => b.dmg - a.dmg).slice(0, 3);
  return (
    <div className="td-overlay">
      <div className={`modal td-result ${won ? "won" : "lost"}`}>
        <h2>{won ? t("tdWon") : t("tdLost").replace("{n}", String(td.round))}</h2>
        <p className="td-result-line">
          ♥ {td.lives} · {t("tdKills")} {td.run.kills}
        </p>
        {mvp.length > 0 && (
          <>
            <h4>{t("tdTopDamage")}</h4>
            <ol className="td-mvp">
              {mvp.map((x) => (
                <li key={x.id}>
                  <TdPortrait id={x.character} size={28} />
                  <span>
                    {t(x.character as TextKey)} Lv {x.level}
                  </span>
                  <b>{Math.round(x.dmg).toLocaleString()}</b>
                </li>
              ))}
            </ol>
          </>
        )}
        <button type="button" className="primary big" onClick={onRetry}>
          {t("tdRetry")}
        </button>
        <button type="button" className="outline" onClick={onExit}>
          {t("tdToMaps")}
        </button>
      </div>
    </div>
  );
}
