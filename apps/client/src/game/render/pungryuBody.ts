// 풍류사 그리기 (2): 몸 둘레 — 발밑 구름(그림이 없을 때)·구름 자국·먹물 웅덩이·기둥 예고 (몸 뒤) / 구절 네 칸·해달 구슬·비구름·분신 (몸 위)
import { cloneSpots, isPungryu, orbSpots, pungryuStep, type RunState } from "@pixel-rogue/shared";
import { hasV2 } from "../sprites";
import { lerp, type Snap } from "./palette";
import { glyph, VERSE_HANJA, VERSE_TINT } from "./pungryu";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const CLOUD = "#c8d4f0";
const CLOUD_EDGE = "#3a3a6a";

/** 뭉게구름 (가운데 x, 바닥 y, 너비 w) */
function puff(ctx: Ctx, x: number, y: number, w: number, c = CLOUD): void {
  ctx.fillStyle = CLOUD_EDGE;
  ctx.fillRect(x - w / 2 - 1, y - 3, w + 2, 4);
  ctx.fillStyle = c;
  ctx.fillRect(x - w / 2, y - 3, w, 3);
  ctx.fillRect(x - w / 4, y - 5, w / 2, 2);
  ctx.fillRect(x - w / 2 + 1, y - 4, w / 3, 1);
}

/** 몸 뒤: 구름 자국 · 먹물 · 기둥 예고 · 발밑 구름 */
export function drawPungryuBack(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (!isPungryu(p)) return;
  for (const c of p.puTrail ?? []) {
    ctx.globalAlpha = (c.t / 60) * 0.6;
    puff(ctx, snap(c.x), snap(c.y), 8, "#ffd0e8");
  }
  for (const ink of p.puInks ?? []) {
    ctx.globalAlpha = Math.min(1, ink.t / 30) * 0.75;
    ctx.fillStyle = "#1a1628";
    ctx.beginPath();
    ctx.ellipse(snap(ink.x), snap(ink.y), 14, 7, 0, 0, TAU);
    ctx.fill();
  }
  for (const f of p.puFalls ?? []) {
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = f.earth ? "#e8b84a" : "#8a7aff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(snap(f.x), snap(f.y), f.r, f.r * 0.45, 0, 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  // 그림 시트가 아직 없으면 발밑에 구름을 그림 (그림에는 구름이 들어 있음)
  if (!hasV2("pungryu")) puff(ctx, x, y + p.r + 3 + Math.round(Math.sin(s.tick * 0.1)), p.r * 2 + 6);
  // 움직일 때 구름 꼬리
  if (p.stillTicks === 0) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = CLOUD;
    for (let i = 1; i <= 3; i++) ctx.fillRect(x - p.faceX * i * 5 - 1, y + p.r + 2 - p.faceY * i * 4, 3 - (i >> 1), 2);
    ctx.globalAlpha = 1;
  }
}

/** 몸 위: 발밑 구절 네 칸 · 해달 구슬 · 비구름 · 분신 */
export function drawPungryuAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (!isPungryu(p)) return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const [done, need] = pungryuStep(p);
  const word = VERSE_HANJA[p.weaponId] ?? "天地玄黃";
  const tint = VERSE_TINT[p.weaponId] ?? "#ffd860";
  // 발밑 네 칸: 쓴 글자는 빛깔, 아직이면 빈 칸
  for (let i = 0; i < need; i++) {
    const bx = x + (i - (need - 1) / 2) * 6 - 2;
    const by = y + p.r + 7;
    ctx.fillStyle = "#1a1628";
    ctx.fillRect(bx - 1, by - 1, 6, 6);
    ctx.fillStyle = i < done ? tint : "#3a3450";
    ctx.fillRect(bx, by, 4, 4);
  }
  if (done > 0) {
    ctx.globalAlpha = 0.8;
    glyph(ctx, word[done - 1] ?? "", x, y - p.r - 14, 8, tint);
    ctx.globalAlpha = 1;
  }
  orbSpots(s).forEach((o, i) => {
    ctx.fillStyle = i === 0 ? "#ff7a3a" : "#c8d0ff";
    ctx.beginPath();
    ctx.arc(snap(o.x), snap(o.y), o.r * 0.6, 0, TAU);
    ctx.fill();
    ctx.fillStyle = i === 0 ? "#ffe08a" : "#ffffff";
    ctx.fillRect(snap(o.x) - 1, snap(o.y) - 1, 2, 2);
    glyph(ctx, i === 0 ? "日" : "月", snap(o.x), snap(o.y) - o.r * 0.6 - 5, 7, i === 0 ? "#ffd860" : "#e8ecff");
  });
  if ((p.puRain ?? 0) > 0) {
    puff(ctx, x, y - 26, 30, "#8a9ac8");
    ctx.fillStyle = "#8ad0ff";
    for (let i = 0; i < 10; i++) {
      const rx = x - 24 + ((i * 11 + s.tick * 2) % 48);
      const ry = y - 22 + ((i * 7 + s.tick * 3) % 40);
      ctx.fillRect(snap(rx), snap(ry), 1, 3);
    }
  }
  for (const c of cloneSpots(s)) {
    ctx.globalAlpha = Math.min(1, c.t / 30) * 0.55;
    ctx.fillStyle = "#3ad8b0";
    ctx.fillRect(snap(c.x) - 4, snap(c.y) - 9, 8, 12);
    ctx.fillStyle = "#1a1628";
    ctx.fillRect(snap(c.x) - 5, snap(c.y) - 11, 10, 2);
    puff(ctx, snap(c.x), snap(c.y) + 6, 12);
  }
  ctx.globalAlpha = 1;
}
