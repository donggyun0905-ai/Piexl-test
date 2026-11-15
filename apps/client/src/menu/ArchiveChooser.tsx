// 메인의 '아카이브'를 누르면 뜨는 메뉴 창: 스토리 · 티어표 · 빌드 통계 · 기록 · 업적 · 도감 · 패치 노트 · 기기 연동
import { useEffect, useRef } from "react";
import { GAME_VERSION } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { Choice } from "./SoloChooser";

interface Props {
  t: (key: TextKey) => string;
  onStory: () => void;
  onTierList: () => void;
  onBuilds: () => void;
  /** 기록 · 업적 · 도감 · 패치 노트 창 (메인이 띄움) */
  onPanel: (p: "records" | "achievements" | "codex" | "notes") => void;
  /** 기기 연동 */
  onProfile: () => void;
  onClose: () => void;
}

export function ArchiveChooser({ t, onStory, onTierList, onBuilds, onPanel, onProfile, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="modal chooser" role="dialog" aria-modal="true" aria-label={t("archive")} onClick={(e) => e.stopPropagation()}>
        <h2>{t("archive")}</h2>
        <div className="choices">
          <Choice icon="book" title={t("story")} desc={t("archiveStoryDesc")} onClick={onStory} />
          <Choice icon="trophy" title={t("tierList")} desc={t("tierListDesc")} onClick={onTierList} />
          <Choice icon="book" title={t("buildStats")} desc={t("buildStatsDesc")} onClick={onBuilds} />
          <Choice icon="trophy" title={t("records")} desc={t("arcRecordsDesc")} onClick={() => onPanel("records")} />
          <Choice icon="star" title={t("achievements")} desc={t("arcAchDesc")} onClick={() => onPanel("achievements")} />
          <Choice icon="book" title={t("codex")} desc={t("arcCodexDesc")} onClick={() => onPanel("codex")} />
          <Choice icon="note" title={t("patchNotes")} desc={`${t("arcNotesDesc")} · ${GAME_VERSION}`} onClick={() => onPanel("notes")} />
          <Choice icon="link" title={t("linkTitle")} desc={t("arcLinkDesc")} onClick={onProfile} />
        </div>
        <button ref={closeRef} type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
