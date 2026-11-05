// 테일 그림 도구: 물로 된 상어(맑은 물빛 몸 · 흰 배 · 등지느러미 · 꼬리 · 벌어지는 턱과 이빨 · 빛나는 테두리) · 물 위 등지느러미 · 물결 고리
import { glowHint } from "../glow/glowHints";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { glint } from "./seaLight";

export const ABYSS = "#0a3a6a";
export const WATER = "#1ab8e8";
export const AQUA = "#7af4ff";
export const FOAM = "#f2feff";
const TEETH = "#ffffff";

/** 물 상어 하나 (가운데 x·y, 머리 쪽 ang, 몸길이 len, 진하기 a, flap: 꼬리 흔들림 시간, open: 턱 벌림 0~1) · 왼쪽을 보면 배가 아래로 오게 뒤집음 */
export function sharkShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number, flap: number, open = 0): void {
  if (a <= 0.01) return;
  const h = len * 0.3;
  const jaw = open * 0.5;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  if (Math.cos(ang) < 0) ctx.scale(1, -1);
  ctx.globalAlpha *= Math.min(1, a);
  const sw = Math.sin(flap * 0.45) * h * 0.35;
  // 위턱·등 (머리 끝이 뾰족한 어뢰 모양)
  const back = () => {
    ctx.beginPath();
    ctx.moveTo(len * 0.5, -h * jaw * 0.6);
    ctx.quadraticCurveTo(len * 0.36, -h * 0.62, len * 0.02, -h * 0.55);
    ctx.quadraticCurveTo(-len * 0.3, -h * 0.4, -len * 0.44, sw * 0.2);
    ctx.quadraticCurveTo(-len * 0.3, h * 0.35, len * 0.0, h * 0.45);
    ctx.quadraticCurveTo(len * 0.25, h * 0.45, len * 0.32, h * (0.15 + jaw));
    ctx.lineTo(len * 0.34, h * 0.1 * (1 - jaw));
    ctx.closePath();
  };
  // 아래턱 (벌어질수록 아래로)
  const lower = () => {
    ctx.beginPath();
    ctx.moveTo(len * 0.12, h * 0.3);
    ctx.quadraticCurveTo(len * 0.3, h * (0.3 + jaw * 1.2), len * 0.44, h * (0.08 + jaw * 1.1));
    ctx.lineTo(len * 0.3, h * (0.12 + jaw * 0.6));
    ctx.closePath();
  };
  additive(ctx, () => glow(ctx, 0, 0, len * 0.7, WATER, 0.32, 0.15));
  // 꼬리지느러미 (초승달 모양, 펄럭임)
  ctx.fillStyle = alpha(WATER, 0.95);
  ctx.beginPath();
  ctx.moveTo(-len * 0.42, sw * 0.2);
  ctx.quadraticCurveTo(-len * 0.52, -h * 0.4 + sw, -len * 0.66, -h * 1.05 + sw);
  ctx.quadraticCurveTo(-len * 0.58, -h * 0.2 + sw, -len * 0.56, sw * 0.5);
  ctx.quadraticCurveTo(-len * 0.6, h * 0.3 + sw, -len * 0.62, h * 0.72 + sw);
  ctx.quadraticCurveTo(-len * 0.5, h * 0.3 + sw, -len * 0.42, sw * 0.2);
  ctx.fill();
  // 등지느러미 · 가슴지느러미
  ctx.beginPath();
  ctx.moveTo(len * 0.06, -h * 0.52);
  ctx.quadraticCurveTo(-len * 0.02, -h * 1.25, -len * 0.14, -h * 1.3);
  ctx.quadraticCurveTo(-len * 0.08, -h * 0.8, -len * 0.16, -h * 0.45);
  ctx.closePath();
  ctx.moveTo(len * 0.1, h * 0.38);
  ctx.quadraticCurveTo(-len * 0.04, h * 0.95, -len * 0.16, h * 1.05);
  ctx.quadraticCurveTo(-len * 0.06, h * 0.6, -len * 0.08, h * 0.38);
  ctx.closePath();
  ctx.fill();
  // 몸: 위는 깊은 바다 → 가운데 맑은 물빛 → 배는 하얀 거품빛
  const g = ctx.createLinearGradient(0, -h * 0.6, 0, h * 0.5);
  g.addColorStop(0, "#0a5aa8");
  g.addColorStop(0.45, WATER);
  g.addColorStop(0.8, "#bff8ff");
  g.addColorStop(1, FOAM);
  ctx.fillStyle = g;
  back();
  ctx.fill();
  ctx.fillStyle = "#c8faff";
  lower();
  ctx.fill();
  // 입 안 · 이빨 (벌리면 보임)
  if (open > 0.15) {
    ctx.fillStyle = alpha(ABYSS, 0.85);
    ctx.beginPath();
    ctx.moveTo(len * 0.46, -h * jaw * 0.5);
    ctx.lineTo(len * 0.16, h * 0.22);
    ctx.lineTo(len * 0.42, h * (0.08 + jaw * 1.05));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = TEETH;
    for (let k = 0; k < 4; k++) {
      const u = 0.2 + k * 0.07;
      const tx = len * u;
      const top = -h * jaw * 0.5 * ((u - 0.16) / 0.3) + h * 0.2 * (1 - (u - 0.16) / 0.3);
      ctx.beginPath();
      ctx.moveTo(tx, top);
      ctx.lineTo(tx + 1.5, top + 3);
      ctx.lineTo(tx + 3, top);
      ctx.fill();
      const bot = h * (0.22 + jaw * 0.9 * ((u - 0.16) / 0.3));
      ctx.beginPath();
      ctx.moveTo(tx, bot);
      ctx.lineTo(tx + 1.5, bot - 3);
      ctx.lineTo(tx + 3, bot);
      ctx.fill();
    }
  }
  // 아가미 줄 · 눈
  ctx.strokeStyle = alpha(ABYSS, 0.5);
  ctx.lineWidth = 1;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(len * (0.12 - k * 0.05), -h * 0.25);
    ctx.lineTo(len * (0.1 - k * 0.05), h * 0.15);
    ctx.stroke();
  }
  ctx.fillStyle = "#04203a";
  ctx.fillRect(len * 0.3, -h * 0.34, 2, 2);
  ctx.fillStyle = FOAM;
  ctx.fillRect(len * 0.3, -h * 0.36, 1, 1);
  // 빛나는 물빛 테두리 · 등의 햇빛 줄
  additive(ctx, () => {
    if (!glowHint(ctx, 0, 0, len * 1.2, AQUA)) {
      ctx.shadowColor = AQUA;
      ctx.shadowBlur = 8;
    }
    ctx.strokeStyle = alpha(AQUA, 0.85);
    ctx.lineWidth = 1.5;
    back();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = alpha(FOAM, 0.7);
    ctx.beginPath();
    ctx.moveTo(len * 0.36, -h * 0.42);
    ctx.quadraticCurveTo(len * 0.05, -h * 0.5, -len * 0.25, -h * 0.25);
    ctx.stroke();
  });
  glint(ctx, len * 0.2, -h * 0.4, 3, FOAM, 0.8);
  ctx.restore();
}

/** 물 위로 나온 등지느러미 (x·y가 물 높이, 방향 ang으로 가르며 지나감) · 뒤로 V자 물결 */
export function finShape(ctx: Ctx, x: number, y: number, ang: number, s: number, a: number): void {
  if (a <= 0.01) return;
  const dx = Math.cos(ang);
  ctx.save();
  ctx.globalAlpha *= a;
  additive(ctx, () => {
    ctx.strokeStyle = alpha(AQUA, 0.6);
    ctx.lineWidth = 1;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - Math.cos(ang - side * 0.5) * s * 2.2, y - Math.sin(ang - side * 0.5) * s * 1.1);
      ctx.stroke();
    }
  });
  const d = dx >= 0 ? 1 : -1;
  ctx.fillStyle = "#0a6ab8";
  ctx.beginPath();
  ctx.moveTo(x + d * s * 0.5, y);
  ctx.quadraticCurveTo(x + d * s * 0.1, y - s * 0.9, x - d * s * 0.6, y - s * 1.3);
  ctx.quadraticCurveTo(x - d * s * 0.3, y - s * 0.6, x - d * s * 0.5, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = alpha(AQUA, 0.9);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = alpha(FOAM, 0.85);
  ctx.fillRect(x - s * 0.6, y - 0.5, s * 1.2, 1);
  ctx.restore();
}

/** 수면에 퍼지는 물결 고리 (납작한 타원) */
export function ripple(ctx: Ctx, x: number, y: number, r: number, a: number, color = AQUA, w = 1.5): void {
  if (a <= 0.01 || r <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.5);
  ctx.strokeStyle = alpha(color, a);
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** 앞에서 본 커다란 상어 턱 (가운데 x·y, 폭의 절반 w, open: 벌림 0~1) · 위아래 톱니 이빨 · 입 안은 깊은 바다 */
export function jaws(ctx: Ctx, x: number, y: number, w: number, open: number, a: number): void {
  if (a <= 0.01) return;
  const gap = w * 0.9 * open;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.fillStyle = alpha(ABYSS, 0.9);
  ctx.beginPath();
  ctx.ellipse(x, y, w * 0.85, Math.max(1, gap * 0.55 + 1), 0, 0, Math.PI * 2);
  ctx.fill();
  for (const side of [-1, 1]) {
    const jy = y + side * gap * 0.5;
    // 턱 (바깥은 짙은 물빛 · 안쪽은 흰 잇몸 줄)
    ctx.fillStyle = side < 0 ? "#0a6ab8" : "#bff8ff";
    ctx.beginPath();
    ctx.moveTo(x - w, jy);
    ctx.quadraticCurveTo(x, jy + side * w * 0.75, x + w, jy);
    ctx.quadraticCurveTo(x, jy + side * w * 0.3, x - w, jy);
    ctx.fill();
    ctx.strokeStyle = alpha(AQUA, 0.9);
    ctx.lineWidth = 1;
    ctx.stroke();
    // 톱니 이빨 (턱 안쪽 줄을 따라 입 가운데 쪽으로)
    ctx.fillStyle = "#ffffff";
    const n = 7;
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n;
      const tx = x - w + u * w * 2;
      const base = jy + side * w * 0.3 * 4 * u * (1 - u) * 0.5;
      const len = (3 + 2 * Math.sin(u * Math.PI)) * (side < 0 ? 1 : 0.8);
      ctx.beginPath();
      ctx.moveTo(tx - 1.8, base);
      ctx.lineTo(tx, base - side * len);
      ctx.lineTo(tx + 1.8, base);
      ctx.fill();
    }
  }
  ctx.restore();
}
