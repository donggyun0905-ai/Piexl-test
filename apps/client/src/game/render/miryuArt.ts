// 미류 그림 도우미: 흐르는 물길 (물결 띠 위로 흐름 무늬가 실제로 흘러감) · 물 칼자국 띠 · 휘는 물 채찍 · 해룡 몸 · 물칼날 · 폭포 물줄기
// 색은 맑은 바다 (짙은 바다 · 하늘색 · 흰 거품 · 얼음빛)
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";

export const MR = { deep: "#0a4ab8", sea: "#1ab8e8", aqua: "#5ae8ff", foam: "#f2feff", ice: "#c8f6ff", horn: "#3ad0e8", eye: "#ffd040" };
const TAU = Math.PI * 2;

/** 점들을 부드럽게 잇는 길 (중간점 곡선) */
export function smoothPath(ctx: Ctx, pts: readonly (readonly [number, number])[]): void {
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i]!;
    const [nx, ny] = pts[i + 1]!;
    ctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
  }
  const last = pts[pts.length - 1]!;
  ctx.lineTo(last[0], last[1]);
}

/** 흐르는 물길: 짙은 물 바닥 · 하늘빛 물결 · 흐르는 쪽으로 움직이는 흰 물살 무늬 (tick으로 흐름) */
export function flowRibbon(ctx: Ctx, pts: readonly (readonly [number, number])[], w: number, a: number, tick: number, frost = false): void {
  if (pts.length < 2 || a <= 0.01) return;
  const aqua = frost ? MR.ice : MR.aqua;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  smoothPath(ctx, pts);
  ctx.strokeStyle = alpha(frost ? "#2a7ac8" : MR.deep, 0.2 * a);
  ctx.lineWidth = w * 1.7;
  ctx.stroke();
  additive(ctx, () => {
    smoothPath(ctx, pts);
    ctx.strokeStyle = alpha(MR.sea, 0.26 * a);
    ctx.lineWidth = w * 1.05;
    ctx.stroke();
    ctx.strokeStyle = alpha(aqua, 0.3 * a);
    ctx.lineWidth = w * 0.45;
    ctx.stroke();
    // 흐르는 물살 무늬 (두 겹: 빠른 흰 줄 · 느린 하늘색 줄)
    ctx.setLineDash([7, 9]);
    ctx.lineDashOffset = -tick * 1.6;
    ctx.strokeStyle = alpha(MR.foam, 0.8 * a);
    ctx.lineWidth = Math.max(1, w * 0.18);
    ctx.stroke();
    ctx.setLineDash([3, 13]);
    ctx.lineDashOffset = -tick * 1.1 + 5;
    ctx.strokeStyle = alpha(aqua, 0.75 * a);
    ctx.lineWidth = Math.max(1, w * 0.7);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  // 물길 끝: 흘러 나가는 물보라 점
  const [ex, ey] = pts[pts.length - 1]!;
  for (let i = 0; i < 3; i++) {
    const u = ((tick * 0.05 + i / 3) % 1);
    ctx.fillStyle = alpha(MR.foam, (1 - u) * 0.8 * a);
    ctx.fillRect(Math.round(ex + (rnd(i, 7) - 0.5) * w * 2 * u), Math.round(ey - u * 6 - rnd(7, i) * 3), 1, 1);
  }
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
}

/** 물 칼자국 띠: (x, y) 둘레 반지름 r에서 a0 → a1로 휩쓸며 앞 끝이 밝음 (두께 th) */
export function slashBand(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, th: number, al: number): void {
  if (Math.abs(a1 - a0) < 0.02 || al <= 0.01) return;
  const steps = 22;
  const pt = (u: number, rr: number) => {
    const ang = a0 + (a1 - a0) * u;
    return [x + Math.cos(ang) * rr, y + Math.sin(ang) * rr] as const;
  };
  additive(ctx, () => {
    // 뒤쪽은 얇고 흐리게, 앞 끝은 두껍고 밝게 (물살이 칼끝을 따라옴)
    ctx.beginPath();
    for (let k = 0; k <= steps; k++) {
      const [px, py] = pt(k / steps, r + 1);
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    for (let k = steps; k >= 0; k--) {
      const u = k / steps;
      const [px, py] = pt(u, r - th * (0.25 + u * 0.75));
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(x, y, Math.max(0, r - th), x, y, r + 1);
    g.addColorStop(0, alpha(MR.deep, 0));
    g.addColorStop(0.45, alpha(MR.sea, 0.7 * al));
    g.addColorStop(0.8, alpha(MR.aqua, 0.95 * al));
    g.addColorStop(1, alpha(MR.foam, al));
    ctx.fillStyle = g;
    ctx.fill();
    // 칼끝 가장자리 흰 줄
    ctx.strokeStyle = alpha(MR.foam, al);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let k = Math.floor(steps * 0.35); k <= steps; k++) {
      const [px, py] = pt(k / steps, r);
      if (k === Math.floor(steps * 0.35)) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const [hx, hy] = pt(1, r - th * 0.3);
    glow(ctx, hx, hy, th * 2, MR.aqua, al, 1);
  });
}

/** 휘는 물 채찍: (x0, y0) → (x1, y1) 사이를 바라보는 쪽(dx, dy)으로 부풀어 휘는 곡선 · k만큼 그려짐 */
export function bendWhip(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, dx: number, dy: number, k: number, al: number, seed: number): void {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const side = rnd(seed, 3) < 0.5 ? -1 : 1;
  const cx = mx + dx * len * 0.25 - dy * len * 0.35 * side;
  const cy = my + dy * len * 0.25 + dx * len * 0.35 * side;
  const at = (u: number) => [(1 - u) ** 2 * x0 + 2 * (1 - u) * u * cx + u * u * x1, (1 - u) ** 2 * y0 + 2 * (1 - u) * u * cy + u * u * y1] as const;
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const [c, w, a] of [[MR.sea, 5, 0.45], [MR.aqua, 2.6, 0.85], [MR.foam, 1, 1]] as const) {
      ctx.strokeStyle = alpha(c, a * al);
      ctx.lineWidth = w;
      ctx.beginPath();
      for (let i = 0; i <= 16; i++) {
        const [px, py] = at((i / 16) * k);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.lineCap = "butt";
    const [hx, hy] = at(k);
    glow(ctx, hx, hy, 9, MR.aqua, al, 1);
  });
}

/** 해룡: 몸통 점들(머리부터) 따라 굵어졌다 가늘어지는 물 몸 · 비늘 반짝임 · 등지느러미 · 머리(뿔·눈·수염) */
export function dragonBody(ctx: Ctx, body: readonly (readonly [number, number])[], size: number, dx: number, dy: number, tick: number, al: number): void {
  if (body.length < 2) return;
  const n = body.length;
  const width = (i: number) => {
    const u = i / (n - 1);
    return (4 + 8 * Math.sin(Math.min(1, 0.25 + u * 0.9) * Math.PI)) * size * (1 - u * 0.5);
  };
  additive(ctx, () => {
    ctx.lineCap = "round";
    // 몸 둘레 물빛 → 몸 → 배 쪽 밝은 줄 → 등 흰 줄 (마디마다 굵기를 바꿔 가늘어지는 꼬리)
    for (const [c, k, a] of [[MR.deep, 2.3, 0.35], [MR.sea, 1.7, 0.75], [MR.aqua, 1.0, 0.85], [MR.foam, 0.3, 0.9]] as const) {
      ctx.strokeStyle = alpha(c, a * al);
      for (let i = 0; i < n - 1; i++) {
        ctx.lineWidth = Math.max(1, width(i) * k);
        ctx.beginPath();
        ctx.moveTo(body[i]![0], body[i]![1]);
        ctx.lineTo(body[i + 1]![0], body[i + 1]![1]);
        ctx.stroke();
      }
    }
    // 비늘 반짝임 · 등지느러미
    for (let i = 1; i < n - 1; i++) {
      const [x, y] = body[i]!;
      const [px, py] = body[i - 1]!;
      const l = Math.hypot(x - px, y - py) || 1;
      const nx = -(y - py) / l;
      const ny = (x - px) / l;
      const r = width(i);
      ctx.fillStyle = alpha(MR.foam, al * (0.4 + 0.6 * Math.max(0, Math.sin(tick * 0.4 - i * 0.8))));
      ctx.fillRect(Math.round(x + nx * r * 0.3), Math.round(y + ny * r * 0.3), 2, 1);
      if (i % 2 === 0) {
        ctx.strokeStyle = alpha(MR.foam, 0.75 * al);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - nx * r * 0.7, y - ny * r * 0.7);
        ctx.lineTo(x - nx * r * 1.5 - (x - px) / l * 4, y - ny * r * 1.5 - (y - py) / l * 4);
        ctx.stroke();
      }
    }
    ctx.lineCap = "butt";
  });
  // 머리
  const [hx, hy] = body[0]!;
  const a = Math.atan2(dy, dx);
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(a);
  ctx.scale(size * 1.35, size * 1.35);
  additive(ctx, () => {
    glow(ctx, 6, 0, 26, MR.aqua, 0.6 * al, 0.6);
    ctx.fillStyle = alpha(MR.aqua, 0.9 * al);
    ctx.beginPath();
    ctx.ellipse(4, 0, 13, 9, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = alpha(MR.sea, 0.9 * al);
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(24, -2 + Math.sin(tick * 0.5) * 2);
    ctx.lineTo(22, 3);
    ctx.lineTo(10, 5);
    ctx.fill();
    // 뿔 둘 · 수염
    ctx.strokeStyle = alpha(MR.foam, al);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, s * 6);
      ctx.quadraticCurveTo(-8, s * 14, -16, s * 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(18, s * 3);
      ctx.quadraticCurveTo(10, s * (10 + Math.sin(tick * 0.3 + s) * 3), 2, s * 16);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
  ctx.fillStyle = alpha(MR.eye, al);
  ctx.fillRect(7, -4, 3, 2);
  ctx.fillRect(7, 2, 3, 2);
  ctx.restore();
}

/** 되돌린 물칼날: 날아가는 쪽으로 휜 초승달 물칼 + 꼬리 */
export function waterBlade(ctx: Ctx, x: number, y: number, dx: number, dy: number, al: number): void {
  const a = Math.atan2(dy, dx);
  additive(ctx, () => {
    ctx.strokeStyle = alpha(MR.aqua, 0.5 * al);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - dx * 16, y - dy * 16);
    ctx.stroke();
    ctx.strokeStyle = alpha(MR.foam, al);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x - dx * 4, y - dy * 4, 7, a - 1.1, a + 1.1);
    ctx.stroke();
    glow(ctx, x, y, 8, MR.aqua, 0.8 * al, 0.8);
  });
}

/** 폭포 물줄기: 위(y - h)에서 (x, y)로 쏟아지는 넓은 물기둥 (흐르는 줄무늬) */
export function fallColumn(ctx: Ctx, x: number, y: number, w: number, h: number, tick: number, al: number): void {
  const g = ctx.createLinearGradient(x, y - h, x, y);
  g.addColorStop(0, alpha(MR.sea, 0));
  g.addColorStop(0.3, alpha(MR.sea, 0.55 * al));
  g.addColorStop(1, alpha(MR.aqua, 0.9 * al));
  additive(ctx, () => {
    ctx.fillStyle = g;
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const lx = x - w / 2 + (w * (i + 0.5)) / 7 + Math.sin(tick * 0.3 + i) * 1.5;
      ctx.setLineDash([8 + (i % 3) * 3, 6]);
      ctx.lineDashOffset = -tick * (5 + (i % 3));
      ctx.strokeStyle = alpha(i % 2 ? MR.foam : MR.ice, 0.85 * al);
      ctx.lineWidth = i % 2 ? 1.2 : 2;
      ctx.beginPath();
      ctx.moveTo(lx, y - h);
      ctx.lineTo(lx, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineCap = "butt";
  });
}
