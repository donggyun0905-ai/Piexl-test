// 슬롯머신: 릴 3개. 셋 다 같으면 그림마다 배수, 체리는 2개 2배 · 1개 1배 (놀이용 칩만)
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips, loadChips } from "../chips";
import { BetBar } from "./BetBar";
import { WinFx } from "./WinFx";
import { randInt } from "./util";

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7"];
/** 릴마다 나올 무게 (흔한 것부터) */
const WEIGHT = [6, 5, 4, 3, 2, 1];
const TRIPLE = [5, 8, 12, 20, 40, 77];

function spinOne(): number {
  let r = randInt(1, WEIGHT.reduce((a, b) => a + b, 0));
  for (let i = 0; i < WEIGHT.length; i++) {
    r -= WEIGHT[i]!;
    if (r <= 0) return i;
  }
  return 0;
}

function payout(reels: number[]): number {
  if (reels[0] === reels[1] && reels[1] === reels[2]) return TRIPLE[reels[0]!]!;
  const cherries = reels.filter((x) => x === 0).length;
  return cherries === 2 ? 2 : cherries === 1 ? 1 : 0;
}

export function Slots({ t }: { t: (k: TextKey) => string }) {
  const [chips, setChips] = useState(loadChips);
  const [bet, setBet] = useState(10);
  const [fx, setFx] = useState({ n: 0, k: 0 });
  const celebrate = (n: number) => setFx((f) => ({ n, k: f.k + 1 }));
  const [reels, setReels] = useState([5, 5, 5]);
  const [spinning, setSpinning] = useState(0);
  const [win, setWin] = useState<number | null>(null);

  /** 돌아가는 동안 그림이 빠르게 바뀌다가 왼쪽부터 하나씩 멈춤 (결과는 처음에 정함) */
  const spin = () => {
    if (spinning || bet > chips) return;
    setChips(addChips(-bet));
    setWin(null);
    const fin = [spinOne(), spinOne(), spinOne()];
    let stopped = 0;
    setSpinning(3);
    const id = window.setInterval(() => setReels((r) => r.map((v, i) => (i >= stopped ? randInt(0, 5) : v))), 70);
    for (let k = 1; k <= 3; k++) {
      window.setTimeout(() => {
        stopped = k;
        setReels((r) => r.map((v, i) => (i < k ? fin[i]! : v)));
        setSpinning(3 - k);
        if (k < 3) return;
        window.clearInterval(id);
        const got = payout(fin) * bet;
        setWin(got);
        setChips(addChips(got));
        celebrate(got);
      }, 450 * k);
    }
  };

  const jackpot = win !== null && win > 0 && reels.every((r) => r === 5);
  return (
    <div className="mg slots">
      <WinFx key={fx.k} amount={fx.n} bet={bet} t={t} />
      <BetBar t={t} chips={chips} bet={bet} setBet={setBet} />
      <div className={`slot-machine${spinning ? " running" : ""}${win ? " won" : ""}${jackpot ? " jackpot" : ""}`}>
        <div className="slot-marquee">
          <Bulbs from={0} />
          <b>7 7 7</b>
          <Bulbs from={7} />
        </div>
        <div className="slot-window">
          {reels.map((r, i) => {
            const spin = spinning > 0 && i >= 3 - spinning;
            return (
              <div key={i} className={`reel-col${spin ? " spin" : ""}`}>
                {[-1, 0, 1].map((d) => {
                  const s = (r + d + SYMBOLS.length) % SYMBOLS.length;
                  return (
                    <span key={d} className={`reel-sym${d === 0 ? " mid" : ""}${SYMBOLS[s] === "7" ? " seven" : ""}`}>
                      {SYMBOLS[s]}
                    </span>
                  );
                })}
              </div>
            );
          })}
          <i className="payline" />
        </div>
        <button type="button" className={`slot-lever${spinning ? " pulled" : ""}`} disabled={spinning > 0 || bet > chips} onClick={spin} aria-label={t("mgSpin")}>
          <i />
        </button>
      </div>
      <button type="button" className="primary big slot-spin" disabled={spinning > 0 || bet > chips} onClick={spin}>
        {t("mgSpin")}
      </button>
      {win !== null && <strong className={`mg-result ${win > 0 ? "win" : "lose"}`}>{win > 0 ? `+${win}` : t("mgMiss")}</strong>}
      <div className="slot-pay" aria-label={t("mgPaytable")}>
        {SYMBOLS.map((s, i) => (
          <span key={s} className={s === "7" ? "seven" : ""}>
            <b>{`${s}${s}${s}`}</b> ×{TRIPLE[i]}
          </span>
        ))}
        <span>
          <b>🍒🍒</b> ×2
        </span>
        <span>
          <b>🍒</b> ×1
        </span>
      </div>
      <p className="mg-note">{t("mgChipNote")}</p>
    </div>
  );
}

/** 간판 전구 한 줄 (7개, 번갈아 깜빡임) */
function Bulbs({ from }: { from: number }) {
  return (
    <span className="bulbs">
      {Array.from({ length: 7 }, (_, i) => (
        <i key={i} className="bulb" style={{ animationDelay: `${((from + i) % 2) * 0.35 + (from + i) * 0.04}s` }} />
      ))}
    </span>
  );
}
