// 세계 지도 화면 (W2: 아스칼론 필드 하나): 캔버스 + 나가기 · 나라 이름 · 장소 앞 버튼(모바일) · 표지판·마을 글 창(Esc로 닫힘)
// 던전 입구 → 혼자 하기 시작 (onDungeon). 세계 지도(줌 아웃)·빠른 이동은 W4
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";
import { FACTION_TEXT } from "../i18n/story/world";
import type { Lang } from "../i18n";
import { FACTIONS } from "../story/storyData";
import { WorldStage } from "./WorldStage";
import { REGIONS, type Place } from "./worldPlaces";

interface Props {
  t: (k: TextKey) => string;
  lang: Lang;
  onExit: () => void;
  onDungeon: () => void;
}

const REGION = "ascalon" as const;

export function WorldMode({ t, lang, onExit, onDungeon }: Props) {
  const region = REGIONS[REGION]!;
  const color = FACTIONS.find((f) => f.id === REGION)?.color ?? "#ffffff";
  const [near, setNear] = useState<Place | null>(null);
  const [reading, setReading] = useState<Place | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "fail">("loading");
  const use = (p: Place) => (p.kind === "dungeon" ? onDungeon() : setReading(p));
  useEffect(() => {
    if (!reading) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setReading(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [reading]);
  return (
    <div className="lobby-mode world-mode">
      <WorldStage regionId={REGION} region={region} color={color} label={(p) => t(p.name)} paused={!!reading} onNear={setNear} onUse={use} onLoaded={(ok) => setState(ok ? "ok" : "fail")} />
      <button type="button" className="secondary lobby-exit" onClick={onExit}>
        {t("lobbyExit")}
      </button>
      <p className="world-region" style={{ color }}>
        {FACTION_TEXT[REGION].name[lang]}
      </p>
      <p className="lobby-help">{t("worldHelp")}</p>
      {state !== "ok" && <p className="world-loading">{t(state === "fail" ? "worldFail" : "worldLoading")}</p>}
      {near && !reading && (
        <button type="button" className="primary lobby-enter" onClick={() => use(near)}>
          {near.kind === "dungeon" ? `⚔ ${t("wpEnter")}` : near.kind === "town" ? `🏰 ${t("wpVisit")}` : `📜 ${t("wpRead")}`} · F
        </button>
      )}
      {reading && (
        <div className="modal-backdrop" onClick={() => setReading(null)}>
          <div className="modal world-note" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>{t(reading.name)}</h3>
            <p>{t(reading.kind === "town" ? "wpTownSoon" : (`${reading.name}Text` as TextKey))}</p>
            <button type="button" className="ghost" onClick={() => setReading(null)}>
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
