// 실버불렛 효과 — 은빛 쌍권총. 총구 불꽃(네 갈래 별 섬광 · 앞으로 뻗는 불길 · 흩어지는 연기, 왼손은 푸르게) · 은탄 맞음(은빛 고리 · 십자 반짝임 · 불똥)
// 성수 폭탄(병이 깨지며 유리 조각 · 푸른 물보라 고리 · 빛 십자 기둥 · 물방울) · 연사 시작(조여드는 은빛 조준 고리 · 십자 눈금)
// 은빛 활(각성 순간 흰 섬광, 활 몸은 silverBulletBody) · 각성 달빛 폭발(초승달 · 충격파 두 겹) · 장애물 넘기(은빛 잔상) · 은빛 파열
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { SB } from "./silverBulletBody";

const SB_FX = new Set(["sbMuzzleFx", "sbHitFx", "sbBombFx", "sbBarrageFx", "sbBowFx", "sbAwakeFx", "sbVaultFx", "sbBurstFx"]);

/** 네 갈래 별 섬광 (가운데 x,y · 반지름 r · 기울기 a) */
function star(ctx: Ctx, x: number, y: number, r: number, a: number, c: string, al: number): void {
  ctx.fillStyle = alpha(c, al);
  for (let i = 0; i < 4; i++) {
    const t = a + (i * Math.PI) / 2;
    const [cx, cy] = [Math.cos(t), Math.sin(t)];
    ctx.beginPath();
    ctx.moveTo(x + cx * r, y + cy * r);
    ctx.lineTo(x - cy * r * 0.18, y + cx * r * 0.18);
    ctx.lineTo(x + cy * r * 0.18, y - cx * r * 0.18);
    ctx.closePath();
    ctx.fill();
  }
}

/** 총구 불꽃: 별 섬광 · 앞으로 뻗는 삼각 불길 · 옆으로 흩어지는 연기 */
function muzzle(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  const a = Math.atan2(fx.dirY, fx.dirX);
  const c = fx.style ? SB.moon : "#fff2d0";
  const len = fx.size * 1.8 * (0.6 + 0.4 * (1 - f));
  additive(ctx, () => {
    glow(ctx, x, y, 7, c, 0.8 * al, 0.7);
    star(ctx, x + fx.dirX * 2, y + fx.dirY * 2, 6 * (1 - f * 0.5), a + Math.PI / 4, "#ffffff", al);
    ctx.fillStyle = alpha(c, al);
    ctx.beginPath();
    ctx.moveTo(x + fx.dirX * len, y + fx.dirY * len);
    ctx.lineTo(x - fx.dirY * 2.5, y + fx.dirX * 2.5);
    ctx.lineTo(x + fx.dirY * 2.5, y - fx.dirX * 2.5);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = alpha("#b8bcc8", 0.35 * al);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(x + fx.dirX * 3 - fx.dirY * s * 3 * (1 + f * 2), y + fx.dirY * 3 + fx.dirX * s * 3 * (1 + f * 2), 1.5 + 2 * f, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 은탄 맞음: 은빛 고리 · 십자 반짝임 · 불똥 */
function hit(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  additive(ctx, () => {
    shock(ctx, x, y, 2 + fx.size * easeOut(f), SB.silver, al, 1.5);
    star(ctx, x, y, fx.size * (1 - f * 0.6), f * 1.5, "#ffffff", al);
    sparks(ctx, x, y, 4, fx.size * 1.2, f, SB.light, Math.round(fx.x + fx.y * 7), al);
  });
}

/** 성수 폭탄: 병이 깨지며 유리 조각 · 푸른 물보라 고리 · 빛 십자 기둥 · 위로 튀는 물방울 · 바닥에 고인 성수 */
function bomb(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const R = fx.size;
  const r = R * easeOut(Math.min(1, f * 1.6));
  const al = 1 - f;
  ctx.fillStyle = alpha(SB.holy, al * 0.45);
  ctx.beginPath();
  ctx.ellipse(x, y + 2, r, r * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => {
    glow(ctx, x, y, R, SB.holy, 0.4 * al, 0.5);
    shock(ctx, x, y, r, SB.holy, al, 4);
    shock(ctx, x, y, r * 0.65, "#ffffff", al * 0.8, 2);
    // 빛 십자 기둥 (위로 솟음)
    const h = R * 1.6 * easeOut(Math.min(1, f * 2.5));
    const w = 5 * al + 1;
    const g = ctx.createLinearGradient(x, y, x, y - h);
    g.addColorStop(0, alpha("#ffffff", 0.8 * al));
    g.addColorStop(1, alpha(SB.holy, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = alpha("#ffffff", 0.7 * al);
    ctx.fillRect(x - w * 2, y - h * 0.62, w * 4, Math.max(1, w * 0.6));
    sparks(ctx, x, y - 4, 12, R * 0.9, f, SB.light, Math.round(fx.x + fx.y), al);
  });
  // 유리 조각: 둘레로 튀며 떨어짐
  const seed = Math.round(fx.x * 13 + fx.y * 7);
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2 + rnd(seed, i) * 0.6;
    const d = R * 0.9 * easeOut(f) * (0.5 + 0.5 * rnd(seed + 3, i));
    const gx = x + Math.cos(t) * d;
    const gy = y + Math.sin(t) * d * 0.6 - 10 * Math.sin(f * Math.PI) + 6 * f * f;
    ctx.fillStyle = alpha(i % 2 ? "#d8f0ff" : SB.holy, al);
    ctx.fillRect(Math.round(gx), Math.round(gy), 2, i % 3 ? 1 : 2);
  }
}

/** 연사 시작: 적 둘레 은빛 조준 고리가 돌며 조여듦 · 십자 눈금 · 가운데 반짝임 */
function barrage(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const r = fx.size + 16 * (1 - easeOut(f));
  const al = 1 - f * f;
  const spin = f * 2;
  additive(ctx, () => {
    shock(ctx, x, y, r, "#ffffff", al, 2);
    ctx.strokeStyle = alpha(SB.silver, al);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const t = spin + (i * Math.PI) / 2;
      ctx.moveTo(x + Math.cos(t) * (r + 2), y + Math.sin(t) * (r + 2));
      ctx.lineTo(x + Math.cos(t) * (r + 9), y + Math.sin(t) * (r + 9));
    }
    ctx.stroke();
    star(ctx, x, y, 8 * al, spin, "#ffffff", al);
  });
}

/** 초승달 (가운데 x,y · 반지름 r): 큰 원에서 옆으로 비킨 원을 지움 */
function crescent(ctx: Ctx, x: number, y: number, r: number, al: number): void {
  ctx.save();
  ctx.fillStyle = alpha("#ffffff", al);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x + r * 0.45, y - r * 0.15, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 달빛 폭발 (각성 · 은빛 파열): 흰 충격파 두 겹 · 빛 · 불똥 · 각성은 위에 초승달 */
function burst(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = 1 - f;
  additive(ctx, () => {
    glow(ctx, x, y, fx.size, SB.moon, 0.45 * al, 0.6);
    shock(ctx, x, y, fx.size * easeOut(f), "#ffffff", al, 5);
    shock(ctx, x, y, fx.size * 0.6 * easeOut(f), SB.moon, al * 0.7, 3);
    sparks(ctx, x, y, 14, fx.size, f, "#ffffff", Math.round(fx.x * 3 + fx.y), al);
  });
  if (fx.kind === "sbAwakeFx") {
    crescent(ctx, x, y - 30 - 8 * easeOut(f), 9, 0.9 * al);
    additive(ctx, () => glow(ctx, x, y - 32, 16, SB.moon, 0.4 * al));
  }
}

/** 장애물 넘기: 대시 방향 뒤로 뛰어오른 은빛 잔상 셋 · 깃털 같은 빛 줄 */
function vault(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const al = (1 - f) * 0.7;
  const lift = 8 * Math.sin(f * Math.PI);
  additive(ctx, () => {
    for (let i = 1; i <= 3; i++) glow(ctx, x - fx.dirX * i * 7, y - 6 - fx.dirY * i * 7 - lift, 8, SB.silver, al / i);
    ctx.strokeStyle = alpha("#ffffff", al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - fx.dirX * 24, y - fx.dirY * 24 - 2);
    ctx.quadraticCurveTo(x - fx.dirX * 10, y - 14 - lift, x, y - 6 - lift);
    ctx.stroke();
  });
}

export function drawSilverBulletFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!SB_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  if (fx.kind === "sbMuzzleFx") muzzle(ctx, fx, x, y, f);
  else if (fx.kind === "sbHitFx") hit(ctx, fx, x, y, f);
  else if (fx.kind === "sbBombFx") bomb(ctx, fx, x, y, f);
  else if (fx.kind === "sbBarrageFx") barrage(ctx, fx, x, y, f);
  else if (fx.kind === "sbBowFx") {
    // 활이 펼쳐지는 순간 흰 섬광 (활 몸은 silverBulletBody)
    const k = Math.max(0, 1 - (f * fx.maxTicks) / 12);
    if (k > 0) additive(ctx, () => glow(ctx, x + fx.dirX * 14, y - 4 + fx.dirY * 14, 40, "#ffffff", 0.7 * k, 0.8));
  } else if (fx.kind === "sbVaultFx") vault(ctx, fx, x, y, f);
  else burst(ctx, fx, x, y, f);
  return true;
}
