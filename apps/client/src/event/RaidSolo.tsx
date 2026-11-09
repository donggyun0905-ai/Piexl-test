// 이벤트 '레이드' AI와 바로 시작: 나 + AI 동료 4명 (sim/raid). 게임 화면(GameScreen)에 진행을 맡김
import { createRaid, stepParty, type CharacterId, type RaidEventBoss } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { CoopWatch } from "../coop/CoopWatch";
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
    <RaidOverlay run={run} t={t} me={0} />
    <SoloWatch run={run} t={t} />
    </>
  );
}

/** 쓰러져 있는 동안 AI 동료 화면을 봄 (눌러서 다음 사람 · 협동 관전 CoopWatch를 그대로, 0.3초마다 다시 그림) */
function SoloWatch({ run, t }: { run: Parameters<typeof RaidOverlay>[0]["run"]; t: (key: TextKey) => string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 300);
    return () => clearInterval(id);
  }, []);
  return <CoopWatch run={run} me={0} names={[]} watching={false} t={t} />;
}
