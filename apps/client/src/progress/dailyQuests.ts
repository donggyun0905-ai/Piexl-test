// 긴급 퀘스트 (일일, 2026-11-15 사용자): 하루(한국 시간) 3개 · 갈 수 있는 사냥터에서 몬스터 잡기 또는 나무 베기(F) · 날짜 시드로 누구나 같은 목록
// 그날 센 수만 셈 (이 기기 저장 "dailyQuests", 날이 바뀌면 처음부터) · 이루면 '받기' → 칩
import { createRng, dayKey, deriveSeed } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { HUNT_GROUNDS } from "../world/hunt/huntGrounds";
import { fieldOpen, REGIONS } from "../world/worldPlaces";
import { giveReward, REWARD_RULES, type Reward } from "./rewards";

const KEY = "dailyQuests";
export type Daily = { id: string; hunt: string; n: number } | { id: string; wood: true; n: number };
interface DState {
  day: string;
  kills: Record<string, number>;
  wood: number;
  claimed: string[];
}

const today = () => dayKey(Date.now());
function load(): DState {
  try {
    const v = JSON.parse(loadText(KEY) ?? "null") as DState | null;
    if (v && v.day === today()) return v;
  } catch {
    /* 새 날 */
  }
  return { day: today(), kills: {}, wood: 0, claimed: [] };
}
const save = (s: DState) => saveText(KEY, JSON.stringify(s));

/** 오늘의 긴급 퀘스트 3개: 갈 수 있는 사냥터(보스 빼고) 둘 + 나무 하나 (사냥터가 모자라면 나무로) */
export function dailyList(day = today()): Daily[] {
  const rng = createRng(deriveSeed(17, "daily", day));
  const pool = HUNT_GROUNDS.filter((g) => !g.boss && fieldOpen(REGIONS[g.region]));
  const out: Daily[] = [];
  for (let k = 0; k < 2 && pool.length; k++) {
    const g = pool.splice(Math.floor(rng.nextFloat() * pool.length), 1)[0]!;
    out.push({ id: `d_${g.id}`, hunt: g.id, n: 6 + Math.floor(rng.nextFloat() * 5) });
  }
  out.push({ id: "d_wood", wood: true, n: 6 + Math.floor(rng.nextFloat() * 5) });
  while (out.length < 3) out.push({ id: `d_wood${out.length}`, wood: true, n: 4 });
  return out;
}

export const dailyCount = (d: Daily): number => Math.min(d.n, "hunt" in d ? (load().kills[d.hunt] ?? 0) : load().wood);
export const dailyClaimed = (d: Daily): boolean => load().claimed.includes(d.id);

export function noteDailyKill(g: string): void {
  const s = load();
  save({ ...s, kills: { ...s.kills, [g]: (s.kills[g] ?? 0) + 1 } });
}
export function noteDailyWood(): void {
  const s = load();
  save({ ...s, wood: s.wood + 1 });
}
export function claimDaily(id: string): Reward | null {
  const d = dailyList().find((x) => x.id === id);
  if (!d || dailyCount(d) < d.n || dailyClaimed(d)) return null;
  const s = load();
  save({ ...s, claimed: [...s.claimed, id] });
  return giveReward(REWARD_RULES.dailyChips);
}
