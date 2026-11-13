// 스토리 장면 보기: 위에 컷 일러스트(없으면 임시 그림 sceneBg) · 아래 대사 상자(얼굴·이름·글) · 한 문단씩 넘김
// 넘기기: 누르기·Space·Enter·F·→ / 뒤로: ← / 닫기: Esc · '책으로 보기'면 예전 책(StoryReader)
import { useEffect, useRef, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { CHAPTER_TEXT } from "../i18n/story";
import { CHAPTER_TITLE } from "../i18n/story/world";
import { drawSceneBg, SCENE_H, SCENE_W } from "./sceneBg";
import { cutImage, cutIndex, SCENE_CUTS } from "./sceneCuts";
import { StoryFace, speakerName } from "./StoryFace";
import { CHAPTERS, speakerSheet, type ChapterId } from "./storyData";
import { StoryReader } from "./StoryReader";
import { canFull, useFullscreen } from "./useFullscreen";

interface Props {
  id: ChapterId;
  lang: Lang;
  t: (k: TextKey) => string;
  onClose: () => void;
}

/** 이미 없다고 확인한 그림 (다시 받지 않음) */
const missing = new Set<string>();

export function SceneView({ id, lang, t, onClose }: Props) {
  const paras = CHAPTER_TEXT[id][lang];
  const [i, setI] = useState(0);
  const [book, setBook] = useState(false);
  const p = paras[i]!;
  const who = typeof p === "string" ? null : p[0];
  const cut = cutIndex(id, i);
  const src = cutImage(id, cut);
  // 그림이 없으면(받기 실패) missing에 넣고 다시 그림
  const [, setMiss] = useState(0);
  const hasImg = !missing.has(src);
  const canvas = useRef<HTMLCanvasElement>(null);
  const next = () => (i + 1 < paras.length ? setI(i + 1) : onClose());
  const prev = () => setI(Math.max(0, i - 1));
  const { full, toggleFull } = useFullscreen();

  useEffect(() => {
    if (book) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter" || e.code === "KeyF") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  // 임시 그림 (일러스트가 없을 때만)
  useEffect(() => {
    const c = canvas.current;
    if (!c || hasImg || book) return;
    const g = c.getContext("2d")!;
    const sheet = who ? speakerSheet(who) : null;
    let raf = 0;
    const frame = (now: number) => {
      drawSceneBg(g, SCENE_CUTS[id][cut]!.bg, sheet, now / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [id, cut, who, hasImg, book]);

  if (book) return <StoryReader id={id} lang={lang} t={t} onClose={onClose} done="close" />;
  const n = CHAPTERS.findIndex((c) => c.id === id) + 1;
  return (
    <section className="scene-view" onClick={next}>
      <header className="scene-head">
        <span>
          {t("storyChapterN").replace("{n}", String(n))} · {CHAPTER_TITLE[id][lang]}
        </span>
        <span className="scene-tools" onClick={(e) => e.stopPropagation()}>
          {canFull && (
            <button type="button" className="ghost" onClick={toggleFull}>
              {t(full ? "sceneFullExit" : "sceneFull")}
            </button>
          )}
          <button type="button" className="ghost" onClick={() => setBook(true)}>
            {t("sceneBook")}
          </button>
          <button type="button" className="ghost" onClick={onClose}>
            {t("sceneSkip")}
          </button>
        </span>
      </header>
      <div className="scene-art" key={cut}>
        {hasImg ? (
          <img
            src={src}
            alt=""
            onError={() => {
              missing.add(src);
              setMiss((k) => k + 1);
            }}
          />
        ) : (
          <canvas ref={canvas} width={SCENE_W} height={SCENE_H} />
        )}
      </div>
      <div className="scene-bottom">
        <div className={`scene-box${who ? "" : " narration"}`} key={i}>
          {who && <StoryFace who={who} size={48} />}
          <div>
            {who && <b>{speakerName(who, lang, t)}</b>}
            <p>{typeof p === "string" ? p : p[1]}</p>
          </div>
        </div>
        <footer className="scene-foot">
          <span>
            {i + 1} / {paras.length}
          </span>
          <small>{t("sceneHint")}</small>
        </footer>
      </div>
    </section>
  );
}
