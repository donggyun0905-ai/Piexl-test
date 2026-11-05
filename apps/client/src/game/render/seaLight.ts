// 탈라시아(토르켄·리바이어) 빛 꾸밈 공용: 반짝이는 별빛 · 퍼지는 빛줄기 · 올라가는 물방울 거품 · 물결 빛무늬 · 물보라 무지개
import { additive, alpha, rnd, type Ctx } from "./pwFxBits";

const TAU = Math.PI * 2;

/** 네 갈래 반짝임 (가운데 x·y, 크기 s): 가로세로 긴 빛 + 대각선 짧은 빛 + 흰 점 */
export function glint(ctx: Ctx, x: number, y: number, s: number, color: string, a: number): void {
  if (a <= 0.02 || s < 1) return;
  additive(ctx, () => {
    ctx.fillStyle = alpha(color, a);
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.16, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s * 0.16, y);
    ctx.closePath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x, y + s * 0.16);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x, y - s * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = alpha(color, a * 0.5);
    ctx.lineWidth = 1;
    const d = s * 0.45;
    ctx.beginPath();
    ctx.moveTo(x - d, y - d);
    ctx.lineTo(x + d, y + d);
    ctx.moveTo(x + d, y - d);
    ctx.lineTo(x - d, y + d);
    ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a)})`;
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  });
}

/** 둘레에 흩어진 반짝임 n개 (깜빡임: tick으로 저마다 다르게) */
export function glints(ctx: Ctx, x: number, y: number, r: number, n: number, tick: number, seed: number, color: string, a: number): void {
  for (let k = 0; k < n; k++) {
    const tw = Math.sin(tick * 0.3 + k * 2.1 + seed) * 0.5 + 0.5;
    if (tw < 0.35) continue;
    const ang = rnd(seed, k) * TAU;
    const d = r * (0.3 + rnd(k, seed) * 0.7);
    glint(ctx, x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.6, 2 + tw * 3, color, a * tw);
  }
}

/** 퍼지는 빛줄기 (가운데에서 n갈래, 길이 r, 끝으로 갈수록 흐림) */
export function rays(ctx: Ctx, x: number, y: number, r: number, n: number, a: number, seed: number, color: string, spin = 0): void {
  if (a <= 0.02) return;
  additive(ctx, () => {
    for (let k = 0; k < n; k++) {
      const ang = (k / n) * TAU + rnd(seed, k) * 0.4 + spin;
      const len = r * (0.6 + rnd(k, seed) * 0.5);
      const w = 0.08 + rnd(seed, k + 9) * 0.06;
      const ex = x + Math.cos(ang) * len;
      const ey = y + Math.sin(ang) * len * 0.7;
      const g = ctx.createLinearGradient(x, y, ex, ey);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(0.3, alpha(color, a * 0.7));
      g.addColorStop(1, alpha(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang - w) * len, y + Math.sin(ang - w) * len * 0.7);
      ctx.lineTo(x + Math.cos(ang + w) * len, y + Math.sin(ang + w) * len * 0.7);
      ctx.closePath();
      ctx.fill();
    }
  });
}

/** 올라가는 거품 (f: 0~1 진행): 속이 빈 작은 동그라미 + 반짝 점 */
export function bubbles(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 6, a = 1): void {
  ctx.lineWidth = 1;
  for (let k = 0; k < n; k++) {
    const u = (f + rnd(seed, k)) % 1;
    const bx = x + (rnd(k, seed) - 0.5) * r * 2 + Math.sin(u * 6 + k) * 2;
    const by = y - u * r * 1.2;
    const br = 1 + rnd(seed, k + 3) * 2;
    const fa = a * (1 - u);
    ctx.strokeStyle = alpha("#c8f6ff", fa * 0.9);
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = alpha("#ffffff", fa);
    ctx.fillRect(Math.round(bx - br * 0.5), Math.round(by - br * 0.5), 1, 1);
  }
}

/** 물결 빛무늬 (물속에 비친 햇빛처럼 일렁이는 밝은 줄, 타원 안) */
export function caustic(ctx: Ctx, x: number, y: number, r: number, tick: number, a: number): void {
  if (a <= 0.02) return;
  additive(ctx, () => {
    ctx.strokeStyle = alpha("#bff4ff", a);
    ctx.lineWidth = 1;
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      for (let u = -1; u <= 1.001; u += 0.2) {
        const px = x + u * r * (0.9 - k * 0.15);
        const py = y + (k - 1.5) * r * 0.22 + Math.sin(u * 5 + tick * 0.15 + k * 1.7) * r * 0.08;
        if (u === -1) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  });
}

/** 물보라 무지개 (위로 볼록한 일곱 빛 띠, 진하기 a) */
export function rainbow(ctx: Ctx, x: number, y: number, r: number, a: number): void {
  if (a <= 0.02) return;
  const cols = ["#ff6a6a", "#ffb04a", "#ffee6a", "#6aff8a", "#6ad8ff", "#6a8aff", "#c07aff"];
  additive(ctx, () => {
    ctx.lineWidth = 1.5;
    cols.forEach((c, k) => {
      ctx.strokeStyle = alpha(c, a * 0.45);
      ctx.beginPath();
      ctx.ellipse(x, y, r - k * 1.5, (r - k * 1.5) * 0.55, 0, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    });
  });
}
