// 칩 게임 공용: 가진 칩(쌓인 칩 더미) · 거는 칩 고르기(금액마다 색이 다른 카지노 칩)
import type { TextKey } from "../../i18n";

export const BETS = [10, 50, 100, 500];
/** 칩 색: 10 파랑 · 50 빨강 · 100 초록 · 500 보라 */
const CHIP_CLASS = ["c10", "c50", "c100", "c500"];

export function BetBar({ t, chips, bet, setBet }: { t: (k: TextKey) => string; chips: number; bet: number; setBet: (n: number) => void }) {
  // 가진 칩만큼 더미 높이 (최대 8개)
  const stack = Math.max(1, Math.min(8, Math.ceil(Math.log10(Math.max(10, chips)) * 2)));
  return (
    <div className="mg-bet">
      <span className="mg-chips">
        <span className="chip-stack" aria-hidden>
          {Array.from({ length: stack }, (_, i) => (
            <i key={i} className={`chip-disc ${CHIP_CLASS[i % 4]}`} style={{ bottom: i * 3 }} />
          ))}
        </span>
        <span>
          {t("mgChips")} <b>{chips.toLocaleString()}</b>
        </span>
      </span>
      {BETS.map((b, i) => (
        <button key={b} type="button" className={`chip ${CHIP_CLASS[i]}${b === bet ? " active" : ""}`} disabled={b > chips} onClick={() => setBet(b)}>
          <span>{b}</span>
        </button>
      ))}
    </div>
  );
}
