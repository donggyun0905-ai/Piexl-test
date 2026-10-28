// 주사위 대소: 주사위 3개 합. 소(4~10)·대(11~17)·홀·짝은 2배, 세 개가 같으면(트리플) 31배 (트리플이면 대소·홀짝은 짐)
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips, loadChips } from "../chips";
import { BetBar } from "./BetBar";
import { randInt } from "./util";

type Pick = "small" | "big" | "odd" | "even" | "triple";
const PAY: Record<Pick, number> = { small: 2, big: 2, odd: 2, even: 2, triple: 31 };
const LABEL: Record<Pick, TextKey> = { small: "mgSmall", big: "mgBig", odd: "mgOdd", even: "mgEven", triple: "mgTriple" };
/** 눈마다 점 자리 (3×3 칸 번호 0~8) */
const PIPS = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];

function wins(p: Pick, d: number[]): boolean {
  const s = d[0]! + d[1]! + d[2]!;
  const triple = d[0] === d[1] && d[1] === d[2];
  if (p === "triple") return triple;
  if (triple) return false;
  if (p === "small") return s <= 10;
  if (p === "big") return s >= 11;
  return p === "odd" ? s % 2 === 1 : s % 2 === 0;
}

export function DiceGame({ t }: { t: (k: TextKey) => string }) {
  const [chips, setChips] = useState(loadChips);
  const [bet, setBet] = useState(10);
  const [dice, setDice] = useState([1, 2, 3]);
  const [rolling, setRolling] = useState(false);
  const [res, setRes] = useState<number | null>(null);

  const roll = (p: Pick) => {
    if (rolling || bet > chips) return;
    setChips(addChips(-bet));
    setRolling(true);
    setRes(null);
    let n = 0;
    const id = window.setInterval(() => {
      const d = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
      setDice(d);
      if (++n < 10) return;
      window.clearInterval(id);
      setRolling(false);
      const got = wins(p, d) ? bet * PAY[p] : 0;
      setRes(got);
      setChips(addChips(got));
    }, 80);
  };

  return (
    <div className="mg dice">
      <BetBar t={t} chips={chips} bet={bet} setBet={setBet} />
      <div className={`dice-row${rolling ? " rolling" : ""}`}>
        {dice.map((d, i) => (
          <span key={`${i}-${d}`} className={`die${d === 1 ? " one" : ""}`}>
            {Array.from({ length: 9 }, (_, k) => (
              <i key={k} className={PIPS[d - 1]!.includes(k) ? "pip" : ""} />
            ))}
          </span>
        ))}
        <span className="dice-sum">{dice[0]! + dice[1]! + dice[2]!}</span>
      </div>
      <div className="mg-row">
        {(Object.keys(PAY) as Pick[]).map((p) => (
          <button key={p} type="button" className="secondary" disabled={rolling || bet > chips} onClick={() => roll(p)}>
            {t(LABEL[p])} ×{PAY[p]}
          </button>
        ))}
      </div>
      {res !== null && <strong className={`mg-result ${res > 0 ? "win" : "lose"}`}>{res > 0 ? `+${res}` : t("mgMiss")}</strong>}
      <p className="mg-note">{t("mgChipNote")}</p>
    </div>
  );
}
