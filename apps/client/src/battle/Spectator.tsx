import { FLOOR_COUNT, rankPlayers, type RoomView } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { formatClock } from "./BattleScreen";
import type { TextKey } from "../i18n";
import { drawFullMap, FULL_MAP_HEIGHT, FULL_MAP_WIDTH, PLAYER_COLORS } from "./fullMap";
import type { BattleConnection } from "./connection";

interface Props {
  room: RoomView;
  you: string;
  clockOffset: number;
  chat: { name: string; text: string }[];
  conn: BattleConnection;
  t: (key: TextKey) => string;
  onExit: () => void;
}

const STATE_KEY: Record<string, TextKey> = {
  alive: "bsAlive",
  dead: "bsDead",
  cleared: "bsCleared",
  timeout: "bsTimeout",
  forfeit: "bsForfeit",
};

/** 먼저 끝난 사람: 모든 층 지도·각자 위치·체력·남은 시간, 끝난 사람끼리 채팅, 끝나면 순위 */
export function Spectator({ room, you, clockOffset, chat, conn, t, onExit }: Props) {
  const order = room.players.map((p) => p.pid);
  const [floor, setFloor] = useState(() => room.players.find((p) => p.pid === you)?.floor ?? 1);
  const [text, setText] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const mapRef = useRef<HTMLCanvasElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const done = room.phase === "done";

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const ctx = mapRef.current?.getContext("2d");
    if (ctx) drawFullMap(ctx, room.seedText, floor, room.players, order);
  });
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chat.length]);

  const ranked = rankPlayers(room.players);
  const left = room.endAt - (now + clockOffset);

  return (
    <div className="game-overlay spectator">
      <div className="modal spectator-modal">
        <h2>{done ? t("battleResult") : t("spectating")}</h2>
        {!done && (
          <p className="result-line">
            {t("timeLeft")} {formatClock(left)}
          </p>
        )}
        <div className="spectator-body">
          <div className="spectator-map">
            <div className="floor-tabs">
              {Array.from({ length: FLOOR_COUNT }, (_, i) => i + 1).map((f) => (
                <button key={f} type="button" className={f === floor ? "active" : ""} onClick={() => setFloor(f)}>
                  {f}
                </button>
              ))}
            </div>
            <canvas ref={mapRef} width={FULL_MAP_WIDTH} height={FULL_MAP_HEIGHT} />
          </div>
          <ol className="leaderboard battle-ranking">
            {ranked.map((p, i) => (
              <li key={p.pid} className={p.pid === you ? "me" : ""}>
                <span className="lb-rank">{i + 1}</span>
                <span className="lb-dot" style={{ background: PLAYER_COLORS[order.indexOf(p.pid) % PLAYER_COLORS.length] }} />
                <span className="lb-name">{p.name}</span>
                <span className="lb-floor">
                  {t(STATE_KEY[p.state] ?? "bsAlive")} · {t("floor")} {p.floor}
                  {p.state === "alive" && p.maxHp > 0 && ` · ${p.hp}/${p.maxHp}`}
                  {!p.connected && p.state === "alive" && ` · ${t("bsAway")}`}
                </span>
                <strong className="lb-score">{p.score.toLocaleString()}</strong>
              </li>
            ))}
          </ol>
        </div>
        <div className="chat">
          <div ref={chatRef} className="chat-log">
            {chat.map((c, i) => (
              <div key={i}>
                <strong>{c.name}</strong> {c.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) conn.send({ t: "chat", text });
              setText("");
            }}
          >
            <input value={text} maxLength={80} placeholder={t("chatPlaceholder")} onChange={(e) => setText(e.target.value)} />
          </form>
        </div>
        <button type="button" onClick={onExit}>
          {t("toTitle")}
        </button>
      </div>
    </div>
  );
}
