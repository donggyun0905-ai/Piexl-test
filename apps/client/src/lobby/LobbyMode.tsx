// 로비 돌아다니기: 캔버스 + 왼쪽 위 나가기 · 게임기 앞 들어가기 버튼(모바일) · 미니 게임 창
import { useState } from "react";
import type { TextKey } from "../i18n";
import { LobbyStage } from "./LobbyStage";
import type { GameId } from "./lobbyMap";
import { MiniGame, GAME_NAME } from "./MiniGame";

export function LobbyMode({ t, onExit }: { t: (k: TextKey) => string; onExit: () => void }) {
  const [near, setNear] = useState<GameId | null>(null);
  const [game, setGame] = useState<GameId | null>(null);
  return (
    <div className="lobby-mode">
      <LobbyStage play paused={game !== null} onNear={setNear} onGame={setGame} />
      <button type="button" className="secondary lobby-exit" onClick={onExit}>
        {t("lobbyExit")}
      </button>
      <p className="lobby-help">{t("lobbyHelp")}</p>
      {near && !game && (
        <button type="button" className="primary lobby-enter" onClick={() => setGame(near)}>
          {t(GAME_NAME[near])} · F
        </button>
      )}
      {game && <MiniGame game={game} t={t} onClose={() => setGame(null)} />}
    </div>
  );
}
