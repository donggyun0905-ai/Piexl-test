import type { CharacterId, ScoreBreakdown } from "@pixel-rogue/shared";
import { charArtSrc } from "../select/charArt";
import { SettingsPanel } from "../SettingsPanel";
import { useState, type ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import { achievementName, achievementUnlock } from "../i18n/achievements";
import { shareUrl } from "../records";
import { RunSummary } from "./RunSummary";
import { DeathRecap, type HurtData } from "./DeathRecap";
import type { RunSummaryData } from "./runSummary";

/** 게임 위에 뜨는 창. 혼자 하기에서는 창이 떠 있는 동안 게임이 멈춤 */
/** info: 로그 캐릭터 설명 큰 창 (GameHud.StatsPanel이 그림, 게임은 멈춤) */
export type Overlay = "none" | "pause" | "exit" | "info" | "rooms";
/** 설명 큰 창 (캐릭터 설명 · 방 설명) */
export const isInfo = (o: Overlay) => o === "info" || o === "rooms";

export interface Result {
  won: boolean;
  floor: number;
  kills: number;
  ticks: number;
  score: ScoreBreakdown;
  /** 이 기기 최고 기록 (혼자 하기) */
  newBest: boolean;
  /** 이번 판에 달성한 업적 */
  achievements: string[];
  /** 레이드 아레나: 깬 레벨 */
  arenaLevel?: number;
  /** 한 판 요약 */
  summary?: RunSummaryData;
  /** 쓰러졌을 때 받은 피해 정리 (sim/hurtLog) */
  hurt?: HurtData;
}

interface Props {
  overlay: Overlay;
  result: Result | null;
  time: string;
  /** 혼자 하기 시드 (다른 모드는 빈 글자) */
  seedText: string;
  lang: Lang;
  t: (key: TextKey) => string;
  onClose: () => void;
  onExit: () => void;
  onRetry?: (sameSeed: boolean) => void;
  /** 결과 창에 덧붙일 내용 (일일 도전 순위 등) */
  extra?: ReactNode;
  /** 멈추지 않는 판(협동·레이드): 일시정지 대신 '설정' 창 */
  live?: boolean;
  /** 결과 창 옆에 크게 띄울 캐릭터 일러스트 */
  character?: CharacterId;
}

/** 시드 표시 + 공유 (모바일은 공유 창, PC는 주소 복사) */
export function SeedLine({ seedText, t }: { seedText: string; t: (key: TextKey) => string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = shareUrl(seedText);
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: "Pixel Toybox", text: `${t("seed")} ${seedText}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 공유 취소·권한 없음은 무시
    }
  };
  return (
    <p className="seed-line">
      {t("seed")} <code>{seedText}</code>
      <button type="button" className="small" onClick={share}>
        {copied ? t("copied") : t("share")}
      </button>
    </p>
  );
}

/** 일시정지 · 나가기 확인 · 결과 창 */
export function GameOverlays({ overlay, result, time, seedText, lang, t, onClose, onExit, onRetry, extra, live, character }: Props) {
  if (result) {
    const s = result.score;
    const art = character ? charArtSrc(character) : null;
    return (
      <div className={`game-overlay${art ? " result-with-art" : ""}`}>
        {art && <img className={`result-art${result.won ? " won" : " lost"}`} src={art} alt="" draggable={false} />}
        <div className="modal">
          <h2>{t(result.won ? "cleared" : "defeated")}</h2>
          {/* 깼으면 걸린 시간을 크게 */}
          {result.won && (
            <p className="clear-time">
              ⏱ {t("clearTime")} <strong>{time}</strong>
            </p>
          )}
          <p className="result-line">
            {result.arenaLevel !== undefined ? `${t("arenaRun")} Lv ${result.arenaLevel}` : `${t("floor")} ${result.floor}`} · {t("kills")} {result.kills} · {t("time")} {time}
          </p>
          <p className="score-total">
            {t("score")} <strong>{s.total.toLocaleString()}</strong>
            {result.newBest && <span className="new-best"> {t("newBest")}</span>}
          </p>
          <p className="score-parts">
            {t("floor")} {s.floor} · {t("kills")} {s.kills} · {t("bosses")} {s.bosses}
            {s.clear > 0 && ` · ${t("clearBonus")} ${s.clear} · ${t("timeBonus")} ${s.time}`}
          </p>
          {result.achievements.length > 0 && (
            <ul className="result-achievements">
              {result.achievements.map((id) => (
                <li key={id}>
                  ★ {achievementName(id, lang)}
                  {achievementUnlock(id, lang) && <small> {achievementUnlock(id, lang)}</small>}
                </li>
              ))}
            </ul>
          )}
          {result.hurt && <DeathRecap d={result.hurt} t={t} lang={lang} />}
          {result.summary && <RunSummary d={result.summary} t={t} lang={lang} />}
          {extra}
          {seedText && <SeedLine seedText={seedText} t={t} />}
          <div className="modal-actions">
            <button type="button" onClick={onExit}>
              {t("toTitle")}
            </button>
            {onRetry && (
              <button type="button" onClick={() => onRetry(false)}>
                {t("retry")}
              </button>
            )}
          </div>
          {onRetry && seedText && (
            <button type="button" className="secondary wide" onClick={() => onRetry(true)}>
              {t("retrySameSeed")}
            </button>
          )}
        </div>
      </div>
    );
  }
  if (overlay === "pause") {
    return (
      <div className="game-overlay">
        <div className="modal">
          <h2>{t(live ? "settings" : "paused")}</h2>
          {seedText && <SeedLine seedText={seedText} t={t} />}
          <SettingsPanel lang={lang} t={t} />
          <button type="button" onClick={onClose}>
            {t("resume")}
          </button>
        </div>
      </div>
    );
  }
  if (overlay === "exit") {
    return (
      <div className="game-overlay">
        <div className="modal" role="alertdialog" aria-label={t("exitConfirm")}>
          <h2>{t("exitConfirm")}</h2>
          {seedText && <p className="result-line">{t("exitSaved")}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              {t("no")}
            </button>
            <button type="button" className="danger" onClick={onExit}>
              {t("yes")}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
