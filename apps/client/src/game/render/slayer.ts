// 학살자 그리기: 날린 대낫(그림 안의 대낫과 같은 모양) · 검기 · 피의 학살 기운(핏빛 안개·장미 꽃잎) · 머리 위 게이지. 공격 효과는 slayerFx
import { SLAYER, type PlayerState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
export const BLOOD = "#c81e2a";
export const DEEP = "#5a0610";
export const EDGE = "#ff8a9a";

/** 거대한 대낫: (hx,hy) 손에서 ang 쪽으로 긴 자루, 끝에서 옆으로 뻗어 손 쪽으로 휘어 내려오는 큰 날 (k: 크기, side: 날이 뻗는 쪽) */
export function drawScythe(ctx: Ctx, hx: number, hy: number, ang: number, k = 1, side = 1): void {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const nx = -s * side;
  const ny = c * side;
  const tipX = hx + c * 30 * k;
  const tipY = hy + s * 30 * k;
  // 자루 (검붉은 나무 · 끝에 쇠 장식 · 손잡이 피 묻은 띠)
  ctx.lineCap = "round";
  ctx.strokeStyle = "#2a1414";
  ctx.lineWidth = 2.5 * k;
  ctx.beginPath();
  ctx.moveTo(hx - c * 6 * k, hy - s * 6 * k);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.strokeStyle = BLOOD;
  ctx.beginPath();
  ctx.moveTo(hx - c * 1 * k, hy - s * 1 * k);
  ctx.lineTo(hx + c * 3 * k, hy + s * 3 * k);
  ctx.stroke();
  ctx.lineCap = "butt";
  // 날: 자루 끝에서 옆으로 길게 뻗어 손 쪽으로 휘어 내려옴
  const L = 26 * k;
  const p = (a: number, b: number) => [tipX + nx * a - c * b, tipY + ny * a - s * b] as const;
  const end = p(L, L * 0.45);
  const o1 = p(L * 0.55, -L * 0.3);
  const i1 = p(L * 0.5, L * 0.12);
  const base = p(0, 5 * k);
  ctx.fillStyle = "#c8ccd8";
  ctx.beginPath();
  ctx.moveTo(tipX + c * 2 * k, tipY + s * 2 * k);
  ctx.quadraticCurveTo(o1[0], o1[1], end[0], end[1]);
  ctx.quadraticCurveTo(i1[0], i1[1], base[0], base[1]);
  ctx.closePath();
  ctx.fill();
  // 등 쪽 빛 · 날 끝은 핏빛 · 끝에서 떨어지는 핏방울
  ctx.strokeStyle = "#f4f6ff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(tipX + c * 2 * k, tipY + s * 2 * k);
  ctx.quadraticCurveTo(o1[0], o1[1], end[0], end[1]);
  ctx.stroke();
  ctx.strokeStyle = BLOOD;
  ctx.lineWidth = 2 * k;
  ctx.beginPath();
  ctx.moveTo(end[0], end[1]);
  ctx.quadraticCurveTo(i1[0], i1[1], base[0], base[1]);
  ctx.stroke();
  ctx.fillStyle = BLOOD;
  ctx.fillRect(Math.round(end[0]), Math.round(end[1]) + 1, 1, 2);
}

/** 탄: 핏빛 초승달 검기 · 빙글빙글 도는 대낫 */
export function drawSlayerShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit !== "slBlade" && pr.spirit !== "slThrow") return false;
  const a = Math.atan2(pr.vy, pr.vx);
  if (pr.spirit === "slThrow") {
    drawScythe(ctx, x - Math.cos(tick * 0.6) * 12, y - Math.sin(tick * 0.6) * 12, tick * 0.6, 0.6, 1);
    return true;
  }
  // 겹친 초승달: 검붉은 바깥 → 핏빛 → 분홍빛 날 끝, 뒤로 핏방울
  for (const [w, c, r, off] of [[6, DEEP, 10, 4], [4, BLOOD, 10, 3], [1.5, EDGE, 10, 1.5]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x - Math.cos(a) * off, y - Math.sin(a) * off, r, a - 1.25, a + 1.25);
    ctx.stroke();
  }
  ctx.fillStyle = BLOOD;
  for (let i = 1; i <= 3; i++) ctx.fillRect(Math.round(x - Math.cos(a) * (6 + i * 4) + Math.sin(tick + i) * 2), Math.round(y - Math.sin(a) * (6 + i * 4)), 1, 2);
  return true;
}

/** 피의 학살 중: 발밑 핏빛 안개 · 흩날리는 장미 꽃잎 · 오르는 핏방울 */
export function drawSlayerRage(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "slayer" || (p.slRage ?? 0) <= 0) return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  ctx.globalAlpha = 0.35 + Math.sin(s.tick * 0.2) * 0.1;
  ctx.fillStyle = DEEP;
  ctx.beginPath();
  ctx.ellipse(x, y + p.r, p.r + 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = BLOOD;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y + p.r, p.r + 6 + Math.sin(s.tick * 0.3) * 2, 3, 0, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const k = (s.tick * 0.5 + i * 7) % 40;
    const a = i * 0.8 + s.tick * 0.03;
    ctx.globalAlpha = 1 - k / 40;
    ctx.fillStyle = i % 3 === 0 ? EDGE : i % 3 === 1 ? BLOOD : "#ff4a5a";
    ctx.fillRect(Math.round(x + Math.cos(a) * (p.r + 4 + k * 0.2)), Math.round(y + 2 - k * 0.7), i % 2 ? 2 : 1, 1);
  }
  ctx.globalAlpha = 1;
}

/** 머리 위 체력 줄 위: 피의 학살 게이지 (학살 중이면 남은 시간이 깜빡) */
export function drawSlayerGauge(ctx: Ctx, p: PlayerState, x: number, top: number, tick: number): void {
  if (p.characterId !== "slayer") return;
  const w = 16;
  const rage = p.slRage ?? 0;
  const r = rage > 0 ? rage / SLAYER.rageTicks : Math.min(1, (p.slGauge ?? 0) / SLAYER.gaugeMax);
  ctx.fillStyle = "rgba(10,8,16,0.85)";
  ctx.fillRect(x - w / 2 - 1, top - 4, w + 2, 3);
  ctx.fillStyle = rage > 0 ? ((tick >> 2) % 2 ? EDGE : BLOOD) : r >= 1 ? "#ffd8dc" : "#8a1a24";
  ctx.fillRect(x - w / 2, top - 3, Math.round(w * Math.min(1, r)), 1);
}
