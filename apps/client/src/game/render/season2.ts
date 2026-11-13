// 시즌 2(비르디아) 그리기: 이드라 손의 가이아(대궁·단검·방패·채찍)·모습 바꿈·사계 꽃잎 · 이드라·변희 탄(화살·깃털·독 침·거미줄·불덩이·작은 박쥐)
import type { EffectState, ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import { drawElderFx } from "./elder";
import { drawSpiritFx } from "./spirits";
import { drawMorphFx } from "./morphFx";
import { drawClawFx, drawWindBlade } from "./clawFx";
import { drawPlagueFx } from "./plague";
import { drawSlayerShot } from "./slayer";
import { drawSlayerFx } from "./slayerFx";
import { drawEaterShot } from "./eater";
import { drawEaterFx } from "./eaterFx";
import { drawMukinFx } from "./mukin";
import { drawNeedleShot, drawSamyeolFx } from "./samyeol";
import { drawTerraFx, drawTerraShot } from "./terra2";
import { drawTerraFxB, drawTerraShotB } from "./terra2b";
import { drawTerraFxC, drawTerraShotC } from "./terra2c";
import { drawRuneFx } from "./rune";
import { drawTrackerFx, drawTrackerShot } from "./tracker";
import { drawForgottenFx, drawForgottenShot } from "./forgotten";
import { drawRemnantFx, drawRemnantShot } from "./remnant";
import { drawTrialFx } from "./trialFx";
import { drawVaultFx } from "./vaultFx";
import { drawAltarFx } from "./altarDraw";
import { drawWandererFx, drawWandererShot } from "./wanderer";
import { drawSilkFx } from "./silk";
import { drawPungryuShot } from "./pungryu";
import { drawPungryuFx } from "./pungryuFx";
import { drawLeoFx } from "./leo";
import { drawOnyxFx } from "./onyx";
import { drawFenrirFx } from "./fenrir";
import { drawEclipseFx } from "./eclipse";
import { drawThorkenFx } from "./thorkenFx";
import { drawThorkenShot } from "./thorkenBody";
import { drawLeviaFx } from "./leviaFx";
import { drawTailFx } from "./tailFx";
import { drawMadQueenFx } from "./madQueenFx";
import { drawHookFx } from "./hookFx";
import { drawOrcaFx } from "./orcaFx";
import { drawWaveFx } from "./waveFx";
import { drawMiryuFx } from "./miryuFx";
import { drawBeatriceFx } from "./beatriceFx";
import { drawIanFx } from "./ianFx";
import { drawGabrielFx } from "./gabrielFx";
import { drawSerenaFx } from "./serenaFx";
import { drawRafaelFx } from "./rafaelFx";
import { drawYurielFx } from "./yurielFx";
import { drawMichaelaFx } from "./michaelaFx";
import { drawLeviaShot } from "./leviaBody";
import { drawBlastFx, drawBlastShot } from "./blastFx";
import { drawNailerFx } from "./nailerFx";
import { drawScissorsFx } from "./scissorsFx";
import { drawHellfistFx } from "./hellfistFx";
import { drawSilverBulletFx } from "./silverBulletFx";
import { drawLunaticFx } from "./lunaticFx";
import { drawIncisionFx } from "./incisionFx";
import { drawCrusaderFx } from "./crusaderFx";
import { drawJokerFx } from "./jokerFx";
import { drawShadowingFx } from "./shadowingFx";
import { drawPuppetFx } from "./puppetFx";
import { drawRabbitFx } from "./rabbitFx";
import { drawBaekFx } from "./baekFx";
import { drawBingseolFx } from "./bingseolFx";
import { drawAsuraFx } from "./asuraFx";
import { drawBaekinjangFx } from "./baekinjangFx";
import { drawHonryeongFx } from "./honryeongFx";
import { drawAriaFx } from "./ariaFx";
import { drawRavenFx } from "./ravenFx";
import { drawGearsFx } from "./gearsFx";
import { drawNoirFx } from "./noirFx";
import { drawRougeFx } from "./rougeFx";
import { drawBleuFx } from "./bleuFx";
import { drawJauneFx } from "./jauneFx";
import { drawMagentaFx } from "./magentaFx";
import { drawVertFx } from "./vertFx";
import { drawBlancFx } from "./blancFx";
import { drawBlueFlameFx } from "./blueFlameFx";
import { drawFactionFx } from "./factionFx";
import { drawCollectorFx, drawCollectorShot } from "./collector";
import { drawSecretFx, drawSecretShot } from "./secret";
import { drawAwakenFx } from "./awakenA";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 가이아 모습마다 빛 색 (대궁 · 단검 · 방패 · 채찍) */
const FORM_GLOW = ["#9ae870", "#c8f0a0", "#e8c060", "#5ac84a"];

const dirOf = (pr: ProjectileState) => {
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  return [pr.vx / len, pr.vy / len] as const;
};

export function drawS2Shot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (drawSlayerShot(ctx, pr, x, y, tick) || drawEaterShot(ctx, pr, x, y) || drawNeedleShot(ctx, pr, x, y) || drawTerraShot(ctx, pr, x, y, tick) || drawTerraShotB(ctx, pr, x, y, tick) || drawTerraShotC(ctx, pr, x, y) || drawTrackerShot(ctx, pr, x, y) || drawForgottenShot(ctx, pr, x, y) || drawRemnantShot(ctx, pr, x, y) || drawWandererShot(ctx, pr, x, y, tick) || drawSecretShot(ctx, pr, x, y, tick) || drawCollectorShot(ctx, pr, x, y, tick) || drawPungryuShot(ctx, pr, x, y) || drawThorkenShot(ctx, pr, x, y) || drawLeviaShot(ctx, pr, x, y) || drawBlastShot(ctx, pr, x, y)) return true;
  const [dx, dy] = dirOf(pr);
  switch (pr.spirit) {
    case "gaiaArrow":
      // 세계수 화살: 나무 살 + 빛나는 잎 촉 + 뒤에 떨어지는 잎
      ctx.strokeStyle = "#8a6a3a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - dx * 7, y - dy * 7);
      ctx.lineTo(x + dx * 2, y + dy * 2);
      ctx.stroke();
      ctx.fillStyle = "#c8ff8a";
      ctx.fillRect(Math.round(x + dx * 2) - 1, Math.round(y + dy * 2) - 1, 3, 3);
      ctx.fillStyle = "#5ac84a";
      ctx.fillRect(Math.round(x - dx * 7 - dy * 2), Math.round(y - dy * 7 + dx * 2), 2, 1);
      ctx.fillRect(Math.round(x - dx * 7 + dy * 2), Math.round(y - dy * 7 - dx * 2), 2, 1);
      return true;
    case "eagleFeather":
      ctx.strokeStyle = "#f4f4f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - dx * 5, y - dy * 5);
      ctx.lineTo(x + dx * 2, y + dy * 2);
      ctx.stroke();
      ctx.fillStyle = "#5a3a20";
      ctx.fillRect(Math.round(x - dx * 5) - 1, Math.round(y - dy * 5) - 1, 2, 2);
      return true;
    case "venomSpit":
      ctx.fillStyle = "#2a5a1a";
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#9aff5a";
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      ctx.fillStyle = "rgba(122,224,90,0.5)";
      ctx.fillRect(Math.round(x - dx * 4), Math.round(y - dy * 4), 1, 1);
      return true;
    case "web": {
      ctx.strokeStyle = "rgba(240,240,250,0.9)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 4 + tick * 0.05;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(a) * 4, y - Math.sin(a) * 4);
        ctx.lineTo(x + Math.cos(a) * 4, y + Math.sin(a) * 4);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.stroke();
      return true;
    }
    case "phoenixFire": {
      for (let i = 4; i >= 1; i--) {
        ctx.fillStyle = ["#ffe08a", "#ffb040", "#ff7a2a", "#e84a1a"][i - 1]!;
        ctx.globalAlpha = i === 1 ? 1 : 0.8;
        ctx.beginPath();
        ctx.arc(x - dx * (i - 1) * 2, y - dy * (i - 1) * 2 + Math.sin(tick * 0.5 + i) * 0.5, 4.5 - i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return true;
    }
    case "windBlade":
      drawWindBlade(ctx, pr, x, y, tick);
      return true;
    case "wingBlade": {
      // 날개 칼날(얇은 잠자리 날개)
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(dy, dx));
      ctx.fillStyle = "rgba(200,244,255,0.85)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-4, -0.5, 8, 1);
      ctx.restore();
      return true;
    }
    case "magicMissile":
      // 작고 약한 마법탄: 푸른 빛 + 꼬리
      ctx.fillStyle = "rgba(138,184,255,0.45)";
      ctx.fillRect(Math.round(x - dx * 4) - 1, Math.round(y - dy * 4) - 1, 2, 2);
      ctx.fillStyle = "#8ab8ff";
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      return true;
    case "batling": {
      const flap = Math.floor(tick / 4) % 2 ? 2 : -1;
      ctx.fillStyle = "#3a2a4a";
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      ctx.fillRect(Math.round(x) - 4, Math.round(y) + flap - 1, 3, 1);
      ctx.fillRect(Math.round(x) + 1, Math.round(y) + flap - 1, 3, 1);
      ctx.fillStyle = "#ff4a4a";
      ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 1);
      return true;
    }
  }
  return false;
}

/** 모습 바꿈: 새 모습 색의 잎 고리가 퍼짐 */
export function drawS2Fx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "gaiaSwap") return drawPungryuFx(ctx, fx, snap) || drawLeoFx(ctx, fx, snap) || drawOnyxFx(ctx, fx, snap) || drawFenrirFx(ctx, fx, snap) || drawEclipseFx(ctx, fx, snap) || drawThorkenFx(ctx, fx, snap) || drawLeviaFx(ctx, fx, snap) || drawTailFx(ctx, fx, snap) || drawMadQueenFx(ctx, fx, snap) || drawHookFx(ctx, fx, snap) || drawOrcaFx(ctx, fx, snap) || drawWaveFx(ctx, fx, snap) || drawMiryuFx(ctx, fx, snap) || drawBeatriceFx(ctx, fx, snap) || drawIanFx(ctx, fx, snap) || drawGabrielFx(ctx, fx, snap) || drawSerenaFx(ctx, fx, snap) || drawRafaelFx(ctx, fx, snap) || drawYurielFx(ctx, fx, snap) || drawMichaelaFx(ctx, fx, snap) || drawBlastFx(ctx, fx, snap) || drawNailerFx(ctx, fx, snap) || drawScissorsFx(ctx, fx, snap) || drawHellfistFx(ctx, fx, snap) || drawSilverBulletFx(ctx, fx, snap) || drawBlueFlameFx(ctx, fx, snap) || drawLunaticFx(ctx, fx, snap) || drawIncisionFx(ctx, fx, snap) || drawCrusaderFx(ctx, fx, snap) || drawShadowingFx(ctx, fx, snap) || drawPuppetFx(ctx, fx, snap) || drawRabbitFx(ctx, fx, snap) || drawBaekFx(ctx, fx, snap) || drawBingseolFx(ctx, fx, snap) || drawAsuraFx(ctx, fx, snap) || drawBaekinjangFx(ctx, fx, snap) || drawHonryeongFx(ctx, fx, snap) || drawAriaFx(ctx, fx, snap) || drawRavenFx(ctx, fx, snap) || drawGearsFx(ctx, fx, snap) || drawNoirFx(ctx, fx, snap) || drawRougeFx(ctx, fx, snap) || drawBleuFx(ctx, fx, snap) || drawJauneFx(ctx, fx, snap) || drawMagentaFx(ctx, fx, snap) || drawVertFx(ctx, fx, snap) || drawBlancFx(ctx, fx, snap) || drawJokerFx(ctx, fx, snap) || drawFactionFx(ctx, fx, snap) || drawElderFx(ctx, fx, snap) || drawSpiritFx(ctx, fx, snap) || drawMorphFx(ctx, fx, snap) || drawClawFx(ctx, fx, snap) || drawPlagueFx(ctx, fx, snap) || drawSlayerFx(ctx, fx, snap) || drawEaterFx(ctx, fx, snap) || drawMukinFx(ctx, fx, snap) || drawSamyeolFx(ctx, fx, snap) || drawTerraFx(ctx, fx, snap) || drawTerraFxB(ctx, fx, snap) || drawTerraFxC(ctx, fx, snap) || drawRuneFx(ctx, fx, snap) || drawTrackerFx(ctx, fx, snap) || drawForgottenFx(ctx, fx, snap) || drawRemnantFx(ctx, fx, snap) || drawTrialFx(ctx, fx, snap) || drawAltarFx(ctx, fx, snap) || drawWandererFx(ctx, fx, snap) || drawSecretFx(ctx, fx, snap) || drawSilkFx(ctx, fx, snap) || drawCollectorFx(ctx, fx, snap) || drawVaultFx(ctx, fx, snap) || drawAwakenFx(ctx, fx, snap);
  const t = 1 - fx.ticks / fx.maxTicks;
  const r = fx.size * (0.4 + 0.6 * t);
  const x = snap(fx.x);
  const y = snap(fx.y);
  // 이드라 모습 바꾸기: 모습 색 빛 기둥 + 충격파 + 꽃잎·잎
  const fc = FORM_GLOW[fx.dirX] ?? "#9ae870";
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.2, fc, 1 - t, t < 0.2 ? 1.2 : 0.3);
    shock(ctx, x, y, r, fc, 1 - t, 5);
  });
  ctx.globalAlpha = 1 - t;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + t * 2;
    ctx.fillStyle = i % 2 ? "#5ac84a" : "#ff8ac8";
    ctx.fillRect(Math.round(x + Math.cos(a) * r) - 1, Math.round(y + Math.sin(a) * r) - 1, 2, 2);
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 이드라 손의 가이아 (바라보는 쪽 옆) · 사계 동안 꽃잎 */
export function drawIdra(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "idra" || p.hp <= 0) return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const side = p.faceX < 0 ? -1 : 1;
  const hx = x + side * 7;
  const hy = y - 4;
  const form = p.gForm ?? 0;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.scale(side, 1);
  if (form === 0) {
    // 대궁: 나무 활대 + 시위 + 잎
    ctx.strokeStyle = "#7a5a32";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-3, 0, 7, -Math.PI / 2.4, Math.PI / 2.4);
    ctx.stroke();
    ctx.strokeStyle = "#e8f0d8";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-1, -6.5);
    ctx.lineTo(-1, 6.5);
    ctx.stroke();
    ctx.fillStyle = "#5ac84a";
    ctx.fillRect(2, -6, 2, 2);
    ctx.fillRect(2, 4, 2, 2);
  } else if (form === 1) {
    // 우드브레이커: 짧은 단검
    ctx.fillStyle = "#4a3420";
    ctx.fillRect(-2, -1, 3, 2);
    ctx.fillStyle = "#c8e8a0";
    ctx.beginPath();
    ctx.moveTo(1, -1.5);
    ctx.lineTo(7, 0);
    ctx.lineTo(1, 1.5);
    ctx.fill();
  } else if (form === 2) {
    // 가이아 버클러: 둥근 나무 방패
    ctx.fillStyle = "#7a5a32";
    ctx.beginPath();
    ctx.arc(1, 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4a3420";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#5ac84a";
    ctx.fillRect(0, 1, 2, 2);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(1, 1, 1, 1);
  } else {
    // 브라이어 스커지: 늘어진 가시 덩굴
    ctx.strokeStyle = "#3a7a2a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(5, 2 + Math.sin(s.tick * 0.2) * 2, 2, 8);
    ctx.stroke();
    ctx.fillStyle = "#c8e8a0";
    ctx.fillRect(3, 2, 1, 1);
    ctx.fillRect(3, 6, 1, 1);
  }
  ctx.restore();
  if ((p.gSeason ?? 0) > 0) {
    for (let i = 0; i < 4; i++) {
      const a = s.tick * 0.06 + (i * Math.PI) / 2;
      ctx.fillStyle = ["#ff8ac8", "#5ac84a", "#e8a040", "#e8f4ff"][i]!;
      ctx.fillRect(Math.round(x + Math.cos(a) * 11), Math.round(y - 4 + Math.sin(a) * 6), 2, 2);
    }
  }
}
