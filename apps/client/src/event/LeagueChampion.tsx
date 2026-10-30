// 월드 워 리그 우승 화면 (우리 팀이 우승하면 화면 전체): 빛살 · 터지는 불꽃 · 흩날리는 색종이 · 큰 팀 마크와 트로피 · '우승을 축하드립니다!' · 누르거나 Esc로 닫음
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { TeamEmblem } from "./TeamEmblem";

const CONFETTI = ["#ffd860", "#ff6a6a", "#6ac8ff", "#8aff9a", "#e08aff", "#ffffff"];

export function LeagueChampion({ t, onClose }: { t: (k: TextKey) => string; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="lc" role="dialog" aria-label={t("pwLeagueCongrats")} onClick={onClose}>
      <div className="lc-rays" aria-hidden="true" />
      {/* 불꽃: 자리·때를 정해 둔 여덟 개 */}
      {Array.from({ length: 8 }, (_, k) => (
        <span key={`f${k}`} className="lc-firework" style={{ left: `${10 + ((k * 37) % 80)}%`, top: `${12 + ((k * 23) % 45)}%`, animationDelay: `${(k * 0.37) % 2.4}s`, color: CONFETTI[k % CONFETTI.length] }} />
      ))}
      {/* 색종이 */}
      {Array.from({ length: 60 }, (_, k) => (
        <i key={`c${k}`} className="lc-confetti" style={{ left: `${(k * 61) % 100}%`, background: CONFETTI[k % CONFETTI.length], animationDelay: `${((k * 0.13) % 3).toFixed(2)}s`, animationDuration: `${2.6 + ((k * 7) % 10) / 5}s` }} />
      ))}
      <div className="lc-body">
        <div className="lc-crest">
          <TeamEmblem name="mine" size={140} />
          <span className="lc-cup" aria-hidden="true">
            🏆
          </span>
        </div>
        <h2 className="lc-title">{t("pwLeagueCongrats")}</h2>
        <p className="lc-sub">{t("pwLeagueWin")}</p>
        <small className="lc-close">{t("pwLeagueTapClose")}</small>
      </div>
    </div>
  );
}
