// 세계 지도 왼쪽 위 버튼 줄(투력·장비·캐릭터·지도·한눈에·조작키·아지트) · 장소 글 창(표지판·사람 말, Esc로 닫힘) — WorldMode에서 뗌
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { StoryFace } from "../story/StoryFace";
import type { Place } from "./worldPlaces";

type T = (k: TextKey) => string;

export function WorldHud({ t, power, home, onGear, onChar, onMap, onTab, onKeys, onHome }: { t: T; power: number; home: boolean; onGear: () => void; onChar: () => void; onMap: () => void; onTab: () => void; onKeys: () => void; onHome: () => void }) {
  return (
    <div className="world-hud">
      <span className="world-power">⚔ {t("wpPower").replace("{n}", power.toLocaleString())}</span>
      <button type="button" className="secondary" onClick={onGear}>
        🎒 {t("accGear")} · B
      </button>
      <button type="button" className="secondary" onClick={onChar}>
        👤 {t("wpChar")} · C
      </button>
      <button type="button" className="secondary" onClick={onMap}>
        🗺 {t("wmTitle")} · M
      </button>
      <button type="button" className="secondary" onClick={onTab}>
        📋 {t("tabOverview")} · Tab
      </button>
      <button type="button" className="secondary" onClick={onKeys}>
        🎮 {t("wkTitle")} · H
      </button>
      {home && (
        <button type="button" className="secondary" onClick={onHome}>
          🏠 {t("wpHome")}
        </button>
      )}
    </div>
  );
}

/** 장소 글: 사람이면 얼굴 · 글은 line 또는 이름 + Text */
export function WorldNote({ t, p, onClose }: { t: T; p: Place; onClose: () => void }) {
  useEffect(() => {
    // 이야기 장면의 Esc는 SceneView가 받음 · Space·Enter·F로도 넘김 (아무 데나 눌러도 닫힘)
    const esc = (e: KeyboardEvent) => {
      if (e.repeat || !(e.key === "Escape" || e.code === "Space" || e.code === "Enter" || e.code === "KeyF")) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal world-note" role="dialog" aria-modal="true" onClick={onClose}>
        <h3>
          {p.who && <StoryFace who={p.who} size={40} />}
          {t(p.name)}
        </h3>
        <p>{t(p.line ?? (`${p.name}Text` as TextKey))}</p>
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
