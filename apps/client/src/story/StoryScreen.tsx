// 스토리 (시즌 1~3): 탭 넷 — 진영 · 최종 보스 · 아카식 레코드(장 목록 → 책처럼 쪽 넘기며 읽기) · 캐릭터(자세한 설명, CharGuides)
import { Fragment, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { EnemyPortrait } from "../codex/EnemyPortrait";
import { BOSS_STORY, CHAPTER_SUMMARY, CHAPTER_TITLE, FACTION_TEXT } from "../i18n/story/world";
import { CharGuides } from "./CharGuides";
import { StoryReader } from "./StoryReader";
import { StoryFace, speakerName } from "./StoryFace";
import { CHAPTERS, FACTIONS, STORY_BOSSES, type ChapterId } from "./storyData";
import { factionOpen, storyStage } from "../progress/storyStage";

type Tab = "factions" | "bosses" | "akashic" | "chars";
const TABS: { id: Tab; label: TextKey }[] = [
  { id: "factions", label: "storyFactions" },
  { id: "bosses", label: "storyBosses" },
  { id: "akashic", label: "storyAkashic" },
  { id: "chars", label: "storyChars" },
];

interface Props {
  lang: Lang;
  t: (k: TextKey) => string;
  onBack: () => void;
}

export function StoryScreen({ lang, t, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("factions");
  const [reading, setReading] = useState<ChapterId | null>(null);
  // 연 장까지만 (1장은 처음부터 읽을 수 있음) · 진영도 연 것만 (progress/storyStage)
  const stage = storyStage();
  const chapters = CHAPTERS.slice(0, Math.max(1, stage));
  const season = chapters[chapters.length - 1]!.season;
  const bosses = STORY_BOSSES.filter((b) => b.season <= season);
  return (
    <main className="story-screen">
      <header className="story-head">
        <h2>{t("story")}</h2>
        <span>{t("storySeason1")}</span>
      </header>
      {reading ? (
        <StoryReader id={reading} lang={lang} t={t} onClose={() => setReading(null)} />
      ) : (
        <>
          <nav className="shop-tabs">
            {TABS.map((x) => (
              <button key={x.id} type="button" className={tab === x.id ? "active" : ""} onClick={() => setTab(x.id)}>
                {t(x.label)}
              </button>
            ))}
          </nav>
          {tab === "factions" && (
            <div className="story-cards">
              {FACTIONS.filter((f) => factionOpen(f.id, stage)).map((f) => (
                <section key={f.id} className={`story-card story-faction ${f.id}`} style={{ borderColor: f.color, ["--fc" as string]: f.color }}>
                  <h3 style={{ color: f.color }}>
                    {FACTION_TEXT[f.id].name[lang]} <small>{FACTION_TEXT[f.id].tag[lang]}</small>
                  </h3>
                  <p>{FACTION_TEXT[f.id].desc[lang]}</p>
                  <div className="story-members">
                    {f.members.map((m) => (
                      <figure key={m}>
                        <StoryFace who={m} size={48} />
                        <figcaption>{m === "unknown" ? t("storyUnknown") : speakerName(m, lang, t)}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
          {tab === "bosses" && (
            <div className="story-cards">
              {bosses.map((b, i) => (
                <Fragment key={b.id}>
                  {(i === 0 || bosses[i - 1]!.season !== b.season) && <h4 className="story-season">{t(`storyS${b.season}` as TextKey)}</h4>}
                  <section className="story-card story-boss">
                    <EnemyPortrait kind={b.kind} size={72} />
                    <div>
                      <h3>{BOSS_STORY[b.id].name[lang]}</h3>
                      <p>{BOSS_STORY[b.id].desc[lang]}</p>
                    </div>
                  </section>
                </Fragment>
              ))}
            </div>
          )}
          {tab === "akashic" && (
            <div className="story-cards">
              {chapters.map((ch, i) => (
                <Fragment key={ch.id}>
                  {(i === 0 || chapters[i - 1]!.season !== ch.season) && <h4 className="story-season">{t(`storyS${ch.season}` as TextKey)}</h4>}
                  <section className="story-card story-chapter">
                    <span className="story-chapter-no">{i + 1}</span>
                    <h3>
                      {t("storyChapterN").replace("{n}", String(i + 1))} · {CHAPTER_TITLE[ch.id][lang]}
                    </h3>
                    <p className="story-summary">{CHAPTER_SUMMARY[ch.id][lang]}</p>
                    <div className="story-members">
                      {ch.cast.map((m) => (
                        <StoryFace key={m} who={m} size={36} />
                      ))}
                    </div>
                    <button type="button" className="primary" onClick={() => setReading(ch.id)}>
                      {t("storyRead")}
                    </button>
                  </section>
                </Fragment>
              ))}
            </div>
          )}
          {tab === "chars" && <CharGuides lang={lang} t={t} />}
          <button type="button" className="secondary" onClick={onBack}>
            {t("back")}
          </button>
        </>
      )}
    </main>
  );
}
