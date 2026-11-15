// 메인 화면 메뉴 아래: 새 장이 열리면 한 번 알림(확인 누르면 사라짐) · 그 밖에는 다음 장을 여는 조건 한 줄 (progress/storyStage)
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { CHAPTER_TITLE } from "../i18n/story/world";
import { CHAPTERS } from "../story/storyData";
import { LAST_STAGE, markStageSeen, unseenStage } from "./storyStage";
import { activeQuest, questMode } from "./quest";

interface Props {
  t: (k: TextKey) => string;
  lang: Lang;
  stage: number;
}

export function StageNotice({ t, lang, stage }: Props) {
  const [fresh, setFresh] = useState(unseenStage);
  if (fresh !== null) {
    const ch = CHAPTERS[fresh - 1];
    return (
      <div className="stage-notice fresh" role="status">
        <span>
          {t("stNew").replace("{n}", String(fresh))}
          {ch && ` · ${CHAPTER_TITLE[ch.id][lang]}`}
        </span>
        <small>{t("stNewHint")}</small>
        <button type="button" className="secondary" onClick={() => (markStageSeen(fresh), setFresh(null))}>
          {t("stOk")}
        </button>
      </div>
    );
  }
  // 퀘스트로 여는 곳: 지금 퀘스트 이름 (할 일은 지도에서)
  if (questMode() && stage < LAST_STAGE) {
    const q = activeQuest();
    return q === null ? null : <p className="stage-notice">📜 {t("qNow")} · {t(`q${q}Title` as TextKey)}</p>;
  }
  if (stage >= LAST_STAGE) return null;
  return (
    <p className="stage-notice">
      {t("stNext").replace("{n}", String(stage + 1))} {t(`stGoal${stage}` as TextKey)}
    </p>
  );
}
