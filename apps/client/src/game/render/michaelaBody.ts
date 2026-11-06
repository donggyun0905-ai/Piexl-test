// 미카엘라 그리기 (몸 둘레). 몸 뒤: 땅에 박힌 무기(옅은 보라 빛 · 연쇄 대기 중이면 깜빡임) · 무한의 무기고 중 머리 위 포탈
// 몸 위: 몸 둘레에 떠다니는 무기들(무한의 무기 보관소, 콤보가 많을수록 많이·빨리) · 들고 있는 무기 · 대시 순간 이동 범위 안 무기에 표시
import { isMichaela, MICHAELA, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { blade, MC, portal } from "./michaelaArt";

/** 몸 뒤 */
export function drawMichaelaBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isMichaela(p) || s.over) return;
  const px = lerp(p.prevX, p.x, a0);
  const py = lerp(p.prevY, p.y, a0);
  for (const b of p.mcBlades ?? []) {
    const x = snap(b.x);
    const y = snap(b.y);
    const near = Math.hypot(b.x - px, b.y - py) <= MICHAELA.dashR;
    additive(ctx, () => {
      glow(ctx, x, y, 9, near ? MC.violet : MC.steel, near ? 0.5 + 0.2 * Math.sin(s.tick * 0.2) : 0.3);
      ctx.strokeStyle = alpha(MC.violet, 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    // 날 끝이 땅에 박히고 손잡이가 위로 비스듬히
    blade(ctx, x, y, -Math.PI / 2 + (b.k ? 0.25 : -0.2), b.k, b.k ? 18 : 13, 1);
  }
  if ((p.mcUlt ?? 0) > 0) portal(ctx, snap(px), snap(py) - 64, 34, s.tick * 0.08, Math.min(1, p.mcUlt! / 30));
}

/** 몸 위: 떠다니는 무기 보관소 · 들고 있는 무기 */
export function drawMichaelaAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isMichaela(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0)) - 12;
  const combo = p.mcCombo ?? 0;
  const n = 4 + Math.min(8, Math.floor(combo / 2));
  const spin = s.tick * (0.02 + combo * 0.002);
  for (let i = 0; i < n; i++) {
    const an = spin + (i / n) * Math.PI * 2;
    const bob = Math.sin(s.tick * 0.08 + i) * 2;
    const bx = x + Math.cos(an) * 20;
    const by = y + Math.sin(an) * 8 + bob;
    // 끝이 아래를 향해 떠 있음
    blade(ctx, bx, by + 5, -Math.PI / 2, i % 2, 9, 0.85);
  }
  // 들고 있는 무기: 손 앞에 크게
  const k = p.mcHeld ?? 0;
  blade(ctx, x + p.faceX * 12, y + 6 + p.faceY * 6 - 6, Math.atan2(-p.faceY, -p.faceX), k, k ? 20 : 14, 1);
  if (combo >= 10) additive(ctx, () => glow(ctx, x, y, 22, MC.violet, 0.25 + 0.1 * Math.sin(s.tick * 0.3)));
}
