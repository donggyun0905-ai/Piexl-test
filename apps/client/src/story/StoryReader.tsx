// 스토리 장 책 읽기: 한 쪽에 몇 줄씩, 대사는 얼굴 + 이름 + 말풍선 · ← → 키로 쪽 넘기기 (스토리 화면 · 세계 지도 이야기 장면에서 같이 씀)
import { useEffect, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { CHAPTER_TEXT } from "../i18n/story";
import { CHAPTER_TITLE } from "../i18n/story/world";
import { StoryFace, speakerName } from "./StoryFace";
import { CHAPTERS, PARAS_PER_PAGE, type ChapterId } from "./storyData";

/** 책 읽기: 한 쪽에 몇 줄씩, 대사는 얼굴 + 이름 + 말풍선 */
export function StoryReader({ id, lang, t, onClose, done = "storyToList" }: { id: ChapterId; lang: Lang; t: (k: TextKey) => string; onClose: () => void; done?: TextKey }) {
  const [page, setPage] = useState(0);
  const paras = CHAPTER_TEXT[id][lang];
  const pages = Math.ceil(paras.length / PARAS_PER_PAGE);
  const n = CHAPTERS.findIndex((c) => c.id === id) + 1;
  // ← → 키로 쪽 넘기기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(pages - 1, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages]);
  return (
    <article className="story-book">
      <header className="story-book-head">
        <small>{t("storyAkashic")}</small>
        <h3>
          {t("storyChapterN").replace("{n}", String(n))} · {CHAPTER_TITLE[id][lang]}
        </h3>
        <div className="story-progress" aria-hidden="true">
          <span style={{ width: `${((page + 1) / pages) * 100}%` }} />
        </div>
      </header>
      <div className="story-page" key={page}>
        {paras.slice(page * PARAS_PER_PAGE, (page + 1) * PARAS_PER_PAGE).map((p, i) =>
          typeof p === "string" ? (
            <p key={i} className="story-narration">
              {p}
            </p>
          ) : (
            <div key={i} className="story-line">
              <StoryFace who={p[0]} size={40} />
              <div>
                <b>{speakerName(p[0], lang, t)}</b>
                <p>{p[1]}</p>
              </div>
            </div>
          ),
        )}
      </div>
      <footer className="story-pager">
        <button type="button" className="secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>
          {t("storyPrev")}
        </button>
        <span>
          {page + 1} / {pages}
        </span>
        {page + 1 < pages ? (
          <button type="button" className="primary" onClick={() => setPage(page + 1)}>
            {t("storyNext")}
          </button>
        ) : (
          <button type="button" className="primary" onClick={onClose}>
            {t(done)}
          </button>
        )}
      </footer>
      <button type="button" className="link-button" onClick={onClose}>
        {t(done)}
      </button>
    </article>
  );
}
