// 가운데 뜨는 창 (바깥을 누르거나 Esc면 닫힘)
import { useEffect, type ReactNode } from "react";
import type { TextKey } from "../i18n";

interface Props {
  title: string;
  t: (key: TextKey) => string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ title, t, onClose, children, className }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${className ?? ""}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
