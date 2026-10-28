// 이터 공격 효과: 그림자 베기·물어뜯는 아가리(그림자 촉수가 뻗음)·심연의 괴물·그림자 창·X자 발톱·땅에서 솟는 포식자·먹힌 혼
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha as tone, glow } from "./pwFxBits";
import { GLOW, INK, maw, RED, tendril, VOID } from "./eater";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 흩어지는 그림자 조각 (n개, 퍼짐 r) */
function shards(ctx: Ctx, x: number, y: number, r: number, t: number, n: number, seed: number): void {
  for (let i = 0; i < n; i++) {
    const a = seed + i * 2.399;
    const d = r * (0.3 + ((i * 37) % 10) / 14) * t;
    ctx.fillStyle = i % 3 === 0 ? GLOW : i % 3 === 1 ? VOID : INK;
    if (i % 3 === 0) additive(ctx, () => glow(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d - t * 4, 3, GLOW, 0.6));
    ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d - t * 4), i % 2 ? 2 : 1, 2);
  }
}

export function drawEaterFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const age = fx.maxTicks - fx.ticks;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a0 = Math.atan2(fx.dirY, fx.dirX);
  const fade = 1 - Math.max(0, t - 0.5) * 2;
  switch (fx.kind) {
    case "eaSlash": {
      // 그림자 베기: 보랏빛 테두리의 검은 초승달 + 안쪽 붉은 상처 줄 + 흩날리는 그림자
      const side = fx.toX ? 1 : -1;
      const from = a0 - side * 1.5;
      const to = from + side * 3 * Math.min(1, t * 2.4);
      ctx.globalAlpha = fade;
      // 보랏빛 그림자 기운 (겹치면 밝아짐)
      additive(ctx, () => {
        ctx.strokeStyle = tone(GLOW, 0.35 * fade);
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(x, y, fx.size * 0.82, Math.min(from, to), Math.max(from, to));
        ctx.stroke();
      });
      for (const [w, c, k] of [[9, VOID, 0.8], [6, INK, 0.82], [1, GLOW, 0.92], [1, RED, 0.72]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, fx.size * k, Math.min(from, to), Math.max(from, to));
        ctx.stroke();
      }
      shards(ctx, x + fx.dirX * fx.size * 0.8, y + fx.dirY * fx.size * 0.8, fx.size * 0.6, t, 10, a0);
      break;
    }
    case "eaBite": {
      // 물어뜯기: 이터 쪽에서 그림자 촉수가 뻗어 나와 끝이 아가리로 벌어졌다 콱 닫힘 (width = 늦게 나오는 틱)
      const d = fx.width ?? 0;
      if (age < d) return true;
      const k = (age - d) / Math.max(1, fx.maxTicks - d);
      ctx.globalAlpha = 1 - Math.max(0, k - 0.6) * 2.5;
      tendril(ctx, x - fx.dirX * fx.size * 1.8, y - fx.dirY * fx.size * 1.8, x - fx.dirX * fx.size * 0.6, y - fx.dirY * fx.size * 0.6, 3 + fx.size * 0.15, age * 0.3);
      maw(ctx, x, y, fx.size * (0.8 + Math.min(1, k * 3) * 0.2), a0, k < 0.45 ? 1 - k : 0);
      if (k > 0.45) shards(ctx, x, y, fx.size, (k - 0.45) / 0.55, 12, 1);
      break;
    }
    case "eaAbyss": {
      // 심연: 바닥에 보랏빛 소용돌이 구멍 → 거대한 괴물 머리가 솟아 위아래로 씹음 → 가라앉음
      ctx.globalAlpha = 0.85 * fade;
      ctx.fillStyle = VOID;
      ctx.beginPath();
      ctx.ellipse(x, y + fx.size * 0.4, fx.size * 1.15, fx.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = GLOW;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y + fx.size * 0.4, fx.size * (1.1 - i * 0.3), fx.size * (0.38 - i * 0.1), t * 4 + i, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      const rise = Math.sin(Math.min(1, t * 1.4) * Math.PI);
      ctx.globalAlpha = 1;
      for (const sx of [-1, 1]) tendril(ctx, x + sx * fx.size * 0.9, y + fx.size * 0.4, x + sx * fx.size * 0.6, y + fx.size * 0.4 - rise * fx.size, 3, t * 6 + sx);
      maw(ctx, x, y + fx.size * 0.4 - rise * fx.size * 0.9, fx.size * (0.75 + rise * 0.35), -Math.PI / 2, t < 0.4 ? 1 : 0.05);
      break;
    }
    case "eaSpear": {
      // 그림자 창 (dirX 0이면 dirY = 늦게 나오는 틱): 가시 돋친 검은 창이 뻗고 끝에 송곳니
      const d = fx.dirX === 0 ? fx.dirY : 0;
      if (age < d) return true;
      const k = Math.min(1, (age - d) / 5);
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      const ex = fx.x + (tx - fx.x) * k;
      const ey = fx.y + (ty - fx.y) * k;
      ctx.globalAlpha = 1 - Math.max(0, t - 0.6) * 2.5;
      for (const [w, c] of [[Math.max(4, fx.size) + 2, VOID], [Math.max(2, fx.size * 0.6), INK], [1, GLOW]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(fx.x, fx.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
      // 줄기에 돋친 가시
      const la = Math.atan2(ty - fx.y, tx - fx.x);
      ctx.fillStyle = INK;
      for (let i = 1; i < 5; i++) {
        const px = fx.x + (ex - fx.x) * (i / 5);
        const py = fx.y + (ey - fx.y) * (i / 5);
        const sa = la + (i % 2 ? 1 : -1) * 2.2;
        ctx.fillRect(Math.round(px + Math.cos(sa) * 3), Math.round(py + Math.sin(sa) * 3), 2, 2);
      }
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(la);
      ctx.fillStyle = "#f4f0f8";
      ctx.beginPath();
      ctx.moveTo(-3, -3);
      ctx.lineTo(5, 0);
      ctx.lineTo(-3, 3);
      ctx.fill();
      ctx.restore();
      break;
    }
    case "eaX":
      // X자: 그림자 발톱 두 줄기가 차례로 찢고, 찢긴 자리에서 붉은 빛이 샘
      ctx.globalAlpha = fade;
      for (const [i, sx] of [[0, 1], [1, -1]] as const) {
        const k = Math.min(1, t * 4 - i);
        if (k <= 0) continue;
        for (let claw = -1; claw <= 1; claw++) {
          for (const [w, c] of [[4, VOID], [2, INK], [1, claw === 0 ? RED : GLOW]] as const) {
            ctx.strokeStyle = c;
            ctx.lineWidth = w;
            ctx.beginPath();
            ctx.moveTo(x - fx.size * sx + claw * 4, y - fx.size);
            ctx.lineTo(x - fx.size * sx + 2 * fx.size * sx * k + claw * 4, y - fx.size + 2 * fx.size * k);
            ctx.stroke();
          }
        }
      }
      if (t > 0.35) shards(ctx, x, y, fx.size * 1.3, (t - 0.35) / 0.65, 14, 0.7);
      break;
    case "eaLurk": {
      // 낚아채기: 바닥에 등지느러미가 가르며 다가와 → 거대한 포식자가 솟아 물고 → 다시 잠김
      const arc = Math.sin(t * Math.PI);
      ctx.globalAlpha = 0.7 * fade;
      ctx.fillStyle = VOID;
      ctx.beginPath();
      ctx.ellipse(x, y + 4, fx.size * 1.4, fx.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = GLOW;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (t < 0.3) {
        // 지느러미
        const fx0 = x - fx.size * 1.2 + (t / 0.3) * fx.size * 1.2;
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.moveTo(fx0 - 4, y + 4);
        ctx.lineTo(fx0 + 2, y - 6);
        ctx.lineTo(fx0 + 4, y + 4);
        ctx.fill();
      } else maw(ctx, x, y + 4 - arc * fx.size * 1.7, fx.size * 1.1, -Math.PI / 2 + (t - 0.5) * 0.8, t < 0.55 ? 1 : 0);
      break;
    }
    case "eaEat":
      // 먹힘: 쓰러진 적의 붉은 혼이 보랏빛 꼬리를 끌며 소용돌이쳐 이터에게 빨려 들어감
      for (let i = 0; i < 7; i++) {
        const k = Math.min(1, t * 1.3 + i * 0.03);
        const sw = (1 - k) * 6;
        const sx = fx.x + Math.cos(i * 0.9 + k * 6) * fx.size * (1 - k) + Math.cos(k * 8 + i) * sw;
        const sy = fx.y + Math.sin(i * 0.9 + k * 6) * fx.size * (1 - k);
        const px = sx + ((fx.toX ?? x) - fx.x) * k;
        const py = sy + ((fx.toY ?? y) - fx.y) * k;
        ctx.globalAlpha = 1 - t * 0.8;
        ctx.fillStyle = i % 2 ? RED : GLOW;
        ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
        ctx.fillStyle = VOID;
        ctx.fillRect(Math.round(px - 2), Math.round(py), 1, 1);
      }
      break;
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
