// 게임 화면 위쪽 줄(일시정지 · 체력 · 정보 · 켜고 끄기 버튼)과 능력치 창
import { useState } from "react";
import type { RefObject } from "react";
import type { CharacterId } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { charGuide } from "../i18n/guides";
import { setSettings, useSettings } from "../settings";
import { CharKit } from "./CharKit";
import type { StatRow } from "./statsView";

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
  const { showStats, showHitbox, showRange } = useSettings();
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
      {!pvp && <Toggle {...toggle} on={showHitbox} label="hitboxToggle" keyName="H" onClick={() => setSettings({ showHitbox: !showHitbox })} />}
      {!manualOnly && <Toggle {...toggle} on={autoAim} label="autoAim" keyName="R" onClick={() => onAutoAim(!autoAim)} />}
    </div>
  );
}

/** 능력치 창 (C 키) · 아래에 지금 캐릭터 설명 (처음부터 펼쳐져 있고 버튼으로 접음) · 무기·전용 아이템 목록 (올리면 설명) */
export function StatsPanel({ rows, character, lang, t }: { rows: StatRow[]; character?: CharacterId; lang?: Lang; t?: (k: TextKey) => string }) {
  const [open, setOpen] = useState(true);
  const guide = character && lang ? charGuide(character, lang) : [];
  return (
    <div className="stats-panel">
      {rows.map((r) => (
        <div key={r.label} className="stats-row">
          <span>{r.label}</span>
          <span>{r.value}</span>
        </div>
      ))}
      {guide.length > 0 && t && (
        <>
          <button type="button" className="stats-guide-btn" onClick={() => setOpen(!open)}>
            {t(open ? "charGuideHide" : "charGuideShow")}
          </button>
          {open && (
            <ul className="stats-guide">
              {guide.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {character && lang && t && <CharKit character={character} lang={lang} t={t} />}
    </div>
  );
}
