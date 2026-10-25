// 같이 하는 블랙잭: 딜러 한 명과 자리 4개. 걸기(내 칩) → 내 차례에 받기·멈추기·더블 → 결과 (칩은 각자 화면에서 셈)
import { BJ_BETS, BJ_PAY, bjTotal, type BjView } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { addChips, loadChips } from "../chips";
import { BetBar } from "../games/BetBar";
import { RESULT_TEXT, Row } from "../games/Blackjack";
import { seatName, type TableProps } from "./CardTable";

export function BjMulti({ view, t, send }: TableProps) {
  const g = view.game_ as BjView;
  const me = view.you;
  // 칩은 이 기기에만 있으니 그릴 때마다 읽음 (정산은 판마다 한 번)
  const chips = loadChips();
  const [bet, setBet] = useState(BJ_BETS[0]!);
  /** 판마다 한 번만 칩 정산 · 내가 직접 건 판 (시간이 지나 저절로 걸린 판은 칩이 오가지 않음) */
  const paid = useRef(new Set<number>());
  const betRounds = useRef(new Set<number>());

  useEffect(() => {
    if (g.phase !== "result" || paid.current.has(g.round)) return;
    paid.current.add(g.round);
    const r = g.results[me];
    if (r && betRounds.current.has(g.round)) addChips(Math.floor(g.bets[me]! * BJ_PAY[r]));
  }, [g, me]);

  const placeBet = () => {
    if (bet > chips) return;
    addChips(-bet);
    betRounds.current.add(g.round);
    send({ t: "act", a: { bet } });
  };
  const double = () => {
    if (g.bets[me]! > chips || !betRounds.current.has(g.round)) return;
    addChips(-g.bets[me]!);
    send({ t: "act", a: { double: true } });
  };
  const myTurn = g.phase === "play" && view.turn === me;

  return (
    <div className="mg bj-multi">
      <Row label={`${t("mgDealer")} ${g.phase === "result" ? bjTotal(g.dealer) : ""}`} cards={g.dealer} hideFrom={g.phase === "result" ? 99 : 1} />
      {g.hands.map((h, i) => (
        <div key={i} className={`bj-seat${view.turn === i ? " turn" : ""}${i === me ? " mine" : ""}`}>
          <Row label={`${seatName(view, i, t)} · ${g.bets[i]}`} cards={h} />
          {h.length > 0 && <span className="mg-sum">{bjTotal(h)}</span>}
          {g.results[i] && <strong className={`mg-result ${g.results[i] === "win" || g.results[i] === "blackjack" ? "win" : g.results[i] === "push" ? "" : "lose"}`}>{t(RESULT_TEXT[g.results[i]!])}</strong>}
        </div>
      ))}
      {g.phase === "bet" && !g.ready[me] && (
        <>
          <BetBar t={t} chips={chips} bet={bet} setBet={setBet} />
          <button type="button" className="primary" disabled={bet > chips} onClick={placeBet}>
            {t("mpBet")}
          </button>
        </>
      )}
      {g.phase === "bet" && g.ready[me] && <p className="mg-note">{t("mpWaitOthers")}</p>}
      {myTurn && (
        <div className="mg-row">
          <button type="button" className="primary" onClick={() => send({ t: "act", a: { hit: true } })}>
            {t("mgHit")}
          </button>
          <button type="button" className="secondary" onClick={() => send({ t: "act", a: { stand: true } })}>
            {t("mgStand")}
          </button>
          <button type="button" className="secondary" disabled={g.hands[me]!.length !== 2 || g.bets[me]! > chips} onClick={double}>
            {t("mgDouble")}
          </button>
        </div>
      )}
      <p className="mg-note">
        🪙 {t("mgChips")} {chips} · {t("mpRound")} {g.round}
      </p>
    </div>
  );
}
