// 미류 기술 효과 — 시원하게 뻥 뚫리는 물의 칼 (맑은 바다 · 하늘색 물빛 · 흰 거품 · 얼음빛)
// 물결 휩쓸기 · 해룡 일섬 · 회오리 베기 · 휘는 물 채찍 · 탄 흘림 · 물칼날 되돌림·맞음 · 게이지 가득 · 천류 해방 · 폭포 · 물길 솟구침 · 얼음 깨짐
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { glints, rays } from "./seaLight";
import { bendWhip, fallColumn, MR, slashBand } from "./miryuArt";
import { edgeGlint, helix, partWalls, tangentSpray } from "./miryuBits";
import { droplets } from "./thorkenFx";
import { crown } from "./tailArt";

const MR_FX = new Set(["mrCut", "mrFlash", "mrWhirl", "mrBend", "mrCatch", "mrLoose", "mrSlice", "mrReady", "mrRelease", "mrFall", "mrBurst", "mrShatter"]);
const drops = (ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 12) => droplets(ctx, x, y, r, f, seed, n, MR.aqua, MR.foam);
const splash = (ctx: Ctx, x: number, y: number, r: number, f: number, seed: number, n = 11) => crown(ctx, x, y, r, f, seed, n, MR.aqua, MR.foam);

/** 칼끝에서 바깥으로 흩어지는 물살 줄 (a 방향 둘레) */
function flingLines(ctx: Ctx, x: number, y: number, a: number, spread: number, r0: number, r1: number, seed: number, n: number, al: number): void {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const b = a + (rnd(seed, i) - 0.5) * spread;
      const u = rnd(i, seed);
      ctx.strokeStyle = alpha(i % 3 ? MR.aqua : MR.foam, al * (0.5 + u * 0.5));
      ctx.lineWidth = i % 3 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(b) * r0, y + Math.sin(b) * r0);
      ctx.lineTo(x + Math.cos(b) * (r0 + (r1 - r0) * (0.6 + u * 0.4)), y + Math.sin(b) * (r0 + (r1 - r0) * (0.6 + u * 0.4)));
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
}

export function drawMiryuFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!MR_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.45 ? 1 : 1 - (f - 0.45) / 0.55;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = fx.x * 7 + fx.y * 3;
  const r = fx.size;
  switch (fx.kind) {
    case "mrCut": {
      // 물결 휩쓸기: 칼끝이 한쪽에서 반대쪽으로 크게 지나가며 물 띠를 끌고 감 · 끝에서 물보라가 바깥으로 흩어짐
      const side = fx.style ?? 1;
      const arc = fx.arc ?? 1.4;
      const a0 = a + side * arc;
      const a1 = a - side * arc;
      const k = easeOut(Math.min(1, f / 0.32));
      const cur = a0 + (a1 - a0) * k;
      additive(ctx, () => glow(ctx, x, y, r * 1.1, MR.sea, 0.25 * fade));
      slashBand(ctx, x, y, r, a0 + (a1 - a0) * Math.max(0, k - 0.75), cur, 9 + 6 * (1 - f), fade);
      slashBand(ctx, x, y, r * 0.72, a0 + (a1 - a0) * Math.max(0, k - 0.55), cur, 4, fade * 0.6);
      if (k < 1) {
        const tx = x + Math.cos(cur) * r;
        const ty = y + Math.sin(cur) * r;
        flingLines(ctx, tx, ty, cur - (side * Math.PI) / 2, 1.2, 2, 14, seed + k * 9, 5, 1 - k);
      }
      edgeGlint(ctx, x, y, r, a0, cur, f < 0.12 ? 1 : Math.max(0, 1 - (f - 0.12) / 0.25));
      tangentSpray(ctx, x, y, r, a0, a1, f, seed, 14);
      return true;
    }
    case "mrFlash": {
      // 해룡 일섬: 순간 흰 빛줄기 → 굵은 물줄기가 길게 터져 나가고, 줄을 따라 물보라 왕관이 차례로 솟음
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const len = Math.hypot(tx - x, ty - y) || 1;
      const k = easeOut(Math.min(1, f / 0.25));
      const ex = x + (tx - x) * k;
      const ey = y + (ty - y) * k;
      const w = (fx.size ?? 14) * (f < 0.1 ? 0.35 : 1 - f * 0.6);
      partWalls(ctx, x, y, tx, ty, f, fade);
      additive(ctx, () => {
        ctx.lineCap = "round";
        for (const [c, ww, al] of [[MR.deep, w * 2.4, 0.35], [MR.sea, w * 1.4, 0.6], [MR.aqua, w * 0.7, 0.9], [MR.foam, Math.max(1, w * 0.22), 1]] as const) {
          ctx.strokeStyle = alpha(c, al * fade);
          ctx.lineWidth = ww;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
        ctx.lineCap = "butt";
        if (f < 0.3) glow(ctx, ex, ey, 22, MR.foam, 1 - f / 0.3, 1.5);
        if (f < 0.3) rays(ctx, ex, ey, 18, 6, 1 - f / 0.3, seed, MR.foam, a);
      });
      const n = Math.max(3, Math.round(len / 22));
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n;
        const lf = (f - u * 0.25) / 0.75;
        if (lf <= 0 || lf >= 1) continue;
        splash(ctx, x + (tx - x) * u, y + (ty - y) * u + 3, 9, lf, seed + i, 7);
      }
      return true;
    }
    case "mrWhirl": {
      // 회오리 베기: 한 바퀴 도는 물 띠 두 겹 · 바깥으로 튀는 물보라 · 가운데 소용돌이 빛
      const k = easeOut(Math.min(1, f / 0.4));
      const a0 = a;
      slashBand(ctx, x, y, r, a0 + Math.PI * 2 * Math.max(0, k - 0.6), a0 + Math.PI * 2 * k, 10, fade);
      slashBand(ctx, x, y, r * 0.65, a0 + Math.PI + Math.PI * 2 * Math.max(0, k - 0.6), a0 + Math.PI + Math.PI * 2 * k, 5, fade * 0.7);
      additive(ctx, () => {
        glow(ctx, x, y, r * 0.8, MR.sea, 0.35 * fade);
        shock(ctx, x, y, r * (0.6 + f * 0.6), MR.aqua, 0.6 * fade, 4);
      });
      if (f > 0.3) drops(ctx, x, y, r, (f - 0.3) / 0.7, seed, 16);
      return true;
    }
    case "mrBend": {
      // 휘는 물 채찍: 칼끝에서 곡선을 그리며 적까지 뻗고 닿은 자리에 물보라
      const k = easeOut(Math.min(1, f / 0.35));
      bendWhip(ctx, x, y, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), fx.dirX, fx.dirY, k, fade, seed);
      if (f > 0.2) tangentSpray(ctx, (x + snap(fx.toX ?? fx.x)) / 2, (y + snap(fx.toY ?? fx.y)) / 2, 4, a - 0.6, a + 0.6, (f - 0.2) / 0.8, seed, 6);
      if (f > 0.3) drops(ctx, snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), 10, (f - 0.3) / 0.7, seed, 8);
      return true;
    }
    case "mrCatch": {
      // 흘리기: 잡힌 탄 자리에 물결 고리 → 물방울이 휘어 미류에게 빨려 들어감
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      additive(ctx, () => {
        if (f < 0.5) shock(ctx, x, y, 4 + f * 18, MR.aqua, 1 - f * 2, 2);
        const k = easeOut(f);
        const mx = (x + tx) / 2 - (ty - y) * 0.35;
        const my = (y + ty) / 2 + (tx - x) * 0.35;
        const px = (1 - k) ** 2 * x + 2 * (1 - k) * k * mx + k * k * tx;
        const py = (1 - k) ** 2 * y + 2 * (1 - k) * k * my + k * k * ty;
        glow(ctx, px, py, 5, f < 0.25 ? "#ff9a5a" : MR.aqua, 1 - f * 0.5, 1);
      });
      return true;
    }
    case "mrLoose": {
      // 물칼날 되돌림: 칼 앞에서 부채꼴 물빛이 터짐
      additive(ctx, () => {
        glow(ctx, x + fx.dirX * 10, y + fx.dirY * 10, 20, MR.aqua, fade, 1.2);
        rays(ctx, x + fx.dirX * 10, y + fx.dirY * 10, 22, 5 + Math.min(5, r), fade, seed, MR.foam, a);
      });
      return true;
    }
    case "mrSlice": {
      // 물칼날 맞음: 짧은 X자 물 베기
      additive(ctx, () => {
        ctx.lineCap = "round";
        for (const s of [-1, 1]) {
          const b = a + s * 0.7;
          ctx.strokeStyle = alpha(MR.foam, fade);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(b) * r * 0.6, y - Math.sin(b) * r * 0.6);
          ctx.lineTo(x + Math.cos(b) * r * 0.6, y + Math.sin(b) * r * 0.6);
          ctx.stroke();
        }
        ctx.lineCap = "butt";
        glow(ctx, x, y, r, MR.aqua, fade * 0.8);
      });
      return true;
    }
    case "mrReady": {
      // 게이지 가득: 물 고리 둘이 퍼지고 반짝임
      additive(ctx, () => {
        shock(ctx, x, y - 4, 6 + easeOut(f) * r, MR.aqua, 1 - f, 3);
        shock(ctx, x, y - 4, 4 + easeOut(f) * r * 0.6, MR.foam, 1 - f, 2);
      });
      glints(ctx, x, y - 6, 18, 5, Math.round(f * 30), seed, MR.foam, 1 - f);
      return true;
    }
    case "mrRelease": {
      // 천류 해방: 칼끝에서 물기둥이 하늘로 치솟고 큰 물 고리 · 빛줄기
      const k = easeOut(Math.min(1, f / 0.4));
      fallColumn(ctx, x, y, 18 * (1 - f * 0.5), 110 * k, Math.round(f * 60), fade);
      helix(ctx, x, y, 110 * k, 14 * (1 - f * 0.3), Math.round(f * 40), fade);
      additive(ctx, () => {
        shock(ctx, x, y, 10 + k * r * 1.6, MR.aqua, fade, 5);
        shock(ctx, x, y, 6 + k * r, MR.foam, fade * 0.8, 3);
        glow(ctx, x, y, r * 1.2, MR.sea, 0.5 * fade, 0.8);
        rays(ctx, x, y - 10, r * 1.4, 10, fade, seed, MR.foam);
      });
      drops(ctx, x, y, r, f, seed, 18);
      return true;
    }
    case "mrFall": {
      // 폭포: 하늘에서 거대한 물줄기가 쏟아져 내리꽂힘 → 큰 물보라 왕관 · 겹친 충격파 · 물안개
      const pour = Math.min(1, f / 0.3);
      if (f < 0.55) fallColumn(ctx, x, y, r * 0.7 * (1 - f * 0.6), 160 * pour, Math.round(f * 80), f < 0.4 ? 1 : 1 - (f - 0.4) / 0.15);
      const hit = Math.max(0, (f - 0.2) / 0.8);
      if (hit > 0) {
        additive(ctx, () => {
          shock(ctx, x, y, easeOut(hit) * r, MR.aqua, 1 - hit, 7);
          shock(ctx, x, y, easeOut(hit) * r * 0.7, MR.foam, 1 - hit, 4);
          shock(ctx, x, y, easeOut(Math.min(1, hit * 1.5)) * r * 1.2, MR.sea, (1 - hit) * 0.5, 3);
          glow(ctx, x, y, r, MR.sea, 0.4 * (1 - hit));
        });
        splash(ctx, x, y, r * 0.8, hit, seed, 15);
        drops(ctx, x, y, r * 1.1, hit, seed, 24);
        sparks(ctx, x, y, 14, r, hit, MR.foam, seed, 1 - hit);
        additive(ctx, () => glow(ctx, x, y - 8, r * (0.6 + hit * 0.8), MR.ice, 0.3 * Math.sin(hit * Math.PI)));
      }
      return true;
    }
    case "mrBurst": {
      // 물길이 솟구쳐 터짐 (폭포·해방 마무리): 작은 물기둥 + 왕관
      const up = Math.sin(Math.min(1, f * 1.6) * Math.PI);
      if (up > 0.02) fallColumn(ctx, x, y, r * 0.7, r * 2.2 * up, Math.round(f * 40), up);
      splash(ctx, x, y, r, f, seed, 9);
      return true;
    }
    case "mrShatter": {
      // 얼음 깨짐: 흰 얼음 조각이 튀고 얼음빛 고리
      additive(ctx, () => shock(ctx, x, y, 4 + easeOut(f) * r, MR.ice, 1 - f, 3));
      sparks(ctx, x, y, 9, r * 1.3, f, MR.ice, seed, 1 - f);
      for (let i = 0; i < 5; i++) {
        const b = rnd(seed, i) * Math.PI * 2;
        const d = easeOut(f) * r * (0.6 + rnd(i, seed) * 0.6);
        ctx.fillStyle = alpha(i % 2 ? MR.foam : MR.ice, 1 - f);
        ctx.fillRect(Math.round(x + Math.cos(b) * d), Math.round(y + Math.sin(b) * d - (1 - f) * 4), 2, 2);
      }
      return true;
    }
  }
  return true;
}
