// 백령 효과: 대태도 베기(초승달 빛 부채꼴) · 검무 소용돌이(1→4칸) · 대태도 쾅(칼이 박히며 푸른 불 고리) · 번개 · 유령 걸음 혼불
// 혼등(혼불이 날아감) · 영혼이 몸으로 빨려 듦 · 게이지 한 칸 참(몸 둘레 푸른 고리)
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import { BY, byPic, slashPic, swordPic } from "./baekArt";

const KINDS = new Set(["bySlash", "byWhirl", "byGreat", "byBolt", "byStep", "byWisp", "bySoul", "byLevel"]);

/** 번개 (꺾인 선) */
function bolt(ctx: Ctx, x: number, y: number, tx: number, ty: number, a: number, seed: number): void {
  ctx.strokeStyle = alpha(BY.bolt, a);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1; i < 5; i++) {
    const k = i / 5;
    const jx = (((seed * 7 + i * 13) % 9) - 4) * 1.4;
    ctx.lineTo(x + (tx - x) * k + jx, y + (ty - y) * k);
  }
  ctx.lineTo(tx, ty);
  ctx.stroke();
  additive(ctx, () => glow(ctx, tx, ty, 8, BY.blue, a));
}

export function drawBaekFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.6 ? (1 - f) / 0.4 : 1;
  switch (fx.kind) {
    case "bySlash": {
      // 대태도 베기: 바라보는 쪽 앞에 초승달 빛이 커지며 지나감
      const d = fx.size * (0.35 + easeOut(f) * 0.35);
      slashPic(ctx, Math.min(3, Math.floor(f * 5)), x + fx.dirX * d, y + fx.dirY * d, fx.size * 0.7, fx.dirX, fx.dirY, a);
      return true;
    }
    case "byWhirl": {
      // 검무 소용돌이: 그림 1→2→3→4칸을 영상처럼 차례로 (돌리지 않음) · 마지막 칸에서만 옅어짐
      const frame = Math.min(3, Math.floor(f * 4));
      additive(ctx, () => byPic(ctx, 1, frame, x, y, fx.size * 2.6, f > 0.85 ? (1 - f) / 0.15 : 1));
      return true;
    }
    case "byGreat": {
      if (fx.style === 1) {
        // 꽂힘: 칼이 위에서 쿵 + 짧은 빛
        additive(ctx, () => glow(ctx, x, y, fx.size, BY.blue, 0.8 * (1 - f), 0.4));
        sparks(ctx, x, y, 8, fx.size, f, BY.pale, 5, 1 - f);
        return true;
      }
      // 떨어진 대태도: 칼이 박혔다 옅어짐 · 푸른 불 고리가 퍼짐
      swordPic(ctx, x, y + 6, fx.size * 2.2, 1 - f);
      additive(ctx, () => glow(ctx, x, y, fx.size * 1.1, BY.blue, 0.85 * a, 0.4));
      shock(ctx, x, y, fx.size * easeOut(f), BY.blue, a, 6);
      sparks(ctx, x, y, 14, fx.size * 1.3, f, BY.pale, 9, a);
      return true;
    }
    case "byBolt":
      bolt(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), 1 - f, fx.ticks);
      return true;
    case "byStep": {
      additive(ctx, () => glow(ctx, x, y, fx.size, BY.blue, 0.7 * a, 0.3));
      ring(ctx, x, y, fx.size * easeOut(f), alpha(BY.pale, 0.8 * a), 2);
      sparks(ctx, x, y, 10, fx.size * 1.2, f, BY.blue, 3, a);
      return true;
    }
    case "byWisp":
    case "bySoul": {
      // 혼불(혼등)·영혼: 둥글게 휘어 날아감
      const k = easeOut(f);
      const tx = fx.toX ?? fx.x;
      const ty = fx.toY ?? fx.y;
      const sx = x + (tx - fx.x) * k;
      const sy = y + (ty - fx.y) * k - Math.sin(k * Math.PI) * (fx.kind === "bySoul" ? 18 : 10);
      const r = fx.kind === "bySoul" ? 2.5 : 4;
      additive(ctx, () => glow(ctx, sx, sy, r * 2.5, BY.blue, 0.9 * (1 - f * 0.5), 0.5));
      return true;
    }
    case "byLevel": {
      ring(ctx, x, y, 10 + easeOut(f) * 22, alpha(BY.blue, 0.9 * (1 - f)), 2);
      additive(ctx, () => glow(ctx, x, y - 6, 18, BY.pale, 0.6 * (1 - f), 0.4));
      sparks(ctx, x, y - 6, 12, 26, f, BY.pale, 7, 1 - f);
      return true;
    }
  }
  return false;
}
