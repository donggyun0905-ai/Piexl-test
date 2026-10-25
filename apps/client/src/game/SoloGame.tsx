// 혼자 하기 한 판: 라스트 보스를 잡으면 레이드 명예의 전당에, 레이드 아레나는 아레나 순위표에 결과 창에서 기록을 보냄
import { arenaCleared, raidCleared, type CharacterId, type RunState } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { GameScreen } from "./GameScreen";
import { RaidSubmit } from "./RaidSubmit";

interface Props {
  characterId: CharacterId;
  seedText: string;
  initialRun?: RunState;
  endless?: boolean;
  arena?: boolean;
  hero?: boolean;
  unlocks: string[];
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  onRetry: (same: boolean) => void;
}

export function SoloGame(props: Props) {
  const [raid, setRaid] = useState<RunState | null>(null);
  return (
    <GameScreen
      mode="solo"
      {...props}
      onRunEnd={(run) => setRaid(!run.pet && (raidCleared(run) || (run.arenaLv !== undefined && arenaCleared(run) > 0)) ? run : null)}
      resultExtra={raid && <RaidSubmit run={raid} seedText={props.seedText} t={props.t} />}
    />
  );
}
