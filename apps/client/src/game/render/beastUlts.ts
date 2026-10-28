// 검은 잔영 짐승 셋 필살기·상태 그리기: 데스웜 모래지옥·독액·독 웅덩이 · 매 # 선을 가로지르는 매 · 전갈 검은 독액 · 플레이어 독·죽음 표시
import { WORM_PIT_R, WORM_POOL_R, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { additive, beam, glow, glowStroke, shock } from "./pwFxBits";
import { drawEnemySprite } from "../sprites";

const TAU = Math.PI * 2;

/** 바닥: 모래지옥 · 독 웅덩이 */
export function drawBeastGround(ctx: CanvasRenderingContext2D, s: RunState): void {
  for (const e of s.enemies) {
    if (e.kind !== "sandworm") continue;
    if (e.ultAt !== undefined) {
      // 모래지옥: 안쪽으로 빨려 드는 소용돌이
      const g = ctx.createRadialGradient(e.x, e.y, 10, e.x, e.y, WORM_PIT_R);
      g.addColorStop(0, "rgba(90, 56, 24, 0.75)");
      g.addColorStop(1, "rgba(200, 160, 100, 0.12)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(e.x, e.y, WORM_PIT_R, 0, TAU);
      ctx.fill();
      // 가운데 어둠으로 빨려 드는 모래 빛
      additive(ctx, () => shock(ctx, e.x, e.y, WORM_PIT_R, "#e8c890", 0.4, 10));
      ctx.strokeStyle = "rgba(120, 80, 40, 0.6)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const r = WORM_PIT_R * (1 - (((s.tick / 90 + i / 4) % 1)));
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, s.tick / 30 + i, s.tick / 30 + i + Math.PI * 1.2);
        glowStroke(ctx);
      }
    }
    for (const p of e.pools ?? []) {
      additive(ctx, () => glow(ctx, p.x, p.y, WORM_POOL_R * 1.2, "#7ad040", Math.min(0.5, p.t / 120)));
      ctx.fillStyle = `rgba(110, 200, 60, ${Math.min(0.45, p.t / 120)})`;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, WORM_POOL_R, WORM_POOL_R * 0.7, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(190, 255, 120, 0.6)";
      ctx.fillRect(Math.round(p.x - 5 + ((s.tick / 7) % 10)), Math.round(p.y - 2), 2, 2);
    }
  }
}

/** 위: 날아가는 독액 · # 선 위를 가로지르는 매 · 플레이어 독(초록)·죽음(검정) 표시 */
export function drawBeastAir(ctx: CanvasRenderingContext2D, s: RunState): void {
  for (const e of s.enemies) {
    if (e.kind === "sandworm") {
      for (const g of e.globs ?? []) {
        const lift = Math.min(18, g.t * 0.4);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(Math.round(g.x - 2), Math.round(g.y), 4, 2);
        additive(ctx, () => glow(ctx, g.x, g.y - lift, 6, "#7ad040", 0.8));
        ctx.fillStyle = "#7ad040";
        ctx.fillRect(Math.round(g.x - 2), Math.round(g.y - lift - 2), 4, 4);
        ctx.fillStyle = "#c8ff90";
        ctx.fillRect(Math.round(g.x - 1), Math.round(g.y - lift - 2), 1, 1);
      }
    }
    if (e.kind === "roc" && e.ultAt !== undefined) {
      // 터지기 직전 0.2초: 매가 선을 따라 빠르게 가로지름 (선 방향으로 몸을 돌림)
      for (const h of s.hazards ?? []) {
        const left = h.tick - s.tick;
        if (h.toX === undefined || h.toY === undefined || left < 0 || left > 12) continue;
        const f = 1 - left / 12;
        // 매가 지나간 자리에 바람 빛줄기
        additive(ctx, () => beam(ctx, h.x, h.y, h.x + (h.toX! - h.x) * f, h.y + (h.toY! - h.y) * f, 6, "#e8f0ff", 0.6));
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.translate(h.x + (h.toX - h.x) * f, h.y + (h.toY - h.y) * f);
        ctx.rotate(Math.atan2(h.toY - h.y, h.toX - h.x));
        drawEnemySprite(ctx, "roc", 0, 0, 0, false, undefined, 1.2);
        ctx.restore();
      }
    }
  }
  const p = s.player;
  const doom = (p.doomTicks ?? 0) > 0;
  if (!doom && (p.venomTicks ?? 0) <= 0) return;
  ctx.fillStyle = doom ? "#120818" : "#6ad040";
  const n = doom ? (p.doomStacks ?? 1) : 1;
  for (let i = 0; i < n; i++) {
    const a = s.tick / 12 + (i * TAU) / n;
    ctx.fillRect(Math.round(p.x + Math.cos(a) * 7 - 1), Math.round(p.y - p.r - 3 + Math.sin(a) * 2), 3, 3);
  }
  if (doom) {
    ctx.strokeStyle = "rgba(150, 60, 200, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 3, 0, TAU);
    glowStroke(ctx);
  }
}

/** 전갈 검은 독액 탄 */
export function drawBeastShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.look !== "doom") return false;
  // 검은 독액: 보랏빛 기운과 꼬리
  additive(ctx, () => {
    beam(ctx, x - pr.vx * 3, y - pr.vy * 3, x, y, pr.r * 1.5, "#8a3ac8", 0.5);
    glow(ctx, x, y, pr.r * 3, "#8a3ac8", 0.7);
  });
  ctx.fillStyle = "#0c0612";
  ctx.beginPath();
  ctx.arc(x, y, pr.r + 1, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = tick % 20 < 10 ? "#8a3ac8" : "#5a2088";
  ctx.lineWidth = 1;
  glowStroke(ctx);
  return true;
}
