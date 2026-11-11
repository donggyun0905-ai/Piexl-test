// 빙설 효과: 베기(얼음 초승달, 무기마다 넓이) · 찌르기(얼음 창) · 몸 둘레 원 · 눈덩이·유도 얼음 터짐 · 빙각(솟는 얼음) · 얼음가루 모임
// 궁극기 한 번 때림 · 활 세움 · 영역강화 결정 피해 · 적 탄 막음
import { BS_STYLE, BINGSEOL_WEAPONS, type EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, alpha, crescent, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import { BS, bsGlowPic } from "./bingseolArt";

const KINDS = new Set(["bsSlash", "bsThrust", "bsSpin", "bsBurst", "bsSpike", "bsGather", "bsUltHit", "bsBowSet", "bsWallHit", "bsBlock"]);
const ARC = Object.keys(BINGSEOL_WEAPONS).map((id) => BS_STYLE[id as keyof typeof BS_STYLE].arc);

export function drawBingseolFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.6 ? (1 - f) / 0.4 : 1;
  const ang = Math.atan2(fx.dirY, fx.dirX);
  switch (fx.kind) {
    case "bsSlash": {
      // 얼음 초승달: 무기 부채꼴 넓이만큼 휘어 지나감 (넓은 낫은 크게 돌아감)
      const half = Math.acos(Math.max(-0.95, Math.min(0.95, ARC[fx.style ?? 0] ?? 0.25)));
      const turn = (easeOut(f) - 0.5) * half * 0.6;
      additive(ctx, () => crescent(ctx, x, y, fx.size * (0.75 + f * 0.25), ang + turn, half, Math.max(4, fx.size * 0.35), BS.ice, 0.85 * a));
      sparks(ctx, x + fx.dirX * fx.size * 0.7, y + fx.dirY * fx.size * 0.7, 6, fx.size * 0.5, f, BS.pale, fx.ticks, a);
      return true;
    }
    case "bsThrust": {
      const d = fx.size * (0.3 + easeOut(f) * 0.45);
      bsGlowPic(ctx, 0, 3, x + fx.dirX * d, y + fx.dirY * d, fx.size * 1.1, a, ang);
      return true;
    }
    case "bsSpin":
      additive(ctx, () => {
        crescent(ctx, x, y, fx.size, f * Math.PI * 3, Math.PI * 0.8, Math.max(4, fx.size * 0.3), BS.ice, 0.8 * a);
        crescent(ctx, x, y, fx.size, f * Math.PI * 3 + Math.PI, Math.PI * 0.8, Math.max(4, fx.size * 0.3), BS.ice, 0.8 * a);
      });
      return true;
    case "bsBurst":
    case "bsWallHit":
      additive(ctx, () => glow(ctx, x, y, fx.size, BS.ice, 0.75 * a, 0.4));
      shock(ctx, x, y, fx.size * easeOut(f), BS.pale, a, 3);
      sparks(ctx, x, y, 10, fx.size * 1.2, f, BS.white, fx.ticks, a);
      return true;
    case "bsSpike": {
      // 얼음 빙각: 바닥에서 솟아 잠시 서 있다 녹음
      const up = Math.min(1, f * 5);
      ring(ctx, x, y + 2, fx.size, alpha(BS.ice, 0.5 * a), 1);
      bsGlowPic(ctx, 1, 3, x, y - fx.size * 0.4 * up, fx.size * 2.6 * (0.6 + 0.4 * up), a);
      return true;
    }
    case "bsGather": {
      const k = easeOut(f);
      const sx = x + ((fx.toX ?? fx.x) - fx.x) * k;
      const sy = y + ((fx.toY ?? fx.y) - fx.y) * k;
      additive(ctx, () => glow(ctx, sx, sy, 4, BS.pale, 0.9, 0.6));
      return true;
    }
    case "bsUltHit":
      additive(ctx, () => glow(ctx, x, y, fx.size + 6, BS.white, 0.8 * (1 - f), 0.6));
      sparks(ctx, x, y, 6, fx.size + 14, f, BS.ice, fx.style ?? 0, 1 - f);
      return true;
    case "bsBowSet":
      additive(ctx, () => glow(ctx, x, y, 24, BS.ice, 0.7 * (1 - f), 0.4));
      ring(ctx, x, y, 8 + easeOut(f) * 20, alpha(BS.pale, 0.8 * (1 - f)), 1.5);
      return true;
    case "bsBlock":
      sparks(ctx, x, y, 8, 10, f, BS.white, fx.ticks, 1 - f);
      return true;
  }
  return false;
}
