// 블랙잭 (딜러와 1:1, 놀이용 칩): 합을 21에 가깝게. A는 1 또는 11, J·Q·K는 10. 21을 넘으면 짐.
// 딜러는 17 이상이 될 때까지 받음. 처음 두 장이 21(블랙잭)이면 2.5배, 이기면 2배, 비기면 돌려받음
import { bjTotal, cardRank, cardSuit, isBlackjack, type BjResult } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips, loadChips } from "../chips";
import { BetBar } from "./BetBar";
import { WinFx } from "./WinFx";
import { PlayingCard } from "./PlayingCard";
import { shuffle } from "./util";

const DEALER_STOP = 17;

/** 카드 = 0~51 (무늬 · 숫자) */
const newDeck = () => shuffle(Array.from({ length: 52 }, (_, i) => i));
const total = bjTotal;
type Result = BjResult;

export function Blackjack({ t }: { t: (k: TextKey) => string }) {
  const [chips, setChips] = useState(loadChips);
  const [bet, setBet] = useState(10);
  const [fx, setFx] = useState({ n: 0, k: 0 });
  const celebrate = (n: number) => setFx((f) => ({ n, k: f.k + 1 }));
  const [deck, setDeck] = useState<number[]>([]);
  const [me, setMe] = useState<number[]>([]);
  const [dealer, setDealer] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const playing = me.length > 0 && result === null;

  const settle = (r: Result, d: number[]) => {
    setDealer(d);
    setResult(r);
    const back = r === "blackjack" ? Math.floor(bet * 2.5) : r === "win" ? bet * 2 : r === "push" ? bet : 0;
    setChips(addChips(back));
    if (r === "win" || r === "blackjack") celebrate(back);
  };
  const deal = () => {
    if (bet > chips) return;
    setChips(addChips(-bet));
    const d = newDeck();
    const m = [d.pop()!, d.pop()!];
    const dl = [d.pop()!, d.pop()!];
    setDeck(d);
    setMe(m);
    setDealer(dl);
    setResult(null);
    if (isBlackjack(m)) settle(isBlackjack(dl) ? "push" : "blackjack", dl);
  };
  const hit = () => {
    const d = [...deck];
    const m = [...me, d.pop()!];
    setDeck(d);
    setMe(m);
    if (total(m) > 21) settle("bust", dealer);
    else if (total(m) === 21) stand(m, d);
  };
  const stand = (m = me, d = [...deck]) => {
    const dl = [...dealer];
    while (total(dl) < DEALER_STOP) dl.push(d.pop()!);
    setDeck(d);
    const a = total(m);
    const b = total(dl);
    settle(b > 21 || a > b ? "win" : a < b ? "lose" : "push", dl);
  };
  /** 두 배 걸고 한 장만 더 */
  const double = () => {
    if (bet > chips) return;
    setChips(addChips(-bet));
    setBet(bet * 2);
    const d = [...deck];
    const m = [...me, d.pop()!];
    setMe(m);
    if (total(m) > 21) settle("bust", dealer);
    else stand(m, d);
  };

  return (
    <div className="mg blackjack">
      <WinFx key={fx.k} amount={fx.n} bet={bet} t={t} />
      <BetBar t={t} chips={chips} bet={bet} setBet={setBet} />
      {me.length > 0 && (
        <>
          <Row label={`${t("mgDealer")} ${result ? total(dealer) : ""}`} cards={dealer} hideFrom={result ? 99 : 1} />
          <Row label={`${t("mgMe")} ${total(me)}`} cards={me} />
        </>
      )}
      {playing ? (
        <div className="mg-row">
          <button type="button" className="primary" onClick={hit}>
            {t("mgHit")}
          </button>
          <button type="button" className="secondary" onClick={() => stand()}>
            {t("mgStand")}
          </button>
          <button type="button" className="secondary" disabled={me.length !== 2 || bet > chips} onClick={double}>
            {t("mgDouble")}
          </button>
        </div>
      ) : (
        <div className="mg-row">
          {result && <strong className={`mg-result ${result === "win" || result === "blackjack" ? "win" : result === "push" ? "" : "lose"}`}>{t(RESULT_TEXT[result])}</strong>}
          <button type="button" className="primary" disabled={bet > chips} onClick={deal}>
            {t("mgDeal")}
          </button>
        </div>
      )}
      <p className="mg-note">{t("mgBlackjackRule")}</p>
      <p className="mg-note">{t("mgChipNote")}</p>
    </div>
  );
}

export const RESULT_TEXT: Record<Result, TextKey> = { blackjack: "mgBlackjackWin", win: "mgWin", lose: "mgLose", push: "mgDraw", bust: "mgBust" };

/** 카드 줄 (hideFrom 번째부터 뒷면) */
export function Row({ label, cards, hideFrom = 99 }: { label: string; cards: number[]; hideFrom?: number }) {
  return (
    <div className="mg-hand">
      <span>{label}</span>
      {cards.map((c, i) => (
        <PlayingCard key={i} rank={cardRank(c)} suit={cardSuit(c)} back={i >= hideFrom} />
      ))}
    </div>
  );
}
