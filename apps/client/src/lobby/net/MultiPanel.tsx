// 같이 하기: 빠른 시작 · 방 만들기 · 코드로 들어가기 → 방(대기 · 게임 · 결과)
import type { CardGame, TableView } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { TextKey } from "../../i18n";
import { CardConnection, findRoom } from "./cardNet";
import { CardTable } from "./CardTable";

export function MultiPanel({ game, t }: { game: CardGame; t: (k: TextKey) => string }) {
  const [view, setView] = useState<TableView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [conn, setConn] = useState<CardConnection | null>(null);

  // 창을 닫거나 다른 방으로 가면 연결을 닫음
  useEffect(() => () => conn?.close(), [conn]);

  const enter = (c: string, mode: "quick" | "private") => {
    setError(null);
    setConn(
      new CardConnection(c, game, mode, setView, (e) => {
        setError(e);
        setView(null);
      }),
    );
  };
  const open = async (quick: boolean) => {
    setBusy(true);
    const room = await findRoom(game, quick);
    setBusy(false);
    if (!room) return setError("offline");
    enter(room.code, room.mode);
  };

  if (view && conn) {
    return (
      <CardTable
        view={view}
        t={t}
        offset={conn.offset}
        send={(m) => conn.send(m)}
        onLeave={() => {
          setConn(null);
          setView(null);
        }}
      />
    );
  }
  return (
    <div className="mg multi-menu">
      <p className="mg-rule">{t("mpIntro")}</p>
      <div className="mg-row">
        <button type="button" className="primary" disabled={busy} onClick={() => void open(true)}>
          {t("mpQuick")}
        </button>
        <button type="button" className="secondary" disabled={busy} onClick={() => void open(false)}>
          {t("mpCreate")}
        </button>
      </div>
      <div className="mg-row">
        <input className="mp-code" value={code} maxLength={6} placeholder={t("mpCodeHint")} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ""))} />
        <button type="button" className="secondary" disabled={code.length !== 6} onClick={() => enter(code, "private")}>
          {t("mpJoin")}
        </button>
      </div>
      {error && <p className="mg-result lose">{t(ERROR_TEXT[error] ?? "mpErrClosed")}</p>}
    </div>
  );
}

const ERROR_TEXT: Record<string, TextKey> = { full: "mpErrFull", started: "mpErrStarted", offline: "mpErrOffline", closed: "mpErrClosed" };
