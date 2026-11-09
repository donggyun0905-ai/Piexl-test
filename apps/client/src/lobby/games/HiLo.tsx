// 하이로우: 다음 카드(1~13)가 지금보다 높을지 낮을지. 맞히면 판돈이 1.5배씩 커지고, 언제든 챙기기. 틀리면 판돈을 잃음 (같으면 그대로)
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips, loadChips } from "../chips";
import { BetBar } from "./BetBar";
import { WinFx } from "./WinFx";
import { PlayingCard } from "./PlayingCard";
import { randInt } from "./util";

const STEP = 1.5;

export function HiLo({ t }: { t: (k: TextKey) => string }) {
  const [chips, setChips] = useState(loadChips);
  const [bet, setBet] = useState(10);
  const [fx, setFx] = useState({ n: 0, k: 0 });
  const celebrate = (n: number) => setFx((f) => ({ n, k: f.k + 1 }));
  const [card, setCard] = useState(7);
  // 무늬는 꾸밈 (숫자만 셈) · 지난 카드 몇 장
  const [suit, setSuit] = useState(0);
  const [trail, setTrail] = useState<number[]>([]);
  const [pot, setPot] = useState(0);
  const [streak, setStreak] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  const start = () => {
    if (bet > chips) return;
    setChips(addChips(-bet));
    setPot(bet);
    setStreak(0);
    setCard(randInt(1, 13));
    setSuit(randInt(0, 3));
    setTrail([]);
    setMsg(null);
  };
  const guess = (high: boolean) => {
    const next = randInt(1, 13);
    setTrail((l) => [...l, card].slice(-6));
    setCard(next);
    setSuit(randInt(0, 3));
    if (next === card) return setMsg(t("mgSame"));
    if (next > card === high) {
      setPot(Math.floor(pot * STEP));
      setStreak(streak + 1);
      setMsg(null);
    } else {
      setPot(0);
      setMsg(t("mgMiss"));
    }
  };
  const cash = () => {
    setChips(addChips(pot));
    if (pot > bet) celebrate(pot);
    setMsg(`+${pot}`);
    setPot(0);
  };

  return (
    <div className="mg hilo">
      <WinFx key={fx.k} amount={fx.n} bet={bet} t={t} />
      <BetBar t={t} chips={chips} bet={bet} setBet={setBet} />
      <div className="hilo-card">
        {trail.length > 0 && (
          <span className="hilo-trail">
            {trail.map((c, i) => (
              <b key={i}>{c === 1 ? "A" : c > 10 ? "JQK"[c - 11] : c}</b>
            ))}
          </span>
        )}
        <PlayingCard rank={card - 1} suit={suit} big />
      </div>
      {pot > 0 ? (
        <>
          <p className="mg-sum">
            {t("mgPot")} <b>{pot}</b> · {t("mgStreak")} {streak}
          </p>
          <div className="mg-row">
            <button type="button" className="primary" disabled={card === 13} onClick={() => guess(true)}>
              ▲ {t("mgHigh")}
            </button>
            <button type="button" className="primary" disabled={card === 1} onClick={() => guess(false)}>
              ▼ {t("mgLow")}
            </button>
            <button type="button" className="secondary" onClick={cash}>
              💰 {t("mgCash")}
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="primary big" disabled={bet > chips} onClick={start}>
          {t("mgDeal")}
        </button>
      )}
      {msg && <strong className={`mg-result ${msg.startsWith("+") ? "win" : "lose"}`}>{msg}</strong>}
      <p className="mg-note">{t("mgChipNote")}</p>
    </div>
  );
}
