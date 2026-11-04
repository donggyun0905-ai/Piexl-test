// 이클립스 그리기 (2): 상태에서 바로 — 영역(이글거리는 영역·죽음의 영역) · 블랙홀 · 날아가는 검격 · 뛰어오른 그림자
// · 바뀌는 오라(보라는 아래로, 노랑은 위로 꺼짐) · 치유의 빛 · 머리 위 게이지 · 지금 모습 그림 이름
import { ECLIPSE, eclipseZoneR, isEclipse, type PlayerState, type RunState } from "@pixel-rogue/shared";
export { eclipseLift } from "./eclipseBits";
import { blackHole, chevron, eclipseLift, flameTongue, N_DEEP, N_LIGHT, N_PINK, N_VIO, N_VOID, S_AMBER, S_GOLD, S_RED, S_WHITE, smoke, TAU, voidArc } from "./eclipseBits";
import { additive, alpha, glow, rnd, rune, type Ctx } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

/** 바뀌는 중 진행 (0~1, 바뀌지 않으면 -1) */
const shiftU = (p: PlayerState) => (p.ecShift ? 1 - p.ecShift / ECLIPSE.shiftTicks : -1);

/** 지금 그릴 그림: 바뀌는 중에는 오라가 몸을 다 덮은 뒤(절반)부터 새 모습 */
export function eclipseSheet(p: PlayerState): string | undefined {
  if (!isEclipse(p)) return undefined;
  const night = p.ecShift && shiftU(p) > 0.5 ? !p.ecNight : !!p.ecNight;
  return night ? "eclipseNight" : "eclipse";
}

/** 이글거리는 영역: 붉은 속 · 노란 테 · 테를 따라 일렁이는 불꽃 · 떠오르는 불티 */
function sunZone(ctx: Ctx, x: number, y: number, r: number, tick: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, alpha(S_RED, 0.1));
  g.addColorStop(0.72, alpha(S_RED, 0.26));
  g.addColorStop(0.9, alpha(S_AMBER, 0.42));
  g.addColorStop(0.97, alpha(S_GOLD, 0.65));
  g.addColorStop(1, alpha(S_GOLD, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.restore();
  additive(ctx, () => {
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * TAU + tick * 0.004;
      const h = 7 + 5 * Math.sin(tick * 0.18 + i * 1.7) + 3 * Math.sin(tick * 0.07 + i);
      flameTongue(ctx, x + Math.cos(ang) * r * 0.97, y + Math.sin(ang) * r * 0.55 * 0.97, h, 3, Math.sin(tick * 0.12 + i) * 2, 0.55, false);
    }
    for (let i = 0; i < 10; i++) {
      const u = (tick * 0.012 + rnd(i, 3)) % 1;
      const ang = rnd(i, 9) * TAU;
      const d = r * (0.3 + rnd(9, i) * 0.65);
      ctx.fillStyle = alpha(i % 2 ? S_GOLD : S_AMBER, 0.8 * (1 - u));
      ctx.fillRect(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.55 - u * 22, 1.5, 1.5);
    }
  });
}

/** 죽음의 영역: 검보라 바닥 · 분홍 테 · 천천히 도는 문양 · 피어오르는 검은 넋 */
function nightZone(ctx: Ctx, x: number, y: number, r: number, tick: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, alpha(N_VOID, 0.45));
  g.addColorStop(0.8, alpha(N_DEEP, 0.38));
  g.addColorStop(0.96, alpha(N_VIO, 0.5));
  g.addColorStop(1, alpha(N_PINK, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.restore();
  rune(ctx, x, y, r * 0.98, N_PINK, 0.28, -tick * 0.01);
  for (let i = 0; i < 9; i++) {
    const u = (tick * 0.008 + rnd(i, 5)) % 1;
    const ang = rnd(i, 11) * TAU;
    const d = r * (0.2 + rnd(11, i) * 0.75);
    const px = x + Math.cos(ang) * d + Math.sin(u * 6 + i) * 3;
    const py = y + Math.sin(ang) * d * 0.55 - u * 26;
    ctx.fillStyle = alpha(i % 3 ? N_VOID : N_VIO, 0.6 * Math.sin(u * Math.PI));
    ctx.beginPath();
    ctx.ellipse(px, py, 2.2, 3.5, 0, 0, TAU);
    ctx.fill();
    if (i % 3 === 0) {
      ctx.fillStyle = alpha(N_PINK, 0.8 * Math.sin(u * Math.PI));
      ctx.fillRect(px - 1, py - 1, 1, 1);
      ctx.fillRect(px + 1, py - 1, 1, 1);
    }
  }
}

/** 바닥 쪽 (몸보다 먼저): 영역 · 블랙홀 · 뛰어오른 동안 그림자와 떨어질 자리 */
export function drawEclipseBack(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isEclipse(p)) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a) + p.r);
  const night = eclipseSheet(p) === "eclipseNight";
  (night ? nightZone : sunZone)(ctx, x, y, eclipseZoneR({ ...p, ecNight: night }), s.tick);
  for (const h of p.ecHoles ?? []) blackHole(ctx, snap(h.x), snap(h.y + p.r), h.r, h.pull, h.t / h.max, s.tick, Math.round(h.x + h.y));
  const lift = eclipseLift(p);
  if (lift <= 0) return;
  ctx.fillStyle = `rgba(10,4,20,${0.5 - lift / 110})`;
  ctx.beginPath();
  ctx.ellipse(x, y, 11 - lift / 6, 4 - lift / 16, 0, 0, TAU);
  ctx.fill();
  rune(ctx, x, y, 22 + lift / 2, N_PINK, 0.4 + lift / 70, s.tick * 0.14);
}

/** 바뀌는 오라: 몸을 감싸며 차오르고(무적), 절반부터 보라는 아래로 · 노랑은 위로 꺼짐 */
function shiftAura(ctx: Ctx, x: number, y: number, u: number, toNight: boolean, tick: number): void {
  const c1 = toNight ? N_PINK : S_GOLD;
  const c2 = toNight ? N_VIO : S_AMBER;
  const rise = Math.min(1, u / 0.5);
  const out = Math.max(0, (u - 0.5) / 0.5);
  const H = 46;
  // 감싸는 기둥: 차오를 때는 바닥에서 위로, 꺼질 때 보라는 위가 내려앉고 노랑은 아래가 떠오름
  let top = y - H * rise;
  let bot = y + 4;
  if (out > 0) {
    if (toNight) top = y - H + H * out;
    else bot = y + 4 - (H + 4) * out;
  }
  const fade = out > 0 ? 1 - out * 0.6 : 1;
  additive(ctx, () => {
    const g = ctx.createLinearGradient(0, bot, 0, top);
    g.addColorStop(0, alpha(c2, 0.7 * fade));
    g.addColorStop(0.6, alpha(c1, 0.5 * fade));
    g.addColorStop(1, alpha(c1, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, (top + bot) / 2, 13, Math.max(1, (bot - top) / 2), 0, 0, TAU);
    ctx.fill();
    glow(ctx, x, y - 14, 30, c2, 0.55 * fade, toNight ? 0 : 1);
    // 몸을 휘감는 띠 넷
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 4; k++) {
      ctx.strokeStyle = alpha(k % 2 ? c1 : "#ffffff", 0.8 * fade);
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.06) {
        const yy = bot + (top - bot) * t;
        const ang = t * 8 + tick * 0.3 + k * 1.57;
        ctx.lineTo(x + Math.cos(ang) * 12 * (1 - t * 0.3), yy + Math.sin(ang) * 2);
      }
      ctx.stroke();
    }
  });
  if (toNight) smoke(ctx, x, y, 6, 14, u, 17, 0.7);
}

/** 바뀜 끝 (0~1): 보라는 바닥으로 빨려 들어 사라지고, 노랑은 하늘로 솟아 흩어짐 */
function shiftEnd(ctx: Ctx, x: number, y: number, f: number, night: boolean): void {
  const fade = 1 - f;
  additive(ctx, () => {
    if (night) {
      ctx.save();
      ctx.translate(x, y + 4);
      ctx.scale(1, 0.4);
      ctx.strokeStyle = alpha(N_PINK, fade);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 26 * (1 - f * 0.85), 0, TAU);
      ctx.stroke();
      ctx.restore();
      for (let k = 0; k < 10; k++) {
        const off = (rnd(k, 2) - 0.5) * 26;
        const yy = y - 30 + f * 36 * (0.6 + rnd(2, k) * 0.6);
        ctx.fillStyle = alpha(k % 2 ? N_PINK : N_LIGHT, fade);
        ctx.fillRect(x + off * (1 - f * 0.5), yy, 1.5, 5);
      }
    } else {
      const g = ctx.createLinearGradient(0, y, 0, y - 90);
      g.addColorStop(0, alpha(S_GOLD, 0));
      g.addColorStop(0.3, alpha(S_GOLD, 0.7 * fade));
      g.addColorStop(1, alpha(S_WHITE, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - 7 * fade, y - 90 - f * 20, 14 * fade, 90);
      for (let k = 0; k < 12; k++) {
        const off = (rnd(k, 4) - 0.5) * 30;
        ctx.fillStyle = alpha(k % 2 ? S_GOLD : S_WHITE, fade);
        ctx.fillRect(x + off, y - 10 - f * 60 * (0.5 + rnd(4, k)), 1.5, 3);
      }
    }
  });
}

/** 몸 위: 날아가는 검격 · 공중 빛 꼬리 · 바뀌는 오라 · 치유의 빛 */
export function drawEclipseAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isEclipse(p)) return;
  for (const c of p.ecCuts ?? []) {
    const k = Math.min(1, a);
    const cx = snap(c.x + c.dx * c.sp * (k - 1));
    const cy = snap(c.y + c.dy * c.sp * (k - 1));
    const ang = Math.atan2(c.dy, c.dx);
    const fade = Math.min(1, (c.t / c.max) * 3);
    if (c.sun) {
      const len = c.w * 1.25 * c.size;
      const tilt = [0, 0.28, -0.28, 0.12, 0][c.k] ?? 0;
      // 뒤로 남는 잔상 둘 → 본 검격
      for (let j = 2; j >= 1; j--) chevron(ctx, cx - c.dx * c.sp * j * 1.2, cy - c.dy * c.sp * j * 1.2, ang, len * (1 - j * 0.12), c.w * 0.22, tilt, fade * (0.35 - j * 0.1));
      chevron(ctx, cx, cy, ang, len, c.w * 0.26 * Math.max(1, c.size * 0.8), tilt, fade);
    } else {
      const r = c.w * 1.5;
      voidArc(ctx, cx - c.dx * r * 0.7, cy - c.dy * r * 0.7, r, ang - 1.05, ang + 1.05, c.w * 0.75, fade, 0.85);
      smoke(ctx, cx - c.dx * 10, cy - c.dy * 10, 3, 8, 1 - c.t / c.max, Math.round(c.x), 0.6);
    }
  }
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  const lift = eclipseLift(p);
  if (lift > 0) {
    const falling = (p.ecAir ?? 0) < 8;
    additive(ctx, () => {
      const g = ctx.createLinearGradient(0, y - lift, 0, y + 6);
      g.addColorStop(0, alpha(N_PINK, falling ? 0.85 : 0.35));
      g.addColorStop(1, alpha(N_VIO, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - (falling ? 7 : 3), y - lift, falling ? 14 : 6, lift + 6);
      glow(ctx, x, y - lift - 6, 18, falling ? N_LIGHT : N_VIO, falling ? 0.8 : 0.45, 1);
    });
  }
  const u = shiftU(p);
  if (u >= 0) shiftAura(ctx, x, y + p.r, u, !p.ecNight, s.tick);
  for (const fx of s.effects) {
    const f = 1 - fx.ticks / fx.maxTicks;
    if (fx.kind === "ecShiftEnd") shiftEnd(ctx, x, y + p.r, f, !!fx.width);
    else if (fx.kind === "ecHeal") {
      // 치유의 빛: 몸에서 피어오르는 금빛 + 연둣빛 알갱이 · 작은 십자
      additive(ctx, () => {
        glow(ctx, x, y - 4, 18, S_GOLD, 0.45 * (1 - f));
        for (let k = 0; k < 6; k++) {
          const off = (rnd(k, 8) - 0.5) * 18;
          const yy = y + 4 - f * 26 * (0.6 + rnd(8, k) * 0.6);
          ctx.fillStyle = alpha(k % 2 ? "#b8ff8a" : S_GOLD, 1 - f);
          ctx.fillRect(x + off, yy, 1.5, 1.5);
          if (k % 3 === 0) {
            ctx.fillRect(x + off - 1.5, yy + 0.25, 4.5, 1);
            ctx.fillRect(x + off + 0.25, yy - 1.5, 1, 4.5);
          }
        }
      });
    }
  }
}

/** 머리 위 게이지: 태양은 금빛, 일식은 분홍 보라 · 다 차면 깜빡 */
export function drawEclipseGauge(ctx: Ctx, p: PlayerState, x: number, top: number, tick: number): void {
  if (!isEclipse(p)) return;
  const w = 18;
  const r = p.ecShift ? 1 : Math.min(1, (p.ecGauge ?? 0) / ECLIPSE.gaugeMax);
  ctx.fillStyle = "rgba(10,6,16,0.85)";
  ctx.fillRect(x - w / 2 - 1, top - 5, w + 2, 4);
  ctx.fillStyle = r >= 1 && (tick >> 2) % 2 ? "#ffffff" : p.ecNight ? N_PINK : S_GOLD;
  ctx.fillRect(x - w / 2, top - 4, Math.round(w * r), 2);
  ctx.fillStyle = p.ecNight ? N_VIO : S_RED;
  ctx.fillRect(x - w / 2, top - 3, Math.round(w * r), 1);
}
