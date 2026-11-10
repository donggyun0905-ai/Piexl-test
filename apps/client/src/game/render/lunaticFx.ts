// 루나틱 효과 — 달빛 (사용자 그림 8프레임, sprites/lunatic_thrust·lunatic_slash ← scripts/art/lunatic_fx.py)
// 찌르기 (초승달에서 칼빛이 뻗음, 찌르는 쪽으로 돌림 · 사거리만큼 길게) · 달빛 베기 (빠르게, 확정 치명타) · 대시 찌르기 (달빛 줄기) · 만월 각성 (큰 달빛 베기 + 충격파)
// 초승달 회전 베기 · 초승달 비 떨어짐 · 잔상 찌르기 (지나온 길 빛줄기) · 표적 생김 (조준점이 조여듦)
import type { EffectState } from "@pixel-rogue/shared";
import { crosshair, LN } from "./lunaticBody";
import { additive, beam, crescent, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

const LN_FX = new Set(["lnThrustFx", "lnSlashFx", "lnDashFx", "lnAwakeFx", "lnCrescentFx", "lnRainFx", "lnAfterFx", "lnMarkFx"]);

export const img = (name: string) => {
  const i = new Image();
  i.src = `${import.meta.env.BASE_URL}sprites/${name}.png`;
  return i;
};
const THRUST = img("lunatic_thrust");
const SLASH = img("lunatic_slash");
const ready = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;

/** 8프레임 그림 한 칸 (칸 폭 = 그림 폭 / 8) · ax: 칸 안 기준점 (0 왼쪽 끝 · 0.5 가운데) · w 그릴 폭 · 돌림 a · fy -1이면 위아래 뒤집기 (인시전 왼 도끼도 씀) */
export function frame(ctx: Ctx, sheet: HTMLImageElement, k: number, x: number, y: number, w: number, a: number, ax: number, al = 1, fy = 1): void {
  if (!ready(sheet)) return;
  const cw = sheet.naturalWidth / 8;
  const ch = sheet.naturalHeight;
  const h = (w * ch) / cw;
  ctx.save();
  ctx.globalAlpha *= al;
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.scale(1, fy);
  ctx.drawImage(sheet, Math.max(0, Math.min(7, k)) * cw, 0, cw, ch, -w * ax, -h / 2, w, h);
  ctx.restore();
}

/** 찌르기: 칼끝 쪽으로 뻗는 달빛 (몸 앞에서 시작, 길이 = 찌르기 길이) */
function thrust(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const a = Math.atan2(fx.dirY, fx.dirX);
  frame(ctx, THRUST, Math.floor(f * 8), x + fx.dirX * 4, y + fx.dirY * 4, fx.size * 1.25, a, 0.02);
  if (f < 0.4) additive(ctx, () => glow(ctx, x + fx.dirX * fx.size, y + fx.dirY * fx.size, 5, LN.white, 0.6 * (1 - f / 0.4), 0.6));
}

export function drawLunaticFx(ctx: Ctx, fx: EffectState, snapPx: Snap): boolean {
  if (!LN_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const k = Math.floor(f * 8);
  const x = snapPx(fx.x);
  const y = snapPx(fx.y);
  const al = 1 - f;
  if (fx.kind === "lnThrustFx") thrust(ctx, fx, x, y, f);
  else if (fx.kind === "lnSlashFx") {
    // 빠르게 (효과 시간 짧음) · 반지름의 2.6배 크기 · 아래 흰 번쩍임
    additive(ctx, () => {
      glow(ctx, x, y, fx.size * 1.1, LN.blue, 0.35 * al, 0.3);
      if (f < 0.25) glow(ctx, x, y, fx.size * 0.6, LN.white, 0.8 * (1 - f * 4), 0.8);
    });
    frame(ctx, SLASH, k, x, y - 4, fx.size * 2.6, 0, 0.5);
  } else if (fx.kind === "lnDashFx") {
    additive(ctx, () => {
      beam(ctx, x - fx.dirX * 18, y - 4 - fx.dirY * 18, x + fx.dirX * 10, y - 4 + fx.dirY * 10, 3 * al, LN.blue, al);
      sparks(ctx, x, y - 4, 5, 14, f, LN.moon, Math.round(fx.x * 3 + fx.y), al);
    });
  } else if (fx.kind === "lnAwakeFx") {
    additive(ctx, () => {
      glow(ctx, x, y - 8, 30 * al + 10, LN.moon, 0.7 * al, 0.7);
      shock(ctx, x, y, fx.size * easeOut(f) * 1.3, LN.blue, al, 4);
      shock(ctx, x, y, fx.size * easeOut(f), LN.white, al, 2);
    });
    frame(ctx, SLASH, k, x, y - 6, fx.size * 2.4, 0, 0.5, al);
  } else if (fx.kind === "lnCrescentFx") {
    // 몸 둘레를 한 바퀴 도는 초승달 칼자국
    const a = Math.atan2(fx.dirY, fx.dirX) + f * Math.PI * 2;
    additive(ctx, () => {
      crescent(ctx, x, y - 4, fx.size, a, 1.3, 7, LN.moon, al);
      crescent(ctx, x, y - 4, fx.size * 0.8, a + Math.PI, 1, 4, LN.blue, al * 0.7);
    });
  } else if (fx.kind === "lnRainFx") {
    additive(ctx, () => {
      glow(ctx, x, y, fx.size, LN.blue, 0.5 * al, 0.4);
      shock(ctx, x, y, fx.size * easeOut(f), LN.moon, al, 1.5);
      crescent(ctx, x, y - 2, fx.size * 0.6, -Math.PI / 2, 1.1, 3, LN.white, al);
    });
  } else if (fx.kind === "lnAfterFx") {
    const tx = snapPx(fx.toX ?? fx.x);
    const ty = snapPx(fx.toY ?? fx.y);
    additive(ctx, () => {
      beam(ctx, x, y - 4, tx, ty - 4, fx.size * 0.6 * al, LN.blue, al);
      sparks(ctx, (x + tx) / 2, (y + ty) / 2 - 4, 8, 24, f, LN.moon, Math.round(fx.x + fx.y * 7), al);
    });
  } else if (fx.kind === "lnMarkFx") crosshair(ctx, x, y, 6 + 14 * (1 - easeOut(f)), f * 40, al);
  return true;
}
