// 패왕전 성장 대결 경기장: 쟁탈전 (docs/pw-maps/contest.png 초안: 대각선 한 줄 길 · 가운데 네모 점령지 · 편마다 포탑 둘 · 양 끝 깃발 집)
// 내 편(A)은 왼쪽 아래 집, 상대 편(B)은 오른쪽 위 집. 계산은 sim/pwGrow·pwLane·pwContest
import { carve, NONE, type PwArenaDef, type Rect, type Spot } from "./paewangMapKit";

const base = { rocks: NONE, ponds: NONE, bushes: NONE, traps: NONE, decks: NONE, spots: NONE } as const;

/** 가운데를 지나는 점 대칭 (A 쪽만 적으면 B 쪽) */
const mirror = (n: number, [c, r]: Spot): Spot => [n - 1 - c, n - 1 - r];

const N = 72;
const contestOpen: Rect[] = [[2, 55, 15, 15], [55, 2, 15, 15], [24, 24, 24, 24]];
// 대각선 길: 줄마다 가운데 칸 둘레 13칸
for (let r = 1; r < N - 1; r++) contestOpen.push([Math.max(1, N - 1 - r - 6), r, 13, 1]);
const CONTEST_HOME: Spot = [9, 62];
const CONTEST_TOWERS: Spot[] = [[16, 55], [22, 49]];
const CONTEST_A: Spot[] = [CONTEST_HOME, [7, 60], [11, 64], [7, 64], [11, 60]];

export const GROW_ARENAS = {
  /** 쟁탈전: 신의 제단 */
  gContest: {
    ...base,
    cols: N,
    rows: N,
    walls: carve(N, N, contestOpen),
    teamA: CONTEST_A,
    teamB: CONTEST_A.map((sp) => mirror(N, sp)),
    zone: { rect: [29, 29, 14, 14] },
    homes: [CONTEST_HOME, mirror(N, CONTEST_HOME)],
    lanes: [[CONTEST_HOME, ...CONTEST_TOWERS, [35, 36], ...[...CONTEST_TOWERS].reverse().map((sp) => mirror(N, sp)), mirror(N, CONTEST_HOME)]],
    towers: CONTEST_TOWERS.flatMap((at, k) => [
      { team: 0 as const, at, lane: 0, order: 1 - k },
      { team: 1 as const, at: mirror(N, at), lane: 0, order: 1 - k },
    ]),
  },
} satisfies Record<string, PwArenaDef>;
