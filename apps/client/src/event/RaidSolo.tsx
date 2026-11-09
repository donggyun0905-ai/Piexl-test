// 이벤트 '레이드' AI와 바로 시작: 나 + AI 동료 4명 (sim/raid). 게임 화면(GameScreen)에 진행을 맡김
import { createRaid, stepParty, type CharacterId, type RaidEventBoss } from "@pixel-rogue/shared";
import { useState } from "react";
import { usePwBalanceRun } from "../balance";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { loadAchievements } from "../records";
import { RaidOverlay } from "./RaidOverlay";
import { RaidBoard } from "./RaidBoard";

interface Props {
  boss: RaidEventBoss;
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  onRetry: () => void;
}

export function RaidSolo({ boss, characterId, lang, t, onExit }: Props) {
  usePwBalanceRun();
  // 판 시드: 판마다 다르게 (판 안의 계산은 이 시드로만)
  const [run] = useState(() => createRaid(Math.floor(Math.random() * 0x7fffffff), boss, [{ characterId, unlocks: loadAchievements() }]));
  return (
    <>
    <GameScreen
      mode="coop"
      characterId={characterId}
      seedText=""
      initialRun={run}
      unlocks={[]}
      lang={lang}
      t={t}
      onExit={onExit}
      resultExtra={<RaidBoard run={run} t={t} />}
      step={(r, input) => {
        stepParty(r, [input]);
        return true;
      }}
    />
    <RaidOverlay run={run} t={t} />
    </>
  );
}
