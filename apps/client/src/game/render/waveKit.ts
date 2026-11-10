// 웨이브 그림 도구 3: 맑게 빛나는 물 효과 공용 — 원근 물결 고리 · 포물선으로 튀는 물보라 · 물빛 일렁임 · 물안개 · 바다의 보석 · 물의 날개
// (회색으로 보이던 큰 원·막대 물보라·낙서 같은 물결무늬 대신 쓰는 것들)
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { glint } from "./seaLight";
import { WV } from "./waveArt";

const TAU = Math.PI * 2;

/** 바닥에 퍼지는 물결 고리 (원근: 납작한 타원) · 바깥 물빛 번짐 + 흰 물마루 */
export function ripple(ctx: Ctx, x: number, y: number, r: number, a: number, w = 1.5, c = WV.aqua, flat = 0.5): void {
  if (r < 1 || a <= 0.02) return;
  additive(ctx, () => {
    for (const [col, lw, al] of [[c, w * 3.2, 0.22], [c, w * 1.5, 0.55], [WV.foam, w * 0.6, 0.95]] as const) {
      ctx.strokeStyle = alpha(col, al * a);
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * flat, 0, 0, TAU);
      ctx.stroke();
    }
  });
}

/** 물보라: 가운데 번쩍 → 물방울이 포물선으로 튀어 오르고 떨어짐 + 바닥 물결 (f 0~1) */
export function burst(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 14): void {
  const fa = 1 - f;
  if (f < 0.3) additive(ctx, () => glow(ctx, x, y - 2, r * (0.5 + f), WV.sky, (1 - f / 0.3) * 0.9, 0.9));
  ripple(ctx, x, y, r * (0.35 + f * 0.9), fa, 1.2);
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const ang = rnd(seed, i) * TAU;
      const sp = r * (0.45 + rnd(i, seed) * 0.7);
      const up = r * (0.5 + rnd(seed, i + 9) * 0.8);
      const h = up * (4 * f - 4 * f * f);
      const px = x + Math.cos(ang) * sp * f;
      const py = y + Math.sin(ang) * sp * f * 0.5 - h;
      const vy = up * (4 - 8 * f) * 0.08;
      ctx.strokeStyle = alpha(i % 3 ? WV.aqua : WV.foam, fa);
      ctx.lineWidth = i % 4 ? 1.4 : 2.2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - Math.cos(ang) * 1.5, py + vy * 3 + 0.5);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
}

/** 물빛 일렁임: 물속에 비친 햇빛처럼 부드럽게 떠도는 밝은 얼룩 (타원 안) */
export function softLight(ctx: Ctx, x: number, y: number, rx: number, ry: number, tick: number, a: number): void {
  if (a <= 0.02) return;
  additive(ctx, () => {
    for (let i = 0; i < 6; i++) {
      const u = Math.sin(tick * 0.021 + i * 2.1) * 0.6;
      const v = Math.cos(tick * 0.017 + i * 1.3) * 0.6;
      const pr = Math.min(rx, ry * 2) * (0.25 + (i % 3) * 0.08);
      glow(ctx, x + u * rx, y + v * ry, pr, i % 2 ? WV.pale : WV.aqua, 0.28 * a * (0.6 + Math.sin(tick * 0.05 + i) * 0.4));
    }
    ctx.strokeStyle = alpha(WV.foam, 0.35 * a);
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
      const cx = x + Math.sin(tick * 0.013 + i * 1.7) * rx * 0.6;
      const cy = y + Math.cos(tick * 0.019 + i * 2.3) * ry * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, 3 + (i % 2) * 2, 0.3 + tick * 0.02, 1.6 + tick * 0.02);
      ctx.stroke();
    }
  });
}

/** 물안개: 둘레를 천천히 도는 하얀 물안개 덩어리 + 얇은 바람결 + 반짝임 */
export function mist(ctx: Ctx, x: number, y: number, r: number, tick: number, a: number): void {
  for (let i = 0; i < 10; i++) {
    const t = tick * 0.012 * (i % 2 ? 1 : -0.7) + i * 0.63;
    const d = r * (0.45 + (i % 3) * 0.18);
    const px = x + Math.cos(t) * d;
    const py = y + Math.sin(t) * d * 0.6;
    const pr = r * (0.32 + (i % 4) * 0.06);
    const g = ctx.createRadialGradient(px, py, 0, px, py, pr);
    g.addColorStop(0, alpha("#eaf8ff", 0.2 * a));
    g.addColorStop(1, alpha("#eaf8ff", 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, TAU);
    ctx.fill();
  }
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < 5; i++) {
      const t = tick * 0.03 + i * 1.26;
      ctx.strokeStyle = alpha(WV.pale, 0.35 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, r * (0.7 + i * 0.07), r * (0.42 + i * 0.04), 0, t, t + 0.9);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
  for (let i = 0; i < 4; i++) glint(ctx, x + Math.cos(tick * 0.04 + i * 1.6) * r * 0.7, y + Math.sin(tick * 0.04 + i * 1.6) * r * 0.4, 1.5 + ((tick + i * 11) % 24) / 12, WV.foam, 0.8 * a);
}

/** 바다의 보석 (바닥 x, y · h 높이 · charge 0~1 쏘기 직전 빛남): 떠 있는 육각 결정 · 면마다 다른 물빛 · 빛나는 심 · 도는 물방울 고리 · 바닥 물빛 원 */
export function seaGem(ctx: Ctx, x: number, y: number, h: number, a: number, tick: number, charge: number): void {
  const bob = Math.sin(tick * 0.08) * 1.5;
  const cy = y - h * 0.62 + bob;
  const w = h * 0.3;
  // 바닥 물빛 원 · 일렁임
  additive(ctx, () => glow(ctx, x, y, h * 0.6, WV.aqua, 0.25 * a));
  ripple(ctx, x, y, h * 0.42 + Math.sin(tick * 0.1) * 1.5, 0.7 * a, 1);
  ripple(ctx, x, y, h * 0.26, 0.5 * a, 0.8, WV.pale);
  additive(ctx, () => glow(ctx, x, cy, h * (0.55 + charge * 0.3), WV.aqua, (0.22 + charge * 0.35) * a, charge * 0.6));
  // 결정: 위 꼭짓점 · 어깨 셋 · 아래 꼭짓점 (면을 다른 빛깔로)
  const top: [number, number] = [x, cy - h * 0.5];
  const bot: [number, number] = [x, cy + h * 0.42];
  const spin = tick * 0.03;
  const sh = [0, 1, 2, 3, 4, 5].map((i) => {
    const t = spin + (i * TAU) / 6;
    return [x + Math.cos(t) * w, cy - h * 0.08 + Math.sin(t) * w * 0.28, Math.sin(t)] as const;
  });
  const face = (p0: readonly [number, number], p1: readonly [number, number, number], p2: readonly [number, number, number], light: number) => {
    const g = ctx.createLinearGradient(p0[0], p0[1], (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
    g.addColorStop(0, alpha(WV.foam, (0.55 + light * 0.35) * a));
    g.addColorStop(0.5, alpha(light > 0.4 ? WV.sky : WV.aqua, 0.75 * a));
    g.addColorStop(1, alpha(WV.deep, 0.85 * a));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = alpha(WV.foam, 0.7 * a);
    ctx.lineWidth = 0.6;
    ctx.stroke();
  };
  for (let i = 0; i < 6; i++) {
    const p1 = sh[i]!;
    const p2 = sh[(i + 1) % 6]!;
    if (p1[2] + p2[2] < 0) continue; // 뒤쪽 면은 안 보임
    const light = (p1[2] + p2[2]) / 2;
    face(top, p1, p2, light);
    face(bot, p1, p2, light * 0.5);
  }
  // 빛나는 심 · 꼭대기 반짝
  additive(ctx, () => glow(ctx, x, cy - h * 0.05, w * (0.45 + charge * 0.6), WV.foam, (0.35 + charge * 0.5) * a, 1));
  glint(ctx, top[0], top[1] + 1, 2.5 + charge * 3 + Math.sin(tick * 0.2), WV.foam, a);
  // 둘레를 도는 물방울 고리 둘 (기울어짐)
  additive(ctx, () => {
    for (const [tilt, sp, rr] of [[0.35, 0.05, 1.1], [-0.5, -0.07, 0.9]] as const) {
      ctx.save();
      ctx.translate(x, cy);
      ctx.rotate(tilt);
      ctx.strokeStyle = alpha(WV.pale, 0.35 * a);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, h * 0.5 * rr, h * 0.14 * rr, 0, 0, TAU);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const t = tick * sp + (i * TAU) / 3;
        glow(ctx, Math.cos(t) * h * 0.5 * rr, Math.sin(t) * h * 0.14 * rr, 3, WV.foam, a, 1);
      }
      ctx.restore();
    }
  });
}

/** 물의 날개 (어깨 x, y · 등 뒤): 위로 휘어 오른 큰 날개 몸 · 아래 가장자리는 깃털 물결 · 깃 줄기 · 윗선을 타고 흐르는 빛 · 깃 끝에서 떨어지는 물방울 */
const TIPS: readonly [number, number][] = [[38, -24], [35, -14], [31, -7], [26, -2], [20, 2], [13, 4], [6, 3]];
export function waterWings(ctx: Ctx, x: number, y: number, a: number, tick: number): void {
  const flap = Math.sin(tick * 0.14);
  for (const sd of [-1, 1]) {
    ctx.save();
    ctx.translate(x + sd * 3, y);
    ctx.scale(sd, 1);
    ctx.rotate(-0.1 - flap * 0.22);
    additive(ctx, () => glow(ctx, 18, -10, 26, WV.aqua, 0.3 * a));
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(0, 1);
      ctx.bezierCurveTo(6, -14, 20, -26, 38, -24);
      for (let i = 1; i < TIPS.length; i++) {
        const [px, py] = TIPS[i]!;
        const [qx, qy] = TIPS[i - 1]!;
        ctx.quadraticCurveTo((px + qx) / 2 - 3, (py + qy) / 2 + 3, px, py);
      }
      ctx.lineTo(0, 4);
      ctx.closePath();
    };
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 40);
    g.addColorStop(0, alpha(WV.deep, 0.85 * a));
    g.addColorStop(0.45, alpha(WV.aqua, 0.6 * a));
    g.addColorStop(1, alpha(WV.foam, 0.9 * a));
    ctx.fillStyle = g;
    path();
    ctx.fill();
    ctx.strokeStyle = alpha(WV.foam, 0.85 * a);
    ctx.lineWidth = 0.8;
    ctx.stroke();
    additive(ctx, () => {
      // 깃 줄기
      ctx.strokeStyle = alpha(WV.pale, 0.45 * a);
      ctx.lineWidth = 0.6;
      for (const [px, py] of TIPS) {
        ctx.beginPath();
        ctx.moveTo(3, -1);
        ctx.quadraticCurveTo(px * 0.5, py * 0.5 - 4, px - 1, py);
        ctx.stroke();
      }
      // 윗선을 따라 흐르는 빛
      const u = (tick * 0.025) % 1;
      const bx = 38 * u ** 0.8;
      const by = -26 * Math.sin(u * 1.7) + 2;
      glow(ctx, bx, Math.max(-24, by), 5, WV.foam, a, 1);
    });
    ctx.restore();
  }
  // 깃 끝에서 떨어지는 물방울
  additive(ctx, () => {
    for (let i = 0; i < 8; i++) {
      const u = (tick * 0.03 + i / 8) % 1;
      const sd = i % 2 ? 1 : -1;
      const [tx, ty] = TIPS[1 + (i % 5)]!;
      ctx.fillStyle = alpha(WV.foam, a * (1 - u));
      ctx.fillRect(x + sd * (tx + 2), y + ty + u * 18, 1.2, 1.8);
    }
  });
}

/** 솟구치는 맑은 물기둥 (바닥 x, y · 폭 w · 높이 h): 맑은 하늘색 몸 · 흰 심 · 위로 흐르는 물살 · 꼭대기 물방울 왕관 */
export function waterColumn(ctx: Ctx, x: number, y: number, w: number, h: number, a: number, tick: number): void {
  if (h < 2 || a <= 0.02) return;
  const body = (ww: number) => {
    ctx.beginPath();
    ctx.moveTo(x - ww, y);
    ctx.bezierCurveTo(x - ww * 0.5, y - h * 0.4, x - ww * 0.45, y - h * 0.8, x - ww * 0.3, y - h);
    ctx.quadraticCurveTo(x, y - h - ww * 0.4, x + ww * 0.3, y - h);
    ctx.bezierCurveTo(x + ww * 0.45, y - h * 0.8, x + ww * 0.5, y - h * 0.4, x + ww, y);
    ctx.closePath();
  };
  additive(ctx, () => {
    glow(ctx, x, y - h * 0.5, Math.max(w, h * 0.5), WV.aqua, 0.35 * a);
    const g = ctx.createLinearGradient(x, y, x, y - h);
    g.addColorStop(0, alpha(WV.aqua, 0.75 * a));
    g.addColorStop(0.7, alpha(WV.sky, 0.6 * a));
    g.addColorStop(1, alpha(WV.foam, 0.6 * a));
    ctx.fillStyle = g;
    body(w);
    ctx.fill();
    ctx.fillStyle = alpha(WV.foam, 0.35 * a);
    body(w * 0.3);
    ctx.fill();
    // 위로 흐르는 물살 줄
    ctx.strokeStyle = alpha(WV.foam, 0.7 * a);
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const sx = x + (i - 2) * w * 0.3;
      const u = (tick * 0.08 + i * 0.37) % 1;
      ctx.beginPath();
      ctx.moveTo(sx, y - h * u);
      ctx.lineTo(sx * 0.98 + x * 0.02, y - h * Math.min(1, u + 0.25));
      ctx.stroke();
    }
  });
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * TAU + tick * 0.05;
    glow(ctx, x + Math.cos(t) * w * 0.9, y - h - Math.abs(Math.sin(t)) * w * 0.5, 2.5, WV.foam, a, 1);
  }
}
