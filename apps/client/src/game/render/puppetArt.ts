// 인형술사 그리기: 바닥(시체 인형·거미줄·조종 실·게이지·검은 실) · 공중(왕관 쓴 아군·인형 친구·분신·미니 인형·반투명 손 커서)
// 그림 sprites/puppeteerFx.png (128칸: 0줄 미니 인형 8 · 1줄 왕관·시체 인형·왼손·오른손) · sprites/puppeteerGolem.png (160칸 4×4) — scripts/art/puppeteer.py
import { ENEMIES, handSize, type PuppetBody, type RunState } from "@pixel-rogue/shared";
import { drawCharacter, drawEnemySprite } from "../sprites";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, glow, type Ctx } from "./pwFxBits";

export const PP = { red: "#e8304a", dark: "#7a1a2a", wood: "#c8925a", pale: "#ffe8ec", black: "#140a10" };
const FX = img("puppeteerFx");
const GOLEM = img("puppeteerGolem");
const ready = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;
/** 1줄 칸: 왕관 · 시체 인형 · 왼손 · 오른손 */
export const PP_CELL = { crown: 8, corpse: 9, handL: 10, hand: 11 } as const;

/** 그림 한 칸 (0~7 미니 인형, 8~ 1줄) → (x, y) 가운데·바닥 기준 너비 w */
export function ppPic(ctx: Ctx, cell: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void {
  if (!ready(FX) || a <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, (cell % 8) * 128, Math.floor(cell / 8) * 128, 128, 128, -w / 2, -w / 2, w, w);
  ctx.restore();
}

/** 머리 위 나무 왕관 */
export const crownOn = (ctx: Ctx, x: number, top: number, w: number, tick: number) => ppPic(ctx, PP_CELL.crown, x, top - 1 + Math.sin(tick * 0.1), w);

/** 몸 위 체력 줄 */
function hpBar(ctx: Ctx, x: number, top: number, b: PuppetBody, col: string): void {
  const w = 16;
  ctx.fillStyle = "#1a0e12";
  ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 3);
  ctx.fillStyle = col;
  ctx.fillRect(x - w / 2, top, Math.max(1, Math.round((w * b.hp) / b.maxHp)), 1);
}

/** 바닥: 시체 인형(커지며 붉게 깜빡) · 거미줄 · 조종 실과 게이지 · 검은 실 */
export function drawPuppetGround(ctx: Ctx, s: RunState, _a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "puppeteer") return;
  for (const o of p.ppSpots ?? []) {
    const x = snap(o.x);
    const y = snap(o.y);
    const f = o.age / Math.max(1, o.life);
    if (o.kind === 1) {
      ctx.strokeStyle = fade("#f0e8f4", 0.5 * (1 - f * 0.6));
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const an = (i / 4) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(an) * o.r, y - Math.sin(an) * o.r);
        ctx.lineTo(x + Math.cos(an) * o.r, y + Math.sin(an) * o.r);
        ctx.stroke();
      }
      for (const k of [0.45, 0.9]) {
        ctx.beginPath();
        ctx.arc(x, y, o.r * k, 0, Math.PI * 2);
        ctx.stroke();
      }
      continue;
    }
    // 시체 인형: 터질 범위 표시 + 앉은 거대 인형이 부풀어 오름
    const blink = f > 0.6 && Math.floor(s.tick / 4) % 2 === 0;
    ctx.strokeStyle = fade(PP.red, 0.35 + f * 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, o.r * f, 0, Math.PI * 2);
    ctx.stroke();
    if (blink) additive(ctx, () => glow(ctx, x, y, 22, PP.red, 0.6));
    ppPic(ctx, PP_CELL.corpse, x, y - 10, 34 + f * 12, 1);
  }
  // 조종 실: 손에서 그 적에게 실 몇 가닥 · 머리 위 게이지 고리
  for (const e of s.enemies) {
    const g = e.ppCharm ?? 0;
    const x = snap(e.x);
    const y = snap(e.y);
    if (g > 0) {
      if (e.id === p.ppTarget && p.ppHx !== undefined) {
        ctx.strokeStyle = fade(PP.red, 0.85);
        ctx.lineWidth = 1;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(snap(p.ppHx) + i * 4, snap(p.ppHy ?? 0) + 6);
          ctx.quadraticCurveTo(x + i * 6, y - e.r - 14 + Math.sin(s.tick * 0.3 + i) * 2, x + i * 3, y - e.r);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = fade("#2a1018", 0.7);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y - e.r - 8, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = g > 0.85 ? "#ffd27a" : PP.red;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y - e.r - 8, 5, -Math.PI / 2, -Math.PI / 2 + g * Math.PI * 2);
      ctx.stroke();
    }
    // 검은 실: 몸에 감긴 실 (20개부터 검게)
    const n = e.ppThreads ?? 0;
    if (n > 0) {
      ctx.strokeStyle = n >= 20 ? fade(PP.black, 0.9) : fade(PP.red, 0.75);
      ctx.lineWidth = 1;
      const k = Math.min(10, Math.ceil(n / 3));
      for (let i = 0; i < k; i++) {
        const yy = y - e.r + ((i + 0.5) / k) * e.r * 2;
        ctx.beginPath();
        ctx.moveTo(x - e.r - 1, yy - 2);
        ctx.lineTo(x + e.r + 1, yy + 2);
        ctx.stroke();
      }
    }
  }
}

/** 인형 친구: 걷기 2 · 공격 2 줄, 칸 = 앞·뒤·왼·오 */
function drawGolem(ctx: Ctx, g: PuppetBody, x: number, y: number, tick: number): void {
  if (!ready(GOLEM)) return;
  const moving = Math.hypot(g.x - g.prevX, g.y - g.prevY) > 0.05;
  const row = g.swing > 0 ? (g.swing > 9 ? 2 : 3) : Math.floor(tick / 14) % 2;
  const col = g.swing > 0 || moving ? (g.face < 0 ? 2 : 3) : 0;
  const w = 44;
  ctx.save();
  if (g.hurt > 20 && Math.floor(g.hurt / 3) % 2 === 0) ctx.globalAlpha = 0.6;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(GOLEM, col * 160, row * 160, 160, 160, x - w / 2, y + g.r - w + 4, w, w);
  ctx.restore();
}

/** 공중: 왕관 쓴 아군 · 인형 친구 · 분신 · 미니 인형 · 손 커서 */
export function drawPuppetAir(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "puppeteer") return;
  for (const al of p.ppAllies ?? []) {
    const x = snap(lerp(al.prevX, al.x, a));
    const y = snap(lerp(al.prevY, al.y, a));
    additive(ctx, () => glow(ctx, x, y + al.r * 0.6, al.r + 4, PP.red, 0.25));
    const frame = al.swing > 0 ? 3 : Math.floor(s.tick / 12) % 2;
    if (!drawEnemySprite(ctx, al.kind, x, y, frame, al.face < 0, al.hurt > 20 ? ["#ffffff", 0.6] : undefined, al.r / ENEMIES[al.kind].radius)) {
      ctx.fillStyle = PP.wood;
      ctx.fillRect(x - al.r, y - al.r, al.r * 2, al.r * 2);
    }
    crownOn(ctx, x, y - al.r - 6, Math.max(14, al.r * 2.4), s.tick + al.id * 7);
    hpBar(ctx, x, y - al.r - 12, al, "#ff8a9a");
  }
  if (p.ppGolem) {
    const g = p.ppGolem;
    const x = snap(lerp(g.prevX, g.x, a));
    const y = snap(lerp(g.prevY, g.y, a));
    drawGolem(ctx, g, x, y, s.tick);
    hpBar(ctx, x, y - 36, g, "#ffc070");
  }
  if (p.ppClone) {
    const c = p.ppClone;
    const x = snap(c.x);
    const y = snap(c.y);
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.15 * Math.sin(s.tick * 0.2);
    drawCharacter(ctx, "puppeteer", x, y, p.r, { faceX: c.face, faceY: 0, moving: false, casting: false, step: 0 });
    ctx.restore();
    additive(ctx, () => glow(ctx, x, y, 16, "#c8a0ff", 0.3));
    hpBar(ctx, x, y - 26, c, "#c8a0ff");
  }
  for (const dl of p.ppDolls ?? []) {
    const x = snap(dl.x);
    const y = snap(dl.y);
    if (dl.shard !== undefined) {
      ctx.fillStyle = PP.wood;
      ctx.fillRect(x - 1, y - 1, 3, 3);
      continue;
    }
    ppPic(ctx, dl.doll, x, y - 6 + Math.sin(s.tick * 0.5 + dl.t) * 1.5, 22, 1, Math.max(-0.4, Math.min(0.4, dl.vx * 0.12)));
  }
  if (p.ppHx !== undefined && p.ppHy !== undefined && !s.over) drawHand(ctx, s, snap(p.ppHx), snap(p.ppHy));
}

/** 손 커서: 반투명한 하얀 손(붉은 실·매달린 인형) · 꾹 누르면 손가락을 오므리듯 작아지고 붉게 */
function drawHand(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const r = handSize(p);
  const holding = (p.ppHold ?? 0) > 0;
  ctx.strokeStyle = fade(holding ? PP.red : PP.pale, 0.45);
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  const w = r * 3.2 * (holding ? 0.9 : 1);
  ppPic(ctx, PP_CELL.hand, x + w * 0.04, y - w * 0.22, w, 0.6, Math.sin(s.tick * 0.08) * 0.05);
}
