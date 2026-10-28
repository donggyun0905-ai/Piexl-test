// 메인의 '아카이브'를 누르면 뜨는 메뉴 창: 스토리 · 티어표
import { useEffect, useRef } from "react";
import type { TextKey } from "../i18n";
import { Choice } from "./SoloChooser";

interface Props {
  t: (key: TextKey) => string;
  onStory: () => void;
  onTierList: () => void;
  onClose: () => void;
}

export function ArchiveChooser({ t, onStory, onTierList, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="modal chooser" role="dialog" aria-modal="true" aria-label={t("archive")} onClick={(e) => e.stopPropagation()}>
        <h2>{t("archive")}</h2>
        <div className="choices">
          <Choice icon="book" title={t("story")} desc={t("archiveStoryDesc")} onClick={onStory} />
          <Choice icon="trophy" title={t("tierList")} desc={t("tierListDesc")} onClick={onTierList} />
        </div>
        <button ref={closeRef} type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
