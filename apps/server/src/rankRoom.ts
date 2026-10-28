// 랭크전 방 규칙 (roomLogic이 부름): 사람마다 화면에서 본 이긴 편을 받아, 모두 같으면 점수 반영할 판 결과를 만듦.
// 나간 사람은 진 것으로. 결과가 서로 다르면 반영하지 않음 (조작 막기)
import { RANK, rankSeats, rankTeam, type RankEntry, type RankQueue } from "@pixel-rogue/shared";
import type { RoomData } from "./roomLogic";

/** Hub에 넘길 한 판 결과 */
export interface RankJob {
  queue: RankQueue;
  entries: RankEntry[];
  winner: number;
  /** 편마다 AI 수 */
  ai: number[];
}

/** 결과 하나 받기. 모두(연결된 사람) 보냈으면 true */
export function rankReport(d: RoomData, pid: string, winner: unknown, now: number): boolean {
  if (!d.rank || d.phase === "lobby" || d.rankDone || (winner !== 0 && winner !== 1)) return false;
  const p = d.players.find((x) => x.pid === pid);
  if (!p || p.state === "watch") return false;
  (d.reports ??= {})[pid] = winner;
  if (!d.reportBy) d.reportBy = now + RANK.reportMs;
  return d.players.filter((x) => x.connected && x.state !== "watch").every((x) => d.reports![x.pid] !== undefined);
}

/** 결과 정하기 (한 번만): 받은 결과가 모두 같으면 판 결과, 아니면 null */
export function rankFinish(d: RoomData): RankJob | null {
  const queue = d.rank;
  if (!queue || d.rankDone) return null;
  d.rankDone = true;
  d.reportBy = 0;
  const reports = d.reports ?? {};
  const votes = Object.values(reports);
  if (votes.length === 0 || votes.some((v) => v !== votes[0])) return null;
  const seats = rankSeats(queue, d.players.map((p) => p.pid));
  const entries: RankEntry[] = [];
  const ai = [0, 0];
  seats.forEach((pid, i) => {
    const team = rankTeam(queue, i);
    if (!pid) return void ai[team]!++;
    const p = d.players.find((x) => x.pid === pid);
    entries.push({ pid, team, left: !p?.connected || reports[pid] === undefined });
  });
  return { queue, entries, winner: votes[0]!, ai };
}
