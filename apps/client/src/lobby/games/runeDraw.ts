// 룬 블록 그림: 어두운 석실 우물 · 돌 블록에 빛나는 룬 무늬(색마다 다른 무늬) · 놓일 자리 그림자 · 다음 돌 · 지운 줄 번쩍임
import { ghostY, H, W, type RuneGame } from "./runeLogic";

export const C = 16;
/** 오른쪽 다음 돌 칸 너비 */
export const SIDE = 76;
const FLASH_MS = 260;

/** 룬 색: 돌 · 빛 */
const RUNES: readonly [string, string][] = [
  ["#4a3a6a", "#c89aff"],
  ["#2a4a5a", "#6ae0ff"],
  ["#5a3a2a", "#ffb05a"],
  ["#2a5a3a", "#7affa0"],
  ["#5a2a3a", "#ff7a9a"],
];

/** 룬 무늬 (색마다 다른 획: 3×3 점 중 이을 선) */
const GLYPH: readonly number[][][] = [
  [[0, 8], [2, 6]],
  [[1, 7], [3, 5]],
  [[0, 2], [2, 8]],
  [[1, 3], [3, 7], [7, 5]],
  [[0, 4], [4, 2], [4, 7]],
];

function block(ctx: CanvasRenderingContext2D, px: number, py: number, c: number, alpha = 1): void {
  const [stone, glow] = RUNES[c]!;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = stone;
  ctx.fillRect(px + 1, py + 1, C - 2, C - 2);
  ctx.fillStyle = "#ffffff22";
  ctx.fillRect(px + 1, py + 1, C - 2, 2);
  ctx.fillStyle = "#00000044";
  ctx.fillRect(px + 1, py + C - 3, C - 2, 2);
  ctx.strokeStyle = glow;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const [a, b] of GLYPH[c]!) {
    const at = (n: number) => [px + 4 + (n % 3) * 4, py + 4 + Math.floor(n / 3) * 4] as const;
    ctx.moveTo(...at(a!));
    ctx.lineTo(...at(b!));
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawRune(ctx: CanvasRenderingContext2D, g: RuneGame, now: number, labels: { next: string; level: string }): void {
  const w = W * C;
  const h = H * C;
  // 석실 벽 · 우물
  ctx.fillStyle = "#14101c";
  ctx.fillRect(0, 0, w + SIDE, h);
  ctx.fillStyle = "#1c1628";
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x + y) % 2) ctx.fillRect(x * C, y * C, C, C);
  g.board.forEach((v, i) => v >= 0 && block(ctx, (i % W) * C, Math.floor(i / W) * C, v));
  if (!g.over) {
    const gy = ghostY(g);
    ctx.strokeStyle = RUNES[g.cur.c]![1];
    ctx.globalAlpha = 0.45;
    for (const [cx, cy] of g.cur.cells) ctx.strokeRect((g.cur.x + cx!) * C + 1.5, (gy + cy!) * C + 1.5, C - 3, C - 3);
    ctx.globalAlpha = 1;
    for (const [cx, cy] of g.cur.cells) block(ctx, (g.cur.x + cx!) * C, (g.cur.y + cy!) * C, g.cur.c);
  }
  // 지운 줄 번쩍임
  const k = (now - g.flashAt) / FLASH_MS;
  if (g.flash.length && k < 1) {
    ctx.fillStyle = `rgba(255,240,180,${0.8 * (1 - k)})`;
    for (const row of g.flash) ctx.fillRect(0, row * C, w, C);
  }
  ctx.strokeStyle = "#5a4a7a";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  // 다음 돌 · 단계
  ctx.fillStyle = "#b8b0c8";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(labels.next, w + SIDE / 2, 14);
  ctx.strokeStyle = "#3a3350";
  ctx.strokeRect(w + 8, 20, SIDE - 16, 44);
  for (const [cx, cy] of g.next.cells) block(ctx, w + 14 + cx! * C, 26 + cy! * C, g.next.c);
  ctx.fillStyle = "#b8b0c8";
  ctx.fillText(labels.level, w + SIDE / 2, 86);
  ctx.fillStyle = "#ffd860";
  ctx.font = "bold 20px monospace";
  ctx.fillText(String(1 + Math.floor(g.lines / 8)), w + SIDE / 2, 108);
}
