// 투사체 · 효과(휘두르기·맞음·폭발) · 보스 체력 막대 · 모바일 조준점
import { drawUmbraBar } from "./umbra";
import { drawBossBarMarks } from "./bossBarMarks";
import { allPlayers, ENEMIES, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { drawLaserFx } from "./beams";
import { drawOrbitFx, drawOrbShot } from "./orbs";
import { drawKiShot } from "./brawl";
import { drawBossFx } from "./bossFx";
import { drawSageFx } from "./ruyi";
import { drawEnemyShot } from "./bossLook";
import { drawPwShot } from "./paewang";
import { drawPwSkillFx } from "./pwSkillFx";
import { drawCleaveFx } from "./minions";
import { drawBullet, drawGunFx } from "./guns";
import { drawTagFx } from "./abandoned";
import { drawTitanFx } from "./titan";
import { drawOniFx } from "./oniFx";
import { drawMedicFx } from "./medicFx";
import { drawBeastFx, drawBeastShot } from "./pets";
import { drawNinjaShot } from "./ninja";
import { drawChronoShot } from "./chrono";
import { drawSummonShot, drawWhip } from "./summon";
import { drawBedouinFx, drawBedouinShot } from "./bedouin";
import { drawGeneralFx, drawGeneralShot, drawTintedFx } from "./general";
import { drawImugiFx, drawImugiShot } from "./imugi";
import { drawImugiPowerFx } from "./imugiAura";
import { drawApostleFx } from "./apostle";
import { drawStarFx } from "./star";
import { drawDuckFx, drawDuckShot } from "./duck";
import { drawScribeFx, drawScribeShot } from "./scribe";
import { drawS2Fx, drawS2Shot } from "./season2";
import { drawCustomFx, drawCustomShot } from "./customFx";
import { C, CHARM_INK, lerp, type Snap } from "./palette";
import { drawCoinFx } from "../drawPickup";
import { drawBloom, drawBlossomFlurry } from "./sakura";
import { drawFxBloom, drawShotBloom } from "./fxBloom";
import { drawS2BossFx } from "./s2Bosses";
import { drawS2BossShot } from "./s2BossShots";
import { drawFoeShot, drawS1BossFx } from "./s1Bosses";
import { additive, beam, glow } from "./pwFxBits";
import { drawAmbushShot, drawOriginFx } from "./origin";
import { drawStationFx } from "./stationFx";
import { drawHiddenFx } from "./pilgrim";
import { getSettings } from "../../settings";
import { fadeOf } from "./fxFade";
import { drawLanceShot } from "./hiddenGear";
import { drawBaseShot, drawBlast, drawBurst, drawHit, drawSwing } from "./baseFx";
import { drawS3Bar, drawS3Fx } from "./s3Bosses";

export function drawProjectiles(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const pr of s.projectiles) {
    // 사람이 쏜 탄은 설정 진하기 (render/fxFade)
    ctx.globalAlpha = pr.fromPlayer ? fadeOf(s, pr.shooter) : 1;
    const x = snap(lerp(pr.prevX, pr.x, alpha));
    const y = snap(lerp(pr.prevY, pr.y, alpha));
    if (pr.fromPlayer) drawShotBloom(ctx, s, pr, x, y);
    if (pr.fromPlayer && (drawOrbShot(ctx, pr, x, y) || drawAmbushShot(ctx, pr, x, y, s.tick) || drawLanceShot(ctx, pr, x, y))) continue;
    if (!pr.fromPlayer && (drawS2BossShot(ctx, s, pr, x, y, s.tick) || drawFoeShot(ctx, pr, x, y, s.tick))) continue;
    if (!pr.fromPlayer && (drawPwShot(ctx, pr, x, y) || drawEnemyShot(ctx, pr, x, y, s.tick))) continue;
    if (pr.fromPlayer && (drawBullet(ctx, pr, x, y) || drawKiShot(ctx, pr, x, y))) continue;
    if (pr.fromPlayer && (drawBeastShot(ctx, pr, x, y, s.tick) || drawNinjaShot(ctx, pr, x, y, s.tick) || drawChronoShot(ctx, pr, x, y, s.tick) || drawSummonShot(ctx, pr, x, y, s.tick) || drawBedouinShot(ctx, pr, x, y, s.tick) || drawGeneralShot(ctx, pr, x, y) || drawImugiShot(ctx, pr, x, y) || drawDuckShot(ctx, pr, x, y, s.tick) || drawScribeShot(ctx, pr, x, y) || drawS2Shot(ctx, pr, x, y, s.tick))) continue;
    if (pr.fromPlayer && (pr.charm || pr.spirit)) {
      drawCharm(ctx, pr, x, y, s.tick);
      continue;
    }
    if (drawCustomShot(ctx, pr.blast ? "shot:magic" : pr.fromPlayer ? "shot:player" : "shot:enemy", pr, x, y)) continue;
    drawBaseShot(ctx, pr, x, y, s.tick);
  }
  ctx.globalAlpha = 1;
}


/** 음양사 탄: 부적 종이(날아가는 방향으로 긴 네모) · 벚꽃(연한 분홍 꽃잎이 흩날리며 지나감) · 옥구슬 */
function drawCharm(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): void {
  if (pr.spirit === "orb") {
    ctx.fillStyle = C.jade;
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 1, y - 1, 1, 1);
    return;
  }
  if (pr.charm === "bloom") {
    drawBlossomFlurry(ctx, x, y, pr.r + 2, tick, pr.id);
    return;
  }
  const ink = pr.charm ? CHARM_INK[pr.charm] : CHARM_INK.shade;
  // 부적: 먹빛 기운 + 날아온 길에 흩날리는 종이 빛
  additive(ctx, () => {
    beam(ctx, x - pr.vx * 3, y - pr.vy * 3, x, y, 2, ink, 0.4);
    glow(ctx, x, y, 7, ink, 0.7, pr.charged ? 1.2 : 0);
  });
  const flat = Math.abs(pr.vx) >= Math.abs(pr.vy);
  const w = flat ? 6 : 4;
  const h = flat ? 4 : 6;
  if (pr.aura) {
    // 땅의 부적: 둘레 흙먼지
    ctx.strokeStyle = "rgba(160, 120, 70, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 14 + (tick % 15) / 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  // 어둠·유도 부적: 보라 테두리 종이
  if (pr.charm === "shade" || pr.spirit === "seek") {
    ctx.fillStyle = "#6a3aa8";
    ctx.fillRect(x - w / 2 - 1, y - h / 2 - 1, w + 2, h + 2);
  }
  ctx.fillStyle = C.charmPaper;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.fillStyle = pr.charged ? "#fff" : ink;
  ctx.fillRect(x - 1, y - 1, 2, 2);
}

let layer: HTMLCanvasElement | null = null;
/** 효과 그리기 (설정 '간단한 화면'이면 적의 위험 표시가 아닌 효과는 따로 그려 흐리게 얹음) */
export function drawFx(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  if (!getSettings().simpleView || s.pvp) return drawEffects(ctx, s, alpha, snap);
  drawEffects(ctx, { ...s, effects: s.effects.filter((f) => f.foe) }, alpha, snap);
  const cv = ctx.canvas;
  layer ??= document.createElement("canvas");
  if (layer.width !== cv.width || layer.height !== cv.height) [layer.width, layer.height] = [cv.width, cv.height];
  const l = layer.getContext("2d")!;
  l.setTransform(1, 0, 0, 1, 0, 0);
  l.clearRect(0, 0, layer.width, layer.height);
  l.setTransform(ctx.getTransform());
  l.imageSmoothingEnabled = ctx.imageSmoothingEnabled;
  drawEffects(l, { ...s, effects: s.effects.filter((f) => !f.foe) }, alpha, snap);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = DIM;
  ctx.drawImage(layer, 0, 0);
  ctx.restore();
}
/** 간단한 화면에서 내 효과 투명도 */
const DIM = 0.45;

export function drawEffects(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const players = allPlayers(s);
  for (const fx of s.effects) {
    const t = fx.ticks / fx.maxTicks;
    // 사람을 따라가는 효과는 만든 사람 둘레에 (협동이면 그 자리 사람)
    const p = players[fx.seat ?? 0] ?? s.player;
    const px = lerp(p.prevX, p.x, alpha);
    const py = lerp(p.prevY, p.y, alpha);
    // 방을 깨고 얻은 돈 (협동은 내 돈만)
    if (fx.kind === "coinGet") {
      if ((fx.seat ?? 0) === (s.seat ?? 0)) drawCoinFx(ctx, snap(fx.x), snap(fx.y), fx.size, t);
      continue;
    }
    drawFxBloom(ctx, fx, px, py, snap);
    if (drawOriginFx(ctx, fx, snap) || drawStationFx(ctx, fx, snap) || drawHiddenFx(ctx, fx, snap) || drawS2BossFx(ctx, s, fx, snap) || drawS3Fx(ctx, fx, snap) || drawS1BossFx(ctx, s, fx, snap)) continue;
    if (drawPwSkillFx(ctx, fx, snap) || drawTintedFx(ctx, fx, px, py, snap) || drawCustomFx(ctx, fx, px, py, snap)) continue;
    if (drawLaserFx(ctx, s, fx, px, py, snap) || drawMedicFx(ctx, s, fx, px, py, snap)) continue;
    if (drawOrbitFx(ctx, fx, snap)) continue;
    if (drawCleaveFx(ctx, fx, snap) || drawBedouinFx(ctx, fx, s.tick, snap) || drawGeneralFx(ctx, fx, snap) || drawImugiPowerFx(ctx, fx, snap) || drawImugiFx(ctx, fx, snap) || drawApostleFx(ctx, fx, snap) || drawStarFx(ctx, fx, snap) || drawDuckFx(ctx, fx, px, py, snap)) continue;
    if (drawGunFx(ctx, fx, snap) || drawBeastFx(ctx, fx, snap) || drawSageFx(ctx, fx, snap) || drawBossFx(ctx, fx, snap) || drawTagFx(ctx, fx, snap) || drawTitanFx(ctx, fx, snap) || drawOniFx(ctx, fx, snap) || drawScribeFx(ctx, fx, snap) || drawS2Fx(ctx, fx, snap)) continue;
    if (fx.kind === "swing" && fx.width === 2) drawWhip(ctx, fx, snap(px), snap(py), t);
    else if (fx.kind === "swing") drawSwing(ctx, fx, snap(px), snap(py), t);
    else if (fx.kind === "hit") drawHit(ctx, fx, snap, t);
    else if (fx.kind === "bloom") drawBloom(ctx, fx, s.tick);
    else if (fx.kind === "blast") drawBlast(ctx, fx, snap, t);
    else drawBurst(ctx, fx, t);
  }
}

/** 모바일 조준점 */
export function drawReticleFor(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const px = lerp(p.prevX, p.x, alpha);
  const py = lerp(p.prevY, p.y, alpha);
  const d = Math.min(70, Math.max(22, p.stats.range));
  drawReticle(ctx, snap(px + p.faceX * d), snap(py + p.faceY * d));
}

function drawReticle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = C.reticle;
  ctx.fillRect(x - 4, y, 3, 1);
  ctx.fillRect(x + 2, y, 3, 1);
  ctx.fillRect(x, y - 4, 1, 3);
  ctx.fillRect(x, y + 2, 1, 3);
}

/** 보스 체력 막대: 화면 위쪽 고정 */
export function drawBossBar(ctx: CanvasRenderingContext2D, s: RunState): void {
  const boss = s.enemies.find((e) => ENEMIES[e.kind].boss && e.kind !== "fighter");
  if (!boss) return;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bw = Math.round(w * 0.6);
  const bh = Math.max(4, Math.round(h * 0.02));
  const bx = Math.round((w - bw) / 2);
  const by = Math.round(h * 0.04);
  // 검은 잔영: 짐승마다 따로 떨어진 같은 길이 막대 셋
  if (boss.kind === "umbra") return drawUmbraBar(ctx, s, boss, bx, by, bw, bh);
  // 쌍둥이: 막대 둘 · 달을 삼키는 자: 아래에 천장의 달 (render/s3Bosses)
  if (drawS3Bar(ctx, s, boss, bx, by, bw, bh)) return;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = C.bossCore;
  ctx.fillRect(bx, by, Math.round((bw * Math.max(0, boss.hp)) / boss.maxHp), bh);
  drawBossBarMarks(ctx, boss, s.tick, bx, by, bw, bh);
}
