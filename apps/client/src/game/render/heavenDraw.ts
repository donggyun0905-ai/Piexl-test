// 천상의 방 꾸밈 (라스트 보스 층 여신의 선물·천상의 상점, game/roomFeatures가 부름): 금테 두른 하얀 깔개 · 위쪽 여신 표시(빛 고리·날개·별) · 양옆 하얀 기둥 · 반짝이
// 바닥·벽 색은 render/floorThemes의 HEAVEN 테마
import type { RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
const GOLD = "#e8c25a";
const GOLD_DARK = "#b08a2a";

function r(ctx: Ctx, c: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

/** 여신 표시: 빛 고리 + 펼친 날개 + 가운데 별 (지름 약 30) */
export function drawGoddessMark(ctx: Ctx, x: number, y: number, tick: number): void {
  const glow = 0.22 + 0.12 * Math.sin(tick / 18);
  ctx.fillStyle = `rgba(255, 236, 160, ${glow})`;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y - 7, 7, 2.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  // 날개: 깃털 세 줄씩
  for (let i = 0; i < 4; i++) {
    const w = 10 - i * 2;
    r(ctx, "#ffffff", x - 5 - w, y - 2 + i * 2, w, 2);
    r(ctx, "#ffffff", x + 5, y - 2 + i * 2, w, 2);
    r(ctx, GOLD_DARK, x - 5 - w, y - 2 + i * 2, 1, 2);
    r(ctx, GOLD_DARK, x + 4 + w, y - 2 + i * 2, 1, 2);
  }
  // 가운데 별
  r(ctx, GOLD, x - 1, y - 4, 2, 10);
  r(ctx, GOLD, x - 4, y, 8, 2);
  r(ctx, "#fff8d8", x - 1, y, 2, 2);
}

/** 하얀 기둥 (금빛 머리·받침) */
function pillar(ctx: Ctx, x: number, y: number): void {
  r(ctx, "rgba(0,0,0,0.12)", x - 5, y + 30, 12, 3);
  r(ctx, GOLD, x - 6, y - 2, 12, 3);
  r(ctx, "#ffffff", x - 4, y + 1, 8, 28);
  r(ctx, "#dcd8ea", x + 2, y + 1, 2, 28);
  r(ctx, "#e8e4f4", x - 2, y + 1, 1, 28);
  r(ctx, GOLD_DARK, x - 6, y + 29, 12, 3);
}

/** gift = 여신의 선물 (아이템 9개 3×3) · 아니면 천상의 상점 (진열 한 줄) */
export function drawHeavenRoom(ctx: Ctx, s: RunState, cx: number, cy: number, gift: boolean): void {
  const [x0, y0, w, h] = gift ? [cx - 58, cy - 50, 116, 74] : [cx - 60, cy - 24, 120, 34];
  r(ctx, GOLD, x0 - 2, y0 - 2, w + 4, h + 4);
  r(ctx, "#fdfcff", x0, y0, w, h);
  r(ctx, "#efeaf8", x0 + 3, y0 + 3, w - 6, h - 6);
  r(ctx, "#fdfcff", x0 + 4, y0 + 4, w - 8, h - 8);
  // 깔개 네 귀퉁이 금빛 장식
  for (const [px, py] of [[x0 + 2, y0 + 2], [x0 + w - 6, y0 + 2], [x0 + 2, y0 + h - 6], [x0 + w - 6, y0 + h - 6]] as const) r(ctx, GOLD, px, py, 4, 4);
  drawGoddessMark(ctx, cx, gift ? cy - 64 : cy - 44, s.tick);
  for (const dx of [-112, 112]) pillar(ctx, cx + dx, cy - 30);
  // 반짝이: 천천히 떠오르는 작은 빛
  for (let i = 0; i < 6; i++) {
    const t = (s.tick + i * 37) % 120;
    const sx = cx - 100 + ((i * 53) % 200);
    const sy = cy + 40 - t * 0.6;
    ctx.globalAlpha = Math.max(0, 1 - t / 120);
    r(ctx, i % 2 ? "#ffffff" : "#ffe9a0", sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;
}
