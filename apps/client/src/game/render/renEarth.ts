// 렌 대지의 추가 공격 그리기: 앞으로 나아가는 용오름 · 머리 위 거대 토목 · 돌 던지기 · 용머리 · 큰 돌 · 양쪽 토목 짓뭉개기
import type { EffectState, RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { clod } from "./spirits";

type Ctx = CanvasRenderingContext2D;
const MOSS = "#5ac84a";
const BARK = "#8a6a3a";
const STONE = "#a8a090";

/** 흙·나무 용머리 (x,y: 목 아래, h: 솟은 높이 0~1, dir: 바라보는 쪽 ±1) */
function dragonHead(ctx: Ctx, x: number, y: number, h: number, dir: number, size: number): void {
  const top = y - size * 1.6 * h;
  ctx.fillStyle = BARK;
  ctx.fillRect(Math.round(x - size * 0.35), Math.round(top), Math.ceil(size * 0.7), Math.ceil(y - top));
  ctx.fillStyle = "#7a7268";
  ctx.beginPath();
  ctx.ellipse(x + dir * size * 0.3, top, size * 0.75, size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // 위턱·뿔·눈
  ctx.fillStyle = STONE;
  ctx.fillRect(Math.round(x + dir * size * 0.2), Math.round(top - size * 0.35), Math.round(dir * size * 0.9), Math.ceil(size * 0.25));
  ctx.fillStyle = MOSS;
  ctx.fillRect(Math.round(x - dir * size * 0.3), Math.round(top - size * 0.8), 2, Math.ceil(size * 0.45));
  ctx.fillStyle = "#ffd36a";
  ctx.fillRect(Math.round(x + dir * size * 0.35), Math.round(top - size * 0.15), 2, 2);
}

/** 바닥이 갈라지는 고리 */
function crack(ctx: Ctx, x: number, y: number, r: number, a: number): void {
  ctx.globalAlpha = a;
  ctx.strokeStyle = BARK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** 플레이어 곁 (렌일 때): 용오름 · 머리 위 거대 토목 */
export function drawRenEarth(ctx: Ctx, s: RunState, at: { x: number; y: number }, snap: Snap): void {
  const p = s.player;
  for (const w of p.rWyrms ?? []) {
    // 좌우로 솟구쳤다 바닥으로 들어가길 되풀이하며 나아감 (몸 마디 6개)
    for (let i = 0; i < 6; i++) {
      const back = i * 5;
      const bx = w.x - w.dx * back;
      const by = w.y - w.dy * back;
      const ph = (w.t + i * 3) * 0.25;
      const side = Math.sin(ph) * 6;
      const up = Math.max(0, Math.cos(ph)) * 8;
      const x = snap(bx - w.dy * side);
      const y = snap(by + w.dx * side - up);
      if (up > 0.5) clod(ctx, x, y, 3.5 - i * 0.3, i);
      else crack(ctx, x, snap(by + w.dx * side), 4, 0.5);
    }
    dragonHead(ctx, snap(w.x), snap(w.y), 0.5 + Math.abs(Math.cos(w.t * 0.25)) * 0.5, w.dx < 0 ? -1 : 1, 6);
  }
  const n = p.rStones ?? 0;
  if (n > 0) {
    // 머리 위에 떠 있는 거대 토목 하나, 쌓인 수만큼 둘레에 작은 돌
    const bob = Math.sin(s.tick * 0.08) * 1.5;
    const y = at.y - 28 + bob;
    clod(ctx, snap(at.x), snap(y), 6 + n * 0.8, 1);
    for (let i = 0; i < n; i++) clod(ctx, snap(at.x - 10 + i * 5), snap(y + 9), 1.8, i);
  }
}

/** 효과 (그렸으면 true) */
export function drawRenEarthFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "renRock":
      // 앞으로 넓게 흩뿌려지는 돌
      for (let i = 0; i < 9; i++) {
        const a = Math.atan2(fx.dirY, fx.dirX) + (i - 4) * 0.16;
        const d = fx.size * t * (0.6 + (i % 3) * 0.2);
        clod(ctx, snap(fx.x + Math.cos(a) * d), snap(fx.y + Math.sin(a) * d - Math.sin(t * Math.PI) * 8), 2.6, i);
      }
      return true;
    case "renHead": {
      // 바닥에서 솟아오른 용머리, 마지막에 무너짐
      const h = t < 0.3 ? t / 0.3 : t > 0.75 ? (1 - t) / 0.25 : 1;
      crack(ctx, x, y, fx.size, 1 - t);
      dragonHead(ctx, x, y, h, fx.dirX < 0 ? -1 : 1, 9);
      return true;
    }
    case "renStone":
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = MOSS;
      ctx.beginPath();
      ctx.arc(x, y, fx.size + t * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      return true;
    case "renDrop": {
      // 위에서 떨어지는 큰 돌 → 바닥 갈라짐
      const fall = Math.min(1, t * 2.5);
      if (fall < 1) clod(ctx, x, snap(fx.y - 60 * (1 - fall)), fx.size * 0.45, 2);
      else {
        crack(ctx, x, y, fx.size * (0.6 + t * 0.4), 1 - t);
        for (let i = 0; i < 6; i++) clod(ctx, snap(fx.x + Math.cos(i) * fx.size * t), snap(fx.y + Math.sin(i) * fx.size * 0.4 * t), 2, i);
      }
      return true;
    }
    case "renCrush": {
      // 좌우의 네모난 토목이 맞부딪혀 부서짐
      const gap = Math.max(0, 1 - t * 2.5) * fx.size * 1.4;
      const w = fx.size * 0.8;
      const h = fx.size * 1.3;
      ctx.globalAlpha = t > 0.6 ? (1 - t) / 0.4 : 1;
      for (const side of [-1, 1]) {
        const bx = snap(fx.x + side * (gap + w / 2) - w / 2);
        ctx.fillStyle = "#7a7268";
        ctx.fillRect(bx, snap(fx.y - h * 0.7), Math.round(w), Math.round(h));
        ctx.fillStyle = BARK;
        ctx.fillRect(bx, snap(fx.y - h * 0.7), Math.round(w), 2);
        ctx.fillStyle = MOSS;
        ctx.fillRect(bx + 1, snap(fx.y - h * 0.7) - 1, 3, 1);
      }
      ctx.globalAlpha = 1;
      if (gap <= 0) for (let i = 0; i < 5; i++) clod(ctx, snap(fx.x + (i - 2) * 4), snap(fx.y - 6 + t * 10), 1.8, i);
      return true;
    }
  }
  return false;
}
