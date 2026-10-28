// 시즌 2 마지막 라스트 보스 제천대성 그리기: 근두운 위·땅 위 그림 · 근두운에서 내려오기 · 뛰어오르기 · 따로 떠다니는 근두운
// 여의봉 벽 · 맵 전체 휘두르기(금빛 깜박임 세 번 → 거대한 여의봉) · 즉사기(문구·살 수 있는 원·늘어나는 여의봉) · 강해진 뒤 터지기 직전 하얀 깜박임 · 던진 여의봉·번개 탄
import { SAGE_DISMOUNT, SAGE_MAX_SAFE, SAGE_MAX_WARN, SAGE_SWEEP, type EnemyState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";
import { drawRuyi, line, plunge, PLUNGE, staffW } from "./ruyi";
import { C } from "./palette";

const TAU = Math.PI * 2;

/** 제천대성이면 그리고 true */
export function drawSageActor(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind !== "sage") return false;
  const g = e.sage;
  const flip = e.dirX < 0;
  const tint: readonly [string, number] | undefined = e.hitFlash > 0 ? [C.hit, 1] : (e.stunTicks ?? 0) > 0 ? [C.frozen, 0.45] : undefined;
  const swing = !!g?.bAct;
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 20, 6, 0, 0, TAU);
  ctx.fill();
  if (e.ultAt !== undefined) {
    // 근두운에서 내려옴: 앞 절반은 근두운 위에서 떨고, 뒤 절반은 뛰어내려 근두운은 비켜 남
    const f = (s.tick - e.ultAt) / SAGE_DISMOUNT;
    if (f < 0.5) drawEnemySprite(ctx, "sage", x + (s.tick % 4 < 2 ? -1 : 1), y - 14, 0, flip, tint);
    else {
      const k = (f - 0.5) * 2;
      drawEnemySprite(ctx, "sage_cloud", x + 40 * k, y - 30 * k, 0, false);
      drawEnemySprite(ctx, "sage", x, y - 30 - Math.sin(k * Math.PI) * 24, 3, flip, tint);
    }
    return true;
  }
  if (g?.foot) {
    // 따로 떠다니는 근두운
    drawEnemySprite(ctx, "sage_cloud", g.cx, g.cy + Math.sin(s.tick / 12) * 2, Math.floor(s.tick / 14), false);
  }
  const lift = e.air ? 30 : 0;
  const frame = g?.foot ? (swing ? 4 : 3) : swing ? 2 : Math.floor(s.tick / 14) % 2;
  drawEnemySprite(ctx, "sage", x, y - (g?.foot ? 30 : 14) - lift, frame, flip, tint);
  return true;
}


/** 바닥 위: 여의봉 벽 · 즉사기 때 살 수 있는 원 */
export function drawSageGround(ctx: CanvasRenderingContext2D, s: RunState): void {
  for (const e of s.enemies) {
    const g = e.sage;
    if (e.kind !== "sage" || !g) continue;
    for (const w of g.walls) drawRuyi(ctx, w[0]!, w[1]!, w[2]!, w[3]!, 9, 0.6);
    if (g.bAct === "max") {
      ctx.strokeStyle = s.tick % 10 < 5 ? "rgba(255, 220, 90, 0.95)" : "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + SAGE_MAX_SAFE, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

/** 위: 강해진 뒤 터지기 직전 하얀 깜박임 · 맵 전체 휘두르기 · 즉사기 여의봉 */
export function drawSageAir(ctx: CanvasRenderingContext2D, s: RunState): void {
  // 터지기 직전 0.25초: 하얗게 깜박여 대시 시점을 알려 줌
  for (const h of s.hazards ?? []) {
    const left = h.tick - s.tick;
    if (!h.cue || left > 15 || left < 0 || left % 6 >= 3) continue;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2;
    if (h.toX !== undefined && h.toY !== undefined) line(ctx, h.x, h.y, h.toX, h.toY);
    else {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, TAU);
      ctx.stroke();
    }
  }
  // 여의봉 공격 예고: 여의봉이 처음 자리에서 끝까지 서서히 뻗어 나옴 · 돌리기는 천천히 도는 여의봉
  for (const h of s.hazards ?? []) {
    if (s.tick < h.start || (h.fx !== "staff" && h.fx !== "staffSpin")) continue;
    const f = Math.min(1, (s.tick - h.start) / Math.max(1, h.tick - h.start));
    ctx.globalAlpha = 0.3 + 0.45 * f;
    if (h.fx === "staff" && h.toX !== undefined && h.toY !== undefined) {
      // 수직 내려찍기: 하늘 높이에서 거대한 여의봉이 내려옴 (그림자가 짙어짐)
      if (plunge(h.x, h.y, h.toX, h.toY)) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.15 + 0.35 * f})`;
        ctx.beginPath();
        ctx.ellipse(h.toX, h.toY, 10 + 10 * f, 4 + 4 * f, 0, 0, TAU);
        ctx.fill();
        const top = h.toY - PLUNGE - 200 * (1 - f);
        drawRuyi(ctx, h.toX, top, h.toX, top + PLUNGE * 0.9, staffW(h.width), f);
      } else drawRuyi(ctx, h.x, h.y, h.x + (h.toX - h.x) * f, h.y + (h.toY - h.y) * f, staffW(h.width), f);
    }
    else if (h.fx === "staffSpin") {
      const a = f * Math.PI * 1.5;
      const r = h.radius * (0.4 + 0.6 * f);
      drawRuyi(ctx, h.x - Math.cos(a) * r, h.y - Math.sin(a) * r, h.x + Math.cos(a) * r, h.y + Math.sin(a) * r, 6, f);
    }
    ctx.globalAlpha = 1;
  }
  for (const e of s.enemies) {
    const g = e.sage;
    if (e.kind !== "sage" || !g?.bAct || g.bAt === undefined) continue;
    const t = s.tick - g.bAt;
    const p = s.player;
    if (g.bAct === "sweep") {
      const hit = SAGE_SWEEP.first + 3 * SAGE_SWEEP.blink;
      let flash = false;
      for (let j = 0; j < 3; j++) if (t >= SAGE_SWEEP.first + j * SAGE_SWEEP.blink && t < SAGE_SWEEP.first + j * SAGE_SWEEP.blink + 6) flash = true;
      if (flash) screen(ctx, "rgba(255, 200, 40, 0.3)");
      // 크게 키운 여의봉이 플레이어 쪽으로 기울며 커짐 → 휘두르는 순간 맵을 가로지름
      const k = Math.min(1, t / hit);
      drawRuyi(ctx, e.x - 400 * k, e.y - 30 * (1 - k), e.x + 400 * k, e.y - 30 * (1 - k), 6 + 18 * k, 0.4 + 0.6 * k);
      if (t >= hit - 1) drawRuyi(ctx, e.x - 600, p.y, e.x + 600, p.y, 26, 1);
    } else if (g.bAct === "max") {
      const k = Math.min(1, t / SAGE_MAX_WARN);
      drawRuyi(ctx, e.x, e.y - 20 - 400 * k, e.x, e.y + 20 + 400 * k, 6 + 30 * k, 0.4 + 0.6 * k);
      if (t >= SAGE_MAX_WARN - 2) screen(ctx, "rgba(255, 245, 210, 0.7)");
    }
  }
}

function screen(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/** 즉사기 문구 (화면 위쪽 고정, 체력 막대 아래) */
export function drawSageBanner(ctx: CanvasRenderingContext2D, s: RunState, scale: number, text?: string): void {
  if (!text || !s.enemies.some((e) => e.kind === "sage" && e.sage?.bAct === "max")) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `bold ${Math.round(11 * scale)}px sans-serif`;
  ctx.textAlign = "center";
  const y = Math.round(ctx.canvas.height * 0.04 + 26 * scale);
  const w = ctx.measureText(text).width + 20 * scale;
  ctx.fillStyle = "rgba(60, 10, 10, 0.85)";
  ctx.fillRect(ctx.canvas.width / 2 - w / 2, y - 14 * scale, w, 20 * scale);
  ctx.fillStyle = s.tick % 16 < 8 ? "#ffe060" : "#ffffff";
  ctx.fillText(text, ctx.canvas.width / 2, y);
  ctx.restore();
}

/** 던진 여의봉(빙글빙글) · 떨어지는 번개 */
export function drawSageShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.look === "staff") {
    const a = tick * 0.4;
    const r = pr.r + 6;
    drawRuyi(ctx, x - Math.cos(a) * r * 1.6, y - Math.sin(a) * r * 1.6, x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6, 4, 0.8);
    return true;
  }
  if (pr.look !== "bolt") return false;
  ctx.strokeStyle = tick % 6 < 3 ? "#fff6a0" : "#9ad8ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 10);
  ctx.lineTo(x + 2, y - 5);
  ctx.lineTo(x - 2, y - 1);
  ctx.lineTo(x + 1, y + 3);
  ctx.stroke();
  return true;
}
