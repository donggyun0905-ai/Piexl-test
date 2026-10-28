// 이벤트 '패왕전' 혼자 한 판 (나 + AI): 게임 화면(GameScreen)에 진행을 맡기고 위에 정보(PwHud)·점수판(PwBoard) · 끝나면 결과와 보상 칩
import { createPvp, stepPvp, type CharacterId, type PwLoadout, type PwMode } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { PwBoard, useBoard } from "./PwBoard";
import { PwHud } from "./PwHud";
import { PwResult } from "./PwResult";
import { PwWatch } from "./PwWatch";
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
  const [run] = useState(() => createPvp(Math.floor(Math.random() * 0x7fffffff), mode, [{ characterId, loadout }]));
  const [, refresh] = useState(0);
  const [chips, setChips] = useState<number | null>(null);
  const [board, toggleBoard] = useBoard();
  useEffect(() => {
    const id = window.setInterval(() => refresh((n) => n + 1), HUD_MS);
    return () => window.clearInterval(id);
  }, []);
  const ended = chips !== null;
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
        step={(r, input) => {
          stepPvp(r, [input]);
          return true;
        }}
        onRunEnd={(end) => setChips(savePwResult(mode, end.won))}
        afterRun={ended ? <PwResult run={run} me={0} lang={lang} t={t} onExit={onExit} onRetry={onRetry} /> : undefined}
      />
      {!ended && <PwWatch run={run} me={0} t={t} />}
      {!ended && <PwHud run={run} me={0} t={t} onBoard={toggleBoard} />}
      {board && <PwBoard run={run} me={0} lang={lang} t={t} />}
    </>
  );
}
