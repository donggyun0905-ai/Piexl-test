// 시련의 방 효과: 비석이 깨어남(붉고 검은 충격파 + 하늘로 솟는 빛기둥 + 불똥) · 거절 벌칙(검붉은 사슬이 몸을 감음) · 보상 상자가 비석에서 날아가 떨어짐
// · 상자 열림(금빛 터짐) · 시련 적이 나타남(붉은 소환 원) · 시련 중 화면 가장자리 핏빛 맥박 (render/index가 부름)
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, alpha, beam, easeOut, glow, rune, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const RED = "#ff2a3a";
const EMBER = "#ff7a3a";
const GOLD = "#ffcc3a";

export function drawTrialFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("tr")) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "trWake": {
      // 깨어남: 검은 고리 위로 붉은 충격파 두 겹 · 빛기둥이 솟았다 사라짐 · 불똥
      ctx.globalAlpha = (1 - f) * 0.6;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(x, y + 20, r * easeOut(f) * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      additive(ctx, () => {
        shock(ctx, x, y + 20, r * easeOut(f), RED, 1 - f, 10);
        shock(ctx, x, y + 20, r * 0.6 * easeOut(Math.min(1, f * 1.4)), EMBER, (1 - f) * 0.8, 6);
        beam(ctx, x, y + 24, x, y - 160, 14 * (1 - f) + 2, RED, (1 - f) * 0.9);
        glow(ctx, x, y - 10, r * 0.8, RED, (1 - f) * 0.7, 1);
        sparks(ctx, x, y, 18, r * 1.3, f, EMBER, fx.x + fx.maxTicks);
      });
      return true;
    }
    case "trCurse": {
      // 거절 벌칙: 검붉은 사슬 고리가 조여 오며 사라짐
      for (let k = 0; k < 3; k++) {
        const rr = r * (1 - f * 0.6) - k * 5;
        ctx.save();
        ctx.translate(x, y - 4);
        ctx.rotate(f * 4 * (k % 2 ? -1 : 1) + k);
        ctx.strokeStyle = alpha(k === 1 ? "#4a0a10" : RED, 1 - f);
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(2, rr), Math.max(1, rr * 0.45), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.setLineDash([]);
      additive(ctx, () => glow(ctx, x, y - 4, r, RED, (1 - f) * 0.5));
      return true;
    }
    case "trChest": {
      // 비석에서 튀어 올라 포물선으로 떨어지는 상자 (도착하면 바닥의 진짜 상자가 보임)
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const g = easeOut(f);
      const cx = x + (tx - x) * g;
      const cy = y - 30 + (ty - y + 30) * g - Math.sin(g * Math.PI) * 50;
      additive(ctx, () => {
        glow(ctx, cx, cy, 12, GOLD, (1 - f) * 0.9, 0.8);
        if (f > 0.85) shock(ctx, tx, ty, 18 * (f - 0.85) / 0.15, GOLD, 1 - f, 4);
      });
      ctx.fillStyle = "#3a2410";
      ctx.fillRect(Math.round(cx - 5), Math.round(cy - 4), 10, 7);
      ctx.fillStyle = GOLD;
      ctx.fillRect(Math.round(cx - 5), Math.round(cy - 4), 10, 2);
      return true;
    }
    case "trOpen": {
      additive(ctx, () => {
        shock(ctx, x, y - 4, r * 1.6 * easeOut(f), GOLD, 1 - f, 5);
        glow(ctx, x, y - 4, r, GOLD, (1 - f) * 0.9, 1);
        sparks(ctx, x, y - 4, 12, r * 1.8, f, GOLD, fx.x + fx.y);
      });
      return true;
    }
    case "trSpawn": {
      // 붉은 소환 원이 열리고 검은 기운이 솟음
      additive(ctx, () => {
        rune(ctx, x, y + 4, r * (0.6 + f * 0.6), RED, 1 - f, f * 3);
        glow(ctx, x, y, r * 1.2, RED, (1 - f) * 0.6);
      });
      ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * (1 - f)})`;
      ctx.fillRect(Math.round(x - 2), Math.round(y - 16 * f), 4, Math.round(16 * f));
      return true;
    }
    default:
      return false;
  }
}

/** 시련 중: 화면 가장자리가 핏빛으로 맥박 (끝없는 시련은 점수가 오를수록 진하게) · 위쪽 가운데 점수판 · 끝난 결과·거절 벌칙 안내 (3초) */
export function drawTrialEdge(ctx: Ctx, s: RunState, scale: number, text?: (key: string) => string): void {
  const run = s.trialRun;
  const last = s.player.trial?.last;
  if (text && last && !run && s.tick - last.tick < 180) {
    const line = last.penalty ? text(`trialPen_${last.penalty}`) : last.score !== undefined ? text("trialResult").replace("{n}", String(last.score)) : "";
    if (line) banner(ctx, scale, line, "", last.penalty ? "#ff8a8a" : GOLD);
  }
  if (!run || run.room !== s.roomId) return;
  if (text) {
    const sub = run.kind === 4 ? text("trialScore").replace("{n}", String(run.score)) : (run.kind === 3 ? text("trialBoss") : text("trialWave")).replace("{n}", String(run.left + (s.enemies.length > 0 ? 1 : 0)));
    banner(ctx, scale, text(`trialKind_${run.kind}`), sub, "#ffd0d0");
  }
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const heat = run.kind === 4 ? 0.25 + 0.45 * (run.score / 1000) : 0.45;
  const a = heat * (0.75 + 0.25 * Math.sin(s.tick / 8));
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.72);
  g.addColorStop(0, "rgba(120, 0, 10, 0)");
  g.addColorStop(1, `rgba(150, 0, 16, ${a})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/** 위쪽 가운데 띠: 큰 글자 + 작은 글자 */
function banner(ctx: Ctx, scale: number, head: string, sub: string, color: string): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.textAlign = "center";
  ctx.font = `bold ${Math.round(12 * scale)}px sans-serif`;
  const y = Math.round(ctx.canvas.height * 0.05 + 26 * scale);
  const w = Math.max(ctx.measureText(head).width, sub.length * 6 * scale) + 28 * scale;
  ctx.fillStyle = "rgba(40, 0, 6, 0.8)";
  ctx.fillRect(ctx.canvas.width / 2 - w / 2, y - 16 * scale, w, (sub ? 32 : 22) * scale);
  ctx.fillStyle = color;
  ctx.fillText(head, ctx.canvas.width / 2, y);
  if (sub) {
    ctx.font = `bold ${Math.round(9 * scale)}px sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(sub, ctx.canvas.width / 2, y + 12 * scale);
  }
  ctx.restore();
}
