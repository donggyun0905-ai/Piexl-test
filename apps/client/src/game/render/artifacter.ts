// 아티팩터 그리기: 푸른 반발탄 · 반발 고리 · 총구 섬광 · 제작 연출 · 팔의 문신 빛 · 옆의 제작 게이지
// 제작: 발밑에 도는 회로 마법진 → 둘레에서 빛 조각이 빨려 들어와 맞물리는 두 톱니 → 번쩍이며 머리 위로 떠오르는 아이템 빛 (숨겨진 아이템은 금빛 빛줄기)
import { artifacterGauge, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const BLUE = "#4a9aff";
const GLOW = "#a8e0ff";
const WHITE = "#ffffff";

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

/** 탄: 반발탄 */
export function drawArtifacterShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "afBlast") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = BLUE;
  ctx.beginPath();
  ctx.arc(x - (pr.vx / len) * 4, y - (pr.vy / len) * 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = GLOW;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = WHITE;
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  return true;
}

/** 톱니 하나 (가운데 x,y · 반경 r · 돌아간 각도 a) */
function gear(ctx: Ctx, x: number, y: number, r: number, a: number, c: string): void {
  ctx.fillStyle = c;
  for (let i = 0; i < 8; i++) {
    const b = a + (i / 8) * Math.PI * 2;
    ctx.fillRect(Math.round(x + Math.cos(b) * r) - 1, Math.round(y + Math.sin(b) * r) - 1, 2, 2);
  }
  ring(ctx, x, y, r - 1, c, 1.5);
  ctx.fillStyle = WHITE;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

/** 제작 연출 (t: 0→1) */
function craft(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const c = fx.tint ?? BLUE;
  const gold = !!fx.width;
  const feetY = y + 10;
  // 1) 발밑 회로 마법진: 두 겹 원 + 도는 눈금 + 네 갈래 회로 선
  const fade = t > 0.8 ? (1 - t) * 5 : Math.min(1, t * 4);
  ctx.globalAlpha = 0.7 * fade;
  ctx.save();
  ctx.translate(x, feetY);
  ctx.scale(1, 0.45);
  ring(ctx, 0, 0, fx.size, c, 1);
  ring(ctx, 0, 0, fx.size * 0.7, GLOW, 1);
  for (let i = 0; i < 12; i++) {
    const b = (i / 12) * Math.PI * 2 + t * 4;
    ctx.fillStyle = i % 3 ? c : WHITE;
    ctx.fillRect(Math.round(Math.cos(b) * fx.size * 0.85) - 1, Math.round(Math.sin(b) * fx.size * 0.85) - 1, 2, 2);
  }
  ctx.strokeStyle = c;
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const b = (i / 4) * Math.PI * 2 - t * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(b) * fx.size * 0.7, Math.sin(b) * fx.size * 0.7);
    ctx.lineTo(Math.cos(b) * fx.size * 0.35, Math.sin(b) * fx.size * 0.35);
    ctx.lineTo(Math.cos(b + 0.4) * fx.size * 0.2, Math.sin(b + 0.4) * fx.size * 0.2);
    ctx.stroke();
  }
  ctx.restore();
  // 2) 둘레에서 빛 조각이 손 위로 빨려 들어옴 (앞쪽 절반)
  if (t < 0.55) {
    const k = t / 0.55;
    for (let i = 0; i < 14; i++) {
      const b = i * 2.39;
      const d = fx.size * 1.3 * (1 - k) * (0.7 + (i % 4) * 0.1);
      ctx.globalAlpha = k;
      ctx.fillStyle = i % 2 ? WHITE : c;
      ctx.fillRect(Math.round(x + Math.cos(b) * d), Math.round(y + Math.sin(b) * d * 0.7), 1, 2);
    }
    // 맞물려 도는 두 톱니
    ctx.globalAlpha = Math.min(1, k * 2);
    gear(ctx, x - 4, y, 4, t * 10, c);
    gear(ctx, x + 4, y - 3, 3, -t * 13, GLOW);
    return;
  }
  // 3) 번쩍 → 아이템 빛이 머리 위로 떠오름 (금빛이면 빛줄기)
  const k = (t - 0.55) / 0.45;
  const yy = y - k * 12;
  if (k < 0.2) {
    ctx.globalAlpha = 1 - k * 5;
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(x, y, 8 + k * 20, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1 - k * 0.7;
  if (gold) {
    for (let i = 0; i < 8; i++) {
      const b = (i / 8) * Math.PI * 2 + k * 2;
      ctx.strokeStyle = i % 2 ? c : "#fff0b0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(b) * 5, yy + Math.sin(b) * 5);
      ctx.lineTo(x + Math.cos(b) * fx.size * 0.9, yy + Math.sin(b) * fx.size * 0.9);
      ctx.stroke();
    }
  }
  // 반짝이는 마름모 (아이템 빛)
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, yy - 6);
  ctx.lineTo(x + 4, yy);
  ctx.lineTo(x, yy + 6);
  ctx.lineTo(x - 4, yy);
  ctx.fill();
  ctx.fillStyle = WHITE;
  ctx.fillRect(Math.round(x) - 1, Math.round(yy) - 3, 2, 4);
  ring(ctx, x, yy, 6 + k * 10, c, 1);
  for (let i = 0; i < 6; i++) {
    const b = i * 1.05 + k * 3;
    ctx.fillStyle = WHITE;
    ctx.fillRect(Math.round(x + Math.cos(b) * (8 + k * 8)), Math.round(yy + Math.sin(b) * (8 + k * 8)), 1, 1);
  }
}

/** 효과: 반발 고리 · 총구 섬광 · 제작 */
export function drawArtifacterFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
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
    case "afCraft":
      craft(ctx, fx, x, y, t);
      break;
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 몸 곁: 팔의 문신 빛 · 오른쪽 옆 세로 제작 게이지 (톱니 점) */
export function drawArtifacterAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "artifacter") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  ctx.globalAlpha = 0.35 + Math.sin(s.tick * 0.12) * 0.25;
  ctx.fillStyle = GLOW;
  ctx.fillRect(x - 6, y - 7, 1, 3);
  ctx.fillRect(x + 5, y - 7, 1, 3);
  ctx.globalAlpha = 1;
  const g = artifacterGauge(p);
  ctx.fillStyle = "rgba(10,10,20,0.7)";
  ctx.fillRect(x + 12, y - 14, 3, 18);
  ctx.fillStyle = BLUE;
  const h = Math.round(16 * g);
  ctx.fillRect(x + 13, y + 3 - h, 1, h);
  ctx.fillStyle = GLOW;
  ctx.fillRect(x + 12, y - 16, 3, 1);
}
