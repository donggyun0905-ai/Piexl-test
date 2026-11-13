// 루주 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/rougeArt ROW)
// + 빛으로만: 낙인 폭발 · 터짐 · 장미가 모여드는 빛
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { RG, rgPic, ROW } from "./rougeArt";

const KINDS = new Set<string>([...Object.keys(ROW), "rgMarkBoom", "rgBurst", "rgGather"]);
/** 오래 가는 기술 (첫 칸 → 가운데 두 칸을 오감 → 마지막 칸) */
const LONG = new Set<string>(["rgFlame", "rgSpin", "rgPetal", "rgForest", "rgDance", "rgFuneral", "rgRain", "rgEnd", "rgMark", "rgBloomBig", "rgMoon"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { rgX: 2.4, rgThorn: 2.2, rgRush: 1.6, rgMoon: 2.3, rgRain: 2.3, rgEnd: 2.3, rgMark: 2.6, rgBloom: 2.4 };
/** 바라보는 쪽으로 돌리는 그림 (그림은 오른쪽을 봄) */
const TURN = new Set<string>(["rgThorn", "rgMoon"]);

export function drawRougeFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.85 ? (1 - f) / 0.15 : 1;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const left = fx.dirX < 0;
  switch (fx.kind) {
    case "rgBurst":
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (0.6 + f * 0.5), RG.red, 0.8 * (1 - f), 0.4);
        shock(ctx, x, y, fx.size * easeOut(f), fx.style === 1 ? RG.ember : RG.red, 0.7 * (1 - f), 3);
        sparks(ctx, x, y, 14, fx.size, f, RG.light, fx.x + fx.y, 1);
      });
      return true;
    case "rgMarkBoom":
      // 장미 낙인이 안에서 터짐 (낙인 그림 마지막 칸)
      rgPic(ctx, ROW.rgMark, 3, x, y, fx.size * 2.6 * (0.8 + 0.4 * easeOut(f)), a);
      additive(ctx, () => glow(ctx, x, y, fx.size * 0.8, RG.red, 0.6 * (1 - f), 0.5));
      return true;
    case "rgGather": {
      // 장미 하나가 모이는 자리로 날아감
      const t = easeOut(f);
      const px = x + (snap(fx.toX ?? fx.x) - x) * t;
      const py = y + (snap(fx.toY ?? fx.y) - y) * t;
      additive(ctx, () => glow(ctx, px, py, 9, RG.red, 0.8 * (1 - f * 0.5), 0.4));
      rgPic(ctx, ROW.rgBloom, 0, px, py, 22, 1 - f * 0.4);
      return true;
    }
    case "rgRush": {
      // 혈영 돌진: 처음 자리 → 끝 자리 사이에 붉은 잔상
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const len = Math.hypot(tx - x, ty - y);
      rgPic(ctx, ROW.rgRush, Math.min(3, Math.floor(f * 4)), (x + tx) / 2, (y + ty) / 2, Math.max(60, len * 1.2), a, left ? ang + Math.PI : ang, left);
      return true;
    }
    default: {
      const row = ROW[fx.kind as keyof typeof ROW];
      const col = LONG.has(fx.kind) ? (f < 0.15 ? 0 : f > 0.85 ? 3 : 1 + (Math.floor(fx.ticks / 5) % 2)) : Math.min(3, Math.floor(f * 4));
      const turn = TURN.has(fx.kind);
      rgPic(ctx, row, col, x, y, fx.size * (SCALE[fx.kind] ?? 2.2), a, turn ? (left ? ang + Math.PI : ang) : 0, turn && left);
      return true;
    }
  }
}
