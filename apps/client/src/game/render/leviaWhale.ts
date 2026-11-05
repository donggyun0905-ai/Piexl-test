// 리바이어 그림 도구: 고래 모양(푸른 등 · 흰 배 주름 · 꼬리지느러미 · 눈 · 물빛 테두리) · 바다의 창 모양 · 물살 꼬리
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";

export const DEEP = "#1a4aa8";
export const SEA = "#2a9cff";
export const CYAN = "#6ae8ff";
export const FOAM = "#f0fdff";
const GOLD = "#ffc84a";

/** 고래 하나 (가운데 x·y, 머리 쪽 ang, 몸길이 len, 진하기 a, flap: 꼬리 흔들림 시간) · 왼쪽을 보면 배가 아래로 오게 뒤집음 */
export function whaleShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number, flap: number): void {
  if (a <= 0.01) return;
  const h = len * 0.42;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  if (Math.cos(ang) < 0) ctx.scale(1, -1);
  ctx.globalAlpha *= Math.min(1, a);
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(len * 0.5, h * 0.05);
    ctx.bezierCurveTo(len * 0.48, -h * 0.55, len * 0.05, -h * 0.62, -len * 0.25, -h * 0.28);
    ctx.quadraticCurveTo(-len * 0.4, -h * 0.12, -len * 0.47, 0);
    ctx.quadraticCurveTo(-len * 0.4, h * 0.14, -len * 0.25, h * 0.26);
    ctx.bezierCurveTo(len * 0.05, h * 0.62, len * 0.45, h * 0.5, len * 0.5, h * 0.05);
    ctx.closePath();
  };
  // 빛나는 물빛 테두리
  additive(ctx, () => {
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = alpha(CYAN, 0.8);
    ctx.lineWidth = 3;
    body();
    ctx.stroke();
    ctx.shadowBlur = 0;
  });
  // 꼬리지느러미 (위아래로 펄럭)
  const sw = Math.sin(flap * 0.35) * h * 0.25;
  ctx.fillStyle = DEEP;
  ctx.beginPath();
  ctx.moveTo(-len * 0.44, 0);
  ctx.quadraticCurveTo(-len * 0.56, -h * 0.2 + sw, -len * 0.66, -h * 0.62 + sw);
  ctx.quadraticCurveTo(-len * 0.58, -h * 0.12 + sw, -len * 0.6, sw * 0.3);
  ctx.quadraticCurveTo(-len * 0.58, h * 0.12 + sw, -len * 0.66, h * 0.62 + sw);
  ctx.quadraticCurveTo(-len * 0.56, h * 0.2 + sw, -len * 0.44, 0);
  ctx.fill();
  // 몸: 위는 짙은 바다색 → 아래 하늘색
  const g = ctx.createLinearGradient(0, -h * 0.6, 0, h * 0.6);
  g.addColorStop(0, "#123a8a");
  g.addColorStop(0.45, SEA);
  g.addColorStop(1, "#a8eaff");
  ctx.fillStyle = g;
  body();
  ctx.fill();
  // 흰 배와 주름 줄
  ctx.save();
  body();
  ctx.clip();
  ctx.fillStyle = alpha(FOAM, 0.85);
  ctx.beginPath();
  ctx.ellipse(len * 0.12, h * 0.42, len * 0.34, h * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = alpha("#7ab8e8", 0.9);
  ctx.lineWidth = 1;
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.moveTo(len * 0.42 - k * 2, h * (0.22 + k * 0.07));
    ctx.quadraticCurveTo(len * 0.1, h * (0.3 + k * 0.07), -len * 0.15, h * (0.2 + k * 0.05));
    ctx.stroke();
  }
  // 등 반짝임 · 물방울 무늬
  ctx.fillStyle = alpha("#ffffff", 0.5);
  ctx.beginPath();
  ctx.ellipse(len * 0.12, -h * 0.32, len * 0.2, h * 0.07, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = alpha(CYAN, 0.7);
  for (let k = 0; k < 5; k++) ctx.fillRect(Math.round(-len * 0.2 + k * len * 0.09), Math.round(-h * 0.15 - (k % 2) * 2), 2, 2);
  ctx.restore();
  // 가슴지느러미
  ctx.fillStyle = "#1e5ab8";
  ctx.beginPath();
  ctx.moveTo(len * 0.12, h * 0.3);
  ctx.quadraticCurveTo(len * 0.02, h * 0.75, -len * 0.14, h * 0.82 + sw * 0.4);
  ctx.quadraticCurveTo(-len * 0.02, h * 0.45, len * 0.0, h * 0.28);
  ctx.fill();
  // 눈 (흰자 + 검은 눈동자 + 빛)
  const ex = len * 0.3;
  const ey = -h * 0.02;
  const er = Math.max(1.2, len * 0.035);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ex, ey, er * 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0a1a3a";
  ctx.beginPath();
  ctx.arc(ex + er * 0.3, ey, er, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(ex), Math.round(ey - er * 0.6), 1, 1);
  ctx.restore();
}

/** 고래 뒤 물살 꼬리 (머리 쪽 dx·dy, 길이 len): 흰 거품 줄 + 튀는 물방울 */
export function wake(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, a: number, seed: number): void {
  const nx = -dy;
  const ny = dx;
  ctx.lineCap = "round";
  for (const [c, w, side] of [[alpha(SEA, 0.35 * a), 10, 0], [alpha(CYAN, 0.7 * a), 3, 1], [alpha(CYAN, 0.7 * a), 3, -1], [alpha(FOAM, 0.9 * a), 1.2, 0]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x - dx * len * 0.3, y - dy * len * 0.3);
    ctx.quadraticCurveTo(x - dx * len + nx * side * len * 0.18, y - dy * len + ny * side * len * 0.18, x - dx * len * 1.7 + nx * side * len * 0.3, y - dy * len * 1.7 + ny * side * len * 0.3);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  for (let k = 0; k < 8; k++) {
    const u = 0.4 + rnd(seed, k) * 1.2;
    const off = (rnd(k, seed) - 0.5) * len * 0.6;
    ctx.fillStyle = k % 2 ? alpha(FOAM, a) : alpha(CYAN, a * 0.9);
    ctx.fillRect(Math.round(x - dx * len * u + nx * off), Math.round(y - dy * len * u + ny * off), 2, 2);
  }
}

/** 바다의 창 (손잡이 x·y에서 ang 쪽으로 길이 len): 금빛 자루 · 푸른 수정 창날 · 빛나는 끝 */
export function spearShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.globalAlpha *= a;
  ctx.lineCap = "round";
  for (const [c, w] of [["#5a3a12", 4], [GOLD, 2.4], ["#fff0a0", 0.8]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(len * 0.05, 0);
    ctx.lineTo(len * 0.72, 0);
    ctx.stroke();
  }
  // 창날: 마름모 수정 + 양옆 작은 날
  ctx.fillStyle = SEA;
  ctx.strokeStyle = "#0a2a6a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(len * 0.68, 0);
  ctx.lineTo(len * 0.8, -len * 0.08);
  ctx.lineTo(len * 1.02, 0);
  ctx.lineTo(len * 0.8, len * 0.08);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = FOAM;
  ctx.beginPath();
  ctx.moveTo(len * 0.74, 0);
  ctx.lineTo(len * 0.82, -len * 0.03);
  ctx.lineTo(len * 0.96, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = GOLD;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(len * 0.66, 0);
    ctx.lineTo(len * 0.72, s * len * 0.12);
    ctx.lineTo(len * 0.76, s * len * 0.04);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  additive(ctx, () => glow(ctx, x + Math.cos(ang) * len, y + Math.sin(ang) * len, 10, CYAN, 0.8 * a, 0.9));
}
