// 버려진 자들 특수기 효과: 그림자 질주 자국 · 베기 X자 · 하늘 찍기 충격 · 밀침 · 총구 불꽃 · 조합 틀림 ✕
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, beam, crescent, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 어둠과 빛: 검은 자국에 흰 테두리 */
function darkLine(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, t: number): void {
  // 겹치면 밝아지는 흰 빛 테두리 → 검은 속
  additive(ctx, () => beam(ctx, x0, y0, x1, y1, w + 3, "#d8d0ff", t * 0.8));
  ctx.lineCap = "round";
  ctx.globalAlpha = t * 0.9;
  ctx.strokeStyle = "#f4f0ff";
  ctx.lineWidth = w + 2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.strokeStyle = "#140c22";
  ctx.lineWidth = w;
  ctx.stroke();
  ctx.lineCap = "butt";
}

export function drawTagShowFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "tagDash": {
      darkLine(ctx, x, y - 3, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y) - 3, fx.size * t + 1, t);
      // 흩날리는 그림자 조각
      ctx.fillStyle = "#2a1a40";
      for (let i = 1; i < 5; i++) {
        const k = i / 5;
        ctx.fillRect(Math.round(x + ((fx.toX ?? x) - x) * k + (i % 2 ? 2 : -2) * (1 - t) * 3), Math.round(y - 3 + ((fx.toY ?? y) - y) * k - (1 - t) * 4), 2, 2);
      }
      break;
    }
    case "tagCut": {
      const r = fx.size * (0.6 + 0.4 * (1 - t));
      const a = fx.dirX ? Math.PI / 6 : 0;
      for (const b of [Math.PI / 4 + a, -Math.PI / 4 + a]) darkLine(ctx, x - Math.cos(b) * r, y - 3 - Math.sin(b) * r, x + Math.cos(b) * r, y - 3 + Math.sin(b) * r, 2, t);
      ctx.globalAlpha = t * 0.6;
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - 1, y - 4, 3, 3);
      break;
    }
    case "tagMeteor": {
      // 충격파 고리 · 갈라진 바닥 · 튀는 돌 (초록빛 충격)
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y + 2);
        ctx.scale(1, 0.55);
        glow(ctx, 0, 0, fx.size, "#4ac86a", t * 0.6, t > 0.8 ? 1.5 : 0.3);
        shock(ctx, 0, 0, fx.size * (1.1 - t * 0.7), "#e8ffe8", t, 7);
        ctx.restore();
      });
      ctx.globalAlpha = t;
      ctx.strokeStyle = "#e8ffe8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x, y + 2, fx.size * (1.1 - t * 0.7), fx.size * (1.1 - t * 0.7) * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#4ac86a";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = "#1a1622";
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y + 2);
        ctx.lineTo(x + Math.cos(a) * fx.size * 0.55, y + 2 + Math.sin(a) * fx.size * 0.3);
        ctx.lineTo(x + Math.cos(a + 0.2) * fx.size * 0.8, y + 2 + Math.sin(a + 0.2) * fx.size * 0.45);
        ctx.stroke();
      }
      ctx.fillStyle = "#c8c0b0";
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const r = fx.size * (1 - t) * 0.8;
        ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.55 - Math.sin((1 - t) * Math.PI) * 10), 2, 2);
      }
      break;
    }
    case "tagShove": {
      // 방패 밀침: 빛나는 초승달 파도 + 튀는 초록 조각
      const a = Math.atan2(fx.dirY, fx.dirX);
      additive(ctx, () => crescent(ctx, x, y - 2, fx.size * (1.2 - t * 0.5), a, 0.9, 6 * t + 1, "#7ae89a", t));
      ctx.globalAlpha = t;
      ctx.fillStyle = "#4ac86a";
      for (let i = -1; i <= 1; i++) ctx.fillRect(Math.round(x + Math.cos(a + i * 0.5) * fx.size * (1.5 - t)), Math.round(y - 2 + Math.sin(a + i * 0.5) * fx.size * (1.5 - t)), 2, 2);
      break;
    }
    case "tagFlash": {
      // 총구 불꽃: 섬광 + 튀는 불똥
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 0.7, "#ffb040", t, 1.5);
        sparks(ctx, x, y, 5, fx.size, 1 - t, "#ffe08a", fx.x + fx.y);
      });
      ctx.globalAlpha = t;
      ctx.fillStyle = "#ffe08a";
      const l = fx.size * (0.5 + t * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + fx.dirY * 2, y - fx.dirX * 2);
      ctx.lineTo(x + fx.dirX * l, y + fx.dirY * l);
      ctx.lineTo(x - fx.dirY * 2, y + fx.dirX * 2);
      ctx.fill();
      ctx.fillStyle = "#e8484a";
      ctx.fillRect(x - 1, y - 1, 3, 3);
      break;
    }
    case "tagMiss": {
      // 머리 위 빨간 ✕ (흔들리며 사라짐)
      const shake = t > 0.7 ? Math.round(Math.sin(fx.ticks * 2) * 2) : 0;
      ctx.globalAlpha = Math.min(1, t * 2);
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1a1622";
      ctx.strokeText("✕", x + shake, y - 30);
      ctx.fillStyle = "#ff5a5a";
      ctx.fillText("✕", x + shake, y - 30);
      ctx.textAlign = "left";
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
