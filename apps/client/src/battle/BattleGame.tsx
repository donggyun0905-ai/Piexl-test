import type { BalanceValues, CharacterId, RoomView } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { formatClock } from "./BattleScreen";
import type { BattleConnection } from "./connection";
import { Spectator } from "./Spectator";

interface Props {
  room: RoomView;
  /** 이 판의 게임 수치 (방에서 정한 것) */
  balance?: BalanceValues;
  you: string;
  characterId: CharacterId;
  clockOffset: number;
  chat: { name: string; text: string }[];
  conn: BattleConnection;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
}

/** 배틀 한 판: 같은 시드로 각자 플레이, 상태만 서버로. 끝나면 관전·채팅·결과 */
export function BattleGame({ room, balance, you, characterId, clockOffset, chat, conn, lang, t, onExit }: Props) {
  const [timeUp, setTimeUp] = useState(false);
  const me = room.players.find((p) => p.pid === you);
  // 서버에서 이미 끝난 사람(다시 연결했는데 기권·시간 끝 등)은 바로 관전
  const finishedOnServer = !!me && me.state !== "alive";

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() + clockOffset >= room.endAt) setTimeUp(true);
    }, 250);
    return () => clearInterval(id);
  }, [room.endAt, clockOffset]);

  const spectator = <Spectator room={room} you={you} clockOffset={clockOffset} chat={chat} conn={conn} t={t} onExit={onExit} />;
  if (finishedOnServer && room.phase === "done") return <div className="game-screen">{spectator}</div>;

  return (
    <GameScreen
      mode="battle"
      characterId={characterId}
      seedText={room.seedText}
      balance={balance}
      unlocks={[]}
      lang={lang}
      t={t}
      onExit={onExit}
      onAdvance={(run) => conn.status(run)}
      onRunEnd={(run) => conn.finish(run)}
      afterRun={spectator}
      timeText={() => formatClock(room.endAt - (Date.now() + clockOffset))}
      forceEnd={timeUp || finishedOnServer}
    />
  );
}
