// 패왕전 기간토마키아 경기장: 라스트 보스 방의 가로·세로 8배 (232×136칸). 바위·연못·수풀은 정해진 시드로 흩뿌림 (늘 같은 맵)
// 30명이 흩어져 시작 · 뿔 거인·도깨비·상자 자리는 sim/pwGiga가 판 시드로 고름
import { NONE, type PwArenaDef, type Rect, type Spot } from "./paewangMapKit";
import { PW_GIGA } from "./pwRules";

const C = PW_GIGA.cols;
const R = PW_GIGA.rows;
let seed = 20261030;
const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const scatter = (n: number, w: [number, number], h: [number, number]): Rect[] =>
  Array.from({ length: n }, (): Rect => {
    const ww = w[0] + Math.floor(rand() * (w[1] - w[0] + 1));
    const hh = h[0] + Math.floor(rand() * (h[1] - h[0] + 1));
    return [2 + Math.floor(rand() * (C - ww - 4)), 2 + Math.floor(rand() * (R - hh - 4)), ww, hh];
  });
/** 시작 자리 30: 6 × 5 격자에 조금씩 비껴 */
const spots: Spot[] = [];
for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) spots.push([Math.round(((c + 0.5) * C) / 6), Math.round(((r + 0.5) * R) / 5)]);
const clear = ([c, r, w, h]: Rect) => !spots.some(([x, y]) => x >= c - 2 && x < c + w + 2 && y >= r - 2 && y < r + h + 2);

export const GIGA_ARENAS = {
  /** 거인들의 땅 */
  gGiga: {
    cols: C,
    rows: R,
    walls: scatter(40, [1, 6], [1, 6]).filter(clear),
    rocks: scatter(260, [1, 2], [1, 2]).filter(clear),
    ponds: scatter(26, [3, 7], [2, 5]).filter(clear),
    bushes: scatter(120, [2, 4], [2, 3]).filter(clear),
    traps: NONE,
    decks: NONE,
    mud: scatter(18, [5, 10], [4, 8]).filter(clear),
    water: scatter(14, [6, 12], [4, 7]).filter(clear),
    teamA: NONE,
    teamB: NONE,
    spots,
  },
} satisfies Record<string, PwArenaDef>;
