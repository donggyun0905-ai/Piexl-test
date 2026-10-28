// 테라코어 시즌 2 그리기 (둘째): 붐버 날아가는 폭탄(포물선·그림자)·적 몸에 붙은 끈끈이(붙은 수)·유도 지뢰(땅에 박힘 → 눈을 뜨고 달려감)
// 넓은 불바다(화염병처럼 일렁이는 불)·폭발(예술 연쇄가 쌓일수록 크고 화려)·불꽃놀이(별처럼 퍼져 떨어지는 불티)·로켓·파편 · 아티팩터는 render/artifacter
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import { drawArtifacterAura, drawArtifacterFx, drawArtifacterShot } from "./artifacter";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const FIRE = "#ff6a2a";
const SPARK = "#ffd040";
const FLAMES = ["#c82a0a", "#ff6a2a", "#ffa040", "#ffe080"];

/** 탄: 로켓(연기 꼬리) · 파편 · 반발탄 */
export function drawTerraShotB(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  if (pr.spirit === "bmRocket") {
    for (let i = 1; i <= 5; i++) {
      ctx.globalAlpha = 0.5 - i * 0.08;
      ctx.fillStyle = i < 2 ? SPARK : "#b8bcc4";
      const s = 2 + (i >> 1);
      ctx.fillRect(Math.round(x - dx * (4 + i * 3) + Math.sin(tick * 0.6 + i)) - 1, Math.round(y - dy * (4 + i * 3)) - 1, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#d8dce8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - dx * 4, y - dy * 4);
    ctx.lineTo(x + dx * 2, y + dy * 2);
    ctx.stroke();
    ctx.fillStyle = "#e84a4a";
    ctx.fillRect(Math.round(x + dx * 3) - 1, Math.round(y + dy * 3) - 1, 2, 2);
    return true;
  }
  if (pr.spirit === "bmShard") {
    ctx.fillStyle = tick % 4 < 2 ? SPARK : "#c8ccd8";
    ctx.fillRect(Math.round(x) - 1, Math.round(y), 2, 1);
    return true;
  }
  return drawArtifacterShot(ctx, pr, x, y);
}

function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}

/** 폭발: 섬광 → 불덩이 → 연기, 겉의 충격파 고리 (예술 연쇄 칸만큼 불티가 늘어남) */
function blast(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const r = fx.size;
  const art = fx.width ?? 0;
  const core = fx.tint ?? FIRE;
  if (t < 0.15) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = Math.max(0, 1 - t * 1.4);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, r * (0.5 + t * 0.5), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = SPARK;
  ctx.beginPath();
  ctx.arc(x, y, r * (0.3 + t * 0.2) * (1 - t), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = Math.max(0, 0.6 - t * 0.6);
  ctx.fillStyle = "#6a6470";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(x + Math.cos(i * 1.3) * r * 0.5 * t, y + Math.sin(i * 1.3) * r * 0.4 * t - t * 8, r * 0.25 * (0.5 + t), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1 - t;
  ring(ctx, x, y, r * (0.6 + t * 0.7), "#ffe8b0", 1);
  for (let i = 0; i < 4 + art * 2; i++) {
    const a = i * 2.39;
    const d = r * (0.4 + t * 1.1) * (0.7 + (i % 3) * 0.15);
    ctx.fillStyle = i % 2 ? SPARK : core;
    ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 1, 1);
  }
}

/** 불꽃놀이 별: 가운데 섬광 → 사방으로 뻗는 빛줄기(끝이 반짝) → 아래로 처지며 꺼지는 불티 */
function star(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const c = fx.tint ?? SPARK;
  const r = fx.size * 1.4;
  if (t < 0.12) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 3 + t * 30, 0, Math.PI * 2);
    ctx.fill();
  }
  const out = Math.min(1, t * 2.2);
  const drop = Math.max(0, t - 0.35) ** 2 * 26;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const d = r * out * (i % 2 ? 0.75 : 1);
    const ex = x + Math.cos(a) * d;
    const ey = y + Math.sin(a) * d + drop;
    ctx.globalAlpha = Math.max(0, 1 - t * 1.1);
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * d * 0.55, y + Math.sin(a) * d * 0.55 + drop * 0.5);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.fillStyle = (fx.ticks + i) % 4 < 2 ? "#ffffff" : c;
    ctx.fillRect(Math.round(ex) - 1, Math.round(ey) - 1, 2, 2);
    // 꼬리처럼 떨어지는 작은 불티
    if (t > 0.4) {
      ctx.globalAlpha = Math.max(0, 0.8 - t);
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(ex), Math.round(ey + (t - 0.4) * 10), 1, 1);
    }
  }
  ctx.globalAlpha = Math.max(0, 0.5 - t);
  ring(ctx, x, y, r * out * 1.1, c, 1);
}

/** 효과: 폭발 · 불꽃놀이 별 · (아티팩터) */
export function drawTerraFxB(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "bmBoom") blast(ctx, fx, x, y, t);
  else if (fx.kind === "bmStar") star(ctx, fx, x, y, t);
  else return drawArtifacterFx(ctx, fx, snap);
  ctx.globalAlpha = 1;
  return true;
}

/** 유도 지뢰: 잠들면 땅에 반쯤 박힌 원판(빨간 불 깜빡) · 깨어나면 눈을 뜨고 다리를 놀리며 달려감 */
function drawMine(ctx: Ctx, m: { x: number; y: number; run?: number }, tick: number, snap: Snap): void {
  const x = snap(m.x);
  const y = snap(m.y);
  if (m.run === undefined) {
    ctx.fillStyle = "#2a2a24";
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5a5a48";
    ctx.fillRect(x - 3, y - 1, 6, 2);
    ctx.fillStyle = tick % 30 < 15 ? "#ff2a3a" : "#6a1a1a";
    ctx.fillRect(x, y - 2, 1, 1);
    return;
  }
  const hop = Math.abs(Math.sin(tick * 0.5)) * 2;
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 4, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // 다리
  ctx.fillStyle = "#3a3a30";
  ctx.fillRect(x - 3 + (tick % 6 < 3 ? 0 : 1), y - hop, 1, 2);
  ctx.fillRect(x + 2 - (tick % 6 < 3 ? 0 : 1), y - hop, 1, 2);
  // 몸통
  ctx.fillStyle = "#5a5a48";
  ctx.beginPath();
  ctx.arc(x, y - 3 - hop, 4, 0, Math.PI * 2);
  ctx.fill();
  // 성난 두 눈 · 머리 위 불이 빨리 깜빡
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 3, y - 5 - hop, 2, 2);
  ctx.fillRect(x + 1, y - 5 - hop, 2, 2);
  ctx.fillStyle = "#ff2a3a";
  ctx.fillRect(x - 2, y - 4 - hop, 1, 1);
  ctx.fillRect(x + 2, y - 4 - hop, 1, 1);
  ctx.fillStyle = tick % 6 < 3 ? "#ff2a3a" : SPARK;
  ctx.fillRect(x, y - 8 - hop, 1, 2);
}

/** 바닥: 지뢰 · 불바다 · 날아가는 폭탄의 그림자 */
export function drawTerraGroundB(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  for (const m of p.bmMines ?? []) drawMine(ctx, m, s.tick, snap);
  for (const f of p.bmFires ?? []) {
    const k = Math.min(1, f.t / 40);
    // 그을린 바닥 · 일렁이는 불혀
    ctx.globalAlpha = 0.35 * k;
    ctx.fillStyle = "#3a1a0a";
    ctx.beginPath();
    ctx.ellipse(f.x, f.y, 24, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 14; i++) {
      const a = i * 2.39;
      const d = ((i * 7) % 10) / 10;
      const fx = Math.round(f.x + Math.cos(a) * 22 * d);
      const fy = Math.round(f.y + Math.sin(a) * 12 * d);
      const h = 3 + ((s.tick + i * 3) % 6);
      ctx.globalAlpha = 0.85 * k;
      ctx.fillStyle = FLAMES[(Math.floor(s.tick / 4) + i) % 4]!;
      ctx.fillRect(fx - 1, fy - h, 2, h);
      ctx.fillStyle = FLAMES[3]!;
      ctx.fillRect(fx, fy - h - 1, 1, 1);
    }
  }
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#000000";
  for (const b of p.bmBombs ?? []) {
    if (b.stuck) continue;
    const k = 1 - b.t / b.max;
    ctx.beginPath();
    ctx.ellipse(lerp(b.sx, b.x, k), lerp(b.sy, b.y, k) + 3, 3, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** 적 몸에 붙은 끈끈이: 초록 폭탄 · 터질 때가 가까울수록 빨리 깜빡 · 붙은 수 */
function drawStuck(ctx: Ctx, b: { x: number; y: number; t: number; stack?: number }, tick: number, snap: Snap): void {
  const x = snap(b.x) + 3;
  const y = snap(b.y) - 4;
  const n = b.stack ?? 1;
  const blink = b.t < 60 ? 4 : b.t < 150 ? 10 : 24;
  ctx.fillStyle = "#3a8a2a";
  ctx.beginPath();
  ctx.arc(x, y, 2.5 + Math.min(3, n * 0.4), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = tick % blink < blink / 2 ? "#ff2a3a" : "#8aff6a";
  ctx.fillRect(x - 1, y - 1, 2, 2);
  if (n > 1) {
    ctx.font = "bold 6px monospace";
    ctx.fillStyle = "#8aff6a";
    ctx.fillText(`x${n}`, x + 4, y - 2);
  }
}

/** 공중: 포물선으로 날아가는 폭탄 (도화선 불티) · 붙은 끈끈이 · 아티팩터 */
export function drawTerraAuraB(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const b of p.bmBombs ?? []) {
    if (b.after || b.echo) continue;
    if (b.stuck) {
      drawStuck(ctx, b, s.tick, snap);
      continue;
    }
    const k = 1 - b.t / b.max;
    const bx = lerp(b.sx, b.x, k);
    const by = lerp(b.sy, b.y, k) - Math.sin(k * Math.PI) * Math.min(30, b.max * 0.8);
    ctx.fillStyle = b.tint ?? "#2a2a34";
    ctx.beginPath();
    ctx.arc(snap(bx), snap(by), b.small ? 1.5 : b.mode === "mega" ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = s.tick % 4 < 2 ? SPARK : FIRE;
    ctx.fillRect(snap(bx) + 2, snap(by) - 3, 1, 1);
  }
  drawArtifacterAura(ctx, s, alpha, snap);
}
