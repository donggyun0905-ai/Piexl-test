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
  // 깎은 돌: 위가 밝은 결 · 빗면(위·왼 밝게, 아래·오른 어둡게) · 잔금 · 빛나는 룬 획
  const g = ctx.createLinearGradient(px, py, px + C, py + C);
  g.addColorStop(0, "#ffffff30");
  g.addColorStop(0.5, "#ffffff00");
  g.addColorStop(1, "#00000040");
  ctx.fillStyle = stone;
  ctx.fillRect(px + 0.5, py + 0.5, C - 1, C - 1);
  ctx.fillStyle = g;
  ctx.fillRect(px + 0.5, py + 0.5, C - 1, C - 1);
  ctx.fillStyle = "#ffffff38";
  ctx.fillRect(px + 0.5, py + 0.5, C - 1, 1.2);
  ctx.fillRect(px + 0.5, py + 0.5, 1.2, C - 1);
  ctx.fillStyle = "#00000055";
  ctx.fillRect(px + 0.5, py + C - 1.7, C - 1, 1.2);
  ctx.fillRect(px + C - 1.7, py + 0.5, 1.2, C - 1);
  ctx.strokeStyle = "#0000002a";
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(px + 3, py + C - 4);
  ctx.lineTo(px + 6, py + C - 6);
  ctx.lineTo(px + 7, py + C - 3);
  ctx.stroke();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = glow;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  for (const [a, b] of GLYPH[c]!) {
    const at = (n: number) => [px + 4 + (n % 3) * 4, py + 4 + Math.floor(n / 3) * 4] as const;
    ctx.moveTo(...at(a!));
    ctx.lineTo(...at(b!));
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineCap = "butt";
  ctx.globalAlpha = 1;
}

export function drawRune(ctx: CanvasRenderingContext2D, g: RuneGame, now: number, labels: { next: string; level: string }): void {
  const w = W * C;
  const h = H * C;
  // 석실 벽 · 우물
  ctx.fillStyle = "#14101c";
  ctx.fillRect(0, 0, w + SIDE, h);
  // 우물 벽돌 (줄마다 어긋나게) · 위에서 내려오는 희미한 빛
  ctx.strokeStyle = "#241c34";
  ctx.lineWidth = 0.5;
  for (let y = 0; y < H; y++) {
    ctx.strokeRect(0.25, y * C + 0.25, w - 0.5, C - 0.5);
    for (let x = (y % 2) * (C / 2); x < w; x += C) {
      ctx.beginPath();
      ctx.moveTo(x, y * C);
      ctx.lineTo(x, y * C + C);
      ctx.stroke();
    }
  }
  const light = ctx.createLinearGradient(0, 0, 0, h);
  light.addColorStop(0, "#c89aff1c");
  light.addColorStop(1, "#00000000");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);
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
  ctx.font = "800 10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(labels.next, w + SIDE / 2, 14);
  ctx.strokeStyle = "#3a3350";
  ctx.strokeRect(w + 8, 20, SIDE - 16, 44);
  for (const [cx, cy] of g.next.cells) block(ctx, w + 14 + cx! * C, 26 + cy! * C, g.next.c);
  ctx.fillStyle = "#b8b0c8";
  ctx.fillText(labels.level, w + SIDE / 2, 86);
  ctx.fillStyle = "#ffd860";
  ctx.font = "900 20px system-ui, sans-serif";
  ctx.fillText(String(1 + Math.floor(g.lines / 8)), w + SIDE / 2, 108);
}
