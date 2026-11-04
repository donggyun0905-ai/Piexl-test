// 이클립스 화려한 꾸밈 (render/eclipse·eclipseAura가 씀): 검격 번쩍임·불똥·태양 낙인 · 일식 잔상·도끼 머리 빛 · 돌진 그림자 · 낙하 빛기둥
// · 맞음 터짐 · 개기일식 빛살 · 영역 도는 고리·불꽃 혀 · 블랙홀 빨려 드는 알갱이 · 날아가는 초승달 꼬리 · 변신·치유 빛 알갱이
import { SUN_BURST } from "@pixel-rogue/shared";
import { N_PINK, S_GOLD, S_RED, sunPts, TAU, voidArc } from "./eclipseBits";
import { additive, alpha, glow, rnd, sparks, type Ctx } from "./pwFxBits";

/** 태양 검격: 휘두른 끝(도끼 머리)마다 번쩍 + 불똥 · 손 쪽 작은 빛 · 4타는 엇갈린 자리 번쩍 · 5타는 태양 낙인 (f: 진행) */
export function sunFlair(ctx: Ctx, x: number, y: number, fx: number, fy: number, r: number, i: number, f: number, seed: number): void {
  const paths = sunPts(x, y, fx, fy, r, i);
  const stamp = r * 0.8 * (SUN_BURST[i] ?? 0);
  additive(ctx, () => {
    if (f < 0.3) glow(ctx, x + fx * 6, y + fy * 6, 14, S_RED, 0.6 * (1 - f / 0.3), 0.6);
    paths.forEach((pts, k) => {
      const v = pts[pts.length - 1]!;
      if (!stamp && f < 0.45) glow(ctx, v[0], v[1], r * (0.3 + f * 0.5), S_GOLD, 0.8 * (1 - f / 0.45), 1.1);
      if (!stamp) sparks(ctx, v[0], v[1], 7, r * 0.45, Math.min(1, f * 1.4), S_GOLD, seed + k);
    });
    if (i === 3 && f > 0.15 && f < 0.6) {
      const c = paths[0]![6]!;
      glow(ctx, c[0], c[1], r * 0.55, S_GOLD, 1 - (f - 0.15) / 0.45, 1.3);
    }
    if (stamp && f > 0.1) {
      const v = paths[0]![paths[0]!.length - 1]!;
      sunStamp(ctx, v[0], v[1], stamp, (f - 0.1) / 0.9, seed);
    }
  });
}

/** 태양 낙인: 바닥에 눕는 불 원판·불꽃 혀 고리 · 흰 속 · 금빛 고리 · 금빛·빨강 빛살 · 불똥 (k: 진행 0~1) */
function sunStamp(ctx: Ctx, x: number, y: number, R: number, k: number, seed: number): void {
  const fade = 1 - k;
  const g = 0.55 + 0.45 * Math.min(1, k * 5);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  const disk = ctx.createRadialGradient(0, 0, 0, 0, 0, R * g);
  disk.addColorStop(0, alpha("#fff6c0", 0.9 * fade));
  disk.addColorStop(0.45, alpha(S_GOLD, 0.7 * fade));
  disk.addColorStop(1, alpha(S_RED, 0));
  ctx.fillStyle = disk;
  ctx.beginPath();
  ctx.arc(0, 0, R * g, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = alpha(S_GOLD, fade);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, R * g * 0.95, 0, TAU);
  ctx.stroke();
  ctx.restore();
  // 테를 따라 솟는 불꽃 혀
  for (let n = 0; n < 14; n++) {
    const ang = (n / 14) * TAU;
    const px = x + Math.cos(ang) * R * g * 0.95;
    const py = y + Math.sin(ang) * R * g * 0.95 * 0.55;
    const h = R * 0.35 * fade * (0.6 + 0.4 * rnd(seed, n));
    const fl = ctx.createLinearGradient(0, py, 0, py - h);
    fl.addColorStop(0, alpha(S_RED, 0.9 * fade));
    fl.addColorStop(1, alpha(S_GOLD, 0));
    ctx.fillStyle = fl;
    ctx.beginPath();
    ctx.moveTo(px - 2.5, py);
    ctx.quadraticCurveTo(px, py - h * 0.5, px, py - h);
    ctx.quadraticCurveTo(px, py - h * 0.5, px + 2.5, py);
    ctx.fill();
  }
  // 가운데 작은 해 + 빛살
  const cy = y - 4;
  glow(ctx, x, cy, R * 0.9 * g, S_GOLD, 0.8 * fade, 1.2);
  ctx.lineCap = "round";
  for (let n = 0; n < 12; n++) {
    const ang = (n / 12) * TAU + k * 0.5;
    const r1 = R * g * (n % 2 ? 0.7 : 1.05);
    ctx.strokeStyle = alpha(n % 2 ? S_RED : S_GOLD, fade);
    ctx.lineWidth = n % 2 ? 1.5 : 2.2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(ang) * R * 0.3 * g, cy + Math.sin(ang) * R * 0.3 * g);
    ctx.lineTo(x + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  sparks(ctx, x, cy, 14, R * 1.3, Math.min(1, k * 1.3), S_GOLD, seed);
}

/** 일식 휘두르기: 뒤따르는 옅은 잔상 날 · 도끼 머리 쪽 분홍 빛·불똥 */
export function hewFlair(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, head: number, thick: number, al: number, f: number, seed: number): void {
  voidArc(ctx, x, y, r * 1.1, a0, a1, thick * 0.6, al * 0.28, 0.78);
  const hx = x + Math.cos(head) * r * 0.9;
  const hy = y + Math.sin(head) * r * 0.78 * 0.9;
  additive(ctx, () => {
    glow(ctx, hx, hy, r * 0.45, N_PINK, 0.75 * al, 0.8);
    sparks(ctx, hx, hy, 8, r * 0.45, Math.min(1, f * 1.6), N_PINK, seed);
  });
}

/** 흑월 회전: 바깥에 한 겹 더 도는 옅은 고리 빛 */
export function spinFlair(ctx: Ctx, x: number, y: number, r: number, al: number, tick: number): void {
  additive(ctx, () => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.7);
    ctx.strokeStyle = alpha(N_PINK, 0.5 * al);
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.lineDashOffset = -tick;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.12, 0, TAU);
    ctx.stroke();
    ctx.restore();
    glow(ctx, x, y, r * 0.8, N_PINK, 0.35 * al);
  });
}

/** 그림자 돌진: 지나간 줄 위에 옅어지는 그림자 몸 몇 개 + 분홍 불똥 */
export function dashGhosts(ctx: Ctx, x: number, y: number, tx: number, ty: number, fade: number, seed: number): void {
  for (let k = 1; k <= 4; k++) {
    const u = k / 5;
    const gx = x + (tx - x) * u;
    const gy = y + (ty - y) * u;
    ctx.fillStyle = alpha(N_PINK, 0.28 * fade * u);
    ctx.beginPath();
    ctx.ellipse(gx, gy - 6, 6, 10, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = alpha("#ffd2ff", 0.8 * fade * u);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  additive(ctx, () => sparks(ctx, tx, ty, 8, 18, 1 - fade, N_PINK, seed));
}

/** 일식 낙하: 가운데 번쩍 · 하늘에서 내리꽂힌 빛기둥 (f: 진행) */
export function slamFlash(ctx: Ctx, x: number, y: number, size: number, f: number, seed: number): void {
  additive(ctx, () => {
    if (f < 0.5) glow(ctx, x, y - 4, size * 0.7, N_PINK, 1 - f / 0.5, 1);
    if (f < 0.35) {
      const k = 1 - f / 0.35;
      const g = ctx.createLinearGradient(0, y - 90, 0, y);
      g.addColorStop(0, alpha(N_PINK, 0));
      g.addColorStop(1, alpha("#ffd2ff", 0.85 * k));
      ctx.fillStyle = g;
      ctx.fillRect(x - 7 * k - 2, y - 90, 14 * k + 4, 90);
    }
    sparks(ctx, x, y - 4, 14, size * 0.9, Math.min(1, f * 1.3), N_PINK, seed);
  });
}

/** 맞은 자리 작은 터짐 */
export function hitBurst(ctx: Ctx, x: number, y: number, night: boolean, f: number, seed: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, 12 * (1 - f * 0.5), night ? N_PINK : S_GOLD, 0.8 * (1 - f), 1);
    sparks(ctx, x, y, 5, 14, f, night ? N_PINK : S_GOLD, seed);
  });
}

/** 개기일식: 가운데 검은 해 + 금빛 빛살이 퍼짐 */
export function totalFlair(ctx: Ctx, x: number, y: number, size: number, f: number): void {
  const fade = 1 - f;
  additive(ctx, () => {
    glow(ctx, x, y - 8, size * 0.6, S_GOLD, 0.8 * fade, 0.8);
    ctx.lineCap = "round";
    for (let k = 0; k < 12; k++) {
      const ang = (k / 12) * TAU + f * 0.6;
      const r0 = 14 + f * size * 0.3;
      const r1 = r0 + size * 0.35 * fade * (k % 2 ? 0.6 : 1);
      ctx.strokeStyle = alpha(k % 2 ? N_PINK : S_GOLD, fade);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang) * r0, y - 8 + Math.sin(ang) * r0);
      ctx.lineTo(x + Math.cos(ang) * r1, y - 8 + Math.sin(ang) * r1);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
  ctx.fillStyle = alpha("#000000", fade);
  ctx.beginPath();
  ctx.arc(x, y - 8, 9 * fade + 2, 0, TAU);
  ctx.fill();
}

/** 영역 꾸밈: 안쪽에 천천히 도는 점선 고리 · 태양은 테에서 일렁이는 불꽃 혀, 일식은 테에 도는 검은 빛 */
export function zoneFlair(ctx: Ctx, x: number, y: number, r: number, night: boolean, tick: number): void {
  const rim = night ? N_PINK : S_GOLD;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  ctx.strokeStyle = alpha(rim, 0.45);
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 6]);
  ctx.lineDashOffset = tick * (night ? -0.3 : 0.4);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  if (night) return;
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * TAU + tick * 0.004;
    const px = x + Math.cos(ang) * r;
    const py = y + Math.sin(ang) * r * 0.55;
    const h = 5 + 4 * Math.abs(Math.sin(tick * 0.12 + i * 1.7));
    const g = ctx.createLinearGradient(0, py, 0, py - h);
    g.addColorStop(0, alpha(S_RED, 0.75));
    g.addColorStop(1, alpha(S_GOLD, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(px - 2.5, py);
    ctx.quadraticCurveTo(px, py - h * 0.5, px + Math.sin(tick * 0.2 + i) * 1.5, py - h);
    ctx.quadraticCurveTo(px + 0.5, py - h * 0.4, px + 2.5, py);
    ctx.fill();
  }
}

/** 블랙홀: 둘레에서 빙글 돌며 빨려 드는 분홍 알갱이 */
export function holeDust(ctx: Ctx, x: number, y: number, r: number, k: number, tick: number): void {
  for (let i = 0; i < 14; i++) {
    const u = (tick * 0.02 + rnd(i, 5)) % 1;
    const d = r * (1 - u) * 0.9 + 4;
    const ang = rnd(5, i) * TAU + u * 4;
    ctx.fillStyle = alpha(i % 3 ? N_PINK : "#ffffff", k * Math.sin(u * Math.PI));
    ctx.fillRect(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.45, 1.5, 1.5);
  }
}

/** 날아가는 초승달 꼬리: 뒤로 옅어지는 잔상 두 개 */
export function moonTrail(ctx: Ctx, x: number, y: number, dx: number, dy: number, r: number, thick: number, al: number): void {
  const ang = Math.atan2(dy, dx);
  for (let k = 1; k <= 2; k++) voidArc(ctx, x - dx * k * 9, y - dy * k * 9, r * (1 - k * 0.1), ang - 1.1 + k * 0.15, ang + 1.1 - k * 0.15, thick * (1 - k * 0.3), al * (0.35 / k), 0.85);
}

/** 몸에서 피어오르는 빛 알갱이 (변신·치유) · c1·c2 두 색 · n개 · f: 진행 */
export function riseMotes(ctx: Ctx, x: number, y: number, n: number, f: number, c1: string, c2: string, seed: number, plus = false): void {
  additive(ctx, () => {
    for (let k = 0; k < n; k++) {
      const px = x + (rnd(k, seed) - 0.5) * 22;
      const py = y + 4 - f * 30 * (0.5 + rnd(seed, k) * 0.7);
      const a = (1 - f) * (0.6 + 0.4 * rnd(k + 2, seed));
      ctx.fillStyle = alpha(k % 2 ? c1 : c2, a);
      if (plus && k % 3 === 0) {
        ctx.fillRect(px - 2, py - 0.5, 4, 1.2);
        ctx.fillRect(px - 0.6, py - 2, 1.2, 4);
      } else ctx.fillRect(px, py, 1.5, 1.5);
    }
  });
}
