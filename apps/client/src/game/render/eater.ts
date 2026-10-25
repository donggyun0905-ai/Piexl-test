// 이터 그리기: 이빨 달린 아가리(긴 송곳니·붉은 눈·보랏빛 그림자 테두리) · 그림자 촉수 · 그림자 검기 탄 · 발밑 그림자 웅덩이. 공격 효과는 eaterFx
import type { ProjectileState, RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
export const INK = "#0a060e";
export const VOID = "#2a0a3a";
export const GLOW = "#8a3ad8";
export const RED = "#ff2030";
export const TOOTH = "#f4f0f8";
const BONE = "#b8b0c8";

/** 들쭉날쭉한 늑대 이빨 한 줄 (턱 가장자리 y0, 방향 dir: -1 위턱 · 1 아래턱) */
function fangs(ctx: Ctx, r: number, y0: number, dir: number): void {
  const n = 9;
  for (let i = 0; i < n; i++) {
    const tx = (i / (n - 1) - 0.5) * r * 1.7;
    const canine = i === 1 || i === n - 2;
    const h = r * (canine ? 0.55 : 0.22 + ((i * 7) % 3) * 0.06);
    ctx.fillStyle = TOOTH;
    ctx.beginPath();
    ctx.moveTo(tx - (canine ? 2 : 1.4), y0);
    ctx.lineTo(tx + (canine ? 2 : 1.4), y0);
    ctx.lineTo(tx + 0.3, y0 - dir * h);
    ctx.fill();
    ctx.fillStyle = BONE;
    ctx.fillRect(Math.round(tx), Math.round(y0 - dir * h * 0.5), 1, 1);
  }
}

/** 이빨 달린 아가리 (open: 벌린 정도 0~1, 방향 ang, 크기 r). 보랏빛 테두리 · 붉은 잇몸 · 붉게 빛나는 눈 */
export function maw(ctx: Ctx, x: number, y: number, r: number, ang: number, open: number): void {
  const gap = open * r * 0.7;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  // 그림자 기운 (보랏빛 번짐)
  ctx.globalAlpha *= 0.9;
  ctx.fillStyle = VOID;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.25, r * 0.75 + gap, 0, 0, Math.PI * 2);
  ctx.fill();
  // 입 안 (검붉은 목구멍)
  ctx.fillStyle = "#3a0612";
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.85, Math.max(1, gap), 0, 0, Math.PI * 2);
  ctx.fill();
  for (const side of [-1, 1]) {
    // 위·아래 턱: 검은 턱 + 보랏빛 가장자리
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.ellipse(0, side * (gap + r * 0.28), r, r * 0.42, 0, side < 0 ? Math.PI : 0, side < 0 ? Math.PI * 2 : Math.PI);
    ctx.fill();
    ctx.strokeStyle = GLOW;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, side * (gap + r * 0.28), r, r * 0.42, 0, side < 0 ? Math.PI : 0, side < 0 ? Math.PI * 2 : Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#8a1424";
    ctx.fillRect(-r * 0.85, side * gap - (side < 0 ? 1 : 0), r * 1.7, 1);
    fangs(ctx, r, side * gap, side);
  }
  // 붉게 빛나는 눈 (위턱 위, 길게 째진 눈)
  for (const ex of [-0.45, 0.3]) {
    ctx.fillStyle = "rgba(255,32,48,0.35)";
    ctx.fillRect(r * ex - 1, -gap - r * 0.62, 5, 3);
    ctx.fillStyle = RED;
    ctx.fillRect(r * ex, -gap - r * 0.58, 3, 1);
  }
  ctx.restore();
}

/** 그림자 촉수: (x0,y0)에서 (x1,y1)까지 꿈틀대는 검은 줄기 + 보랏빛 테두리 */
export function tendril(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, wob: number): void {
  const mx = (x0 + x1) / 2 + (y1 - y0) * 0.15 * Math.sin(wob);
  const my = (y0 + y1) / 2 - (x1 - x0) * 0.15 * Math.sin(wob);
  for (const [lw, c] of [[w + 2, VOID], [w, INK]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(mx, my, x1, y1);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
}

/** 탄: 그림자 검기 (검은 초승달 · 보랏빛 번짐 · 붉은 날 · 뒤로 흩어지는 그림자) */
export function drawEaterShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "eaBlade") return false;
  const a = Math.atan2(pr.vy, pr.vx);
  for (const [w, c, off] of [[7, VOID, 4], [4, INK, 3], [1, RED, 1]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x - Math.cos(a) * off, y - Math.sin(a) * off, 8, a - 1.2, a + 1.2);
    ctx.stroke();
  }
  ctx.fillStyle = VOID;
  for (let i = 1; i <= 3; i++) ctx.fillRect(Math.round(x - Math.cos(a) * (7 + i * 4)), Math.round(y - Math.sin(a) * (7 + i * 4) + ((i * 5) % 3) - 1), 2, 2);
  return true;
}

/** 몸 위: 이터 발밑 그림자 웅덩이와 꿈틀대는 작은 촉수 */
export function drawEaterAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "eater") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = VOID;
  ctx.beginPath();
  ctx.ellipse(x, y + p.r, p.r + 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.85;
  for (let i = 0; i < 4; i++) {
    const a = s.tick * 0.04 + i * 1.6;
    const bx = x + Math.cos(a) * (p.r + 3);
    tendril(ctx, bx, y + p.r, bx + Math.cos(a) * 3, y + p.r - 5 - Math.sin(s.tick * 0.1 + i) * 2, 1, s.tick * 0.1 + i);
  }
  ctx.globalAlpha = 1;
}
