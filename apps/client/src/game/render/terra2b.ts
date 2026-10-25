// 테라코어 시즌 2 그리기 (둘째): 붐버 날아가는 폭탄(포물선·그림자)·지뢰·불바다·폭발(예술 연쇄가 쌓일수록 크고 화려)·로켓·파편
// 아티팩터 푸른 반발탄·반발 고리·총구 섬광·제작(톱니 빛·숨겨진 아이템은 금빛) · 옆의 제작 게이지
import { artifacterGauge, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const FIRE = "#ff6a2a";
const SPARK = "#ffd040";
const BLUE = "#4a9aff";
const GLOW = "#a8e0ff";

/** 탄: 로켓(연기 꼬리) · 파편 · 반발탄 */
export function drawTerraShotB(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  if (pr.spirit === "bmRocket") {
    for (let i = 1; i <= 4; i++) {
      ctx.globalAlpha = 0.45 - i * 0.08;
      ctx.fillStyle = i < 2 ? SPARK : "#b8bcc4";
      ctx.fillRect(Math.round(x - dx * (4 + i * 3)) - 1, Math.round(y - dy * (4 + i * 3)) - 1, 2 + (i >> 1), 2 + (i >> 1));
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
  if (pr.spirit === "afBlast") {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(x - dx * 4, y - dy * 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = GLOW;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
    return true;
  }
  return false;
}

function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.stroke();
}

/** 효과: 폭발 · 반발 고리 · 총구 섬광 · 제작 */
export function drawTerraFxB(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "bmBoom": {
      // 섬광 → 불덩이 → 연기, 겉의 충격파 고리 (예술 연쇄 칸만큼 불티가 늘어남)
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
      break;
    }
    case "afBlast":
      ctx.globalAlpha = 1 - t;
      ring(ctx, x, y, fx.size * (0.4 + t * 0.8), fx.width ? "#c87aff" : BLUE, 2);
      ring(ctx, x, y, fx.size * (0.2 + t * 0.6), GLOW, 1);
      break;
    case "afMuzzle":
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = GLOW;
      ctx.beginPath();
      ctx.arc(x, y, 3 * (1 - t) + 1, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "afCraft": {
      // 머리 위로 떠오르는 빛나는 톱니 + 흩어지는 빛 (숨겨진 아이템은 크고 금빛)
      const c = fx.tint ?? BLUE;
      const yy = y - t * 12;
      ctx.globalAlpha = 1 - Math.max(0, t - 0.6) * 2.5;
      ring(ctx, x, yy, fx.size * 0.3, c, 2);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + t * 3;
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x + Math.cos(a) * fx.size * 0.42) - 1, Math.round(yy + Math.sin(a) * fx.size * 0.42) - 1, 2, 2);
      }
      for (let i = 0; i < 10; i++) {
        const a = i * 2.39;
        ctx.fillStyle = i % 2 ? "#ffffff" : c;
        ctx.fillRect(Math.round(x + Math.cos(a) * fx.size * t), Math.round(yy + Math.sin(a) * fx.size * t), 1, 1);
      }
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 바닥: 지뢰(빨간 불이 깜빡) · 불바다 · 날아가는 폭탄의 그림자 */
export function drawTerraGroundB(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  for (const m of p.bmMines ?? []) {
    ctx.fillStyle = "#4a4a3a";
    ctx.fillRect(snap(m.x) - 3, snap(m.y) - 1, 6, 3);
    ctx.fillStyle = s.tick % 30 < 15 ? "#ff2a3a" : "#6a1a1a";
    ctx.fillRect(snap(m.x), snap(m.y) - 2, 1, 1);
  }
  for (const f of p.bmFires ?? []) {
    const k = Math.min(1, f.t / 40);
    for (let i = 0; i < 7; i++) {
      const a = i * 0.9 + s.tick * 0.02;
      ctx.globalAlpha = 0.7 * k;
      ctx.fillStyle = (s.tick + i * 5) % 8 < 4 ? FIRE : SPARK;
      ctx.fillRect(Math.round(f.x + Math.cos(a) * 14 * ((i % 3) / 3 + 0.3)), Math.round(f.y + Math.sin(a) * 8 * ((i % 3) / 3 + 0.3) - ((s.tick + i * 3) % 5)), 2, 3);
    }
  }
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#000000";
  for (const b of p.bmBombs ?? []) {
    const k = 1 - b.t / b.max;
    ctx.beginPath();
    ctx.ellipse(lerp(b.sx, b.x, k), lerp(b.sy, b.y, k) + 3, 3, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** 공중: 포물선으로 날아가는 폭탄 (도화선 불티) · 아티팩터 팔의 문신 빛 · 제작 게이지 */
export function drawTerraAuraB(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const b of p.bmBombs ?? []) {
    const k = 1 - b.t / b.max;
    const bx = lerp(b.sx, b.x, k);
    const by = lerp(b.sy, b.y, k) - Math.sin(k * Math.PI) * Math.min(30, b.max * 0.8);
    if (b.after || b.echo) continue;
    ctx.fillStyle = b.tint ?? "#2a2a34";
    ctx.beginPath();
    ctx.arc(snap(bx), snap(by), b.small ? 1.5 : b.mode === "mega" ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = s.tick % 4 < 2 ? SPARK : FIRE;
    ctx.fillRect(snap(bx) + 2, snap(by) - 3, 1, 1);
  }
  if (p.characterId !== "artifacter") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  // 팔의 푸른 문신이 숨 쉬듯 빛남
  ctx.globalAlpha = 0.35 + Math.sin(s.tick * 0.12) * 0.25;
  ctx.fillStyle = GLOW;
  ctx.fillRect(x - 6, y - 7, 1, 3);
  ctx.fillRect(x + 5, y - 7, 1, 3);
  ctx.globalAlpha = 1;
  // 오른쪽 옆 세로 제작 게이지 (톱니 점)
  const g = artifacterGauge(p);
  ctx.fillStyle = "rgba(10,10,20,0.7)";
  ctx.fillRect(x + 12, y - 14, 3, 18);
  ctx.fillStyle = BLUE;
  const h = Math.round(16 * g);
  ctx.fillRect(x + 13, y + 3 - h, 1, h);
  ctx.fillStyle = GLOW;
  ctx.fillRect(x + 12, y - 16, 3, 1);
}
