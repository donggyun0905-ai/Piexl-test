// 블루 플레임 열화상 각성 (화면 맨 위, render/ults의 drawUltOverlay에서): 화면이 까매지고 적 모양만 푸르게 (열화상처럼, 몸 가운데는 더 밝게)
// 화면 아래 가운데 거대한 푸른 불꽃 활 (사용자 그림 sprites/blueFlame_bigBow) · 걸린 거대한 화살이 누른 곳을 겨눔 · 쏘면 화살이 날아가 폭격 (효과는 검은 화면 위에 다시 그림)
// 캐릭터 몸은 그리지 않음 (render/actors drawPlayer)
import { BLUE_FLAME, isBlueFlame, WEAPONS, type RunState } from "@pixel-rogue/shared";
import { drawEnemies } from "./actors";
import { arrowImg, BZ, BZ_IMG, ready } from "./blueFlameBody";
import { drawBlueFlameFx } from "./blueFlameFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock, type Ctx } from "./pwFxBits";

let off: HTMLCanvasElement | null = null;

/** 적 모양만 떠서 푸르게 칠한 그림 (화면 크기, 화면 좌표) */
function silhouettes(ctx: Ctx, s: RunState, snap: Snap): HTMLCanvasElement | null {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  off ??= document.createElement("canvas");
  if (off.width !== W || off.height !== H) [off.width, off.height] = [W, H];
  const oc = off.getContext("2d");
  if (!oc) return null;
  oc.setTransform(1, 0, 0, 1, 0, 0);
  oc.globalCompositeOperation = "source-over";
  oc.clearRect(0, 0, W, H);
  oc.setTransform(ctx.getTransform());
  oc.imageSmoothingEnabled = false;
  drawEnemies(oc, s, 1, snap);
  oc.setTransform(1, 0, 0, 1, 0, 0);
  oc.globalCompositeOperation = "source-in";
  oc.fillStyle = "#2a6aff";
  oc.fillRect(0, 0, W, H);
  oc.globalCompositeOperation = "source-over";
  return off;
}

/** 거대한 활 (화면 아래 가운데) · 걸린 화살 · 날아가는 화살 · 조준 고리 */
function bigBow(ctx: Ctx, s: RunState, k: number): void {
  const p = s.player;
  const m = ctx.getTransform();
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const bx = (W / 2 - m.e) / m.a;
  const by = (H - m.f) / m.d - 16;
  const near = s.enemies.filter((e) => e.hp > 0).sort((a, b) => (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2))[0];
  const [tx, ty] = p.aimDist !== undefined ? [p.x + p.faceX * p.aimDist, p.y + p.faceY * p.aimDist] : near ? [near.x, near.y] : [p.x, p.y - 60];
  const a = Math.atan2(ty - by, tx - bx);
  const bw = Math.min(W / m.a * 0.62, 240);
  const pulse = 0.85 + 0.15 * Math.sin(s.tick * 0.3);
  // 조준 고리 (폭격 범위)
  const rr = BLUE_FLAME.ultR * Math.max(0.5, p.stats.range / WEAPONS.bzBow.range);
  ctx.strokeStyle = alpha(BZ.light, 0.7 * k);
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(tx, ty, rr, s.tick * 0.03, s.tick * 0.03 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = alpha(BZ.pale, 0.9 * k);
  ctx.fillRect(Math.round(tx) - 4, Math.round(ty), 9, 1);
  ctx.fillRect(Math.round(tx), Math.round(ty) - 4, 1, 9);
  // 날아가는 거대한 화살: 활에서 누른 곳으로 (멀어질수록 작게)
  for (const b of p.bzStrikes ?? []) {
    if (b.k !== 4) continue;
    const f = 1 - b.t / b.T;
    const q = f * f;
    const x = lerp(bx, b.x, q);
    const y = lerp(by, b.y, q);
    const len = 90 * (1 - 0.55 * q);
    additive(ctx, () => glow(ctx, x, y, 14, BZ.blue, 0.6 * k, 0.5));
    arrowImg(ctx, x, y, Math.atan2(b.y - by, b.x - bx), len, k);
  }
  // 활 몸 (조준한 쪽에 수직으로 서서 겨눔) · 걸린 화살 (쏠 수 있으면 밝게)
  if (ready(BZ_IMG.bigBow)) {
    const bh = (bw * BZ_IMG.bigBow.naturalHeight) / BZ_IMG.bigBow.naturalWidth;
    additive(ctx, () => glow(ctx, bx, by, bw * 0.45, BZ.blue, 0.3 * k * pulse, 0.3));
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(bx, by);
    // 그림은 양끝이 위로 휜 모양: 휜 끝이 몸(화면 아래) 쪽을 향하게 뒤집어 세움 (2026-11-08 사용자 확인)
    ctx.rotate(a - Math.PI / 2);
    ctx.drawImage(BZ_IMG.bigBow, -bw / 2, -bh / 2, bw, bh);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.3 * k * pulse;
    ctx.drawImage(BZ_IMG.bigBow, -bw * 0.52, -bh * 0.55, bw * 1.04, bh * 1.1);
    ctx.restore();
  }
  const loaded = p.attackCooldown <= 0;
  arrowImg(ctx, bx + Math.cos(a) * 46, by + Math.sin(a) * 46, a, 96, k * (loaded ? 1 : 0.35));
}

export function drawBlueFlameUlt(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (!p.bzUlt || !isBlueFlame(p) || s.over) return;
  const left = p.sgAwake ?? 0;
  const k = Math.max(0, Math.min(1, ((p.sgAwakeMax ?? 1) - left) / 15, left / 15));
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const sil = silhouettes(ctx, s, snap);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = `rgba(1,3,10,${0.93 * k})`;
  ctx.fillRect(0, 0, W, H);
  if (sil) {
    // 열화상: 둘레로 번지는 빛 + 모양
    const d = Math.max(1, Math.round(ctx.canvas.width / 400));
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.3 * k;
    for (const [dx, dy] of [[-d, 0], [d, 0], [0, -d], [0, d]] as const) ctx.drawImage(sil, dx, dy);
    ctx.globalAlpha = 0.9 * k;
    ctx.drawImage(sil, 0, 0);
  }
  ctx.restore();
  // 몸 가운데는 더 뜨겁게 (밝은 하늘색)
  additive(ctx, () => {
    for (const e of s.enemies) {
      if (e.hp <= 0) continue;
      glow(ctx, e.x, e.y - e.r * 0.3, e.r * 1.1, BZ.pale, 0.4 * k, 0.5);
      if ((e.bzFlameT ?? 0) > 0) shock(ctx, e.x, e.y, e.r + 3, BZ.light, 0.3 * k, 1);
    }
  });
  for (const fx of s.effects) if (fx.kind === "bzBombFx" || fx.kind === "bzArrowFx" || fx.kind === "bzPrisonFx" || fx.kind === "bzPillarFx") drawBlueFlameFx(ctx, fx, snap);
  bigBow(ctx, s, k);
}
