// 도트 편집 색 고르기: 지금 색 · 모든 색(색상 고르기 창) · 색 코드 · 팔레트 48색 · 최근 색 · 이 그림에 쓰인 색
import { useState } from "react";
import type { TextKey } from "../i18n";

/** 기본 팔레트 (밝기 단계별 여러 색) */
const PALETTE = [
  "#000000", "#1e1c2c", "#3a3446", "#4e4262", "#6a6680", "#9aa3b8", "#c8d0e0", "#ffffff",
  "#3a0a0a", "#7a1a1a", "#c8283a", "#ff5a5a", "#ff9a9a", "#ffd0d0", "#5a3010", "#8a5a2a",
  "#c8904a", "#e8c070", "#f6d2b0", "#ffe8d0", "#ff6a1a", "#ffb040", "#ffd860", "#fff0a0",
  "#1a3a1a", "#2a6a2a", "#3aa83a", "#7ae05a", "#c8f0a0", "#1a3a3a", "#2a8a8a", "#5ad8c8",
  "#0e1a3a", "#1e2c6a", "#3a5ab0", "#5a8af0", "#9ac8ff", "#d0e8ff", "#2a1a4a", "#5a3a8a",
  "#8a5ad0", "#c08aff", "#e0c8ff", "#5a1a3a", "#a83a6a", "#e86aa0", "#ffb0c8", "#ffe0ec",
];
const RECENT_KEY = "pixel-rogue:pixel-recent";

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function ColorPanel({ color, used, t, onPick }: { color: string; used: string[]; t: (k: TextKey) => string; onPick: (c: string) => void }) {
  const [recent, setRecent] = useState(loadRecent);
  const pick = (c: string) => {
    const v = c.toLowerCase();
    onPick(v);
    const next = [v, ...recent.filter((x) => x !== v)].slice(0, 16);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // 저장이 막힘
    }
  };
  const row = (label: TextKey, list: readonly string[]) =>
    list.length > 0 && (
      <div className="px-swatches">
        <small>{t(label)}</small>
        <div>
          {list.map((c) => (
            <button key={c} type="button" title={c} className={c === color ? "sw active" : "sw"} style={{ background: c }} onClick={() => pick(c)} />
          ))}
        </div>
      </div>
    );
  return (
    <div className="px-colors">
      <div className="px-color-now">
        <label className="px-big-swatch" style={{ background: color }} title={t("pxAllColors")}>
          <input type="color" value={color} onChange={(e) => pick(e.target.value)} />
        </label>
        <div>
          <label className="px-all-colors">
            🎨 {t("pxAllColors")}
            <input type="color" value={color} onChange={(e) => pick(e.target.value)} />
          </label>
          <label className="px-hex">
            {t("pxHex")}
            <input
              key={color}
              defaultValue={color}
              maxLength={7}
              spellCheck={false}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) pick(e.target.value);
              }}
            />
          </label>
        </div>
      </div>
      {row("pxRecent", recent)}
      {row("pxPalette", PALETTE)}
      {row("pxUsed", used)}
    </div>
  );
}
