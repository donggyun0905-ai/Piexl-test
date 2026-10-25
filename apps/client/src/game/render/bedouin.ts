// 베두인 그리기: 던진 차크람(날아감·바닥에서 반짝·돌아옴) · 환영 차크람 · 줍기 모래 회전 베기 · 모래 회오리 · 대시 모래바람 · 모아 둔 대시 칸
import { DASH_TICKS, PERKS, dashMax, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const SAND = ["#f2d08a", "#e8b860", "#c8904a", "#fff0c8"];

/** 금빛 차크람 하나 (가운데 x·y, 반지름 r, 돌아간 각 a): 두꺼운 금 몸통 · 짙은 안쪽 테 · 밝은 바깥 날 · 톱니 8개 · 붉은 보석. tint를 주면 그 빛깔(환영) */
function ring(ctx: Ctx, x: number, y: number, r: number, a: number, tint?: string, alpha = 1): void {
  const body = tint ?? "#f2c14e";
  const dark = tint ? "#5a7ab0" : "#a8741e";
  const hi = tint ? "#ffffff" : "#fff0a0";
  ctx.globalAlpha = alpha;
  ctx.lineWidth = Math.max(3, r * 0.5);
  ctx.strokeStyle = dark;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = Math.max(2, r * 0.3);
  ctx.strokeStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r + r * 0.08, 0, Math.PI * 2);
  ctx.stroke();
  // 빛 받는 위쪽 날
  ctx.lineWidth = Math.max(1, r * 0.1);
  ctx.strokeStyle = hi;
  ctx.beginPath();
  ctx.arc(x, y, r + r * 0.22, a + Math.PI * 1.1, a + Math.PI * 1.8);
  ctx.stroke();
  // 바깥 톱니 8개
  ctx.fillStyle = body;
  for (let i = 0; i < 8; i++) {
    const t = a + (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(t) * r * 1.15, y + Math.sin(t) * r * 1.15);
    ctx.lineTo(x + Math.cos(t + 0.3) * r * 1.55, y + Math.sin(t + 0.3) * r * 1.55);
    ctx.lineTo(x + Math.cos(t + 0.42) * r * 1.15, y + Math.sin(t + 0.42) * r * 1.15);
    ctx.fill();
  }
  // 붉은 보석 둘
  ctx.fillStyle = tint ? hi : "#d8283a";
  for (const t of [a + Math.PI / 2, a - Math.PI / 2]) ctx.fillRect(x + Math.cos(t) * r - 1.5, y + Math.sin(t) * r - 1.5, 3, 3);
  ctx.globalAlpha = 1;
}

/** 모래 알갱이 (자리마다 정해진 흩날림, 화면 전용) */
function grains(ctx: Ctx, x: number, y: number, r: number, n: number, tick: number, alpha: number, seed = 0): void {
  for (let i = 0; i < n; i++) {
    const h = ((i + seed) * 2654435761) >>> 0;
    const a = (h % 628) / 100 + tick * 0.18 * (i % 2 ? 1 : -1);
    const d = r * (0.35 + ((h >> 10) % 65) / 100);
    ctx.globalAlpha = alpha * (0.5 + (i % 3) * 0.2);
    ctx.fillStyle = SAND[i % SAND.length]!;
    ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, i % 4 === 0 ? 2 : 1, 1);
  }
  ctx.globalAlpha = 1;
}

/** 무희의 춤: 몸을 감고 빙글 도는 분홍·금빛 비단 자락 셋 (spin = 0→1 대시 진행) */
function dancerSilk(ctx: Ctx, x: number, y: number, r: number, spin: number, alpha: number): void {
  const colors = ["#e86a9a", "#f2c14e", "#b85ad8"];
  for (let i = 0; i < 3; i++) {
    const a0 = spin * Math.PI * 4 + (i * Math.PI * 2) / 3;
    ctx.globalAlpha = 0.8 * alpha;
    ctx.strokeStyle = colors[i]!;
    ctx.lineWidth = 2.5 - i * 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y, r + 7 + i * 2, (r + 7 + i * 2) * 0.6, 0, a0, a0 + 2.4);
    ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 4; i++) {
    const a = spin * Math.PI * 4 + i * 1.57;
    ctx.fillRect(x + Math.cos(a) * (r + 10), y + Math.sin(a) * (r + 10) * 0.6, 1, 1);
  }
  ctx.globalAlpha = 1;
}

export function drawBedouin(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "bedouin" && !p.ck && !p.vortex && !p.ghosts && dashMax(p) <= 1) return;
  const px = snap(lerp(p.prevX, p.x, alpha));
  const py = snap(lerp(p.prevY, p.y, alpha));
  // 모래 회오리 (모래 폭풍)
  if (p.vortex) {
    const v = p.vortex;
    const r = PERKS.sandstorm.radius;
    const fade = Math.min(1, v.left / 20);
    for (let k = 0; k < 3; k++) {
      ctx.globalAlpha = 0.35 * fade;
      ctx.strokeStyle = SAND[k]!;
      ctx.lineWidth = 2;
      const a0 = s.tick * 0.2 + k * 2.1;
      ctx.beginPath();
      ctx.ellipse(v.x, v.y, r * (1 - k * 0.25), r * 0.7 * (1 - k * 0.25), 0, a0, a0 + 4);
      ctx.stroke();
    }
    grains(ctx, v.x, v.y, r, 26, s.tick, fade, 7);
  }
  // 대시 모래바람: 지나온 쪽으로 굵게 휘날리는 모래 띠 둘 + 흩날리는 모래 (무희의 춤이면 빙글 도는 비단 자락)
  if (p.characterId === "bedouin" && p.dashTicks > 0) {
    const k = p.dashTicks / DASH_TICKS;
    for (const side of [-1, 1]) {
      ctx.globalAlpha = 0.6 * k;
      ctx.strokeStyle = side < 0 ? SAND[1]! : SAND[0]!;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const back = i * 4;
        const wob = side * (3 + i * 0.8) + Math.sin(s.tick * 0.8 + i) * 1.5;
        const x = px - p.dashDirX * back - p.dashDirY * wob;
        const y = py - p.dashDirY * back + p.dashDirX * wob + 2;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 26; i++) {
      const back = 4 + i * 1.6;
      const wob = Math.sin(s.tick * 0.9 + i * 1.7) * (2 + i * 0.4);
      ctx.globalAlpha = 0.85 * (1 - i / 26) * Math.max(0.4, k);
      ctx.fillStyle = SAND[i % SAND.length]!;
      ctx.fillRect(px - p.dashDirX * back - p.dashDirY * wob, py - p.dashDirY * back + p.dashDirX * wob + 3, i % 3 === 0 ? 3 : 2, i % 2 ? 1 : 2);
    }
    if (p.passives.includes("duneRush")) dancerSilk(ctx, px, py, p.r, 1 - k, k);
    ctx.globalAlpha = 1;
  }
  // 잔상 고리: 반투명하게 돌며 서서히 사라지는 잔상
  for (const g of p.ghosts ?? []) ring(ctx, snap(g.x), snap(g.y), g.r, s.tick * 0.35 + g.x, undefined, 0.35 * Math.min(1, g.left / 40));
  // 던진 차크람
  const c = p.ck;
  if (c && c.where === `${s.floor}/${s.roomId}`) {
    const x = snap(lerp(c.prevX, c.x, alpha));
    const y = snap(lerp(c.prevY, c.y, alpha));
    if (c.mode === "ground") {
      // 바닥: 그림자 + 천천히 도는 고리 + 줍기 표시(대시로 지나가면 주움)
      ctx.fillStyle = "rgba(20, 10, 0, 0.3)";
      ctx.beginPath();
      ctx.ellipse(x, y + 2, c.r * 1.3, c.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ring(ctx, x, y, c.r, c.spin * 0.05);
      const pulse = 0.4 + 0.3 * Math.sin(s.tick * 0.2);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = "#ffe8a0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, c.r + 6 + Math.sin(s.tick * 0.2) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      // 날아감: 빠르게 도는 고리 + 지나온 자리 잔상
      ctx.globalAlpha = 0.25;
      ring(ctx, x - c.vx * 2, y - c.vy * 2, c.r, -s.tick * 0.6, undefined, 0.25);
      ring(ctx, x, y, c.r, -s.tick * 0.6);
      grains(ctx, x, y, c.r * 1.6, 8, s.tick, 0.6, 3);
    }
  }
  // 모아 둔 대시 칸 (발밑 작은 네모)
  const max = dashMax(p);
  if (max > 1 && !s.over) {
    const have = Math.min(max, p.dashCharges ?? max);
    const w = max * 4 - 1;
    for (let i = 0; i < max; i++) {
      const x = px - w / 2 + i * 4;
      ctx.fillStyle = "rgba(20, 14, 10, 0.75)";
      ctx.fillRect(x - 0.5, py + p.r + 3.5, 4, 4);
      ctx.fillStyle = i < have ? "#f2c14e" : "#5a4a3a";
      ctx.fillRect(x, py + p.r + 4, 3, 3);
    }
  }
}

/** 환영 차크람 (사막 환영): 푸르스름한 반투명 고리 */
export function drawBedouinShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit !== "chakram") return false;
  ring(ctx, x, y, pr.r + 1, -tick * 0.6, "#c8e0ff", 0.6);
  return true;
}

/** 줍기 모래 회전 베기: 퍼지는 모래 소용돌이 + 흰 칼날 궤적 */
export function drawBedouinFx(ctx: Ctx, fx: EffectState, tick: number, snap: Snap): boolean {
  if (fx.kind !== "sandspin") return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size * (1.05 - t * 0.35);
  for (let k = 0; k < 4; k++) {
    ctx.globalAlpha = t * (0.55 - k * 0.1);
    ctx.strokeStyle = SAND[k]!;
    ctx.lineWidth = 4 - k;
    const a0 = (1 - t) * 9 + k * 1.6;
    ctx.beginPath();
    ctx.arc(x, y, r * (1 - k * 0.18), a0, a0 + 4.2);
    ctx.stroke();
  }
  ctx.globalAlpha = t;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, (1 - t) * 9, (1 - t) * 9 + Math.PI * 1.5);
  ctx.stroke();
  grains(ctx, x, y, r * 1.15, 40, tick, t, 11);
  return true;
}
