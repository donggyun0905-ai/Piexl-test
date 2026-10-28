// 렌 대지의 추가 공격 그리기 (그림 sprites/ren-*.png, scripts/art/ren_earth.py)
// 앞으로 나아가는 흙·나무 용(용오름: 머리 + 굵은 몸 마디가 땅을 드나듦) · 머리 위 거대 바위 · 돌 던지기 · 땅에서 솟아 적을 삼키는 용머리 · 큰 돌 · 양쪽 토목 기둥 짓뭉개기
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const DIRT = "#6a4a2a";
const DUST = "#c8a878";

const images = new Map<string, HTMLImageElement>();
function art(name: string): HTMLImageElement | undefined {
  let img = images.get(name);
  if (!img) {
    img = new Image();
    img.src = `${import.meta.env.BASE_URL}sprites/${name}.png`;
    images.set(name, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : undefined;
}
// 처음 나올 때 비어 보이지 않게 미리 불러 둠
for (const n of ["ren-dragon-head", "ren-dragon-body", "ren-block", "ren-rocks", "ren-boulder"]) art(n);

/** 그림의 (sx, 0, sw, sh) 칸을 (x, y) 가운데로 w 너비, 각도 a, 좌우 뒤집기 */
function blit(ctx: Ctx, img: HTMLImageElement, sx: number, sw: number, sh: number, x: number, y: number, w: number, a = 0, flip = false): void {
  const h = (w * sh) / sw;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(img, sx, 0, sw, sh, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/** 땅이 갈라지며 흙이 솟은 구멍 */
function hole(ctx: Ctx, x: number, y: number, r: number, a: number): void {
  ctx.globalAlpha = a * 0.7;
  ctx.fillStyle = "#2a1c10";
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.4, 0, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = a;
  ctx.strokeStyle = DIRT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.4, 0, 0, TAU);
  ctx.stroke();
  // 갈라진 금
  ctx.strokeStyle = "#3a2614";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * TAU + 0.3;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(t) * r, y + Math.sin(t) * r * 0.4);
    ctx.lineTo(x + Math.cos(t) * r * 1.5, y + Math.sin(t) * r * 0.6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** 튀는 흙·돌 조각 */
function debris(ctx: Ctx, x: number, y: number, r: number, t: number, n: number, seed: number): void {
  const rocks = art("ren-rocks");
  for (let i = 0; i < n; i++) {
    const a = ((seed + i * 47) % 360) * (Math.PI / 180);
    const d = r * (0.4 + t * 1.1) * (0.6 + ((i * 13) % 5) / 10);
    const px = x + Math.cos(a) * d;
    const py = y + Math.sin(a) * d * 0.5 - Math.sin(t * Math.PI) * (10 + (i % 4) * 4);
    ctx.globalAlpha = 1 - t * 0.8;
    if (rocks) blit(ctx, rocks, (i % 4) * 16, 16, 16, px, py, 5 + (i % 3) * 2, t * 6 + i);
    else {
      ctx.fillStyle = DIRT;
      ctx.fillRect(px - 1, py - 1, 3, 3);
    }
  }
  ctx.globalAlpha = 1;
}

/** 플레이어 곁 (렌일 때): 용오름 · 머리 위 거대 바위 */
export function drawRenEarth(ctx: Ctx, s: RunState, at: { x: number; y: number }, snap: Snap): void {
  const p = s.player;
  const head = art("ren-dragon-head");
  const body = art("ren-dragon-body");
  for (const w of p.rWyrms ?? []) {
    const ang = Math.atan2(w.dy, w.dx);
    const flip = w.dx < 0;
    // 지나온 길을 따라 굵은 몸 마디 18개: 옆으로 물결치며, 큰 파도처럼 땅 위로 솟았다 들어감
    const pts: { x: number; y: number; up: number; a: number }[] = [];
    for (let i = 0; i <= 18; i++) {
      const back = i * 6;
      const ph = (w.t + i * 3) * 0.16;
      const side = Math.sin(ph) * 6;
      const up = Math.sin((w.t * 0.12 - i * 0.45));
      pts.push({ x: w.x - w.dx * back - w.dy * side, y: w.y - w.dy * back + w.dx * side, up, a: ang });
    }
    for (let i = pts.length - 1; i >= 1; i--) {
      const q = pts[i]!;
      const n = pts[i - 1]!;
      if (q.up < -0.2) {
        hole(ctx, snap(q.x), snap(q.y + 4), 7, 0.8);
        continue;
      }
      const lift = Math.max(0, q.up) * 8;
      const nl = Math.max(0, n.up) * 8;
      const tail = i === pts.length - 1;
      if (body) blit(ctx, body, tail ? 64 : (Math.floor(s.tick / 8) + i) % 2 ? 32 : 0, 32, 32, snap(q.x), snap(q.y - lift), tail ? 22 : 26 - i * 0.5, Math.atan2(n.y - nl - (q.y - lift), n.x - q.x), false);
      if (q.up < 0.2) hole(ctx, snap(q.x), snap(q.y + 6), 9, 0.6);
    }
    // 머리: 늘 땅 위, 입을 벌렸다 다물며 나아감
    const f = Math.floor(s.tick / 6) % 4;
    if (head) blit(ctx, head, [0, 1, 2, 1][f]! * 64, 64, 48, snap(w.x + w.dx * 8), snap(w.y - 10), 44, flip ? ang - Math.PI : ang, flip);
    debris(ctx, w.x, w.y + 4, 10, (s.tick % 20) / 20, 4, w.t * 7);
  }
  const n = p.rStones ?? 0;
  const boulder = art("ren-boulder");
  if (n > 0 && boulder) {
    // 머리 위에 떠 있는 거대 바위 (쌓일수록 커짐) + 둘레를 도는 작은 바위 n개
    const bob = Math.sin(s.tick * 0.08) * 1.5;
    const y = at.y - 30 + bob;
    blit(ctx, boulder, 0, 40, 36, snap(at.x), snap(y), 20 + n * 3);
    const rocks = art("ren-rocks");
    for (let i = 0; i < n && rocks; i++) {
      const a = s.tick * 0.05 + (i * TAU) / n;
      blit(ctx, rocks, (i % 4) * 16, 16, 16, snap(at.x + Math.cos(a) * 16), snap(y + Math.sin(a) * 6), 7, a);
    }
  }
}

/** 효과 (그렸으면 true) */
export function drawRenEarthFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  switch (fx.kind) {
    case "renRock": {
      // 앞으로 넓게 흩뿌려지는 큰 돌·나무 덩어리 18개 (포물선 + 그림자) + 흙먼지
      const rocks = art("ren-rocks");
      const base = Math.atan2(fx.dirY, fx.dirX);
      for (let i = 0; i < 18; i++) {
        const a = base + ((i % 9) - 4) * 0.2 + (i >= 9 ? 0.1 : 0);
        const d = fx.size * Math.min(1, t * 1.3) * (0.45 + ((i * 7) % 6) / 10);
        const gx = fx.x + Math.cos(a) * d;
        const gy = fx.y + Math.sin(a) * d * 0.8;
        const h = Math.sin(Math.min(1, t * 1.3) * Math.PI) * (14 + (i % 3) * 6);
        ctx.globalAlpha = 0.3 * (1 - t);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(gx, gy + 3, 4, 1.5, 0, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = t > 0.85 ? (1 - t) / 0.15 : 1;
        if (rocks) blit(ctx, rocks, (i % 4) * 16, 16, 16, snap(gx), snap(gy - h), 9 + (i % 3) * 3, t * 8 + i);
      }
      ctx.globalAlpha = (1 - t) * 0.5;
      ctx.fillStyle = DUST;
      ctx.beginPath();
      ctx.ellipse(x + fx.dirX * 14, y + 4, 14 * (0.5 + t), 5, 0, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      return true;
    }
    case "renHead": {
      // 땅이 갈라지고 → 거대한 용머리가 입을 크게 벌리고 솟음 → 덥석 물고 → 땅으로 꺼짐
      const head = art("ren-dragon-head");
      const r = fx.size;
      const rise = t < 0.3 ? t / 0.3 : t > 0.8 ? (1 - t) / 0.2 : 1;
      const frame = t < 0.15 ? 0 : t < 0.42 ? 2 : t < 0.5 ? 1 : 0;
      hole(ctx, x, y + 6, r * 0.9, Math.min(1, (1 - t) * 2));
      if (head) {
        const w = r * 2.6;
        // 아래부터 서서히 보이게 (땅에서 솟음)
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - w, y - w * 1.5, w * 2, w * 1.5 + 8);
        ctx.clip();
        // 입(그림의 46, 29 근처)이 적 자리에 오게 맞춤
        const k = w / 64;
        blit(ctx, head, frame * 64, 64, 48, x - fx.dirX * 14 * k, y - 5 * k + (1 - rise) * w * 0.5, w, -0.15 * fx.dirX, fx.dirX < 0);
        ctx.restore();
      }
      if (t > 0.42 && t < 0.55) {
        // 무는 순간 번쩍
        const k = 1 - (t - 0.42) / 0.13;
        additive(ctx, () => {
          glow(ctx, x, y - 6, r, "#ffe0a0", k, 1.4);
          shock(ctx, x, y - 6, r * (1.2 - k * 0.4), "#ffd080", k, 5);
        });
      }
      debris(ctx, x, y, r, Math.min(1, t * 2), 10, Math.round(fx.x));
      return true;
    }
    case "renStone":
      // 바위가 하나 더 붙음: 초록 빛 고리
      additive(ctx, () => {
        glow(ctx, x, y, fx.size + 6, "#7ae05a", (1 - t) * 0.6);
        shock(ctx, x, y, fx.size + t * 12, "#a8f08a", 1 - t, 4);
      });
      return true;
    case "renDrop": {
      // 하늘에서 거대 바위가 떨어짐 (그림자가 커지다가) → 쾅: 갈라짐 + 파편 + 흙먼지
      const boulder = art("ren-boulder");
      const fall = Math.min(1, t * 2.5);
      if (fall < 1) {
        ctx.globalAlpha = 0.25 + fall * 0.3;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(x, y + 2, fx.size * fall, fx.size * 0.35 * fall, 0, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (boulder) blit(ctx, boulder, 0, 40, 36, x, snap(fx.y - 90 * (1 - fall)), fx.size * 1.4, fall * 0.6);
      } else {
        const k = (t - 0.4) / 0.6;
        // 쾅: 흙빛 충격파가 땅을 따라 퍼짐
        additive(ctx, () => {
          ctx.save();
          ctx.translate(x, y + 2);
          ctx.scale(1, 0.45);
          if (k < 0.25) glow(ctx, 0, 0, fx.size * 1.4, "#ffd8a0", 1 - k * 4, 1.2);
          shock(ctx, 0, 0, fx.size * (0.8 + k * 1.2), "#e8c890", 1 - k, 8);
          ctx.restore();
        });
        hole(ctx, x, y + 2, fx.size, 1 - k);
        if (boulder && k < 0.4) blit(ctx, boulder, 0, 40, 36, x, y - 4, fx.size * 1.4 * (1 - k * 0.5));
        ctx.globalAlpha = (1 - k) * 0.5;
        ctx.fillStyle = DUST;
        ctx.beginPath();
        ctx.ellipse(x, y, fx.size * (0.8 + k), fx.size * 0.4 * (0.8 + k), 0, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        debris(ctx, x, y, fx.size, k, 12, Math.round(fx.y));
      }
      return true;
    }
    case "renCrush": {
      // 적 좌우에서 거대한 토목 기둥 둘이 땅을 가르며 솟아 → 쾅 맞부딪혀 짓뭉갬 → 부서져 흩어짐
      const block = art("ren-block");
      const r = fx.size;
      const close = Math.min(1, t / 0.35);
      const gap = (1 - close * close) * r * 1.6;
      const rise = Math.min(1, t / 0.15);
      const h = r * 2.6;
      const w = (h * 24) / 40;
      ctx.globalAlpha = t > 0.7 ? (1 - t) / 0.3 : 1;
      for (const side of [-1, 1]) {
        const bx = x + side * (gap + w / 2 - 2);
        hole(ctx, bx, y + 4, w * 0.6, 1 - t);
        if (block) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(bx - w, y - h * 1.2, w * 2, h * 1.2 + 6);
          ctx.clip();
          // 맞부딪힌 뒤에는 조금씩 기울며 부서짐
          blit(ctx, block, 0, 24, 40, bx, y + 4 - (h / 2) * rise, w, close >= 1 ? side * (t - 0.35) * 0.6 : 0, side > 0);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      if (close >= 1) {
        const k = (t - 0.35) / 0.65;
        // 맞부딪힌 순간 하얀 섬광 + 충격파
        additive(ctx, () => {
          if (k < 0.3) glow(ctx, x, y - h * 0.3, r * 1.2, "#fff4d8", 1 - k / 0.3, 1.5);
          shock(ctx, x, y - h * 0.3, r * (0.5 + k * 1.2), "#e8d0a0", 1 - k, 6);
        });
        ctx.globalAlpha = (1 - k) * 0.7;
        ctx.fillStyle = DUST;
        ctx.beginPath();
        ctx.ellipse(x, y - h * 0.3, r * (0.4 + k), r * 0.5 * (0.4 + k), 0, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        debris(ctx, x, y - h * 0.3, r, k, 14, Math.round(fx.x * 3));
      }
      return true;
    }
  }
  return false;
}
