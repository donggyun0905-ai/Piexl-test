// 기어스 효과: 시트 4칸 그림 11종 (쌍방패 강타·쌍성 방패·연속 방패타·거울 반격·보호막 돔·대지 분쇄·방패 충격파·육각 방벽·방패 던지기 터짐·천상의 수호자 맞음·청뢰 방패 폭풍)
// + 빛으로만: 구체 부딪힘(작은 퉁!) · 반동 장갑 · 육각 결정 · 메아리
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha as fade, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import { GE, gePic, ROW } from "./gearsArt";

const KINDS = new Set(["geSlam", "geTwin", "geBarrage", "geMirror", "geDome", "geQuake", "geWave", "geHex", "geBoom", "geGuardHit", "geStorm", "geBump", "geCrystal", "geRebound", "geEcho"]);

export function drawGearsFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.8 ? (1 - f) / 0.2 : 1;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  const four = Math.min(3, Math.floor(f * 4));
  const left = fx.dirX < 0;
  const turn = left ? ang + Math.PI : ang;
  switch (fx.kind) {
    case "geBump":
      // 퉁! 작은 빛 고리 + 불똥
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * (0.4 + f * 0.4), GE.light, 0.8 * (1 - f), 0.6);
        ring(ctx, x, y, fx.size * (0.3 + easeOut(f) * 0.6), fade(GE.white, 0.9 * (1 - f)), 1.5);
        sparks(ctx, x, y, 6, fx.size, f, GE.blue, fx.x + fx.y, 1);
      });
      return true;
    case "geRebound":
    case "geCrystal":
    case "geEcho":
      additive(ctx, () => {
        shock(ctx, x, y, fx.size * easeOut(f), fx.kind === "geCrystal" ? GE.light : GE.blue, 0.7 * (1 - f), 2);
        if (fx.kind === "geCrystal") sparks(ctx, x, y, 10, fx.size, f, GE.white, fx.x, 1);
        glow(ctx, x, y, fx.size * 0.5, GE.blue, 0.4 * (1 - f), 0.3);
      });
      return true;
    case "geGuardHit":
      additive(ctx, () => glow(ctx, x, y, fx.size * 0.6, GE.light, 0.6 * (1 - f), 0.5));
      return true;
    case "geSlam":
    case "geTwin":
    case "geBarrage":
    case "geMirror":
    case "geWave":
      gePic(ctx, ROW[fx.kind], four, x, y, fx.size * (fx.kind === "geWave" ? 4 : 2.6), a, turn, left);
      return true;
    case "geBoom":
      gePic(ctx, ROW.geBoom, 3, x, y, fx.size * 2.6, a);
      return true;
    case "geStorm":
    case "geQuake":
      // 오래 가는 기술: 세 칸이 나온 뒤 마지막 두 칸을 오감
      gePic(ctx, ROW[fx.kind], f < 0.3 ? Math.floor(f * 10) : 2 + (Math.floor(fx.ticks / 4) % 2), x, y - fx.size * 0.15, fx.size * 2.5, a);
      return true;
    default:
      // 보호막 돔 · 육각 방벽: 펼쳐지는 네 칸
      gePic(ctx, ROW[fx.kind as "geDome" | "geHex"], four, x, y - 6, fx.size * 2.2, a);
      return true;
  }
}
