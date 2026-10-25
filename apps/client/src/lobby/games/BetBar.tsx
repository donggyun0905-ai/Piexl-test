// 칩 게임 공용: 가진 칩 · 거는 칩 고르기
import type { TextKey } from "../../i18n";

export const BETS = [10, 50, 100, 500];

export function BetBar({ t, chips, bet, setBet }: { t: (k: TextKey) => string; chips: number; bet: number; setBet: (n: number) => void }) {
  return (
    <div className="mg-bet">
      <span className="mg-chips">
        🪙 {t("mgChips")} <b>{chips}</b>
      </span>
      {BETS.map((b) => (
        <button key={b} type="button" className={b === bet ? "active" : ""} disabled={b > chips} onClick={() => setBet(b)}>
          {b}
        </button>
      ))}
    </div>
  );
}
