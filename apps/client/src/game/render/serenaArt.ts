// 세레나 코드 그림: 비수 달린 가시 사슬 채찍 (휘어진 사슬 + 금빛 가시 + 끝의 빛나는 비수 + 빛 잔상)
// 도는 사슬 채찍(serenaBody)·채찍 휘두르기·환혹의 회오리(serenaFx)가 같이 씀
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

/** 세레나 색: 금 · 밝은 빛 · 흰 빛 · 분홍 · 장미 · 맹독 초록 · 에테르 하늘 · 강철 */
export const SN = { gold: "#f2c14e", light: "#ffe68a", white: "#fff8f0", pink: "#ffb0d0", rose: "#e8407a", venom: "#8aff5a", ether: "#b0e8ff", steel: "#c8d0e0" } as const;

/** 비수: 끝 (x,y) · 바라보는 각 a · 길이 len */
export function dagger(ctx: Ctx, x: number, y: number, a: number, len: number, al: number, core: string = SN.rose): void {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const bx = x - c * len;
  const by = y - s * len;
  const w = len * 0.28;
  ctx.fillStyle = alpha(SN.white, al);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(bx + c * len * 0.35 - s * w, by + s * len * 0.35 + c * w);
  ctx.lineTo(bx, by);
  ctx.lineTo(bx + c * len * 0.35 + s * w, by + s * len * 0.35 - c * w);
  ctx.closePath();
  ctx.fill();
  // 가운데 붉은 홈 · 금빛 코등이
  ctx.strokeStyle = alpha(core, al);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - c * len * 0.2, y - s * len * 0.2);
  ctx.lineTo(bx + c * len * 0.3, by + s * len * 0.3);
  ctx.stroke();
  ctx.strokeStyle = alpha(SN.gold, al);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx - s * w * 1.2, by + c * w * 1.2);
  ctx.lineTo(bx + s * w * 1.2, by - c * w * 1.2);
  ctx.stroke();
}

/** 사슬 채찍: (ax,ay)에서 조절점 (cx,cy)를 지나 (tx,ty)까지 휘어진 사슬 · 마디마다 금빛 가시 · 끝에 비수 · 둘레 빛 */
export function chainWhip(ctx: Ctx, ax: number, ay: number, cx: number, cy: number, tx: number, ty: number, al: number, glowC: string = SN.light): void {
  const n = 16;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const v = 1 - u;
    pts.push([v * v * ax + 2 * v * u * cx + u * u * tx, v * v * ay + 2 * v * u * cy + u * u * ty]);
  }
  // 빛 (사슬을 따라 번지는 전기 같은 빛)
  additive(ctx, () => {
    ctx.strokeStyle = alpha(glowC, 0.35 * al);
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (const [x, y] of pts) ctx.lineTo(x, y);
    ctx.stroke();
  });
  // 사슬 줄
  ctx.strokeStyle = alpha(SN.steel, al);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [x, y] of pts) ctx.lineTo(x, y);
  ctx.stroke();
  // 마디 · 가시
  for (let i = 1; i < n; i++) {
    const [x, y] = pts[i]!;
    ctx.fillStyle = alpha(i % 2 ? SN.white : SN.steel, al);
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    if (i % 3 !== 0) continue;
    const [px, py] = pts[i - 1]!;
    const a = Math.atan2(y - py, x - px) + Math.PI / 2;
    ctx.fillStyle = alpha(SN.gold, al);
    ctx.fillRect(Math.round(x + Math.cos(a) * 2), Math.round(y + Math.sin(a) * 2), 1, 1);
    ctx.fillRect(Math.round(x - Math.cos(a) * 2), Math.round(y - Math.sin(a) * 2), 1, 1);
  }
  const [lx, ly] = pts[n - 1]!;
  dagger(ctx, tx, ty, Math.atan2(ty - ly, tx - lx), 8, al);
  additive(ctx, () => glow(ctx, tx, ty, 6, glowC, 0.5 * al));
}
