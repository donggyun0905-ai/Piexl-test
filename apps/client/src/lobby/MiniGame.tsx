// 미니 게임 화면: 게임기마다 다른 게임을 화면 전체 무대로 (게임마다 다른 배경 · 위 막대 · 브라우저 전체화면 · 닫기 · Esc)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import type { GameId } from "./lobbyMap";
import { Blackjack } from "./games/Blackjack";
import { TileGame } from "./games/TileGame";
import { CandyBox } from "./games/CandyBox";
import { RuneDrop } from "./games/RuneDrop";
import { JokerGame } from "./games/JokerGame";
import { Slots } from "./games/Slots";
import { DiceGame } from "./games/DiceGame";
import { HiLo } from "./games/HiLo";
import { MiniZoom } from "./games/crisp";
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

/** 위 막대 이름 앞 그림 */
const GAME_ICON: Record<GameId, string> = { blackjack: "🂡", tiles: "🀄", apples: "🍬", blocks: "🧱", joker: "🃏", slots: "🎰", dice: "🎲", hilo: "⇅", pets: "🐾" };

const GAMES: Record<GameId, (p: { t: (k: TextKey) => string }) => React.JSX.Element> = {
  blackjack: Blackjack,
  tiles: TileGame,
  apples: CandyBox,
  blocks: RuneDrop,
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
    const esc = (e: KeyboardEvent) => e.key === "Escape" && !document.fullscreenElement && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const Game = GAMES[game];
  const [areaRef, bodyRef, zoom] = useFitZoom();
  const [multi, setMulti] = useState(false);
  const full = useFullscreen();
  const canMulti = !solo && MULTI.includes(game as CardGame);
  return (
    <div className={`mini-stage mini-${game}`} role="dialog" aria-modal="true" aria-label={t(GAME_NAME[game])}>
      <i className="mini-glow" aria-hidden />
      <header className="mini-bar">
        <h2>
          <span className="mini-icon">{GAME_ICON[game]}</span>
          {t(GAME_NAME[game])}
        </h2>
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
        <div className="mini-tools">
          {full.can && (
            <button type="button" className="ghost" onClick={full.toggle} title={t(full.on ? "mgWindowed" : "mgFullscreen")}>
              {full.on ? "🗗" : "⛶"} <span>{t(full.on ? "mgWindowed" : "mgFullscreen")}</span>
            </button>
          )}
          <button type="button" className="ghost mini-close" onClick={onClose}>
            ✕ <span>{t("close")}</span>
          </button>
        </div>
      </header>
      <div className="mini-area" ref={areaRef}>
        <div className="mini-body" ref={bodyRef} style={{ zoom }}>
          <MiniZoom.Provider value={zoom}>{canMulti && multi ? <MultiPanel game={game as CardGame} t={t} /> : <Game t={t} />}</MiniZoom.Provider>
        </div>
      </div>
    </div>
  );
}

/** 브라우저 전체화면 (지원하는 곳만, 닫으면 풀림) */
const hasDoc = () => typeof document !== "undefined";

function useFullscreen() {
  const [on, setOn] = useState(() => hasDoc() && !!document.fullscreenElement);
  useEffect(() => {
    const sync = () => setOn(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };
  return { on, toggle, can: hasDoc() && typeof document.documentElement.requestFullscreen === "function" };
}

/** 게임 내용 확대: 무대(위 막대 아래 전체)를 꽉 채우게 (최대 4배, 작은 화면은 0.6배까지 줄임) · 내용 크기가 바뀌면 다시 맞춤 */
const MAX_ZOOM = 4;
const MIN_ZOOM = 0.6;
const PAD = 24;

function useFitZoom(): [React.RefObject<HTMLDivElement | null>, React.RefObject<HTMLDivElement | null>, number] {
  const area = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(1);
  useEffect(() => {
    const el = ref.current;
    const box = area.current;
    if (!el || !box) return;
    const fit = () => {
      const z = Number(el.style.zoom) || 1;
      const r = el.getBoundingClientRect();
      const w = r.width / z;
      const h = r.height / z;
      if (!w || !h) return;
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (box.clientWidth - PAD) / w, (box.clientHeight - PAD) / h));
      if (Math.abs(next - z) > 0.02) setValue(Math.round(next * 100) / 100);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    ro.observe(box);
    fit();
    return () => ro.disconnect();
  }, []);
  return [area, ref, value];
}
