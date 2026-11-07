// 블래스트 그리기 (몸 둘레): 달빛 각성 중 몸을 감싸는 흰 달빛 · 머리 위 초승달 (각성이 끝나 갈수록 흐려짐)
import { isBlast, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, crescent, glow, type Ctx } from "./pwFxBits";

export function drawBlastAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBlast(p) || s.over || !(p.sgAwake ?? 0)) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const left = Math.min(1, p.sgAwake! / 60);
  const pulse = 0.8 + 0.2 * Math.sin(s.tick * 0.25);
  additive(ctx, () => {
    glow(ctx, x, y - 8, 22, "#c8d8ff", 0.45 * left * pulse, 0.6);
    crescent(ctx, x, y - 34, 7, -Math.PI / 2 + Math.sin(s.tick * 0.05) * 0.2, 2.2, 3, "#ffffff", 0.9 * left);
  });
}
