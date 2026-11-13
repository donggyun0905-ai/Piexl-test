// 느아르 효과: 시트 4칸 그림 16종 (기본 공격 1~4단계 · 추가 공격 1~4단계 · 스킬 4개와 강화판, render/noirArt ROW)
// + 빛으로만: 낙인 창 · 터짐 · 보라 충격파(방 끝까지) · 레벨업 · 강화 성공·실패 · 승격
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha as fade, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import { NR, nrPic, ROW } from "./noirArt";

const KINDS = new Set<string>([...Object.keys(ROW), "nrSpear", "nrBurst", "nrWave", "nrLevel", "nrUpOk", "nrUpFail", "nrRankUp"]);
/** 오래 가는 기술 (첫 칸 → 가운데 두 칸을 오감 → 마지막 칸) */
const LONG = new Set<string>(["nrFlurry", "nrSpin", "nrSever", "nrDevour", "nrOrigin", "nrRift", "nrAbyss", "nrBarrier", "nrSqueeze", "nrDrain", "nrBrand"]);
/** 그림 크기 배율 (반지름 → 그림 너비) · 결계 붕괴는 반으로 (2026-11-13) */
const SCALE: Partial<Record<string, number>> = { nrRift: 1.7, nrSlash: 2.4, nrGrasp: 2.4, nrRush: 1.6, nrMoon: 2.4, nrEnd: 2.4, nrBrand: 2.6, nrBarrier: 1.1 };

export function drawNoirFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.85 ? (1 - f) / 0.15 : 1;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const left = fx.dirX < 0;
  switch (fx.kind) {
    case "nrWave":
      // 보라 충격파: 반지름이 방 끝까지 커짐
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * f, NR.violet, 0.9 * (1 - f * 0.6), 6);
        ring(ctx, x, y, fx.size * f, fade(NR.light, 0.7 * (1 - f)), 2);
      });
      return true;
    case "nrBurst":
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (0.6 + f * 0.5), NR.violet, 0.8 * (1 - f), 0.4);
        shock(ctx, x, y, fx.size * easeOut(f), NR.red, 0.7 * (1 - f), 3);
        sparks(ctx, x, y, 12, fx.size, f, NR.light, fx.x + fx.y, 1);
      });
      return true;
    case "nrSpear":
      // 검은 창이 위에서 꿰뚫음 (낙인 그림 마지막 칸)
      nrPic(ctx, ROW.nrBrand, 3, x, y - fx.size * 0.3 * (1 - f), fx.size * 2.6, a);
      additive(ctx, () => glow(ctx, x, y, fx.size * 0.8, NR.red, 0.6 * (1 - f), 0.5));
      return true;
    case "nrLevel":
    case "nrUpOk":
    case "nrUpFail":
    case "nrRankUp": {
      const c = fx.kind === "nrUpFail" ? "#8a8a9a" : fx.kind === "nrRankUp" ? NR.red : NR.violet;
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * (0.4 + easeOut(f)), c, 0.8 * (1 - f), fx.kind === "nrRankUp" ? 4 : 2);
        if (fx.kind !== "nrUpFail") sparks(ctx, x, y - 6, fx.kind === "nrRankUp" ? 18 : 10, fx.size * 1.2, f, NR.light, fx.x, 1);
        glow(ctx, x, y, fx.size * 0.7, c, 0.4 * (1 - f), 0.3);
      });
      return true;
    }
    case "nrRush": {
      // 흑영 돌진: 처음 자리 → 끝 자리 사이에 잔상 그림
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const len = Math.hypot(tx - x, ty - y);
      nrPic(ctx, ROW.nrRush, Math.min(3, Math.floor(f * 4)), (x + tx) / 2, (y + ty) / 2, Math.max(60, len * 1.2), a, left ? ang + Math.PI : ang, left);
      return true;
    }
    default: {
      const row = ROW[fx.kind as keyof typeof ROW];
      // 마력 소멸 3초 뒤 한 방은 마지막 칸
      const col = fx.kind === "nrDrain" && fx.style === 1 ? 3
        : LONG.has(fx.kind) ? (f < 0.15 ? 0 : f > 0.85 ? 3 : 1 + (Math.floor(fx.ticks / 5) % 2))
        : Math.min(3, Math.floor(f * 4));
      // 칠흑 횡베기: 그림의 초승달은 아래로 볼록 → 볼록한 쪽(그림 아래)이 바라보는 쪽을 향하게 돌림 · 나머지는 그 자리 그대로
      const turn = fx.kind === "nrSlash" ? ang - Math.PI / 2 : 0;
      nrPic(ctx, row, col, x, y, fx.size * (SCALE[fx.kind] ?? 2.2), a, turn);
      return true;
    }
  }
}
