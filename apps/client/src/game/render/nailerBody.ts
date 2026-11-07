// 네일러 그리기 (몸 둘레). 몸 뒤: 바닥에 박은 못에서 나에게 이어진 붉은 실 · 못비 중 양옆 검은 분신(못 던지는 자세)
// 몸 위: 적 체력 줄 위 못 마크(못 ×개수) · 날아가는 못(꼬리) · 달빛 각성 흰 기운
import { isNailer, NAILER, type RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { nail, nailMark, NL } from "./nailerArt";

/** 못비 분신: 양옆에 검은 그림자 분신(풍류사 분신술처럼 완전히 어두운 몸 · 발밑 검은 웅덩이 · 피어오르는 검은 기운)이 나와 같은 쪽으로 못을 던짐 (던지는 순간 공격 자세) */
function clones(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const u = p.nlUlt!;
  const throwing = u.t > NAILER.ultGap - 3;
  const pose = { faceX: p.faceX, faceY: p.faceY, moving: false, casting: throwing, step: 0 };
  for (const [k, off] of [-NAILER.ultSide, NAILER.ultSide].entries()) {
    const cx = Math.round(x - p.faceY * off);
    const cy = Math.round(y + p.faceX * off);
    ctx.fillStyle = "rgba(6,6,10,0.6)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + p.r + 2, p.r + 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // 몸에서 피어오르는 검은 기운
    ctx.fillStyle = "rgba(6,6,10,0.45)";
    for (let i = 0; i < 4; i++) {
      const t = ((s.tick * 0.04 + i * 0.25 + k * 0.1) % 1);
      ctx.beginPath();
      ctx.arc(cx - 8 + i * 5, cy - 4 - t * 22, 2.5 * (1 - t) + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.92;
    ctx.filter = "grayscale(1) brightness(0.12) contrast(1.6)";
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
