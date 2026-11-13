// 스토리 진행 단계 (docs/WORLD_MAP.md W1): 혼자 하기 기록으로 장이 하나씩 열리고, 연 장까지의 진영·모드만 화면에 보임
// 기록이 있던 사람(이 기능 전부터 하던 사람)은 처음 한 번 '모두 열림'으로 저장. 세계 지도가 생기면 장 여는 조건을 나라 던전 보스로 바꿀 예정
import type { CharacterId } from "@pixel-rogue/shared";
import { factionOf } from "../select/factions";
import type { FactionId } from "../story/storyData";
import { loadAchievements, loadFloorBest, loadTotals } from "../records";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";
import { unlockStats } from "../unlock/unlockStats";

/** 마지막 장 */
export const LAST_STAGE = 9;

/** 다음 장을 여는 조건 (차례대로: 0번을 이루면 1장 …) · 글자 i18n/text/storyStage `stGoal{n}` */
export type StageGoal = { floor: number } | { wins: number } | { lastBoss: true } | { hero: number } | { endless: number };
export const STAGE_GOALS: readonly StageGoal[] = [
  /** 1장: 혼자 하기 1층 보스 처치 (2층 도착) */
  { floor: 2 },
  /** 2장: 3층 보스 처치 */
  { floor: 4 },
  /** 3장: 혼자 하기 첫 클리어 */
  { wins: 1 },
  /** 4장: 라스트 보스 처치 */
  { lastBoss: true },
  /** 5장: 영웅의 길 3단계 */
  { hero: 3 },
  /** 6장: 무한 모드 10층 */
  { endless: 10 },
  /** 7~9장: 클리어 5·8·12번 */
  { wins: 5 },
  { wins: 8 },
  { wins: 12 },
];

/** 장으로 여는 모드 (몇 장부터) */
export type Feature = "daily" | "battle" | "coop" | "events" | "swarm" | "td" | "shop" | "lobby" | "hero" | "endless" | "arena" | "raid" | "paewang" | "taboo";
export const FEATURE_STAGE: Record<Feature, number> = {
  daily: 1,
  battle: 2,
  coop: 2,
  events: 3,
  swarm: 3,
  td: 3,
  shop: 3,
  lobby: 3,
  hero: 4,
  endless: 5,
  arena: 6,
  raid: 6,
  paewang: 7,
  taboo: 9,
};

/** 진영이 보이기 시작하는 장 (0 = 처음부터) */
export const FACTION_STAGE: Record<FactionId, number> = {
  ascalon: 0,
  virdia: 1,
  terracore: 2,
  helios: 3,
  archive: 3,
  akashic: 6,
  outsider: 6,
  dawn: 7,
  ashvar: 7,
  seongguk: 8,
  thalassia: 9,
  silber: 9,
};

interface Saved {
  /** 기능 전부터 하던 사람: 모두 열림 */
  all?: boolean;
  /** 메인 화면에서 '새 장 열림'을 본 장 */
  seen?: number;
}
const KEY = "storyStage";

function loadSaved(): Saved {
  const raw = loadText(KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Saved;
    } catch {
      /* 아래에서 새로 */
    }
  }
  // 처음: 기록이 있으면 기존 사용자
  const s = unlockStats();
  const old = loadTotals().runs > 0 || loadAchievements().length > 0 || Object.keys(s.max).length > 0;
  const v: Saved = old ? { all: true } : { seen: 0 };
  saveText(KEY, JSON.stringify(v));
  return v;
}

function goalMet(g: StageGoal): boolean {
  const s = unlockStats();
  if ("floor" in g) return (s.max.soloFloor ?? 0) >= g.floor;
  if ("wins" in g) return loadTotals().wins >= g.wins;
  if ("lastBoss" in g) return !!s.flag.lastBossClear;
  if ("hero" in g) return loadFloorBest("heroBest") >= g.hero;
  return (s.max.endlessFloor ?? 0) >= g.endless;
}

/** 시험 서버·내 컴퓨터에서만: 주소 ?story=0~9 로 그 장인 척 보기 (저장 안 함) */
function testOverride(): number | null {
  if (!TEST_OPEN || typeof location === "undefined") return null;
  const v = new URLSearchParams(location.search).get("story");
  const n = v === null ? NaN : Number(v);
  return Number.isInteger(n) && n >= 0 && n <= LAST_STAGE ? n : null;
}

/** 지금 연 장 (0 = 프롤로그 · 9 = 모두) */
export function storyStage(): number {
  const o = testOverride();
  if (o !== null) return o;
  if (loadSaved().all) return LAST_STAGE;
  let n = 0;
  while (n < STAGE_GOALS.length && goalMet(STAGE_GOALS[n]!)) n++;
  return n;
}

export const featureOpen = (f: Feature, stage = storyStage()): boolean => stage >= FEATURE_STAGE[f];
export const factionOpen = (id: FactionId, stage = storyStage()): boolean => stage >= FACTION_STAGE[id];
/** 이 캐릭터의 진영이 열렸는지 (안 열렸으면 선택 화면에 아예 안 보임) */
export const charInStory = (c: CharacterId, stage = storyStage()): boolean => factionOpen(factionOf(c), stage);

/** 메인 화면 '새 장 열림' 안내: 아직 안 본 새 장 (없으면 null) */
export function unseenStage(): number | null {
  const v = loadSaved();
  if (v.all || testOverride() !== null) return null;
  const n = storyStage();
  return n > (v.seen ?? 0) ? n : null;
}
export function markStageSeen(n: number): void {
  const v = loadSaved();
  saveText(KEY, JSON.stringify({ ...v, seen: Math.max(v.seen ?? 0, n) }));
}
