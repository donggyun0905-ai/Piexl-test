// 별지기(히든) 그리기: 바닥의 별자리(이어진 빛줄기·반짝이는 별) · 별 박기·혜성 꼬리·별자리 터짐 효과
import { STAR_COLORS, starLinks, starMax, type EffectState, type RunState, type StarStyle, type WeaponDef, WEAPONS } from "@pixel-rogue/shared";
import { additive, beam, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 네 갈래 별 (가운데 x, y · 갈래 길이 n) */
function star(ctx: Ctx, x: number, y: number, n: number, c: string): void {
  additive(ctx, () => glow(ctx, x, y, n * 2 + 3, c, 0.7, 1));
  ctx.fillStyle = c;
  ctx.fillRect(x - n, y, n * 2 + 1, 1);
  ctx.fillRect(x, y - n, 1, n * 2 + 1);
  ctx.fillRect(x - 1, y - 1, 3, 3);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, 1, 1);
}

/** 별지기 무기를 들었으면 그 빛깔, 아니면 null */
function starColor(s: RunState): string | null {
  const w: WeaponDef = WEAPONS[s.player.weaponId];
  return w.kind === "star" ? STAR_COLORS[(w.star ?? "plain") as StarStyle] : null;
}

/** 바닥: 이어진 별 사이 빛줄기 (별자리가 찰수록 밝게) */
export function drawStarGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  const c = starColor(s);
  if (!c) return;
  const full = (p.stStars ?? []).length / starMax(p);
  const pulse = 0.5 + 0.5 * Math.sin(s.tick * 0.35);
  ctx.save();
  ctx.lineCap = "round";
  for (const [a, b] of starLinks(p)) {
    const fade = Math.min(1, a.left / 30, b.left / 30);
    ctx.globalAlpha = (0.18 + 0.12 * pulse) * fade;
    ctx.strokeStyle = c;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(snap(a.x), snap(a.y));
    ctx.lineTo(snap(b.x), snap(b.y));
    ctx.stroke();
    ctx.globalAlpha = (0.65 + 0.3 * full) * fade;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

/** 적 위에: 반짝이는 별 (별자리가 찰수록 크게 빛남) */
export function drawStarNodes(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  const c = starColor(s);
  const stars = p.stStars ?? [];
  if (!c || stars.length === 0) return;
  const full = stars.length / starMax(p);
  ctx.save();
  stars.forEach((o, i) => {
    const fade = Math.min(1, o.left / 30);
    const x = snap(o.x);
    const y = snap(o.y);
    const tw = Math.sin(s.tick * 0.2 + i * 1.7);
    ctx.globalAlpha = 0.25 * fade;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, 6 + full * 3 + tw, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = fade;
    star(ctx, x, y, tw > 0.3 ? 4 : 3, c);
  });
  ctx.restore();
}

/** 효과: 별 박기(빛 고리) · 혜성 꼬리(빛줄) · 별자리 터짐(빛살). 별지기 효과가 아니면 false */
export function drawStarFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "stPlace" && fx.kind !== "stComet" && fx.kind !== "stBurst") return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = fx.tint ?? "#fff2a8";
  ctx.save();
  if (fx.kind === "stPlace") {
    additive(ctx, () => shock(ctx, x, y, fx.size * (1.2 - t * 0.6), c, t, 4));
    ctx.globalAlpha = t;
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, fx.size * (1.2 - t * 0.6), 0, Math.PI * 2);
    ctx.stroke();
    star(ctx, x, y, Math.round(2 + t * 5), c);
  } else if (fx.kind === "stComet") {
    additive(ctx, () => beam(ctx, x, y, snap(fx.x + fx.dirX), snap(fx.y + fx.dirY), 2 + t * 4, c, t));
    ctx.globalAlpha = t * 0.8;
    ctx.strokeStyle = c;
    ctx.lineWidth = 1 + t * 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(snap(fx.x + fx.dirX), snap(fx.y + fx.dirY));
    ctx.stroke();
  } else {
    // 별자리 터짐: 커지는 빛 원 + 돌아가는 8갈래 빛살
    const r = fx.size * (1.1 - t * 0.7);
    additive(ctx, () => {
      glow(ctx, x, y, r * 1.2, c, t, 1.3);
      shock(ctx, x, y, r * 1.1, c, t, 6);
      sparks(ctx, x, y, 12, r * 1.4, 1 - t, "#ffffff", fx.x + fx.y);
    });
    ctx.globalAlpha = t * 0.45;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + (1 - t) * 0.8;
      const len = r * (i % 2 ? 0.7 : 1.15);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    star(ctx, x, y, Math.round(3 + t * 6), c);
  }
  ctx.restore();
  return true;
}
