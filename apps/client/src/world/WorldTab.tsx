// 세계 지도 TAB 한눈에 보기 (docs/QUEST.md 다음 할 일 4): 화면을 검정 반투명으로 덮고 지금 퀘스트·진행·콘텐츠(열림/잠김·있는 곳)·사냥터(권장 투력)·갈 수 있는 나라·조작 키
// Tab·Esc·바깥 누르기로 닫힘 · 여는 키는 WorldMode (다른 창이 없을 때)
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { activeQuest, condMet, questsDone } from "../progress/quest";
import { QUESTS } from "../progress/quests";
import { featureOpen, LAST_STAGE, storyStage, type Feature } from "../progress/storyStage";
import { condText, lockText, questTitle } from "./QuestHud";
import { fieldOpen, isField, REGIONS } from "./worldPlaces";
import { HUNT_GROUNDS } from "./hunt/huntGrounds";

type T = (k: TextKey) => string;
/** 콘텐츠: 이름 · 있는 곳(장소 이름·지역) */
const MODES: readonly [Feature, TextKey, TextKey | null, string | null][] = [
  ["solo", "soloRun", "wpDungeon", "ascalon"],
  ["battle", "playTogether", "wpGuild", "ascalon"],
  ["coop", "coop", "wpGuild", "ascalon"],
  ["lobby", "lobby", "wpAtticArcade", "attic"],
  ["hero", "heroRun", "wpTower", "ascalon"],
  ["endless", "endlessRun", "wpTower", "ascalon"],
  ["arena", "arenaRun", "wpStatue", "helios"],
  ["td", "tdRun", "asura", "silber"],
  ["daily", "daily", "wpBoard", "ascalon"],
  ["events", "events", "wpBoard", "ascalon"],
  ["swarm", "swarm", "wpTemple", "desert"],
  ["paewang", "paewang", "wpColosseum", "terracore"],
  ["raid", "raidEvent", null, null],
  ["taboo", "tabooBook", null, null],
];

export function WorldTab({ t, cur, regionName, onClose }: { t: T; cur: string; regionName: (id: string) => string; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape" && e.key !== "Tab") return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const i = activeQuest();
  // 타고 가는 곳(열차 안)은 빼고, 같은 이름은 한 번
  const lands = [...new Set(Object.keys(REGIONS).filter((k) => isField(REGIONS[k]) && !REGIONS[k]!.ride && fieldOpen(REGIONS[k])).map(regionName))];
  return (
    <div className="world-tab" role="dialog" aria-modal="true" aria-label={t("tabTitle")} onClick={onClose}>
      <div className="world-tab-body" onClick={(e) => e.stopPropagation()}>
        <h2>{t("tabTitle")}</h2>
        <p className="world-tab-progress">
          {t("tabProgress").replace("{q}", String(questsDone())).replace("{qn}", String(QUESTS.length)).replace("{s}", String(storyStage())).replace("{sn}", String(LAST_STAGE))}
        </p>
        <section>
          <h3>📜 {t("tabQuest")}</h3>
          {i === null ? (
            <p>{t("qBookAll")}</p>
          ) : (
            <>
              <b>{questTitle(t, i)}</b>
              {QUESTS[i]!.need.map((c, k) => (
                <small key={k} className={condMet(c) ? "met" : ""}>
                  {condMet(c) ? "✓" : "·"} {condText(t, c, cur, regionName)}
                </small>
              ))}
            </>
          )}
        </section>
        <section>
          <h3>⚔ {t("tabModes")}</h3>
          <ul className="world-tab-modes">
            {MODES.map(([f, name, place, region]) => {
              const open = featureOpen(f);
              return (
                <li key={f} className={open ? "open" : "locked"}>
                  <b>
                    {open ? "✓" : "🔒"} {t(name)}
                  </b>
                  <small>{open ? (place && region ? `${regionName(region)} · ${t(place)}` : t("tabOpen")) : lockText(t, f)}</small>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>🗡 {t("tabHunt")}</h3>
          <ul className="world-tab-modes">
            {HUNT_GROUNDS.map((g) => (
              <li key={g.id} className={fieldOpen(REGIONS[g.region]) ? "open" : "locked"}>
                <b>{t(g.name)}</b>
                <small>{t("tabHuntRow").replace("{region}", regionName(g.region)).replace("{mob}", t(g.mob)).replace("{n}", String(g.power))}</small>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>🗺 {t("tabLands")}</h3>
          <p>{lands.join(" · ")}</p>
        </section>
        <p className="world-tab-keys">{t("tabKeys")}</p>
      </div>
    </div>
  );
}
