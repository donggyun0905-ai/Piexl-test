// 블루 플레임 그리기 (몸 뒤 · 몸 위): 늘 보이는 세 겹 범위 테두리 (안쪽 진한 파랑 · 가운데 연한 파랑 · 바깥 더 연한 파랑) · 푸른 날개 (몸 뒤)
// 적 머리 위 청염 표시 (아래 진한 파랑 → 위 옅게) · 날아가는 화살 · 머리 위에서 앞쪽 바닥으로 비스듬히 떨어지는 화살비 · 활 쏘기 (사용자 그림 8프레임) · 머리 위 활들
// 그림: sprites/blueFlame_bow·bigArrow·wing ← scripts/art/blueFlame_fx.py · 각성(열화상)은 render/blueFlameUlt
import { BLUE_FLAME, bzRings, isBlueFlame, type RunState } from "@pixel-rogue/shared";
import { ringCells } from "../aimMark";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { spriteImg } from "../lazyImage";

export const BZ = { deep: "#1238d8", blue: "#2a7aff", light: "#7ac8ff", pale: "#c8f0ff", dark: "#06091a" };

const img = (name: string) => spriteImg(name);
export const BZ_IMG = { bow: img("blueFlame_bow"), prison: img("blueFlame_prison"), pillar: img("blueFlame_pillar"), bomb: img("blueFlame_bomb"), bigBow: img("blueFlame_bigBow"), arrow: img("blueFlame_bigArrow"), wing: img("blueFlame_wing") };
export const ready = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;

/** 8프레임 그림 한 칸 (가운데 x,y · 한 변 size · 돌림 a) */
export function frame(ctx: Ctx, sheet: HTMLImageElement, k: number, x: number, y: number, size: number, a = 0, al = 1): void {
  if (!ready(sheet)) return;
  const c = sheet.naturalHeight;
  ctx.save();
  ctx.globalAlpha *= al;
  ctx.translate(x, y);
  if (a) ctx.rotate(a);
  ctx.drawImage(sheet, Math.max(0, Math.min(7, k)) * c, 0, c, c, -size / 2, -size / 2, size, size);
  ctx.restore();
}

/** 화살 그림 (머리 x,y · 방향 a · 길이 len) */
export function arrowImg(ctx: Ctx, x: number, y: number, a: number, len: number, al = 1): void {
  const i = BZ_IMG.arrow;
  if (!ready(i)) return;
  const h = (len * i.naturalHeight) / i.naturalWidth;
  ctx.save();
  ctx.globalAlpha *= al;
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.drawImage(i, -len, -h / 2, len, h);
  ctx.restore();
}

/** 세 겹 범위: 안쪽 원판·띠 둘 (옅은 채움) + 도트 테두리 */
function rings(ctx: Ctx, s: RunState, x: number, y: number): void {
  // 테두리만 옅게 (안쪽 채움 없음, 2026-11-08 사용자 지시: 안쪽 색이 적을 가림) · 안쪽일수록 진한 파랑
  const r = bzRings(s.player);
  const edge: [number, string, number][] = [[r[0], BZ.blue, 0.3], [r[1], BZ.light, 0.22], [r[2], BZ.pale, 0.16]];
  for (const [rr, c, al] of edge) {
    ctx.fillStyle = alpha(c, al);
    for (const [px, py] of ringCells(Math.round(rr))) ctx.fillRect(x + px, y + py, 1, 1);
  }
}

/** 청염 표시: 작은 도트 불꽃 (아래 진한 파랑 → 위 옅게, 살짝 일렁임) */
function flameMark(ctx: Ctx, x: number, y: number, t: number): void {
  const rows = ["..P..", ".PL..", ".LLB.", "LBBBL", "BDDDB", ".DDD."];
  const col: Record<string, string> = { P: BZ.pale, L: BZ.light, B: BZ.blue, D: BZ.deep };
  const sway = Math.round(Math.sin(t * 0.25));
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === ".") return;
    ctx.fillStyle = col[ch]!;
    ctx.fillRect(x + i + (j < 3 ? sway : 0), y + j, 1, 1);
  }));
}

/** 몸 뒤: 세 겹 범위 (각성 중엔 숨김) · 푸른 날개 */
export function drawBlueFlameBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBlueFlame(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (!p.bzUlt) rings(ctx, s, Math.round(x), Math.round(y));
  if (p.bzWing && ready(BZ_IMG.wing)) {
    const gone = BLUE_FLAME.wingTicks - p.bzWing;
    const k = Math.min(1, gone / 8, p.bzWing / 10);
    const flap = 1 + 0.06 * Math.sin(s.tick * 0.4);
    const w = 56 * k * flap;
    const h = (w * BZ_IMG.wing.naturalHeight) / BZ_IMG.wing.naturalWidth;
    additive(ctx, () => glow(ctx, x, y - 12, 26 * k, BZ.blue, 0.35 * k));
    ctx.globalAlpha = 0.95 * k;
    ctx.drawImage(BZ_IMG.wing, x - w / 2, y - 14 - h / 2, w, h);
    ctx.globalAlpha = 1;
  }
}

/** 몸 위: 청염 표시 · 날아가는 화살·화살비 · 활 쏘기 · 머리 위 활들 */
export function drawBlueFlameAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (s.over) return;
  // 청염 표시: 블루 플레임 · 백령(청혼불)
  if (isBlueFlame(p) || p.characterId === "baekryeong") for (const e of s.enemies) if ((e.bzFlameT ?? 0) > 0 && e.hp > 0) flameMark(ctx, snap(e.x) - 2, snap(e.y) - e.r - 16, s.tick + e.id);
  if (!isBlueFlame(p)) return;
  for (const b of p.bzStrikes ?? []) {
    const f = 1 - b.t / b.T;
    if (b.k === 2) {
      const x = lerp(b.x0, b.x, f);
      const y = lerp(b.y0, b.y, f);
      additive(ctx, () => glow(ctx, x, y, 6, BZ.blue, 0.45));
      arrowImg(ctx, snap(x), snap(y), Math.atan2(b.y - b.y0, b.x - b.x0), 22);
    } else if (b.k === 3) {
      // 머리 위에서 앞쪽 바닥으로: 낮은 포물선 (수직이 아니라 비스듬히)
      const arc = (q: number) => [lerp(b.x0, b.x, q), lerp(b.y0, b.y, q) - Math.sin(q * Math.PI) * 16] as const;
      const [x, y] = arc(f);
      const [nx, ny] = arc(Math.min(1, f + 0.05));
      additive(ctx, () => glow(ctx, x, y, 5, BZ.light, 0.4));
      arrowImg(ctx, snap(x), snap(y), Math.atan2(ny - y, nx - x), 16);
    }
  }
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (p.bzUlt) return;
  // 활 쏘기: 몸 앞에서 푸른 불꽃 활이 생겨 당기고 쏨 (그림 8프레임)
  for (const fx of s.effects) {
    if (fx.kind !== "bzBowFx" || (fx.seat ?? 0) !== (s.seat ?? 0)) continue;
    const k = Math.floor((1 - fx.ticks / fx.maxTicks) * 8);
    additive(ctx, () => frame(ctx, BZ_IMG.bow, k, x + fx.dirX * 10, y - 6 + fx.dirY * 10, 34, Math.atan2(fx.dirY, fx.dirX)));
  }
  // 푸른 날개: 머리 위에 활들이 생기고 하나씩 쏘면 사라짐
  if (p.bzWing) {
    const gone = BLUE_FLAME.wingTicks - p.bzWing;
    const n = BLUE_FLAME.rainCount;
    const left = p.bzRain ?? 0;
    const k = Math.min(7, Math.floor((gone / BLUE_FLAME.rainWait) * 4));
    for (let i = n - left; i < n; i++) {
      const ox = (i - (n - 1) / 2) * 7;
      const bx = x - p.faceY * ox;
      const by = y - 30 + p.faceX * ox * 0.3 - Math.abs(ox) * 0.15;
      // 앞쪽 바닥을 겨눔 (조금 아래로)
      additive(ctx, () => frame(ctx, BZ_IMG.bow, Math.min(k, 4), bx, by, 18, Math.atan2(p.faceY + 0.5, p.faceX)));
    }
  }
}
