// 이벤트 '패왕전' 한 판: 게임 화면(GameScreen)에 진행을 맡기고 위에 정보(PwHud) · 끝나면 결과와 보상 칩
import { createPaewang, paewangResult, stepPaewang, type CharacterId, type PwLoadout, type PwMode } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import { drawPaewang } from "../game/render/paewang";
import type { Lang, TextKey } from "../i18n";
import { PwHud } from "./PwHud";
import { savePwResult } from "./pwRecords";

interface Props {
  mode: PwMode;
  characterId: CharacterId;
  loadout?: PwLoadout;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  onRetry: () => void;
}

const HUD_MS = 250;

export function PwGame({ mode, characterId, loadout, lang, t, onExit, onRetry }: Props) {
  // 꾸밈이 아니라 판 시드: 판마다 다르게 (판 안의 계산은 이 시드로만)
  const [run] = useState(() => createPaewang(Math.floor(Math.random() * 0x7fffffff), mode, characterId, loadout));
  const [, refresh] = useState(0);
  const [chips, setChips] = useState<number | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => refresh((n) => n + 1), HUD_MS);
    return () => window.clearInterval(id);
  }, []);
  const ended = chips !== null;
  const r = ended ? paewangResult(run) : null;
  return (
    <>
      <GameScreen
        mode="paewang"
        characterId={run.player.characterId}
        seedText=""
        initialRun={run}
        unlocks={[]}
        lang={lang}
        t={t}
        onExit={onExit}
        step={stepPaewang}
        overlay={drawPaewang}
        onRunEnd={(end) => setChips(savePwResult(mode, end.won))}
        afterRun={
          r ? (
            <div className="game-overlay">
              <div className="modal pw-result">
                <h2>{t(r.won ? "pwWin" : "pwLose")}</h2>
                {r.reward > 0 && <p className="pw-chips">🪙 {t("pwGot").replace("{n}", r.reward.toLocaleString())}</p>}
                <p className="result-line">
                  {t("pwKills").replace("{n}", String(r.kills))}
                  {mode === "gungame" && ` · ${t("pwLevel").replace("{lv}", String(r.lv))}`}
                  {mode === "brawl" && r.place > 0 && ` · ${t("pwPlace").replace("{n}", String(r.place))}`}
                </p>
                <div className="modal-actions">
                  <button type="button" onClick={onExit}>
                    {t("pwToModes")}
                  </button>
                  <button type="button" onClick={onRetry}>
                    {t("pwAgain")}
                  </button>
                </div>
              </div>
            </div>
          ) : undefined
        }
      />
      {!ended && <PwHud run={run} t={t} />}
    </>
  );
}
