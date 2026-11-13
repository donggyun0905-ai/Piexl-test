// 블뢰 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/bleuArt ROW)
// + 빛으로만: 얼음 터짐 · 눈결정 생김
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { BU, buPic, ROW, snowflake } from "./bleuArt";
import { sheetLoop, sheetPlay } from "./sheetLoop";

/** 예전 방식(차례대로 보여 주고 마지막 칸에서 머묾 · 끝 15% 동안 흐려짐)이 더 낫다고 한 효과 (2026-11-13 사용자): 추가 공격 1~4단계 · 2번·4번 강화 */
const OLD = new Set<string>(["buWolf", "buHawk", "buDeer", "buLegion", "buHowl", "buEnd"]);
/** 예전 방식에서 네 칸을 다 보여 주는 틱 */
const PLAY = 36;

const KINDS = new Set<string>([...Object.keys(ROW), "buPop", "buFlake"]);
/** 그림 크기 배율 (반지름 → 그림 너비) */
const SCALE: Partial<Record<string, number>> = { buBolt: 2.6, buHowl: 3.4, buWolf: 2.2, buHawk: 2.2, buRain: 2.3, buPrison: 2.3, buStop: 2.4, buEnd: 0.6 };

export function drawBleuFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  // 맨 끝 5틱만 흐려짐 (마지막 그림이 다 보이게)
  const a = OLD.has(fx.kind) ? (f > 0.85 ? (1 - f) / 0.15 : 1) : Math.min(1, fx.ticks / 5);
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const left = fx.dirX < 0;
  const w = fx.size * (SCALE[fx.kind] ?? 2.2);
  switch (fx.kind) {
    case "buPop":
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (0.6 + f * 0.5), BU.ice, 0.7 * (1 - f), 0.45);
        shock(ctx, x, y, fx.size * easeOut(f), BU.light, 0.7 * (1 - f), 3);
        sparks(ctx, x, y, 14, fx.size, f, BU.light, fx.x + fx.y, 1);
      });
      return true;
    case "buFlake":
      snowflake(ctx, x, y, 3 + 5 * easeOut(f), 1 - f);
      return true;
    case "buWolf":
    case "buHawk": {
      // 영혼 늑대·매: 곁에서 적에게로 달려가고(가운데 두 칸), 닿으면 마지막 칸
      const go = Math.min(1, f * (fx.maxTicks / Math.max(1, fx.maxTicks - 12)));
      const t = easeOut(go);
      const px = x + (snap(fx.toX ?? fx.x) - x) * t;
      const py = y + (snap(fx.toY ?? fx.y) - y) * t;
      const col = go >= 1 ? 3 : go < 0.15 ? 0 : 1 + (Math.floor(fx.ticks / 4) % 2);
      buPic(ctx, ROW[fx.kind], col, px, py, w, a, 0, left);
      return true;
    }
    default: {
      const turn = fx.kind === "buHowl";
      if (OLD.has(fx.kind)) return sheetPlay(ctx, buPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, PLAY, x, y, w, a, turn ? (left ? ang + Math.PI : ang) : 0, turn && left), true;
      sheetLoop(ctx, buPic, ROW[fx.kind as keyof typeof ROW], fx.ticks, fx.maxTicks, x, y, w, a, turn ? (left ? ang + Math.PI : ang) : 0, turn && left);
      return true;
    }
  }
}
