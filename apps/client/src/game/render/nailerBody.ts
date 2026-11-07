// 네일러 그리기 (몸 둘레). 몸 뒤: 바닥에 박은 못에서 나에게 이어진 붉은 실 · 못비 중 양옆 분신(붉은 그림자 · 못 던지는 자세)
// 몸 위: 적 체력 줄 위 못 마크(못 ×개수) · 날아가는 못(꼬리) · 달빛 각성 흰 기운
import { isNailer, NAILER, type RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { nail, nailMark, NL } from "./nailerArt";

/** 못비 분신: 양옆에 붉은 그림자 분신이 나와 나와 같은 쪽으로 못을 던짐 (던지는 순간 공격 자세) */
function clones(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const u = p.nlUlt!;
  const throwing = u.t > NAILER.ultGap - 3;
  const pose = { faceX: p.faceX, faceY: p.faceY, moving: false, casting: throwing, step: 0 };
  for (const [k, off] of [-NAILER.ultSide, NAILER.ultSide].entries()) {
    const cx = Math.round(x - p.faceY * off);
    const cy = Math.round(y + p.faceX * off);
    // 발밑 붉은 연기 · 몸 둘레 붉은 기운
    ctx.fillStyle = alpha(NL.blood, 0.45);
    ctx.beginPath();
    ctx.ellipse(cx, cy + p.r + 2, p.r + 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    additive(ctx, () => glow(ctx, cx, cy - 8, 20, NL.red, 0.28 + 0.08 * Math.sin(s.tick * 0.4 + k)));
    ctx.globalAlpha = 0.8;
    ctx.filter = "grayscale(1) sepia(1) hue-rotate(-40deg) saturate(5) brightness(0.55) contrast(1.3)";
    drawCharacter(ctx, "nailer", cx, cy, p.r, pose);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
  }
}

/** 몸 뒤: 붉은 실 (바닥 못 → 나) · 못비 분신 */
export function drawNailerBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isNailer(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (p.nlUlt) clones(ctx, s, x, y);
  const t = p.nlTie;
  if (!t) return;
  const ax = snap(t.ax);
  const ay = snap(t.ay);
  const pulse = 0.7 + 0.3 * Math.sin(s.tick * 0.3);
  additive(ctx, () => {
    ctx.strokeStyle = alpha(NL.red, 0.35 * pulse);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  ctx.strokeStyle = alpha(NL.red, 0.95);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(x, y);
  ctx.stroke();
  nail(ctx, ax, ay - 12, Math.PI / 2, 13, 0.3 * pulse);
}

/** 몸 위: 못 마크 · 날아가는 못 · 각성 기운 */
export function drawNailerAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isNailer(p) || s.over) return;
  for (const e of s.enemies) if ((e.nlNails ?? 0) > 0 && e.hp > 0) nailMark(ctx, snap(e.x) - 2, snap(e.y) - e.r - 9, e.nlNails!, s.tick);
  for (const n of p.nlShots ?? []) {
    const a = Math.atan2(n.vy, n.vx);
    const len = n.k >= 2 ? 12 : 10;
    const tail = Math.min(26, Math.hypot(n.vx, n.vy) * 2.2);
    const hx = n.x - Math.cos(a) * len;
    const hy = n.y - Math.sin(a) * len;
    additive(ctx, () => {
      ctx.strokeStyle = alpha(n.k === 3 ? NL.red : "#ffffff", n.k >= 1 ? 0.5 : 0.3);
      ctx.lineWidth = n.k === 3 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(snap(hx - Math.cos(a) * tail), snap(hy - Math.sin(a) * tail));
      ctx.lineTo(snap(hx), snap(hy));
      ctx.stroke();
    });
    nail(ctx, snap(hx), snap(hy), a, len, n.k === 3 ? 0.35 : 0);
  }
  if ((p.sgAwake ?? 0) > 0) {
    const x = snap(lerp(p.prevX, p.x, a0));
    const y = snap(lerp(p.prevY, p.y, a0));
    additive(ctx, () => glow(ctx, x, y - 8, 18, NL.moon, 0.18 + 0.06 * Math.sin(s.tick * 0.2)));
  }
}
