// 같이 하는 숫자 타일: 내 차례에 타일을 골라(바닥 타일 빌리기 포함) 묶음 내기·붙이기, 다 하면 턴 끝 (낸 게 없으면 한 장 가져옴)
import { playTiles, type TilesView } from "@pixel-rogue/shared";
import { useState } from "react";
import { TileView } from "../games/TileGame";
import { TileTable, toggleId } from "../games/TileTable";
import { seatName, type TableProps } from "./CardTable";

export function TilesMulti({ view, t, send }: TableProps) {
  const g = view.game_ as TilesView;
  const [sel, setSel] = useState<number[]>([]);
  const mine = view.turn === view.you && view.phase === "playing";
  const [borrow, setBorrow] = useState<number[]>([]);
  const act = (a: unknown) => {
    send({ t: "act", a });
    setSel([]);
    setBorrow([]);
  };
  return (
    <div className="mg tiles">
      <div className="mp-others">
        {g.counts.map((n, i) =>
          i === view.you ? null : (
            <span key={i} className={view.turn === i ? "turn" : ""}>
              {seatName(view, i, t)}: {n}
            </span>
          ),
        )}
        <span>
          {t("mgBag")}: {g.bag}
        </span>
      </div>
      <TileTable table={g.table} hand={g.hand} sel={sel} borrow={borrow} onBorrow={mine ? (id) => setBorrow(toggleId(id)) : null} onAdd={(i) => act({ add: i, ids: sel, borrow })} />
      <div className="tile-hand">
        {g.hand.map((x) => (
          <TileView key={x.id} tile={x} selected={sel.includes(x.id)} onClick={() => setSel(toggleId(x.id))} />
        ))}
      </div>
      {g.winner >= 0 ? (
        <strong className={`mg-result ${g.winner === view.you ? "win" : "lose"}`}>{g.winner === view.you ? t("mgWin") : t("mpWinner").replace("{n}", seatName(view, g.winner, t))}</strong>
      ) : mine ? (
        <div className="mg-row">
          <button type="button" className="primary" disabled={!playTiles(g.hand, g.table, sel, borrow, null)} onClick={() => act({ meld: sel, borrow })}>
            {t("mgMeld")}
          </button>
          <button type="button" className="secondary" onClick={() => act({ end: true })}>
            {t(g.played ? "mgEndTurn" : "mgDraw1")}
          </button>
        </div>
      ) : (
        <p className="mg-note">{t("mpTurnOf").replace("{n}", seatName(view, view.turn, t))}</p>
      )}
    </div>
  );
}
