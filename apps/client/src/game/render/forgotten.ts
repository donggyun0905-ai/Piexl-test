// 잊혀진 자 그리기: 빛 탄 · 등 뒤의 빛의 고리(forgottenHalo) · 신족(금빛 기운·빛 날개·도는 빛 조각) · 떨어지는 빛 십자가 · 빛줄기 · 터짐 · 빛 베기 · 빛기둥 · 깨어남
import { type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import { lerp, type Snap } from "./palette";
import { drawHaloBack } from "./forgottenHalo";
import { drawPungryuAura, drawPungryuBack } from "./pungryuBody";
import { drawLeoAura, drawLeoBack } from "./leoAura";
import { drawOnyxAura, drawOnyxBack } from "./onyxAura";
import { drawFenrirAura, drawFenrirBack } from "./fenrirAura";
import { drawEclipseAura, drawEclipseBack } from "./eclipseAura";
import { drawThorkenAura, drawThorkenBack } from "./thorkenBody";
import { drawLeviaAura, drawLeviaBack } from "./leviaBody";
import { drawTailAura, drawTailBack } from "./tailBody";
import { drawMadQueenAura, drawMadQueenBack } from "./madQueenBody";
import { drawHookAura, drawHookBack } from "./hookBody";
import { drawOrcaAura, drawOrcaBack } from "./orcaBody";
import { drawWaveAura, drawWaveBack } from "./waveBody";
import { drawMiryuAura, drawMiryuBack } from "./miryuBody";
import { drawBeatriceAura, drawBeatriceBack } from "./beatriceBody";
import { drawIanAura, drawIanBack } from "./ianBody";
import { drawGabrielAura, drawGabrielBack } from "./gabrielBody";
import { drawSerenaAura, drawSerenaBack } from "./serenaBody";
import { drawRafaelAura, drawRafaelBack } from "./rafaelBody";
import { drawYurielAura, drawYurielBack } from "./yurielBody";
import { drawMichaelaAura, drawMichaelaBack } from "./michaelaBody";
import { drawBlastAmmo, drawBlastAura } from "./blastBody";
import { drawNailerAura, drawNailerBack } from "./nailerBody";
import { drawScissorsAura, drawScissorsBack } from "./scissorsBody";
import { drawHellfistAura, drawHellfistBack } from "./hellfistBody";
import { drawSilverBulletAura } from "./silverBulletBody";
import { drawBlueFlameAura, drawBlueFlameBack } from "./blueFlameBody";
import { drawFactionBody } from "./factionFx";
import { drawFallenWings } from "./fallenWings";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const GOLD = "#ffd860";
const PALE = "#fff6c0";
const SKY = "#a8e0ff";

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function circle(ctx: Ctx, x: number, y: number, r: number, c: string, w: number, a0 = 0, a1 = TAU): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), a0, a1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function disc(ctx: Ctx, x: number, y: number, r: number, c: string): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, TAU);
  ctx.fill();
}
/** 빛 십자가 (가운데 x, y · 팔 길이 a) */
function cross(ctx: Ctx, x: number, y: number, a: number, c: string): void {
  const w = Math.max(1, Math.round(a / 4));
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x - w / 2), Math.round(y - a), w, Math.round(a * 2.3));
  ctx.fillRect(Math.round(x - a * 0.75), Math.round(y - a * 0.35), Math.round(a * 1.5), w);
}

/** 빛 탄: 금빛 마름모 + 옅은 꼬리 */
export function drawForgottenShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "fgBolt") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  ctx.globalAlpha = 0.45;
  line(ctx, x - (pr.vx / len) * 9, y - (pr.vy / len) * 9, x, y, PALE, 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = GOLD;
  ctx.fillRect(Math.round(x) - 2, Math.round(y) - 1, 4, 2);
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 2, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  return true;
}

/** 등 뒤의 빛의 고리 (몸보다 먼저 그려 등 뒤로 보임): 신족이면 빛 날개와 함께 환하게 */
export function drawForgottenBack(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  // 풍류사: 구름 자국·먹물·발밑 구름 (render/pungryuBody)
  drawPungryuBack(ctx, s, alpha, snap);
  drawLeoBack(ctx, s, alpha, snap);
  drawOnyxBack(ctx, s, alpha, snap);
  drawFenrirBack(ctx, s, alpha, snap);
  drawEclipseBack(ctx, s, alpha, snap);
  drawThorkenBack(ctx, s, alpha, snap);
  drawLeviaBack(ctx, s, alpha, snap);
  drawTailBack(ctx, s, alpha, snap);
  drawMadQueenBack(ctx, s, alpha, snap);
  drawHookBack(ctx, s, alpha, snap);
  drawOrcaBack(ctx, s, alpha, snap);
  drawWaveBack(ctx, s, alpha, snap);
  drawMiryuBack(ctx, s, alpha, snap);
  drawBeatriceBack(ctx, s, alpha, snap);
  drawIanBack(ctx, s, alpha, snap);
  drawGabrielBack(ctx, s, alpha, snap);
  drawSerenaBack(ctx, s, alpha, snap);
  drawRafaelBack(ctx, s, alpha, snap);
  drawYurielBack(ctx, s, alpha, snap);
  drawMichaelaBack(ctx, s, alpha, snap);
  drawNailerBack(ctx, s, alpha, snap);
  drawScissorsBack(ctx, s, alpha, snap);
  drawHellfistBack(ctx, s, alpha, snap);
  drawBlueFlameBack(ctx, s, alpha, snap);
  drawFallenWings(ctx, s, alpha, snap);
  const p = s.player;
  if (p.characterId !== "forgotten") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha) - 11);
  const god = (p.fgGod ?? 0) > 0;
  if (god) {
    // 빛 날개 (깃 다섯 장씩, 천천히 퍼덕임)
    const flap = Math.sin(s.tick * 0.12) * 0.15;
    for (const side of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const a = -0.5 + i * 0.32 + flap;
        const len = 16 - i * 1.5;
        ctx.globalAlpha = 0.35 + 0.1 * i;
        line(ctx, x + side * 3, y + 4, x + side * (3 + Math.cos(a) * len), y + 4 - Math.sin(-a) * len * 0.8 - 6, i % 2 ? PALE : GOLD, 2);
      }
    }
    ctx.globalAlpha = 0.18 + 0.08 * Math.sin(s.tick * 0.2);
    disc(ctx, x, y + 8, 18, PALE);
  }
  // 등 뒤 고리 (게이지는 화면 왼쪽 위, forgottenHalo)
  drawHaloBack(ctx, s, alpha, snap);
}

/** 신족인 동안 몸 위: 떠오르는 빛 알갱이 */
export function drawForgottenAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  // 풍류사: 구절 네 칸·해달 구슬·비구름·분신 (render/pungryuBody)
  drawPungryuAura(ctx, s, alpha, snap);
  drawLeoAura(ctx, s, alpha, snap);
  drawOnyxAura(ctx, s, alpha, snap);
  drawFenrirAura(ctx, s, alpha, snap);
  drawEclipseAura(ctx, s, alpha, snap);
  drawThorkenAura(ctx, s, alpha, snap);
  drawLeviaAura(ctx, s, alpha, snap);
  drawTailAura(ctx, s, alpha, snap);
  drawMadQueenAura(ctx, s, alpha, snap);
  drawHookAura(ctx, s, alpha, snap);
  drawOrcaAura(ctx, s, alpha, snap);
  drawWaveAura(ctx, s, alpha, snap);
  drawMiryuAura(ctx, s, alpha, snap);
  drawBeatriceAura(ctx, s, alpha, snap);
  drawIanAura(ctx, s, alpha, snap);
  drawGabrielAura(ctx, s, alpha, snap);
  drawSerenaAura(ctx, s, alpha, snap);
  drawRafaelAura(ctx, s, alpha, snap);
  drawYurielAura(ctx, s, alpha, snap);
  drawMichaelaAura(ctx, s, alpha, snap);
  drawBlastAura(ctx, s, alpha, snap);
  drawBlastAmmo(ctx, s, alpha, snap);
  drawNailerAura(ctx, s, alpha, snap);
  drawScissorsAura(ctx, s, alpha, snap);
  drawHellfistAura(ctx, s, alpha, snap);
  drawSilverBulletAura(ctx, s, alpha, snap);
  drawBlueFlameAura(ctx, s, alpha, snap);
  drawFactionBody(ctx, s, alpha, snap);
  const p = s.player;
  if (p.characterId !== "forgotten" || (p.fgGod ?? 0) <= 0) return;
  const x = lerp(p.prevX, p.x, alpha);
  const y = lerp(p.prevY, p.y, alpha);
  for (let i = 0; i < 8; i++) {
    const t = ((s.tick * 0.02 + i * 0.37) % 1 + 1) % 1;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = i % 2 ? GOLD : "#ffffff";
    ctx.fillRect(snap(x + Math.sin(i * 2.1 + s.tick * 0.05) * 7), snap(y + 4 - t * 22), 1, 1);
  }
  ctx.globalAlpha = 1;
}

/** 효과: 떨어지는 십자가 · 내려앉음 · 빛줄기 · 터짐 · 베기 · 빛기둥 · 깨어남 */
export function drawForgottenFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("fg")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "fgCross": {
      // 바닥에 떨어질 자리(차오르는 원) · 하늘에서 내려오는 십자가
      ctx.globalAlpha = 0.25 + 0.25 * t;
      circle(ctx, x, y, r, GOLD, 1);
      circle(ctx, x, y, r * t, PALE, 1);
      ctx.globalAlpha = 0.4 + 0.6 * t;
      cross(ctx, x, y - 6 - (1 - t) * 70, Math.max(4, r * 0.55), "#ffffff");
      ctx.globalAlpha *= 0.5;
      line(ctx, x, y - 6 - (1 - t) * 70 - r, x, y - 120, PALE, 1);
      break;
    }
    case "fgFlash": {
      // 내려앉은 십자가: 흰 빛기둥 + 퍼지는 금빛 고리 + 십자가 잔상
      ctx.globalAlpha = (1 - t) * 0.7;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - Math.max(1, r * 0.3 * (1 - t)), y - 90, Math.max(2, r * 0.6 * (1 - t)), 90);
      ctx.globalAlpha = 1 - t;
      circle(ctx, x, y, r * (0.5 + t * 0.7), GOLD, 2);
      cross(ctx, x, y - 6, Math.max(4, r * 0.55), PALE);
      break;
    }
    case "fgBeam": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      ctx.globalAlpha = (1 - t) * 0.45;
      line(ctx, x, y, tx, ty, GOLD, r * 2.2);
      ctx.globalAlpha = 1 - t;
      line(ctx, x, y, tx, ty, "#ffffff", Math.max(1, r * 0.7 * (1 - t * 0.5)));
      disc(ctx, x, y, r * 0.8, PALE);
      break;
    }
    case "fgNova": {
      ctx.globalAlpha = (1 - t) * 0.3;
      disc(ctx, x, y, r * (0.4 + t * 0.6), PALE);
      ctx.globalAlpha = 1 - t;
      circle(ctx, x, y, r * (0.4 + t * 0.6), GOLD, 2);
      circle(ctx, x, y, r * (0.2 + t * 0.6), "#ffffff", 1);
      break;
    }
    case "fgSlash": {
      // 바라보는 쪽 반달 빛 베기
      const a = Math.atan2(fx.dirY, fx.dirX);
      ctx.globalAlpha = 1 - t;
      circle(ctx, x, y, r * (0.7 + t * 0.3), PALE, 4, a - 1.2, a + 1.2);
      circle(ctx, x, y, r * (0.75 + t * 0.3), "#ffffff", 1.5, a - 1.1, a + 1.1);
      ctx.globalAlpha = (1 - t) * 0.6;
      circle(ctx, x, y, r * (0.55 + t * 0.3), GOLD, 2, a - 0.9, a + 0.9);
      break;
    }
    case "fgPillar": {
      // 하늘에서 내리꽂는 빛기둥
      const w = 6 * (1 - t * 0.6);
      ctx.globalAlpha = (1 - t) * 0.5;
      ctx.fillStyle = GOLD;
      ctx.fillRect(x - w, y - 80, w * 2, 82);
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - w / 3, y - 80, Math.max(1, (w * 2) / 3), 82);
      circle(ctx, x, y, 3 + t * 8, PALE, 1);
      break;
    }
    case "fgAwaken": {
      // 신족: 빛줄기 열두 개가 뻗고 고리 두 겹이 퍼짐
      ctx.globalAlpha = 1 - t;
      for (let i = 0; i < 12; i++) {
        const a = (i * TAU) / 12 + t;
        line(ctx, x + Math.cos(a) * 6, y + Math.sin(a) * 6, x + Math.cos(a) * r * (0.3 + t), y + Math.sin(a) * r * (0.3 + t), i % 2 ? GOLD : PALE, 1);
      }
      circle(ctx, x, y, r * t, "#ffffff", 3);
      circle(ctx, x, y, r * t * 0.6, SKY, 1);
      break;
    }
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}
