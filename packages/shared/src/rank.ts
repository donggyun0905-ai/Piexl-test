// 패왕전 랭크전 (화면·서버 공용): 대결 둘(1대1 · 3대3) · 점수 → 티어 · 이기고 진 점수 · 자리 배치
// 티어: 흙 · 돌 · 청동 · 은 · 금 · 수정 (각 III → II → I, 100점마다) → 성좌 → 패왕(성좌 중 상위 10명)
import type { PwMode } from "./paewangDefs";
import { draftTurns, PW_DRAFT_SEC } from "./pwDraft";

export type RankQueue = "solo" | "team";
export const RANK_QUEUES: readonly RankQueue[] = ["solo", "team"];
/** 랭크전 대결 → 패왕전 모드 */
export const RANK_MODE: Record<RankQueue, PwMode> = { solo: "duel", team: "trio" };
/** 랭크전 방 사람 수 (나머지 자리는 AI) */
export const RANK_SEATS: Record<RankQueue, number> = { solo: 2, team: 6 };
/** 랭크전 밴픽에 주는 시간 (ms): 모든 차례가 제한 시간을 다 써도 끝날 만큼. 다 고르면 방장이 알려 바로 시작 */
export const rankDraftMs = (queue: RankQueue): number => draftTurns(RANK_MODE[queue]).length * PW_DRAFT_SEC * 1000 + 5000;

export const RANK = {
  /** 처음 점수 */
  start: 1000,
  /** 한 판에 오르내리는 크기: 사람끼리 · AI가 섞인 판(조작·쉬운 상대 막기) */
  k: 40,
  kAi: 14,
  /** AI 자리의 점수 (상대 평균에 들어감) */
  aiRating: 1000,
  /** 흙 III가 시작하는 점수 · 한 단계 점수 · 단계 수(III·II·I) */
  base: 700,
  step: 100,
  divisions: 3,
  /** 패왕: 성좌 중 순위표 상위 몇 명 */
  topN: 10,
  /** 순위표 크기 */
  board: 50,
  /** 사람이 다 안 모이면 이만큼 기다렸다 AI를 채워 시작 (ms) */
  waitMs: 20_000,
  /** 첫 결과가 온 뒤 다른 사람 결과를 기다리는 시간 (ms) */
  reportMs: 30_000,
};

export const RANK_TIERS = ["clay", "stone", "bronze", "silver", "gold", "crystal", "star", "overlord"] as const;
export type RankTier = (typeof RANK_TIERS)[number];

export interface RankInfo {
  tier: RankTier;
  /** 단계 3·2·1 (성좌·패왕은 0) */
  div: number;
  /** 이 단계 안의 점수 (0~99, 성좌·패왕은 성좌 시작부터) */
  lp: number;
}

/** 단계로 나뉘는 티어 수 (흙~수정) */
const DIV_TIERS = 6;

/** 점수 → 티어 (place: 순위표 순위, 성좌 중 상위 topN이면 패왕) */
export function rankOf(rating: number, place = 0): RankInfo {
  const steps = DIV_TIERS * RANK.divisions;
  const k = Math.max(0, Math.floor((rating - RANK.base) / RANK.step));
  if (k >= steps) {
    const lp = Math.round(rating - (RANK.base + steps * RANK.step));
    return { tier: place > 0 && place <= RANK.topN ? "overlord" : "star", div: 0, lp };
  }
  const lp = rating < RANK.base ? 0 : Math.round(rating - RANK.base - k * RANK.step);
  return { tier: RANK_TIERS[Math.floor(k / RANK.divisions)]!, div: RANK.divisions - (k % RANK.divisions), lp };
}

/** 이길 확률 기대값으로 오르내리는 점수 (지면 음수) */
export function rankDelta(mine: number, foe: number, won: boolean, k: number): number {
  const expect = 1 / (1 + 10 ** ((foe - mine) / 400));
  return Math.round(k * ((won ? 1 : 0) - expect));
}

/** 자리 배치: 사람은 들어온 순서대로 두 편에 번갈아 (1대1은 0·1번 자리). 빈 자리("")는 AI */
export function rankSeats(queue: RankQueue, pids: readonly string[]): string[] {
  const size = queue === "solo" ? 1 : 3;
  const seats = Array.from({ length: size * 2 }, () => "");
  const used = [0, 0];
  for (const pid of pids.slice(0, RANK_SEATS[queue])) {
    const team = used[0]! <= used[1]! ? 0 : 1;
    seats[team * size + used[team]!] = pid;
    used[team]!++;
  }
  return seats;
}

/** 자리 번호 → 편 (rankSeats 기준) */
export const rankTeam = (queue: RankQueue, seat: number): number => (seat < (queue === "solo" ? 1 : 3) ? 0 : 1);

export interface RankEntry {
  pid: string;
  team: number;
  /** 끝나기 전에 나감 (진 것으로) */
  left: boolean;
}

export interface RankChange {
  pid: string;
  before: number;
  after: number;
  won: boolean;
}

/** 한 판 결과로 사람마다 점수 변화 (ratings: 지금 점수, ai: 편마다 AI 수) */
export function rankResults(entries: readonly RankEntry[], ratings: ReadonlyMap<string, number>, winner: number, ai: readonly number[]): RankChange[] {
  const avg = (team: number) => {
    const list = entries.filter((e) => e.team === team).map((e) => ratings.get(e.pid) ?? RANK.start);
    for (let i = 0; i < (ai[team] ?? 0); i++) list.push(RANK.aiRating);
    return list.length ? list.reduce((a, b) => a + b, 0) / list.length : RANK.aiRating;
  };
  const k = ai.some((n) => n > 0) ? RANK.kAi : RANK.k;
  return entries.map((e) => {
    const before = ratings.get(e.pid) ?? RANK.start;
    const won = !e.left && e.team === winner;
    return { pid: e.pid, before, after: Math.max(0, before + rankDelta(before, avg(1 - e.team), won, k)), won };
  });
}
