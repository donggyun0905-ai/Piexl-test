// 룬 블록 규칙 (화면 꾸밈용, 게임 기록과 상관없음): 10×18 우물 · 4칸 돌 7가지(색은 모양과 상관없이 무작위) · 줄을 채우면 사라짐
// 점수: 한 번에 지운 줄 1·2·3·4 → 10·30·60·100 × 단계 · 8줄마다 단계가 오르고 빨라짐
import { randInt } from "./util";

export const W = 10;
export const H = 18;
export const RUNE_COLORS = 5;
const SHAPES: number[][][] = [
  [[0, 1], [1, 1], [2, 1], [3, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[2, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
];
const LINE_POINTS = [0, 10, 30, 60, 100];

export interface Piece {
  k: number;
  /** 룬 색 (0~4) */
  c: number;
  cells: number[][];
  x: number;
  y: number;
}
export interface RuneGame {
  /** 칸마다 룬 색 (-1 = 빈칸) */
  board: number[];
  cur: Piece;
  next: Piece;
  lines: number;
  points: number;
  over: boolean;
  tick: number;
  /** 방금 지운 줄 (번쩍임) · 그때 시각 */
  flash: number[];
  flashAt: number;
}

const spawn = (): Piece => {
  const k = randInt(0, 6);
  return { k, c: randInt(0, RUNE_COLORS - 1), cells: SHAPES[k]!.map((c) => [...c]), x: 3, y: 0 };
};
const rotate = (cells: number[][]) => cells.map(([x, y]) => [2 - y!, x!]);

export const newRune = (): RuneGame => ({ board: Array<number>(W * H).fill(-1), cur: spawn(), next: spawn(), lines: 0, points: 0, over: false, tick: 0, flash: [], flashAt: 0 });
export const level = (g: RuneGame) => 1 + Math.floor(g.lines / 8);
/** 저절로 한 칸 내려오는 간격 (50ms 단위) */
export const fallEvery = (g: RuneGame) => Math.max(2, 16 - (level(g) - 1) * 2);

export function fits(g: RuneGame, cells: number[][], x: number, y: number): boolean {
  return cells.every(([cx, cy]) => {
    const px = x + cx!;
    const py = y + cy!;
    return px >= 0 && px < W && py < H && (py < 0 || g.board[py * W + px] === -1);
  });
}

/** 놓기 → 줄 지우기 → 다음 돌. 지운 줄 수 */
function lock(g: RuneGame, now: number): number {
  for (const [cx, cy] of g.cur.cells) if (g.cur.y + cy! >= 0) g.board[(g.cur.y + cy!) * W + g.cur.x + cx!] = g.cur.c;
  const rows: number[] = [];
  for (let row = H - 1; row >= 0; row--) {
    if (g.board.slice(row * W, row * W + W).every((v) => v >= 0)) {
      g.board.splice(row * W, W);
      g.board.unshift(...Array<number>(W).fill(-1));
      rows.push(row + rows.length);
      row++;
    }
  }
  if (rows.length) {
    g.points += LINE_POINTS[rows.length]! * level(g);
    g.lines += rows.length;
    g.flash = rows;
    g.flashAt = now;
  }
  g.cur = g.next;
  g.next = spawn();
  if (!fits(g, g.cur.cells, g.cur.x, g.cur.y)) g.over = true;
  return rows.length;
}

export type RuneAct = "l" | "r" | "rot" | "down" | "drop";

/** 조작 하나 (내려가다 막히면 놓음). 지운 줄 수 */
export function runeAct(g: RuneGame, a: RuneAct, now: number): number {
  if (g.over) return 0;
  const p = g.cur;
  if (a === "l" && fits(g, p.cells, p.x - 1, p.y)) p.x--;
  if (a === "r" && fits(g, p.cells, p.x + 1, p.y)) p.x++;
  if (a === "rot") {
    const rc = p.k === 1 ? p.cells : rotate(p.cells);
    for (const dx of [0, -1, 1, -2, 2]) {
      if (fits(g, rc, p.x + dx, p.y)) {
        p.cells = rc;
        p.x += dx;
        break;
      }
    }
  }
  if (a === "down") {
    if (fits(g, p.cells, p.x, p.y + 1)) p.y++;
    else return lock(g, now);
  }
  if (a === "drop") {
    let n = 0;
    while (fits(g, p.cells, p.x, p.y + 1)) {
      p.y++;
      n++;
    }
    g.points += n;
    return lock(g, now);
  }
  return 0;
}

/** 놓일 자리 (그림자) */
export function ghostY(g: RuneGame): number {
  let y = g.cur.y;
  while (fits(g, g.cur.cells, g.cur.x, y + 1)) y++;
  return y;
}
