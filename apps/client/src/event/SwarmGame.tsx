// 이벤트 '광야의 새벽' 화면: 게임 화면(GameScreen)에 진행을 맡기고 위에 시간·레벨·장비(SwarmHud) · 레벨 업 고르기 · 결과
import { chooseSwarm, continueSwarm, createSwarm, stepSwarm, swarmResult, type CharacterId, type SwarmMapId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import { drawSwarm } from "../game/render/swarm";
import type { Lang, TextKey } from "../i18n";
import { SwarmHud } from "./SwarmHud";
import { SwarmLevelUp } from "./SwarmLevelUp";
import { SwarmResult } from "./SwarmResult";
import { clearSwarmMap } from "./eventCoins";
import { saveSwarmResult } from "./swarmRecords";

interface Props {
  characterId: CharacterId;
  map: SwarmMapId;
  level: number;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  onRetry: () => void;
}

/** 위쪽 정보를 다시 그리는 간격 (ms) */
const HUD_MS = 200;

export function SwarmGame({ characterId, map, level, lang, t, onExit, onRetry }: Props) {
  // 꾸밈이 아니라 판 시드: 판마다 다르게 (판 안의 계산은 이 시드로만)
  const [run] = useState(() => createSwarm(Math.floor(Math.random() * 0x7fffffff), characterId, map, level));
  const [, refresh] = useState(0);
  const [best, setBest] = useState<boolean | null>(null);
  const [coins, setCoins] = useState<{ coins: number; first: boolean } | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => refresh((n) => n + 1), HUD_MS);
    return () => window.clearInterval(id);
  }, []);
  const ended = best !== null;
  const choices = run.swarm?.choices;

  return (
    <>
      <GameScreen
        mode="swarm"
        characterId={characterId}
        seedText=""
        initialRun={run}
        unlocks={[]}
        lang={lang}
        t={t}
        onExit={onExit}
        step={stepSwarm}
        overlay={drawSwarm}
        onRunEnd={(r) => {
          if (r.won) setCoins(clearSwarmMap(map, level));
          setBest(saveSwarmResult(characterId, swarmResult(r)));
        }}
        afterRun={ended ? <SwarmResult run={run} newBest={best} coins={coins} lang={lang} t={t} onExit={onExit} onRetry={onRetry} /> : undefined}
      />
      {!ended && <SwarmHud run={run} lang={lang} t={t} />}
      {!ended && choices && (
        <SwarmLevelUp
          run={run}
          choices={choices}
          lang={lang}
          t={t}
          onPick={(i) => {
            chooseSwarm(run, i);
            refresh((n) => n + 1);
          }}
        />
      )}
      {!ended && run.swarm?.ask && (
        <div className="game-overlay">
          <div className="modal swarm-ask" role="dialog" aria-modal="true">
            <h2>{t("swarmClear")}</h2>
            <p>{t("swarmAsk")}</p>
            <div className="modal-actions">
              <button type="button" onClick={() => continueSwarm(run, false)}>
                {t("swarmStop")}
              </button>
              <button type="button" onClick={() => {
                  continueSwarm(run, true);
                  refresh((n) => n + 1);
                }}>
                {t("swarmGoOn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
