// 펜리르 그리기 (2): 상태에서 바로 — 바닥을 그으며 나아가는 검기(3타 큰 검기·착지 검기) · 대지 가르기 균열 · 뛰어오른 동안 땅 그림자·떨어질 자리 문양
// · 늙은 늑대의 지혜(푸른 기운) · 사냥 본능(바람). 몸이 뜨는 높이는 fenrirBits.fenrirLift (render/actors)
import { isFenrir, type RunState } from "@pixel-rogue/shared";
import { BLUE, cracks, fenrirLift, ICE, SKY, slashArc, VIOLET } from "./fenrirBits";
import { additive, alpha, glow, rune, type Ctx } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

const TAU = Math.PI * 2;

/** 바닥 쪽 (몸보다 먼저): 균열 · 뛰어오른 동안 그림자와 떨어질 자리 */
export function drawFenrirBack(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isFenrir(p)) return;
  for (const c of p.fnCracks ?? []) {
    const pulse = 0.55 + 0.45 * Math.sin(s.tick * 0.3 + c.x);
    cracks(ctx, snap(c.x), snap(c.y + 3), 10, 3, Math.round(c.x * 3 + c.y), Math.min(1, c.t / 30), pulse * Math.min(1, c.t / 30));
  }
  if (!p.fnAir) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a) + p.r);
  const h = fenrirLift(p);
  // 높이 뜰수록 그림자는 작고 흐림 · 떨어질 자리에 도는 문양
  ctx.fillStyle = `rgba(10,10,24,${0.45 - h / 120})`;
  ctx.beginPath();
  ctx.ellipse(x, y, 10 - h / 6, 4 - h / 16, 0, 0, TAU);
  ctx.fill();
  rune(ctx, x, y, 18 + h / 3, SKY, 0.5 + h / 80, s.tick * 0.12);
}

/** 나아가는 검기 하나: 바닥에 누운 초승달 (big: 크고 연기 그림자) */
function wave(ctx: Ctx, x: number, y: number, dx: number, dy: number, w: number, life: number, big: boolean, tick: number): void {
  const a = Math.atan2(dy, dx);
  const fade = Math.min(1, life * 4);
  const r = big ? w * 2 : w * 1.8;
  // 몸에서 뒤로 물러난 자리를 가운데로 → 앞쪽으로 휜 초승달
  const cx = x - dx * r * 0.7;
  const cy = y - dy * r * 0.7;
  additive(ctx, () => glow(ctx, x, y, r * 0.9, big ? BLUE : SKY, 0.5 * fade, 1));
  slashArc(ctx, cx, cy, r, a, big ? 1.1 : 0.9, big ? 8 : 5, 1, fade, 1, big, big ? BLUE : tick % 2 ? VIOLET : BLUE, 0.7);
  // 날 끝에서 튀는 빛 가루
  for (let k = 0; k < (big ? 4 : 2); k++) {
    const off = ((tick * 3 + k * 7) % 11) - 5;
    ctx.fillStyle = alpha(k % 2 ? ICE : "#ffffff", fade * 0.8);
    ctx.fillRect(x - dx * (6 + k * 4) - dy * off, y - dy * (6 + k * 4) + dx * off * 0.7, 1.5, 1.5);
  }
}

/** 몸 위: 나아가는 검기들 · 뛰어오른 몸 아래 빛 꼬리 · 지혜·사냥 기운 */
export function drawFenrirAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isFenrir(p)) return;
  for (const w of p.fnWaves ?? []) {
    const k = Math.min(1, a);
    wave(ctx, snap(w.x + w.dx * w.sp * (k - 1)), snap(w.y + w.dy * w.sp * (k - 1) + 3), w.dx, w.dy, w.w, w.t / w.max, w.big, s.tick);
  }
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  const h = fenrirLift(p);
  if (h > 0) {
    // 하늘로 솟은 몸 아래로 푸른 빛 꼬리 (내리꽂을 때 더 밝음)
    const falling = (p.fnAir ?? 0) < 9;
    additive(ctx, () => {
      const g = ctx.createLinearGradient(0, y - h, 0, y + 6);
      g.addColorStop(0, alpha(SKY, falling ? 0.8 : 0.4));
      g.addColorStop(1, alpha(SKY, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - (falling ? 6 : 3), y - h, falling ? 12 : 6, h + 6);
      glow(ctx, x, y - h, 14, falling ? ICE : BLUE, falling ? 0.8 : 0.4, 1);
    });
  }
  if ((p.fnWise ?? 0) > 0) {
    // 늙은 늑대의 지혜: 몸을 감싸고 위로 피어오르는 푸른 기운
    for (let k = 0; k < 4; k++) {
      const u = ((s.tick * 0.04 + k / 4) % 1);
      ctx.fillStyle = alpha(SKY, (1 - u) * 0.7);
      ctx.fillRect(x - 8 + k * 5, y - h - u * 18, 2, 3);
    }
    additive(ctx, () => glow(ctx, x, y - h - 4, 16, BLUE, 0.25));
  }
}
