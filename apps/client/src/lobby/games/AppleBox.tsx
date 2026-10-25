// 사과 상자: 숫자 사과(1~9)를 끌어서 네모로 묶어 합이 10이면 사라짐. 2분 동안 사과를 많이 없애기
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips } from "../chips";
import { randInt } from "./util";

const COLS = 17;
const ROWS = 10;
const CELL = 24;
const TIME = 120;
/** 이만큼 넘게 없애면 칩 */
const GOOD = 80;

const newGrid = () => Array.from({ length: COLS * ROWS }, () => randInt(1, 9));

export function AppleBox({ t }: { t: (k: TextKey) => string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState(newGrid);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [drag, setDrag] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const over = left <= 0;

  useEffect(() => {
    if (over) {
      if (score >= GOOD) addChips(score);
      return;
    }
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, over, score]);

  const box = drag ? { c0: Math.min(drag.x0, drag.x1), c1: Math.max(drag.x0, drag.x1), r0: Math.min(drag.y0, drag.y1), r1: Math.max(drag.y0, drag.y1) } : null;
  const inBox = (i: number) => box !== null && i % COLS >= box.c0 && i % COLS <= box.c1 && Math.floor(i / COLS) >= box.r0 && Math.floor(i / COLS) <= box.r1;
  const total = box ? grid.reduce((a, v, i) => a + (inBox(i) ? v : 0), 0) : 0;

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#3a6a3a";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    grid.forEach((v, i) => {
      const x = (i % COLS) * CELL + CELL / 2;
      const y = Math.floor(i / COLS) * CELL + CELL / 2;
      if (!v) return;
      ctx.fillStyle = inBox(i) ? (total === 10 ? "#ffd040" : "#ff8a8a") : "#e83a3a";
      ctx.beginPath();
      ctx.arc(x, y + 1, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a8a2a";
      ctx.fillRect(x - 1, y - 12, 3, 4);
      ctx.fillStyle = "#fff";
      ctx.fillText(String(v), x, y + 2);
    });
    if (box) {
      ctx.strokeStyle = total === 10 ? "#ffd040" : "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.c0 * CELL + 1, box.r0 * CELL + 1, (box.c1 - box.c0 + 1) * CELL - 2, (box.r1 - box.r0 + 1) * CELL - 2);
    }
  });

  const cellAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(COLS - 1, Math.floor(((e.clientX - r.left) / r.width) * COLS))),
      y: Math.max(0, Math.min(ROWS - 1, Math.floor(((e.clientY - r.top) / r.height) * ROWS))),
    };
  };

  return (
    <div className="mg apples">
      <p className="mg-rule">{t("mgApplesRule")}</p>
      <p className="mg-sum">
        {t("mgScore")} <b>{score}</b> · {t("mgTime")} <b>{Math.max(0, left)}</b>
      </p>
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
          if (box && total === 10) {
            const n = grid.filter((v, i) => v && inBox(i)).length;
            setGrid(grid.map((v, i) => (inBox(i) ? 0 : v)));
            setScore((s) => s + n);
          }
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
