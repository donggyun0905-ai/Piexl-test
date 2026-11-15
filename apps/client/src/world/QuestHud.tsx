// 세계 지도 퀘스트 화면 (docs/QUEST.md 5절, 표 progress/quests): 오른쪽 위 지금 할 일 한 줄 · 가야 할 곳 화살표(questMark) · 끝내면 '기록됨' 도장 + 서기관 한마디
// 기록서(아지트 책상): 끝낸 퀘스트 · 지금 퀘스트 · 지금까지의 이야기 다시 보기 (Esc로 닫힘)
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { activeQuest, condMet, questMode, questOpening, questsDone } from "../progress/quest";
import { FEATURE_STAGE, type Feature } from "../progress/storyStage";
import { QUESTS, type QuestCond } from "../progress/quests";
import { StoryFace } from "../story/StoryFace";
import { REGIONS } from "./worldPlaces";

type T = (k: TextKey) => string;
/** 던전 기록 할 일이면 가면 좋은 곳 (그 지역에 있을 때 화살표) */
const RUN_AT = (c: QuestCond): string | null => ("floor" in c || "wins" in c || "lastBoss" in c ? "ascalonDungeon" : "hero" in c || "endless" in c ? "memoryTower" : null);

const nextCond = (): QuestCond | null => {
  const i = activeQuest();
  return i === null ? null : (QUESTS[i]!.need.find((c) => !condMet(c)) ?? null);
};

/** 지금 지역에서 화살표를 띄울 장소 id: 그 장소 · 그 건물로 들어가는 문 · 던전 입구·기억의 탑 */
export function questMark(cur: string): string | null {
  const c = nextCond();
  if (!c) return null;
  const places = REGIONS[cur]?.places ?? [];
  if ("leave" in c) return places.find((p) => p.kind === "exit")?.id ?? null;
  if ("visit" in c) return c.region === cur ? c.visit : (places.find((p) => p.kind === "door" && p.to === c.region)?.id ?? null);
  const at = RUN_AT(c);
  return at && places.some((p) => p.id === at) ? at : null;
}

/** 할 일 한 줄 */
export function condText(t: T, c: QuestCond, cur: string, regionName: (id: string) => string): string {
  if ("visit" in c) return c.region === cur ? t("qcVisit").replace("{place}", t(c.name)) : t("qcVisitIn").replace("{region}", regionName(c.region)).replace("{place}", t(c.name));
  if ("leave" in c) return t("qcLeave");
  if ("lastBoss" in c) return t("qcLastBoss");
  const [k, n] = "floor" in c ? (["qcFloor", c.floor] as const) : "wins" in c ? (["qcWins", c.wins] as const) : "hero" in c ? (["qcHero", c.hero] as const) : (["qcEndless", c.endless] as const);
  return t(k).replace("{n}", String(n));
}

const title = (t: T, i: number) => t(`q${i}Title` as TextKey);

/** 잠긴 모드 옆 글: 퀘스트로 여는 곳은 그 퀘스트 이름 · 아니면 몇 장 */
export function lockText(t: T, f: Feature): string {
  if (!questMode()) return t("wpTowerLocked").replace("{n}", String(FEATURE_STAGE[f]));
  const q = questOpening(f);
  return q === null ? t("qLockNone") : t("qLockAt").replace("{q}", title(t, q));
}

export function QuestHud({ t, cur, regionName, onBook }: { t: T; cur: string; regionName: (id: string) => string; onBook: () => void }) {
  const i = activeQuest();
  const c = nextCond();
  if (i === null || !c) return null;
  return (
    <button type="button" className="quest-hud" onClick={onBook}>
      <small>📜 {title(t, i)}</small>
      <span>{condText(t, c, cur, regionName)}</span>
    </button>
  );
}

/** 퀘스트를 끝냄: 도장 + 서기관 한마디 (누르기·Enter·Esc로 닫힘) */
export function QuestDone({ t, n, onClose }: { t: T; n: number; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  return (
    <div className="quest-done" onClick={onClose}>
      <div className="quest-stamp">
        <b>{t("qStamp")}</b>
        <span>{title(t, n)}</span>
      </div>
      <div className="scene-box">
        <StoryFace who="scribe" size={72} art />
        <div>
          <b>{t("scribe")}</b>
          <p>{t(`q${n}Done` as TextKey)}</p>
        </div>
      </div>
    </div>
  );
}

/** 기록서: 끝낸 퀘스트 · 지금 퀘스트 · 이야기 다시 보기 */
export function QuestBook({ t, cur, regionName, onStory, onClose }: { t: T; cur: string; regionName: (id: string) => string; onStory: () => void; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });
  const done = questsDone();
  const i = activeQuest();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal quest-book" role="dialog" aria-modal="true" aria-label={t("wpAtticDesk")} onClick={(e) => e.stopPropagation()}>
        <h2>{t("wpAtticDesk")}</h2>
        <ol>
          {QUESTS.slice(0, done).map((_, k) => (
            <li key={k} className="done">
              ✓ {title(t, k)}
            </li>
          ))}
          {i !== null ? (
            <li className="now">
              <b>
                {t("qNow")} · {title(t, i)}
              </b>
              {QUESTS[i]!.need.map((c, k) => (
                <small key={k} className={condMet(c) ? "met" : ""}>
                  {condMet(c) ? "✓" : "·"} {condText(t, c, cur, regionName)}
                </small>
              ))}
            </li>
          ) : (
            <li className="now">{t("qBookAll")}</li>
          )}
        </ol>
        <button type="button" className="primary" onClick={onStory}>
          {t("qBookStory")}
        </button>
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
