// 블록 쌓기: 떨어지는 블록(4칸짜리 7가지)을 돌리고 옮겨 가로줄을 채우면 사라짐. 줄이 늘수록 빨라짐
// 키: ←→ 옮기기 · ↑/X 돌리기 · ↓ 빨리 · Space 바로 떨어뜨리기 (모바일은 아래 버튼)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips } from "../chips";
import { randInt } from "./util";

const W = 10;
const H = 20;
const C = 14;
const SHAPES: number[][][] = [
  [[0, 1], [1, 1], [2, 1], [3, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[2, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
];
const COLORS = ["#5ad8ff", "#ffd040", "#c87aff", "#4a7aff", "#ff9a3a", "#5ae07a", "#ff5a6a"];

interface Piece {
  k: number;
  cells: number[][];
  x: number;
  y: number;
}
const spawn = (k = randInt(0, 6)): Piece => ({ k, cells: SHAPES[k]!.map((c) => [...c]), x: 3, y: 0 });
const rotate = (cells: number[][]) => cells.map(([x, y]) => [2 - y!, x!]);

export function Blocks({ t }: { t: (k: TextKey) => string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const game = useRef({ board: Array<number>(W * H).fill(-1), cur: spawn(), next: randInt(0, 6), lines: 0, over: false, tick: 0 });
  const [view, setView] = useState({ lines: 0, over: false, n: 0 });
  const redraw = () => setView((v) => ({ lines: game.current.lines, over: game.current.over, n: v.n + 1 }));

  const fits = (cells: number[][], x: number, y: number) => {
    const g = game.current;
    return cells.every(([cx, cy]) => {
    const px = x + cx!;
    const py = y + cy!;
      return px >= 0 && px < W && py < H && (py < 0 || g.board[py * W + px] === -1);
    });
  };
  const lock = () => {
    const g = game.current;
    for (const [cx, cy] of g.cur.cells) if (g.cur.y + cy! >= 0) g.board[(g.cur.y + cy!) * W + g.cur.x + cx!] = g.cur.k;
    let cleared = 0;
    for (let row = H - 1; row >= 0; row--) {
      if (g.board.slice(row * W, row * W + W).every((v) => v >= 0)) {
        g.board.splice(row * W, W);
        g.board.unshift(...Array<number>(W).fill(-1));
        cleared++;
        row++;
      }
    }
    g.lines += cleared;
    if (cleared >= 2) addChips(cleared * 10);
    g.cur = spawn(g.next);
    g.next = randInt(0, 6);
    if (!fits(g.cur.cells, g.cur.x, g.cur.y)) g.over = true;
  };
  const act = (a: "l" | "r" | "rot" | "down" | "drop") => {
    const g = game.current;
    if (g.over) return;
    const p = g.cur;
    if (a === "l" && fits(p.cells, p.x - 1, p.y)) p.x--;
    if (a === "r" && fits(p.cells, p.x + 1, p.y)) p.x++;
    if (a === "rot") {
      const rc = p.k === 1 ? p.cells : rotate(p.cells);
      for (const dx of [0, -1, 1, -2, 2]) {
        if (fits(rc, p.x + dx, p.y)) {
          p.cells = rc;
          p.x += dx;
          break;
        }
      }
    }
    if (a === "down") {
      if (fits(p.cells, p.x, p.y + 1)) p.y++;
      else lock();
    }
    if (a === "drop") {
      while (fits(p.cells, p.x, p.y + 1)) p.y++;
      lock();
    }
    redraw();
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const m: Record<string, "l" | "r" | "rot" | "down" | "drop"> = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "rot", KeyX: "rot", ArrowDown: "down", Space: "drop" };
      const a = m[e.code];
      if (!a) return;
      e.preventDefault();
      act(a);
    };
    window.addEventListener("keydown", key);
    const id = window.setInterval(() => {
      const g = game.current;
      if (++g.tick >= Math.max(3, 16 - Math.floor(g.lines / 5))) {
        g.tick = 0;
        act("down");
      }
    }, 50);
    return () => {
      window.removeEventListener("keydown", key);
      window.clearInterval(id);
    };
  });

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const g = game.current;
    ctx.fillStyle = "#0c0a14";
    ctx.fillRect(0, 0, W * C + 70, H * C);
    const cell = (x: number, y: number, k: number, ghost = false) => {
      ctx.fillStyle = ghost ? "rgba(255,255,255,0.15)" : COLORS[k]!;
      ctx.fillRect(x * C + 1, y * C + 1, C - 2, C - 2);
      if (!ghost) {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(x * C + 1, y * C + 1, C - 2, 2);
      }
    };
    g.board.forEach((v, i) => v >= 0 && cell(i % W, Math.floor(i / W), v));
    let gy = g.cur.y;
    while (fits(g.cur.cells, g.cur.x, gy + 1)) gy++;
    for (const [cx, cy] of g.cur.cells) cell(g.cur.x + cx!, gy + cy!, 0, true);
    for (const [cx, cy] of g.cur.cells) cell(g.cur.x + cx!, g.cur.y + cy!, g.cur.k);
    ctx.strokeStyle = "#3a3350";
    ctx.strokeRect(0.5, 0.5, W * C - 1, H * C - 1);
    for (const [cx, cy] of SHAPES[g.next]!) cell(W + 1 + cx!, 1 + cy!, g.next);
  });

  return (
    <div className="mg blocks">
      <p className="mg-sum">
        {t("mgLines")} <b>{view.lines}</b>
        {view.over && <strong className="mg-result lose"> · {t("mgGameOver")}</strong>}
      </p>
      <canvas ref={ref} width={W * C + 70} height={H * C} className="blocks-canvas" />
      <div className="mg-row pad">
        <button type="button" onClick={() => act("l")}>◀</button>
        <button type="button" onClick={() => act("rot")}>⟳</button>
        <button type="button" onClick={() => act("r")}>▶</button>
        <button type="button" onClick={() => act("down")}>▼</button>
        <button type="button" onClick={() => act("drop")}>⤓</button>
        {view.over && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              game.current = { board: Array<number>(W * H).fill(-1), cur: spawn(), next: randInt(0, 6), lines: 0, over: false, tick: 0 };
              redraw();
            }}
          >
            {t("mgAgain")}
          </button>
        )}
      </div>
      <p className="mg-note">{t("mgBlocksKeys")}</p>
    </div>
  );
}
