// 미카엘라 그림 도구: 무기 8속성(성은·빙결·홍염·혈월·천광·자전·비취·청해)의 검·투창 · 공허 포탈 (박힌 무기·떨어지는 무기·떠다니는 무기·효과가 같이 씀)
// 사용자가 준 검·창 참고 그림에서 색 묶음과 분위기만 가져와 새로 그림 (모양을 그대로 따라 그리지 않음)
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

export const MC = { silver: "#e8ecf8", steel: "#9aa4b8", gold: "#f2c14e", light: "#fff6c0", void: "#7a58d8", deep: "#2a1a58", violet: "#c8b0ff", orange: "#ff9a40" };

/** 속성마다 날 · 장식 · 빛 · 폭 */
export const MC_PAL = [
  { blade: "#eef0f8", trim: "#c84040", glow: "#ffffff", w: 3.5 },
  { blade: "#9ae8ff", trim: "#3aa0ff", glow: "#b8f4ff", w: 2 },
  { blade: "#ffb060", trim: "#c8401a", glow: "#ff8a3a", w: 3 },
  { blade: "#3a2028", trim: "#e8304a", glow: "#ff3a5a", w: 3.2 },
  { blade: "#fff4c8", trim: "#f2c14e", glow: "#fff6c0", w: 2.8 },
  { blade: "#d8b8ff", trim: "#8a5ad8", glow: "#c8a0ff", w: 2.4 },
  { blade: "#8af0a8", trim: "#2a9a5a", glow: "#9affb0", w: 2.4 },
  { blade: "#7ae8f0", trim: "#1a7aa8", glow: "#8af0ff", w: 2.2 },
] as const;

export const palOf = (v: number | undefined) => MC_PAL[(v ?? 0) % MC_PAL.length]!;

/** 투창 촉 모양 (속성마다): 가운데 (x,y) 끝, 방향 (c,s) */
function spearHead(ctx: Ctx, x: number, y: number, c: number, s: number, v: number, col: string, trim: string): void {
  const pt = (a: number, b: number): [number, number] => [x + c * a - s * b, y + s * a + c * b];
  ctx.fillStyle = col;
  ctx.beginPath();
  const shape: [number, number][] =
    v === 5 ? [[0, 0], [6, -4], [9, -6], [7, 0], [9, 2]] // 자전: 낫처럼 굽은 촉
      : v === 1 ? [[0, 0], [7, -3], [5, 0], [7, 3]] // 빙결: 갈래 진 수정
        : v === 2 ? [[0, 0], [4, -3], [8, -2], [6, 0], [8, 2], [4, 3]] // 홍염: 불꽃 촉
          : [[0, 0], [6, -2.5], [8, 0], [6, 2.5]];
  shape.forEach(([a, b], i) => (i ? ctx.lineTo(...pt(a, b)) : ctx.moveTo(...pt(a, b))));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = trim;
  const [gx, gy] = pt(7, 0);
  ctx.fillRect(gx - 1, gy - 1, 2.5, 2.5);
}

/** 무기 하나: (x,y) 끝(날 끝)에서 각 a 쪽으로 손잡이 · k 0 검 · 1 투창 · len 길이 · v 속성 */
export function blade(ctx: Ctx, x: number, y: number, a: number, k: number, len: number, al: number, v = 0): void {
  const P = palOf(v);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const hx = x + c * len;
  const hy = y + s * len;
  ctx.lineCap = "round";
  if (k === 0) {
    // 검: 속성 색 날(폭은 속성마다) + 가운데 장식 줄 + 코등이
    const g = len * 0.7;
    ctx.strokeStyle = alpha(P.blade, al);
    ctx.lineWidth = P.w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + c * g, y + s * g);
    ctx.stroke();
    ctx.strokeStyle = alpha(P.trim, al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + c * 3, y + s * 3);
    ctx.lineTo(x + c * g, y + s * g);
    ctx.stroke();
    const wing = v === 4 || v === 1 ? 5 : 3.5;
    ctx.strokeStyle = alpha(v === 3 ? P.trim : MC.gold, al);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + c * g - s * wing, y + s * g + c * wing);
    ctx.lineTo(x + c * g + s * wing, y + s * g - c * wing);
    ctx.moveTo(x + c * (g + 1), y + s * (g + 1));
    ctx.lineTo(hx, hy);
    ctx.stroke();
  } else {
    // 투창: 자루(장식 색) + 속성마다 다른 촉
    ctx.strokeStyle = alpha(P.trim, al);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x + c * 5, y + s * 5);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    spearHead(ctx, x, y, c, s, v, alpha(P.blade, al), alpha(P.trim, al));
  }
  ctx.lineCap = "butt";
  ctx.fillStyle = alpha(P.glow, al);
  ctx.fillRect(x - 0.5, y - 0.5, 1.5, 1.5);
}

/** 공허 포탈: 보라 소용돌이 + 금빛 테두리 (납작한 타원) */
export function portal(ctx: Ctx, x: number, y: number, r: number, spin: number, al: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.6, MC.void, al * 0.8, 0.3);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.45);
    ctx.fillStyle = alpha(MC.deep, al * 0.9);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = alpha(i === 0 ? MC.gold : MC.violet, al * (1 - i * 0.25));
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * (1 - i * 0.28), spin + i, spin + i + 4.4);
      ctx.stroke();
    }
    ctx.restore();
  });
}
