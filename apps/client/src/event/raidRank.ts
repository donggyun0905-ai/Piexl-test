// 레이드(이벤트 보스) 랭킹 서버 요청: 보상 상자가 열릴 때 내 기록 보내기 · 순위표 받기 (서버 eraidApi)
import { allPlayers, type RunState } from "@pixel-rogue/shared";
import { apiGet, apiPost } from "../api";
import { getPlayerId, loadNickname } from "../player";

export interface RaidRankEntry {
  rank: number;
  nickname: string;
  ticks: number;
  character: string;
  party: string[];
  humans: number;
}
export type RaidRankBoards = Record<string, RaidRankEntry[]>;

/** 이번 판 기록 보내기 (me: 내 자리) → 지금 순위 (서버가 안 되면 null) */
export async function submitRaidClear(run: RunState, me: number): Promise<{ ticks: number; rank: number | null } | null> {
  const rb = run.raidBoss;
  const players = allPlayers(run);
  const mine = players[me];
  if (!rb || !mine) return null;
  const ticks = rb.fightTicks ?? 0;
  const res = await apiPost<{ rank: number | null }>("/api/eraid/submit", {
    player: getPlayerId(),
    nickname: loadNickname(),
    boss: rb.boss,
    ticks,
    character: mine.characterId,
    party: players.map((p) => p.characterId),
    humans: Math.max(1, rb.ai.filter((a) => !a).length),
  });
  return res.ok ? { ticks, rank: res.data?.rank ?? null } : null;
}

export async function loadRaidRank(): Promise<RaidRankBoards | null> {
  const res = await apiGet<{ boards: RaidRankBoards }>("/api/eraid/board");
  return res.ok && res.data ? res.data.boards : null;
}
