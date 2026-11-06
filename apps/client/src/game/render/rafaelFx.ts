// 라파엘 기술 효과 — 폭풍의 사수 (하늘색 에테르 · 흰 빛 · 금 · 폭풍 회청)
// 화살(빛 꼬리를 끄는 가는 화살) · 저격(굵은 빛줄기 + 고리) · 돌풍 · 폭풍 화살비(예고 고리 · 하늘에서 쏟아지는 화살) · 스코프 · 천공의 빛 화살(방을 가로지르는 거대한 빛의 화살) · 끝 폭발 · 표적 맞힘
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

/** 라파엘 색: 하늘 · 에테르 · 밝은 빛 · 흰 빛 · 금 · 폭풍 · 붉은 과녁 */
export const RF = { sky: "#b0e8ff", ether: "#6ac8ff", light: "#fff6c0", white: "#ffffff", gold: "#f2c14e", storm: "#6a88b8", red: "#ff5a6a" } as const;
const RF_FX = new Set(["rfArrowFx", "rfGustFx", "rfStormFx", "rfScopeFx", "rfChargeFx", "rfHeavenFx", "rfBlastFx", "rfMarkFx"]);

/** 화살 머리: 끝 (x,y) · 방향 a · 크기 */
function head(ctx: Ctx, x: number, y: number, a: number, size: number, c: string, al: number): void {
  const cs = Math.cos(a);
  const sn = Math.sin(a);
  ctx.fillStyle = alpha(c, al);
  ctx.beginPath();
  ctx.moveTo(x + cs * size, y + sn * size);
  ctx.lineTo(x - cs * size * 0.6 - sn * size * 0.6, y - sn * size * 0.6 + cs * size * 0.6);
  ctx.lineTo(x - cs * size * 0.6 + sn * size * 0.6, y - sn * size * 0.6 - cs * size * 0.6);
  ctx.closePath();
  ctx.fill();
}

/** 빛줄기: (x,y)→(tx,ty) 굵기 w · 바깥 색 c */
function streak(ctx: Ctx, x: number, y: number, tx: number, ty: number, w: number, c: string, al: number): void {
  ctx.lineCap = "round";
  for (const [k, col, a] of [[2.2, c, 0.25], [1, c, 0.6], [0.4, RF.white, 0.95]] as const) {
    ctx.strokeStyle = alpha(col, a * al);
    ctx.lineWidth = Math.max(1, w * k);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
}

export function drawRafaelFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!RF_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  switch (fx.kind) {
    case "rfArrowFx": {
      // 화살: 빠르게 날아가는 화살 머리와 뒤로 남는 빛 꼬리 · 저격(style 1)은 굵은 빛줄기 + 시위 고리 + 끝 섬광
      const snipe = fx.style === 1;
      const fly = easeOut(Math.min(1, f * (snipe ? 4 : 3)));
      const hx = x + (tx - x) * fly;
      const hy = y + (ty - y) * fly;
      const tail = Math.max(0, fly - (snipe ? 1 : 0.35));
      additive(ctx, () => {
        streak(ctx, x + (tx - x) * tail, y + (ty - y) * tail, hx, hy, snipe ? 5 : 2, snipe ? RF.ether : RF.sky, fade);
        if (snipe) {
          shock(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 5, 8 + f * 10, RF.sky, fade, 2);
          if (fly >= 1) glow(ctx, tx, ty, 10 * (1 - f) + 4, RF.light, fade, 0.6);
        }
      });
      if (fly < 1 || !snipe) head(ctx, hx, hy, a, snipe ? 6 : 4, RF.white, fade);
      return true;
    }
    case "rfGustFx": {
      // 돌풍: 떠난 자리에서 휘몰아치는 바람 고리 세 겹 · 흩날리는 깃털빛
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) shock(ctx, x, y, r * easeOut(Math.min(1, f + i * 0.15)), i % 2 ? RF.white : RF.sky, fade * 0.8, 2);
        sparks(ctx, x, y - 6, 10, r * 1.3, f, RF.sky, seed, fade);
      });
      return true;
    }
    case "rfStormFx": {
      // 화살비: 예고(style 0) 좁혀 드는 과녁 · 떨어짐(style 1) 하늘에서 쏟아지는 화살 줄기와 땅의 튐
      if (fx.style === 0) {
        additive(ctx, () => rune(ctx, x, y, r * (1.2 - 0.4 * f), RF.sky, 0.6 + 0.4 * f, f * 2));
        return true;
      }
      additive(ctx, () => {
        for (let i = 0; i < 9; i++) {
          const ox = ((seed * (i + 3)) % 100) / 100 - 0.5;
          const oy = ((seed * (i + 7)) % 100) / 100 - 0.5;
          const gx = x + ox * r * 1.6;
          const gy = y + oy * r * 0.9;
          const drop = easeOut(Math.min(1, f * 3));
          streak(ctx, gx + 10, gy - 70 + drop * 50, gx + 10 * (1 - drop) * 0.3, gy - 70 * (1 - drop), 1.5, RF.sky, fade);
          if (drop >= 1) glow(ctx, gx, gy, 3, RF.white, fade * 0.8);
        }
        shock(ctx, x, y, r * (0.6 + 0.4 * f), RF.storm, fade * 0.6, 2);
      });
      return true;
    }
    case "rfScopeFx": {
      // 에테르 스코프: 눈앞에서 겹쳐지는 푸른 렌즈 고리
      additive(ctx, () => {
        shock(ctx, x + fx.dirX * 8, y - 12, r * (1 - f) + 4, RF.ether, fade, 2);
        rune(ctx, x, y, 30 * easeOut(f), RF.ether, fade * 0.6, f * 3);
      });
      return true;
    }
    case "rfChargeFx": {
      // 모으기: 발밑 문양이 천천히 조여 듦 (활끝 빛은 몸 그림 rafaelBody)
      additive(ctx, () => rune(ctx, x, y, r * (1.4 - 0.6 * f), RF.light, 0.4 + 0.5 * f, f * 4));
      return true;
    }
    case "rfHeavenFx": {
      // 천공의 빛 화살: 방을 가로지르는 거대한 빛줄기 · 앞에 커다란 빛의 화살 머리 · 둘레를 감는 바람 고리 · 쏜 자리 섬광
      const fly = easeOut(Math.min(1, f * 3));
      const hx = x + (tx - x) * fly;
      const hy = y - 8 + (ty - y) * fly;
      additive(ctx, () => {
        streak(ctx, x, y - 8, hx, hy, r * 0.6 * (1 - f * 0.7), RF.gold, fade * 0.8);
        streak(ctx, x, y - 8, hx, hy, r * 0.3 * (1 - f * 0.5), RF.sky, fade * 0.8);
        for (let i = 1; i < 7; i++) {
          const u = (i / 7) * fly;
          const cx = x + (tx - x) * u;
          const cy = y - 8 + (ty - y) * u;
          ctx.strokeStyle = alpha(RF.white, 0.6 * fade);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r * 0.4, r * 1.1, a, 0, Math.PI * 2);
          ctx.stroke();
        }
        glow(ctx, x, y - 8, r * 1.4 * (1 - f) + 6, RF.light, fade, 1 - f);
        sparks(ctx, hx, hy, 12, r * 2, f, RF.light, seed, fade);
      });
      if (fly < 1) head(ctx, hx, hy, a, r * 1.2, RF.light, fade * 0.85);
      return true;
    }
    case "rfBlastFx": {
      // 끝 폭발: 하늘색·금빛 고리 두 겹 · 빛 기둥 · 튀는 빛
      const k = easeOut(f);
      additive(ctx, () => {
        glow(ctx, x, y - 6, r * 0.7 * (1 - f) + 8, RF.light, fade, 0.7 * (1 - f));
        shock(ctx, x, y, r * k, RF.sky, fade, 4);
        shock(ctx, x, y, r * 0.6 * k, RF.gold, fade * 0.8, 3);
        ctx.fillStyle = alpha(RF.white, 0.6 * fade * (1 - f));
        ctx.fillRect(x - 3, y - 80 * (1 - f), 6, 80 * (1 - f));
        sparks(ctx, x, y - 6, 18, r * 1.3, f, RF.sky, seed, fade);
      });
      return true;
    }
    case "rfMarkFx": {
      // 표적 맞힘: 붉은 조준 고리가 조여 들며 번쩍
      additive(ctx, () => shock(ctx, x, y - 4, r * (1.6 - f), RF.red, fade, 2));
      return true;
    }
  }
  return false;
}
