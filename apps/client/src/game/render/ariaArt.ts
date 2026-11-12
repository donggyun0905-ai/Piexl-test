// 아리아 그리기: 바닥(놓인 피아노·하프·호른) · 몸 위(둥실거리는 음표 · 악기 음표 · 클라리넷 · 영혼의 바이올린 · 악보 완성 빛) · 빛 꼬리·지휘봉 궤적·음파는 ariaGlam
// 그림 sprites/ariaFx.png (256칸 4×5: 0·1줄 음표 8종 · 2줄 바이올린 서기(앞·뒤·왼·오) · 3줄 바이올린 공격 4칸 · 4줄 피아노·하프·호른·클라리넷)
// sprites/ariaBoom.png (192칸 4×8: 줄 = 음표 색, 칸 = 폭죽 터짐 차례) — scripts/art/aria.py
import { ARIA_PERKS, type ArInst, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { batonSwing, instGlam, noteTrails, staffHalo } from "./ariaGlam";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

/** 음표 종류마다 색 (ariaBoom 줄 차례와 같음) */
export const AR_COLORS = ["#ffb040", "#ff4a5a", "#4a8aff", "#4aff7a", "#ff4ad8", "#ffe84a", "#a05aff", "#4ae8ff"];
export const AR = { gold: "#ffd860", pale: "#fff4c8", soul: "#ffe8a0" };
const FX = img("ariaFx");
const BOOM = img("ariaBoom");
const ok = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0;
/** 악기 그림 너비 (피아노·하프·호른·클라리넷) */
const INST_W = [38, 34, 30, 28];

/** 효과 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w · flip = 좌우 뒤집기 */
export function arPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, flip = false): void {
  if (!ok(FX) || a <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, col * 256, row * 256, 256, 256, -w / 2, -w / 2, w, w);
  ctx.restore();
}

/** 폭죽 한 칸 (kind 색, frame 0~3) — 빛이라 더해 그림 */
export function boomPic(ctx: Ctx, kind: number, frame: number, x: number, y: number, w: number, a = 1): void {
  if (!ok(BOOM) || a <= 0) return;
  additive(ctx, () => {
    ctx.save();
    ctx.globalAlpha *= Math.min(1, a);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(BOOM, frame * 192, (kind & 7) * 192, 192, 192, x - w / 2, y - w / 2, w, w);
    ctx.restore();
  });
}

/** 음표 그림 하나 (종류 색 빛을 깔고) */
function notePic(ctx: Ctx, kind: number, x: number, y: number, w: number, a = 1): void {
  additive(ctx, () => glow(ctx, x, y, w * 0.6, AR_COLORS[kind & 7]!, 0.45 * a));
  arPic(ctx, kind >> 2, kind & 3, x, y, w, a);
}

/** 악기 하나: 나타날 때 커지고 사라지기 전 깜빡임 · 연주하면 살짝 튀며 빛 */
function drawInst(ctx: Ctx, i: ArInst, x: number, y: number, s: RunState): void {
  const life = ARIA_PERKS[(["arPiano", "arHarp", "arHorn", "arClarinet"] as const)[i.kind]!].life;
  const born = Math.max(0, Math.min(1, (life - i.left) / 20));
  const blink = i.left < 120 && Math.floor(s.tick / 6) % 2 ? 0.45 : 1;
  const play = i.playAt !== undefined ? Math.max(0, 1 - (s.tick - i.playAt) / 18) : 0;
  const w = INST_W[i.kind]! * (0.6 + 0.4 * born) * (1 + play * 0.08);
  const bob = i.kind === 3 ? Math.sin((s.tick + i.x) * 0.08) * 3 : 0;
  ctx.fillStyle = "rgba(30, 20, 10, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y + w * 0.36, w * 0.32, w * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  instGlam(ctx, i, x, y, s, w);
  additive(ctx, () => glow(ctx, x, y, w * 0.55, AR.gold, 0.18 + 0.3 * play));
  arPic(ctx, 4, i.kind, x, y + bob - (i.kind === 3 ? 6 : 0), w, born * blink, i.face < 0);
}

/** 바닥: 놓인 피아노·하프·호른 (클라리넷은 떠다녀서 몸 위) */
export function drawAriaGround(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "aria") return;
  for (const i of p.arInst ?? []) if (i.kind !== 3) drawInst(ctx, i, snap(i.x), snap(i.y), s);
}

/** 몸 위: 클라리넷(둘레 고리) · 바이올린 · 음표 · 악기 음표 · 악보 완성 빛 */
export function drawAriaAir(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "aria") return;
  staffHalo(ctx, s, a, snap);
  batonSwing(ctx, s, snap(lerp(p.prevX, p.x, a)), snap(lerp(p.prevY, p.y, a)));
  for (const i of p.arInst ?? []) {
    if (i.kind !== 3) continue;
    const x = snap(lerp(i.prevX, i.x, a));
    const y = snap(lerp(i.prevY, i.y, a));
    const r = ARIA_PERKS.arClarinet.r;
    ctx.strokeStyle = alpha(AR.gold, 0.25 + 0.1 * Math.sin(s.tick * 0.1));
    ctx.setLineDash([4, 5]);
    ctx.lineDashOffset = -s.tick * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    drawInst(ctx, i, x, y, s);
  }
  const v = p.arViolin;
  if (v) {
    const x = snap(lerp(v.prevX, v.x, a));
    const y = snap(lerp(v.prevY, v.y, a)) + Math.sin(s.tick * 0.07) * 2;
    const swing = v.swingAt !== undefined ? s.tick - v.swingAt : 99;
    if (swing < 20) arPic(ctx, 3, Math.min(3, Math.floor(swing / 5)), x, y, 40);
    else arPic(ctx, 2, p.faceY < -0.7 ? 1 : p.faceX < -0.3 ? 2 : p.faceX > 0.3 ? 3 : 0, x, y, 28, 0.95);
  }
  noteTrails(ctx, s, snap);
  for (const n of p.arNotes ?? []) {
    const x = snap(lerp(n.prevX, n.x, a));
    const y = snap(lerp(n.prevY, n.y, a));
    const born = Math.min(1, n.age / 8);
    notePic(ctx, n.kind, x, y, n.r * 1.5 * (0.5 + 0.5 * born));
  }
  for (const sh of p.arShots ?? []) {
    const x = snap(lerp(sh.prevX, sh.x, a));
    const y = snap(lerp(sh.prevY, sh.y, a));
    additive(ctx, () => {
      ctx.strokeStyle = alpha(AR_COLORS[sh.kind]!, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - sh.dx * sh.spd * 3, y - sh.dy * sh.spd * 3);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    notePic(ctx, sh.kind, x, y, 11);
  }
  if ((p.arFinale ?? 0) > 0) {
    // 악보 완성: 방 위로 떠도는 금빛 오선 다섯 줄
    const k = Math.min(1, (p.arFinale ?? 0) / 30);
    additive(ctx, () => {
      for (let l = 0; l < 5; l++) {
        ctx.strokeStyle = alpha(AR_COLORS[(l + (s.tick >> 3)) & 7]!, 0.22 * k);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= 520; x += 20) {
          const y = 30 + l * 7 + Math.sin(x * 0.02 + s.tick * 0.05) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
  }
}
