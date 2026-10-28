// 기다리는 동안 미니 게임 (랭크전 상대 찾기 등): 로비 게임기와 같은 게임을 눌러서 바로 (혼자 하기만)
import { useState } from "react";
import type { TextKey } from "../i18n";
import { GAME_NAME, MiniGame } from "../lobby/MiniGame";
import type { GameId } from "../lobby/lobbyMap";

const WAIT_GAMES: readonly { id: GameId; icon: string }[] = [
  { id: "blackjack", icon: "🃏" },
  { id: "tiles", icon: "🔢" },
  { id: "apples", icon: "🍬" },
  { id: "blocks", icon: "🧱" },
  { id: "joker", icon: "🤡" },
  { id: "slots", icon: "🎰" },
  { id: "dice", icon: "🎲" },
  { id: "hilo", icon: "🔼" },
];

export function WaitGames({ t }: { t: (k: TextKey) => string }) {
  const [game, setGame] = useState<GameId | null>(null);
  return (
    <section className="wait-games">
      <h3>{t("waitGames")}</h3>
      <div className="wait-games-grid">
        {WAIT_GAMES.map((g) => (
          <button key={g.id} type="button" onClick={() => setGame(g.id)}>
            <span className="wait-game-icon">{g.icon}</span>
            {t(GAME_NAME[g.id])}
          </button>
        ))}
      </div>
      {game && <MiniGame game={game} t={t} solo onClose={() => setGame(null)} />}
    </section>
  );
}
