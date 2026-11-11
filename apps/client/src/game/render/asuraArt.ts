// 아수라 그리기: 바닥(귀진 남색 영역 · 등 뒤 아수라 각성 · 날아가는 귀신 주먹) · 몸 위(귀진 표식 다이아)
// 그림 sprites/asuraFx.png (256칸 4×6: 0줄 일반펀치 3 · 1줄 연속펀치 3 · 2줄 아수라 각성 4 · 3줄 각성 1·2타 4 · 4줄 3타 4 · 5줄 4타 4) — scripts/art/asura.py
import { asFieldR, asMarked, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, glow, ring, shock, type Ctx } from "./pwFxBits";

export const AS = { blue: "#4a6aff", navy: "#1a2270", light: "#a8c0ff", red: "#ff3a3a" };
const FX = img("asuraFx");
const C = 256;
const ready = () => FX.complete && FX.naturalWidth > 0;

/** 빛 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w, 각도 (더해 그림) · flip = 좌우 뒤집기 */
export function asPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void {
  if (!ready() || a <= 0) return;
  additive(ctx, () => {
    ctx.save();
    ctx.globalAlpha *= Math.min(1, a);
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    if (flip) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(FX, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
    ctx.restore();
  });
}

/** 귀진: 남색 영역 · 테두리 숨쉼 · 둘레를 천천히 도는 귀신 손 자리 6개 (빛 점) */
function drawField(ctx: Ctx, s: RunState, x: number, y: number): void {
  const r = asFieldR(s.player);
  ctx.fillStyle = fade(AS.navy, 0.16);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => shock(ctx, x, y, r, AS.blue, 0.16 + 0.06 * Math.sin(s.tick * 0.08), Math.max(4, r * 0.12)));
  ring(ctx, x, y, r, fade(AS.blue, 0.5 + 0.15 * Math.sin(s.tick * 0.08)), 1.5);
  ring(ctx, x, y, r * 0.7, fade(AS.blue, 0.15), 1);
  for (let i = 0; i < 6; i++) {
    const t = s.tick * 0.012 + (i * Math.PI) / 3;
    additive(ctx, () => glow(ctx, x + Math.cos(t) * r, y + Math.sin(t) * r * 0.9, 5, AS.light, 0.7, 0.4));
  }
}

/** 바닥: 귀진 · 각성(등 뒤, 4칸이 나온 뒤 마지막 두 칸을 오가며 빛남) · 날아가는 주먹 */
export function drawAsuraGround(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "asura") return;
  const px = snap(lerp(p.prevX, p.x, alpha));
  const py = snap(lerp(p.prevY, p.y, alpha));
  if (p.passives.includes("asField" as never)) drawField(ctx, s, px, py);
  if ((p.asAwake ?? 0) > 0) {
    const t = s.tick - (p.asAwakeAt ?? s.tick);
    const col = t < 16 ? Math.floor(t / 4) : 2 + (Math.floor(t / 8) % 2);
    const end = Math.min(1, (p.asAwake ?? 0) / 30);
    asPic(ctx, 2, col, px, py - 14, 76, 0.9 * end);
  }
  for (const f of p.asFists ?? []) asPic(ctx, 0, 2, snap(f.x), snap(f.y), 26, 1, Math.atan2(f.dy, f.dx));
}

/** 몸 위: 귀진 표식 (적 머리 위 다이아) */
export function drawAsuraAir(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  if (s.player.characterId !== "asura" || !s.player.passives.includes("asField" as never)) return;
  for (const e of s.enemies) {
    if (e.hp <= 0 || !asMarked(s, e)) continue;
    const x = snap(e.x);
    const y = snap(e.y - e.r - 7 + Math.sin((s.tick + e.id * 7) * 0.12) * 1.2);
    additive(ctx, () => glow(ctx, x, y, 6, AS.blue, 0.5, 0.3));
    ctx.fillStyle = fade(AS.light, 0.95);
    ctx.strokeStyle = AS.navy;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x + 3, y);
    ctx.lineTo(x, y + 4);
    ctx.lineTo(x - 3, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
