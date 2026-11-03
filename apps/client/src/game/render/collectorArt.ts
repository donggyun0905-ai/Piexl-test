// 수집가 그리기 도구: 무기 그림(sprites/collector_arms) · 빛나는 칼날 초승달(색 → 흰 가장자리, 아래 어두운 잔상, 끝 파편)
// · 찌르기 칼선 · 얼음 가시 · 발톱 · 레이저 · 충격·먼지. render/collector가 무기마다 골라 씀
import { CL_ARM_IDS, type ClArmId } from "@pixel-rogue/shared";
import { alpha, crescent, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const CELL = 48;

const sheet = new Image();
sheet.src = `${import.meta.env.BASE_URL}sprites/collector_arms.png`;

/** 수집 무기 그림 하나 (가운데 x,y · 크기 size · 기울기 rot · 투명도 a) */
export function armSprite(ctx: Ctx, id: string, x: number, y: number, size: number, rot = 0, a = 1): void {
  const i = CL_ARM_IDS.indexOf(id as ClArmId);
  if (i < 0 || !sheet.complete || sheet.naturalWidth === 0 || a <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, i * CELL, 0, CELL, CELL, -size / 2, -size / 2, size, size);
  ctx.restore();
}

/** 기울기: 1 = / 비스듬히 · -1 = \ 비스듬히 · 2 = 위에서 아래로 (세로로 납작) · 0 = 그대로 */
function tiltOf(ctx: Ctx, style: number): void {
  if (style === 1) {
    ctx.rotate(-0.55);
    ctx.scale(1, 0.5);
  } else if (style === -1) {
    ctx.rotate(0.55);
    ctx.scale(1, 0.5);
  } else if (style === 2) ctx.scale(0.55, 1);
}

/** 빛나는 칼날 초승달: 0~0.35 동안 머리가 휘둘러 나가고 그 뒤 옅어짐 (a 방향 · half 반각 · thick 두께) */
export function bladeArc(ctx: Ctx, x: number, y: number, r: number, a: number, half: number, thick: number, color: string, t: number, style = 0): void {
  const sweep = Math.min(1, t / 0.35);
  const fade = t < 0.35 ? 1 : 1 - (t - 0.35) / 0.65;
  const mid = -half + half * sweep;
  const span = Math.max(0.05, half * sweep);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  tiltOf(ctx, style);
  // 아래 어두운 잔상 (조금 늦게 따라옴)
  ctx.globalCompositeOperation = "source-over";
  crescent(ctx, 2, 3, r * 0.96, mid - 0.15, span, thick * 1.1, "#140a24", 0.45 * fade);
  // 바깥 빛 · 본 칼날(색 → 흰 가장자리) · 흰 테두리
  ctx.globalCompositeOperation = "lighter";
  crescent(ctx, 0, 0, r * 1.06, mid, span * 1.04, thick * 1.6, color, 0.3 * fade);
  crescent(ctx, 0, 0, r, mid, span, thick, color, 0.95 * fade);
  ctx.strokeStyle = `rgba(255,255,255,${0.9 * fade})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, r, mid - span * 0.9, mid + span * 0.9);
  ctx.stroke();
  // 칼끝 파편
  const head = mid + span;
  ctx.strokeStyle = alpha(color, fade);
  for (let k = 0; k < 4; k++) {
    const q = head - k * 0.12;
    const rr = r + 3 + k * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(q) * rr, Math.sin(q) * rr);
    ctx.lineTo(Math.cos(q + 0.08) * (rr + 4), Math.sin(q + 0.08) * (rr + 4));
    ctx.stroke();
  }
  ctx.restore();
}

/** 찌르기 칼선: 뾰족하게 뻗는 빛 (아래 어두운 그림자 · 흰 속) */
export function thrustLine(ctx: Ctx, x: number, y: number, a: number, len: number, w: number, color: string, t: number): void {
  const grow = Math.min(1, t / 0.25);
  const fade = t < 0.25 ? 1 : 1 - (t - 0.25) / 0.75;
  const L = len * grow;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  const shape = (ww: number, ox: number, oy: number) => {
    ctx.beginPath();
    ctx.moveTo(4 + ox, -ww + oy);
    ctx.lineTo(L * 0.8 + ox, -ww * 0.6 + oy);
    ctx.lineTo(L + 8 + ox, oy);
    ctx.lineTo(L * 0.8 + ox, ww * 0.6 + oy);
    ctx.lineTo(4 + ox, ww + oy);
    ctx.closePath();
  };
  ctx.fillStyle = `rgba(20,10,36,${0.4 * fade})`;
  shape(w, 1, 3);
  ctx.fill();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = alpha(color, 0.35 * fade);
  shape(w * 1.7, 0, 0);
  ctx.fill();
  const g = ctx.createLinearGradient(0, 0, L + 8, 0);
  g.addColorStop(0, alpha(color, 0));
  g.addColorStop(0.5, alpha(color, 0.9 * fade));
  g.addColorStop(1, `rgba(255,255,255,${fade})`);
  ctx.fillStyle = g;
  shape(w, 0, 0);
  ctx.fill();
  ctx.fillStyle = `rgba(255,255,255,${fade})`;
  shape(Math.max(0.6, w * 0.25), 0, 0);
  ctx.fill();
  ctx.restore();
}

/** 얼음 가시: 둘레에서 솟는 뾰족한 결정 */
export function iceSpikes(ctx: Ctx, x: number, y: number, r: number, color: string, t: number, seed: number): void {
  const rise = Math.min(1, t / 0.3);
  const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
  for (let k = 0; k < 9; k++) {
    const q = (k / 9) * Math.PI * 2 + seed;
    const d = r * (0.25 + ((k * 37) % 10) / 14);
    const bx = x + Math.cos(q) * d;
    const by = y + Math.sin(q) * d * 0.6;
    const h = (6 + ((k * 13) % 7)) * rise;
    ctx.fillStyle = alpha(color, 0.85 * fade);
    ctx.beginPath();
    ctx.moveTo(bx - 2.5, by);
    ctx.lineTo(bx + (k % 2 ? 1 : -1), by - h);
    ctx.lineTo(bx + 2.5, by);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${fade})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(bx - 1, by);
    ctx.lineTo(bx + (k % 2 ? 1 : -1), by - h);
    ctx.stroke();
  }
}

/** 발톱 자국 셋 (style 1 / · -1 \) */
export function clawMarks(ctx: Ctx, x: number, y: number, r: number, color: string, t: number, style: number): void {
  const draw = Math.min(1, t / 0.3);
  const fade = t < 0.4 ? 1 : 1 - (t - 0.4) / 0.6;
  for (let k = -1; k <= 1; k++) {
    const ox = k * 6;
    const x0 = x - r + ox;
    const y0 = y - r * style;
    const x1 = x0 + (2 * r) * draw;
    const y1 = y0 + (2 * r * style) * draw;
    for (const [w, c] of [[5, "rgba(20,8,30,0.55)"], [3, alpha(color, fade)], [1, `rgba(255,220,255,${fade})`]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo((x0 + x1) / 2 + 4 * style, (y0 + y1) / 2 - 4, x1, y1);
      ctx.stroke();
    }
  }
  ctx.lineCap = "butt";
}

/** 레이저: 굵은 빛 + 흰 속 + 시작점 고리 */
export function laser(ctx: Ctx, x: number, y: number, tx: number, ty: number, w: number, color: string, t: number): void {
  const pulse = Math.sin(Math.min(1, t * 1.4) * Math.PI);
  const ww = w * (0.35 + 0.9 * pulse) + 1;
  ctx.lineCap = "round";
  for (const [k, c] of [[2.4, alpha(color, 0.25)], [1.3, alpha(color, 0.85)], [0.45, "rgba(255,255,255,1)"]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = ww * k;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  glow(ctx, x, y, 10 + 6 * pulse, color, 0.9, 1.4);
  ctx.strokeStyle = alpha(color, 0.8 * (1 - t));
  ctx.lineWidth = 1;
  for (const rr of [8, 12]) {
    ctx.beginPath();
    ctx.ellipse(x, y, rr * (0.6 + t), rr * (1 + t * 0.6), Math.atan2(ty - y, tx - x), 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** 땅 먼지·파편 (회색 줄무늬가 옆으로 퍼짐) */
export function dust(ctx: Ctx, x: number, y: number, r: number, t: number, seed: number): void {
  const k = Math.min(1, t * 1.6);
  ctx.fillStyle = `rgba(200,200,210,${0.35 * (1 - t)})`;
  for (let i = 0; i < 8; i++) {
    const side = i % 2 ? 1 : -1;
    const len = (6 + ((i * 7 + seed) % 6)) * (0.5 + k);
    const ox = side * (r * 0.3 + r * 0.8 * k * (0.5 + (i % 4) / 4));
    ctx.fillRect(x + ox - (side < 0 ? len : 0), y + 2 - (i % 3), len, 1.5);
  }
}
