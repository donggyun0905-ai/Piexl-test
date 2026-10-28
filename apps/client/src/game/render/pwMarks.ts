// 패왕전 표시: 시작 준비 동안 편 오라(내 편 파랑 · 상대 빨강) · 내 캐릭터 위 큰 화살표 · 바닥 강화 구슬 · 날아가는 얼음 폭탄·터짐 · 얼어붙은 사람
import { PW, type RunState } from "@pixel-rogue/shared";
import { PW_ALLY, PW_FOE } from "./pwLook";

type Ctx = CanvasRenderingContext2D;

/** 화살표가 준비가 끝나고 사라지기까지 */
const ARROW_AFTER = 120;
/** 이번 판 준비가 끝나는 틱 (3판 2선승은 판마다 다시) */
export const readyEnd = (s: RunState): number => s.pvp?.readyAt ?? PW.ready;

/** 발밑 편 오라 (시작 준비 동안): 둥글게 퍼지는 빛 + 위로 오르는 빛 알갱이 */
export function drawPrepAura(ctx: Ctx, s: RunState, x: number, y: number, r: number, ally: boolean): void {
  if (s.tick > readyEnd(s)) return;
  const color = ally ? PW_ALLY : PW_FOE;
  const t = s.tick;
  const R = r + 10 + Math.sin(t / 6) * 2;
  const g = ctx.createRadialGradient(x, y, 2, x, y, R);
  g.addColorStop(0, `${color}00`);
  g.addColorStop(0.6, `${color}55`);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, R, R * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  // 빛 알갱이 6개가 차례로 올라감
  ctx.fillStyle = color;
  for (let k = 0; k < 6; k++) {
    const f = ((t + k * 11) % 40) / 40;
    const a = (k / 6) * Math.PI * 2;
    ctx.globalAlpha = 1 - f;
    ctx.fillRect(Math.round(x + Math.cos(a) * (r + 4)), Math.round(y + r - f * 26), 2, 2);
  }
  ctx.globalAlpha = 1;
}

/** 내 캐릭터 머리 위 큰 초록 화살표 (시작 준비 동안 + 시작 뒤 2초, 끝에 흐려짐) */
export function drawMeArrow(ctx: Ctx, s: RunState, x: number, top: number): void {
  const left = readyEnd(s) + ARROW_AFTER - s.tick;
  if (left <= 0) return;
  ctx.globalAlpha = Math.min(1, left / 40);
  const bob = Math.sin(s.tick / 6) * 2.5;
  const y = top - 10 + bob;
  for (const [col, g] of [["#0a2010", 1.5], ["#5ae86a", 0]] as const) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x - 7 - g, y - 9 - g);
    ctx.lineTo(x + 7 + g, y - 9 - g);
    ctx.lineTo(x, y + g * 1.4);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#c8ffcc";
  ctx.fillRect(x - 4, y - 8, 5, 1);
  ctx.globalAlpha = 1;
}

const ORB_COLOR = ["#5ae86a", "#ffb040", "#5ad8ff"] as const;

/** 바닥 강화 구슬: 회복(초록 십자) · 공격 속도(주황 칼날) · 이동 속도(하늘 날개) */
export function drawOrbs(ctx: Ctx, s: RunState): void {
  for (const o of s.pvp?.orbs ?? []) {
    const bob = Math.sin((s.tick + o.id * 7) / 8) * 1.5;
    const c = ORB_COLOR[o.kind];
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(o.x, o.y + 5, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    const g = ctx.createRadialGradient(o.x, o.y - 2 + bob, 1, o.x, o.y - 2 + bob, 8);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.4, c);
    g.addColorStop(1, `${c}00`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(o.x, o.y - 2 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    const cx = Math.round(o.x);
    const cy = Math.round(o.y - 2 + bob);
    if (o.kind === 0) {
      ctx.fillRect(cx - 2, cy - 0.5, 5, 1.5);
      ctx.fillRect(cx - 0.5, cy - 2, 1.5, 5);
    } else if (o.kind === 1) {
      ctx.fillRect(cx - 2, cy + 1, 1, 1);
      ctx.fillRect(cx - 1, cy, 1, 1);
      ctx.fillRect(cx, cy - 1, 1, 1);
      ctx.fillRect(cx + 1, cy - 2, 1, 1);
    } else {
      ctx.fillRect(cx - 2, cy - 1, 2, 1);
      ctx.fillRect(cx + 1, cy - 1, 2, 1);
      ctx.fillRect(cx - 1, cy, 3, 1);
    }
  }
}

/** 얼음 폭탄: 날아가는 동안 포물선 + 떨어질 자리 표시 · 터지면 얼음 고리와 조각 */
export function drawIce(ctx: Ctx, s: RunState): void {
  for (const b of s.pvp?.ice ?? []) {
    if (b.t > 0) {
      const f = 1 - b.t / PW.iceFly;
      const x = b.x + (b.tx - b.x) * f;
      const y = b.y + (b.ty - b.y) * f - Math.sin(f * Math.PI) * 22;
      ctx.strokeStyle = "rgba(160, 230, 255, 0.6)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(b.tx, b.ty, PW.iceRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#e8faff";
      ctx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 6, 6);
      ctx.fillStyle = "#5ac8ff";
      ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
      continue;
    }
    const f = -b.t / PW.iceShow;
    ctx.globalAlpha = 1 - f;
    ctx.fillStyle = "rgba(170, 235, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(b.tx, b.ty, PW.iceRadius * (0.6 + f * 0.4), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e8faff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = "#e8faff";
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const d = PW.iceRadius * (0.3 + f * 0.9);
      ctx.fillRect(Math.round(b.tx + Math.cos(a) * d) - 1, Math.round(b.ty + Math.sin(a) * d) - 1, 3, 3);
    }
    ctx.globalAlpha = 1;
  }
}

/** 얼어붙은 사람: 몸을 덮는 얼음 덩어리 */
export function drawFrozen(ctx: Ctx, s: RunState, x: number, y: number, r: number, until: number | undefined): void {
  if (until === undefined || until <= s.tick) return;
  const h = r * 2 + 14;
  ctx.fillStyle = "rgba(150, 220, 255, 0.45)";
  ctx.fillRect(x - r - 3, y + r - h, r * 2 + 6, h);
  ctx.strokeStyle = "#e8faff";
  ctx.strokeRect(x - r - 3 + 0.5, y + r - h + 0.5, r * 2 + 5, h - 1);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillRect(x - r - 1, y + r - h + 2, 2, h - 6);
}
