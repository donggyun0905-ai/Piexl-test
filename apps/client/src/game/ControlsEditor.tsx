// 설정 → 조작키 바꾸기: 모바일 버튼을 끌어서 옮기고, 버튼·조이스틱 크기를 고름 (이 기기에 저장)
import { useRef, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { Lang, TextKey } from "../i18n";
import { getSettings, setSettings, useSettings, type Settings, type TouchButtonId } from "../settings";
import { TouchButtons } from "./TouchButtons";

interface Props {
  lang: Lang;
  t: (key: TextKey) => string;
  onClose: () => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** 버튼을 누른 손가락을 따라 옮김 (화면 밖으로는 못 나감). 옮긴 거리는 화면 비율로 저장 */
function startDrag(e: PointerEvent<HTMLButtonElement>): void {
  e.preventDefault();
  const el = e.currentTarget;
  const id = el.dataset.act as TouchButtonId;
  const rect = el.getBoundingClientRect();
  const [x0, y0] = getSettings().buttonPos[id] ?? [0, 0];
  const { clientX: sx, clientY: sy, pointerId } = e;
  const w = window.innerWidth;
  const h = window.innerHeight;
  el.setPointerCapture(pointerId);
  el.classList.add("pressed");
  const move = (ev: globalThis.PointerEvent) => {
    if (ev.pointerId !== pointerId) return;
    const dx = clamp(ev.clientX - sx, -rect.left, w - rect.right);
    const dy = clamp(ev.clientY - sy, -rect.top, h - rect.bottom);
    setSettings({ buttonPos: { ...getSettings().buttonPos, [id]: [x0 + dx / w, y0 + dy / h] } });
  };
  const end = (ev: globalThis.PointerEvent) => {
    if (ev.pointerId !== pointerId) return;
    el.classList.remove("pressed");
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", end);
    el.removeEventListener("pointercancel", end);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
}

export function ControlsEditor({ lang, t, onClose }: Props) {
  const s = useSettings();
  const dashRef = useRef<HTMLButtonElement>(null);
  const size = (key: "buttonScale" | "stickScale", label: TextKey, min: number) => (
    <label className="setting-row">
      <span>{t(label)}</span>
      <input
        type="range"
        min={min}
        max={150}
        step={5}
        value={Math.round(s[key] * 100)}
        onChange={(e) => setSettings({ [key]: Number(e.target.value) / 100 } as Partial<Settings>)}
      />
      <small>{Math.round(s[key] * 100)}%</small>
    </label>
  );
  // 설정 창 위에 화면 전체로 (창 안의 클릭이 바깥 닫기로 번지지 않게 막음)
  return createPortal(
    <div className="controls-editor" onClick={(e) => e.stopPropagation()}>
      <div className="controls-editor-panel">
        <p>{t("editControlsHint")}</p>
        {size("buttonScale", "buttonSize", 60)}
        {size("stickScale", "stickSize", 70)}
        <div className="controls-editor-actions">
          <button type="button" className="ghost" onClick={() => setSettings({ buttonScale: 1, stickScale: 1, buttonPos: {} })}>
            {t("resetControls")}
          </button>
          <button type="button" onClick={onClose}>
            {t("done")}
          </button>
        </div>
      </div>
      {/* 조이스틱 크기 미리 보기 (실제로는 왼쪽 아무 곳이나 누른 자리에 생김) */}
      <div className="stick-base controls-editor-stick" />
      <div className="stick-knob controls-editor-stick" />
      <TouchButtons slots={[null, null]} lang={lang} t={t} controls={() => null} interact={t("interactSample")} dashRef={dashRef} editing={startDrag} />
    </div>,
    document.body,
  );
}
