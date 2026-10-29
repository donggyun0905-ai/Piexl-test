// 로비 돌아다니기: 캔버스 + 왼쪽 위 나가기 · 게임기 앞 들어가기 버튼(모바일) · 미니 게임 창 · 전시장 안이면 위에 '전시장', 전시물 가까이 가면 설명
import { useState } from "react";
import type { TextKey } from "../i18n";
import { loadExhibits, type ExhibitId } from "./exhibits";
import { LobbyStage } from "./LobbyStage";
import type { GameId } from "./lobbyMap";
import { MiniGame, GAME_NAME } from "./MiniGame";
import type { HallSpot } from "./hallMap";
import { RecordBook } from "./RecordBook";

const EX_NAME: Record<ExhibitId, TextKey> = { soulShard: "exSoulShard", laurelShip: "exLaurelShip" };
const EX_DESC: Record<ExhibitId, TextKey> = { soulShard: "exSoulShardDesc", laurelShip: "exLaurelShipDesc" };

export function LobbyMode({ t, onExit }: { t: (k: TextKey) => string; onExit: () => void }) {
  const [near, setNear] = useState<GameId | null>(null);
  const [game, setGame] = useState<GameId | null>(null);
  const [hall, setHall] = useState(false);
  const [spot, setSpot] = useState<HallSpot | null>(null);
  const [book, setBook] = useState(false);
  const ex: ExhibitId | null = spot === "book" ? null : spot;
  const names = { soulShard: t("exSoulShard"), laurelShip: t("exLaurelShip") };
  const count = ex ? (loadExhibits()[ex]?.count ?? 0) : 0;
  return (
    <div className="lobby-mode">
      <LobbyStage play paused={game !== null || book} onNear={setNear} onGame={setGame} onRoom={setHall} onExhibit={setSpot} onRead={() => setBook(true)} names={names} />
      <button type="button" className="secondary lobby-exit" onClick={onExit}>
        {t("lobbyExit")}
      </button>
      {hall && <p className="lobby-hall-title">🏛 {t("exHall")}</p>}
      <p className="lobby-help">{t(hall ? "exHallHelp" : "lobbyHelp")}</p>
      {ex && (
        <div className="lobby-exhibit">
          <b>{t(EX_NAME[ex])}</b>
          {ex === "soulShard" && <span> × {count}</span>}
          <p>{t(EX_DESC[ex])}</p>
        </div>
      )}
      {spot && !book && (
        <button type="button" className="primary lobby-enter" onClick={() => setBook(true)}>
          {spot === "book" ? `📖 ${t("exBook")} · F` : t("exRead")}
        </button>
      )}
      {book && <RecordBook t={t} onClose={() => setBook(false)} />}
      {near && !game && (
        <button type="button" className="primary lobby-enter" onClick={() => setGame(near)}>
          {t(GAME_NAME[near])} · F
        </button>
      )}
      {game && <MiniGame game={game} t={t} onClose={() => setGame(null)} />}
    </div>
  );
}
