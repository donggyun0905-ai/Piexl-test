// 래빗 그리기: 바닥(땅울림 파동·토끼인장·유령 망치 그림자·갈라진 땅) · 초거대 망치(슈퍼 럭키, 맵을 가리는 크기)
// 그림 sprites/rabbitFx.png (256칸 4×3: 0줄 땅울림 4 · 1줄 토끼인장 4 · 2줄 초거대 망치 4) — scripts/art/rabbit.py
import { RABBIT_HAMMER, RABBIT_ULT, rabbitUltX, ROOM_CY, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import type { Snap } from "./palette";
import { additive, alpha as fade, glow, type Ctx } from "./pwFxBits";

export const RB = { green: "#7dff4a", pink: "#ff7ac0", deep: "#c83a8a", gold: "#ffd84a", ghost: "#c8f0ff" };
const FX = img("rabbitFx");
const C = 256;
const ready = () => FX.complete && FX.naturalWidth > 0;
/** 땅울림 칸마다 원(고리) 가운데 높이 (칸 위에서부터, 256 기준) · 4번째 칸 고리 너비 */
const RING_Y = [155, 157, 162, 174];
const RING_W = 241;

/** 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w */
export function rbPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0): void {
  if (!ready() || a <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
  ctx.restore();
}

/** 땅울림 고리 (frame 0~3): 4번째 칸 고리가 반지름 r이 되게 · 고리 가운데가 (x, y) */
export function quakeRing(ctx: Ctx, frame: number, x: number, y: number, r: number, a = 1): void {
  const w = (2 * r * C) / RING_W;
  const f = Math.max(0, Math.min(3, frame));
  additive(ctx, () => rbPic(ctx, 0, f, x, y - (RING_Y[f]! / C - 0.5) * w, w, a));
}

/** 바닥: 파동 · 토끼인장 · 유령 망치 · 갈라진 땅 */
export function drawRabbitGround(ctx: Ctx, s: RunState, _a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "rabbit") return;
  for (const m of p.rbMarks ?? []) {
    const x = snap(m.x);
    const y = snap(m.y);
    const f = m.age / Math.max(1, m.life);
    if (m.kind === 2) {
      // 갈라진 땅: 어두운 금 + 초록 빛
      const a = Math.min(1, (1 - f) * 3);
      ctx.strokeStyle = fade("#2a1a2a", 0.7 * a);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const an = (i / 5) * Math.PI * 2 + 0.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(an) * m.r * 0.5, y + Math.sin(an) * m.r * 0.3 + 1);
        ctx.lineTo(x + Math.cos(an + 0.3) * m.r, y + Math.sin(an + 0.3) * m.r * 0.55);
        ctx.stroke();
      }
      additive(ctx, () => glow(ctx, x, y, m.r, RB.green, 0.18 * a));
    } else if (m.kind === 0) {
      // 토끼인장: 토끼가 퐁 나와 깡총거리다 (그림 1~4칸) 터짐
      const hop = Math.abs(Math.sin(f * Math.PI * 3)) * 6;
      const w = 20 + f * 10;
      additive(ctx, () => glow(ctx, x, y, w * 0.7, RB.green, 0.3 + f * 0.4));
      rbPic(ctx, 1, Math.min(3, Math.floor(f * 4)), x, y - 8 - hop, w, Math.min(1, f * 6));
    } else {
      // 유령 망치: 바닥 그림자가 커지며 위에서 반투명한 망치가 내려옴
      ctx.fillStyle = fade("#000000", 0.25 + f * 0.25);
      ctx.beginPath();
      ctx.ellipse(x, y, m.r * f, m.r * 0.45 * f, 0, 0, Math.PI * 2);
      ctx.fill();
      rbPic(ctx, 2, 0, x, y - (1 - f) * 70 - 8, m.r * 1.6, 0.55, -0.5 + f * 0.5);
    }
  }
  // 땅울림 파동: 그림 4번째 칸이 쿵·쿵·쿵 한 칸씩 찍힘 (찍는 순간 크게 번쩍 → 그 자리에서 옅어짐)
  for (const w of p.rbWaves ?? []) {
    if (w.age < 0) continue;
    const k = (w.age % RABBIT_HAMMER.waveEvery) / RABBIT_HAMMER.waveEvery;
    const x = snap(w.x);
    const y = snap(w.y);
    const pop = k < 0.2 ? 1.12 - k * 0.6 : 1;
    if (k < 0.35) additive(ctx, () => glow(ctx, x, y, w.r * 0.8, RB.green, (0.35 - k) * 2));
    quakeRing(ctx, 3, x, y, w.r * pop, 1 - k * 0.65);
  }
}

/** 슈퍼 럭키: 초거대 망치 (t = 지난 틱, sim/rabbitUlt와 같은 식) · 슬로우 동안 화면이 살짝 어두워지고 초록 빛 */
export function drawRabbitUlt(ctx: Ctx, t: number, snap: Snap): void {
  const U = RABBIT_ULT;
  const w = ROOM_MAX_X - ROOM_MIN_X;
  const slow = t >= U.enter && t < U.enter + U.slow;
  if (slow) {
    const k = Math.min(1, (t - U.enter) / 10, (U.enter + U.slow - t) / 10);
    ctx.fillStyle = fade("#10081a", 0.35 * k);
    ctx.fillRect(ROOM_MIN_X - 40, ROOM_MIN_Y - 40, w + 80, ROOM_MAX_Y - ROOM_MIN_Y + 80);
  }
  const cx = snap(rabbitUltX(t));
  const frame = t < U.enter ? 1 : slow ? 2 + Math.min(1, Math.floor(((t - U.enter) / U.slow) * 2)) : 3;
  const size = w * 1.25;
  additive(ctx, () => glow(ctx, cx, snap(ROOM_CY), size * 0.45, RB.green, slow ? 0.5 : 0.3));
  rbPic(ctx, 2, frame, cx, snap(ROOM_CY), size, 1, slow ? Math.sin(t * 0.05) * 0.03 : 0);
}
