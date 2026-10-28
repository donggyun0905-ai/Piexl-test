// 방랑객 그리기: 무심의 원(바닥의 하늘색 원·도는 칼 눈금, 서 있으면 차오름) · 천검란 게이지 · 초승달 검기 · 칼날 폭풍(초승달 검기 소용돌이)
// 효과: 베기 · 발도 한 줄 · 적 몸의 바늘 같은 일직선 칼선 · 원 대시 · 방 전체 초승달 검기 · 예리함(새 칼빛: 번쩍이는 십자 빛 + 붉은 방울)
import { WANDERER, wandererGauge, zoneRadius, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
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
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function arc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), a0, a1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
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
    ctx.globalAlpha = 0.14 * Math.min(1, z.linger / 10 + 0.3);
    ctx.fillStyle = SKY;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 0.7 * Math.min(1, z.linger / 10 + 0.3);
    arc(ctx, x, y, r, 0, TAU, "#d8f2ff", 1);
    for (let i = 0; i < 12; i++) {
      const a = s.tick * 0.01 + (i * TAU) / 12;
      line(ctx, x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4), x + Math.cos(a) * r, y + Math.sin(a) * r, STEEL, 1);
    }
  } else if (p.weaponId === "wdZone" && p.stillTicks > 6) {
    ctx.globalAlpha = 0.5;
    arc(ctx, snap(p.x), snap(p.y), r * 0.4, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, p.stillTicks / WANDERER.zoneStill), SKY, 1);
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
  // 칼날 폭풍(검기 폭풍): 초승달 검기 여러 겹이 소용돌이치며 둘러쌈 (안쪽은 빠르게, 바깥은 느리게) + 옅은 바람 고리
  const R = pr.r + 5;
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = SKY;
  ctx.beginPath();
  ctx.arc(x, y, R + 2, 0, TAU);
  ctx.fill();
  for (let ring = 0; ring < 3; ring++) {
    const rr = R * (0.45 + ring * 0.3);
    const n = 3 + ring;
    for (let i = 0; i < n; i++) {
      const a = tick * (0.5 - ring * 0.12) + (i * TAU) / n + ring;
      ctx.globalAlpha = 0.9 - ring * 0.2;
      arc(ctx, x, y, rr, a, a + 1.1, ring === 1 ? SKY : "#ffffff", ring === 0 ? 1 : 1.5);
    }
  }
  ctx.globalAlpha = 1;
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
      line(ctx, x, y, tx, ty, fx.tint ?? SKY, r * (1 - t));
      ctx.globalAlpha = 1 - t;
      line(ctx, x, y, tx, ty, "#ffffff", Math.max(1, 2 * (1 - t)));
      break;
    }
    case "wdCut": {
      // 바늘처럼 가는 일직선 칼선: 한순간 쭉 그어지고(삥) 양끝이 뾰족한 빛 + 옅은 하늘빛 + 가는 붉은 자국
      const len = Math.hypot(fx.dirX, fx.dirY) || 1;
      const ux = fx.dirX / len;
      const uy = fx.dirY / len;
      const grow = Math.min(1, t * 5);
      const L = r * 1.4 * grow;
      const w = 1.6 * (1 - t);
      ctx.globalAlpha = (1 - t) * 0.45;
      line(ctx, x - ux * L, y - uy * L, x + ux * L, y + uy * L, SKY, 2.5 * (1 - t) + 0.5);
      ctx.globalAlpha = 1 - t * 0.8;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(x - ux * L, y - uy * L);
      ctx.lineTo(x - uy * w, y + ux * w);
      ctx.lineTo(x + ux * L, y + uy * L);
      ctx.lineTo(x + uy * w, y - ux * w);
      ctx.closePath();
      ctx.fill();
      if (t > 0.3) {
        ctx.globalAlpha = (1 - t) * 0.8;
        line(ctx, x - ux * L * 0.5 + 1, y - uy * L * 0.5 + 1, x + ux * L * 0.5 + 1, y + uy * L * 0.5 + 1, RED, 0.6);
      }
      break;
    }
    case "wdPull": {
      ctx.globalAlpha = 1 - t;
      arc(ctx, x, y, r * (1 - t * 0.5), 0, TAU, SKY, 2);
      arc(ctx, x, y, r * (1 - t * 0.5) - 3, 0, TAU, "#ffffff", 1);
      break;
    }
    case "wdTempest": {
      // 방 전체 곳곳에 하얀 초승달 검기가 차례로 그어짐 (위치·기울기는 효과마다 조금씩 다름)
      const seed = Math.round(fx.x * 7 + fx.y * 13);
      for (let i = 0; i < 26; i++) {
        const k = (seed + i * 97) % 997;
        const ox = ((k * 73) % 440) - 220;
        const oy = ((k * 131) % 280) - 140;
        const start = (i % 6) * 0.08;
        const lt = Math.max(0, Math.min(1, (t - start) / 0.55));
        if (lt <= 0 || lt >= 1) continue;
        const a = (k % 628) / 100;
        const cr = 10 + (k % 9);
        ctx.globalAlpha = (1 - lt) * 0.9;
        arc(ctx, x + ox, y + oy, cr, a, a + 0.6 + lt * 1.6, "#ffffff", 2 * (1 - lt) + 0.6);
        ctx.globalAlpha = (1 - lt) * 0.4;
        arc(ctx, x + ox, y + oy, cr - 2, a, a + 0.4 + lt * 1.6, SKY, 2);
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
