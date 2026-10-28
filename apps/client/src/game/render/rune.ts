// 마법사 마법진(발밑에 공격마다 한 획씩 새겨짐) · 마법 효과(불꽃·번개·얼음·혜성·별비·공허)
// 시간술사 시계 표식(적 머리 위 작은 시계, 표식만큼 눈금이 켜짐) · 시간 붕괴(시계가 금 가며 깨져 조각이 흩어짐)
import { runeFill, spellOf, type EffectState, type RunState, type SpellKind } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, beam, glow, shock, sparks } from "./pwFxBits";

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
  // 마법진 빛 (차오를수록 밝게)
  additive(ctx, () => glow(ctx, 0, 0, 18, dark, 0.2 + 0.4 * fill));
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
  const seed = fx.x * 3 + fx.y;
  switch (kind) {
    case "cast":
      // 시전: 손끝에서 마법진 고리 두 겹이 퍼짐
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.6 + t), light, 1 - t, 3);
        shock(ctx, x, y, r * (0.3 + t), dark, 1 - t, 3);
        glow(ctx, x, y, r * 0.6, dark, 1 - t, 1);
      });
      return;
    case "storm":
      // 번개: 하늘에서 꺾이며 내리꽂힘 (흰 속 + 푸른 빛) → 땅에서 번쩍
      if (t < 0.4) {
        const a = 1 - t / 0.4;
        additive(ctx, () => {
          let px = x;
          let py = y - 60;
          for (let i = 1; i <= 6; i++) {
            const nx = x + (((i * 37 + Math.floor(fx.ticks / 2) * 13) % 11) - 5) * (i < 6 ? 1 : 0);
            const ny = y - 60 + i * 10;
            beam(ctx, px, py, nx, ny, 2.5, dark, a);
            px = nx;
            py = ny;
          }
          glow(ctx, x, y, r, light, a, 1.5);
        });
      }
      break;
    case "comet":
    case "stars": {
      // 혜성·별비: 불꼬리를 끌며 비스듬히 떨어짐
      if (fall < 1) {
        const cx = x + (1 - fall) * 30;
        const cy = y - (1 - fall) * 70;
        const big = kind === "comet";
        additive(ctx, () => {
          beam(ctx, cx + 15, cy - 30, cx, cy, big ? 6 : 2.5, dark, 0.8);
          glow(ctx, cx, cy, big ? 12 : 6, light, 1, 1.4);
        });
        return;
      }
      break;
    }
    case "void":
      // 공허: 검은 구멍 + 빨려 드는 보랏빛 고리와 별빛
      ctx.globalAlpha = 0.85 * (1 - t);
      ctx.fillStyle = "#0c0418";
      ctx.beginPath();
      ctx.arc(x, y, r * (1 - after * 0.6), 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      additive(ctx, () => {
        shock(ctx, x, y, r * (1 - after * 0.6), dark, 1 - t, 5);
        for (let i = 0; i < 3; i++) shock(ctx, x, y, Math.max(2, r * (1 - ((t * 2 + i / 3) % 1))), light, 0.5 * (1 - t), 2);
        sparks(ctx, x, y, 8, r, 1 - t, light, seed);
      });
      return;
    case "frost":
      // 얼음: 바닥에서 솟는 얼음 결정 여덟 + 서리 안개
      additive(ctx, () => glow(ctx, x, y, r * 1.1, dark, 0.6 * (1 - t)));
      ctx.globalAlpha = 1 - t;
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        const len = r * Math.min(1, t * 2.5) * (i % 2 ? 0.7 : 1);
        const ex = x + Math.cos(a) * len;
        const ey = y + Math.sin(a) * len * 0.6;
        ctx.fillStyle = i % 2 ? light : dark;
        ctx.beginPath();
        ctx.moveTo(x - Math.sin(a) * 2, y + Math.cos(a) * 1.2);
        ctx.lineTo(ex, ey);
        ctx.lineTo(x + Math.sin(a) * 2, y - Math.cos(a) * 1.2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      break;
    default:
  }
  // 바닥 폭발: 빛 덩이 + 충격파 두 겹 + 불똥
  additive(ctx, () => {
    glow(ctx, x, y, r * (0.6 + after * 0.5), dark, 1 - after, after < 0.2 ? 1.5 : 0.5);
    shock(ctx, x, y, r * (0.4 + after * 0.8), light, 1 - after, 6);
    shock(ctx, x, y, r * (0.2 + after * 0.9), dark, 1 - after, 4);
    sparks(ctx, x, y, 10, r * 1.2, after, light, seed);
  });
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
