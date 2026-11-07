// 헬피스트 그리기 (몸 위): 악마화가 쌓일수록 왼쪽 팔 둘레에 붉은 기운이 짙어짐 · 적혈 각성 중 붉은 기운 · 올라가는 불티
import { isHellfist, rageMax, rageOf, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";
import { HF } from "./hellfistFx";

export function drawHellfistAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isHellfist(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const k = rageOf(p) / Math.max(1, rageMax(p));
  const awake = (p.sgAwake ?? 0) > 0;
  if (k <= 0 && !awake) return;
  // 왼팔 (화면 기준 바라보는 쪽의 왼편)
  const ax = x + p.faceY * 6 + p.faceX * 3;
  const ay = y - 6 - p.faceX * 3;
  additive(ctx, () => {
    glow(ctx, ax, ay, 8 + 8 * k, HF.red, 0.15 + 0.3 * k + 0.05 * Math.sin(s.tick * 0.25));
    if (awake) glow(ctx, x, y - 8, 20, HF.red, 0.22 + 0.06 * Math.sin(s.tick * 0.2));
  });
  if (!awake) return;
  for (let i = 0; i < 3; i++) {
    const t = ((s.tick + i * 13) % 40) / 40;
    ctx.fillStyle = i % 2 ? HF.ember : HF.red;
    ctx.fillRect(Math.round(x - 6 + i * 6), Math.round(y - 4 - t * 22), 1, 2);
  }
}
