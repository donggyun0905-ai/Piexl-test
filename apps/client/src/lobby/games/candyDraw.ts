// 별사탕 상자 그림: 나무 상자 · 숫자마다 색이 다른 별사탕 · 묶는 네모 · 터질 때 반짝이 조각과 +점수
export const COLS = 17;
export const ROWS = 10;
export const CELL = 24;

/** 숫자 1~9 색 (밝은 색 · 어두운 테두리) */
const CANDY: readonly [string, string][] = [
  ["#ff8ab0", "#b0406a"],
  ["#ffb45a", "#b0661e"],
  ["#ffe45a", "#a8901a"],
  ["#9ae86a", "#4a8a2a"],
  ["#5ae0c8", "#1e8a78"],
  ["#6ab8ff", "#2a5ab0"],
  ["#b08aff", "#5a3ab0"],
  ["#ff7a6a", "#b0302a"],
  ["#f0f0ff", "#8a8ab0"],
];

export interface Pop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  c: string;
  at: number;
}
export interface Gain {
  x: number;
  y: number;
  n: number;
  at: number;
}

const POP_MS = 600;

/** 별 모양 (뾰족 8개, 둥글게) */
function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const d = k % 2 ? r * 0.78 : r;
    ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
  }
  ctx.closePath();
}

export function drawCandy(
  ctx: CanvasRenderingContext2D,
  grid: number[],
  box: { c0: number; c1: number; r0: number; r1: number } | null,
  ok: boolean,
  pops: Pop[],
  gains: Gain[],
  now: number,
): void {
  const w = COLS * CELL;
  const h = ROWS * CELL;
  // 나무 상자 바닥 + 칸 홈
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#7a4a2a");
  bg.addColorStop(1, "#5a3218");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#0000001a";
  for (let i = 0; i < COLS * ROWS; i++) {
    ctx.beginPath();
    ctx.arc((i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2 + 1, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  const inBox = (i: number) => !!box && i % COLS >= box.c0 && i % COLS <= box.c1 && Math.floor(i / COLS) >= box.r0 && Math.floor(i / COLS) <= box.r1;
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  grid.forEach((v, i) => {
    if (!v) return;
    const x = (i % COLS) * CELL + CELL / 2;
    const y = Math.floor(i / COLS) * CELL + CELL / 2;
    const [fill, edge] = CANDY[v - 1]!;
    const lit = inBox(i);
    // 살짝 흔들리며 반짝 (선택되면 튀어 오름)
    const bob = lit ? -2 : Math.sin(now / 600 + i) * 0.4;
    star(ctx, x, y + bob, lit ? 11.5 : 10.5);
    ctx.fillStyle = lit && ok ? "#fff6a0" : fill;
    ctx.fill();
    ctx.strokeStyle = edge;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#ffffff99";
    ctx.beginPath();
    ctx.arc(x - 3.5, y - 3.5 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = edge;
    ctx.strokeText(String(v), x, y + 1 + bob);
    ctx.fillStyle = "#fff";
    ctx.fillText(String(v), x, y + 1 + bob);
  });
  if (box) {
    const bx = box.c0 * CELL + 1;
    const by = box.r0 * CELL + 1;
    const bw = (box.c1 - box.c0 + 1) * CELL - 2;
    const bh = (box.r1 - box.r0 + 1) * CELL - 2;
    ctx.fillStyle = ok ? "#ffe45a33" : "#ffffff1a";
    ctx.fillRect(bx, by, bw, bh);
    ctx.lineWidth = 2;
    ctx.strokeStyle = ok ? "#ffe45a" : "#ffffffcc";
    ctx.setLineDash(ok ? [] : [4, 3]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);
  }
  // 터진 조각 · +점수
  for (const p of pops) {
    const k = (now - p.at) / POP_MS;
    if (k >= 1) continue;
    ctx.globalAlpha = 1 - k;
    ctx.fillStyle = p.c;
    star(ctx, p.x + p.vx * k * 30, p.y + p.vy * k * 30 + k * k * 14, 3 * (1 - k) + 1);
    ctx.fill();
  }
  ctx.font = "bold 16px monospace";
  for (const g of gains) {
    const k = (now - g.at) / (POP_MS * 1.5);
    if (k >= 1) continue;
    ctx.globalAlpha = 1 - k;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#5a3218";
    ctx.strokeText(`+${g.n}`, g.x, g.y - k * 24);
    ctx.fillStyle = "#ffe45a";
    ctx.fillText(`+${g.n}`, g.x, g.y - k * 24);
  }
  ctx.globalAlpha = 1;
}

/** 터진 칸마다 반짝이 조각 6개 */
export function burst(i: number, v: number, now: number, rnd: () => number): Pop[] {
  const x = (i % COLS) * CELL + CELL / 2;
  const y = Math.floor(i / COLS) * CELL + CELL / 2;
  return Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * Math.PI * 2 + rnd();
    return { x, y, vx: Math.cos(a), vy: Math.sin(a), c: CANDY[v - 1]![0], at: now };
  });
}

export const popsAlive = (list: { at: number }[], now: number) => list.filter((p) => now - p.at < POP_MS * 1.5);
