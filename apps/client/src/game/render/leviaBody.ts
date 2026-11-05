// 리바이어 그리기 (몸 둘레): 해류 웅덩이 (몸 뒤) · 날아가는 고래 · 콤보 점 (몸 위) · 물보라 창끝 물살 탄
import { isLevia, leviaStep, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow } from "./pwFxBits";
import { CYAN, FOAM, SEA, wake, whaleShape } from "./leviaWhale";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 몸 뒤: 해류 웅덩이 (돌아가는 물결 고리) */
export function drawLeviaBack(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  const p = s.player;
  if (!isLevia(p) || !p.lvPools) return;
  for (const o of p.lvPools) {
    const a = Math.min(1, o.t / 20);
    const x = snap(o.x);
    const y = snap(o.y);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.55);
    ctx.fillStyle = alpha(SEA, 0.28 * a);
    ctx.beginPath();
    ctx.arc(0, 0, o.r, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = alpha(CYAN, 0.7 * a);
    ctx.lineWidth = 1.5;
    const spin = s.tick * 0.15 + o.x;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.arc(0, 0, o.r * (0.4 + k * 0.25), spin + k, spin + k + 2.2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/** 몸 위: 날아가는 고래(물살 꼬리 + 고래) · 발밑 콤보 점 셋 (다음 타가 밝음) */
export function drawLeviaAura(ctx: Ctx, s: RunState, alpha0: number, snap: Snap): void {
  const p = s.player;
  if (!isLevia(p)) return;
  for (const w of p.lvWhales ?? []) {
    const x = snap(w.x);
    const y = snap(w.y) - 4;
    const len = w.r * 3.2;
    const a = Math.min(1, w.t / 6);
    wake(ctx, x, y, w.dx, w.dy, len * 0.5, a, w.hit.length + Math.floor(s.tick / 3));
    additive(ctx, () => glow(ctx, x, y, w.r * 1.6, CYAN, 0.35 * a, 0.3));
    whaleShape(ctx, x, y, Math.atan2(w.dy, w.dx), len, a, s.tick);
  }
  const x = snap(lerp(p.prevX, p.x, alpha0));
  const y = snap(lerp(p.prevY, p.y, alpha0));
  const step = leviaStep(p);
  const gy = y + p.r + 7;
  for (let k = 0; k < 3; k++) {
    const on = (p.lvGap ?? 0) > 0 && k < step;
    ctx.fillStyle = "#0a1a2a";
    ctx.fillRect(x - 8 + k * 6, gy - 1, 4, 4);
    ctx.fillStyle = on ? CYAN : alpha(SEA, 0.5);
    ctx.fillRect(x - 7 + k * 6, gy, 2, 2);
  }
  if ((p.lvHaste ?? 0) > 0 && s.tick % 6 < 3) additive(ctx, () => glow(ctx, x, y - 4, 14, FOAM, 0.35, 0.5));
}

/** 물보라 창끝 물살 */
export function drawLeviaShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "lvJet") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  ctx.lineCap = "round";
  for (const [c, w] of [[alpha(SEA, 0.5), 6], [alpha(CYAN, 0.9), 3], [FOAM, 1]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x - dx * 12, y - dy * 12);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  return true;
}
