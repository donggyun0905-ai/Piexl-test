// 학살자 공격 효과: 핏빛 초승달 베기 · 더욱 강하게 · 내려찍기 · 회오리 · 땅 뒤집기 · 일직선 · X자 · 피의 검기 폭발 · 끌어당기기 · 강하 · 급습 자국 · 피의 학살 시작
import type { EffectState } from "@pixel-rogue/shared";
import { BLOOD, DEEP, EDGE } from "./slayer";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 흩뿌리는 핏방울·꽃잎 (n개, 퍼짐 r) */
function splatter(ctx: Ctx, x: number, y: number, r: number, t: number, n: number, seed: number): void {
  for (let i = 0; i < n; i++) {
    const a = seed + i * 2.399;
    const d = r * (0.4 + ((i * 37) % 10) / 16) * t;
    ctx.fillStyle = i % 4 === 0 ? EDGE : i % 4 === 1 ? DEEP : BLOOD;
    ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d + t * t * 6), i % 3 ? 2 : 1, i % 2 ? 2 : 1);
  }
}

/** 초승달 베기 자국: 바깥 검붉음 → 핏빛 → 분홍빛 날 끝 (side: 휘두른 쪽, k: 진행 0~1) */
function crescent(ctx: Ctx, x: number, y: number, r: number, a0: number, side: number, k: number, thick: number): void {
  const span = 1.5;
  const from = a0 - side * span;
  const to = from + side * span * 2 * Math.min(1, k * 2.4);
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  for (const [w, c, f] of [[thick + 3, DEEP, 0.8], [thick, BLOOD, 0.86], [Math.max(1, thick / 3), EDGE, 0.93], [1, "#ffffff", 0.97]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, r * f, lo, hi);
    ctx.stroke();
  }
}

export function drawSlayerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const age = fx.maxTicks - fx.ticks;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a0 = Math.atan2(fx.dirY, fx.dirX);
  const fade = 1 - Math.max(0, t - 0.45) / 0.55;
  switch (fx.kind) {
    case "slSlash": {
      // 늦게 나오는 베기 (3연속): width 틱 뒤부터
      const d = fx.width ?? 0;
      if (age < d) return true;
      const k = (age - d) / Math.max(1, fx.maxTicks - d);
      ctx.globalAlpha = 1 - Math.max(0, k - 0.45) / 0.55;
      crescent(ctx, x, y, fx.size, a0, fx.toX ? 1 : -1, k, 4);
      splatter(ctx, x + fx.dirX * fx.size * 0.8, y + fx.dirY * fx.size * 0.8, fx.size * 0.5, k, 8, a0);
      break;
    }
    case "slGrand":
      // 더욱 강하게: 두 겹의 거대한 초승달 + 충격 고리 + 꽃잎
      ctx.globalAlpha = fade;
      crescent(ctx, x, y, fx.size, a0, fx.toX ? 1 : -1, t, 7);
      crescent(ctx, x, y, fx.size * 0.7, a0, fx.toX ? -1 : 1, t, 3);
      ctx.strokeStyle = BLOOD;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (0.3 + t), a0 - 1.6, a0 + 1.6);
      ctx.stroke();
      splatter(ctx, x + fx.dirX * fx.size, y + fx.dirY * fx.size, fx.size * 0.7, t, 16, a0);
      break;
    case "slChop":
      // 내려찍기: 핏빛 세로 날 + 갈라진 땅 + 피 튐
      ctx.globalAlpha = fade;
      ctx.fillStyle = DEEP;
      ctx.fillRect(x - 3, y - fx.size * 1.4 * (1 - t), 6, fx.size * 1.4 * (1 - t));
      ctx.fillStyle = BLOOD;
      ctx.fillRect(x - 1, y - fx.size * 1.4 * (1 - t), 3, fx.size * 1.4 * (1 - t));
      ctx.strokeStyle = "#3a0a10";
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * fx.size * (0.5 + t * 0.6), y + Math.sin(a) * fx.size * (0.3 + t * 0.4));
        ctx.stroke();
      }
      splatter(ctx, x, y - 4, fx.size, t, 10, 1);
      break;
    case "slSpin":
      // 회오리: 한 바퀴 도는 두꺼운 핏빛 고리
      ctx.globalAlpha = fade;
      for (const [w, c, f] of [[7, DEEP, 0.85], [4, BLOOD, 0.88], [1, EDGE, 0.94]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, fx.size * f, t * 9, t * 9 + Math.PI * 2 * Math.min(1, t * 2));
        ctx.stroke();
      }
      splatter(ctx, x, y, fx.size * 1.1, t, 12, t * 9);
      break;
    case "slBurst": {
      // 땅 뒤집기: 앞으로 줄지어 솟는 핏빛 바위
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      for (let i = 1; i <= 10; i++) {
        const k = i / 10;
        if (k > t * 1.8) break;
        const h = Math.max(0, 1 - Math.abs(t * 1.8 - k) * 1.5) * 10 + 2;
        const px = Math.round(x + (tx - x) * k);
        const py = Math.round(y + (ty - y) * k);
        ctx.globalAlpha = 1 - t * 0.7;
        ctx.fillStyle = "#3a1414";
        ctx.fillRect(px - 4, py - h, 8, h);
        ctx.fillStyle = BLOOD;
        ctx.fillRect(px - 3, py - h, 6, 2);
        ctx.fillStyle = EDGE;
        ctx.fillRect(px - 1, py - h, 2, 1);
      }
      break;
    }
    case "slLine": {
      // 일직선 베기: 방을 가르는 붉은 선이 번쩍 + 갈라진 자리에서 피가 솟음
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      ctx.globalAlpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
      for (const [w, c] of [[fx.size * (1.2 - t), DEEP], [fx.size * 0.6 * (1 - t), BLOOD], [2, "#ffffff"]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = Math.max(1, w);
        ctx.beginPath();
        ctx.moveTo(fx.x, fx.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      for (let i = 1; i < 12; i++) splatter(ctx, fx.x + (tx - fx.x) * (i / 12), fx.y + (ty - fx.y) * (i / 12), 8, t, 2, i);
      break;
    }
    case "slX":
      // X자: 두 줄이 차례로 그어지고 가운데서 피가 터짐
      ctx.globalAlpha = fade;
      for (const [i, sx] of [[0, 1], [1, -1]] as const) {
        const k = Math.min(1, t * 4 - i);
        if (k <= 0) continue;
        for (const [w, c] of [[6, DEEP], [3, BLOOD], [1, "#ffffff"]] as const) {
          ctx.strokeStyle = c;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(x - fx.size * sx, y - fx.size);
          ctx.lineTo(x - fx.size * sx + 2 * fx.size * sx * k, y - fx.size + 2 * fx.size * k);
          ctx.stroke();
        }
      }
      if (t > 0.4) splatter(ctx, x, y, fx.size * 1.2, (t - 0.4) / 0.6, 14, 0.5);
      break;
    case "slNova":
      // 피의 검기 폭발: 여덟 줄기 핏빛 빛살 + 고리
      ctx.globalAlpha = fade;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.strokeStyle = i % 2 ? BLOOD : DEEP;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 4, y + Math.sin(a) * 4);
        ctx.lineTo(x + Math.cos(a) * fx.size * (0.4 + t), y + Math.sin(a) * fx.size * (0.4 + t));
        ctx.stroke();
      }
      ctx.strokeStyle = EDGE;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (0.3 + t * 0.7), 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "slReap":
      // 끌어당기기: 바깥에서 안으로 감겨드는 핏빛 소용돌이
      ctx.globalAlpha = fade;
      ctx.strokeStyle = BLOOD;
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 4;
        const r1 = fx.size * (1 - t * 0.8);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
        ctx.quadraticCurveTo(x + Math.cos(a + 0.8) * r1 * 0.6, y + Math.sin(a + 0.8) * r1 * 0.6, x + Math.cos(a + 1.4) * 4, y + Math.sin(a + 1.4) * 4);
        ctx.stroke();
      }
      break;
    case "slSky":
      // 강하: 하늘에서 내리꽂는 핏빛 기둥 + 충격 고리 + 갈라진 땅
      ctx.globalAlpha = fade;
      ctx.fillStyle = DEEP;
      ctx.fillRect(x - 4, y - 60 * (1 - t), 8, 60 * (1 - t));
      ctx.fillStyle = EDGE;
      ctx.fillRect(x - 1, y - 60 * (1 - t), 2, 60 * (1 - t));
      for (const [w, c, f] of [[4, DEEP, 1], [2, BLOOD, 0.95]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.ellipse(x, y, fx.size * (0.4 + t * 0.8) * f, fx.size * (0.2 + t * 0.4) * f, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      splatter(ctx, x, y - 2, fx.size, t, 14, 2);
      break;
    case "slRaid": {
      // 급습: 지나간 자리의 핏빛 잔상 줄 + 흩날리는 꽃잎
      ctx.globalAlpha = 1 - t;
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      for (const [w, c] of [[5, DEEP], [2, BLOOD], [1, EDGE]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w * (1 - t * 0.5);
        ctx.beginPath();
        ctx.moveTo(fx.x, fx.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      for (let i = 1; i < 6; i++) splatter(ctx, fx.x + (tx - fx.x) * (i / 6), fx.y + (ty - fx.y) * (i / 6), 6, t, 2, i * 3);
      break;
    }
    case "slRage":
      // 피의 학살 시작: 핏빛 고리 셋이 퍼지고 꽃잎이 흩날림
      ctx.globalAlpha = 1 - t;
      ctx.lineWidth = 3;
      for (const [k, c] of [[1, BLOOD], [0.7, DEEP], [0.45, EDGE]] as const) {
        ctx.strokeStyle = c;
        ctx.beginPath();
        ctx.arc(x, y, fx.size * (0.4 + t * 1.4) * k, 0, Math.PI * 2);
        ctx.stroke();
      }
      splatter(ctx, x, y, fx.size * 1.6, t, 20, 0);
      break;
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
