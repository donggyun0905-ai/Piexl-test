// 풍류사 그리기 (1): 구절 글자 표 · 한자 그리기 · 먹 붓질 · 천자문 글자탄 (먹물 꼬리 + 빛나는 한자)
// 구절 마법 효과는 render/pungryuFx, 몸 둘레(구름·네 칸·해달 구슬·비구름·먹 분신)는 render/pungryuBody
import type { ProjectileState } from "@pixel-rogue/shared";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

export const INK = "#14101e";

/** 무기(구절)마다 네 글자 */
export const VERSE_HANJA: Record<string, string> = {
  puHeaven: "天地玄黃",
  puFlood: "宇宙洪荒",
  puSunMoon: "日月盈昃",
  puStars: "辰宿列張",
  puSeasons: "寒來暑往",
  puHarvest: "秋收冬藏",
  puRain: "雲騰致雨",
  puFrost: "露結爲霜",
  puGold: "金生麗水",
  puSword: "劍號巨闕",
};
/** 무기마다 글자 빛깔 */
export const VERSE_TINT: Record<string, string> = {
  puHeaven: "#ffd860",
  puFlood: "#6ac8ff",
  puSunMoon: "#ff9a6a",
  puStars: "#c8b0ff",
  puSeasons: "#a8e8ff",
  puHarvest: "#e8b84a",
  puRain: "#8ad0ff",
  puFrost: "#d8f4ff",
  puGold: "#ffe070",
  puSword: "#e8ecf4",
};

/** 한자 하나 (먹 테두리 + 빛깔) */
export function glyph(ctx: Ctx, ch: string, x: number, y: number, size: number, c: string): void {
  ctx.font = `bold ${size}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.strokeText(ch, x, y);
  ctx.fillStyle = c;
  ctx.fillText(ch, x, y);
}

/** 먹 붓질: 처음은 굵고 끝으로 갈수록 가늘어지는 획 (w: 가장 굵은 곳, 마른 붓 결 몇 줄) */
export function brush(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, c: string, a: number): void {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / len;
  const ny = (x1 - x0) / len;
  const steps = 10;
  ctx.fillStyle = alpha(c, a);
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    const ww = w * (1 - u * 0.85) * (k === 0 ? 0.6 : 1);
    ctx.lineTo(x0 + (x1 - x0) * u + nx * ww, y0 + (y1 - y0) * u + ny * ww);
  }
  for (let k = steps; k >= 0; k--) {
    const u = k / steps;
    const ww = w * (1 - u * 0.85) * (k === 0 ? 0.6 : 1);
    ctx.lineTo(x0 + (x1 - x0) * u - nx * ww, y0 + (y1 - y0) * u - ny * ww);
  }
  ctx.fill();
  // 마른 붓 결: 획 끝쪽에 갈라진 가는 줄
  ctx.strokeStyle = alpha(c, a * 0.7);
  ctx.lineWidth = 1;
  for (const off of [-0.6, 0.5]) {
    ctx.beginPath();
    ctx.moveTo(x0 + (x1 - x0) * 0.55 + nx * w * off, y0 + (y1 - y0) * 0.55 + ny * w * off);
    ctx.lineTo(x1 + nx * w * off * 0.8, y1 + ny * w * off * 0.8);
    ctx.stroke();
  }
}

/** 글자탄 (spirit puLetter, tint = "무기 id:몇 번째 글자"): 먹물 꼬리 · 빛 · 한자 · 튀는 먹방울 */
export function drawPungryuShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "puLetter") return false;
  const [id = "puHeaven", n = "0"] = (pr.tint ?? "").split(":");
  const ch = (VERSE_HANJA[id] ?? VERSE_HANJA.puHeaven!)[Number(n) % 4] ?? "天";
  const c = VERSE_TINT[id] ?? "#ffd860";
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  brush(ctx, x - dx * 3, y - dy * 3, x - dx * 16, y - dy * 16, 3, INK, 0.75);
  // 꼬리 따라 떨어지는 먹방울
  ctx.fillStyle = alpha(INK, 0.6);
  for (let k = 1; k <= 3; k++) ctx.fillRect(Math.round(x - dx * (6 + k * 5) + dy * ((k % 2) * 3 - 1.5)), Math.round(y - dy * (6 + k * 5) - dx * ((k % 2) * 3 - 1.5)), 1, 1);
  additive(ctx, () => glow(ctx, x, y, 9, c, 0.55, 0.4));
  glyph(ctx, ch, Math.round(x), Math.round(y), 9, c);
  return true;
}
