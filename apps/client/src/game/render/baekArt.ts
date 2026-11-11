// 백령 그리기: 바닥(에너지 참격·망령·떨어지는 대태도 그림자·꽂힌 대태도 범위) · 몸 위(혼불 유령팔·영혼 게이지)
// 그림 sprites/baekryeongFx.png (256칸 4×6: 0줄 참격 4 · 1줄 검무 소용돌이 4 · 2줄 망령 3 · 3·4줄 유령팔 4+4 · 5줄 0칸 대태도) — scripts/art/baekryeong.py
import { armScale, BAEK_SOUL, maxLv, soulNeed, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, glow, ring, type Ctx } from "./pwFxBits";

export const BY = { blue: "#3ac8ff", deep: "#1a5ad8", pale: "#c8f0ff", white: "#f4f8ff", bolt: "#bfe8ff" };
const FX = img("baekryeongFx");
const C = 256;
const ready = () => FX.complete && FX.naturalWidth > 0;
/** 유령팔 기본 너비 (유령팔 크기 1일 때) */
const ARM_W = 40;

/** 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w · flip = 좌우 뒤집기 */
export function byPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void {
  if (!ready() || a <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
  ctx.restore();
}

/** 에너지 참격 (frame 0~3): 반지름 r, 방향 (dx, dy) — 그림 초승달이 오른쪽을 봄 */
export function slashPic(ctx: Ctx, frame: number, x: number, y: number, r: number, dx: number, dy: number, a = 1): void {
  additive(ctx, () => byPic(ctx, 0, Math.max(0, Math.min(3, frame)), x, y, r * 2.6, a, Math.atan2(dy, dx)));
}

/** 대태도 (칼끝이 아래): 칼끝이 (x, y), 길이 h */
export function swordPic(ctx: Ctx, x: number, y: number, h: number, a = 1): void {
  byPic(ctx, 5, 0, x, y - h * 0.46, h, a);
}

/** 바닥: 꽂힌 대태도 범위 · 떨어지는 대태도 · 참격 · 망령 */
export function drawBaekGround(ctx: Ctx, s: RunState, _a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "baekryeong") return;
  for (const w of p.bySwords ?? []) {
    const x = snap(w.x);
    const y = snap(w.y);
    const f = w.age / Math.max(1, w.life);
    if (w.kind === 1) {
      // 꽂힌 대태도: 범위 고리 + 칼 둘레 푸른 불 (끝날 때 옅어짐)
      const a = Math.min(1, (1 - f) * 6, w.age / 8);
      ring(ctx, x, y, w.r, fade(BY.blue, 0.45 * a), 1.5);
      additive(ctx, () => glow(ctx, x, y, w.r, BY.deep, 0.12 * a));
      additive(ctx, () => glow(ctx, x, y - 10, 14, BY.blue, 0.4 * a));
      swordPic(ctx, x, y + 4, 62, a);
      continue;
    }
    // 떨어지는 대태도: 바닥 그림자가 커지고 칼이 하늘에서 내려옴 (마지막 8틱)
    ctx.fillStyle = fade("#001030", 0.2 + f * 0.3);
    ctx.beginPath();
    ctx.ellipse(x, y, w.r * f, w.r * 0.4 * f, 0, 0, Math.PI * 2);
    ctx.fill();
    ring(ctx, x, y, w.r, fade(BY.blue, 0.25 + f * 0.3), 1);
    const left = w.life - w.age;
    if (left < 10) swordPic(ctx, x, y - left * 14, w.r * 2.2, Math.min(1, (10 - left) / 3));
  }
  for (const sh of p.byShots ?? []) {
    if (sh.age <= 0) continue;
    const x = snap(sh.x);
    const y = snap(sh.y);
    const f = sh.age / sh.life;
    const a = f > 0.75 ? (1 - f) / 0.25 : 1;
    if (sh.kind === 0) slashPic(ctx, Math.min(3, 1 + Math.floor(f * 4)), x, y, sh.r, sh.dx, sh.dy, a);
    else {
      // 망령: 옆으로 날아가는 그림(2칸)을 진행 방향으로 · 왼쪽이면 뒤집음
      additive(ctx, () => glow(ctx, x, y, sh.r * 1.4, BY.pale, 0.3 * a));
      const left = sh.dx < 0;
      byPic(ctx, 2, 2, x, y, sh.r * 3.4, 0.85 * a, left ? Math.atan2(-sh.dy, -sh.dx) : Math.atan2(sh.dy, sh.dx), !left);
    }
  }
}

/** 몸 위: 혼불 유령팔 (게이지 3칸부터, 벨 때 휘두르는 그림) · 영혼 게이지 (가장 크게 되면 사라짐) */
export function drawBaekAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "baekryeong") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const scale = armScale(p);
  if (scale > 0) {
    const w = ARM_W * scale;
    const since = s.tick - (p.byArmAt ?? -999);
    const swing = since < 16;
    const col = swing ? Math.min(3, Math.floor(since / 4)) : Math.floor(s.tick / 20) % 2;
    const ay = y - 34 - w * 0.42 + (swing ? 0 : Math.sin(s.tick * 0.06) * 1.5);
    additive(ctx, () => glow(ctx, x, ay, w * 0.5, BY.blue, swing ? 0.45 : 0.25));
    byPic(ctx, swing ? 4 : 3, col, x, ay, w, 0.92, 0, p.faceX < 0);
  }
  const lv = p.byLv ?? 0;
  if (lv >= maxLv()) return;
  // 영혼 게이지: 3칸 전에는 칸 셋, 그 뒤에는 한 줄 (칸 수는 옆 점)
  const bw = 22;
  const by = y + 12;
  const fill = (p.bySouls ?? 0) / soulNeed(p);
  ctx.fillStyle = fade("#0a1428", 0.75);
  ctx.fillRect(x - bw / 2 - 1, by - 1, bw + 2, 4);
  if (lv < BAEK_SOUL.armLv) {
    const seg = (bw - 2) / 3;
    for (let i = 0; i < 3; i++) {
      const k = i < lv ? 1 : i === lv ? fill : 0;
      ctx.fillStyle = fade(BY.deep, 0.6);
      ctx.fillRect(x - bw / 2 + i * (seg + 1), by, seg, 2);
      ctx.fillStyle = BY.blue;
      ctx.fillRect(x - bw / 2 + i * (seg + 1), by, seg * k, 2);
    }
  } else {
    ctx.fillStyle = fade(BY.deep, 0.6);
    ctx.fillRect(x - bw / 2, by, bw, 2);
    ctx.fillStyle = BY.pale;
    ctx.fillRect(x - bw / 2, by, bw * fill, 2);
    for (let i = 0; i < lv - BAEK_SOUL.armLv; i++) ctx.fillRect(x + bw / 2 + 2 + (i % 5) * 2, by - Math.floor(i / 5) * 2, 1, 1);
  }
}
