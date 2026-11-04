// 레오 그리기 (2): 몸 둘레 — 발밑 전하 고리(차오르면 금빛, 가득 차기 직전 번쩍) · 몸을 타고 흐르는 번개(전하·번개 갈기)
// · 뇌인 맞은 적 머리 위 번개 문양(겹 수만큼 점)
import { isLeo, leoVolt, type RunState } from "@pixel-rogue/shared";
import { arcRing, lightning, VOLT, VOLT_DEEP } from "./leoBolt";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

const TAU = Math.PI * 2;

/** 발밑 전하 고리 (몸보다 먼저) */
export function drawLeoBack(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isLeo(p)) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a) + p.r);
  const v = leoVolt(p);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.42);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(20,16,40,0.45)";
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = v > 0.85 && s.tick % 10 < 5 ? "#ffffff" : VOLT;
  ctx.beginPath();
  ctx.arc(0, 0, 14, -Math.PI / 2, -Math.PI / 2 + TAU * v);
  ctx.stroke();
  ctx.restore();
  if (v > 0.6) additive(ctx, () => glow(ctx, x, y, 16, VOLT, (v - 0.6) * 0.8));
}

/** 몸 위: 전하가 찰수록 번개가 몸을 타고 흐름 · 번개 갈기 · 뇌인 표식 */
export function drawLeoAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isLeo(p)) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a) - 6);
  const v = leoVolt(p);
  const flick = Math.floor(s.tick / 3);
  // 전하: 몸 둘레를 짧은 번개가 기어감 (많이 찰수록 자주·많이)
  const n = Math.floor(v * 4) + (p.passives.includes("leMane") ? 2 : 0);
  if (n > 0 && (s.tick % 6 < 4 || v > 0.85)) arcRing(ctx, x, y, 11, n, (s.tick % 30) / 30, flick, 0.55 + v * 0.45);
  if (v > 0.85 && s.tick % 12 < 2) lightning(ctx, x - 6, y - 14, x + 4, y + 6, flick, 1, 0.9, 1);
  // 뇌인: 적 머리 위 번개 문양 + 겹 점
  for (const e of s.enemies) {
    const m = e.leMark ?? 0;
    if (m <= 0 || e.hp <= 0) continue;
    const ex = snap(lerp(e.prevX ?? e.x, e.x, a));
    const ey = snap(lerp(e.prevY ?? e.y, e.y, a) - e.r - 7);
    const pulse = 0.7 + 0.3 * Math.sin(s.tick * 0.25 + e.id);
    additive(ctx, () => glow(ctx, ex, ey, 7 + m, VOLT, 0.5 * pulse));
    ctx.fillStyle = alpha(VOLT, pulse);
    ctx.beginPath();
    ctx.moveTo(ex + 1, ey - 5);
    ctx.lineTo(ex - 3, ey + 1);
    ctx.lineTo(ex, ey + 1);
    ctx.lineTo(ex - 1, ey + 5);
    ctx.lineTo(ex + 3, ey - 1);
    ctx.lineTo(ex, ey - 1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = alpha(VOLT_DEEP, pulse);
    ctx.lineWidth = 0.6;
    ctx.stroke();
    for (let k = 0; k < m; k++) {
      ctx.fillStyle = k === m - 1 ? "#ffffff" : VOLT;
      ctx.fillRect(ex - m * 1.5 + k * 3, ey + 7, 2, 2);
    }
  }
}
