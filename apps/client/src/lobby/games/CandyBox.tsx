// 별사탕 상자: 숫자 별사탕(1~9)을 끌어서 네모로 묶어 합이 10이면 톡 터짐. 한 번에 많이 묶을수록 보너스. 2분 동안 점수를 많이
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../../i18n";
import { loadText, saveText } from "../../storage";
import { addChips } from "../chips";
import { burst, CELL, COLS, drawCandy, popsAlive, ROWS, type Gain, type Pop } from "./candyDraw";
import { rand, randInt } from "./util";

const TIME = 120;
/** 이만큼 넘게 점수를 내면 칩 */
const GOOD = 80;
const BEST_KEY = "candyBest";

const newGrid = () => Array.from({ length: COLS * ROWS }, () => randInt(1, 9));
/** 점수: 터진 수 + 3개부터 하나마다 보너스 1 */
const points = (n: number) => n + Math.max(0, n - 2);

export function CandyBox({ t }: { t: (k: TextKey) => string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState(newGrid);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [drag, setDrag] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const fx = useRef<{ pops: Pop[]; gains: Gain[] }>({ pops: [], gains: [] });
  const over = left <= 0;

  useEffect(() => {
    if (over) {
      if (score >= GOOD) addChips(score);
      if (score > (Number(loadText(BEST_KEY)) || 0)) saveText(BEST_KEY, String(score));
      return;
    }
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, over, score]);
  const shownBest = Math.max(Number(loadText(BEST_KEY)) || 0, over ? score : 0);

  const box = drag ? { c0: Math.min(drag.x0, drag.x1), c1: Math.max(drag.x0, drag.x1), r0: Math.min(drag.y0, drag.y1), r1: Math.max(drag.y0, drag.y1) } : null;
  const inBox = (i: number) => box !== null && i % COLS >= box.c0 && i % COLS <= box.c1 && Math.floor(i / COLS) >= box.r0 && Math.floor(i / COLS) <= box.r1;
  const total = box ? grid.reduce((a, v, i) => a + (inBox(i) ? v : 0), 0) : 0;

  // 그리기: 반짝이·흔들림이 있어 매 프레임
  const view = useRef({ grid, box, ok: false });
  useEffect(() => {
    view.current = { grid, box, ok: total === 10 };
  });
  useEffect(() => {
    let id = 0;
    const frame = () => {
      const ctx = ref.current?.getContext("2d");
      const now = performance.now();
      const f = fx.current;
      f.pops = popsAlive(f.pops, now) as Pop[];
      f.gains = popsAlive(f.gains, now) as Gain[];
      if (ctx) drawCandy(ctx, view.current.grid, view.current.box, view.current.ok, f.pops, f.gains, now);
      id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);

  const cellAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(COLS - 1, Math.floor(((e.clientX - r.left) / r.width) * COLS))),
      y: Math.max(0, Math.min(ROWS - 1, Math.floor(((e.clientY - r.top) / r.height) * ROWS))),
    };
  };
  const clear = () => {
    if (!box || total !== 10) return;
    const now = performance.now();
    const hit = grid.map((v, i) => (v && inBox(i) ? i : -1)).filter((i) => i >= 0);
    for (const i of hit) fx.current.pops.push(...burst(i, grid[i]!, now, rand));
    const gain = points(hit.length);
    fx.current.gains.push({ x: ((box.c0 + box.c1 + 1) / 2) * CELL, y: ((box.r0 + box.r1 + 1) / 2) * CELL, n: gain, at: now });
    setGrid(grid.map((v, i) => (inBox(i) ? 0 : v)));
    setScore((s) => s + gain);
  };

  return (
    <div className="mg apples">
      <p className="mg-rule">{t("mgApplesRule")}</p>
      <p className="mg-sum">
        {t("mgScore")} <b>{score}</b> · {t("mgTime")} <b className={left <= 10 ? "bad" : ""}>{Math.max(0, left)}</b> · {t("mgBest")} <b>{shownBest}</b>
      </p>
      <i className="candy-time" style={{ width: `${(100 * Math.max(0, left)) / TIME}%` }} />
      <canvas
        ref={ref}
        width={COLS * CELL}
        height={ROWS * CELL}
        className="apple-canvas"
        onPointerDown={(e) => {
          if (over) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const c = cellAt(e);
          setDrag({ x0: c.x, y0: c.y, x1: c.x, y1: c.y });
        }}
        onPointerMove={(e) => {
          if (!drag) return;
          const c = cellAt(e);
          setDrag({ ...drag, x1: c.x, y1: c.y });
        }}
        onPointerUp={() => {
          clear();
          setDrag(null);
        }}
      />
      {over && (
        <div className="mg-row">
          <strong className="mg-result win">{t("mgTimeUp").replace("{n}", String(score))}</strong>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setGrid(newGrid());
              setScore(0);
              setLeft(TIME);
            }}
          >
            {t("mgAgain")}
          </button>
        </div>
      )}
    </div>
  );
}
