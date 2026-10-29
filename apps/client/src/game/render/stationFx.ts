// 작업대 결과 (sim/station): 캐릭터 머리 위에서 · 성공 = 금빛 기둥과 별빛이 솟음 (튜닝소는 금빛 렌치 불꽃) · 실패 = 회색 연기 뭉치
// · 파괴 = 붉은 섬광과 사방으로 튀는 파편
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

export function drawStationFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "stOk" && fx.kind !== "stFail" && fx.kind !== "stBreak") return false;
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tune = fx.width === 1;
  if (fx.kind === "stOk") {
    const c = tune ? "#ffd56a" : "#6ab8ff";
    additive(ctx, () => {
      // 솟는 빛기둥 + 퍼지는 고리 + 별빛
      beam(ctx, x, y + 6, x, y - 10 - f * 22, 4 * t + 1, c, t);
      glow(ctx, x, y - 4, fx.size * (0.6 + f * 0.6), c, t, 1.4);
      shock(ctx, x, y, 6 + f * fx.size, c, t, 4);
      sparks(ctx, x, y - 4, 10, fx.size * 1.2, f, "#fff6d0", fx.x + fx.y);
    });
    return true;
  }
  if (fx.kind === "stFail") {
    // 회색 연기 셋이 피어오름
    for (let i = 0; i < 3; i++) {
      const rise = f * (10 + i * 4);
      ctx.fillStyle = alpha("#8a8a96", 0.55 * t);
      ctx.beginPath();
      ctx.arc(x + (i - 1) * 5, y - rise, 3 + f * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }
  additive(ctx, () => {
    glow(ctx, x, y - 2, fx.size * (0.5 + f), "#ff4a3a", t, 1.6);
    shock(ctx, x, y - 2, 4 + f * fx.size * 1.2, "#ff6a4a", t, 5);
  });
  // 파편: 맞은 방향 없이 사방으로 (회전하는 작은 조각)
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + i;
    const d = f * (14 + (i % 3) * 6);
    ctx.fillStyle = alpha(i % 2 ? "#ffb06a" : "#6ab8ff", t);
    ctx.fillRect(snap(x + Math.cos(a) * d), snap(y - 2 + Math.sin(a) * d + f * f * 10), 2, 1);
  }
  return true;
}
