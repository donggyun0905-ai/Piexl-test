// 서브 퀘스트 (2026-11-15 사용자: 메인=필수 · 서브 · 긴급): 사냥터마다 · 필드 보스마다 · 지도 최종보스마다 하나씩, 그 나라에 갈 수 있으면 보임 · 순서 없음
// 할 일을 이루면 기록서·Tab에서 '받기' → 보상(칩) · 저장은 퀘스트 저장의 side 묶음 (서버 백업 "quests"에 같이)
import type { LastBossKind } from "@pixel-rogue/shared";
import { BOSS_GATES } from "../world/bossGates";
import { HUNT_GROUNDS } from "../world/hunt/huntGrounds";
import { fieldOpen, REGIONS } from "../world/worldPlaces";
import { killsAt, rawQuests, saveQuestPart } from "./quest";
import { giveReward, REWARD_RULES, type Reward } from "./rewards";

/** side 묶음: 받은 서브 퀘스트 · 잡은 최종보스 · 벤 나무 수 */
interface Side {
  subs: string[];
  wins: string[];
  wood: number;
}
function loadSide(): Side {
  const v = (rawQuests().side ?? {}) as Partial<Side>;
  return { subs: v.subs ?? [], wins: v.wins ?? [], wood: v.wood ?? 0 };
}
const saveSide = (s: Side) => saveQuestPart("side", s);

export type SubCond = { hunt: string; n: number } | { bossWin: LastBossKind };
export interface SubQuest {
  id: string;
  region: string;
  cond: SubCond;
  chips: number;
}

/** 서브 퀘스트 표: 사냥터(15마리) · 필드 보스(1마리) · 최종보스(1번) */
export const SUB_QUESTS: readonly SubQuest[] = [
  ...HUNT_GROUNDS.map((g): SubQuest => ({ id: `s_${g.id}`, region: g.region, cond: { hunt: g.id, n: g.boss ? 1 : 15 }, chips: g.boss ? REWARD_RULES.subBossChips : REWARD_RULES.subChips })),
  ...BOSS_GATES.map((b): SubQuest => ({ id: `b_${b.boss}`, region: b.region, cond: { bossWin: b.boss }, chips: REWARD_RULES.subFinalChips })),
];

export const subProgress = (q: SubQuest): [number, number] => ("hunt" in q.cond ? [Math.min(q.cond.n, killsAt(q.cond.hunt)), q.cond.n] : [loadSide().wins.includes(q.cond.bossWin) ? 1 : 0, 1]);
export const subMet = (q: SubQuest): boolean => subProgress(q)[0] >= subProgress(q)[1];
export const subClaimed = (q: SubQuest): boolean => loadSide().subs.includes(q.id);
/** 보이는 서브 퀘스트: 그 나라에 갈 수 있고 아직 안 받은 것 */
export const openSubs = (): SubQuest[] => SUB_QUESTS.filter((q) => fieldOpen(REGIONS[q.region]) && !subClaimed(q));

export function claimSub(id: string): Reward | null {
  const q = SUB_QUESTS.find((x) => x.id === id);
  if (!q || !subMet(q) || subClaimed(q)) return null;
  const s = loadSide();
  saveSide({ ...s, subs: [...s.subs, id] });
  return giveReward(q.chips);
}

/** 지도 최종보스를 잡음 */
export function noteBossWin(boss: LastBossKind): void {
  const s = loadSide();
  if (!s.wins.includes(boss)) saveSide({ ...s, wins: [...s.wins, boss] });
}
export const bossWon = (boss: LastBossKind): boolean => loadSide().wins.includes(boss);

/** 나무를 하나 벰 (모은 나무 수) */
export function noteWood(): number {
  const s = loadSide();
  saveSide({ ...s, wood: s.wood + 1 });
  return s.wood + 1;
}
export const woodTotal = (): number => loadSide().wood;
