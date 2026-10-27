// 마법사 마법진(발밑에 공격마다 한 획씩 새겨짐) · 마법 효과(불꽃·번개·얼음·혜성·별비·공허)
// 시간술사 시계 표식(적 머리 위 작은 시계, 표식만큼 눈금이 켜짐) · 시간 붕괴(시계가 금 가며 깨져 조각이 흩어짐)
import { runeFill, spellOf, type EffectState, type RunState, type SpellKind } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
/** 마법마다 색: 진한 색 · 밝은 색 */
const TONE: Record<SpellKind | "cast", [string, string]> = {
  nova: ["#ff6a2a", "#ffd27a"],
  storm: ["#6a8aff", "#e8f0ff"],
  frost: ["#4ac8ff", "#e0f8ff"],
  comet: ["#ff8a3a", "#fff0b0"],
  stars: ["#c88aff", "#fff6c8"],
  void: ["#7a3aff", "#d8b8ff"],
  cast: ["#b88aff", "#ffffff"],
};
const CLOCK_MAX = 5;

function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number, from = 0, to = TAU): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), from, to);
  ctx.stroke();
}

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** 발밑 마법진: 바깥 고리가 획 수만큼 차고, 안쪽 육각별이 한 변씩 그려짐 · 거의 다 차면 반짝임 */
export function drawRuneGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  const fill = runeFill(p);
  if (p.characterId !== "mage" || p.hp <= 0) return;
  const [dark, light] = TONE[spellOf(p).kind];
  const x = snap(p.x);
  const y = snap(p.y + 3);
  const spin = s.tick * 0.01;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.5);
  ctx.globalAlpha = 0.25;
  ring(ctx, 0, 0, 15, dark, 1);
  ring(ctx, 0, 0, 11, dark, 1);
  ctx.globalAlpha = 0.55 + 0.35 * fill;
  // 바깥 고리: 새겨진 만큼
  if (fill > 0) ring(ctx, 0, 0, 15, light, 1.5, -Math.PI / 2 + spin, -Math.PI / 2 + spin + TAU * fill);
  // 육각별: 한 획 = 한 변
  const n = Math.round(fill * 6);
  for (let i = 0; i < n; i++) {
    const a = spin + (i * TAU * 2) / 6;
    const b = spin + ((i + 1) * TAU * 2) / 6;
    line(ctx, Math.cos(a) * 11, Math.sin(a) * 11, Math.cos(b) * 11, Math.sin(b) * 11, light, 1);
  }
  // 고리 둘레 문자 점
  ctx.fillStyle = dark;
  for (let i = 0; i < 12; i++) {
    const a = -spin * 2 + (i * TAU) / 12;
    if (i < fill * 12) ctx.fillRect(Math.round(Math.cos(a) * 13) - 0.5, Math.round(Math.sin(a) * 13) - 0.5, 1, 1);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

/** 시계 표식: 적 머리 위 작은 시계 (켜진 눈금 = 표식 수, 바늘이 돎) */
export function drawClockMarks(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const e of s.enemies) {
    const n = e.clock ?? 0;
    if (n <= 0 || e.hp <= 0) continue;
    const x = snap(e.x);
    const y = snap(e.y - e.r - 9);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#1a1830";
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, TAU);
    ctx.fill();
    ring(ctx, x, y, 4.5, n >= CLOCK_MAX - 1 ? "#ff6a8a" : "#e8d8a0", 1);
    for (let i = 0; i < CLOCK_MAX; i++) {
      const a = -Math.PI / 2 + (i * TAU) / CLOCK_MAX;
      ctx.fillStyle = i < n ? "#ffe07a" : "#4a4660";
      ctx.fillRect(Math.round(x + Math.cos(a) * 3) - 0.5, Math.round(y + Math.sin(a) * 3) - 0.5, 1, 1);
    }
    const h = s.tick * 0.12 + e.id;
    line(ctx, x, y, x + Math.cos(h) * 2.5, y + Math.sin(h) * 2.5, "#ffffff", 1);
  }
  ctx.globalAlpha = 1;
}

/** 시간 붕괴: 큰 시계가 떠올라 금이 가고 → 조각나 흩어짐 */
function collapse(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const r = fx.size;
  if (t < 0.45) {
    const k = t / 0.45;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#24203a";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ring(ctx, x, y, r, "#e8d8a0", 2);
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12;
      line(ctx, x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, "#e8d8a0", 1);
    }
    // 바늘이 거꾸로 빠르게 돎
    const h = -k * TAU * 2;
    line(ctx, x, y, x + Math.cos(h) * r * 0.75, y + Math.sin(h) * r * 0.75, "#ffffff", 1.5);
    line(ctx, x, y, x + Math.cos(h / 12) * r * 0.5, y + Math.sin(h / 12) * r * 0.5, "#ffe07a", 2);
    // 금: 가운데에서 바깥으로 갈라짐
    for (let i = 0; i < 5; i++) {
      const a = i * 1.37 + 0.4;
      const len = r * Math.min(1, k * 1.6);
      const mx = x + Math.cos(a) * len * 0.5 + Math.cos(a + 1.4) * 2;
      const my = y + Math.sin(a) * len * 0.5 + Math.sin(a + 1.4) * 2;
      line(ctx, x, y, mx, my, "#ffffff", 1);
      line(ctx, mx, my, x + Math.cos(a) * len, y + Math.sin(a) * len, "#ffffff", 1);
    }
    return;
  }
  // 조각이 사방으로 흩어지며 사라짐 + 빛 고리
  const k = (t - 0.45) / 0.55;
  ctx.globalAlpha = 1 - k;
  ring(ctx, x, y, r * (1 + k * 1.2), "#ffe07a", 2 * (1 - k) + 0.5);
  for (let i = 0; i < 10; i++) {
    const a = i * 0.63 + 0.2;
    const d = r * (0.3 + k * 1.8);
    ctx.save();
    ctx.translate(x + Math.cos(a) * d, y + Math.sin(a) * d + k * k * 8);
    ctx.rotate(a + k * 6);
    ctx.fillStyle = i % 3 ? "#e8d8a0" : "#ffffff";
    ctx.fillRect(-2, -1, 4, 2);
    ctx.restore();
  }
}

/** 마법 하나: kind(=fx.tint)마다 모양 */
function spell(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const kind = (fx.tint ?? "nova") as SpellKind | "cast";
  const [dark, light] = TONE[kind] ?? TONE.nova;
  const r = fx.size;
  // 떨어지는 마법: 처음엔 위에서 내려옴
  const fall = Math.min(1, t * 3);
  const after = Math.max(0, (t - 0.33) / 0.67);
  switch (kind) {
    case "cast":
      ctx.globalAlpha = 1 - t;
      ring(ctx, x, y, r * (0.6 + t), light, 2);
      ring(ctx, x, y, r * (0.3 + t), dark, 1);
      return;
    case "storm":
      if (t < 0.4) {
        ctx.globalAlpha = 1;
        let px = x;
        let py = y - 60;
        for (let i = 1; i <= 6; i++) {
          const nx = x + (((i * 37) % 9) - 4) * (i < 6 ? 1 : 0);
          const ny = y - 60 + i * 10;
          line(ctx, px, py, nx, ny, i % 2 ? light : dark, 2);
          px = nx;
          py = ny;
        }
      }
      break;
    case "comet":
    case "stars":
      if (fall < 1) {
        const cx = x + (1 - fall) * 30;
        const cy = y - (1 - fall) * 70;
        ctx.globalAlpha = 1;
        line(ctx, cx + 10, cy - 20, cx, cy, dark, kind === "comet" ? 5 : 2);
        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.arc(cx, cy, kind === "comet" ? 5 : 2.5, 0, TAU);
        ctx.fill();
        return;
      }
      break;
    case "void":
      ctx.globalAlpha = 0.8 * (1 - t);
      ctx.fillStyle = "#14082a";
      ctx.beginPath();
      ctx.arc(x, y, r * (1 - after * 0.6), 0, TAU);
      ctx.fill();
      for (let i = 0; i < 3; i++) ring(ctx, x, y, r * (1 - ((t * 2 + i / 3) % 1)), dark, 1);
      break;
    case "frost":
      ctx.globalAlpha = 1 - t;
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        line(ctx, x, y, x + Math.cos(a) * r * Math.min(1, t * 2.5), y + Math.sin(a) * r * Math.min(1, t * 2.5) * 0.6, i % 2 ? light : dark, 2);
      }
      break;
    default:
  }
  // 바닥 폭발 고리
  ctx.globalAlpha = 1 - after;
  ctx.fillStyle = dark;
  ctx.globalAlpha = 0.35 * (1 - after);
  ctx.beginPath();
  ctx.arc(x, y, r * (0.5 + after * 0.5), 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1 - after;
  ring(ctx, x, y, r * (0.4 + after * 0.7), light, 2);
  ring(ctx, x, y, r * (0.2 + after * 0.9), dark, 1);
}

/** 효과: 마법 · 시간 붕괴 */
export function drawRuneFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "mgSpell" && fx.kind !== "chCollapse") return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "chCollapse") collapse(ctx, fx, x, y, t);
  else spell(ctx, fx, x, y, t);
  ctx.globalAlpha = 1;
  return true;
}
