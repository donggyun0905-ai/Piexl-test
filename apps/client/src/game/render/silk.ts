// 영사 그리기: 방 끝에서 끝까지 가는 실선(1초, 점점 옅어짐) · 적 머리 위 얽힘 점 · 찢기(적 둘레 실 다섯이 조였다가 방 끝으로 휙 날아감)
// 장전(손끝 빛) · 발밑 실 남은 양 막대(장전 중이면 차오름)
import { silkAmmo, type EffectState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const SILK = "#f4e8ff";
const PINK = "#ff8ad8";
const RED = "#e83a5a";

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** 적 머리 위 얽힘 점 (실 한 가닥마다 분홍 점 하나) */
export function drawSilkStacks(ctx: Ctx, s: RunState, snap: Snap): void {
  if (s.player.characterId !== "silk") return;
  for (const e of s.enemies) {
    const n = e.skStacks ?? 0;
    if (e.hp <= 0) continue;
    const x = snap(e.x);
    // 아래부터: 체력바(몸 위 4) · 얽힘 점(몸 위 8) · 출혈 게이지(몸 위 12, 30이면 과다출혈)
    const y = snap(e.y - e.r - 8);
    const b = (e.skBleed ?? 0) / 30;
    if (b > 0) {
      const by = snap(e.y - e.r - 12);
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(x - 9, by - 1, 18, 4);
      ctx.fillStyle = b > 0.8 && s.tick % 10 < 5 ? "#ff6a7a" : "#e01836";
      ctx.fillRect(x - 8, by, Math.max(1, Math.round(16 * b)), 2);
      // 핏방울 표시 (체력바와 구분)
      ctx.fillStyle = "#ff3a4a";
      ctx.fillRect(x - 12, by - 1, 1, 1);
      ctx.fillRect(x - 13, by, 3, 2);
      ctx.fillStyle = "#ffd0d0";
      ctx.fillRect(x - 13, by, 1, 1);
    }
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = n >= 4 ? RED : PINK;
      ctx.fillRect(x - n * 1.5 + i * 3, y, 2, 2);
    }
  }
}

/** 발밑 실 막대 (남은 실 · 장전 중이면 하얗게 차오름) */
export function drawSilkAmmo(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "silk") return;
  const a = silkAmmo(p);
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 9, y + 8, 18, 3);
  ctx.fillStyle = a.reload > 0 ? "#ffffff" : a.ammo <= 10 ? RED : PINK;
  ctx.fillRect(x - 8, y + 9, Math.round(16 * (a.reload > 0 ? a.reload : a.ammo / a.max)), 1);
}

/** 효과: 실선 · 찢기 · 장전 */
export function drawSilkFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("sk")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "skLine": {
      // 쏜 순간은 밝고 굵게, 1초에 걸쳐 가는 은빛 실로 옅어짐
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      ctx.globalAlpha = t < 0.1 ? 0.9 : 0.55 * (1 - t);
      line(ctx, x, y, tx, ty, t < 0.1 ? "#ffffff" : (fx.tint ?? SILK), t < 0.1 ? 1.5 : 0.6);
      break;
    }
    case "skRend": {
      // 0~0.35: 실 다섯이 적 둘레에서 조여 들고(띵) · 그 뒤 다섯 방향으로 방 끝까지 휙 날아감 + 붉은 조각
      // 얽힘 실은 빨강 (핏빛 실은 검정: tint)
      const r = fx.size;
      const knot = fx.tint ?? RED;
      for (let i = 0; i < 5; i++) {
        const a = (i * TAU) / 5 - Math.PI / 2;
        const cx = Math.cos(a);
        const cy = Math.sin(a);
        if (t < 0.35) {
          const k = 1 - t / 0.35;
          ctx.globalAlpha = 0.9;
          line(ctx, x + cx * (r * (0.3 + k)), y + cy * (r * (0.3 + k)), x - cy * r * 0.8, y + cx * r * 0.8, knot, 1.2);
        } else {
          const k = (t - 0.35) / 0.65;
          ctx.globalAlpha = 1 - k;
          line(ctx, x + cx * r * 0.4, y + cy * r * 0.4, x + cx * (r + k * 400), y + cy * (r + k * 400), knot, 1);
          ctx.fillStyle = RED;
          ctx.fillRect(Math.round(x + cx * r * k * 1.5), Math.round(y + cy * r * k * 1.5 + k * 6), 2, 2);
        }
      }
      break;
    }
    case "skBleed": {
      // 과다출혈: 붉은 고리가 터지며 핏방울이 사방으로
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = "#ff2040";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (0.4 + t), 0, TAU);
      ctx.stroke();
      ctx.fillStyle = "#c0102a";
      for (let i = 0; i < 10; i++) {
        const a = (i * TAU) / 10;
        ctx.fillRect(Math.round(x + Math.cos(a) * fx.size * t * 1.4), Math.round(y + Math.sin(a) * fx.size * t + t * t * 10), 2, 2);
      }
      break;
    }
    case "skReload": {
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = PINK;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y - 4, fx.size * (0.5 + t), 0, TAU);
      ctx.stroke();
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
