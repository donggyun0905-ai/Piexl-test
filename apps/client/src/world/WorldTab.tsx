// 세계 지도 TAB 콘텐츠 모음: 화면을 검정 반투명으로 덮고 들어갈 수 있는 콘텐츠를 묶음별 카드로 (열린 것은 누르면 바로 들어감, 잠긴 것은 여는 조건) · 위에 지금 퀘스트 · 아래 접힌 정보(사냥터·최종보스·갈 수 있는 곳)
// Tab·Esc·바깥 누르기로 닫힘 · 여는 키는 WorldMode (다른 창이 없을 때)
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { activeQuest, condMet, questsDone } from "../progress/quest";
import { QUESTS } from "../progress/quests";
import { featureOpen, LAST_STAGE, storyStage, type Feature } from "../progress/storyStage";
import { condText, lockText, questTitle } from "./QuestHud";
import { fieldOpen, isField, REGIONS } from "./worldPlaces";
import { HUNT_GROUNDS } from "./hunt/huntGrounds";
import { mobName } from "./hunt/huntNames";
import { BOSS_GATES } from "./bossGates";
import { BOSS_TEXT } from "../i18n/enemies";
import { bossWon } from "../progress/subQuests";
import { loadSavedRun } from "../records";
import type { WorldRun } from "./WorldPanels";

type T = (k: TextKey) => string;
/** 콘텐츠 카드: 여는 조건 · 그림 글자 · 이름 · 있는 곳(장소 이름·지역) · 누르면 들어갈 곳 (lobby는 로비, null이면 안내만) */
type Row = readonly [Feature, string, TextKey, TextKey | null, string | null, WorldRun | "lobby" | null];
const GROUPS: readonly [TextKey, readonly Row[]][] = [
  ["tabSolo", [
    ["solo", "⚔", "soloRun", "wpDungeon", "ascalon", "solo"],
    ["hero", "👑", "heroRun", "wpTower", "ascalon", "hero"],
    ["endless", "♾", "endlessRun", "wpTower", "ascalon", "endless"],
    ["arena", "🏆", "arenaRun", "wpStatue", "helios", "arena"],
    ["td", "🏰", "tdRun", "asura", "silber", "td"],
    ["swarm", "🏜", "swarm", "wpTemple", "desert", "swarm"],
  ]],
  ["tabTogether", [
    ["battle", "🤝", "playTogether", "wpGuild", "ascalon", "battle"],
    ["coop", "🛡", "coop", "wpGuild", "ascalon", "coop"],
    ["paewang", "🏟", "paewang", "wpColosseum", "terracore", "paewang"],
    ["daily", "📅", "daily", "wpBoard", "ascalon", "daily"],
  ]],
  ["tabMore", [
    ["events", "⭐", "events", "wpBoard", "ascalon", "events"],
    ["raid", "🐉", "raidEvent", null, null, "events"],
    ["taboo", "📕", "tabooBook", null, null, null],
    ["lobby", "🎮", "lobby", "wpAtticArcade", "attic", "lobby"],
  ]],
];

function Card({ icon, name, desc, locked, onClick }: { icon: string; name: string; desc: string; locked?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={`world-tab-card${locked ? " locked" : ""}`} disabled={locked || !onClick} onClick={onClick}>
      <span className="world-tab-icon">{locked ? "🔒" : icon}</span>
      <span>
        <b>{name}</b>
        <small>{desc}</small>
      </span>
    </button>
  );
}

export function WorldTab({ t, cur, regionName, onClose, onRun, onLobby }: { t: T; cur: string; regionName: (id: string) => string; onClose: () => void; onRun: (m: WorldRun) => void; onLobby: () => void }) {
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
  const saved = loadSavedRun();
  const go = (m: WorldRun | "lobby") => (onClose(), m === "lobby" ? onLobby() : onRun(m));
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
        {GROUPS.map(([title, rows], n) => (
          <section key={title}>
            <h3>{t(title)}</h3>
            <div className="world-tab-cards">
              {n === 0 && saved && <Card icon="▶" name={t("continueRun")} desc={t("tabContinue")} onClick={() => go("continue")} />}
              {rows.map(([f, icon, name, place, region, run]) => {
                const open = featureOpen(f);
                const desc = open ? (place && region ? `${regionName(region)} · ${t(place)}` : t("tabOpen")) : lockText(t, f);
                return <Card key={f} icon={icon} name={t(name)} desc={desc} locked={!open} onClick={run ? () => go(run) : undefined} />;
              })}
              {n === 2 && <Card icon="📖" name={t("tutorial")} desc={t("tutorialDesc")} onClick={() => go("tutorial")} />}
              {n === 2 && <Card icon="🎯" name={t("practice")} desc={t("practiceDesc")} onClick={() => go("practice")} />}
            </div>
          </section>
        ))}
        <details className="world-tab-info">
          <summary>{t("tabInfo")}</summary>
        <section>
          <h3>🗡 {t("tabHunt")}</h3>
          <ul className="world-tab-modes">
            {HUNT_GROUNDS.map((g) => (
              <li key={g.id} className={fieldOpen(REGIONS[g.region]) ? "open" : "locked"}>
                <b>
                  {g.boss ? "👑 " : ""}
                  {t(g.name)}
                </b>
                <small>{t("tabHuntRow").replace("{region}", regionName(g.region)).replace("{mob}", mobName(g)).replace("{n}", g.power.toLocaleString())}</small>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>💀 {t("tabBoss")}</h3>
          <ul className="world-tab-modes">
            {BOSS_GATES.map((g) => (
              <li key={g.boss} className={fieldOpen(REGIONS[g.region]) ? "open" : "locked"}>
                <b>
                  {bossWon(g.boss) ? "✓ " : ""}
                  {t(BOSS_TEXT[g.boss] as TextKey)}
                </b>
                <small>{t("tabHuntRow").replace("{region}", regionName(g.region)).replace("{mob}", "💀").replace("{n}", g.power.toLocaleString())}</small>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>🗺 {t("tabLands")}</h3>
          <p>{lands.join(" · ")}</p>
        </section>
        </details>
        <p className="world-tab-keys">{t("tabKeys")}</p>
      </div>
    </div>
  );
}
