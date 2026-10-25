// 숫자 타일 게임 (컴퓨터 1명과): 타일을 눌러 고르고(바닥 타일도 빌려 올 수 있음) '묶음 내기' 또는 바닥 묶음의 '+'로 붙이기. 낸 게 없으면 '한 장 가져오기'
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips } from "../chips";
import { cpuTurn, newBag, playTiles, sortHand, TILE_COLORS, TILE_HAND, type Tile } from "@pixel-rogue/shared";
import { TileTable, toggleId } from "./TileTable";
import { rng, WIN_CHIPS } from "./util";

interface State {
  bag: Tile[];
  me: Tile[];
  cpu: Tile[];
  table: Tile[][];
  played: number;
  over: "win" | "lose" | null;
}

function deal(): State {
  const bag = newBag(rng);
  return { me: sortHand(bag.splice(0, TILE_HAND)), cpu: bag.splice(0, TILE_HAND), bag, table: [], played: 0, over: null };
}

export function TileGame({ t }: { t: (k: TextKey) => string }) {
  const [s, setS] = useState(deal);
  const [sel, setSel] = useState<number[]>([]);
  const [borrow, setBorrow] = useState<number[]>([]);
  const clear = () => {
    setSel([]);
    setBorrow([]);
  };

  const place = (meldIndex: number | null) => {
    const r = playTiles(s.me, s.table, sel, borrow, meldIndex);
    if (!r) return;
    clear();
    setS({ ...s, me: r.hand, table: r.table, played: s.played + r.used, over: r.hand.length === 0 ? "win" : null });
    if (r.hand.length === 0) addChips(WIN_CHIPS * 2);
  };
  /** 내 턴 끝 (낸 게 없으면 한 장 가져옴) → 컴퓨터 턴 */
  const endTurn = () => {
    const bag = [...s.bag];
    const me = s.played === 0 && bag.length ? sortHand([...s.me, bag.pop()!]) : s.me;
    const c = cpuTurn(s.cpu, s.table, bag);
    clear();
    setS({ me, cpu: c.hand, table: c.table, bag: c.bag, played: 0, over: c.hand.length === 0 ? "lose" : null });
  };

  return (
    <div className="mg tiles">
      <p className="mg-rule">{t("mgTilesRule")}</p>
      <p className="mg-note">
        {t("mgCpu")}: {s.cpu.length} · {t("mgBag")}: {s.bag.length}
      </p>
      <TileTable table={s.table} hand={s.me} sel={sel} borrow={borrow} onBorrow={s.over ? null : (id) => setBorrow(toggleId(id))} onAdd={place} />
      <div className="tile-hand">
        {s.me.map((x) => (
          <TileView key={x.id} tile={x} selected={sel.includes(x.id)} onClick={() => setSel(toggleId(x.id))} />
        ))}
      </div>
      {s.over ? (
        <div className="mg-row">
          <strong className={`mg-result ${s.over}`}>{t(s.over === "win" ? "mgWin" : "mgLose")}</strong>
          <button type="button" className="primary" onClick={() => setS(deal())}>
            {t("mgAgain")}
          </button>
        </div>
      ) : (
        <div className="mg-row">
          <button type="button" className="primary" disabled={!playTiles(s.me, s.table, sel, borrow, null)} onClick={() => place(null)}>
            {t("mgMeld")}
          </button>
          <button type="button" className="secondary" onClick={endTurn}>
            {t(s.played ? "mgEndTurn" : "mgDraw1")}
          </button>
        </div>
      )}
    </div>
  );
}

export function TileView({ tile, selected, onClick }: { tile: Tile; selected?: boolean; onClick?: () => void }) {
  const style = { color: TILE_COLORS[tile.c] };
  if (!onClick)
    return (
      <span className="tile" style={style}>
        {tile.n}
      </span>
    );
  return (
    <button type="button" className={`tile${selected ? " sel" : ""}`} style={style} onClick={onClick}>
      {tile.n}
    </button>
  );
}
