// 이클립스 그리기 (2): 상태에서 바로 — 영역(이글거리는 영역·죽음의 영역) · 블랙홀 · 날아가는 초승달 · 뛰어오른 그림자
// · 바뀌는 오라(보라는 아래로, 노랑은 위로 꺼짐) · 치유의 빛 · 머리 위 게이지 · 지금 모습 그림 이름
import { ECLIPSE, eclipseZoneR, isEclipse, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { blackHole, eclipseLift, N_PINK, N_VOID, S_GOLD, S_RED, TAU, voidArc } from "./eclipseBits";
import { EC_ALPHA } from "./eclipse";
import { holeDust, moonTrail, riseMotes, zoneFlair } from "./eclipseFlair";
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

export { eclipseLift } from "./eclipseBits";

/** 바뀌는 중 진행 (0~1, 바뀌지 않으면 -1) */
const shiftU = (p: PlayerState) => (p.ecShift ? 1 - p.ecShift / ECLIPSE.shiftTicks : -1);

/** 지금 그릴 그림: 바뀌는 중에는 오라가 몸을 다 덮은 뒤(절반)부터 새 모습 */
export function eclipseSheet(p: PlayerState): string | undefined {
  if (!isEclipse(p)) return undefined;
  const night = p.ecShift && shiftU(p) > 0.5 ? !p.ecNight : !!p.ecNight;
  return night ? "eclipseNight" : "eclipse";
}

/** 바닥 영역: 속은 옅게 물들이고 테 한 줄 · 테를 따라 작은 불꽃/넋이 천천히 피어오름 */
function zone(ctx: Ctx, x: number, y: number, r: number, night: boolean, tick: number): void {
  const inner = night ? N_VOID : S_RED;
  const rim = night ? N_PINK : S_GOLD;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  const g = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
  g.addColorStop(0, alpha(inner, night ? 0.32 : 0.1));
  g.addColorStop(1, alpha(inner, night ? 0.5 : 0.3));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = alpha(rim, 0.85);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  zoneFlair(ctx, x, y, r, night, tick);
  // 테에서 피어오르는 불티(태양) · 검은 넋(일식)
  for (let i = 0; i < 12; i++) {
    const u = (tick * (night ? 0.008 : 0.014) + rnd(i, 3)) % 1;
    const ang = rnd(i, 9) * TAU + tick * 0.002;
    const px = x + Math.cos(ang) * r * 0.97;
    const py = y + Math.sin(ang) * r * 0.55 * 0.97 - u * (night ? 18 : 12);
    ctx.fillStyle = alpha(i % 2 ? rim : inner, 0.85 * Math.sin(u * Math.PI));
    if (night) {
      ctx.beginPath();
      ctx.ellipse(px, py, 1.6, 2.8, 0, 0, TAU);
      ctx.fill();
    } else ctx.fillRect(px, py, 1.5, 2);
  }
}

/** 바닥 쪽 (몸보다 먼저): 영역 · 블랙홀 · 뛰어오른 동안 그림자 */
export function drawEclipseBack(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isEclipse(p)) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a) + p.r);
  const night = eclipseSheet(p) === "eclipseNight";
  zone(ctx, x, y, eclipseZoneR({ ...p, ecNight: night }), night, s.tick);
  for (const h of p.ecHoles ?? []) {
    const life = h.t / h.max;
    blackHole(ctx, snap(h.x), snap(h.y + p.r), h.r, life, s.tick);
    holeDust(ctx, snap(h.x), snap(h.y + p.r) - 6, h.r, Math.min(1, (1 - life) * 6) * Math.min(1, life * 5), s.tick);
  }
  const lift = eclipseLift(p);
  if (lift <= 0) return;
  ctx.fillStyle = `rgba(10,4,20,${0.5 - lift / 110})`;
  ctx.beginPath();
  ctx.ellipse(x, y, 11 - lift / 6, 4 - lift / 16, 0, 0, TAU);
  ctx.fill();
  // 떨어질 자리: 분홍 보라 고리 한 줄이 좁혀 옴
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  ctx.strokeStyle = alpha(N_PINK, 0.3 + lift / 80);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, ECLIPSE.slamR * (0.4 + (p.ecAir ?? 0) / ECLIPSE.jumpTicks * 0.6), 0, TAU);
  ctx.stroke();
  ctx.restore();
}

/** 바뀌는 오라: 몸을 감싸는 빛 기둥 하나 (차오름 → 절반부터 보라는 아래로 · 노랑은 위로 꺼짐) */
function shiftAura(ctx: Ctx, x: number, y: number, u: number, toNight: boolean, tick: number): void {
  const edge = toNight ? N_PINK : S_GOLD;
  const core = toNight ? N_VOID : S_RED;
  const H = 46;
  const rise = Math.min(1, u / 0.5);
  const out = Math.max(0, (u - 0.5) / 0.5);
  let top = y - H * rise;
  let bot = y + 3;
  if (out > 0) {
    if (toNight) top = y - H + (H + 3) * out;
    else bot = y + 3 - (H + 3) * out;
  }
  if (bot - top < 1) return;
  const wob = Math.sin(tick * 0.4) * 1.2;
  const g = ctx.createLinearGradient(0, bot, 0, top);
  g.addColorStop(0, alpha(toNight ? edge : core, 0.55));
  g.addColorStop(1, alpha(toNight ? core : edge, 0.15));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, (top + bot) / 2, 12 + wob, (bot - top) / 2, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = alpha(edge, 0.9);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  additive(ctx, () => glow(ctx, x, (top + bot) / 2, 26, edge, 0.5));
  riseMotes(ctx, x, bot, 10, (tick % 24) / 24, edge, core, 7);
}

/** 바뀜 끝 (0~1): 보라 고리가 바닥으로 좁혀 들어가고 / 노란 빛 알갱이가 하늘로 흩어짐 */
function shiftEnd(ctx: Ctx, x: number, y: number, f: number, night: boolean): void {
  const fade = 1 - f;
  if (night) {
    ctx.save();
    ctx.translate(x, y + 3);
    ctx.scale(1, 0.4);
    ctx.strokeStyle = alpha(N_PINK, fade);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 24 * (1 - f * 0.9), 0, TAU);
    ctx.stroke();
    ctx.restore();
    return;
  }
  for (let k = 0; k < 10; k++) {
    ctx.fillStyle = alpha(k % 2 ? S_GOLD : S_RED, fade);
    ctx.fillRect(x + (rnd(k, 4) - 0.5) * 24, y - 8 - f * 50 * (0.5 + rnd(4, k)), 1.5, 3);
  }
}

/** 몸 위: 날아가는 초승달 · 공중 꼬리 · 바뀌는 오라 · 치유의 빛 */
export function drawEclipseAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isEclipse(p)) return;
  ctx.save();
  ctx.globalAlpha *= EC_ALPHA;
  for (const c of p.ecCuts ?? []) {
    if (c.sun) continue;
    const k = Math.min(1, a);
    const cx = snap(c.x + c.dx * c.sp * (k - 1));
    const cy = snap(c.y + c.dy * c.sp * (k - 1));
    const ang = Math.atan2(c.dy, c.dx);
    const r = c.w * 1.6;
    const cal = Math.min(1, (c.t / c.max) * 3);
    moonTrail(ctx, cx - c.dx * r * 0.75, cy - c.dy * r * 0.75, c.dx, c.dy, r, c.w * 0.6, cal);
    voidArc(ctx, cx - c.dx * r * 0.75, cy - c.dy * r * 0.75, r, ang - 1.1, ang + 1.1, c.w * 0.6, cal, 0.85);
  }
  ctx.restore();
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  const lift = eclipseLift(p);
  if (lift > 0) {
    const g = ctx.createLinearGradient(0, y - lift, 0, y + 4);
    g.addColorStop(0, alpha(N_PINK, (p.ecAir ?? 0) < 8 ? 0.7 : 0.3));
    g.addColorStop(1, alpha(N_PINK, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - 3, y - lift, 6, lift + 4);
  }
  const u = shiftU(p);
  if (u >= 0) shiftAura(ctx, x, y + p.r, u, !p.ecNight, s.tick);
  for (const fx of s.effects) {
    const f = 1 - fx.ticks / fx.maxTicks;
    if (fx.kind === "ecShiftEnd") shiftEnd(ctx, x, y + p.r, f, !!fx.width);
    else if (fx.kind === "ecHeal") {
      // 치유의 빛: 몸에서 피어오르는 빛 알갱이·십자 + 은은한 초록 빛
      additive(ctx, () => glow(ctx, x, y, 16, "#c8ff9a", 0.4 * (1 - f)));
      riseMotes(ctx, x, y, 9, f, "#c8ff9a", S_GOLD, 8, true);
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
}
