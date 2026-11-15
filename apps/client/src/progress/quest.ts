// 퀘스트 진행 저장·판정 (docs/QUEST.md 5·6절, 표는 progress/quests): 끝낸 수 · 가 본 장소 · 던전 기록으로 할 일 판정
// 퀘스트로 장·모드를 여는 곳은 세계 지도가 있는 곳(시험 서버·내 컴퓨터)만 · 라이브는 지금처럼 기록으로 장이 열림 (storyStage)
// 화면에서만 판정 (게임 계산·서버 검사·순위와 상관없음)
import { loadFloorBest, loadTotals } from "../records";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { unlockStats } from "../unlock/unlockStats";
import { QUESTS, type QuestCond } from "./quests";
import type { Feature } from "./storyStage";

const KEY = "quests";
/** 아지트 밖으로 나간 기록 (leave 할 일) */
export const LEAVE_MARK = "@leave";

interface QState {
  /** 끝낸 퀘스트 수 (= 지금 퀘스트 번호) */
  done: number;
  /** 가 본 장소 (퀘스트에 나오는 것만) */
  visits: string[];
}

function load(): QState {
  try {
    const v = JSON.parse(loadText(KEY) ?? "null") as QState | null;
    if (v && typeof v.done === "number") return { done: v.done, visits: v.visits ?? [] };
  } catch {
    /* 아래 처음 값 */
  }
  return { done: 0, visits: [] };
}
const save = (s: QState) => saveText(KEY, JSON.stringify(s));

/** 퀘스트로 장·모드를 여는지 (세계 지도가 있는 곳) */
export const questMode = (): boolean => TEST_OPEN;
export const questsDone = (): number => load().done;
/** 지금 퀘스트 번호 (다 끝났으면 null) */
export const activeQuest = (): number | null => (load().done < QUESTS.length ? load().done : null);

/** 던전 기록 할 일 (storyStage의 장 조건과 같은 기록) */
export function recordMet(c: QuestCond): boolean {
  const s = unlockStats();
  if ("floor" in c) return (s.max.soloFloor ?? 0) >= c.floor;
  if ("wins" in c) return loadTotals().wins >= c.wins;
  if ("lastBoss" in c) return !!s.flag.lastBossClear;
  if ("hero" in c) return loadFloorBest("heroBest") >= c.hero;
  if ("endless" in c) return (s.max.endlessFloor ?? 0) >= c.endless;
  return false;
}

export function condMet(c: QuestCond, visits: readonly string[] = load().visits): boolean {
  if ("visit" in c) return visits.includes(c.visit);
  if ("leave" in c) return visits.includes(LEAVE_MARK);
  return recordMet(c);
}

/** 퀘스트에 나오는 장소면 가 본 것으로 적음 */
export function noteVisit(id: string): void {
  const s = load();
  if (s.visits.includes(id)) return;
  if (id !== LEAVE_MARK && !QUESTS.some((q) => q.need.some((c) => "visit" in c && c.visit === id))) return;
  save({ ...s, visits: [...s.visits, id] });
}

/** 할 일을 다 이룬 퀘스트를 차례로 끝냄 → 새로 끝난 번호들 */
export function advanceQuests(): number[] {
  const s = load();
  const out: number[] = [];
  while (s.done < QUESTS.length && QUESTS[s.done]!.need.every((c) => condMet(c, s.visits))) out.push(s.done++);
  if (out.length) save(s);
  return out;
}

const doneList = () => QUESTS.slice(0, load().done);
/** 퀘스트로 연 장 */
export const questStage = (): number => Math.max(0, ...doneList().map((q) => q.stage ?? 0));
export const questFeature = (f: Feature): boolean => doneList().some((q) => q.opens?.includes(f));
export const questField = (id: string): boolean => doneList().some((q) => q.fields?.includes(id));
/** 이 모드를 여는 퀘스트 번호 (없으면 null: 레이드) */
export const questOpening = (f: Feature): number | null => {
  const i = QUESTS.findIndex((q) => q.opens?.includes(f));
  return i < 0 ? null : i;
};
