// 타워 디펜스: 화면 위에 떠 있는 작은 창 (머리를 끌어 옮김 · 접기). 타워마다 실시간 준 피해(전체 중 비율 막대)·처치·체력
// TdGame이 0.12초마다 다시 그려서 실시간으로 바뀜. 창 자리는 이 기기에만 기억
import type { TdState } from "@pixel-rogue/shared";
import { useRef, useState } from "react";
import type { TextKey } from "../i18n";

const POS_KEY = "td-stats-pos";

function loadPos(): { x: number; y: number } {
  try {
    const v = JSON.parse(localStorage.getItem(POS_KEY) ?? "null") as { x: number; y: number } | null;
    if (v && Number.isFinite(v.x) && Number.isFinite(v.y)) return v;
  } catch {
    // 저장소를 못 쓰면 기본 자리
  }
  return { x: 12, y: 64 };
}

const short = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(Math.round(n)));

export function TdStats({ td, t }: { td: TdState; t: (k: TextKey) => string }) {
  const [pos, setPos] = useState(loadPos);
  const [folded, setFolded] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const towers = [...td.towers].sort((a, b) => b.dmg - a.dmg);
  const total = towers.reduce((s, w) => s + w.dmg, 0) || 1;
  const move = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const x = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - drag.current.dx));
    const y = Math.max(0, Math.min(window.innerHeight - 30, e.clientY - drag.current.dy));
    setPos({ x, y });
  };
  const end = () => {
    drag.current = null;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(pos));
    } catch {
      // 기억 못 해도 괜찮음
    }
  };
  return (
    <div className="td-stats" style={{ left: pos.x, top: pos.y }}>
      <div
        className="td-stats-head"
        onPointerDown={(e) => {
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <span>⚔ {t("tdStats")}</span>
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setFolded((f) => !f)}>
          {folded ? "▾" : "▴"}
        </button>
      </div>
      {!folded && (
        <div className="td-stats-body">
          {towers.length === 0 && <p className="td-stats-empty">{t("tdStatsEmpty")}</p>}
          {towers.map((w) => (
            <div key={w.id} className={`td-stats-row${w.hp <= 0 ? " broken" : ""}`}>
              <span className="td-stats-name">
                {t(w.character as TextKey)} <small>Lv{w.level}</small>
              </span>
              <span className="td-stats-dmg">
                {short(w.dmg)} <small>· {w.kills}</small>
              </span>
              <div className="td-stats-bar dmg">
                <i style={{ width: `${(w.dmg / total) * 100}%` }} />
              </div>
              <div className="td-stats-bar hp">
                <i style={{ width: `${Math.max(0, w.hp / w.maxHp) * 100}%` }} />
                <b>
                  {Math.max(0, Math.ceil(w.hp))}/{w.maxHp}
                </b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
