// 네일러 그림 도구 (nailerFx·nailerBody가 씀): 색 · 못 하나 (온통 검은 못: 양끝이 뾰족한 머리 · 뾰족한 끝) · 핏방울 · 적 체력 줄 위 못 마크(못 ×개수)
import { additive, glow, type Ctx } from "./pwFxBits";

export const NL = { iron: "#16161c", steel: "#4a4a58", shade: "#24242c", dark: "#050507", red: "#ff2a3a", blood: "#8a0a18", gore: "#c0101e", curse: "#c02aa0", moon: "#c8d8ff" };

/** 못 하나 (온통 검정): 머리(x, y)에서 a 방향으로 길이 len · 머리는 양끝이 뾰족한 마름모 · 끝은 뾰족함 (lit: 붉은 빛) */
export function nail(ctx: Ctx, x: number, y: number, a: number, len: number, lit = 0): void {
  const cx = Math.cos(a);
  const cy = Math.sin(a);
  // 몸통에 직각인 쪽
  const nx = -cy;
  const ny = cx;
  const at = (t: number, w: number) => [x + cx * t + nx * w, y + cy * t + ny * w] as const;
  const poly = (pts: (readonly [number, number])[], c: string) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(pts[0]![0], pts[0]![1]);
    for (const q of pts.slice(1)) ctx.lineTo(q[0], q[1]);
    ctx.closePath();
    ctx.fill();
  };
  const sw = Math.max(1, len * 0.09);
  const body = len * 0.62;
  // 옅은 테두리 (어두운 바닥에서도 보이게)
  poly([at(0, sw + 0.8), at(body, sw + 0.8), at(len + 1, 0), at(body, -sw - 0.8), at(0, -sw - 0.8)], "rgba(210,210,222,0.3)");
  // 검은 몸통 (윗면만 살짝 밝게)
  poly([at(0, sw), at(body, sw), at(body, -sw), at(0, -sw)], NL.iron);
  poly([at(0, sw), at(body, sw), at(body, sw * 0.2), at(0, sw * 0.2)], NL.steel);
  // 뾰족한 끝
  poly([at(body - 0.5, sw + 0.3), at(len, 0), at(body - 0.5, -sw - 0.3)], NL.dark);
  // 머리: 양끝이 뾰족한 마름모
  const hw = Math.max(3, len * 0.36);
  const ht = Math.max(1.2, len * 0.12);
  poly([at(-ht - 0.6, 0), at(0, hw + 1.2), at(ht + 0.6, 0), at(0, -hw - 1.2)], "rgba(210,210,222,0.3)");
  poly([at(-ht, 0), at(0, hw + 0.8), at(ht, 0), at(0, -hw - 0.8)], NL.dark);
  poly([at(-ht * 0.7, 0), at(0, hw), at(ht * 0.6, 0), at(0, -hw)], NL.shade);
  poly([at(-ht * 0.7, 0), at(0, hw), at(0, 0)], NL.iron);
  if (lit > 0) additive(ctx, () => glow(ctx, x + cx * len * 0.5, y + cy * len * 0.5, len * 0.7, NL.red, lit));
}

/** 핏방울 하나 (작은 눈물 모양: 아래가 둥글고 위가 뾰족) */
export function drop(ctx: Ctx, x: number, y: number, r: number, c: string = NL.gore): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 2);
  ctx.quadraticCurveTo(x + r, y - r * 0.4, x, y + r);
  ctx.quadraticCurveTo(x - r, y - r * 0.4, x, y - r * 2);
  ctx.fill();
}

/** 적 체력 줄 위 못 마크: 작은 못 + ×개수 (많을수록 붉게 빛남) */
export function nailMark(ctx: Ctx, x: number, y: number, n: number, tick: number): void {
  const hot = n >= 15;
  if (hot) additive(ctx, () => glow(ctx, x - 3, y, 5, NL.red, 0.35 + 0.25 * Math.sin(tick * 0.3)));
  nail(ctx, x - 3, y - 4, Math.PI / 2, 9);
  const txt = `x${n}`;
  ctx.font = "bold 7px monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.strokeText(txt, x, y);
  ctx.fillStyle = hot ? "#ff6a74" : "#f0f0f6";
  ctx.fillText(txt, x, y);
}
