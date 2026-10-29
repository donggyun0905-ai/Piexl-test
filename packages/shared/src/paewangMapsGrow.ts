// 패왕전 성장 대결 경기장: 쟁탈전 (docs/pw-maps/contest.png 초안: 대각선 한 줄 길 · 가운데 네모 점령지 · 편마다 포탑 둘 · 양 끝 깃발 집)
// 전쟁의 서막 (docs/pw-maps/war-prelude.png 초안: 큰 네모 · 길 셋(위·가운데 대각선·아래) · 귀퉁이·가운데 체크포인트 · 물가 · 안개 지역 넷)
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

/** 전쟁의 서막: 90×90. 대각선(x↔y) 거울로 공평하게 (A 집 왼쪽 아래 ↔ B 집 오른쪽 위) */
const W = 90;
const flip = ([c, r]: Spot): Spot => [r, c];
const WAR_HOME: Spot = [6, 83];
/** 길마다 A 쪽 포탑 (뒤, 앞) · 위 길은 왼쪽 줄, 아래 길은 아래 줄, 가운데는 대각선 */
const WAR_A_TOWERS: Spot[][] = [[[6, 68], [6, 50]], [[20, 69], [32, 57]], [[21, 83], [39, 83]]];
const WAR_POINTS: Spot[] = [[6, 6], [44, 44], [83, 83]];
const warLanes = WAR_A_TOWERS.map((ts, k) => [WAR_HOME, ...ts, WAR_POINTS[k]!, ...[...ts].reverse().map(flip), flip(WAR_HOME)]);
// 안쪽 벽: 바깥 길과 안쪽을 가르는 낮은 담 (입구 여럿) · 물가: 왼쪽 위 → 오른쪽 아래 띠 · 안개: 대각선 둘이 나눈 삼각형 넷
const warWalls: Rect[] = [[11, 15, 1, 22], [11, 52, 1, 22], [78, 15, 1, 22], [78, 52, 1, 22]];
warWalls.push(...warWalls.map(([c, r, w, h]): Rect => [r, c, h, w]));
const warWater: Rect[] = [];
for (let r = 12; r <= 77; r++) if (Math.abs(r - 44.5) > 5) warWater.push([r - 3, r, 7, 1]);
const tri = (rows: [number, number], span: (r: number) => [number, number]): Rect[] => {
  const out: Rect[] = [];
  for (let r = rows[0]; r <= rows[1]; r++) {
    const [a, b] = span(r);
    if (b > a) out.push([a, r, b - a, 1]);
  }
  return out;
};
const FOG_TOP = tri([12, 38], (r) => [r + 6, W - 1 - r - 6]);
const FOG_LEFT = tri([18, 71], (r) => [12, Math.min(r - 5, W - 1 - r - 5)]);
// 위(1) 아래(2) 오른쪽(3) 왼쪽(4): 아래는 위를 위아래로, 오른쪽은 왼쪽을 좌우로 뒤집음
const FOG_BOTTOM = FOG_TOP.map(([c, r, w, h]): Rect => [c, W - 1 - r, w, h]);
const FOG_RIGHT = FOG_LEFT.map(([c, r, w, h]): Rect => [W - c - w, r, w, h]);

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
  /** 전쟁의 서막: 아스칼론 진영과 엘프 진영의 전쟁 */
  gWar: {
    ...base,
    cols: W,
    rows: W,
    walls: warWalls,
    rocks: [[30, 20, 2, 2], [20, 30, 2, 2], [58, 68, 2, 2], [68, 58, 2, 2]],
    water: warWater,
    teamA: [WAR_HOME, [4, 81], [8, 85], [4, 85], [8, 81]],
    teamB: [WAR_HOME, [4, 81], [8, 85], [4, 85], [8, 81]].map((sp) => flip(sp as Spot)),
    homes: [WAR_HOME, flip(WAR_HOME)],
    lanes: warLanes,
    towers: WAR_A_TOWERS.flatMap((ts, lane) => ts.flatMap((at, k) => [
      { team: 0 as const, at, lane, order: 1 - k },
      { team: 1 as const, at: flip(at), lane, order: 1 - k },
    ])),
    points: WAR_POINTS.map((at, lane) => ({ at, lane })),
    fogs: [FOG_TOP, FOG_BOTTOM, FOG_RIGHT, FOG_LEFT],
    camps: [
      { kind: "dragon", at: [44, 22] },
      { kind: "godeater", at: [44, 67] },
      { kind: "elite", at: [70, 44] },
      { kind: "elite", at: [19, 44] },
      { kind: "jungle", at: [64, 36] },
      { kind: "jungle", at: [64, 52] },
      { kind: "jungle", at: [25, 36] },
      { kind: "jungle", at: [25, 52] },
    ],
  },
} satisfies Record<string, PwArenaDef>;
