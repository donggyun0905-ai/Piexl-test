// 이안 그리기 (몸 둘레). 몸 뒤: 날아가는 인과의 실 · 인과율 속박 중 나와 적을 잇는 실
// 몸 위: 적 머리 위 기록(잉크 점 다섯 칸) · 속박된 적을 감은 실 고리 · 급소 준비(머리 위 붉은 눈빛)
import { isIan, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { IA, threadLine } from "./ianFx";

/** 몸 뒤 */
export function drawIanBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isIan(p) || s.over) return;
  const px = snap(lerp(p.prevX, p.x, a0));
  const py = snap(lerp(p.prevY, p.y, a0)) - 6;
  additive(ctx, () => {
    for (const w of p.iaThreads ?? []) {
      // 날아가는 실: 나에게서 실 끝까지 이어진 가는 실 + 금빛 바늘 끝
      const x = snap(w.x);
      const y = snap(w.y) - 4;
      const al = Math.min(1, w.left / 40);
      threadLine(ctx, px, py, x, y, IA.ink, 1, al * 0.7);
      threadLine(ctx, x - w.dx * 10, y - w.dy * 10, x, y, IA.gold, 1.5, al);
      glow(ctx, x, y, w.w, IA.violet, 0.35 * al);
    }
    if ((p.iaLaw ?? 0) > 0) {
      // 인과율 속박: 나와 묶인 적마다 팽팽한 실 (살짝 떨림)
      const al = Math.min(1, p.iaLaw! / 30) * (0.5 + 0.2 * Math.sin(s.tick * 0.4));
      for (const e of s.enemies) {
        if (e.hp <= 0 || !(e.iaBind ?? 0)) continue;
        threadLine(ctx, px, py, snap(e.x), snap(e.y) - 4, IA.ink, 1, al);
      }
      glow(ctx, px, py, 22, IA.violet, 0.3);
    }
  });
}

/** 몸 위 */
export function drawIanAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isIan(p) || s.over) return;
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const x = snap(lerp(e.prevX, e.x, a0));
    const y = snap(lerp(e.prevY, e.y, a0));
    const n = e.iaRec ?? 0;
    if (n > 0) {
      // 기록: 다섯 칸 가운데 찬 만큼 보라 잉크 (빈 칸은 어둡게)
      for (let k = 0; k < 5; k++) {
        ctx.fillStyle = k < n ? (n >= 4 ? IA.gold : IA.ink) : alpha(IA.dark, 0.7);
        ctx.fillRect(x - 7 + k * 3, y - e.r - 8, 2, 2);
      }
    }
    if ((e.iaBind ?? 0) > 0) {
      // 속박: 몸을 감은 실 고리 둘이 천천히 돎 · 금빛 매듭
      const t = s.tick * 0.12 + e.id;
      additive(ctx, () => {
        for (let i = 0; i < 2; i++) {
          ctx.strokeStyle = alpha(i ? IA.ink : IA.violet, 0.85);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(x, y - 3 + i * 5, e.r + 3, (e.r + 3) * 0.4, Math.sin(t + i) * 0.25, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.fillStyle = IA.gold;
      ctx.fillRect(x + e.r + 1, y - 2, 2, 2);
    }
  }
  if (p.iaAmbush) {
    // 급소 준비: 머리 위 붉은 눈빛 (깜빡)
    const px = snap(lerp(p.prevX, p.x, a0));
    const py = snap(lerp(p.prevY, p.y, a0));
    additive(ctx, () => glow(ctx, px, py - 30, 4 + Math.sin(s.tick * 0.3), IA.red, 0.8, 0.5));
  }
}
