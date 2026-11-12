// 쉐도잉 그리기: 바닥 먹 획(그리는 중엔 밝게 일렁이고 사라질수록 흐려짐) · 바닥 자리(두루마리 용·연꽃·달·유성·소용돌이) · 날아가는 것 · 붓 커서 · 발밑 잉크
// 효과 그림 sprites/shadowingFx.webp (192칸 4프레임 × 21줄, 검은 바탕은 밝기만큼 투명, 줄 번호 SD_ROW · scripts/art/shadowing.py) · 붓 sprites/shadowingBrush.png
import { inkOf, SD_ROW, SHADOW_INK, type InkSpirit, type InkStroke, type InkZone, type RunState } from "@pixel-rogue/shared";
import { additive, alpha as fade, glow, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { img } from "./lunaticFx";
import { lazyImg } from "../lazyImage";

export const SD = { ink: "#1c1a2e", navy: "#1a2560", soul: "#7a9aff", pale: "#d8e4ff", lilac: "#c8a0ff", gold: "#ffd27a" };
const FX = lazyImg(`${import.meta.env.BASE_URL}sprites/shadowingFx.webp`);
const BRUSH = img("shadowingBrush");
const ready = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;
const CELL = 192;

/** 효과 그림 한 칸 (줄 row · 프레임 0~3) → (x, y) 가운데에 너비 w로 */
export function sdFx(ctx: Ctx, row: number, frame: number, x: number, y: number, w: number, a = 1, angle = 0): void {
  if (!ready(FX) || a <= 0 || w <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, Math.max(0, Math.min(3, Math.floor(frame))) * CELL, row * CELL, CELL, CELL, -w / 2, -w / 2, w, w);
  ctx.restore();
}

/** 먹 획 하나: 겉 푸른 빛 · 먹 · 가운데 밝은 줄 (봉인은 안쪽을 옅게 칠함) */
function strokeLine(ctx: Ctx, k: InkStroke, tick: number, snap: Snap): void {
  const pts = k.pts;
  if (pts.length < 2) return;
  const a = k.end < 0 ? 1 : Math.max(0, Math.min(1, (k.end - tick) / 40));
  if (a <= 0) return;
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(snap(pts[0]!), snap(pts[1]!));
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(snap(pts[i]!), snap(pts[i + 1]!));
  };
  const hue = k.wing ? SD.lilac : k.shape === 1 ? SD.lilac : SD.soul;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (k.shape === 1) {
    path();
    ctx.fillStyle = fade(SD.lilac, 0.12 * a);
    ctx.fill();
  }
  const wob = k.end < 0 ? 1 + Math.sin(tick * 0.4) * 0.15 : 1;
  additive(ctx, () => {
    path();
    ctx.strokeStyle = fade(hue, 0.5 * a);
    ctx.lineWidth = SHADOW_INK.width * 2.2 * wob;
    ctx.stroke();
  });
  path();
  ctx.strokeStyle = fade(SD.navy, 0.9 * a);
  ctx.lineWidth = SHADOW_INK.width * 0.9;
  ctx.stroke();
  additive(ctx, () => {
    path();
    ctx.strokeStyle = fade(SD.pale, 0.95 * a);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // 획 위 반짝이는 별가루
    for (let i = 0; i < pts.length; i += 8) {
      const tw = 0.5 + 0.5 * Math.sin(tick * 0.25 + i * 1.7);
      ctx.fillStyle = fade(i % 16 ? SD.pale : SD.lilac, tw * a);
      ctx.fillRect(snap(pts[i]!) - 1, snap(pts[i + 1]!) - 1 - ((tick + i) % 20) * 0.3, 2, 2);
    }
  });
  ctx.restore();
  // 붓 끝 먹물 방울
  if (k.end < 0) additive(ctx, () => glow(ctx, snap(pts[pts.length - 2]!), snap(pts[pts.length - 1]!), 9, SD.soul, 0.8, 0.6));
}

/** 바닥 자리: 그림 줄이 지나간 만큼 프레임이 넘어감 (delay면 끝날 때 가장 큼) */
function zone(ctx: Ctx, z: InkZone, tick: number, snap: Snap): void {
  const f = z.age / Math.max(1, z.life);
  const x = snap(z.x);
  const y = snap(z.y);
  if (z.row === SD_ROW.vortex) {
    sdFx(ctx, z.row, (tick / 6) % 4, x, y, z.r * 2.6, 0.9, tick * 0.08);
    return;
  }
  if (z.row === SD_ROW.lotus) {
    sdFx(ctx, z.row, Math.min(3, f * 6), x, y, z.r * 2.4, f > 0.85 ? (1 - f) / 0.15 : 0.9);
    return;
  }
  // 떨어지는 달·유성: 위에서 내려옴 · 두루마리 용: 펼쳐지며 솟음
  const drop = z.row === SD_ROW.moon || z.row === SD_ROW.meteor ? (1 - f) * 60 : 0;
  additive(ctx, () => glow(ctx, x, y, z.r, z.row === SD_ROW.meteor ? "#ff6ad8" : SD.soul, 0.25 + f * 0.35));
  sdFx(ctx, z.row, f * 3.9, x, y - drop, z.r * 2.4, 0.4 + f * 0.6);
}

/** 날아가는 것: 그림 줄마다 크기·돌림 */
function spirit(ctx: Ctx, sp: InkSpirit, tick: number, snap: Snap): void {
  const ang = Math.atan2(sp.vy, sp.vx);
  const x = snap(sp.x);
  const y = snap(sp.y);
  const turnable = sp.row === SD_ROW.sword || sp.row === SD_ROW.comet;
  const size = sp.row === SD_ROW.dragon ? 54 : sp.row === SD_ROW.butterfly ? 24 : sp.row === SD_ROW.sword ? 34 : 38;
  const frame = sp.row === SD_ROW.dragon ? 0 : sp.row === SD_ROW.comet || sp.row === SD_ROW.sword ? 2 + ((tick >> 3) % 2) : (tick >> 3) % 4;
  // 용 머리는 오른쪽을 봄 → 가는 쪽으로 돌림 (왼쪽이면 뒤집지 않고 돌림만)
  sdFx(ctx, sp.row, frame, x, y, size, 1, turnable || sp.row === SD_ROW.dragon ? ang : 0);
  additive(ctx, () => glow(ctx, x, y, sp.r + 4, SD.soul, 0.4));
}

/** 바닥: 획 · 자리 (적보다 아래) */
export function drawShadowingGround(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "shadowing") return;
  for (const z of p.sdZones ?? []) zone(ctx, z, s.tick, snap);
  for (const k of p.sdStrokes ?? []) strokeLine(ctx, k, s.tick, snap);
}

/** 공중: 날아가는 것 · 붓 커서(붓 끝이 그리는 자리) · 발밑 잉크 줄 */
export function drawShadowingAir(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "shadowing") return;
  for (const sp of p.sdSpirits ?? []) spirit(ctx, sp, s.tick, snap);
  // 발밑 잉크 줄 (다 차 있으면 숨김)
  const ink = inkOf(p) / SHADOW_INK.ink;
  if (ink < 0.999) {
    const x = snap(p.x) - 8;
    const y = snap(p.y) + p.r + 3;
    ctx.fillStyle = fade(SD.ink, 0.8);
    ctx.fillRect(x - 1, y - 1, 18, 3);
    ctx.fillStyle = (p.sdClockT ?? 0) > 0 ? SD.gold : ink < SHADOW_INK.restart / SHADOW_INK.ink ? "#ff6a8a" : SD.soul;
    ctx.fillRect(x, y, Math.round(16 * ink), 1);
  }
  if (p.sdBx === undefined || p.sdBy === undefined || s.over) return;
  drawBrush(ctx, snap(p.sdBx), snap(p.sdBy), s.tick);
}

/** 붓 커서: 보석 붓 그림, 털 끝이 (x, y)에 닿게 기울여 그림 */
function drawBrush(ctx: Ctx, x: number, y: number, tick: number): void {
  additive(ctx, () => glow(ctx, x, y, 7 + Math.sin(tick * 0.2), SD.soul, 0.9, 0.8));
  if (!ready(BRUSH)) return;
  const w = 38;
  const k = w / 128;
  // 첫 칸: 털이 위(왼쪽 위로 휨) · 털 끝 = 칸 가운데에서 (-19, -56) → 붓을 거꾸로 기울여 털 끝이 아래를 보게
  const ang = Math.PI * 0.82;
  const tx = -19 * k;
  const ty = -56 * k;
  const c = Math.cos(ang);
  const sn = Math.sin(ang);
  ctx.save();
  ctx.translate(x - (tx * c - ty * sn), y - (tx * sn + ty * c));
  ctx.rotate(ang);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(BRUSH, 0, 0, 128, 128, -w / 2, -w / 2, w, w);
  ctx.restore();
}
