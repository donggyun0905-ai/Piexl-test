// 방랑객 그리기: 무심의 원(바닥의 붉은 원·도는 칼 눈금, 서 있으면 차오름) · 천검란 게이지 · 초승달 검기 · 칼날 폭풍
// 효과: 베기 · 발도 한 줄 · 원 안의 적이 베임 · 끌어당김 · 방 전체 칼날 폭풍 · 예리함(새 칼빛: 번쩍이는 십자 빛 + 붉은 방울)
import { WANDERER, wandererGauge, zoneRadius, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const RED = "#e83a4a";
const STEEL = "#e8ecf4";
const SKY = "#a8e0ff";

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}
function arc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), a0, a1);
  ctx.stroke();
}

/** 바닥: 무심의 원 (펼쳐지기 전엔 가만히 선 만큼 차오르는 고리) */
export function drawWandererGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "wanderer") return;
  const r = zoneRadius(p);
  const z = p.wdZone;
  if (z) {
    const x = snap(z.x);
    const y = snap(z.y);
    ctx.globalAlpha = 0.12 * Math.min(1, z.linger / 10 + 0.3);
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 0.7 * Math.min(1, z.linger / 10 + 0.3);
    arc(ctx, x, y, r, 0, TAU, "#ffb0b0", 1);
    for (let i = 0; i < 12; i++) {
      const a = s.tick * 0.01 + (i * TAU) / 12;
      line(ctx, x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4), x + Math.cos(a) * r, y + Math.sin(a) * r, STEEL, 1);
    }
  } else if (p.weaponId === "wdZone" && p.stillTicks > 6) {
    ctx.globalAlpha = 0.5;
    arc(ctx, snap(p.x), snap(p.y), r * 0.4, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, p.stillTicks / WANDERER.zoneStill), "#ffb0b0", 1);
  }
  ctx.globalAlpha = 1;
}

/** 천검란 게이지 (발밑 붉은 막대, 가득이면 깜빡임) */
export function drawWandererAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "wanderer" || p.weaponId !== "wdTempest") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const k = wandererGauge(p);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 9, y + 8, 18, 3);
  ctx.fillStyle = k >= 1 && s.tick % 10 < 5 ? "#ffffff" : RED;
  ctx.fillRect(x - 8, y + 9, Math.round(16 * k), 1);
}

/** 초승달 검기 · 칼날 폭풍 */
export function drawWandererShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit !== "wdWave" && pr.spirit !== "wdStorm") return false;
  if (pr.spirit === "wdWave") {
    const a = Math.atan2(pr.vy, pr.vx);
    ctx.globalAlpha = 0.5;
    arc(ctx, x, y, pr.r + 2, a - 1.3, a + 1.3, SKY, 3);
    ctx.globalAlpha = 1;
    arc(ctx, x, y, pr.r + 2, a - 1.1, a + 1.1, "#ffffff", 1);
    return true;
  }
  // 칼날 폭풍: 도는 칼 네 자루 + 바람 고리
  ctx.globalAlpha = 0.35;
  arc(ctx, x, y, pr.r + 2, 0, TAU, SKY, 2);
  ctx.globalAlpha = 1;
  for (let i = 0; i < 4; i++) {
    const a = tick * 0.4 + (i * TAU) / 4;
    line(ctx, x + Math.cos(a) * 2, y + Math.sin(a) * 2, x + Math.cos(a) * (pr.r + 3), y + Math.sin(a) * (pr.r + 3), STEEL, 1);
  }
  return true;
}

/** 효과 */
export function drawWandererFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("wd")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  const a = Math.atan2(fx.dirY, fx.dirX);
  switch (fx.kind) {
    case "wdSlash": {
      const half = fx.width ? 1.6 : 1.1;
      ctx.globalAlpha = 1 - t;
      arc(ctx, x, y - 2, r * (0.85 + t * 0.15), a - half + t * 0.5, a + half * 0.6 + t * 0.5, "#ffffff", 2);
      ctx.globalAlpha = (1 - t) * 0.5;
      arc(ctx, x, y - 2, r * 0.75, a - half * 0.8 + t * 0.5, a + half * 0.4 + t * 0.5, SKY, 3);
      break;
    }
    case "wdIai": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      ctx.globalAlpha = (1 - t) * 0.5;
      line(ctx, x, y, tx, ty, SKY, r * (1 - t));
      ctx.globalAlpha = 1 - t;
      line(ctx, x, y, tx, ty, "#ffffff", Math.max(1, 2 * (1 - t)));
      break;
    }
    case "wdCut": {
      // 적을 가르는 한 줄 (흰 칼선 + 붉은 자국)
      const dx = fx.dirX * r;
      const dy = fx.dirY * r;
      ctx.globalAlpha = 1 - t;
      line(ctx, x - dx, y - dy, x + dx, y + dy, "#ffffff", 2 * (1 - t) + 0.5);
      ctx.globalAlpha = (1 - t) * 0.7;
      line(ctx, x - dx * 0.6 + 1, y - dy * 0.6 + 1, x + dx * 0.6 + 1, y + dy * 0.6 + 1, RED, 1);
      break;
    }
    case "wdPull": {
      ctx.globalAlpha = 1 - t;
      arc(ctx, x, y, r * (1 - t * 0.7), 0, TAU, "#ffb0b0", 2);
      break;
    }
    case "wdTempest": {
      // 방 전체에 비스듬한 칼선이 쏟아짐
      ctx.globalAlpha = (1 - t) * 0.8;
      for (let i = 0; i < 18; i++) {
        const ox = ((i * 73) % 400) - 200;
        const oy = ((i * 131) % 260) - 130;
        const k = i % 2 ? 1 : -1;
        line(ctx, x + ox - 14, y + oy + 14 * k, x + ox + 14, y + oy - 14 * k, i % 3 ? "#ffffff" : SKY, 1);
      }
      break;
    }
    case "wdSharp": {
      // 예리함: 번쩍이는 네 갈래 칼빛 + 흩어지는 붉은 방울
      const k = 1 - t;
      ctx.globalAlpha = k;
      line(ctx, x - r * k, y - 2, x + r * k, y - 2, "#ffffff", 1);
      line(ctx, x, y - 2 - r * k, x, y - 2 + r * k, "#ffffff", 1);
      line(ctx, x - r * 0.5 * k, y - 2 - r * 0.5 * k, x + r * 0.5 * k, y - 2 + r * 0.5 * k, "#ffd0d0", 1);
      ctx.fillStyle = RED;
      for (let i = 0; i < 5; i++) {
        const b = i * 1.3 + 0.4;
        ctx.fillRect(Math.round(x + Math.cos(b) * r * 0.8 * t), Math.round(y + Math.sin(b) * r * 0.5 * t + t * 4), 1, 1);
      }
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
