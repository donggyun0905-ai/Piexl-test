// 제우스 그리기: 폭풍 구름 · 감전된 적의 불꽃 · 강림 기운 · 천벌 게이지 / 탄: 번개창 · 독수리 · 구전
// 효과: 벼락 · 번개 줄기 · 과부하 · 강림 · 아이기스 · 천둥 파동 · 벼락창
import { zeusWrath, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const BOLT = "#8ac8ff";
const GOLD = "#ffd040";

/** 번개 지그재그 (seed로 모양이 정해짐) */
function zig(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number, seed: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  const n = 7;
  for (let i = 1; i < n; i++) {
    const k = i / n;
    const off = ((((seed * 31 + i * 17) % 11) + 11) % 11) - 5;
    ctx.lineTo(x0 + (x1 - x0) * k + off * 1.1, y0 + (y1 - y0) * k - off * 0.6);
  }
  ctx.lineTo(x1, y1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function bolt(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, seed: number, w = 2): void {
  zig(ctx, x0, y0, x1, y1, BOLT, w + 1.5, seed);
  zig(ctx, x0, y0, x1, y1, "#ffffff", w * 0.5, seed);
}
function cloud(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.fillStyle = "#5a6278";
  for (const [dx, dy, k] of [[-0.5, 0.1, 0.45], [0, -0.15, 0.55], [0.5, 0.1, 0.45]] as const) {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, r * k, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#8a92a8";
  ctx.fillRect(x - r * 0.4, y - r * 0.4, r * 0.5, 2);
}

export function drawZeusGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "zeus") return;
  for (const c of p.zsClouds ?? []) {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#1a2448";
    ctx.beginPath();
    ctx.ellipse(snap(c.x), snap(c.y), c.r ?? 40, (c.r ?? 40) * 0.5, 0, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawZeusAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "zeus") return;
  for (const c of p.zsClouds ?? []) cloud(ctx, snap(c.x), snap(c.y - 46), 22);
  // 감전된 적: 쌓인 만큼 작은 불꽃이 튐
  for (const e of s.enemies) {
    const n = e.zsShock ?? 0;
    if (!n || e.hp <= 0) continue;
    ctx.fillStyle = n >= 5 ? "#ffffff" : BOLT;
    for (let i = 0; i < n; i++) {
      const a = s.tick * 0.3 + (i * TAU) / n + e.id;
      if ((s.tick + i) % 4 < 2) ctx.fillRect(Math.round(e.x + Math.cos(a) * (e.r + 2)), Math.round(e.y + Math.sin(a) * (e.r + 2)), 1, 1);
    }
  }
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  // 제우스 강림: 금빛 기운 + 몸 둘레 번개
  if (p.zsGod) {
    ctx.globalAlpha = 0.25 + 0.1 * Math.sin(s.tick * 0.3);
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(x, y - 8, 20, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (s.tick % 3 === 0) {
      const a = (s.tick * 1.7) % TAU;
      bolt(ctx, x + Math.cos(a) * 6, y - 10 + Math.sin(a) * 6, x + Math.cos(a) * 22, y - 10 + Math.sin(a) * 18, s.tick, 1);
    }
  }
  // 천벌 게이지 (발밑 하늘색, 가득이면 깜빡)
  const k = p.zsGod ? p.zsGod / 480 : zeusWrath(p);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 9, y + 8, 18, 3);
  ctx.fillStyle = p.zsGod ? GOLD : k > 0.95 && s.tick % 10 < 5 ? "#ffffff" : BOLT;
  ctx.fillRect(x - 8, y + 9, Math.round(16 * k), 1);
}

export function drawZeusShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit === "zsJavelin") {
    const a = Math.atan2(pr.vy, pr.vx);
    bolt(ctx, x - Math.cos(a) * 10, y - Math.sin(a) * 10, x + Math.cos(a) * 5, y + Math.sin(a) * 5, tick, 1);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(x + Math.cos(a) * 5) - 1, Math.round(y + Math.sin(a) * 5) - 1, 2, 2);
    return true;
  }
  if (pr.spirit === "zsEagle") {
    const a = Math.atan2(pr.vy, pr.vx);
    const flap = tick % 8 < 4 ? 5 : 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = "#8a6a4a";
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(-3, -flap - 2);
    ctx.lineTo(-1, 0);
    ctx.lineTo(-3, flap + 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3, -1, 2, 2);
    ctx.fillStyle = GOLD;
    ctx.fillRect(5, 0, 1, 1);
    ctx.restore();
    if (tick % 2) bolt(ctx, x - Math.cos(a) * 10, y - Math.sin(a) * 10, x - Math.cos(a) * 4, y - Math.sin(a) * 4, tick, 0.5);
    return true;
  }
  if (pr.spirit === "zsOrb") {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = BOLT;
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 3 + (tick % 4), 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, pr.r * 0.6, 0, TAU);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const a = tick * 0.4 + i * 2.1;
      zig(ctx, x, y, x + Math.cos(a) * (pr.r + 6), y + Math.sin(a) * (pr.r + 6), BOLT, 1, tick + i);
    }
    return true;
  }
  return false;
}

export function drawZeusFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("zs")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const seed = Math.round(fx.x * 3 + fx.y * 7);
  ctx.globalAlpha = 1 - t;
  switch (fx.kind) {
    case "zsSky":
      if (t < 0.5) bolt(ctx, x + 4, y - 110, x, y, seed, 2.5);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1, r * t), 0, TAU);
      ctx.stroke();
      break;
    case "zsArc":
      bolt(ctx, x, y, snap(fx.toX ?? x), snap(fx.toY ?? y), seed + fx.ticks, r * 0.5 + 0.5);
      break;
    case "zsOverload":
      ctx.fillStyle = "#ff9a3a";
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1, r * t), 0, TAU);
      ctx.fill();
      for (let i = 0; i < 6; i++) bolt(ctx, x, y, x + Math.cos(i) * r, y + Math.sin(i) * r, seed + i, 0.5);
      break;
    case "zsDescend":
      // 하늘이 번쩍이며 벼락이 쏟아짐
      ctx.globalAlpha = (1 - t) * 0.35;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 400, y - 300, 800, 600);
      ctx.globalAlpha = 1 - t;
      for (let i = 0; i < 5; i++) bolt(ctx, x - 160 + i * 80, y - 140, x - 150 + i * 75, y + 60, seed + i, 2);
      break;
    case "zsAegis": {
      const a = Math.atan2(fx.dirY, fx.dirX);
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y - 3, r * (0.5 + t * 0.5), a - 0.9, a + 0.9);
      ctx.stroke();
      bolt(ctx, x, y - 3, x + fx.dirX * r, y - 3 + fx.dirY * r, seed, 1);
      break;
    }
    case "zsClap":
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = i ? "#ffffff" : BOLT;
        ctx.lineWidth = 3 - i * 2;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, r * t - i * 3), 0, TAU);
        ctx.stroke();
      }
      break;
    case "zsSpear":
      bolt(ctx, x, y, snap(fx.toX ?? x), snap(fx.toY ?? y), seed, r * (1 - t) + 1);
      break;
  }
  ctx.globalAlpha = 1;
  return true;
}
