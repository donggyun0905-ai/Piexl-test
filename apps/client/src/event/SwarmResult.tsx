// 광야의 새벽 결과: 클리어·쓰러짐 · 버틴 시간 · 레벨 · 처치 · 최고 기록 · 가진 무기
import { type RunState } from "@pixel-rogue/shared";
import { formatTime } from "../game/hudText";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { EcoinIcon } from "./EcoinIcon";

interface Props {
  run: RunState;
  newBest: boolean;
  /** 깨서 받은 이벤트 코인 (못 깼으면 null) */
  coins: { coins: number; first: boolean } | null;
  lang: Lang;
  t: (k: TextKey) => string;
  onExit: () => void;
  onRetry: () => void;
}

export function SwarmResult({ run, newBest, coins, lang, t, onExit, onRetry }: Props) {
  const sw = run.swarm!;
  return (
    <div className="game-overlay">
      <div className="modal swarm-result">
        <h2>{t(run.won ? "cleared" : "defeated")}</h2>
        {run.won && <p>{t("swarmClear")}</p>}
        {coins && (
          <p className="swarm-coins">
            <EcoinIcon /> +{coins.coins} {coins.first ? t("swarmFirstClear") : ""}
          </p>
        )}
        <p className="clear-time">
          ⏱ {t("swarmTime")} <strong>{formatTime(run.tick)}</strong>
          {newBest && <span className="new-best"> {t("swarmNewBest")}</span>}
        </p>
        <p className="result-line">
          Lv {sw.lv} · {t("swarmKills")} {sw.kills} · {t("swarmEvents")} {sw.eventsWon ?? 0}
        </p>
        <div className="swarm-slots">
          {sw.weapons.map((w) => (
            <span key={w.id} className="swarm-slot" title={itemName("weapon", w.id, lang)}>
              <ItemIcon item={{ kind: "weapon", id: w.id }} size={24} />
            </span>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onExit}>
            {t("toTitle")}
          </button>
          <button type="button" onClick={onRetry}>
            {t("retry")}
          </button>
        </div>
      </div>
    </div>
  );
}
