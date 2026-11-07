// 네일러 그리기 (몸 둘레). 몸 뒤: 바닥에 박은 못에서 나에게 이어진 붉은 실 · 몸 위: 적 체력 줄 위 못 마크(못 ×개수) · 날아가는 못 · 못비 중 양옆 망치 · 달빛 각성 흰 기운
import { isNailer, NAILER, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { hammer, nail, nailMark, NL } from "./nailerArt";

/** 몸 뒤: 붉은 실 (바닥 못 → 나) */
export function drawNailerBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isNailer(p) || s.over || !p.nlTie) return;
  const t = p.nlTie;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
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
  nail(ctx, ax, ay - 10, Math.PI / 2, 12, 0.3 * pulse);
}

/** 몸 위: 못 마크 · 날아가는 못 · 못비 양옆 망치 · 각성 기운 */
export function drawNailerAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isNailer(p) || s.over) return;
  for (const e of s.enemies) if ((e.nlNails ?? 0) > 0 && e.hp > 0) nailMark(ctx, snap(e.x) - 2, snap(e.y) - e.r - 9, e.nlNails!, s.tick);
  for (const n of p.nlShots ?? []) {
    const sp = Math.hypot(n.vx, n.vy) || 1;
    const a = Math.atan2(n.vy, n.vx);
    const len = n.k >= 2 ? 11 : 9;
    if (n.k >= 1) additive(ctx, () => {
      ctx.strokeStyle = alpha(n.k === 3 ? NL.red : NL.steel, 0.45);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(snap(n.x - (n.vx / sp) * sp * 2.2), snap(n.y - (n.vy / sp) * sp * 2.2));
      ctx.lineTo(snap(n.x), snap(n.y));
      ctx.stroke();
    });
    nail(ctx, snap(n.x - Math.cos(a) * len), snap(n.y - Math.sin(a) * len), a, len, n.k === 3 ? 0.35 : 0);
  }
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const u = p.nlUlt;
  if (u) {
    // 못비: 양옆에 떠 있는 망치 둘 (번갈아 휘두름)
    const a = Math.atan2(p.faceY, p.faceX);
    const swing = Math.sin((s.tick % NAILER.ultGap) / NAILER.ultGap * Math.PI);
    for (const off of [-NAILER.ultSide, NAILER.ultSide]) {
      const hx = x - p.faceY * off;
      const hy = y - 4 + p.faceX * off;
      additive(ctx, () => glow(ctx, hx, hy, 10, NL.red, 0.35));
      hammer(ctx, hx - Math.cos(a) * 10, hy - Math.sin(a) * 10, a - 0.9 + 0.9 * swing, 12, "#d8d8e8");
    }
  }
  if ((p.sgAwake ?? 0) > 0) additive(ctx, () => glow(ctx, x, y - 8, 18, NL.moon, 0.18 + 0.06 * Math.sin(s.tick * 0.2)));
}
