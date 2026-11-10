// 미카엘라 속성 폭발 모양 (무기 속성마다 다른 터짐): 성은 은빛 충격파 · 빙결 얼음 가시 · 홍염 불기둥 · 혈월 붉은 X 베기 · 천광 빛 십자 · 자전 번개 갈래 · 비취 독 거품 · 청해 물결 고리
import { additive, alpha, beam, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import { palOf } from "./michaelaArt";

/** 번개 갈래 한 줄: (x,y)→(tx,ty) 지그재그 */
export function bolt(ctx: Ctx, x: number, y: number, tx: number, ty: number, c: string, al: number, seed: number): void {
  const n = 5;
  ctx.strokeStyle = alpha(c, al);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1; i < n; i++) {
    const u = i / n;
    const j = (rnd(seed, i) - 0.5) * 10;
    ctx.lineTo(x + (tx - x) * u - ((ty - y) / Math.max(1, Math.hypot(tx - x, ty - y))) * j, y + (ty - y) * u + ((tx - x) / Math.max(1, Math.hypot(tx - x, ty - y))) * j);
  }
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

/** 폭발 (속성 v · 진행 f · 사라짐 fade · 연쇄면 조금 작고 보라 테두리) */
export function elemBlast(ctx: Ctx, x: number, y: number, r: number, v: number, f: number, fade: number, seed: number, chain: boolean): void {
  const P = palOf(v);
  const k = easeOut(f);
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.2, P.glow, fade, 0.9);
    shock(ctx, x, y, r * k + 3, P.glow, fade * 0.8, 7);
    if (chain) shock(ctx, x, y, r * k * 0.7 + 2, "#c8b0ff", fade * 0.6, 4);
    if (v === 1) {
      // 얼음 가시: 바깥으로 솟는 가는 삼각형
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + rnd(seed, i) * 0.4;
        const d = r * k;
        ctx.fillStyle = alpha(P.blade, fade);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6);
        ctx.lineTo(x + Math.cos(a + 0.12) * d * 0.4, y + Math.sin(a + 0.12) * d * 0.25);
        ctx.lineTo(x + Math.cos(a - 0.12) * d * 0.4, y + Math.sin(a - 0.12) * d * 0.25);
        ctx.fill();
      }
    } else if (v === 2) {
      // 불기둥: 위로 솟는 불꽃 혀
      for (let i = 0; i < 6; i++) {
        const ox = (rnd(seed, i) - 0.5) * r;
        const h = r * (0.8 + rnd(i, seed)) * k;
        beam(ctx, x + ox, y, x + ox * 0.6, y - h, 3, i % 2 ? P.glow : P.trim, fade);
      }
    } else if (v === 3) {
      // 혈월: 붉은 X 베기 자국
      crescent(ctx, x, y, r * 0.9, -0.8, 0.7 * k + 0.1, 5, P.trim, fade);
      crescent(ctx, x, y, r * 0.9, Math.PI - 0.8, 0.7 * k + 0.1, 5, P.trim, fade);
    } else if (v === 4) {
      // 천광: 빛 십자 기둥
      beam(ctx, x, y + 4, x, y - r * 1.4 * k, 3, P.trim, fade);
      beam(ctx, x - r * 0.45, y - r * 0.9 * k, x + r * 0.45, y - r * 0.9 * k, 2.5, P.trim, fade);
    } else if (v === 5) {
      // 자전: 바깥으로 갈라지는 번개
      for (let i = 0; i < 5; i++) {
        const a = rnd(seed, i) * Math.PI * 2;
        bolt(ctx, x, y, x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.6, i % 2 ? P.glow : "#ffffff", fade, seed + i);
      }
    } else if (v === 6) {
      // 비취: 독 거품이 부풀어 오름
      for (let i = 0; i < 7; i++) {
        const a = rnd(seed, i) * Math.PI * 2;
        const d = r * 0.7 * rnd(i, seed);
        glow(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6 - f * 10, 5 + 6 * k, P.blade, fade * 0.8);
      }
    } else if (v === 7) {
      // 청해: 물결 고리 둘 + 물방울
      shock(ctx, x, y, r * k * 1.15 + 2, P.blade, fade * 0.7, 4);
      sparks(ctx, x, y, 10, r * 1.1, f, P.blade, seed, fade);
    } else sparks(ctx, x, y, 12, r * 1.2, f, "#ffffff", seed, fade);
  });
}
