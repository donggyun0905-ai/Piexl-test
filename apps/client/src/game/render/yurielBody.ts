// 유리엘 그리기 (몸 둘레). 몸 뒤: 수호 결계(바닥 문양·성수 빛 · 도는 빛 십자) · 성녀 강림 중 몸 둘레 결계와 등 뒤 후광
// 몸 위: 단죄가 쌓인 적 머리 위 빛 십자 점(쌓인 수만큼) · 날아가는 집행의 철퇴는 효과(yrMaceFx)에서
import { isYuriel, YURIEL, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, rune, type Ctx } from "./pwFxBits";
import { YR } from "./yurielFx";

/** 결계 한 겹: 숨 쉬는 성수 빛 + 바닥 문양 + 도는 빛 십자 넷 */
function ward(ctx: Ctx, x: number, y: number, r: number, t: number, al: number): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, alpha(YR.water, 0.05 * al));
  g.addColorStop(0.85, alpha(YR.water, 0.16 * al));
  g.addColorStop(1, alpha(YR.light, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => {
    rune(ctx, x, y, r, YR.light, (0.45 + 0.15 * Math.sin(t * 0.08)) * al, t * 0.01);
    for (let i = 0; i < 4; i++) {
      const a = t * 0.02 + (i * Math.PI) / 2;
      const cx = x + Math.cos(a) * r * 0.92;
      const cy = y + Math.sin(a) * r * 0.5;
      ctx.fillStyle = alpha(YR.gold, 0.8 * al);
      ctx.fillRect(cx - 0.5, cy - 4, 1.5, 7);
      ctx.fillRect(cx - 2.5, cy - 2, 5.5, 1.5);
      glow(ctx, cx, cy, 6, YR.light, 0.4 * al);
    }
  });
}

/** 몸 뒤 */
export function drawYurielBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isYuriel(p) || s.over) return;
  if (p.yrWard) ward(ctx, snap(p.yrWard.x), snap(p.yrWard.y), p.yrWard.r, s.tick, Math.min(1, p.yrWard.t / 30));
  if ((p.yrSaint ?? 0) > 0) {
    const bx = snap(lerp(p.prevX, p.x, a0));
    const by = snap(lerp(p.prevY, p.y, a0));
    ward(ctx, bx, by, YURIEL.ultWardR, s.tick, Math.min(1, p.yrSaint! / 30));
    additive(ctx, () => {
      glow(ctx, bx, by - 14, 22, YR.light, 0.5, 0.6);
      ring(ctx, bx, by - 22, 7 + Math.sin(s.tick * 0.1), alpha(YR.gold, 0.8), 1.5);
    });
  }
}

/** 몸 위: 단죄 점 (적 머리 위) */
export function drawYurielAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isYuriel(p) || s.over) return;
  additive(ctx, () => {
    for (const e of s.enemies) {
      const n = e.yrSin ?? 0;
      if (n <= 0 || e.hp <= 0) continue;
      const x = snap(lerp(e.prevX, e.x, a0));
      const y = snap(lerp(e.prevY, e.y, a0)) - e.r - 8;
      for (let i = 0; i < n; i++) {
        const cx = x + (i - (n - 1) / 2) * 5;
        ctx.fillStyle = alpha(n >= YURIEL.sinMax - 1 ? YR.white : YR.gold, 0.95);
        ctx.fillRect(cx - 0.5, y - 3, 1.5, 5);
        ctx.fillRect(cx - 1.5, y - 2, 3.5, 1.2);
      }
    }
  });
}
