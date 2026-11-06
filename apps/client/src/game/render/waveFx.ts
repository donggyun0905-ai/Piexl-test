// 웨이브 순간 효과 — 시원하게 뻥 뚫리는 물 (하늘색 물빛 · 흰 거품 · 맑은 반짝임, 기술마다 다른 터짐)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bubs, drops } from "./orcaPal";
import { burst, ripple, waterColumn } from "./waveKit";
import { glints, rays } from "./seaLight";
import { butterfly, crestWave, note, tentacle, waterHand, WV } from "./waveArt";
import { petal } from "./waveBits";

const TAU = Math.PI * 2;
/** 바닥 물결 고리 (예전 회색 충격파 대신, 원근 타원 · 흰 물마루) */
const ring = (ctx: Ctx, x: number, y: number, r: number, a: number, w = 3, c = WV.aqua) => ripple(ctx, x, y, r, a, Math.max(1, w * 0.45), c);

export function drawWaveFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("wv")) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const k = easeOut(Math.min(1, f / 0.6));
  const seed = fx.x * 7 + fx.y * 3;
  const a = Math.atan2(fx.dirY, fx.dirX);
  switch (fx.kind) {
    case "wvCrest":
    case "wvSplash":
      // 물보라 왕관 + 퍼지는 물결
      burst(ctx, x, y + 2, r * 0.9, f, seed, 9);
      drops(ctx, x, y, r * 0.8, f, seed, 10);
      ring(ctx, x, y, r * (0.4 + k * 0.8), fade * 0.8, 3);
      break;
    case "wvCast":
      // 상상이 물이 되는 순간: 몸 둘레로 물방울이 모였다 터짐
      additive(ctx, () => {
        for (let i = 0; i < 10; i++) {
          const t = (i / 10) * TAU + f * 2;
          const rr = 22 * (1 - Math.min(1, f * 2.5));
          ctx.fillStyle = alpha(i % 2 ? WV.foam : WV.aqua, Math.min(1, (1 - f) * 2));
          ctx.fillRect(x + Math.cos(t) * rr, y - 6 + Math.sin(t) * rr * 0.8, 2, 2);
        }
      });
      if (f > 0.35) ripple(ctx, x, y + 4, 6 + (f - 0.35) * 30, (1 - f) * 1.4, 1, WV.sky);
      if (f > 0.35 && f < 0.7) glints(ctx, x, y - 8, 14, 4, Math.round(f * 30), seed, WV.foam, 1);
      break;
    case "wvFlyPop":
      butterfly(ctx, x, y - f * 8, a, f * 3, 4.5 * (1 + f), 1 - f);
      drops(ctx, x, y, r, f, seed, 8);
      bubs(ctx, x, y, r, f, seed, 5);
      break;
    case "wvPierce":
      additive(ctx, () => {
        ctx.strokeStyle = alpha(WV.foam, fade);
        ctx.lineWidth = 3 * (1 - f) + 1;
        ctx.beginPath();
        ctx.moveTo(x - fx.dirX * r, y - fx.dirY * r);
        ctx.lineTo(x + fx.dirX * r * 1.6, y + fx.dirY * r * 1.6);
        ctx.stroke();
        glow(ctx, x, y, r, WV.aqua, fade, 1);
      });
      drops(ctx, x, y, r, f, seed, 8);
      break;
    case "wvArmorPop":
      // 물 껍질이 사방으로 깨져 터짐
      ring(ctx, x, y - 6, r * k, fade, 8, WV.aqua);
      ring(ctx, x, y - 6, r * k * 0.7, fade * 0.7, 4, WV.foam);
      additive(ctx, () => sparks(ctx, x, y - 6, 14, r, f, WV.foam, seed, fade));
      drops(ctx, x, y - 6, r * 0.9, f, seed, 16);
      break;
    case "wvPour": {
      // 여신의 물병 → 적 무리 위로 쏟아지는 물줄기 + 물기둥
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      // 보석에서 뻗는 물빛 줄기 (굵은 빛 → 가늘어짐)
      if (f < 0.45)
        additive(ctx, () => {
          ctx.lineCap = "round";
          for (const [c, w] of [[alpha(WV.aqua, 0.35 * (1 - f / 0.45)), 7], [alpha(WV.sky, 0.8 * (1 - f / 0.45)), 3], [alpha(WV.foam, 1 - f / 0.45), 1.2]] as const) {
            ctx.strokeStyle = c;
            ctx.lineWidth = w;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo((x + tx) / 2, Math.min(y, ty) - 24, tx, ty - 4);
            ctx.stroke();
          }
          ctx.lineCap = "butt";
          glow(ctx, x, y, 10, WV.foam, 1 - f / 0.45, 1);
        });
      waterColumn(ctx, tx, ty + 4, r * 0.6, 40 * Math.sin(Math.min(1, f * 1.4) * Math.PI), fade, fx.ticks);
      burst(ctx, tx, ty + 3, r, f, seed, 11);
      break;
    }
    case "wvBreach":
      // 꿈의 고래가 솟구침: 거대한 물기둥 + 고래 실루엣이 하늘로 + 물보라 왕관
      waterColumn(ctx, x, y + 4, r * 0.8, 80 * Math.sin(Math.min(1, f * 1.3) * Math.PI), fade, fx.ticks);
      burst(ctx, x, y + 3, r * 1.1, f, seed, 14);
      ring(ctx, x, y + 2, r * (0.5 + k), fade, 6);
      if (f < 0.3) additive(ctx, () => rays(ctx, x, y - 10, r, 10, 1 - f / 0.3, seed, WV.foam));
      break;
    case "wvBubblePop":
      additive(ctx, () => {
        ctx.strokeStyle = alpha(WV.foam, fade);
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 10; i++) {
          const t = (i / 10) * TAU + seed;
          const d = r * (0.6 + k * 0.8);
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(t) * d * 0.7, y + Math.sin(t) * d * 0.7);
          ctx.lineTo(x + Math.cos(t) * d, y + Math.sin(t) * d);
          ctx.stroke();
        }
      });
      bubs(ctx, x, y, r, f, seed, 9);
      drops(ctx, x, y, r, f, seed, 10);
      break;
    case "wvZap":
      additive(ctx, () => glow(ctx, x, y, r, WV.gold, 0.35 * (1 - f)));
      break;
    case "wvBloom":
      for (let i = 0; i < 8; i++) petal(ctx, x, y, (i / 8) * TAU + f, 6 + k * r, 1 - f);
      ring(ctx, x, y, r * k * 1.3, fade, 5, WV.pink);
      additive(ctx, () => glow(ctx, x, y, r, WV.gold, fade, 1));
      break;
    case "wvSurfEnd":
      crestWave(ctx, x + fx.dirX * 10 * k, y + fx.dirY * 10 * k, a, r * 0.6 * (1 + k), fade, fx.ticks);
      burst(ctx, x, y + 2, r, f, seed, 13);
      ring(ctx, x, y, r * k, fade, 6);
      break;
    case "wvFloodWave":
      // 방 전체로 퍼지는 물결 고리 셋
      for (let i = 0; i < 2; i++) ring(ctx, x, y + 4, 40 * (k + i * 0.4), fade * 0.5 * (1 - i * 0.4), 3, i ? WV.pale : WV.aqua);
      break;
    case "wvRopeCrash":
      waterColumn(ctx, x, y + 3, r * 0.7, 46 * Math.sin(Math.min(1, f * 1.4) * Math.PI), fade, fx.ticks);
      ring(ctx, x, y, r * (0.5 + k * 1.2), fade, 6);
      additive(ctx, () => sparks(ctx, x, y, 12, r * 1.4, f, WV.foam, seed, fade));
      break;
    case "wvBalloonPop":
      burst(ctx, x, y + 2, r, f, seed, 16);
      drops(ctx, x, y, r * 1.1, f, seed, 18);
      ring(ctx, x, y, r * (0.3 + k), fade, 7);
      break;
    case "wvPearlBounce":
      additive(ctx, () => {
        glow(ctx, x, y, r, WV.pink, fade, 1);
        sparks(ctx, x, y, 8, r * 1.2, f, "#ffffff", seed, fade);
      });
      break;
    case "wvClap": {
      // 손뼉: 두 손이 맞붙는 순간 + 납작한 충격파
      if (f < 0.4) for (const side of [-1, 1]) waterHand(ctx, x - side * 6, y + 6, side, 1.05, 1 - f / 0.4, fx.ticks);
      ripple(ctx, x, y + 4, r * (0.5 + k * 1.6), fade, 2, WV.aqua, 0.35);
      drops(ctx, x, y - 8, r, f, seed, 16);
      if (f < 0.25) additive(ctx, () => rays(ctx, x, y - 8, r * 1.2, 8, 1 - f / 0.25, seed, WV.foam));
      break;
    }
    case "wvLob":
      burst(ctx, x, y + 2, r, f, seed, 8);
      ring(ctx, x, y, r * k, fade * 0.8, 3);
      break;
    case "wvSkipRing":
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.6);
      for (let i = 0; i < 3; i++) ring(ctx, 0, 0, r * Math.max(0, k - i * 0.2), fade, 3, i ? WV.pale : WV.foam);
      ctx.restore();
      drops(ctx, x, y, r * 0.5, f, seed, 6);
      break;
    case "wvNote":
      note(ctx, x + Math.sin(f * 8) * 3, y - f * 14, 1.1, 1 - f);
      additive(ctx, () => {
        ctx.fillStyle = alpha(WV.pink, 1 - f);
        ctx.font = "bold 7px sans-serif";
        ctx.fillText("z", x + 6, y - 4 - f * 10);
        ctx.fillText("z", x + 9, y - 9 - f * 12);
      });
      break;
    case "wvErase":
      bubs(ctx, x, y, 5, f, seed, 3);
      additive(ctx, () => glow(ctx, x, y, 6, WV.pale, 1 - f));
      break;
    case "wvSlam": {
      // 문어 다리가 바깥으로 내리침 (뻗음 → 바닥을 침 → 물보라)
      const tx = snap(fx.toX ?? x);
      const ty = snap(fx.toY ?? y);
      const reach = Math.min(1, f / 0.35);
      tentacle(ctx, x, y, x + (tx - x) * reach, y + (ty - y) * reach, 14, fade, (1 - reach) * 24);
      if (f > 0.3) {
        burst(ctx, tx, ty, 16, (f - 0.3) / 0.7, seed, 8);
        ring(ctx, tx, ty, 18 * (f - 0.3) * 1.4, fade, 4);
      }
      break;
    }
    case "wvFeather":
      for (let i = 0; i < 6; i++) {
        const t = a + (i - 2.5) * 0.5;
        additive(ctx, () => glow(ctx, x + Math.cos(t) * r * k, y + Math.sin(t) * r * k, 3, WV.foam, 1 - f, 1));
      }
      break;
    case "wvCrush":
      // 수압: 안쪽으로 빨려 들었다가 위로 터지는 물기둥
      ring(ctx, x, y, r * (1.4 - k), fade, 8, WV.deep);
      waterColumn(ctx, x, y + 4, r * 0.6, 70 * Math.sin(Math.min(1, Math.max(0, f - 0.15) * 1.6) * Math.PI), fade, fx.ticks);
      if (f > 0.15) burst(ctx, x, y + 3, r, (f - 0.15) / 0.85, seed, 14);
      break;
    case "wvRing":
      ring(ctx, x, y, fx.dirX > 0 ? r * 0.3 : r, 0.5 * (1 - f), 4, WV.foam);
      break;
    case "wvSpike":
      // 발자국에서 솟는 물가시 (뾰족한 물 셋)
      additive(ctx, () => {
        const h = 22 * Math.sin(Math.min(1, f * 1.5) * Math.PI);
        for (const [ox, hh] of [[-4, 0.7], [0, 1], [4, 0.6]] as const) {
          const g = ctx.createLinearGradient(x, y, x, y - h * hh);
          g.addColorStop(0, alpha(WV.deep, 0.8 * fade));
          g.addColorStop(1, alpha(WV.foam, fade));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(x + ox - 2.5, y);
          ctx.lineTo(x + ox, y - h * hh);
          ctx.lineTo(x + ox + 2.5, y);
          ctx.fill();
        }
      });
      drops(ctx, x, y - 10, r * 0.8, f, seed, 6);
      break;
    case "wvTsunamiHit":
      drops(ctx, x, y, r, f, seed, 10);
      additive(ctx, () => glow(ctx, x, y, r, WV.foam, fade * 0.8, 1));
      break;
    default:
      break;
  }
  return true;
}
