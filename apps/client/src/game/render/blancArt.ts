// 블랑 그리기: 효과 시트 그림 한 칸 · 빙의 고르기(화면 회색 + 적 머리 위 방향키) · 몸속에 든 적 빛 · 허수의 분신 · 조종당한 적 실 · 영혼의 틈 표시 (악마 계급 마크는 느아르와 같이 render/noirArt)
// 그림 sprites/blancFx.png (192칸 4×16, 줄 차례는 ROW) — scripts/art/blanc.py
import type { RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import { img } from "./lunaticFx";
import { sheetPic } from "./noirArt";
import { lerp, type Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const BC = { white: "#f4f0ff", light: "#ffffff", violet: "#b89aff", deep: "#6a4aa8" };
/** 효과 시트의 줄 (scripts/art/blanc.py ROWS 차례) */
export const ROW = {
  bcFan: 0, bcBless: 1, bcPuppet: 2, bcMirror: 3, bcRift: 4, bcSeize: 5, bcCrusade: 6, bcPhantom: 7,
  bcWhisper: 8, bcParadox: 9, bcWings: 10, bcTransfer: 11, bcRedeem: 12, bcSanctum: 13, bcEyes: 14, bcEnd: 15,
} as const;
export const bcPic = sheetPic(img("blancFx"));

/** 방향키 하나 (0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽) */
function arrow(ctx: Ctx, x: number, y: number, d: number, done: boolean): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((d * Math.PI) / 2);
  ctx.fillStyle = done ? BC.violet : "#000";
  ctx.fillRect(-4, -4, 8, 8);
  ctx.fillStyle = done ? "#3a2a5a" : BC.light;
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(3, 2);
  ctx.lineTo(-3, 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** 화면 전체를 회색으로 (그 위에 방향키) */
function grayOut(ctx: Ctx): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "saturation";
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(20, 16, 30, 0.25)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/** 몸 위: 분신 · 몸속 적 빛 · 조종 실 · 영혼의 틈 · 빙의 고르기 */
export function drawBlancAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "blanc") return;
  for (const c of p.bcClones ?? []) {
    const x = snap(lerp(c.prevX, c.x, alpha));
    const y = snap(lerp(c.prevY, c.y, alpha));
    additive(ctx, () => glow(ctx, x, y, 16, BC.violet, 0.35));
    ctx.save();
    ctx.globalAlpha *= Math.min(0.6, (c.until - s.tick) / 30);
    drawCharacter(ctx, "blanc", x, y, p.r, { faceX: c.face, faceY: 0, moving: c.swing === 0, casting: c.swing > 0, step: Math.floor(s.tick / 10) % 2 });
    ctx.restore();
  }
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const [x, y] = [snap(e.x), snap(e.y)];
    if (e.id === p.bcHost) additive(ctx, () => glow(ctx, x, y, e.r + 12, BC.white, 0.55, 0.3));
    if ((e.bcPuppet ?? 0) > 0) {
      ctx.strokeStyle = "rgba(244, 240, 255, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - e.r - 14);
      ctx.lineTo(x - 2, y - e.r);
      ctx.moveTo(x + 4, y - e.r - 14);
      ctx.lineTo(x + 2, y - e.r);
      ctx.stroke();
    }
    if (e.bcRift) bcPic(ctx, ROW.bcRift, 0, x, y - e.r - 12, 14, 0.9);
  }
  const k = p.bcPick;
  if (!k || s.tick >= k.until) return;
  grayOut(ctx);
  for (const [id, seq] of k.cands) {
    const e = s.enemies.find((f) => f.id === id);
    if (!e) continue;
    const y = snap(e.y - e.r - 14);
    const x0 = snap(e.x) - ((seq.length - 1) * 10) / 2;
    seq.forEach((d, i) => arrow(ctx, x0 + i * 10, y, d, i < k.at));
  }
}
