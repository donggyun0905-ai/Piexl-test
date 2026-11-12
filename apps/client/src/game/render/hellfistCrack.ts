// 헬피스트 갈라진 땅 (2타 내려찍기로 생겨 3타까지 남음, sim의 player.hfCrack) · 3타 균열 파쇄 (금이 번쩍 → 붉은 유리 깨짐 그림)
// 금 모양은 생긴 틱(씨앗)으로 정해 남아 있는 금과 깨지는 금이 같음 · 내려찍기 부채꼴(폭발 범위) 전체에 좌우로 넓게 퍼짐
import type { EffectState, HfCrack } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, type Ctx } from "./pwFxBits";
import { lazyImg } from "../lazyImage";

const RED = "#ff2a2a";
const SHEET = lazyImg(`${import.meta.env.BASE_URL}sprites/hellfist_shatter.png`);
type Pt = [number, number];

/** 금 줄들: 부채꼴 폭 전체에 굵은 금 + 곁가지 (지그재그) */
export function crackLines(c: Pick<HfCrack, "x" | "y" | "dx" | "dy" | "r" | "cos" | "t">): Pt[][] {
  const a = Math.atan2(c.dy, c.dx);
  const half = Math.acos(Math.max(-1, Math.min(1, c.cos))) * 1.1;
  const out: Pt[][] = [];
  const n = 13;
  for (let i = 0; i < n; i++) {
    const ang0 = a - half + (2 * half * (i + 0.5)) / n + (rnd(c.t, i) - 0.5) * 0.12;
    const len = c.r * (0.7 + 0.3 * rnd(i, c.t + 3));
    const line: Pt[] = [[c.x + Math.cos(ang0) * 6, c.y + Math.sin(ang0) * 6]];
    const steps = 5;
    for (let k = 1; k <= steps; k++) {
      const ang = ang0 + (rnd(c.t + k, i * 7) - 0.5) * 0.35;
      const d = (len * k) / steps;
      line.push([c.x + Math.cos(ang) * d, c.y + Math.sin(ang) * d]);
    }
    out.push(line);
    // 곁가지 (금 가운데에서 비스듬히)
    if (rnd(i, c.t + 9) > 0.35) {
      const [bx, by] = line[2 + (i % 2)]!;
      const ba = ang0 + (i % 2 ? 0.6 : -0.6);
      const bl = len * 0.3;
      out.push([[bx, by], [bx + Math.cos(ba) * bl * 0.5 + (rnd(i, 4) - 0.5) * 4, by + Math.sin(ba) * bl * 0.5], [bx + Math.cos(ba) * bl, by + Math.sin(ba) * bl]]);
    }
  }
  return out;
}

/** 줄 하나를 앞에서부터 g(0~1)만큼만 그림 */
function partial(ctx: Ctx, line: Pt[], g: number): void {
  const segs = line.length - 1;
  const upto = g * segs;
  ctx.beginPath();
  ctx.moveTo(line[0]![0], line[0]![1]);
  for (let k = 1; k <= segs; k++) {
    const [ax, ay] = line[k - 1]!;
    const [bx, by] = line[k]!;
    if (k <= upto) ctx.lineTo(bx, by);
    else {
      const u = upto - (k - 1);
      if (u > 0) ctx.lineTo(ax + (bx - ax) * u, ay + (by - ay) * u);
      break;
    }
  }
  ctx.stroke();
}

/** 남아 있는 갈라진 땅: 금이 점점 뻗고 벌어짐 (검은 틈 · 안쪽 붉은 빛) · 사라지기 전 흐려짐 */
export function drawCrack(ctx: Ctx, c: HfCrack, age: number, left: number): void {
  const g = easeOut(Math.min(1, age / 18));
  const wide = Math.min(1, age / 40);
  const al = Math.min(1, left / 30);
  if (al <= 0) return;
  const lines = crackLines(c);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [i, line] of lines.entries()) {
    const main = line.length > 3;
    ctx.strokeStyle = alpha("#120406", al);
    ctx.lineWidth = (main ? 1.5 + 2.5 * wide : 1 + wide) * (0.8 + 0.4 * rnd(i, c.t));
    partial(ctx, line, g);
  }
  additive(ctx, () => {
    for (const line of lines) {
      ctx.strokeStyle = alpha(RED, al * (0.5 + 0.3 * wide));
      ctx.lineWidth = 1;
      partial(ctx, line, g);
    }
  });
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
}

/** 균열 파쇄: 갈라진 금이 잠깐 붉게 번쩍 → 그 자리에 붉은 유리가 깨지는 그림 (사용자 그림 sprites/hellfist_shatter 8프레임: 금이 뻗고 → 유리 조각으로 흩어짐) */
export function drawShatter(ctx: Ctx, fx: EffectState, f: number): void {
  const c = { x: fx.x, y: fx.y, dx: fx.dirX, dy: fx.dirY, r: fx.size, cos: fx.arc ?? 0.1, t: fx.width ?? 0 };
  const flash = Math.max(0, 1 - f * 4);
  if (flash > 0) {
    const lines = crackLines(c);
    ctx.lineCap = "round";
    additive(ctx, () => {
      for (const line of lines) {
        ctx.strokeStyle = alpha(RED, flash);
        ctx.lineWidth = 2.5;
        partial(ctx, line, 1);
      }
    });
    ctx.lineCap = "butt";
  }
  if (!SHEET.complete || SHEET.naturalWidth === 0) return;
  const cell = SHEET.naturalHeight;
  const fr = Math.min(7, Math.floor(f * 8));
  const w = c.r * 2.1;
  const cx = c.x + c.dx * c.r * 0.5;
  const cy = c.y + c.dy * c.r * 0.5;
  additive(ctx, () => glow(ctx, cx, cy, c.r * 0.7, RED, 0.5 * (1 - f), 0.3));
  ctx.drawImage(SHEET, fr * cell, 0, cell, cell, Math.round(cx - w / 2), Math.round(cy - w / 2), Math.round(w), Math.round(w));
}
