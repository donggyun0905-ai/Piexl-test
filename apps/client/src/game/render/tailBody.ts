// 테일 그리기 (몸 둘레): 영역 바다 (몸 뒤: 맑은 물 · 일렁이는 빛무늬 · 돌아가는 물결 테두리 · 맴도는 등지느러미 · 솟을 자리 물소용돌이)
// 몸 위: 상어 (돌진은 물에서 튀어나와 날아가고 · 낙하는 높이 솟구쳤다 내리꽂힘) · 물 상어로 변한 몸 · 발밑 콤보 점
import { isTail, seaR, tailShark, tailStep, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { bubbles, caustic, glints } from "./seaLight";
import { AQUA, FOAM, WATER, finShape, ripple, sharkShape } from "./tailShark";

const TAU = Math.PI * 2;

/** 몸 뒤: 영역 바다와 물속 상어 그림자 */
export function drawTailBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isTail(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const r = seaR(p);
  const t = s.tick;
  ctx.save();
  // 맑은 바다: 가운데는 투명한 하늘빛 → 가장자리로 갈수록 짙은 물빛
  const g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r);
  g.addColorStop(0, alpha(AQUA, 0.05));
  g.addColorStop(0.7, alpha(WATER, 0.13));
  g.addColorStop(1, alpha("#0a6ab8", 0.24));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.clip();
  caustic(ctx, x, y, r * 0.9, t, 0.13);
  ctx.restore();
  // 물결 테두리: 두 겹이 반대로 돌며 흰 거품이 부서짐
  additive(ctx, () => {
    ctx.lineWidth = 2;
    for (let k = 0; k < 2; k++) {
      const spin = (k ? -1 : 1) * t * 0.03;
      ctx.strokeStyle = alpha(k ? FOAM : AQUA, k ? 0.45 : 0.6);
      for (let i = 0; i < 6; i++) {
        const a = spin + (i / 6) * TAU;
        ctx.beginPath();
        ctx.arc(x, y, r - k * 3, a, a + 0.7);
        ctx.stroke();
      }
    }
  });
  glints(ctx, x, y, r * 0.95, 5, t, 11, FOAM, 0.55);
  // 바다를 맴도는 등지느러미 둘
  for (let k = 0; k < 2; k++) {
    const a = t * 0.025 + k * Math.PI;
    finShape(ctx, x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72, a + Math.PI / 2, 5, 0.75);
  }
  // 솟을 자리 (삼키기·낙하): 물이 소용돌이치며 어두워짐 → 곧 물 상어가 나옴
  for (const w of p.tlSharks ?? []) {
    if (w.k === 1) continue;
    const k = 1 - w.t / w.t0;
    const wx = snap(w.x);
    const wy = snap(w.y);
    ctx.fillStyle = alpha("#04305a", 0.25 + k * 0.3);
    ctx.beginPath();
    ctx.ellipse(wx, wy, w.r * (0.5 + k * 0.5), w.r * (0.25 + k * 0.25), 0, 0, TAU);
    ctx.fill();
    for (let i = 0; i < 3; i++) ripple(ctx, wx, wy, w.r * (1.1 - ((k * 2 + i * 0.33) % 1)), 0.7 * k, i ? AQUA : FOAM);
    if (w.k === 0) finShape(ctx, wx + Math.cos(t * 0.3) * w.r * 0.6, wy + Math.sin(t * 0.3) * w.r * 0.3, t * 0.3 + Math.PI / 2, 4 + k * 3, 0.9);
  }
  ctx.restore();
}

/** 몸 위: 날아가는 상어 · 물 상어로 변한 몸 · 콤보 점 */
export function drawTailAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isTail(p)) return;
  const t = s.tick;
  for (const w of p.tlSharks ?? []) {
    const k = 1 - w.t / w.t0;
    if (w.k === 1) {
      // 돌진: 물에서 튀어나와 포물선으로 날며 꿰뚫고 다시 잠수
      const hop = Math.sin(k * Math.PI) * 14;
      const wx = snap(w.x);
      const wy = snap(w.y) - hop;
      ctx.fillStyle = alpha("#04305a", 0.3);
      ctx.beginPath();
      ctx.ellipse(wx, snap(w.y) + 3, w.r * 1.2, w.r * 0.4, 0, 0, TAU);
      ctx.fill();
      additive(ctx, () => {
        ctx.lineCap = "round";
        for (const [c, lw] of [[alpha(WATER, 0.4), 9], [alpha(AQUA, 0.7), 4], [FOAM, 1.5]] as const) {
          ctx.strokeStyle = c;
          ctx.lineWidth = lw;
          ctx.beginPath();
          ctx.moveTo(wx - w.dx * 26, wy - w.dy * 26 + hop * 0.6);
          ctx.lineTo(wx - w.dx * 6, wy - w.dy * 6);
          ctx.stroke();
        }
        ctx.lineCap = "butt";
      });
      bubbles(ctx, wx - w.dx * 12, wy - w.dy * 12, 10, k, w.id + w.t0, 4, 0.8);
      sharkShape(ctx, wx, wy, Math.atan2(w.dy - (0.5 - k) * 0.6, w.dx), w.r * 3, 1, t, 0.7);
    } else if (w.k === 2) {
      // 낙하: 높이 솟구쳤다가 머리부터 내리꽂힘 · 땅에는 커지는 그림자
      const up = k < 0.55 ? Math.sin((k / 0.55) * (Math.PI / 2)) : 1 - ((k - 0.55) / 0.45) ** 2;
      const wx = snap(w.x);
      const wy = snap(w.y) - up * 70 - 6;
      ctx.fillStyle = alpha("#04203a", 0.2 + k * 0.35);
      ctx.beginPath();
      ctx.ellipse(snap(w.x), snap(w.y), w.r * (0.4 + k * 0.6), w.r * (0.2 + k * 0.3), 0, 0, TAU);
      ctx.fill();
      ripple(ctx, snap(w.x), snap(w.y), w.r * k, 0.8 * k, FOAM, 1.5);
      const ang = k < 0.55 ? -Math.PI / 2 : Math.PI / 2;
      additive(ctx, () => glow(ctx, wx, wy, w.r * 0.9, AQUA, 0.3, 0.3));
      sharkShape(ctx, wx, wy, ang + Math.sin(t * 0.4) * 0.15, w.r * 1.6, 1, t, k > 0.7 ? 1 : 0.3);
      if (k < 0.3) bubbles(ctx, snap(w.x), snap(w.y) - 6, w.r * 0.8, k / 0.3, w.id, 6, 1 - k / 0.3);
    }
  }
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (tailShark(p) && p.tlBite) {
    // 물 상어로 변한 몸: 번개처럼 앞으로 (턱을 크게 벌림)
    additive(ctx, () => glow(ctx, x, y - 4, 20, AQUA, 0.5, 0.45));
    sharkShape(ctx, x, y - 4, Math.atan2(p.tlBite.dy, p.tlBite.dx), 34, 1, t * 2, 0.6 + Math.sin(t * 0.8) * 0.4);
  }
  const step = tailStep(p);
  const gy = y + p.r + 7;
  for (let k = 0; k < 3; k++) {
    const on = (p.tlGap ?? 0) > 0 && k < step;
    ctx.fillStyle = "#04203a";
    ctx.fillRect(x - 8 + k * 6, gy - 1, 4, 4);
    ctx.fillStyle = on ? AQUA : alpha(WATER, 0.5);
    ctx.fillRect(x - 7 + k * 6, gy, 2, 2);
  }
}
