// 리바이어 그림 도구: 고래 모양(긴 유선형 몸 · 턱 주름 · 휜 꼬리지느러미 · 긴 가슴지느러미 · 물빛 테두리) · 물살 꼬리
import { glowHint } from "../glow/glowHints";
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { bubbles, glint } from "./seaLight";

export const DEEP = "#1a4aa8";
export const SEA = "#2a9cff";
export const CYAN = "#6ae8ff";
export const FOAM = "#f0fdff";

/** 고래 하나 (가운데 x·y, 머리 쪽 ang, 몸길이 len, 진하기 a, flap: 꼬리 흔들림 시간) · 왼쪽을 보면 배가 아래로 오게 뒤집음
 *  긴 유선형 몸 · 큰 머리와 턱 주름 · 가늘어지는 꼬리자루 · 넓게 휜 꼬리지느러미 · 긴 가슴지느러미 · 작은 등지느러미 · 등의 흰 얼룩 */
export function whaleShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number, flap: number): void {
  if (a <= 0.01) return;
  const L = len;
  const h = len * 0.3;
  const sw = Math.sin(flap * 0.3) * h * 0.35;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  if (Math.cos(ang) < 0) ctx.scale(1, -1);
  ctx.globalAlpha *= Math.min(1, a);
  // 몸: 둥근 주둥이 → 높은 등 → 가늘어지는 꼬리자루 (꼬리 쪽이 같이 휨) · 아래는 턱이 불룩
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(L * 0.52, h * 0.02);
    ctx.bezierCurveTo(L * 0.52, -h * 0.42, L * 0.36, -h * 0.66, L * 0.12, -h * 0.68);
    ctx.bezierCurveTo(-L * 0.12, -h * 0.66, -L * 0.3, -h * 0.34, -L * 0.42, -h * 0.1 + sw * 0.6);
    ctx.lineTo(-L * 0.44, h * 0.06 + sw * 0.6);
    ctx.bezierCurveTo(-L * 0.3, h * 0.34, -L * 0.05, h * 0.62, L * 0.22, h * 0.62);
    ctx.bezierCurveTo(L * 0.42, h * 0.6, L * 0.52, h * 0.36, L * 0.52, h * 0.02);
    ctx.closePath();
  };
  // 꼬리지느러미: 넓게 휜 두 갈래 (끝이 뾰족, 가운데가 파임) · 위아래로 펄럭
  const fluke = () => {
    const bx = -L * 0.43;
    const by = sw * 0.6 - h * 0.02;
    const tip = sw * 1.3;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.bezierCurveTo(bx - L * 0.06, by - h * 0.3, bx - L * 0.1, by - h * 0.9 + tip, bx - L * 0.2, by - h * 1.05 + tip);
    ctx.bezierCurveTo(bx - L * 0.15, by - h * 0.55 + tip, bx - L * 0.16, by - h * 0.2, bx - L * 0.12, by);
    ctx.bezierCurveTo(bx - L * 0.16, by + h * 0.2, bx - L * 0.15, by + h * 0.55 + tip, bx - L * 0.2, by + h * 1.05 + tip);
    ctx.bezierCurveTo(bx - L * 0.1, by + h * 0.9 + tip, bx - L * 0.06, by + h * 0.3, bx, by);
    ctx.closePath();
  };
  // 몸 뒤 깊은 바다빛 (넓게 번짐)
  additive(ctx, () => glow(ctx, 0, 0, L * 0.8, SEA, 0.3, 0.12));
  // 물빛 테두리 (은은하게)
  additive(ctx, () => {
    if (!glowHint(ctx, 0, 0, L * 1.2, CYAN)) {
      ctx.shadowColor = CYAN;
      ctx.shadowBlur = 8;
    }
    ctx.strokeStyle = alpha(CYAN, 0.55);
    ctx.lineWidth = 2;
    body();
    ctx.stroke();
    fluke();
    ctx.stroke();
    ctx.shadowBlur = 0;
  });
  // 꼬리지느러미 (짙은 남색 → 끝은 밝게)
  const fg = ctx.createLinearGradient(-L * 0.43, 0, -L * 0.64, 0);
  fg.addColorStop(0, "#0c2550");
  fg.addColorStop(1, "#2a62b0");
  ctx.fillStyle = fg;
  fluke();
  ctx.fill();
  // 몸: 등은 짙은 심해색 → 옆구리 바다색 → 배는 옅은 은빛
  const g = ctx.createLinearGradient(0, -h * 0.7, 0, h * 0.65);
  g.addColorStop(0, "#0a1f48");
  g.addColorStop(0.35, "#17468e");
  g.addColorStop(0.6, "#3a86d0");
  g.addColorStop(1, "#cde9f8");
  ctx.fillStyle = g;
  body();
  ctx.fill();
  ctx.save();
  body();
  ctx.clip();
  // 배: 턱에서 배꼽까지 이어지는 흰 주름 줄 (긴 곡선)
  ctx.fillStyle = alpha("#e8f6ff", 0.75);
  ctx.beginPath();
  ctx.ellipse(L * 0.16, h * 0.5, L * 0.36, h * 0.2, 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = alpha("#6a9cc8", 0.85);
  ctx.lineWidth = Math.max(0.6, L * 0.008);
  for (let k = 0; k < 6; k++) {
    const yy = h * (0.3 + k * 0.06);
    ctx.beginPath();
    ctx.moveTo(L * 0.48 - k * L * 0.015, yy - h * 0.05);
    ctx.bezierCurveTo(L * 0.3, yy + h * 0.04, L * 0.05, yy + h * 0.05, -L * 0.12, yy - h * 0.02);
    ctx.stroke();
  }
  // 입선: 주둥이에서 눈 아래까지 길게 휨
  ctx.strokeStyle = alpha("#061430", 0.9);
  ctx.lineWidth = Math.max(0.8, L * 0.012);
  ctx.beginPath();
  ctx.moveTo(L * 0.51, h * 0.1);
  ctx.quadraticCurveTo(L * 0.36, h * 0.26, L * 0.2, h * 0.16);
  ctx.stroke();
  // 등의 흰 얼룩·따개비 (늘 같은 자리)
  for (let k = 0; k < 9; k++) {
    const u = 0.4 - rnd(k, 3) * 0.75;
    const v = -0.55 + rnd(3, k) * 0.45;
    ctx.fillStyle = alpha(k % 3 ? "#9cc4ec" : "#e8f4ff", 0.55);
    ctx.beginPath();
    ctx.ellipse(u * L, v * h, Math.max(0.8, L * (0.01 + rnd(k, 7) * 0.012)), Math.max(0.6, L * 0.008), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // 등을 따라 흐르는 빛 (반짝이는 피부)
  const sh = ctx.createLinearGradient(0, -h * 0.7, 0, -h * 0.2);
  sh.addColorStop(0, alpha("#bfe6ff", 0.55));
  sh.addColorStop(1, alpha("#bfe6ff", 0));
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.ellipse(L * 0.1, -h * 0.5, L * 0.32, h * 0.12, -0.05, 0, Math.PI * 2);
  ctx.fill();
  // 물속 햇빛 무늬 (등 위로 일렁임)
  additive(ctx, () => {
    ctx.strokeStyle = alpha("#bff4ff", 0.3);
    ctx.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      for (let u = -0.4; u <= 0.5; u += 0.06) ctx.lineTo(u * L, -h * (0.5 - k * 0.14) + Math.sin(u * 16 + flap * 0.2 + k * 1.3) * h * 0.06);
      ctx.stroke();
    }
  });
  ctx.restore();
  // 작은 등지느러미 (꼬리 쪽 등 위)
  ctx.fillStyle = "#0c2550";
  ctx.beginPath();
  ctx.moveTo(-L * 0.14, -h * 0.5);
  ctx.quadraticCurveTo(-L * 0.2, -h * 0.72, -L * 0.25, -h * 0.74 + sw * 0.2);
  ctx.quadraticCurveTo(-L * 0.22, -h * 0.5, -L * 0.24, -h * 0.4);
  ctx.closePath();
  ctx.fill();
  // 긴 가슴지느러미 (아래 뒤로 길게 뻗음, 가장자리 울퉁불퉁 · 아래는 흰빛)
  const pf = sw * 0.25;
  const fin = new Path2D();
  fin.moveTo(L * 0.18, h * 0.4);
  fin.bezierCurveTo(L * 0.12, h * 0.9, L * 0.0, h * 1.25 + pf, -L * 0.16, h * 1.42 + pf);
  fin.bezierCurveTo(-L * 0.05, h * 1.12 + pf, L * 0.04, h * 0.78, L * 0.08, h * 0.42);
  fin.closePath();
  const pg = ctx.createLinearGradient(L * 0.15, h * 0.4, -L * 0.15, h * 1.4);
  pg.addColorStop(0, "#14407e");
  pg.addColorStop(1, "#d8eeff");
  ctx.fillStyle = pg;
  ctx.fill(fin);
  ctx.fillStyle = alpha("#e8f6ff", 0.8);
  for (let k = 1; k <= 4; k++) {
    const u = k / 5;
    ctx.beginPath();
    ctx.arc(L * (0.12 - u * 0.25), h * (0.55 + u * 0.85) + pf * u, Math.max(0.6, L * 0.01), 0, Math.PI * 2);
    ctx.fill();
  }
  // 눈: 입선 끝 위 작은 눈 (어두운 눈동자 + 빛)
  const ex = L * 0.2;
  const ey = h * 0.04;
  const er = Math.max(1, L * 0.022);
  ctx.fillStyle = "#e8f4ff";
  ctx.beginPath();
  ctx.arc(ex, ey, er * 1.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#040c20";
  ctx.beginPath();
  ctx.arc(ex + er * 0.2, ey, er, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(ex + er * 0.1), Math.round(ey - er * 0.6), 1, 1);
  // 등 위 반짝임 (깜빡임)
  const tw = Math.sin(flap * 0.25) * 0.5 + 0.5;
  glint(ctx, L * 0.15, -h * 0.6, 2 + tw * Math.min(5, L * 0.07), FOAM, 0.45 + tw * 0.5);
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
  bubbles(ctx, x - dx * len, y - dy * len, len * 0.5, (seed % 30) / 30, seed, 5, a);
}

/** 물살 탄 (머리 x·y, 나는 쪽 dx·dy, seed·t: 흔들림): 일렁이며 가늘어지는 물줄기 + 거품 머리 + 흩날리는 물방울 */
export function waterJet(ctx: Ctx, x: number, y: number, dx: number, dy: number, seed: number, t: number, len = 22): void {
  const nx = -dy;
  const ny = dx;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10;
    const wob = Math.sin(u * 7 - t * 0.7 + seed) * 2.2 * u;
    pts.push([x - dx * len * u + nx * wob, y - dy * len * u + ny * wob, 4.2 * (1 - u) ** 0.8 + 0.4]);
  }
  const ribbon = (k: number) => {
    ctx.beginPath();
    pts.forEach(([px, py, w]) => ctx.lineTo(px + nx * w * k, py + ny * w * k));
    for (let i = pts.length - 1; i >= 0; i--) {
      const [px, py, w] = pts[i]!;
      ctx.lineTo(px - nx * w * k, py - ny * w * k);
    }
    ctx.closePath();
  };
  const g = ctx.createLinearGradient(x, y, x - dx * len, y - dy * len);
  g.addColorStop(0, alpha(CYAN, 0.95));
  g.addColorStop(0.5, alpha(SEA, 0.6));
  g.addColorStop(1, alpha(SEA, 0));
  additive(ctx, () => glow(ctx, x - dx * 4, y - dy * 4, 10, CYAN, 0.45, 0.4));
  ctx.fillStyle = g;
  ribbon(1);
  ctx.fill();
  // 가운데 흰 물결 줄 (머리 쪽만 진하게)
  const w2 = ctx.createLinearGradient(x, y, x - dx * len * 0.7, y - dy * len * 0.7);
  w2.addColorStop(0, alpha(FOAM, 0.95));
  w2.addColorStop(1, alpha(FOAM, 0));
  ctx.fillStyle = w2;
  ribbon(0.35);
  ctx.fill();
  // 거품 머리: 둥근 물방울 + 앞쪽으로 말리는 물보라 두 갈래
  ctx.fillStyle = FOAM;
  ctx.beginPath();
  ctx.ellipse(x, y, 3.2, 2.4, Math.atan2(dy, dx), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = alpha(FOAM, 0.8);
  ctx.lineWidth = 1;
  for (const k of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + nx * k * 2, y + ny * k * 2);
    ctx.quadraticCurveTo(x - dx * 3 + nx * k * 6, y - dy * 3 + ny * k * 6, x - dx * 7 + nx * k * 5, y - dy * 7 + ny * k * 5);
    ctx.stroke();
  }
  // 흩날리는 물방울 (뒤로 흘러감)
  for (let k = 0; k < 5; k++) {
    const u = ((t * 0.08 + rnd(seed, k)) % 1) * 0.9 + 0.1;
    const off = (rnd(k, seed) - 0.5) * 9 * u;
    ctx.fillStyle = alpha(k % 2 ? FOAM : CYAN, 1 - u);
    ctx.fillRect(Math.round(x - dx * len * u + nx * off), Math.round(y - dy * len * u + ny * off), k % 3 ? 1 : 2, k % 3 ? 1 : 2);
  }
  glint(ctx, x, y, 3, "#ffffff", 0.9);
}
