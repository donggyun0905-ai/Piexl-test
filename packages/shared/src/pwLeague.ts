// 패왕전 월드 워 리그 (docs/PW_MODES.md 4): 8팀 대회 (8강 → 4강 → 결승). 0번 팀 = 나와 AI 넷, 나머지는 AI 팀
// 판마다 두 팀이 대결 유형을 하나씩 고르고, 다르면 둘 중 무작위 · 내 경기가 아닌 판은 관전하거나 결과만 봄(팀 힘으로 시드 무작위)
// 화면 전용 진행 (판 계산은 sim/pvp가 함). 무작위는 리그 시드로만
import { CHARACTER_IDS, type CharacterId } from "./characters";
import type { PwMode } from "./paewangDefs";
import { createRng, deriveSeed } from "./rng";

/** 고를 수 있는 대결: 5대5 · 토너먼트 · 전쟁의 서막 · 점령전 */
export const LEAGUE_MODES: readonly PwMode[] = ["squad", "tourney", "war", "capture"];
/** 라운드마다 이긴 팀이 받는 칩 · 우승 칩 */
export const LEAGUE_CHIPS = [6000, 12000, 30000];

export interface LeagueTeam {
  /** 팀 이름 번호 (화면 글자 pwLeagueTeam0~) · 대표 캐릭터 · 힘 (AI끼리 결과) */
  name: number;
  chars: CharacterId[];
  power: number;
}

export interface LeagueMatch {
  a: number;
  b: number;
  mode?: PwMode;
  winner?: number;
}

export interface League {
  seed: number;
  teams: LeagueTeam[];
  /** 라운드마다 경기 (0 = 8강) */
  rounds: LeagueMatch[][];
}

export function createLeague(seed: number): League {
  const rng = createRng(deriveSeed(seed, "league"));
  const pool = Array.from({ length: 12 }, (_, i) => i);
  const names = Array.from({ length: 8 }, () => pool.splice(rng.int(0, pool.length - 1), 1)[0]!);
  const teams = names.map((name, i): LeagueTeam => ({ name, chars: Array.from({ length: 5 }, () => rng.pick(CHARACTER_IDS)), power: i === 0 ? 1 : 0.8 + rng.nextFloat() * 0.4 }));
  return { seed, teams, rounds: [[0, 1, 2, 3].map((k) => ({ a: k * 2, b: k * 2 + 1 }))] };
}

/** 지금 라운드 번호 · 내(0번 팀) 경기 */
export const leagueRound = (l: League): number => l.rounds.length - 1;
export const myMatch = (l: League): LeagueMatch | undefined => l.rounds[leagueRound(l)]!.find((m) => m.a === 0 || m.b === 0);

/** 대결 유형 정하기: 두 팀의 선택이 다르면 둘 중 무작위 (AI 팀은 무작위로 고름) */
export function decideMode(l: League, m: LeagueMatch, mine?: PwMode): PwMode {
  const rng = createRng(deriveSeed(l.seed, "leagueMode", leagueRound(l), m.a, m.b));
  const pa = m.a === 0 && mine ? mine : rng.pick(LEAGUE_MODES);
  const pb = m.b === 0 && mine ? mine : rng.pick(LEAGUE_MODES);
  return pa === pb ? pa : rng.nextFloat() < 0.5 ? pa : pb;
}

/** AI 팀끼리 결과만 볼 때: 힘으로 시드 무작위 */
export function quickWinner(l: League, m: LeagueMatch): number {
  const ta = l.teams[m.a]!.power;
  const tb = l.teams[m.b]!.power;
  return createRng(deriveSeed(l.seed, "leagueQuick", leagueRound(l), m.a, m.b)).nextFloat() < ta / (ta + tb) ? m.a : m.b;
}

/** 라운드가 다 끝났으면 다음 라운드를 엶 (결승이 끝나면 그대로) · 우승 팀 (아직이면 undefined) */
export function advanceLeague(l: League): number | undefined {
  const cur = l.rounds[leagueRound(l)]!;
  if (cur.some((m) => m.winner === undefined)) return undefined;
  if (cur.length === 1) return cur[0]!.winner;
  const next: LeagueMatch[] = [];
  for (let k = 0; k < cur.length; k += 2) next.push({ a: cur[k]!.winner!, b: cur[k + 1]!.winner! });
  l.rounds.push(next);
  return undefined;
}

/** 0번 팀이 떨어졌는지 */
export const leagueOut = (l: League): boolean => l.rounds.some((r) => r.some((m) => (m.a === 0 || m.b === 0) && m.winner !== undefined && m.winner !== 0));
