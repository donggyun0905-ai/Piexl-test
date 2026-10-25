// 뽑기 봉투: 카드 위쪽을 옆으로 쓸면(마우스·손가락) 지나간 만큼 절취선이 빛나고, 충분히 쓸면 윗부분이 뜯겨 날아감
// fancy: 10번 뽑기용 화려한 금박 봉투
import { useRef, useState, type PointerEvent } from "react";
import type { TextKey } from "../i18n";

/** 가로로 이만큼(봉투 폭 비율) 쓸면 뜯김 · 뜯긴 윗부분이 날아가는 시간 */
const TEAR_AT = 0.75;
const FLY_MS = 550;

export function GachaPack({ fancy, count, t, onOpen }: { fancy: boolean; count: number; t: (k: TextKey) => string; onOpen: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const span = useRef<{ min: number; max: number } | null>(null);
  const [tear, setTear] = useState({ from: 0, to: 0 });
  const [torn, setTorn] = useState(false);

  const open = () => {
    if (torn) return;
    setTorn(true);
    setTear({ from: 0, to: 1 });
    window.setTimeout(onOpen, FLY_MS);
  };
  const at = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (torn) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const x = at(e);
    span.current = { min: x, max: x };
  };
  const move = (e: PointerEvent) => {
    const sp = span.current;
    if (!sp || torn) return;
    const x = at(e);
    sp.min = Math.min(sp.min, x);
    sp.max = Math.max(sp.max, x);
    setTear({ from: sp.min, to: sp.max });
    if (sp.max - sp.min >= TEAR_AT) open();
  };
  const up = () => {
    span.current = null;
    if (!torn) setTear({ from: 0, to: 0 });
  };

  return (
    <div className="gacha-pack-wrap">
      <div ref={box} className={`gacha-pack${fancy ? " fancy" : ""}${torn ? " torn" : ""}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="pack-top">
          <span className="pack-notch" />
        </div>
        <div className="pack-cut">
          <span style={{ left: `${tear.from * 100}%`, width: `${(tear.to - tear.from) * 100}%` }} />
        </div>
        <div className="pack-body">
          {fancy && <span className="pack-sparkles" />}
          <span className="pack-star">✦</span>
          <strong>{t("shopGacha")}</strong>
          <span className="pack-count">×{count}</span>
        </div>
      </div>
      <p className="gacha-hint">{t("shopTearHint")}</p>
      <button type="button" className="gacha-skip" onClick={open} disabled={torn}>
        {t("shopTearSkip")}
      </button>
    </div>
  );
}
