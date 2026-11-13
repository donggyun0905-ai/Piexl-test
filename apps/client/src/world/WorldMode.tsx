// 세계 지도 화면 (아스칼론 필드): 캔버스 + 나가기 · 나라 이름 · 장소 앞 버튼(모바일) · 글 창(표지판·마을·주민 말, Esc로 닫힘)
// 이야기 장면: 처음 오면 1장 · 장군에게 말 걸면 지금 연 장 (StoryReader) · 던전 입구 → 혼자 하기(끝나면 지도로, worldReturn)
// 세계 지도(줌 아웃)·빠른 이동은 W4
import { useEffect, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { FACTION_TEXT } from "../i18n/story/world";
import { storyStage } from "../progress/storyStage";
import { loadText, saveText } from "../storage";
import { StoryFace } from "../story/StoryFace";
import { StoryReader } from "../story/StoryReader";
import { CHAPTERS, FACTIONS, type ChapterId } from "../story/storyData";
import { WorldStage } from "./WorldStage";
import { REGIONS, type Place } from "./worldPlaces";

interface Props {
  t: (k: TextKey) => string;
  lang: Lang;
  onExit: () => void;
  onDungeon: () => void;
}

const REGION = "ascalon" as const;
const INTRO_KEY = "worldIntro";
/** 지금 연 장 중 마지막 (1장은 처음부터) */
const latestChapter = (): ChapterId => CHAPTERS[Math.max(1, storyStage()) - 1]!.id;

export function WorldMode({ t, lang, onExit, onDungeon }: Props) {
  const region = REGIONS[REGION]!;
  const color = FACTIONS.find((f) => f.id === REGION)?.color ?? "#ffffff";
  const [near, setNear] = useState<Place | null>(null);
  const [reading, setReading] = useState<Place | null>(null);
  // 처음 온 사람: 1장 이야기부터
  const [scene, setScene] = useState<ChapterId | null>(() => (loadText(INTRO_KEY) ? null : CHAPTERS[0]!.id));
  const [state, setState] = useState<"loading" | "ok" | "fail">("loading");
  const closeScene = () => {
    saveText(INTRO_KEY, "1");
    setScene(null);
  };
  const use = (p: Place) => {
    if (p.kind === "dungeon") onDungeon();
    else if (p.scene) setScene(latestChapter());
    else setReading(p);
  };
  useEffect(() => {
    if (!reading && !scene) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (scene ? closeScene() : setReading(null));
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [reading, scene]);
  const body = (p: Place): TextKey => p.line ?? (p.kind === "town" ? "wpAscalonCastleText" : (`${p.name}Text` as TextKey));
  return (
    <div className="lobby-mode world-mode">
      <WorldStage regionId={REGION} region={region} color={color} label={(p) => t(p.name)} paused={!!reading || !!scene} onNear={setNear} onUse={use} onLoaded={(ok) => setState(ok ? "ok" : "fail")} />
      <button type="button" className="secondary lobby-exit" onClick={onExit}>
        {t("lobbyExit")}
      </button>
      <p className="world-region" style={{ color }}>
        {FACTION_TEXT[REGION].name[lang]}
      </p>
      <p className="lobby-help">{t("worldHelp")}</p>
      {state !== "ok" && <p className="world-loading">{t(state === "fail" ? "worldFail" : "worldLoading")}</p>}
      {near && !reading && !scene && (
        <button type="button" className="primary lobby-enter" onClick={() => use(near)}>
          {near.kind === "dungeon" ? `⚔ ${t("wpEnter")}` : near.kind === "npc" ? `💬 ${t("wpTalk")}` : `📜 ${t("wpRead")}`} · F
        </button>
      )}
      {reading && (
        <div className="modal-backdrop" onClick={() => setReading(null)}>
          <div className="modal world-note" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>
              {reading.who && <StoryFace who={reading.who} size={40} />}
              {t(reading.name)}
            </h3>
            <p>{t(body(reading))}</p>
            <button type="button" className="ghost" onClick={() => setReading(null)}>
              {t("close")}
            </button>
          </div>
        </div>
      )}
      {scene && (
        <div className="world-scene">
          <StoryReader id={scene} lang={lang} t={t} onClose={closeScene} done="close" />
        </div>
      )}
    </div>
  );
}
