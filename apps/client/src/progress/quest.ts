// 퀘스트 진행 저장·판정 (docs/QUEST.md 5·6절, 표는 progress/quests): 끝낸 수 · 가 본 장소 · 던전 기록으로 할 일 판정
// 퀘스트로 장·모드를 여는 곳은 세계 지도가 있는 곳(시험 서버·내 컴퓨터)만 · 라이브는 지금처럼 기록으로 장이 열림 (storyStage)
// 화면에서만 판정 (게임 계산·서버 검사·순위와 상관없음) · 서버 백업(cloudSave "quests"): 목록만 써서 두 기기 값을 합치면 합집합
import { loadFloorBest, loadTotals } from "../records";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { unlockStats } from "../unlock/unlockStats";
import { QUESTS, type QuestCond } from "./quests";
import type { Feature } from "./storyStage";

const KEY = "quests";
/** 아지트 밖으로 나간 기록 (leave 할 일) */
export const LEAVE_MARK = "@leave";

/** 저장 모양 (목록은 두 기기 합집합 · 사냥 수는 숫자 합치기) */
interface Stored {
  /** 끝낸 퀘스트 id (quests의 id) · 예전 저장은 번호(fin, 0~12 = id "0"~"12") */
  ids: string[];
  fin?: number[];
  /** 가 본 장소 (퀘스트에 나오는 것만) */
  visits: string[];
  /** 본 것: prologue = 프롤로그 · attic = 아지트 안내 */
  flags: string[];
  /** 사냥터마다 잡은 수 (world/hunt) */
  kills: Record<string, number>;
}
interface QState extends Stored {
  /** 지금 퀘스트 번호 (QUESTS 안 차례, 끝낸 것은 건너뜀 · 다 끝났으면 QUESTS.length) */
  done: number;
}

const firstOpen = (ids: readonly string[]) => {
  let i = 0;
  while (i < QUESTS.length && ids.includes(QUESTS[i]!.id)) i++;
  return i;
};

function load(): QState {
  let v: Partial<Stored> & { done?: number } = {};
  try {
    v = (JSON.parse(loadText(KEY) ?? "null") as typeof v | null) ?? {};
  } catch {
    /* 처음 값 */
  }
  // 예전 저장(done 숫자 · fin 번호) → id 목록
  const old = v.fin ?? Array.from({ length: v.done ?? 0 }, (_, i) => i);
  const ids = [...new Set([...(v.ids ?? []), ...old.map(String)])];
  return { ids, fin: v.fin, visits: v.visits ?? [], flags: v.flags ?? [], kills: v.kills ?? {}, done: firstOpen(ids) };
}
/** 저장본 그대로 (다른 묶음 side: progress/sideQuests가 같이 씀 → 저장할 때 지우지 않음) */
export function rawQuests(): Record<string, unknown> {
  try {
    return (JSON.parse(loadText(KEY) ?? "null") as Record<string, unknown> | null) ?? {};
  } catch {
    return {};
  }
}
export const saveQuestPart = (k: string, v: unknown) => saveText(KEY, JSON.stringify({ ...rawQuests(), [k]: v }));
const save = (s: QState) => saveText(KEY, JSON.stringify({ ...rawQuests(), ids: s.ids, ...(s.fin ? { fin: s.fin } : {}), visits: s.visits, flags: s.flags, kills: s.kills }));

export const hasFlag = (f: string): boolean => load().flags.includes(f);
export function setFlag(f: string): void {
  const s = load();
  if (!s.flags.includes(f)) save({ ...s, flags: [...s.flags, f] });
}

/** 퀘스트로 장·모드를 여는지 (세계 지도가 있는 곳) */
export const questMode = (): boolean => TEST_OPEN;
/** 끝낸 퀘스트 id */
export const questIds = (): string[] => load().ids;
/** 끝낸 퀘스트 수 */
export const questsDone = (): number => QUESTS.filter((q) => load().ids.includes(q.id)).length;
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

/** 사냥터에서 잡은 수 */
export const killsAt = (g: string): number => load().kills[g] ?? 0;
export function noteKill(g: string): void {
  const s = load();
  save({ ...s, kills: { ...s.kills, [g]: (s.kills[g] ?? 0) + 1 } });
}

export function condMet(c: QuestCond, s: Pick<Stored, "visits" | "kills"> = load()): boolean {
  if ("visit" in c) return s.visits.includes(c.visit);
  if ("leave" in c) return s.visits.includes(LEAVE_MARK);
  if ("hunt" in c) return (s.kills[c.hunt] ?? 0) >= c.n;
  return recordMet(c);
}

/** 퀘스트에 나오는 장소면 가 본 것으로 적음 */
export function noteVisit(id: string): void {
  const s = load();
  if (s.visits.includes(id)) return;
  if (id !== LEAVE_MARK && !QUESTS.some((q) => q.need.some((c) => "visit" in c && c.visit === id))) return;
  save({ ...s, visits: [...s.visits, id] });
}

/** 할 일을 다 이룬 퀘스트를 차례로 끝냄 → 새로 끝난 번호들 (QUESTS 안 차례) */
export function advanceQuests(): number[] {
  const s = load();
  const out: number[] = [];
  while (s.done < QUESTS.length && QUESTS[s.done]!.need.every((c) => condMet(c, s))) {
    out.push(s.done);
    s.ids.push(QUESTS[s.done]!.id);
    s.done = firstOpen(s.ids);
  }
  if (out.length) save(s);
  return out;
}

/** 끝낸 퀘스트 (사이에 새 퀘스트가 끼어도 이미 끝낸 것은 그대로) */
const doneList = () => {
  const ids = load().ids;
  return QUESTS.filter((q) => ids.includes(q.id));
};
/** 퀘스트로 연 장 */
export const questStage = (): number => Math.max(0, ...doneList().map((q) => q.stage ?? 0));
export const questFeature = (f: Feature): boolean => doneList().some((q) => q.opens?.includes(f));
export const questField = (id: string): boolean => doneList().some((q) => q.fields?.includes(id));
/** 이 모드를 여는 퀘스트 번호 (없으면 null: 레이드) */
export const questOpening = (f: Feature): number | null => {
  const i = QUESTS.findIndex((q) => q.opens?.includes(f));
  return i < 0 ? null : i;
};
