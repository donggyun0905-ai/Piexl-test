// 게임 화면 위쪽 줄(일시정지 · 체력 · 정보 · 켜고 끄기 버튼)과 능력치 창 · 넓게 보는 대결의 확대·끌어 보기 설명(PanHint)
import { lazy, Suspense, useEffect, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import type { CharacterId, RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { setSettings, useSettings } from "../settings";
import { resetPan, usePan } from "./cameraPan";
import { BuffPanel } from "./BuffPanel";
import type { StatRow } from "./statsView";
import type { Controls } from "./controls";
import type { GameScreenProps } from "./gameScreenProps";

// 큰 창은 처음 열 때 불러옴 (안에 연습장 GameScreen이 있어 서로 부르는 고리를 피함)
const CharInfo = lazy(() => import("./CharInfo"));

interface Props {
  t: (key: TextKey) => string;
  touchMode: boolean;
  autoAim: boolean;
  /** 패왕전: 자동 공격 버튼 없음 */
  manualOnly?: boolean;
  /** 패왕전: 필요 없는 정보·버튼 숨김 */
  pvp?: boolean;
  onPause: (() => void) | null;
  onAutoAim: (on: boolean) => void;
  hpFillRef: RefObject<HTMLDivElement | null>;
  hpTextRef: RefObject<HTMLSpanElement | null>;
  infoRef: RefObject<HTMLSpanElement | null>;
}

function Toggle({ on, label, keyName, touchMode, t, onClick }: { on: boolean; label: TextKey; keyName: string; touchMode: boolean; t: (key: TextKey) => string; onClick: () => void }) {
  return (
    <button type="button" className={`hud-btn ${on ? "on" : ""}`} onClick={onClick}>
      {t(label)} {on ? t("on") : t("off")}
      {!touchMode && <small> ({keyName})</small>}
    </button>
  );
}

export function GameHud({ t, touchMode, autoAim, manualOnly, pvp, onPause, onAutoAim, hpFillRef, hpTextRef, infoRef }: Props) {
  const { showStats, showHitbox, showRange, showNames } = useSettings();
  const toggle = { touchMode, t };
  return (
    <div className="hud">
      {onPause && (
        <button type="button" className="hud-btn" aria-label={t("pause")} onClick={onPause}>
          II
        </button>
      )}
      <div className="hp">
        <div className="hp-bar">
          <div ref={hpFillRef} className="hp-fill" />
        </div>
        <span ref={hpTextRef} className="hp-text" />
      </div>
      {/* 패왕전: 위쪽 정보 줄·능력치·맞는 범위 버튼은 숨김 (공격 범위만) */}
      <span ref={infoRef} className="hud-info" hidden={pvp} />
      {!pvp && <Toggle {...toggle} on={showStats} label="statsToggle" keyName="C" onClick={() => setSettings({ showStats: !showStats })} />}
      <Toggle {...toggle} on={showRange} label="rangeToggle" keyName="G" onClick={() => setSettings({ showRange: !showRange })} />
      {pvp && <Toggle {...toggle} on={showNames} label="namesToggle" keyName="N" onClick={() => setSettings({ showNames: !showNames })} />}
      {!pvp && <Toggle {...toggle} on={showHitbox} label="hitboxToggle" keyName="H" onClick={() => setSettings({ showHitbox: !showHitbox })} />}
      {!manualOnly && <Toggle {...toggle} on={autoAim} label="autoAim" keyName="R" onClick={() => onAutoAim(!autoAim)} />}
    </div>
  );
}

/** 로그 왼쪽 칸: 능력치 · '캐릭터 설명' 버튼(누르면 게임을 멈추고 큰 창 CharInfoHost) · 버프 창. 칸 너비는 화면 여백(--side)에 맞춤 (screenHooks) */
export function StatsPanel({ rows, t, onInfo, run }: { rows: StatRow[]; t?: (k: TextKey) => string; onInfo?: () => void; run?: () => RunState | null }) {
  return (
    <div className="stats-panel">
      {rows.map((r) => (
        <div key={r.label} className="stats-row">
          <span>{r.label}</span>
          <span>{r.value}</span>
        </div>
      ))}
      {t && onInfo && (
        <button type="button" className="stats-guide-btn" onClick={onInfo}>
          {t("ciOpen")}
        </button>
      )}
      {run && t && <BuffPanel run={run} t={t} />}
    </div>
  );
}

/** 캐릭터 설명 큰 창 (I 키로 열고 닫음). 능력치 칸과 따로 있어 연습장에서 능력치를 꺼도 창·일시정지가 꼬이지 않음 */
export function CharInfoHost({ character, lang, t, open, onInfo }: { character: CharacterId; lang: Lang; t: (k: TextKey) => string; open: boolean; onInfo: (on: boolean) => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.code === "KeyI" && !e.repeat && el?.tagName !== "INPUT" && el?.tagName !== "TEXTAREA") onInfo(!open);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onInfo]);
  if (!open) return null;
  return createPortal(
    <Suspense fallback={null}>
      <CharInfo character={character} lang={lang} t={t} onClose={() => onInfo(false)} />
    </Suspense>,
    document.body,
  );
}

/** 바깥 화면이 넘겨준 조작 쪽 그림 (패왕전 HUD 등) */
export const WithControls = ({ render, controls }: { render: NonNullable<GameScreenProps["withControls"]>; controls: () => Controls | null }) => render(controls);

/** 확대·끌어 보기 설명이 보이는 시간 (ms) */
const HINT_MS = 15000;

/** 넓게 보는 대결(패왕전 모든 대결) 왼쪽 아래: 판 시작 뒤 잠깐 확대·끌어 보기 설명 · 화면을 옮겼으면 '내 캐릭터로' 버튼 */
export function PanHint({ t, touchMode }: { t: (k: TextKey) => string; touchMode: boolean }) {
  const [on, panned] = usePan();
  const [hint, setHint] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setHint(false), HINT_MS);
    return () => clearTimeout(id);
  }, []);
  if (!on) return null;
  if (panned)
    return (
      <button type="button" className="pan-hint pan-back" onClick={resetPan}>
        {t("panBack")}
      </button>
    );
  return hint ? <p className="pan-hint">{t(touchMode ? "panHintTouch" : "panHintPc")}</p> : null;
}
