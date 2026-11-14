// 세계 지도 화면 (나라 필드 · 건물 안, 마지막에 있던 나라에서 시작): 캔버스 + 나가기 · 나라 이름 · 장소 앞 버튼(모바일) · 글 창(표지판·마을·주민 말, Esc로 닫힘)
// 이야기 장면(SceneView, 일러스트 + 대사): 처음 오면 1장 · 장군에게 말 걸면 지금 연 장 · 던전 입구 → 혼자 하기(끝나면 지도로, worldReturn)
// 건물 문 → 건물 안 지도(검게 사라졌다 나타남) · 나가는 문 → 들어온 문 앞 · 순간 이동석(만진 돌끼리, WarpMenu) · 세계 지도(줌 아웃)는 W4
// 국경 통로 → 옆 나라 필드 (그 나라가 스토리에서 열렸을 때만, 아니면 막혔다는 글) · 기억의 탑·콜로세움 → 모드 고르기
// 가게 주인 → 게임 상점 · 대장장이 → 레이드 장신구 · B 장비창(왼쪽 나라 지도) · M 나라 지도(만진 이동석으로 순간 이동) · C 걸어 다닐 캐릭터 고르기 · 위에 내 투력 (WorldPanels)
import { useEffect, useState } from "react";
import { setWorldMusic } from "../audio/worldMusic";
import { worldSfx } from "../audio/worldSounds";
import type { Lang, TextKey } from "../i18n";
import { FACTION_TEXT } from "../i18n/story/world";
import { factionOpen, storyStage } from "../progress/storyStage";
import { loadText, saveText } from "../storage";
import { StoryFace } from "../story/StoryFace";
import { SceneView } from "../story/SceneView";
import { CHAPTERS, FACTIONS, type ChapterId } from "../story/storyData";
import { WarpMenu } from "./WarpMenu";
import { WorldRide } from "./WorldRide";
import { WorldPanels, type WorldPanel, type WorldRun } from "./WorldPanels";
import { loadWorldChar, myPower, saveWorldChar } from "./worldPlayer";
import { WorldStage } from "./WorldStage";
import { touchWarp, warpTargets } from "./worldWarps";
import { fieldOpen, isField, placeXY, REGIONS, type Place } from "./worldPlaces";

interface Props {
  t: (k: TextKey) => string;
  lang: Lang;
  onExit: () => void;
  /** 던전 입구 = 혼자 하기 · 기억의 탑 = 무한 모드·영웅의 길 */
  onDungeon: (m: WorldRun) => void;
}

const HOME = "ascalon";
const INTRO_KEY = "worldIntro";
const FIELD_KEY = "worldRegion";
/** 마지막에 있던 나라 필드 (스토리에서 안 열렸으면 아스칼론) */
function startField(): string {
  return fieldOpen(REGIONS[loadText(FIELD_KEY) ?? ""]) ? loadText(FIELD_KEY)! : HOME;
}
/** 지금 연 장 중 마지막 (1장은 처음부터) */
const latestChapter = (): ChapterId => CHAPTERS[Math.max(1, storyStage()) - 1]!.id;

export function WorldMode({ t, lang, onExit, onDungeon }: Props) {
  // 지금 지역 (나라 필드 또는 건물 안) · 들어온 문 앞 자리(나갈 때 돌아갈 곳)
  // n: 같은 지역 안 순간 이동 때 캔버스를 새로 만들려고 올림
  const [cur, setCur] = useState<{ id: string; spawn: readonly [number, number] | null; n?: number }>(() => ({ id: startField(), spawn: null }));
  const [warp, setWarp] = useState<Place | null>(null);
  const [panel, setPanel] = useState<WorldPanel | null>(null);
  const [who, setWho] = useState(loadWorldChar);
  const [power, setPower] = useState(myPower);
  const closePanel = () => {
    setPanel(null);
    setPower(myPower());
  };
  const [back, setBack] = useState<{ id: string; spawn: readonly [number, number] } | null>(null);
  const region = REGIONS[cur.id]!;
  // 지금 나라 (건물 안이면 들어오기 전 필드)
  const field = isField(region) ? cur.id : (back?.id ?? HOME);
  const fr = REGIONS[field]!;
  const faction = fr.faction ?? "ascalon";
  const color = fr.area?.color ?? FACTIONS.find((f) => f.id === faction)?.color ?? "#ffffff";
  // 나라 곡 (건물 안이면 들어온 나라) · 지도를 나가면 메인 화면 곡
  useEffect(() => setWorldMusic(field), [field]);
  useEffect(() => () => setWorldMusic(null), []);
  const fieldName = fr.area ? t(fr.area.name) : FACTION_TEXT[faction].name[lang];
  useEffect(() => {
    if (isField(region)) saveText(FIELD_KEY, cur.id);
  }, [cur.id, region]);
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
    worldSfx(p.kind === "door" ? (p.open && !factionOpen(p.open) ? "locked" : "door") : p.kind === "exit" ? "exit" : p.kind === "pass" ? (fieldOpen(REGIONS[p.to ?? ""]) ? "pass" : "locked") : p.kind === "sign" ? "read" : p.kind === "npc" ? "talk" : "read");
    if (p.kind === "door" && p.open && !factionOpen(p.open)) setReading(p);
    else if (p.kind === "door" && p.to && REGIONS[p.to]) {
      const [x, y] = placeXY(p);
      setBack({ id: cur.id, spawn: [x, y + 4] });
      setCur({ id: p.to, spawn: null });
      setNear(null);
    } else if (p.kind === "exit") {
      setCur(back ?? { id: field, spawn: null });
      setBack(null);
      setNear(null);
    } else if (p.menu) {
      setPanel(p.menu === "smith" ? { k: "smith" } : { k: "shop", tab: p.menu.slice(5) as never });
    } else if (p.kind === "warp") {
      touchWarp(cur.id, p);
      setWarp(p);
    } else if (p.kind === "pass" && p.to && p.land) {
      if (!fieldOpen(REGIONS[p.to])) return setReading(p);
      setCur({ id: p.to, spawn: [(p.land[0] + 0.5) * 16, (p.land[1] + 0.5) * 16] });
      setBack(null);
      setNear(null);
    } else if (p.gate) setPanel({ k: "gate", gate: p.gate });
    else if (p.kind === "dungeon") onDungeon("solo");
    else if (p.scene) setScene(latestChapter());
    else setReading(p);
  };
  const busy = !!reading || !!scene || !!warp || !!panel;
  useEffect(() => {
    // B 장비창 · C 캐릭터 고르기 (다른 창이 없을 때)
    if (busy) return;
    const key = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === "KeyB") setPanel({ k: "gear" });
      else if (e.code === "KeyC") setPanel({ k: "char" });
      else if (e.code === "KeyM") setPanel({ k: "map" });
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [busy]);
  useEffect(() => {
    // 이야기 장면의 Esc는 SceneView가 받음
    if (!reading) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setReading(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [reading]);
  // 이동석 창·지도에서 순간 이동 (건물 안이면 나라 필드로 나감)
  const warpTo = (p: Place) => {
    worldSfx("warp");
    const [x, y] = placeXY(p);
    setCur({ id: field, spawn: [x, y + 12], n: (cur.n ?? 0) + 1 });
    setBack(null);
    setWarp(null);
    setPanel(null);
    setNear(null);
  };
  const body = (p: Place): TextKey => p.line ?? (`${p.name}Text` as TextKey);
  /** 장소 앞 버튼 글자 */
  const action = (p: Place): string =>
    p.gate === "tower" ? `🗼 ${t("wpGoIn")}` : p.gate === "colosseum" ? `🏟 ${t("wpGoIn")}` : p.gate === "arena" ? `👑 ${t("wpGoIn")}` : p.gate === "swarm" ? `🏜 ${t("wpGoIn")}` : p.kind === "dungeon" ? `⚔ ${t("wpEnter")}` : p.kind === "npc" ? `💬 ${t("wpTalk")}` : p.kind === "door" ? `🚪 ${t("wpGoIn")}` : p.kind === "exit" ? `🚪 ${t("wpGoOut")}` : p.kind === "warp" ? `✨ ${t("wpWarpUse")}` : p.kind === "pass" ? `🚶 ${t("wpCross")}` : `📜 ${t("wpRead")}`;
  return (
    <div className="lobby-mode world-mode">
      <WorldStage key={`${cur.id}-${cur.n ?? 0}`} regionId={cur.id} region={region} spawn={cur.spawn} color={color} label={(p) => t(p.name)} who={who} paused={busy} onNear={setNear} onUse={use} onLoaded={(ok) => setState(ok ? "ok" : "fail")} />
      <button type="button" className="secondary lobby-exit" onClick={onExit}>
        {t("lobbyExit")}
      </button>
      <p className="world-region" style={{ color }}>
        {region.title ? t(region.title) : fieldName}
      </p>
      <p className="lobby-help">{t("worldHelp")}</p>
      <div className="world-hud">
        <span className="world-power">⚔ {t("wpPower").replace("{n}", power.toLocaleString())}</span>
        <button type="button" className="secondary" onClick={() => setPanel({ k: "gear" })}>
          🎒 {t("accGear")} · B
        </button>
        <button type="button" className="secondary" onClick={() => setPanel({ k: "char" })}>
          👤 {t("wpChar")} · C
        </button>
        <button type="button" className="secondary" onClick={() => setPanel({ k: "map" })}>
          🗺 {t("wmTitle")} · M
        </button>
      </div>
      <div key={`fade-${cur.id}-${cur.n ?? 0}`} className="world-fade" />
      {region.ride && <WorldRide key={cur.id} t={t} ride={region.ride} onArrive={(to, [x, y]) => setCur({ id: to, spawn: [(x + 0.5) * 16, (y + 0.5) * 16] })} />}
      {state !== "ok" && <p className="world-loading">{t(state === "fail" ? "worldFail" : "worldLoading")}</p>}
      {near && !busy && (
        <button type="button" className="primary lobby-enter" onClick={() => use(near)}>
          {action(near)} · F
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
      {panel && (
        <WorldPanels
          panel={panel}
          t={t}
          lang={lang}
          onClose={closePanel}
          onRun={onDungeon}
          map={{ regionId: field, region: REGIONS[field]!, title: fieldName, me: isField(region) ? null : (back?.spawn ?? null), onGo: warpTo }}
          onChar={(c) => {
            saveWorldChar(c);
            setWho(c);
            closePanel();
          }}
        />
      )}
      {warp && <WarpMenu t={t} targets={warpTargets(cur.id, region, warp)} onGo={warpTo} onClose={() => setWarp(null)} />}
      {scene && (
        <div className="world-scene">
          <SceneView id={scene} lang={lang} t={t} onClose={closeScene} />
        </div>
      )}
    </div>
  );
}
