// 운명의 여행자 그리기: 바닥(화살비·운석·바위·목마 떨어질 자리) · 머리 위 모래시계·주사위·시위 당김 · 운명이 바뀌면 이름 세 줄
// 탄: 운명의 화살 · 거대한 마력 화살 · 번개 화살 · 물결 · 배 · 창 · 망령 (효과는 voyagerFx)
import { voyagerCharge, voyagerGlass, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const GOLD = "#e8b040";
const GOLD_L = "#ffe08a";
const SAND = "#e8c878";
const SKY = "#c8e8ff";
const PIPS: Record<number, [number, number][]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]] };

/** 운명 이름 (버프 0 · 기술 1 · 능력 2) */
export type FateName = (part: 0 | 1 | 2, i: number) => string;

/** 주사위 하나 (가운데 x, y · 눈 n) */
function die(ctx: Ctx, x: number, y: number, n: number): void {
  ctx.fillStyle = "#2a1e3a";
  ctx.fillRect(x - 4, y - 4, 9, 9);
  ctx.fillStyle = "#f2ecdc";
  ctx.fillRect(x - 3, y - 3, 7, 7);
  ctx.fillStyle = n === 1 ? "#d83a3a" : "#2a1e3a";
  for (const [dx, dy] of PIPS[n] ?? []) ctx.fillRect(x + dx * 2, y + dy * 2, 1, 1);
}

/** 바닥: 떨어질 자리 (점점 진해지는 원) */
export function drawVoyagerGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "voyager") return;
  for (const m of p.vyMarks ?? []) {
    const k = 1 - Math.min(1, m.t / 60);
    ctx.globalAlpha = 0.2 + k * 0.4;
    ctx.strokeStyle = m.kind === "horse" ? "#c87a3a" : m.kind === "rain" ? GOLD_L : "#ff7a3a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(snap(m.x), snap(m.y), Math.max(1, (m.r ?? 20) * (0.4 + k * 0.6)), 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** 위: 떨어지는 바위·운석 · 머리 위 모래시계와 주사위 · 시위 당김 · 운명 이름 */
export function drawVoyagerAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap, name?: FateName): void {
  const p = s.player;
  if (p.characterId !== "voyager") return;
  for (const m of p.vyMarks ?? []) {
    if (m.kind === "rain" || m.t > 30) continue;
    const x = snap(m.x);
    const y = snap(m.y - m.t * 5);
    ctx.fillStyle = m.kind === "horse" ? "#a8743a" : m.kind === "boulder" ? "#7a7a8a" : "#ff8a3a";
    ctx.beginPath();
    ctx.arc(x, y, m.kind === "meteor" ? 7 : 9, 0, TAU);
    ctx.fill();
  }
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  // 모래시계 (위가 비고 아래가 참, 다 차면 반짝)
  const g = voyagerGlass(p);
  const hx = x - 9;
  const hy = y - 30;
  ctx.fillStyle = "#4a3020";
  ctx.fillRect(hx - 4, hy - 7, 9, 1);
  ctx.fillRect(hx - 4, hy + 7, 9, 1);
  ctx.strokeStyle = SKY;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hx - 3, hy - 6);
  ctx.lineTo(hx + 3, hy - 6);
  ctx.lineTo(hx, hy);
  ctx.closePath();
  ctx.moveTo(hx - 3, hy + 6);
  ctx.lineTo(hx + 3, hy + 6);
  ctx.lineTo(hx, hy);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = g > 0.95 && s.tick % 8 < 4 ? "#ffffff" : SAND;
  const top = Math.round(5 * (1 - g));
  if (top > 0) ctx.fillRect(hx - Math.ceil(top / 2), hy - 1 - top, top, top);
  const bot = Math.round(5 * g);
  if (bot > 0) ctx.fillRect(hx - Math.ceil(bot / 2), hy + 6 - bot, bot, bot);
  if (s.tick % 6 < 3 && g < 1) ctx.fillRect(hx, hy, 1, 3);
  // 주사위 (뒤집힌 직후엔 굴러가는 눈)
  const flip = s.effects.find((e) => e.kind === "vyFlip");
  const rolling = flip && flip.maxTicks - flip.ticks < 30;
  (p.vyFate?.dice ?? []).forEach((d, i) => die(ctx, x + 2 + i * 11, y - 30, rolling ? 1 + ((s.tick >> 2) + i * 3) % 6 : d));
  // 시위 당김: 발밑 금빛 고리가 차오름
  const c = voyagerCharge(p, p.stats.attackSpeed);
  if (c > 0) {
    ctx.strokeStyle = c >= 1 ? "#ffffff" : GOLD;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y - 4, 13, -Math.PI / 2, -Math.PI / 2 + TAU * c);
    ctx.stroke();
  }
  // 운명 이름 세 줄 (뒤집힌 뒤 2.5초)
  if (!flip || !name || rolling || !p.vyFate) return;
  const t = flip.ticks / flip.maxTicks;
  ctx.globalAlpha = Math.min(1, t * 4);
  ctx.textAlign = "center";
  ctx.font = "bold 8px sans-serif";
  const colors = ["#ff9a6a", GOLD_L, "#8ad8ff"];
  for (let k = 0; k < 3; k++) {
    const text = name(k as 0 | 1 | 2, p.vyFate.i);
    const ty = y - 62 + k * 10;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#140a0a";
    ctx.strokeText(text, x, ty);
    ctx.fillStyle = colors[k]!;
    ctx.fillText(text, x, ty);
  }
  ctx.globalAlpha = 1;
}

/** 화살 (방향 a, 길이 len) */
function arrow(ctx: Ctx, x: number, y: number, a: number, len: number, shaft: string, head: string): void {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  ctx.strokeStyle = shaft;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - dx * len, y - dy * len);
  ctx.lineTo(x + dx * len * 0.6, y + dy * len * 0.6);
  ctx.stroke();
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.moveTo(x + dx * (len * 0.6 + 4), y + dy * (len * 0.6 + 4));
  ctx.lineTo(x + dx * len * 0.6 - dy * 2.5, y + dy * len * 0.6 + dx * 2.5);
  ctx.lineTo(x + dx * len * 0.6 + dy * 2.5, y + dy * len * 0.6 - dx * 2.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x - dx * len) - 1, Math.round(y - dy * len) - 1, 2, 2);
}

export function drawVoyagerShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (!pr.spirit?.startsWith("vy")) return false;
  const a = Math.atan2(pr.vy, pr.vx);
  switch (pr.spirit) {
    case "vyArrow":
      arrow(ctx, x, y, a, 6 + pr.r, "#a87a4a", GOLD_L);
      break;
    case "vyChain":
      arrow(ctx, x, y, a, 7, "#6ab8ff", "#ffffff");
      if (tick % 3 === 0) ctx.fillRect(x + Math.cos(tick) * 3, y + Math.sin(tick) * 3, 1, 1);
      break;
    case "vyMagic":
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.arc(x, y, pr.r + 3, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      arrow(ctx, x, y, a, pr.r * 2, GOLD, "#ffffff");
      break;
    case "vyWave":
      ctx.strokeStyle = "#6ab8ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, pr.r, a - 1.2, a + 1.2);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    case "vyShip": {
      // 돛단배 (가는 쪽을 봄)
      const d = pr.vx >= 0 ? 1 : -1;
      ctx.fillStyle = "#6a4a2a";
      ctx.beginPath();
      ctx.moveTo(x - 14 * d, y);
      ctx.lineTo(x + 16 * d, y);
      ctx.lineTo(x + 10 * d, y + 7);
      ctx.lineTo(x - 11 * d, y + 7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f2ecdc";
      ctx.fillRect(x - 1, y - 18, 2, 18);
      ctx.beginPath();
      ctx.moveTo(x + d, y - 17);
      ctx.lineTo(x + 11 * d, y - 4);
      ctx.lineTo(x + d, y - 4);
      ctx.fill();
      ctx.fillStyle = "#c8e8ff";
      for (let i = 0; i < 3; i++) ctx.fillRect(x - (16 + i * 5) * d, y + 6 - (tick + i) % 3, 2, 1);
      break;
    }
    case "vySpear":
      arrow(ctx, x, y, a, 9, "#8a6a4a", "#c8c8d0");
      break;
    case "vyShade":
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#4a3a6a";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#c8b8ff";
      ctx.fillRect(x - 2, y - 1, 1, 1);
      ctx.fillRect(x + 1, y - 1, 1, 1);
      ctx.globalAlpha = 1;
      break;
    default:
      return false;
  }
  return true;
}
