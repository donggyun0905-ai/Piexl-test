// 잔영 그리기: 그림자 칼 · 단검 내려찍기(위에서 내리꽂는 칼빛·끝 불똥) · 회피 성공(보라 충격파·잔상) · 연속 베기(큰 초승달 검격, 겹치면 밝아짐)
// · 월식(검은 달 + 금빛 테) · 슬로우모션(발밑 문양·남은 시간 고리, 화면 가장자리 어둡게 + 위쪽 남은 시간 막대·칼 표시)
import { drawBlastSlowmo } from "./blastBody";
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rune, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const VIO = "#8a6aff";
const MIST = "#c8b8ff";
const GOLD = "#ffe9a8";

/** 그림자 칼: 보라 꼬리 + 흰 칼날 */
export function drawRemnantShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "rmKnife") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  additive(ctx, () => glow(ctx, x, y, 6, VIO, 0.6));
  ctx.strokeStyle = alpha(VIO, 0.6);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - dx * 9, y - dy * 9);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - dx * 3, y - dy * 3);
  ctx.lineTo(x + dx * 2, y + dy * 2);
  ctx.stroke();
  return true;
}

/** 슬로우모션 중 발밑: 도는 보라 문양 + 남은 시간만큼 줄어드는 고리 (연속 베기 중엔 더 밝게) */
export function drawRemnantAura(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "remnant" || (!(p.rmSlow ?? 0) && !p.rmFlurry)) return;
  const x = snap(p.x);
  const y = snap(p.y);
  const left = p.rmFlurry ? 1 : Math.min(1, (p.rmSlow ?? 0) / 90);
  additive(ctx, () => {
    glow(ctx, x, y, 26, VIO, p.rmFlurry ? 0.7 : 0.4);
    rune(ctx, x, y + p.r, 18, MIST, 0.8, s.tick * 0.08);
  });
  ctx.strokeStyle = alpha(GOLD, 0.9);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, p.r + 9, -Math.PI / 2, -Math.PI / 2 + TAU * left);
  ctx.stroke();
}

/** 슬로우모션 화면: 가장자리가 보랏빛으로 어두워지고, 위쪽 가운데 남은 시간 막대와 칼 표시 (누르라는 뜻으로 맥박) */
export function drawRemnantSlowmo(ctx: Ctx, s: RunState, scale: number): void {
  // 블래스트 대시 슬로우모션 화면도 같은 자리에서 (render/index가 커서 여기서 부름)
  drawBlastSlowmo(ctx, s, scale);
  const p = s.player;
  if (p.characterId !== "remnant" || (!(p.rmSlow ?? 0) && !p.rmFlurry)) return;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.7);
  g.addColorStop(0, "rgba(20, 8, 40, 0.08)");
  g.addColorStop(1, "rgba(20, 8, 40, 0.6)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (!p.rmFlurry) {
    const u = Math.max(2, scale * 2);
    const bw = u * 50;
    const left = Math.min(1, (p.rmSlow ?? 0) / 90);
    const bx = W / 2 - bw / 2;
    const by = u * 14;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(bx, by, bw, u * 2);
    ctx.fillStyle = MIST;
    ctx.fillRect(bx, by, bw * left, u * 2);
    // 칼 표시 (맥박)
    const k = 1 + 0.15 * Math.sin(s.tick * 0.5);
    ctx.translate(W / 2, by - u * 6);
    ctx.scale(k, k);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-u * 0.6, -u * 5, u * 1.2, u * 7);
    ctx.fillStyle = GOLD;
    ctx.fillRect(-u * 2, u * 2, u * 4, u);
    ctx.fillRect(-u * 0.6, u * 3, u * 1.2, u * 2);
  }
  ctx.restore();
}

/** 효과: 내려찍기 · 회피 · 연속 베기 · 월식 */
export function drawRemnantFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("rm")) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const a = Math.atan2(fx.dirY, fx.dirX);
  switch (fx.kind) {
    case "rmStab": {
      // 칼끝 자리: 위에서 내리꽂는 흰 칼빛 + 작은 초승달 + 끝에서 튀는 불똥
      const n = Math.max(1, Math.min(2, fx.width ?? 1));
      for (let i = 0; i < n; i++) {
        const side = (i - (n - 1) / 2) * 0.5;
        const tx = x + Math.cos(a + side) * r * 0.85;
        const ty = y - 2 + Math.sin(a + side) * r * 0.85;
        const drop = (1 - easeOut(Math.min(1, f * 2.5))) * 12;
        ctx.globalAlpha = 1 - f;
        ctx.strokeStyle = alpha(VIO, 0.8);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tx, ty - 18 - drop);
        ctx.lineTo(tx, ty - drop);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
        additive(ctx, () => {
          crescent(ctx, x, y - 2, r * 1.1, a + side, 0.6, 5, VIO, 0.9 * (1 - f));
          glow(ctx, tx, ty, 10, VIO, 0.6 * (1 - f), 1);
          if (f > 0.3) sparks(ctx, tx, ty, 6, 11, (f - 0.3) / 0.7, MIST, fx.x + i);
        });
      }
      break;
    }
    case "rmDodge": {
      // 회피: 보라 충격파 두 겹 + 흩어지는 잔상 줄
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f), VIO, 1 - f, 6);
        shock(ctx, x, y, r * 0.6 * easeOut(f), MIST, (1 - f) * 0.8, 3);
        glow(ctx, x, y, r * 0.7, VIO, (1 - f) * 0.8, 1);
        sparks(ctx, x, y, 10, r * 1.2, f, MIST, fx.x + fx.y);
      });
      break;
    }
    case "rmFlurry": {
      // 연속 베기: 큰 초승달 (width 1·-1 = 벤 방향 반대로 · 0 = 몸 둘레 한 바퀴) · 흰 속 · 끝에 불똥
      const sweep = (fx.width ?? 1) * (easeOut(f) - 0.5) * 1.4;
      additive(ctx, () => {
        if (fx.width === 0) {
          for (let k = 0; k < 3; k++) crescent(ctx, x, y - 2, r * (0.85 + 0.08 * k), a + f * 5 + (k * TAU) / 3, 1.2, 8 - k * 2, VIO, 1 - f);
          shock(ctx, x, y, r * (0.6 + f * 0.5), MIST, (1 - f) * 0.7, 5);
        } else {
          crescent(ctx, x, y - 2, r, a + sweep, 1.25, 10, VIO, 1 - f);
          crescent(ctx, x, y - 2, r * 0.92, a + sweep, 1.05, 4, MIST, 1 - f);
        }
        glow(ctx, x, y, r * 0.8, VIO, (1 - f) * 0.5);
        sparks(ctx, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, 8, r * 0.6, f, GOLD, fx.x * 3 + fx.y);
      });
      break;
    }
    case "rmEclipse": {
      // 월식: 검은 달이 커지고 금빛 테가 터져 나감
      ctx.globalAlpha = (1 - f) * 0.7;
      ctx.fillStyle = "#120a20";
      ctx.beginPath();
      ctx.arc(x, y, r * (0.4 + easeOut(f) * 0.5), 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f), GOLD, 1 - f, 8);
        sparks(ctx, x, y, 14, r, f, GOLD, fx.x - fx.y);
      });
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
