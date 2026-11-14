// 순간 이동석 창: 만진 적 있는 다른 돌 목록 → 누르면 그 돌 앞으로 · Esc·바깥 누르기로 닫힘
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import type { Place } from "./worldPlaces";

interface Props {
  t: (k: TextKey) => string;
  targets: readonly Place[];
  onGo: (p: Place) => void;
  onClose: () => void;
}

export function WarpMenu({ t, targets, onGo, onClose }: Props) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal world-note" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>✨ {t("wpWarpTitle")}</h3>
        {targets.length === 0 ? (
          <p>{t("wpWarpNone")}</p>
        ) : (
          <div className="world-warps">
            {targets.map((p) => (
              <button key={p.id} type="button" className="secondary" onClick={() => onGo(p)}>
                {t(p.name)}
              </button>
            ))}
          </div>
        )}
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
