// 같이 하기 방: 대기(자리 · 방 코드 · 방장 시작) → 게임마다 화면 → 결과(방장이 다시)
import type { CardClientMsg, TableView } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { TextKey } from "../../i18n";
import { BjMulti } from "./BjMulti";
import { JokerMulti } from "./JokerMulti";
import { TilesMulti } from "./TilesMulti";

export interface TableProps {
  view: TableView;
  t: (k: TextKey) => string;
  send: (m: CardClientMsg) => void;
}

/** 자리 이름 (컴퓨터는 '컴퓨터 n') */
export function seatName(view: TableView, i: number, t: (k: TextKey) => string): string {
  const s = view.seats[i];
  if (!s) return "";
  if (s.cpu) return `${t("mgCpu")} ${i + 1}`;
  return i === view.you ? `${s.name} (${t("mgMe")})` : s.name;
}

/** 차례 남은 초 */
function useSecondsLeft(deadline: number, offset: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, Math.ceil((deadline - (now + offset)) / 1000));
}

export function CardTable({ view, t, send, offset, onLeave }: TableProps & { offset: number; onLeave: () => void }) {
  const left = useSecondsLeft(view.deadline, offset);
  return (
    <div className="mg card-table">
      <div className="mg-row">
        <span className="mp-room">
          {t("mpRoom")} <b>{view.code}</b>
        </span>
        {view.phase === "playing" && view.deadline > 0 && <span className="mp-timer">⏱ {left}</span>}
        <button type="button" className="ghost" onClick={onLeave}>
          {t("mpLeave")}
        </button>
      </div>
      {view.phase === "lobby" ? (
        <>
          <ul className="mp-seats">
            {view.seats.map((_, i) => (
              <li key={i}>{seatName(view, i, t)}</li>
            ))}
          </ul>
          <p className="mg-note">{t("mpWaiting")}</p>
          {view.host && (
            <button type="button" className="primary" onClick={() => send({ t: "start" })}>
              {t("mpStart")}
            </button>
          )}
        </>
      ) : view.game === "blackjack" ? (
        <BjMulti view={view} t={t} send={send} />
      ) : view.game === "tiles" ? (
        <TilesMulti view={view} t={t} send={send} />
      ) : (
        <JokerMulti view={view} t={t} send={send} />
      )}
      {view.phase === "done" && view.host && (
        <button type="button" className="primary" onClick={() => send({ t: "again" })}>
          {t("mgAgain")}
        </button>
      )}
    </div>
  );
}
