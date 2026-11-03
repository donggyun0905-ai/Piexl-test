// 이 기기에 남기는 기록: 이어하기 저장 · 최고 기록 · 업적(해금). 가입하면 업적은 서버에도 저장 (일일 도전 단계)
import { careerWith, createRng, EMPTY_CAREER, INTRO_RULES, seedToText, type CareerStats, type CharacterId, type RunState } from "@pixel-rogue/shared";
import { loadText, saveText } from "./storage";

// ───────── 시드 ─────────

/** 무작위 시드 글자 (시드를 고르는 데만 브라우저 랜덤을 씀) */
export function newSeedText(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] ?? 1;
  return seedToText(createRng(n));
}

/** 입력한 시드 정리: 영문·숫자만, 대문자, 최대 16글자 */
export function cleanSeed(text: string): string {
  return text.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
}

/** 주소의 ?seed= 값 */
export function seedFromUrl(): string {
  try {
    return cleanSeed(new URLSearchParams(location.search).get("seed") ?? "");
  } catch {
    return "";
  }
}

export function shareUrl(seedText: string): string {
  return `${location.origin}/?seed=${seedText}`;
}

// ───────── 이어하기 저장 ─────────

/** 게임 상태 모양이 바뀌면 올림 (옛 저장은 버림) */
const SAVE_FORMAT = 6;

export interface SavedRun {
  format: number;
  seedText: string;
  characterId: CharacterId;
  run: RunState;
  savedAt: number;
}

export function saveRun(seedText: string, run: RunState): void {
  const data: SavedRun = { format: SAVE_FORMAT, seedText, characterId: run.player.characterId, run, savedAt: Date.now() };
  saveText("save", JSON.stringify(data));
}

export function loadSavedRun(): SavedRun | null {
  try {
    const raw = loadText("save");
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedRun;
    if (data.format !== SAVE_FORMAT || !data.run || data.run.over) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearSavedRun(): void {
  saveText("save", "");
}

// ───────── 최고 기록 ─────────

export interface BestRecord {
  score: number;
  floor: number;
  kills: number;
  ticks: number;
  won: boolean;
  characterId: CharacterId;
  seedText: string;
  date: string;
  /** 협동으로 함께한 인원 (혼자 하기는 없음) */
  coop?: number;
}

export function loadBest(): BestRecord | null {
  try {
    const raw = loadText("best");
    return raw ? (JSON.parse(raw) as BestRecord) : null;
  } catch {
    return null;
  }
}

/** 무한 모드·영웅의 길 최고 층(단계) 저장 이름 */
export type FloorBestKey = "endlessBest" | "heroBest";

/** 무한 모드·영웅의 길 최고 층 (없으면 0) */
export function loadFloorBest(key: FloorBestKey): number {
  return Number(loadText(key) ?? 0) || 0;
}

/** 무한 모드·영웅의 길: 더 깊으면 저장하고 true */
export function saveFloorBest(key: FloorBestKey, floor: number): boolean {
  if (floor <= loadFloorBest(key)) return false;
  saveText(key, String(floor));
  return true;
}

/** 더 높으면 저장하고 true */
export function saveBestIfHigher(rec: BestRecord): boolean {
  const best = loadBest();
  if (best && best.score >= rec.score) return false;
  saveText("best", JSON.stringify(rec));
  return true;
}

// ───────── 판 기록 (최근 기록·누적) ─────────

const HISTORY_MAX = 10;

export interface RunTotals {
  runs: number;
  wins: number;
  /** 가장 빨리 클리어한 시간 (틱), 없으면 0 */
  fastestWin: number;
}

export function loadHistory(): BestRecord[] {
  try {
    const raw = loadText("history");
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? (list as BestRecord[]) : [];
  } catch {
    return [];
  }
}

/** 혼자 하기 판 시작 정보: 업적 + 처음 몇 판은 특별한 방 단계적 열기 표시 (sim/intro, 무한·아레나·영웅은 빼고) */
export function soloUnlocks(plain: boolean): string[] {
  const runs = loadTotals().runs;
  return plain && runs < INTRO_RULES.SECRET ? [...loadAchievements(), `intro:${runs}`] : loadAchievements();
}

export function loadTotals(): RunTotals {
  try {
    const raw = loadText("totals");
    const v = raw ? (JSON.parse(raw) as Partial<RunTotals>) : {};
    return { runs: v.runs ?? 0, wins: v.wins ?? 0, fastestWin: v.fastestWin ?? 0 };
  } catch {
    return { runs: 0, wins: 0, fastestWin: 0 };
  }
}

/** 끝난 판 하나를 기록 (최근 10판 + 누적 판 수·클리어 수·최단 클리어) */
export function addHistory(rec: BestRecord): void {
  saveText("history", JSON.stringify([rec, ...loadHistory()].slice(0, HISTORY_MAX)));
  const t = loadTotals();
  t.runs++;
  if (rec.won) {
    t.wins++;
    if (t.fastestWin === 0 || rec.ticks < t.fastestWin) t.fastestWin = rec.ticks;
  }
  saveText("totals", JSON.stringify(t));
}

// ───────── 튜토리얼 ─────────

export function isTutorialDone(): boolean {
  return loadText("tutorialDone") === "1";
}

export function markTutorialDone(): void {
  saveText("tutorialDone", "1");
}

// ───────── 업적 ─────────

export function loadAchievements(): string[] {
  try {
    const raw = loadText("achievements");
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** 새로 얻은 업적 저장. 저장 후 전체 목록 */
export function addAchievements(ids: readonly string[]): string[] {
  const all = loadAchievements();
  for (const id of ids) if (!all.includes(id)) all.push(id);
  saveText("achievements", JSON.stringify(all));
  return all;
}

// ───────── 누적 기록 (누적 업적용, 이 기기에만) ─────────

/** 처음에는 예전 누적 판 수·클리어 수(혼자 하기)에서 시작 */
export function loadCareer(): CareerStats {
  try {
    const raw = loadText("career");
    if (!raw) {
      const t = loadTotals();
      return { ...EMPTY_CAREER, runs: t.runs, wins: t.wins };
    }
    const v = JSON.parse(raw) as Partial<CareerStats>;
    const num = (x: unknown) => (typeof x === "number" && x >= 0 ? x : 0);
    return {
      runs: num(v.runs),
      wins: num(v.wins),
      kills: num(v.kills),
      bossKills: num(v.bossKills),
      goldEarned: num(v.goldEarned),
      purchases: num(v.purchases),
      clearedBy: typeof v.clearedBy === "object" && v.clearedBy ? v.clearedBy : {},
    };
  } catch {
    return { ...EMPTY_CAREER };
  }
}

/** 끝난 판을 누적 기록에 더함 */
export function addCareer(run: RunState): void {
  saveText("career", JSON.stringify(careerWith(loadCareer(), run)));
}
