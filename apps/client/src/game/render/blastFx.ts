// 블래스트 효과 — 폭멸의 탄환. 산탄(총구 앞 주황·검붉은 폭발 그림 sprites/blast_fx · 치명타 탄은 크게 새빨갛게 · 파란 탄은 푸른 폭발 hook_fx + 퍼지는 산탄 줄기 · 각성 중엔 흰 달빛 더함) · 폭멸(검붉은 터짐·핏방울·뼛조각) · 달빛 각성(흰 충격파·초승달·달빛 기둥) · 각성 중 몸 둘레 달빛
// 달빛 산탄(blMoon): 흰 초승달 탄과 푸른 꼬리
import type { EffectState, ProjectileState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { blastSprite as blueSprite } from "./hookArt";
import { lazyImg } from "../lazyImage";

const FIRE = "#ffb84a";
const MOON = "#ffffff";
const MOON_BLUE = "#c8d8ff";
const BLOOD = "#a01a2a";
const BL_FX = new Set(["blShotFx", "blBurstFx", "blAwakeFx", "blMoonAura"]);
const CELL = 128;
const sheet = lazyImg(`${import.meta.env.BASE_URL}sprites/blast_fx.png`);

/** 발사 폭발 그림 한 칸 (row 0 큰 발사 · 1 첫 발 · frame 0~3) · 총구 x,y에서 a 방향으로 · 폭 w (검은 연기가 보이게 보통 덧칠) */
function blastSprite(ctx: Ctx, row: number, frame: number, x: number, y: number, a: number, w: number, al: number): void {
  if (!sheet.complete || sheet.naturalWidth === 0 || al <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, al);
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, frame * CELL, row * CELL, CELL, CELL, 0, -w / 2, w, w);
  ctx.restore();
}

/** 산탄: 총구 불꽃 + 부채꼴로 퍼지는 산탄 줄기 (style 1 = 각성 달빛) */
function shot(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  const half = Math.acos(Math.max(-1, Math.min(1, fx.arc ?? 0.6)));
  const st = fx.style ?? 0;
  const moon = (st & 1) === 1;
  const big = (st & 2) === 2;
  const blue = (st & 4) === 4;
  const c = moon ? MOON : blue ? "#6ad8ff" : big ? "#ff3a2a" : FIRE;
  const mx = x + Math.cos(a) * 14;
  const my = y - 4 + Math.sin(a) * 14;
  const seed = Math.abs(Math.round(fx.x * 13 + fx.y * 7 + fx.maxTicks));
  // 총구 앞 폭발: 번쩍 → 검붉은 연기 → 초승달 충격 → 흩어짐 (치명타 탄은 크게 + 새빨간 빛 · 파란 탄은 푸른 폭발)
  const frame = Math.min(3, Math.floor(f * 4));
  const w = (big ? 92 : 62) * (moon ? 1.15 : 1);
  const push = frame >= 2 ? w * 0.15 * (frame - 1) : 0;
  const fade = f < 0.75 ? 1 : 1 - (f - 0.75) / 0.25;
  const bx = mx + Math.cos(a) * push;
  const by = my + Math.sin(a) * push;
  if (blue) blueSprite(ctx, big ? 0 : 1, frame, bx, by, a, w, fade);
  else blastSprite(ctx, big ? 0 : 1, frame, bx, by, a, w, fade);
  if (big) additive(ctx, () => glow(ctx, mx + Math.cos(a) * 20, my + Math.sin(a) * 20, 30 * (1 - f) + 6, "#ff2a1a", 0.9 * (1 - f), 0.8));
  additive(ctx, () => {
    glow(ctx, mx, my, 16 * (1 - f) + 4, c, 0.9 * (1 - f), 1);
    const n = moon ? 11 : 9;
    for (let k = 0; k < n; k++) {
      const ang = a + (rnd(seed, k) * 2 - 1) * half;
      const far = fx.size * (0.55 + rnd(k, seed) * 0.45) * easeOut(Math.min(1, f * 2.2));
      const back = Math.max(0, far - 18);
      beam(ctx, mx + Math.cos(ang) * back, my + Math.sin(ang) * back, mx + Math.cos(ang) * far, my + Math.sin(ang) * far, 1.4, k % 3 ? c : MOON, 0.9 * (1 - f));
    }
    if (moon) crescent(ctx, mx, my, 10 + 20 * f, a, 1.2, 3, MOON_BLUE, 0.7 * (1 - f));
  });
  // 연기
  ctx.fillStyle = `rgba(200,200,210,${0.25 * (1 - f)})`;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.arc(mx + Math.cos(a) * (6 + k * 6) * f, my - 3 * f * k, 3 + 4 * f, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 폭멸: 검붉은 터짐 · 핏방울 · 뼛조각 */
function burst(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const seed = Math.abs(Math.round(fx.x * 5 + fx.y * 11));
  additive(ctx, () => {
    glow(ctx, x, y, fx.size * (0.4 + 0.6 * easeOut(f)), "#ff5a3a", 0.8 * (1 - f), 0.6);
    shock(ctx, x, y, fx.size * easeOut(f), "#ff7a4a", 0.8 * (1 - f), 8);
  });
  sparks(ctx, x, y, 12, fx.size * 1.1, f, BLOOD, seed);
  ctx.fillStyle = alpha("#f0e8d8", 1 - f);
  for (let k = 0; k < 5; k++) {
    const ang = rnd(seed, k + 9) * Math.PI * 2;
    const d = fx.size * 0.9 * easeOut(f) * (0.5 + rnd(k, 3));
    ctx.fillRect(Math.round(x + Math.cos(ang) * d), Math.round(y + Math.sin(ang) * d - 6 * Math.sin(f * Math.PI)), 2, 2);
  }
}

/** 달빛 각성: 흰 충격파 두 겹 · 초승달 · 위로 솟는 달빛 기둥 */
function awake(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  additive(ctx, () => {
    glow(ctx, x, y - 6, fx.size * 0.8, MOON_BLUE, 0.8 * (1 - f), 1);
    shock(ctx, x, y, fx.size * easeOut(f), MOON, 0.9 * (1 - f), 12);
    shock(ctx, x, y, fx.size * 0.6 * easeOut(Math.min(1, f * 1.5)), MOON_BLUE, 0.7 * (1 - f), 6);
    beam(ctx, x, y, x, y - 60 - 40 * f, 6 * (1 - f) + 1, MOON, 0.8 * (1 - f));
    crescent(ctx, x, y - 34 - 10 * f, 12, -Math.PI / 2 + f, 2.4, 4, MOON, 0.9 * (1 - f));
  });
}

export function drawBlastFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!BL_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "blShotFx") shot(ctx, fx, x, y, f);
  else if (fx.kind === "blBurstFx") burst(ctx, fx, x, y, f);
  else if (fx.kind === "blAwakeFx") awake(ctx, fx, x, y, f);
  else additive(ctx, () => glow(ctx, x, y - 6, fx.size * (0.9 + 0.2 * Math.sin(f * Math.PI)), MOON, 0.35 * Math.sin(f * Math.PI), 0.5));
  return true;
}

/** 달빛 산탄: 흰 초승달 탄 + 푸른 꼬리 */
export function drawBlastShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "blMoon") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  additive(ctx, () => {
    beam(ctx, x - dx * 12, y - dy * 12, x, y, 2, MOON_BLUE, 0.7);
    glow(ctx, x, y, 6, MOON, 0.8, 1);
  });
  crescent(ctx, x, y, 4, Math.atan2(dy, dx), 1.4, 2, MOON, 1);
  return true;
}
