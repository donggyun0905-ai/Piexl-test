// 인형술사 효과: 실 내리치기(손 아래로 붉은 실이 쏟아짐) · 왕관 씌움(나무 왕관이 내려앉음·깨짐) · 인형 터짐(인형 그림 + 파편) · 시체 인형 터짐 · 검은 실 터짐 · 분신 · 금사슬 · 인형 친구 내려찍기
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { PP, PP_CELL, ppPic } from "./puppetArt";
import { additive, alpha, easeOut, glow, type Ctx } from "./pwFxBits";

const KINDS = new Set(["ppStrike", "ppCrown", "ppDollPop", "ppCorpsePop", "ppBlackPop", "ppClone", "ppChain", "ppSlam"]);

/** 둘레로 퍼지는 고리 */
function ring(ctx: Ctx, x: number, y: number, r: number, col: string, a: number, w = 2): void {
  ctx.strokeStyle = alpha(col, a);
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
  ctx.stroke();
}

export function drawPuppetFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.6 ? (1 - f) / 0.4 : 1;
  switch (fx.kind) {
    case "ppStrike": {
      // 위에서 붉은 실 여러 가닥이 채찍처럼 내리꽂힘
      const r = fx.size;
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const ox = ((i * 37) % 13) / 13 - 0.5;
        const tx = x + ox * r * 1.6;
        const ty = y + (((i * 53) % 11) / 11 - 0.5) * r;
        ctx.strokeStyle = alpha(i % 3 ? PP.red : PP.pale, a);
        ctx.beginPath();
        ctx.moveTo(tx - ox * 10, y - r * 2.2);
        ctx.quadraticCurveTo(tx + Math.sin(f * 9 + i) * 6, y - r, tx, ty);
        ctx.stroke();
      }
      additive(ctx, () => glow(ctx, x, y, r * (0.6 + easeOut(f) * 0.6), PP.red, 0.6 * a));
      ring(ctx, x, y, r * (0.4 + easeOut(f) * 0.7), PP.red, 0.8 * a);
      return true;
    }
    case "ppCrown": {
      if (fx.style === 1) {
        // 아군이 쓰러짐: 왕관이 흩어짐
        ppPic(ctx, PP_CELL.crown, x, y - fx.size - 6 - f * 10, 18, a, f * 2);
        return true;
      }
      const drop = (1 - easeOut(Math.min(1, f * 2))) * 26;
      additive(ctx, () => glow(ctx, x, y - fx.size - 6, 16, "#ffd27a", 0.7 * a));
      ppPic(ctx, PP_CELL.crown, x, y - fx.size - 8 - drop, 22, 1);
      ring(ctx, x, y, fx.size + easeOut(f) * 16, "#ffd27a", 0.8 * a);
      return true;
    }
    case "ppDollPop": {
      const doll = fx.style ?? 0;
      const col = ["#ff6a8a", "#c8a070", "#ffd040", "#ff8a2a", "#ffc8e0", "#a0e0ff", "#ff4a2a", "#9ae0ff"][doll] ?? PP.red;
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.5 + easeOut(f) * 0.7), col, 0.7 * a));
      ring(ctx, x, y, fx.size * easeOut(f), col, 0.8 * a);
      ppPic(ctx, doll, x, y - 6 - f * 14, 22 * (1 - f * 0.5), a, f * 3);
      // 나뭇조각 파편
      ctx.fillStyle = alpha(PP.wood, a);
      for (let i = 0; i < 8; i++) {
        const an = (i / 8) * Math.PI * 2;
        ctx.fillRect(x + Math.cos(an) * fx.size * easeOut(f) - 1, y + Math.sin(an) * fx.size * easeOut(f) - 1, 2, 2);
      }
      return true;
    }
    case "ppCorpsePop":
    case "ppSlam": {
      const big = fx.kind === "ppCorpsePop";
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.6 + easeOut(f) * 0.6), big ? PP.red : "#ffc070", 0.8 * a));
      ring(ctx, x, y, fx.size * easeOut(f), big ? "#ffd27a" : PP.wood, a, 3);
      ring(ctx, x, y, fx.size * easeOut(f) * 0.7, PP.red, 0.7 * a);
      if (big && fx.style !== 1) ppPic(ctx, PP_CELL.corpse, x, y - 10, 46 * (1 + f * 0.3), (1 - f) * 0.8);
      return true;
    }
    case "ppBlackPop": {
      additive(ctx, () => glow(ctx, x, y, fx.size, "#ff2a4a", 0.5 * a));
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const an = (i / 12) * Math.PI * 2 + f;
        ctx.strokeStyle = alpha(i % 2 ? PP.black : PP.dark, a);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(an) * fx.size * easeOut(f), y + Math.sin(an) * fx.size * easeOut(f));
        ctx.stroke();
      }
      ring(ctx, x, y, fx.size * easeOut(f), PP.black, a, 3);
      return true;
    }
    case "ppClone":
      additive(ctx, () => glow(ctx, x, y, fx.size * (1 + f), fx.style === 1 ? "#ffc070" : "#c8a0ff", 0.8 * a));
      ring(ctx, x, y, fx.size * (0.5 + f), "#e8d8ff", a);
      return true;
    default: {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      additive(ctx, () => {
        ctx.strokeStyle = alpha("#ffd27a", a);
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      return true;
    }
  }
}
