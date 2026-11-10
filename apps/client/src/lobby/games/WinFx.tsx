// 이겼을 때 효과 (칩 게임 공용): 위에서 동전·색종이가 쏟아지고, 크게 이기면 가운데 큰 글자 (key를 바꾸면 다시 나옴)
import type { TextKey } from "../../i18n";

const COLORS = ["#ffd860", "#ff8ab0", "#6ae0ff", "#9ae86a", "#ffffff", "#c89aff"];

/** 꾸밈용 흩뿌림 (게임 결과와 상관없음, 같은 모양이 되도록 번호로 정함) */
const spread = (i: number, k: number) => ((i * 9301 + k * 49297) % 233280) / 233280;

export function WinFx({ amount, bet, t }: { amount: number; bet: number; t: (k: TextKey) => string }) {
  if (amount <= 0) return null;
  const mult = amount / Math.max(1, bet);
  const n = Math.min(60, 14 + Math.round(mult * 4));
  const label = mult >= 20 ? t("mgJackpot") : mult >= 5 ? t("mgBigWin") : null;
  return (
    <div className={`win-fx${label ? " big" : ""}`} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const coin = i % 3 !== 0;
        const style = {
          left: `${spread(i, 1) * 100}%`,
          animationDelay: `${spread(i, 2) * 0.6}s`,
          animationDuration: `${1.1 + spread(i, 3) * 0.9}s`,
          "--spin": `${360 + spread(i, 4) * 720}deg`,
          "--drift": `${(spread(i, 5) - 0.5) * 80}px`,
          background: coin ? undefined : COLORS[i % COLORS.length],
        } as React.CSSProperties;
        return <i key={i} className={coin ? "fx-coin" : "fx-confetti"} style={style} />;
      })}
      {label && <strong className="win-banner">{label}</strong>}
    </div>
  );
}
