// 오리(히든) 그리기: 줄지어 따라오는 새끼 오리 · 깃털·거품 탄 · 꽥 음파·물보라·큰 꽥·날아가는 황금알
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

const YEL = "#ffd84a";
const BILL = "#ff9a2a";
const EYE = "#3a3446";
const WAVE = "155, 216, 255";

/** 새끼 오리들 (플레이어 다음): 옆에서 본 몸·머리·부리, 걸으면 뒤뚱거림 · 탄을 막은 직후엔 하얗게 */
export function drawDucklings(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  if (s.over) return;
  for (const [i, d] of (s.player.ducklings ?? []).entries()) {
    const x = snap(lerp(d.prevX, d.x, alpha));
    const y = snap(lerp(d.prevY, d.y, alpha));
    const moving = d.x !== d.prevX || d.y !== d.prevY;
    const bob = moving && ((s.tick >> 3) + i) % 2 === 0 ? 1 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(d.face, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(-3, 2, 6, 1);
    ctx.fillStyle = d.cd > 50 ? "#ffffff" : YEL;
    ctx.fillRect(-3, -1 - bob, 5, 3);
    ctx.fillRect(-4, -2 - bob, 1, 1);
    ctx.fillRect(0, -4 - bob, 3, 3);
    ctx.fillStyle = BILL;
    ctx.fillRect(3, -3 - bob, 2, 1);
    ctx.fillRect(-1 + bob, 2, 1, 1);
    ctx.fillRect(1 - bob, 2, 1, 1);
    ctx.fillStyle = EYE;
    ctx.fillRect(2, -4 - bob, 1, 1);
    ctx.restore();
  }
}

/** 깃털·거품이면 그리고 true */
export function drawDuckShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit === "feather") {
    // 날아가는 쪽으로 누운 흰 깃털
    const len = Math.hypot(pr.vx, pr.vy) || 1;
    const dx = pr.vx / len;
    const dy = pr.vy / len;
    ctx.strokeStyle = "#f4f4f8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - dx * 4, y - dy * 4);
    ctx.lineTo(x + dx * 2, y + dy * 2);
    ctx.stroke();
    ctx.fillStyle = "#c8c8d8";
    ctx.fillRect(Math.round(x - dx * 4), Math.round(y - dy * 4), 1, 1);
    return true;
  }
  if (pr.spirit === "bubble") {
    const r = pr.r + ((tick >> 3) % 2);
    ctx.strokeStyle = `rgba(${WAVE}, 0.9)`;
    ctx.fillStyle = `rgba(${WAVE}, 0.25)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(x - r / 2), Math.round(y - r / 2), 1, 1);
    return true;
  }
  return false;
}

/** 꽥 음파 · 물보라 · 큰 꽥 · 황금알이면 그리고 true (px, py = 지금 플레이어 자리) */
export function drawDuckFx(ctx: CanvasRenderingContext2D, fx: EffectState, px: number, py: number, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.follow ? px : fx.x);
  const y = snap(fx.follow ? py : fx.y);
  if (fx.kind === "quack" || fx.kind === "splash") {
    // 퍼져 나가는 호 세 줄 (부채꼴 cos = width, -1이면 한 바퀴)
    const spread = (fx.width ?? 0.5) <= -1 ? Math.PI : Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.5)));
    const a = Math.atan2(fx.dirY, fx.dirX);
    const grow = 1 - t;
    const rgb = fx.kind === "splash" ? "90, 176, 232" : WAVE;
    // 음파: 빛나는 호 세 줄 (겹치면 밝아짐)
    additive(ctx, () => {
      for (let i = 0; i < 3; i++) {
        const r = fx.size * Math.min(1, grow * 1.3 - i * 0.15);
        if (r <= 1) continue;
        for (const [w, al] of [[5, 0.25], [1.5, 0.9]] as const) {
          ctx.strokeStyle = `rgba(${rgb}, ${al * t})`;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.arc(x, y, r, a - spread, a + spread);
          ctx.stroke();
        }
      }
    });
    if (fx.kind === "splash") {
      ctx.fillStyle = `rgba(${rgb}, ${0.2 * t})`;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * grow, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }
  if (fx.kind === "bigQuack") {
    // 굵은 노란 고리 두 겹 + 둘레의 음파 점
    const grow = 1 - t * t;
    // 큰 꽥: 노란 충격파 + 가운데 빛
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * grow * 0.8, "#ffd84a", t * 0.6, t > 0.8 ? 1.2 : 0);
      shock(ctx, x, y, fx.size * grow, "#ffd84a", t, 7);
    });
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(255, 216, 74, ${0.9 * t})`;
    ctx.beginPath();
    ctx.arc(x, y, fx.size * grow, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${WAVE}, ${0.7 * t})`;
    ctx.beginPath();
    ctx.arc(x, y, fx.size * grow * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${t})`;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.fillRect(snap(x + Math.cos(a) * fx.size * grow), snap(y + Math.sin(a) * fx.size * grow), 2, 2);
    }
    return true;
  }
  if (fx.kind === "duckEgg") {
    // 플레이어 → 목표로 포물선을 그리며 날아가는 황금알, 목표 자리엔 떨어질 곳 표시
    const k = 1 - t;
    const tx = fx.toX ?? fx.x;
    const ty = fx.toY ?? fx.y;
    const ex = snap(lerp(fx.x, tx, k));
    const ey = snap(lerp(fx.y, ty, k) - Math.sin(k * Math.PI) * 18);
    ctx.strokeStyle = `rgba(242, 193, 78, ${0.5 + 0.4 * k})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(snap(tx), snap(ty), fx.size * (0.4 + 0.6 * k), 0, Math.PI * 2);
    ctx.stroke();
    additive(ctx, () => glow(ctx, ex, ey, 7, "#f2c14e", 0.8, 0.6));
    ctx.fillStyle = "#f2c14e";
    ctx.fillRect(ex - 2, ey - 3, 4, 5);
    ctx.fillStyle = "#fff6c0";
    ctx.fillRect(ex - 1, ey - 2, 1, 2);
    return true;
  }
  return false;
}
