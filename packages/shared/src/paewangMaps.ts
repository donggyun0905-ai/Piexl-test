// 패왕전 경기장 (계산은 sim/paewangGrid·paewangField): 처음 5개 + paewangMapsSmall·paewangMapsBig. 칸 좌표 [열, 행, 너비, 높이], 자리는 [열, 행]
// 벽(walls)·나무와 바위(rocks)·물(ponds)은 막힘 · 수풀(bushes)은 숨는 곳 · 함정(traps) · 2층 발판(decks: 난간과 계단이 있는 높은 곳)

import { NONE, type PwArenaDef, type Rect, type Spot } from "./paewangMapKit";
import { BIG_ARENAS } from "./paewangMapsBig";
import { SMALL_ARENAS } from "./paewangMapsSmall";
import { CAPTURE_ARENAS } from "./paewangMapsCapture";
import { GROW_ARENAS } from "./paewangMapsGrow";

export type { PwArenaDef } from "./paewangMapKit";

/** 숲 나무: 줄마다 엇갈리게, 몇 그루는 큰 나무(2×2) */
function forestTrees(): Rect[] {
  const out: Rect[] = [];
  for (let r = 4; r <= 35; r += 4) {
    for (let c = 10; c <= 52; c += 6) {
      const cc = c + ((r / 4) % 2) * 3;
      const big = (cc * 7 + r * 13) % 5 === 0;
      out.push([cc, r, big ? 2 : 1, big ? 2 : 1]);
    }
  }
  return out;
}

function forestBushes(): Rect[] {
  const out: Rect[] = [];
  for (let r = 6; r <= 32; r += 8) for (let c = 12; c <= 50; c += 9) out.push([c + 2, r + 1, 3, 2]);
  return out;
}

const FIELD_SPOTS: Spot[] = [];
for (const r of [6, 15, 25, 34]) for (const c of [8, 20, 32, 44, 56]) FIELD_SPOTS.push([c, r]);
// 나는 가운데 쪽에서
FIELD_SPOTS.unshift(...FIELD_SPOTS.splice(FIELD_SPOTS.findIndex(([c, r]) => c === 32 && r === 15), 1));

const BASE_ARENAS = {
  /** 작은 경기장: 기둥 넷 */
  small: {
    cols: 21,
    rows: 13,
    walls: NONE,
    rocks: [[6, 4, 1, 1], [14, 4, 1, 1], [6, 8, 1, 1], [14, 8, 1, 1]],
    ponds: NONE,
    bushes: NONE,
    traps: NONE,
    decks: NONE,
    teamA: [[3, 6], [3, 3], [3, 9]],
    teamB: [[17, 6], [17, 3], [17, 9]],
    spots: NONE,
  },
  /** 넓은 경기장: 바위 몇 개와 가운데 낮은 담, 구석 수풀 */
  wide: {
    cols: 33,
    rows: 19,
    walls: [[16, 2, 1, 3], [16, 14, 1, 3]],
    rocks: [[10, 5, 2, 2], [21, 5, 2, 2], [10, 12, 2, 2], [21, 12, 2, 2], [16, 9, 1, 1]],
    ponds: NONE,
    bushes: [[3, 1, 3, 2], [27, 16, 3, 2], [15, 6, 3, 2], [15, 11, 3, 2]],
    traps: NONE,
    decks: NONE,
    teamA: [[3, 9], [3, 5], [3, 13]],
    teamB: [[29, 9], [29, 5], [29, 13]],
    spots: NONE,
  },
  /** 우거진 숲: 나무가 빽빽하고 수풀·연못·가시 함정 */
  forest: {
    cols: 64,
    rows: 40,
    walls: NONE,
    rocks: forestTrees(),
    ponds: [[28, 1, 6, 2], [30, 37, 5, 2]],
    bushes: forestBushes(),
    traps: [[20, 10, 2, 2], [42, 10, 2, 2], [20, 28, 2, 2], [42, 28, 2, 2], [31, 19, 2, 2], [8, 6, 2, 2], [54, 32, 2, 2]],
    decks: NONE,
    teamA: [[4, 20], [4, 16], [4, 24], [6, 12], [6, 28]],
    teamB: [[59, 20], [59, 16], [59, 24], [57, 12], [57, 28]],
    spots: NONE,
  },
  /** 큰 들판: 막힌 곳 없이 탁 트임 (아이템이 떨어짐) */
  field: {
    cols: 64,
    rows: 40,
    walls: NONE,
    rocks: NONE,
    ponds: NONE,
    bushes: NONE,
    traps: NONE,
    decks: NONE,
    teamA: NONE,
    teamB: NONE,
    spots: FIELD_SPOTS,
  },
  /** 저택: 방이 나뉜 집 · 정원 수풀(숨는 곳) · 계단으로 오르는 2층 발판 둘 */
  manor: {
    cols: 48,
    rows: 30,
    walls: [
      // 집 테두리 (문 넷)
      [14, 6, 9, 1], [25, 6, 9, 1], [14, 23, 9, 1], [25, 23, 9, 1],
      [14, 7, 1, 6], [14, 15, 1, 8], [33, 7, 1, 6], [33, 15, 1, 8],
      // 집 안 방 나누기
      [23, 7, 1, 5], [23, 18, 1, 5], [15, 14, 6, 1], [27, 14, 6, 1],
      // 2층 발판 난간 (계단 자리는 비움)
      [10, 3, 1, 4], [3, 8, 6, 1], [37, 22, 1, 4], [37, 21, 7, 1],
    ],
    rocks: [[11, 15, 1, 1], [36, 12, 1, 1], [28, 10, 1, 1], [18, 19, 1, 1]],
    ponds: NONE,
    bushes: [[2, 12, 3, 4], [43, 8, 3, 4], [20, 26, 6, 2], [38, 2, 4, 2], [7, 24, 3, 3], [15, 8, 2, 2], [31, 20, 2, 2]],
    traps: NONE,
    decks: [[3, 3, 7, 5], [38, 22, 7, 5]],
    teamA: NONE,
    teamB: NONE,
    spots: [[24, 3], [5, 14], [43, 15], [24, 27], [29, 10], [19, 19], [6, 5], [41, 24]],
  },
  /** 연습장 전용: 장애물 없는 초원 (대결 경기장 목록에는 없음) */
  practice: {
    cols: 33,
    rows: 19,
    walls: NONE,
    rocks: NONE,
    ponds: NONE,
    bushes: NONE,
    traps: NONE,
    decks: NONE,
    teamA: [[8, 9], [4, 5], [4, 13]],
    teamB: [[20, 9], [20, 5], [20, 13]],
    spots: NONE,
  },
} satisfies Record<string, PwArenaDef>;

/** 모든 경기장 (처음 5개 + 작은·중간 + 큰 + 점령전) */
const ALL_ARENAS = { ...BASE_ARENAS, ...SMALL_ARENAS, ...BIG_ARENAS, ...CAPTURE_ARENAS, ...GROW_ARENAS };
export type PwArenaId = keyof typeof ALL_ARENAS;
export const PW_ARENAS: Record<PwArenaId, PwArenaDef> = ALL_ARENAS;

/** 대결 유형마다 고를 수 있는 경기장 5개 (점령전은 3개) (맨 앞이 처음 경기장) */
export const PW_MAP_SETS = {
  duel: ["small", "dLava", "dMarsh", "dGarden", "dSpike"],
  pair: ["pCross", "pLava", "pMaze", "pShore", "pMud"],
  trio: ["wide", "tFort", "tRiver", "tGrove", "tTemple"],
  squad: ["forest", "qVolcano", "qSwamp", "qCanyon", "qGarden"],
  brawl: ["field", "bLava", "bPonds", "bGrass", "bRuins"],
  gungame: ["manor", "gCastle", "gVolcano", "gVillage", "gPrison"],
  capture: ["cHall", "cCliff", "cRing"],
  contest: ["gContest"],
} as const satisfies Record<string, readonly PwArenaId[]>;
