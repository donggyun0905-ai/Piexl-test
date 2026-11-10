// 래빗 효과: 내리찍기(망치 머리가 떨어지고 땅울림이 1→3칸으로 커짐 · 홈런은 분홍 큰 휘두르기 · 유령 망치) · 토끼인장 터짐
// 맵 밖으로 날아감(적 그림이 빙글빙글 하늘로 → 반짝) · 방울 · 별사탕 · 여진 · 초거대 망치(슈퍼 럭키) · 초거대 망치 한 번 맞음
import type { EffectState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";
import type { Snap } from "./palette";
import { additive, alpha, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";
import { drawRabbitUlt, quakeRing, RB, rbPic } from "./rabbitArt";

const KINDS = new Set(["rbSlam", "rbBunny", "rbFly", "rbBell", "rbStar", "rbAfter", "rbUltHit", "rbUlt"]);

/** 반짝 별 (네 갈래) */
function twinkle(ctx: Ctx, x: number, y: number, r: number, col: string, a: number): void {
  ctx.strokeStyle = alpha(col, a);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.lineTo(x + r, y);
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y + r);
  ctx.stroke();
  additive(ctx, () => glow(ctx, x, y, r * 0.8, "#ffffff", a));
}

export function drawRabbitFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = f > 0.6 ? (1 - f) / 0.4 : 1;
  switch (fx.kind) {
    case "rbSlam": {
      const r = fx.size;
      const homer = fx.style === 1;
      // 망치 머리가 위에서 쾅 (처음 4틱) · 유령 망치는 반투명
      if (f < 0.25 && fx.style !== 2) {
        const k = f / 0.25;
        rbPic(ctx, 2, homer ? 3 : 0, x - fx.dirX * 4, y - (1 - k) * 18 - 4, r * (homer ? 1.6 : 1.3), fx.style === 3 ? 0.55 : 1, (fx.dirX < 0 ? 1 : -1) * (1 - k) * 0.9);
      }
      if (homer) {
        additive(ctx, () => glow(ctx, x, y, r * 1.2, RB.pink, 0.7 * a, 0.4));
        sparks(ctx, x, y, 14, r * 1.5, f, RB.pink, 7, a);
      }
      quakeRing(ctx, Math.floor(f * 4), x, y, r, a);
      if (f < 0.3) additive(ctx, () => glow(ctx, x, y, r * 0.7, RB.green, (0.3 - f) * 2.5));
      return true;
    }
    case "rbBunny": {
      additive(ctx, () => glow(ctx, x, y, fx.size * (0.6 + easeOut(f) * 0.6), RB.green, 0.8 * a, 0.3));
      shock(ctx, x, y, fx.size * easeOut(f), RB.green, a, 8);
      rbPic(ctx, 1, 3, x, y - 8 - f * 10, 30 * (1 + f * 0.6), a);
      sparks(ctx, x, y, 10, fx.size * 1.2, f, RB.gold, 3, a);
      return true;
    }
    case "rbAfter": {
      additive(ctx, () => glow(ctx, x, y, fx.size, RB.green, 0.8 * a, 0.4));
      quakeRing(ctx, 3, x, y, fx.size * (0.5 + easeOut(f) * 0.6), a);
      sparks(ctx, x, y, 12, fx.size * 1.3, f, RB.green, 11, a);
      return true;
    }
    case "rbBell": {
      ring(ctx, x, y, fx.size * easeOut(f), alpha(RB.gold, 0.8 * a), 2);
      ring(ctx, x, y, fx.size * easeOut(f) * 0.7, alpha(RB.green, 0.6 * a), 1);
      for (let i = 0; i < 3; i++) twinkle(ctx, x + (i - 1) * 10, y - 14 - f * 16 - (i % 2) * 4, 3, RB.gold, a);
      return true;
    }
    case "rbStar": {
      const k = easeOut(f);
      const sx = x + ((fx.toX ?? fx.x) - fx.x) * k;
      const sy = y + ((fx.toY ?? fx.y) - fx.y) * k - Math.sin(k * Math.PI) * 14;
      twinkle(ctx, sx, sy, 4, RB.gold, 1 - f * 0.5);
      return true;
    }
    case "rbFly": {
      // 홈런으로 맵 밖으로: 빙글빙글 돌며 하늘로 날아가 작아지다 반짝
      const k = easeOut(f);
      const dir = fx.dirX >= 0 ? 1 : -1;
      const fxX = x + dir * k * 260 + fx.dirX * 20;
      const fxY = y - Math.sin(Math.min(1, f * 1.2) * Math.PI * 0.5) * 150;
      if (f < 0.82) {
        ctx.save();
        ctx.translate(fxX, fxY);
        ctx.rotate(f * 18 * dir);
        if (!drawEnemySprite(ctx, (fx.from ?? "crawler") as never, 0, 0, 0, dir < 0, undefined, 1 - f * 0.8)) {
          ctx.fillStyle = RB.pink;
          ctx.fillRect(-fx.size, -fx.size, fx.size * 2, fx.size * 2);
        }
        ctx.restore();
        ctx.strokeStyle = alpha("#ffffff", 0.5 * (1 - f));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo((x + fxX) / 2, fxY, fxX, fxY);
        ctx.stroke();
      } else twinkle(ctx, fxX, fxY, 3 + (1 - f) * 30, RB.gold, (1 - f) * 5);
      return true;
    }
    case "rbUltHit": {
      const s = fx.size + 4;
      additive(ctx, () => glow(ctx, x, y, s * 1.4, RB.green, 0.9 * (1 - f), 0.5));
      twinkle(ctx, x + (((fx.style ?? 0) * 7) % 9) - 4, y + (((fx.style ?? 0) * 5) % 7) - 3, s * (1 - f), "#ffffff", 1 - f);
      return true;
    }
    case "rbUlt":
      drawRabbitUlt(ctx, fx.maxTicks - fx.ticks, snap);
      return true;
  }
  return false;
}
