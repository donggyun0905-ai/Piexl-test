// 크루세이더 그리기 조각: 무겁고 단단한 느낌 (돌 그림은 보통 섞기로 또렷하게, 성스러운 빛만 더하기)
// 심판의 십자가 그림 (sprites/crusader_cross) · 솟는 돌판 (crusader_slab 4가지) · 날아가는 돌 파편 (crusader_rock 4가지) ← scripts/art/crusader_fx.py
// 패인 땅 (금 간 구덩이) · 흙먼지 덩어리 · 두꺼운 흙먼지 고리 · 땅에 새긴 십자 낙인 빛
import { img } from "./lunaticFx";
import { additive, alpha, easeOut, type Ctx } from "./pwFxBits";

export const CR = { gold: "#ffd36a", light: "#fff6d0", deep: "#c8902a", dust: "#8a7560", dark: "#2a2018", red: "#c8283a" };

const CROSS = img("crusader_cross");
const SLAB = img("crusader_slab");
const ROCK = img("crusader_rock");
const ready = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;

/** 자리마다 정해진 난수 (0~1) */
export const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** 심판의 십자가: 발 (x, y)에 아래끝 · 크기 scale · 땅에 박힌 깊이 sink(그림 픽셀) · 기울기 tilt */
export function crossSprite(ctx: Ctx, x: number, y: number, scale: number, al = 1, sink = 0, tilt = 0): void {
  if (!ready(CROSS) || al <= 0) return;
  const w = CROSS.naturalWidth;
  const h = CROSS.naturalHeight - Math.max(0, Math.min(CROSS.naturalHeight - 4, Math.round(sink)));
  ctx.save();
  ctx.globalAlpha *= al;
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.drawImage(CROSS, 0, 0, w, h, Math.round((-w * scale) / 2), Math.round(-h * scale), Math.round(w * scale), Math.round(h * scale));
  ctx.restore();
}

/** 솟는 돌판 (k 가지) · 아래끝 (x, y) · 크기 · 솟은 정도 rise (0~1.2) · 좌우 뒤집기 */
export function slabSprite(ctx: Ctx, x: number, y: number, k: number, scale: number, rise: number, al = 1, flip = false): void {
  if (!ready(SLAB) || rise <= 0 || al <= 0) return;
  const cw = SLAB.naturalWidth / 4;
  const ch = SLAB.naturalHeight;
  const sh = Math.max(1, Math.round(ch * Math.min(1, rise)));
  const h = ch * scale * rise;
  ctx.save();
  ctx.globalAlpha *= al;
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(SLAB, (k % 4) * cw, 0, cw, sh, Math.round((-cw * scale) / 2), Math.round(-h), Math.round(cw * scale), Math.round(h));
  ctx.restore();
}

/** 돌 파편 n개가 (x, y)에서 포물선으로 튐 (d: 날아가는 거리 · f: 0~1 · 크기 scale) */
export function debris(ctx: Ctx, x: number, y: number, n: number, d: number, f: number, seed: number, scale = 1, dirX = 0, dirY = 0): void {
  if (!ready(ROCK) || f >= 1) return;
  const cw = ROCK.naturalWidth / 4;
  const al = f < 0.75 ? 1 : (1 - f) * 4;
  ctx.save();
  ctx.globalAlpha *= al;
  for (let i = 0; i < n; i++) {
    const r1 = hash(seed + i * 7.3);
    const r2 = hash(seed + i * 3.1 + 9);
    let a = (i / n) * Math.PI * 2 + r1 * 0.8;
    // 방향이 있으면 그쪽 반원으로 몰림
    if (dirX || dirY) a = Math.atan2(dirY, dirX) + (r1 - 0.5) * 2.2;
    const dist = d * (0.45 + 0.55 * r2) * easeOut(f);
    const up = d * (0.5 + r1 * 0.6) * 4 * f * (1 - f) * 0.6;
    const px = x + Math.cos(a) * dist;
    const py = y + Math.sin(a) * dist * 0.75 - up;
    const s = scale * (0.7 + r2 * 0.6);
    ctx.save();
    ctx.translate(Math.round(px), Math.round(py));
    ctx.rotate(f * (r1 - 0.5) * 9);
    ctx.drawImage(ROCK, (i % 4) * cw, 0, cw, ROCK.naturalHeight, -cw * s * 0.5, -cw * s * 0.5, cw * s, cw * s);
    ctx.restore();
  }
  ctx.restore();
}

/** 흙먼지 덩어리 n개: 둘레 r에서 피어올라 퍼지며 옅어짐 (보통 섞기, 두껍고 탁한 색) */
export function dust(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 8, a0 = 0.55): void {
  const al = a0 * (1 - f) ** 1.5;
  if (al <= 0.01) return;
  for (let i = 0; i < n; i++) {
    const h = hash(seed + i * 5.7);
    const a = (i / n) * Math.PI * 2 + h;
    const d = r * (0.6 + 0.5 * easeOut(f)) * (0.8 + h * 0.4);
    const pr = (3 + h * 3) * (0.6 + f * 1.4) * Math.max(1, r / 30);
    ctx.fillStyle = alpha(i % 3 ? CR.dust : "#a8957c", al);
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7 - f * 6, pr, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 두꺼운 흙먼지 고리 (퍼지며 얇아짐) */
export function dustRing(ctx: Ctx, x: number, y: number, r: number, f: number, w = 6, a0 = 0.6): void {
  ctx.strokeStyle = alpha(CR.dust, a0 * (1 - f));
  ctx.lineWidth = Math.max(1, w * (1 - f));
  ctx.beginPath();
  ctx.ellipse(x, y, r * easeOut(f), r * easeOut(f) * 0.8, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/** 패인 땅: 어두운 구덩이 + 사방으로 뻗은 굵은 금 (안쪽에 금빛) */
export function crater(ctx: Ctx, x: number, y: number, r: number, al: number, seed: number, cracks = 7): void {
  if (al <= 0) return;
  ctx.fillStyle = alpha(CR.dark, 0.45 * al);
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.55, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  const lines: [number, number, number, number, number, number][] = [];
  for (let i = 0; i < cracks; i++) {
    const h = hash(seed + i * 2.9);
    const a = (i / cracks) * Math.PI * 2 + h * 0.6;
    const k = 0.35 + h * 0.4;
    const bend = (h - 0.5) * 0.7;
    lines.push([x + Math.cos(a) * r * 0.25, y + Math.sin(a) * r * 0.2, x + Math.cos(a + bend) * r * k, y + Math.sin(a + bend) * r * k * 0.8, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8]);
  }
  ctx.strokeStyle = alpha(CR.dark, 0.8 * al);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [ax, ay, bx, by, cx, cy] of lines) {
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
  }
  ctx.stroke();
  additive(ctx, () => {
    ctx.strokeStyle = alpha(CR.gold, 0.55 * al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [ax, ay, bx, by] of lines) {
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
  });
}

/** 땅에 새긴 십자 낙인 빛 (앞 긴 팔 · 옆 · 뒤 짧은 팔) */
export function brand(ctx: Ctx, x: number, y: number, dx: number, dy: number, r: number, al: number, w = 3): void {
  if (al <= 0) return;
  additive(ctx, () => {
    for (const [c, lw] of [[CR.deep, w + 2], [CR.gold, w], [CR.light, 1]] as const) {
      ctx.strokeStyle = alpha(c, al * (c === CR.deep ? 0.5 : 0.9));
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x - dx * r * 0.45, y - dy * r * 0.45);
      ctx.lineTo(x + dx * r * 1.1, y + dy * r * 1.1);
      ctx.moveTo(x - dy * r * 0.6, y + dx * r * 0.6);
      ctx.lineTo(x + dy * r * 0.6, y - dx * r * 0.6);
      ctx.stroke();
    }
  });
}

/** 하늘에서 내리꽂히는 빛기둥 (위로 갈수록 옅음) */
export function lightPillar(ctx: Ctx, x: number, y: number, w: number, h: number, al: number): void {
  if (al <= 0) return;
  additive(ctx, () => {
    const g = ctx.createLinearGradient(0, y - h, 0, y);
    g.addColorStop(0, alpha(CR.gold, 0));
    g.addColorStop(0.7, alpha(CR.gold, 0.5 * al));
    g.addColorStop(1, alpha(CR.light, 0.9 * al));
    ctx.fillStyle = g;
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = alpha(CR.light, 0.8 * al);
    ctx.fillRect(x - w / 6, y - h * 0.8, w / 3, h * 0.8);
  });
}
