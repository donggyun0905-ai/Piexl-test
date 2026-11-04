// 오닉스 그리기 (3): 보석 빛기둥 도우미 — 하늘에서 내리꽂는 색 빛기둥(줄무늬·흰 심) · 바닥 룬 고리 · 갈라진 땅(불) · 얼음 반구 · 덩굴 나선 · 튀는 파편
// (참고 그림의 느낌만 따서 코드로 새로 그림: art/참고/이펙트 01)
import { additive, alpha, easeOut, glow, rnd, rune, shock, sparks, type Ctx } from "./pwFxBits";

const TAU = Math.PI * 2;
/** 보석 일곱 빛깔 (홍옥·호박·황옥·비취·청옥·남옥·자수정) · 밝은 빛 */
export const GEM_COL = ["#ff3a4a", "#ff9a2a", "#ffe040", "#3ad870", "#3a7aff", "#5ae8ff", "#b060ff"] as const;
export const GEM_PALE = ["#ffb0a0", "#ffd8a0", "#fff6b0", "#b0ffc8", "#b0c8ff", "#c8faff", "#e8c8ff"] as const;

/** 내리꽂는 빛기둥 (f: 0~1 · r: 바닥 둘레 · h: 높이 · core: 흰 심 굵기 배율) */
export function pillar(ctx: Ctx, x: number, y: number, r: number, f: number, col: string, pale: string, seed: number, h = 170, core = 1): void {
  const drop = Math.min(1, f / 0.16);
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const w = r * (0.55 + 0.35 * Math.sin(Math.min(1, f * 2) * Math.PI)) * (f < 0.16 ? 0.5 + drop * 0.5 : 1);
  const top = y - h;
  const head = top + (y - top) * drop;
  // 바닥: 도는 룬 고리 두 겹 + 그림자
  rune(ctx, x, y + 2, r * (0.9 + 0.4 * easeOut(f)), col, 0.85 * fade, f * 3 + seed);
  rune(ctx, x, y + 2, r * 0.55, pale, 0.6 * fade, -f * 4 - seed);
  additive(ctx, () => {
    // 기둥 몸: 가장자리가 흐린 색 띠 → 흰 심
    const g = ctx.createLinearGradient(x - w, 0, x + w, 0);
    g.addColorStop(0, alpha(col, 0));
    g.addColorStop(0.3, alpha(col, 0.55 * fade));
    g.addColorStop(0.5, alpha(pale, 0.95 * fade));
    g.addColorStop(0.7, alpha(col, 0.55 * fade));
    g.addColorStop(1, alpha(col, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - w, top, w * 2, head - top);
    ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
    const cw = Math.max(1, w * 0.18 * core);
    ctx.fillRect(x - cw / 2, top, cw, head - top);
    // 위아래로 흐르는 가는 빛줄 (기둥 안 줄무늬)
    for (let k = 0; k < 7; k++) {
      const ox = (rnd(seed, k) - 0.5) * w * 1.6;
      const len = 18 + rnd(k, seed) * 40;
      const sy = top + (((rnd(seed + 3, k) + f * (1.2 + rnd(k, 2))) % 1) * (head - top - len));
      ctx.fillStyle = alpha(k % 2 ? pale : "#ffffff", 0.7 * fade);
      ctx.fillRect(x + ox, sy, 1, len);
    }
    if (drop >= 1) {
      glow(ctx, x, y, r * (1.9 - f), col, 0.9 * fade, 1.4);
      shock(ctx, x, y, r * (0.5 + 1.6 * easeOut(f)), col, 0.85 * fade, 6);
    }
  });
  if (drop < 1) return;
  sparks(ctx, x, y - 4, 12, r * 1.8, f, col, seed, 1);
  debris(ctx, x, y, r, f, seed);
}

/** 튀어 오르는 바닥 파편 (어두운 돌 조각) */
export function debris(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 7): void {
  for (let k = 0; k < n; k++) {
    const ang = rnd(seed + 7, k) * TAU;
    const far = r * (0.6 + rnd(k, seed + 7)) * easeOut(f);
    const up = Math.sin(Math.min(1, f * 1.4) * Math.PI) * (10 + rnd(seed, k + 4) * 16);
    const s = 1 + Math.round(rnd(k + 2, seed) * 2);
    ctx.fillStyle = `rgba(40,30,40,${1 - f})`;
    ctx.fillRect(x + Math.cos(ang) * far - s / 2, y + Math.sin(ang) * far * 0.5 - up, s, s);
  }
}

/** 불기둥 아래 갈라진 땅: 빛나는 금이 사방으로 뻗음 */
export function cracks(ctx: Ctx, x: number, y: number, r: number, f: number, col: string, seed: number): void {
  const fade = 1 - f;
  const grow = Math.min(1, f * 3);
  ctx.lineCap = "round";
  for (let k = 0; k < 7; k++) {
    let ang = rnd(seed, k + 20) * TAU;
    let px = x;
    let py = y;
    const len = r * (0.8 + rnd(k, seed + 20) * 0.9) * grow;
    for (let i = 0; i < 4; i++) {
      ang += (rnd(seed + i, k) - 0.5) * 0.9;
      const nx = px + Math.cos(ang) * len / 4;
      const ny = py + Math.sin(ang) * len / 8;
      additive(ctx, () => {
        ctx.strokeStyle = alpha(col, 0.6 * fade);
        ctx.lineWidth = 3 - i * 0.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      });
      ctx.strokeStyle = `rgba(255,240,200,${fade})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      px = nx;
      py = ny;
    }
  }
  ctx.lineCap = "butt";
}

/** 얼음 반구 막: 위가 둥근 반투명 껍질 + 결정 가시 */
export function dome(ctx: Ctx, x: number, y: number, r: number, f: number, col: string, pale: string): void {
  const k = easeOut(Math.min(1, f * 2.5));
  const fade = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5;
  const rr = r * k;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, rr, rr * 0.8, 0, Math.PI, TAU);
  ctx.closePath();
  const g = ctx.createRadialGradient(x, y - rr * 0.3, rr * 0.1, x, y, rr);
  g.addColorStop(0, alpha(pale, 0.08 * fade));
  g.addColorStop(0.8, alpha(col, 0.25 * fade));
  g.addColorStop(1, alpha(pale, 0.7 * fade));
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = alpha(pale, 0.9 * fade);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  // 결정 가시: 둘레 바닥에서 솟음
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + (i / 8) * Math.PI;
    const bx = x + Math.cos(a) * rr;
    const by = y + 1;
    const hh = (5 + (i % 3) * 3) * k;
    ctx.fillStyle = alpha(i % 2 ? pale : col, 0.9 * fade);
    ctx.beginPath();
    ctx.moveTo(bx - 2, by);
    ctx.lineTo(bx, by - hh);
    ctx.lineTo(bx + 2, by);
    ctx.fill();
  }
}

/** 덩굴 나선: 두 줄기가 꼬이며 위로 감아 오름 (가시 잎) */
export function spiral(ctx: Ctx, x: number, y: number, r: number, h: number, f: number, col: string, pale: string): void {
  const grow = Math.min(1, f * 2);
  const fade = f < 0.6 ? 1 : 1 - (f - 0.6) / 0.4;
  ctx.lineCap = "round";
  for (const side of [0, Math.PI]) {
    let px = x + Math.cos(side) * r;
    let py = y;
    for (let i = 1; i <= 24 * grow; i++) {
      const u = i / 24;
      const a = side + u * TAU * 1.6 + f * 3;
      const nx = x + Math.cos(a) * r * (1 - u * 0.4);
      const ny = y - u * h + Math.sin(a) * r * 0.3;
      const front = Math.sin(a) > 0;
      additive(ctx, () => {
        ctx.strokeStyle = alpha(col, (front ? 0.8 : 0.35) * fade);
        ctx.lineWidth = front ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      });
      if (front && i % 5 === 0) {
        ctx.fillStyle = alpha(pale, fade);
        ctx.fillRect(nx - 1, ny - 1, 3, 2);
      }
      px = nx;
      py = ny;
    }
  }
  ctx.lineCap = "butt";
}
