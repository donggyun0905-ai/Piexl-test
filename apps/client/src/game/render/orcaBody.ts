// 오르카 그리기 (몸 둘레). 몸 뒤: 소용돌이 장판 · 상어 물살 꼬리 · 범고래 돌파 물길
// 몸 위: 헤엄치는 상어 기공파 · 범고래 물기운 · 해방 게이지(손의 푸른 불꽃이 커짐, 가득이면 몸 둘레 물빛 고리) · 때린 주먹 빛
import { isOrca, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock, type Ctx } from "./pwFxBits";
import { bubbles, caustic, glints } from "./seaLight";
import { fistGlow, OC_AQUA, OC_DEEP, OC_FOAM, orcaShape, sharkShape, spiral } from "./orcaArt";

/** 몸 뒤: 소용돌이 장판 · 상어 뒤 물살 · 돌파 물길 */
export function drawOrcaBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isOrca(p) || s.over) return;
  for (const w of p.ocPools ?? []) {
    const al = Math.min(1, w.t / 20);
    const x = snap(w.x);
    const y = snap(w.y);
    additive(ctx, () => glow(ctx, x, y, 46, OC_DEEP, 0.5 * al));
    spiral(ctx, x, y, 46, -s.tick * 0.18, 3, al);
    caustic(ctx, x, y, 36, s.tick, 0.5 * al);
  }
  for (const k of p.ocSharks ?? []) {
    const x = snap(k.x);
    const y = snap(k.y);
    additive(ctx, () => {
      const len = 26 * k.size;
      const g = ctx.createLinearGradient(x, y, x - k.dx * len, y - k.dy * len);
      g.addColorStop(0, alpha(OC_AQUA, 0.55));
      g.addColorStop(1, alpha(OC_AQUA, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = 10 * k.size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - k.dx * len, y - k.dy * len);
      ctx.stroke();
      ctx.lineCap = "butt";
    });
  }
  const b = p.ocBreach;
  if (b) {
    const px = snap(lerp(p.prevX, p.x, a0));
    const py = snap(lerp(p.prevY, p.y, a0));
    additive(ctx, () => {
      // 물이 양옆으로 갈라지는 물길
      for (const side of [-1, 1]) {
        ctx.strokeStyle = alpha(OC_FOAM, 0.7);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px - b.dy * side * 8, py + b.dx * side * 8);
        ctx.lineTo(px - b.dx * 60 - b.dy * side * 26, py - b.dy * 60 + b.dx * side * 26);
        ctx.stroke();
      }
      const g = ctx.createLinearGradient(px, py, px - b.dx * 70, py - b.dy * 70);
      g.addColorStop(0, alpha(OC_AQUA, 0.6));
      g.addColorStop(1, alpha(OC_AQUA, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - b.dx * 70, py - b.dy * 70);
      ctx.stroke();
    });
  }
}

/** 몸 위: 상어 · 범고래 · 게이지 · 주먹 */
export function drawOrcaAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isOrca(p) || s.over) return;
  for (const k of p.ocSharks ?? []) {
    const near = k.prey !== undefined ? s.enemies.find((e) => e.id === k.prey) : undefined;
    const bite = near ? Math.max(0, 1 - Math.hypot(near.x - k.x, near.y - k.y) / 40) : 0;
    sharkShape(ctx, snap(k.x), snap(k.y), Math.atan2(k.dy, k.dx), k.size, Math.min(1, k.t / 8), s.tick, bite);
  }
  const px = snap(lerp(p.prevX, p.x, a0));
  const py = snap(lerp(p.prevY, p.y, a0)) - 4;
  const b = p.ocBreach;
  if (b) {
    orcaShape(ctx, px, py, Math.atan2(b.dy, b.dx), 1, 0.85, s.tick);
    bubbles(ctx, px, py, 30, (s.tick % 20) / 20, s.tick, 6, 0.8);
    return;
  }
  // 해방 게이지: 양손 푸른 불꽃이 차오름 · 가득이면 몸 둘레 고리 + 반짝임
  const fill = (p.ocTide ?? 0) / 100;
  const side = [-p.faceY, p.faceX];
  for (const sgn of [-1, 1]) fistGlow(ctx, px + side[0]! * 6 * sgn + p.faceX * 3, py + 3 + side[1]! * 4 * sgn, 2 + fill * 4, 0.35 + fill * 0.5, s.tick + sgn * 7);
  if (fill >= 1) {
    const pulse = 0.5 + Math.sin(s.tick * 0.2) * 0.3;
    additive(ctx, () => {
      shock(ctx, px, py + 2, 16 + Math.sin(s.tick * 0.2) * 2, OC_AQUA, 0.6 * pulse, 3);
      glow(ctx, px, py, 22, OC_AQUA, 0.25 * pulse);
    });
    glints(ctx, px, py, 16, 3, s.tick, 5, OC_FOAM, 0.8);
  }
  // 막 때린 주먹: 앞으로 뻗은 큰 빛
  const last = p.ocLast;
  const since = last ? s.tick - last.t : 99;
  if (last && since < 10) {
    const reach = last.k === 2 ? 8 : 12;
    fistGlow(ctx, px + p.faceX * reach, py + 2 + p.faceY * reach - (last.k === 2 ? 6 : 0), 6 - since * 0.4, 1 - since / 10, s.tick);
    if (since < 4) additive(ctx, () => shock(ctx, px + p.faceX * reach, py + 2 + p.faceY * reach, 6 + since * 3, OC_FOAM, 0.8, 2));
  }
}
