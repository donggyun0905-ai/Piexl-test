// 세계 지도 화면 (아스칼론 필드): 캔버스 + 나가기 · 나라 이름 · 장소 앞 버튼(모바일) · 글 창(표지판·마을·주민 말, Esc로 닫힘)
// 이야기 장면(SceneView, 일러스트 + 대사): 처음 오면 1장 · 장군에게 말 걸면 지금 연 장 · 던전 입구 → 혼자 하기(끝나면 지도로, worldReturn)
// 건물 문 → 건물 안 지도(검게 사라졌다 나타남) · 나가는 문 → 들어온 문 앞 · 세계 지도(줌 아웃)·빠른 이동은 W4
import { useEffect, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { FACTION_TEXT } from "../i18n/story/world";
import { storyStage } from "../progress/storyStage";
import { loadText, saveText } from "../storage";
import { StoryFace } from "../story/StoryFace";
import { SceneView } from "../story/SceneView";
import { CHAPTERS, FACTIONS, type ChapterId } from "../story/storyData";
import { WorldStage } from "./WorldStage";
import { placeXY, REGIONS, type Place } from "./worldPlaces";

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
  // 지금 지역 (나라 필드 또는 건물 안) · 들어온 문 앞 자리(나갈 때 돌아갈 곳)
  const [cur, setCur] = useState<{ id: string; spawn: readonly [number, number] | null }>({ id: REGION, spawn: null });
  const [back, setBack] = useState<{ id: string; spawn: readonly [number, number] } | null>(null);
  const region = REGIONS[cur.id]!;
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
    if (p.kind === "door" && p.to && REGIONS[p.to]) {
      const [x, y] = placeXY(p);
      setBack({ id: cur.id, spawn: [x, y + 4] });
      setCur({ id: p.to, spawn: null });
      setNear(null);
    } else if (p.kind === "exit") {
      setCur(back ?? { id: REGION, spawn: null });
      setBack(null);
      setNear(null);
    } else if (p.kind === "dungeon") onDungeon();
    else if (p.scene) setScene(latestChapter());
    else setReading(p);
  };
  useEffect(() => {
    // 이야기 장면의 Esc는 SceneView가 받음
    if (!reading) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setReading(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [reading]);
  const body = (p: Place): TextKey => p.line ?? (p.kind === "town" ? "wpAscalonCastleText" : (`${p.name}Text` as TextKey));
  return (
    <div className="lobby-mode world-mode">
      <WorldStage key={cur.id} regionId={cur.id} region={region} spawn={cur.spawn} color={color} label={(p) => t(p.name)} paused={!!reading || !!scene} onNear={setNear} onUse={use} onLoaded={(ok) => setState(ok ? "ok" : "fail")} />
      <button type="button" className="secondary lobby-exit" onClick={onExit}>
        {t("lobbyExit")}
      </button>
      <p className="world-region" style={{ color }}>
        {region.title ? t(region.title) : FACTION_TEXT[REGION].name[lang]}
      </p>
      <p className="lobby-help">{t("worldHelp")}</p>
      <div key={`fade-${cur.id}`} className="world-fade" />
      {state !== "ok" && <p className="world-loading">{t(state === "fail" ? "worldFail" : "worldLoading")}</p>}
      {near && !reading && !scene && (
        <button type="button" className="primary lobby-enter" onClick={() => use(near)}>
          {near.kind === "dungeon" ? `⚔ ${t("wpEnter")}` : near.kind === "npc" ? `💬 ${t("wpTalk")}` : near.kind === "door" ? `🚪 ${t("wpGoIn")}` : near.kind === "exit" ? `🚪 ${t("wpGoOut")}` : `📜 ${t("wpRead")}`} · F
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
          <SceneView id={scene} lang={lang} t={t} onClose={closeScene} />
        </div>
      )}
    </div>
  );
}
