// 잔영 그리기: 그림자 칼 · 단검 베기(보라 빛 궤적) · 사라짐(검은 연기) · 나타남(보라 섬광) · 남긴 잔영(옅은 몸 그림자가 한 번 더 벰 / 월식은 터짐)
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const VIO = "#8a6aff";
const MIST = "#c8b8ff";

function arc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), a0, a1);
  ctx.stroke();
}

/** 그림자 칼: 보라 꼬리 + 흰 칼날 */
export function drawRemnantShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "rmKnife") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = VIO;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - dx * 8, y - dy * 8);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - dx * 3, y - dy * 3);
  ctx.lineTo(x + dx * 2, y + dy * 2);
  ctx.stroke();
  return true;
}

/** 남아 있는 분신: 떠난 자리에 나와 똑같은 몸 (적이 쫓음, 끝날 때 한 번 벰) · 발밑 보라 고리 · 사라지기 직전 옅어짐 */
export function drawRemnantEchoes(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "remnant" || !p.rmEchoes?.length) return;
  for (const e of p.rmEchoes) {
    const x = snap(e.x);
    const y = snap(e.y);
    ctx.save();
    ctx.globalAlpha = 0.5;
    arc(ctx, x, y + p.r - 1, p.r + 2 + Math.sin(s.tick * 0.3), 0, TAU, VIO, 1);
    ctx.globalAlpha = Math.min(1, 0.3 + e.t / 15);
    drawCharacter(ctx, "remnant", x, y, p.r, { faceX: p.faceX, faceY: p.faceY, moving: false, casting: e.t < 8, step: 0 });
    ctx.restore();
  }
}

/** 효과: 베기 · 사라짐 · 나타남 · 잔영 베기 */
export function drawRemnantFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("rm")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const a = Math.atan2(fx.dirY, fx.dirX);
  switch (fx.kind) {
    case "rmSlash": {
      // 빠른 베기: 회전 칼날(width 0)이면 둘레 원, 아니면 짧은 반달 (여러 번 베면 겹쳐서)
      ctx.globalAlpha = 1 - t;
      if (fx.width === 0) {
        arc(ctx, x, y - 2, r * (0.7 + t * 0.3), t * 4, t * 4 + TAU * 0.8, VIO, 2);
        arc(ctx, x, y - 2, r * (0.75 + t * 0.3), t * 4, t * 4 + TAU * 0.5, "#ffffff", 1);
        break;
      }
      const n = Math.max(1, Math.min(3, fx.width ?? 1));
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * 0.35 + t * 0.6;
        arc(ctx, x, y - 2, r * (0.8 + 0.1 * i), a - 0.9 + off, a + 0.36 + off, VIO, 2);
        arc(ctx, x, y - 2, r * (0.85 + 0.1 * i), a - 0.54 + off, a + 0.27 + off, "#ffffff", 1);
      }
      break;
    }
    case "rmVanish": {
      // 검은 연기가 흩어짐
      for (let i = 0; i < 7; i++) {
        const b = (i * TAU) / 7;
        ctx.globalAlpha = (1 - t) * 0.6;
        ctx.fillStyle = i % 2 ? "#2a2040" : "#4a3a6a";
        ctx.beginPath();
        ctx.arc(x + Math.cos(b) * r * t * 1.5, y - 4 + Math.sin(b) * r * t, 2.5 * (1 - t) + 1, 0, TAU);
        ctx.fill();
      }
      break;
    }
    case "rmAppear": {
      // 등 뒤에서 나타남: 보라 섬광 + 세로 칼빛
      ctx.globalAlpha = 1 - t;
      arc(ctx, x, y - 4, r * (0.4 + t), 0, TAU, MIST, 1);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 1, y - 14 + t * 4, 2, 12 * (1 - t));
      break;
    }
    case "rmEcho": {
      // 잔영의 베기 (월식이면 검은 원이 터짐)
      ctx.globalAlpha = 1 - t;
      if (fx.width === 1) {
        ctx.fillStyle = "#1a1028";
        ctx.globalAlpha = (1 - t) * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, r * (0.5 + t * 0.5), 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1 - t;
        arc(ctx, x, y, r * (0.5 + t * 0.5), 0, TAU, "#ffe9a8", 2);
      } else {
        arc(ctx, x, y - 2, r * 0.8, t * 6, t * 6 + 2.4, VIO, 2);
        arc(ctx, x, y - 2, r * 0.8, t * 6 + Math.PI, t * 6 + Math.PI + 2.4, MIST, 1);
      }
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
