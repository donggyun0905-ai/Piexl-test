// 발톱 효과: 변희 곰 할퀴기(묵직한 세 갈래 찢김·먼지) · 플라이 끝 할퀴기(날렵한 X자 섬광) · 바람 칼날(소용돌이 초승달)
import type { EffectState, ProjectileState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
type Pt = readonly [number, number];

/** 가운데가 굵고 양끝이 뾰족한 휜 자국 (a→b, 가운데를 c 쪽으로 휨) */
function gash(ctx: Ctx, a: Pt, c: Pt, b: Pt, w: number, upto: number): void {
  const n = 12;
  const pts: Pt[] = [];
  const norms: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * upto;
    const x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0];
    const y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1];
    const tx = 2 * (1 - u) * (c[0] - a[0]) + 2 * u * (b[0] - c[0]);
    const ty = 2 * (1 - u) * (c[1] - a[1]) + 2 * u * (b[1] - c[1]);
    const l = Math.hypot(tx, ty) || 1;
    pts.push([x, y]);
    // 굵기: 뒤쪽 1/3에서 가장 굵고 끝으로 갈수록 뾰족 (지금 그어지는 끝도 뾰족)
    const k = Math.sin(Math.PI * Math.min(1, (i / n) * 1.15)) * w;
    norms.push([(-ty / l) * k, (tx / l) * k]);
  }
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0] + norms[i]![0], p[1] + norms[i]![1]) : ctx.moveTo(p[0], p[1])));
  for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i]![0] - norms[i]![0] * 0.4, pts[i]![1] - norms[i]![1] * 0.4);
  ctx.closePath();
  ctx.fill();
}

function bearSwipe(ctx: Ctx, fx: EffectState, t: number, snap: Snap): void {
  const x = snap(fx.x);
  const y = snap(fx.y);
  const n = fx.size;
  const px = -fx.dirY;
  const py = fx.dirX;
  const draw = Math.min(1, t * 4);
  const fade = t < 0.5 ? 1 : 1 - (t - 0.5) * 2;
  // 휘두른 바람: 어두운 반달
  ctx.globalAlpha = 0.35 * fade;
  ctx.fillStyle = "#5a2a14";
  ctx.beginPath();
  const a0 = Math.atan2(fx.dirY, fx.dirX);
  ctx.arc(x - fx.dirX * n * 0.6, y - fx.dirY * n * 0.6, n * 1.25, a0 - 1.1, a0 - 1.1 + 2.2 * draw);
  ctx.arc(x - fx.dirX * n * 0.6, y - fx.dirY * n * 0.6, n * 0.85, a0 - 1.1 + 2.2 * draw, a0 - 1.1, true);
  ctx.fill();
  // 세 갈래 찢김: 검붉은 테 → 주황 살 → 흰 날
  for (const [color, wMul, alpha] of [["#5a0e08", 1, 0.9], ["#e8582a", 0.6, 1], ["#fff4d8", 0.22, 1]] as const) {
    ctx.globalAlpha = alpha * fade;
    ctx.fillStyle = color;
    for (let i = 0; i < 3; i++) {
      const o = (i - 1) * 0.5 * n;
      const a: Pt = [x + px * (o - n * 0.55) - fx.dirX * n * 0.7, y + py * (o - n * 0.55) - fx.dirY * n * 0.7];
      const b: Pt = [x + px * (o + n * 0.55) + fx.dirX * n * 0.5, y + py * (o + n * 0.55) + fx.dirY * n * 0.5];
      const c: Pt = [(a[0] + b[0]) / 2 + fx.dirX * n * 0.45, (a[1] + b[1]) / 2 + fx.dirY * n * 0.45];
      gash(ctx, a, c, b, n * 0.2 * wMul, draw);
    }
  }
  // 튀는 흙·핏빛 조각
  ctx.globalAlpha = fade;
  for (let i = 0; i < 7; i++) {
    const s = ((i * 53) % 17) / 17;
    const d = n * (0.4 + t * 1.1) * (0.7 + s * 0.6);
    const sx = x + fx.dirX * d + px * (s - 0.5) * n * 1.4;
    const sy = y + fx.dirY * d + py * (s - 0.5) * n * 1.4 + t * t * 6;
    ctx.fillStyle = i % 3 ? "#8a5a34" : "#c8402a";
    ctx.fillRect(Math.round(sx), Math.round(sy), i % 2 ? 2 : 1, i % 2 ? 2 : 1);
  }
}

function flyRake(ctx: Ctx, fx: EffectState, t: number, snap: Snap): void {
  const x = snap(fx.x);
  const y = snap(fx.y);
  const n = fx.size;
  const fade = 1 - t;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  // 날렵한 X자: 두 번 엇갈려 그음 (두 번째는 조금 늦게)
  for (let k = 0; k < 2; k++) {
    const draw = Math.min(1, Math.max(0, t * 6 - k * 0.6));
    if (draw <= 0) continue;
    const a = ang + (k ? -0.75 : 0.75);
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const from: Pt = [x - dx * n, y - dy * n];
    const to: Pt = [x + dx * n, y + dy * n];
    const mid: Pt = [x + Math.cos(a + Math.PI / 2) * n * 0.2, y + Math.sin(a + Math.PI / 2) * n * 0.2];
    for (const [color, w, al] of [["rgba(106,216,255,0.5)", 0.28, 1], ["#c8f4ff", 0.13, 1], ["#ffffff", 0.05, 1]] as const) {
      ctx.globalAlpha = al * fade;
      ctx.fillStyle = color;
      gash(ctx, from, mid, to, n * w, draw);
    }
  }
  // 날개 비늘 같은 반짝임과 끝의 별빛
  ctx.globalAlpha = fade;
  for (let i = 0; i < 6; i++) {
    const a = ang + (i / 6) * Math.PI * 2 + t * 2;
    const d = n * (0.5 + t * 0.9);
    const sx = Math.round(x + Math.cos(a) * d);
    const sy = Math.round(y + Math.sin(a) * d);
    ctx.fillStyle = i % 2 ? "#a8f0ff" : "#ffffff";
    ctx.fillRect(sx, sy - 1, 1, 3);
    ctx.fillRect(sx - 1, sy, 3, 1);
  }
}

export function drawClawFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "bearSwipe" && fx.kind !== "flyRake") return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  if (fx.kind === "bearSwipe") bearSwipe(ctx, fx, t, snap);
  else flyRake(ctx, fx, t, snap);
  ctx.globalAlpha = 1;
  return true;
}

/** 바람 칼날: 빙글 도는 푸른 초승달 + 흰 날 + 뒤에 흩어지는 바람 줄 */
export function drawWindBlade(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): void {
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  // 뒤로 흩어지는 바람 줄 셋
  ctx.strokeStyle = "rgba(200,244,255,0.55)";
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    const ox = -dy * i * 3;
    const oy = dx * i * 3;
    const l = 6 + ((tick + i * 3) % 4);
    ctx.beginPath();
    ctx.moveTo(x + ox - dx * 3, y + oy - dy * 3);
    ctx.lineTo(x + ox - dx * (3 + l), y + oy - dy * (3 + l));
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(dy, dx) + Math.sin(tick * 0.6) * 0.25);
  // 겹친 초승달: 옅은 빛 → 하늘색 → 흰 날
  for (const [color, r, th] of [["rgba(120,210,255,0.35)", 8, 3.2], ["#7ad8ff", 6.5, 2.2], ["#ffffff", 6, 0.9]] as const) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(-2, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.arc(-2 - th, 0, r - th * 0.3, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // 날 끝 반짝임
  if (tick % 4 < 2) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(x + dx * 4 - dy * 6), Math.round(y + dy * 4 + dx * 6), 1, 1);
    ctx.fillRect(Math.round(x + dx * 4 + dy * 6), Math.round(y + dy * 4 - dx * 6), 1, 1);
  }
}
