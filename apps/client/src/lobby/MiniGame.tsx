// 미니 게임 창: 게임기마다 다른 게임 (닫기 · Esc)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import type { GameId } from "./lobbyMap";
import { Blackjack } from "./games/Blackjack";
import { TileGame } from "./games/TileGame";
import { AppleBox } from "./games/AppleBox";
import { Blocks } from "./games/Blocks";
import { JokerGame } from "./games/JokerGame";
import { Slots } from "./games/Slots";
import { DiceGame } from "./games/DiceGame";
import { HiLo } from "./games/HiLo";
import { PetShop } from "./PetShop";
import { MultiPanel } from "./net/MultiPanel";
import type { CardGame } from "@pixel-rogue/shared";

export const GAME_NAME: Record<GameId, TextKey> = {
  blackjack: "mgBlackjack",
  tiles: "mgTiles",
  apples: "mgApples",
  blocks: "mgBlocks",
  joker: "mgJoker",
  slots: "mgSlots",
  dice: "mgDice",
  hilo: "mgHilo",
  pets: "mgPets",
};

const GAMES: Record<GameId, (p: { t: (k: TextKey) => string }) => React.JSX.Element> = {
  blackjack: Blackjack,
  tiles: TileGame,
  apples: AppleBox,
  blocks: Blocks,
  joker: JokerGame,
  slots: Slots,
  dice: DiceGame,
  hilo: HiLo,
  pets: PetShop,
};

/** 같이 하기가 되는 게임 */
const MULTI: readonly GameId[] = ["blackjack", "tiles", "joker"];

/** solo: 혼자 하기만 (랭크전 기다리는 동안 등) */
export function MiniGame({ game, t, onClose, solo = false }: { game: GameId; t: (k: TextKey) => string; onClose: () => void; solo?: boolean }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const Game = GAMES[game];
  const [bodyRef, zoom] = useFitZoom();
  const [multi, setMulti] = useState(false);
  const canMulti = !solo && MULTI.includes(game as CardGame);
  return (
    <div className="modal-backdrop mini-backdrop">
      <div className="modal mini-game" role="dialog" aria-modal="true" aria-label={t(GAME_NAME[game])}>
        <div className="mini-body" ref={bodyRef} style={{ zoom }}>
          <header className="mini-head">
            <h2>{t(GAME_NAME[game])}</h2>
            <button type="button" className="ghost" onClick={onClose}>
              {t("close")}
            </button>
          </header>
          {canMulti && (
            <nav className="mp-tabs">
              <button type="button" className={multi ? "" : "active"} onClick={() => setMulti(false)}>
                {t("mpSolo")}
              </button>
              <button type="button" className={multi ? "active" : ""} onClick={() => setMulti(true)}>
                {t("mpMulti")}
              </button>
            </nav>
          )}
          {canMulti && multi ? <MultiPanel game={game as CardGame} t={t} /> : <Game t={t} />}
        </div>
      </div>
    </div>
  );
}

/** 게임 창 확대: 기본 2.5배, 화면보다 크면 화면에 맞게 줄임 (내용 크기가 바뀌면 다시 맞춤) */
const MAX_ZOOM = 2.5;
const MARGIN = 32;

function useFitZoom(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const z = Number(el.style.zoom) || 1;
      const r = el.getBoundingClientRect();
      const w = r.width / z;
      const h = r.height / z;
      const next = Math.max(1, Math.min(MAX_ZOOM, (window.innerWidth - MARGIN) / w, (window.innerHeight - MARGIN) / h));
      if (Math.abs(next - z) > 0.02) setValue(Math.round(next * 100) / 100);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    fit();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  return [ref, value];
}
