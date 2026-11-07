// 네일러 효과 — 못 박는 심판관. 망치 내려치기(앞으로 뻗는 네모 검격) · 못이 박힘(핏방울) · 붉은 실 망치 원(붉은 원·갈라짐·핏방울)
// 바닥에 박은 못(떨어져 꽂힘·붉은 고리) · 고정 못 다섯(차례로 내리꽂힘·붉은 실 고리) · 저주 터짐(못 수만큼 크게 피가 폭발 · 못이 튀어 나감 · 피 웅덩이) · 못비 던지기(나·양옆 분신 손끝 번쩍)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { drop, nail, NL } from "./nailerArt";

const NL_FX = new Set(["nlSwingFx", "nlStickFx", "nlSmashFx", "nlAnchorFx", "nlPinFx", "nlCurseFx", "nlUltFx"]);

/** 핏방울이 둘레로 튀었다 떨어짐 (n개 · 퍼지는 거리 d · 0~1) */
function splatter(ctx: Ctx, x: number, y: number, n: number, d: number, f: number, seed: number, up = 1): void {
  for (let k = 0; k < n; k++) {
    const a = rnd(seed, k) * Math.PI * 2;
    const far = d * (0.4 + rnd(k, seed) * 0.7) * easeOut(Math.min(1, f * 1.4));
    const fall = 26 * f * f;
    const px = x + Math.cos(a) * far;
    const py = y + Math.sin(a) * far * 0.65 - Math.sin(Math.min(1, f * 1.4) * Math.PI) * 10 * up * rnd(seed + 3, k) + fall;
    ctx.globalAlpha = Math.max(0, 1 - f * 0.9);
    drop(ctx, px, py, 1 + rnd(k, seed + 7) * 1.4, k % 3 ? NL.gore : NL.blood);
  }
  ctx.globalAlpha = 1;
}

/** 바닥 피 웅덩이 (커졌다 천천히 옅어짐) */
function pool(ctx: Ctx, x: number, y: number, r: number, f: number, seed: number): void {
  const g = easeOut(Math.min(1, f * 2));
  ctx.fillStyle = alpha(NL.blood, 0.55 * (1 - f));
  for (let k = 0; k < 5; k++) {
    const a = rnd(seed, k + 20) * Math.PI * 2;
    const d = r * 0.45 * rnd(k, seed + 20);
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.5, r * g * (0.45 + rnd(k, 5) * 0.3), r * g * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 망치 내려치기: 앞으로 뻗는 네모 검격 (밝은 앞 가장자리 · 안쪽 결 · 끝에서 번쩍) */
function swing(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const grow = easeOut(Math.min(1, f * 3));
  const fade = f < 0.35 ? 1 : 1 - (f - 0.35) / 0.65;
  const len = fx.size * (0.35 + 0.65 * grow);
  const w = fx.size * 0.34 * (1 - 0.25 * f);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  const g = ctx.createLinearGradient(4, 0, len, 0);
  g.addColorStop(0, alpha(NL.red, 0));
  g.addColorStop(0.55, alpha("#ff5a64", 0.45 * fade));
  g.addColorStop(1, alpha("#ffffff", 0.9 * fade));
  ctx.fillStyle = g;
  ctx.fillRect(4, -w, len - 4, w * 2);
  // 위·아래 가장자리 (앞으로 갈수록 밝게) · 앞 가장자리 굵게
  const edge = ctx.createLinearGradient(4, 0, len, 0);
  edge.addColorStop(0, alpha("#ffffff", 0));
  edge.addColorStop(1, alpha("#ffffff", 0.85 * fade));
  ctx.fillStyle = edge;
  ctx.fillRect(4, -w, len - 4, 1);
  ctx.fillRect(4, w - 1, len - 4, 1);
  ctx.fillStyle = alpha("#ffffff", fade);
  ctx.fillRect(len - 3, -w - 1, 4, w * 2 + 2);
  ctx.fillStyle = alpha(NL.red, 0.8 * fade);
  ctx.fillRect(len + 1, -w, 1, w * 2);
  // 안쪽 결 (앞으로 내달리는 줄)
  ctx.fillStyle = alpha("#ffffff", 0.55 * fade);
  for (let k = 0; k < 3; k++) {
    const yy = -w * 0.6 + k * w * 0.6;
    const st = 6 + ((f * 3 + k * 0.3) % 1) * len * 0.5;
    ctx.fillRect(st, yy, len * 0.35, 1);
  }
  ctx.restore();
  const ix = x + Math.cos(a) * len;
  const iy = y + Math.sin(a) * len;
  additive(ctx, () => glow(ctx, ix, iy, w * 1.2, NL.red, 0.7 * fade, 0.8));
  if (f > 0.2) sparks(ctx, ix, iy, 5, 14, (f - 0.2) / 0.8, "#ffd0b0", Math.round(fx.x + fx.y));
}

/** 못이 박힘: 붉은 번쩍 · 핏방울 몇 개 */
function stick(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  additive(ctx, () => glow(ctx, x, y, 5 + fx.size * 0.8 * (1 - f), NL.red, 0.75 * (1 - f), 0.8));
  splatter(ctx, x, y, 4, 12, f, Math.round(fx.x * 3 + fx.y), 0.6);
}

/** 붉은 실 2번: 내려쳐 퍼지는 붉은 원 · 갈라짐 · 핏방울 */
function smash(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const seed = Math.round(fx.x + fx.y * 5);
  const r = fx.size * easeOut(Math.min(1, f * 1.8));
  pool(ctx, x, y + 2, fx.size * 0.9, f, seed);
  // 갈라진 금
  ctx.strokeStyle = alpha("#2a0408", 0.8 * (1 - f));
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2 + rnd(seed, k);
    const l = r * (0.6 + rnd(k, seed) * 0.4);
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + Math.cos(a) * l * 0.5 + rnd(k, 2) * 4, y + 2 + Math.sin(a) * l * 0.3);
    ctx.lineTo(x + Math.cos(a) * l, y + 2 + Math.sin(a) * l * 0.6);
    ctx.stroke();
  }
  ctx.strokeStyle = alpha(NL.red, 0.9 * (1 - f));
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  additive(ctx, () => {
    shock(ctx, x, y, r, NL.red, 0.85 * (1 - f), 9);
    glow(ctx, x, y, fx.size * 0.55, NL.red, 0.6 * (1 - f), 0.6);
  });
  splatter(ctx, x, y - 4, 14, fx.size * 0.9, f, seed);
}

/** 바닥에 박은 못: 위에서 떨어져 꽂힘 · 붉은 고리 · 흙먼지 */
function anchor(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const fall = Math.max(0, 1 - f * 3.5);
  nail(ctx, x, y - 16 - fall * 30, Math.PI / 2, 16, 0.4 * (1 - f));
  if (fall > 0) return;
  const g = (f - 1 / 3.5) / (1 - 1 / 3.5);
  additive(ctx, () => shock(ctx, x, y + 1, 4 + 16 * easeOut(g), NL.red, 0.85 * (1 - g), 4));
  sparks(ctx, x, y, 6, 12, g, "#b8a890", Math.round(fx.x + fx.y));
}

/** 고정 못 다섯: 적 둘레에 차례로 내리꽂힘 · 이어지는 붉은 실 고리 */
function pin(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const r = fx.size + 7;
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    const t = Math.max(0, Math.min(1, f * 3.2 - k * 0.3));
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r * 0.6;
    if (t <= 0) continue;
    nail(ctx, px, py - 13 - (1 - t) * 22, Math.PI / 2, 13);
    if (t >= 1) additive(ctx, () => glow(ctx, px, py + 1, 6, NL.red, 0.7 * (1 - f)));
  }
  if (f < 0.5) return;
  // 못을 잇는 붉은 실 고리
  ctx.strokeStyle = alpha(NL.red, Math.min(1, 0.9 * (1 - f) * 2));
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/** 저주 터짐: 박혀 있던 못 수(size)만큼 크게 · 몸이 검붉게 부풀었다 피가 폭발 · 못이 사방으로 튀어 나감 · 피 웅덩이 */
function curse(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const n = fx.size;
  const big = Math.min(72, 16 + n * 1.6);
  const seed = Math.round(fx.x * 7 + fx.y * 3);
  pool(ctx, x, y + 6, big * 0.8, f, seed);
  if (f < 0.12) {
    // 터지기 직전: 검붉게 부풂
    additive(ctx, () => glow(ctx, x, y - 4, 10 + big * 0.3 * (f / 0.12), NL.red, 0.9, 0.4));
    return;
  }
  const g = (f - 0.12) / 0.88;
  // 피 안개 (보통 칠하기라 어둡게 남음)
  const mist = ctx.createRadialGradient(x, y - 4, 0, x, y - 4, big * (0.4 + 0.6 * easeOut(g)));
  mist.addColorStop(0, alpha(NL.gore, 0.75 * (1 - g)));
  mist.addColorStop(0.6, alpha(NL.blood, 0.45 * (1 - g)));
  mist.addColorStop(1, alpha(NL.blood, 0));
  ctx.fillStyle = mist;
  ctx.beginPath();
  ctx.arc(x, y - 4, big, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => {
    shock(ctx, x, y - 2, big * easeOut(g), NL.red, 0.9 * (1 - g), 10);
    glow(ctx, x, y - 4, big * 0.4, NL.curse, 0.5 * (1 - g), 0.7);
  });
  splatter(ctx, x, y - 6, Math.min(44, 12 + Math.round(n * 1.4)), big * 1.1, g, seed);
  // 튀어 나가는 못 (빙글 돌며)
  const m = Math.min(16, 4 + Math.floor(n / 2));
  ctx.globalAlpha = Math.max(0, 1 - g);
  for (let k = 0; k < m; k++) {
    const a = rnd(seed, k + 50) * Math.PI * 2;
    const d = big * (0.5 + rnd(k, 50) * 0.6) * easeOut(g);
    nail(ctx, x + Math.cos(a) * d, y - 6 + Math.sin(a) * d * 0.7 + 20 * g * g, a + g * 6 * (k % 2 ? 1 : -1), 9);
  }
  ctx.globalAlpha = 1;
}

/** 못비 던지기: 나와 양옆 분신 손끝(size 떨어진 곳)에서 번쩍 · 앞으로 짧은 바람 줄 */
function ultHit(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  for (const off of [0, -fx.size, fx.size]) {
    const px = x - fx.dirY * off + fx.dirX * 8;
    const py = y - 6 + fx.dirX * off + fx.dirY * 8;
    additive(ctx, () => {
      glow(ctx, px, py, 8 * (1 - f) + 3, off === 0 ? NL.red : "#ff8a94", 0.8 * (1 - f), 0.8);
      ctx.strokeStyle = alpha("#ffffff", 0.6 * (1 - f));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + fx.dirX * 16 * easeOut(f), py + fx.dirY * 16 * easeOut(f));
      ctx.stroke();
    });
  }
}

export function drawNailerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!NL_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "nlSwingFx") swing(ctx, fx, x, y, f);
  else if (fx.kind === "nlStickFx") stick(ctx, fx, x, y, f);
  else if (fx.kind === "nlSmashFx") smash(ctx, fx, x, y, f);
  else if (fx.kind === "nlAnchorFx") anchor(ctx, fx, x, y, f);
  else if (fx.kind === "nlPinFx") pin(ctx, fx, x, y, f);
  else if (fx.kind === "nlCurseFx") curse(ctx, fx, x, y, f);
  else ultHit(ctx, fx, x, y, f);
  return true;
}
