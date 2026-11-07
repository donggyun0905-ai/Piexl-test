// 진영 특징 그리기 (로그만): 효과 — 물결 콤보 물보라 · 타락 폭주 붉은 폭발 · 과열 배출 증기 폭발 · 과부하 연기 · 맹세 지킴(푸른 방패 문장)·깨짐(붉은 금) · 정령 자람 · 정령 탄 · 핵심 스킬 각성 금빛 · 금빛 빛기둥
// 몸 둘레 — 비르디아 정령(싹·꽃·나무 정령 픽셀 그림) · 폭주 중 붉은 기운 · 열이 높으면 주황 아지랑이 · 콤보 높으면 물결 고리
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { hpBarTop } from "./hpTop";
import { drawSpirit } from "./spiritArt";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";

const SEA = "#6ad4ff";
const RED = "#ff2a3a";
const HEAT = "#ff8a2a";
const BLUE = "#6aa0ff";
const LEAF = "#6ae07a";
const GOLD = "#ffd84a";

/** 픽셀 글자 (1 = 칠함) */
function pix(ctx: Ctx, rows: string[], x: number, y: number): void {
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r]!.length; c++) if (rows[r]![c] === "1") ctx.fillRect(x + c, y + r, 1, 1);
}
const HORN_L = ["0001", "0011", "0110", "1100", "1100", "0110"];
const HORN_R = ["1000", "1100", "0110", "0011", "0011", "0110"];
const EYE_X = ["101", "010", "101"];
const EYE_O = ["111", "101", "111"];

/** 헬리오스 폭주: 머리 위 검은 뿔(붉은 빛 테) · 얼굴에 검은 빛 x _ o 표정 (top = 그림 맨 위) */
function demonFace(ctx: Ctx, x: number, top: number, t: number): void {
  const hy = top - 4;
  const fy = top + 8;
  const pulse = 0.6 + 0.3 * Math.sin(t * 0.25);
  additive(ctx, () => {
    glow(ctx, x - 6, hy + 2, 7, RED, pulse, 0);
    glow(ctx, x + 6, hy + 2, 7, RED, pulse, 0);
    glow(ctx, x, fy + 2, 8, "#5a0a2a", 0.6, 0);
  });
  ctx.fillStyle = "#0a0006";
  pix(ctx, HORN_L, x - 9, hy - 2);
  pix(ctx, HORN_R, x + 5, hy - 2);
  ctx.fillStyle = `rgba(10,0,8,${0.85 + 0.15 * Math.sin(t * 0.4)})`;
  pix(ctx, EYE_X, x - 5, fy);
  pix(ctx, EYE_O, x + 2, fy);
  ctx.fillRect(x - 1, fy + 4, 3, 1);
}

/** 화면에 붙음: 헬리오스 폭주 중 화면 테두리가 붉게 일렁임 (blastBody.drawBlastSlowmo에서) */
export function drawFactionScreen(ctx: Ctx, s: RunState): void {
  const p = s.player;
  if (!((p.fcRampage ?? 0) > 0) || s.over || s.pvp) return;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const k = Math.min(1, (p.fcRampage ?? 0) / 20) * (0.7 + 0.3 * Math.sin(s.tick * 0.12));
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.38, W / 2, H / 2, Math.max(W, H) * 0.72);
  g.addColorStop(0, "rgba(200,10,30,0)");
  g.addColorStop(1, `rgba(200,10,30,${0.55 * k})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/** 몸 둘레 (forgotten.drawAuras에서) */
export function drawFactionBody(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (s.over || s.pvp) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const t = s.tick;
  drawSpirit(ctx, s, snap);
  if ((p.fcRampage ?? 0) > 0) {
    additive(ctx, () => {
      glow(ctx, x, y - 6, 26, RED, 0.35 + 0.1 * Math.sin(t * 0.3), 0.1);
      sparks(ctx, x, y - 6, 6, 18, (t % 20) / 20, RED, Math.floor(t / 20), 0.8);
    });
    demonFace(ctx, x, hpBarTop(p, y), t);
  }
  if ((p.fcOver ?? 0) > 0) {
    for (let k = 0; k < 4; k++) {
      const f = ((t + k * 9) % 36) / 36;
      ctx.fillStyle = `rgba(90,90,96,${0.5 * (1 - f)})`;
      ctx.beginPath();
      ctx.arc(x + Math.sin(k * 2.1 + t * 0.05) * 6, y - 14 - f * 16, 3 + f * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if ((p.fcHeat ?? 0) >= 60) additive(ctx, () => glow(ctx, x, y - 6, 18, HEAT, 0.2 + ((p.fcHeat ?? 0) - 60) / 200, 0));
  if ((p.fcCombo ?? 0) >= 50) additive(ctx, () => ring(ctx, x, y + 2, 12 + Math.sin(t * 0.15) * 2, alpha(SEA, 0.5), 1.5));
}

const FX = new Set(["fcTideUp", "fcRampage", "fcVent", "fcOverload", "fcOathKept", "fcOathBroken", "fcSpGrow", "fcSpHit", "fcSpThorn", "fcSpBite", "fcSpDive", "fcSpStomp", "fcSpFox", "fcSpEat", "fcCoreOn", "fcCorePillar", "fcCoreArt", "fcCoreBolt"]);
/** 성국 추가 공격 색 (style: 베아트리스 태양 · 이안 보랏빛 실 · 가브리엘 중력 · 세레나 독 · 라파엘 하늘빛 · 유리엘 흰 금빛 · 미카엘라 은빛 칼날) */
const ART = ["#ff9a2a", "#b06aff", "#8a7aff", "#9aff6a", "#8ae0ff", "#fff0b0", "#d8e0f0"];

/** 성국 추가 공격: 둘레 고리 (베아트리스 3겹 · 가브리엘 안으로 모임 · 유리엘 앞쪽 부채꼴) */
function coreArt(ctx: Ctx, fx: EffectState, x: number, y: number, f: number): void {
  const c = ART[fx.style ?? 0] ?? GOLD;
  const fade = 1 - f;
  if (fx.style === 0) for (let k = 0; k < 3; k++) shock(ctx, x, y, fx.size * easeOut(Math.max(0, f * 1.5 - k * 0.2)), c, fade, 6);
  else if (fx.style === 2) shock(ctx, x, y, fx.size * 1.3 * (1 - easeOut(f)), c, fade, 10);
  else if (fx.style === 5) {
    const a = Math.atan2(fx.dirY, fx.dirX);
    for (const d of [-0.5, 0, 0.5]) beam(ctx, x, y, x + Math.cos(a + d) * fx.size * 1.6 * easeOut(f), y + Math.sin(a + d) * fx.size * 1.6 * easeOut(f), 6 * fade + 1, c, fade);
  } else shock(ctx, x, y, fx.size * easeOut(f), c, fade * 0.8, 5);
  sparks(ctx, x, y, 14, fx.size, f, c, (fx.style ?? 0) + 5);
}

/** 효과 (season2 drawSeason2Fx 사슬에서) */
export function drawFactionFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const fade = 1 - f;
  additive(ctx, () => {
    switch (fx.kind) {
      case "fcTideUp":
        shock(ctx, x, y, fx.size * easeOut(f), SEA, fade, 5);
        sparks(ctx, x, y - 4, 8, fx.size, f, SEA, fx.size);
        break;
      case "fcRampage":
        shock(ctx, x, y, fx.size * easeOut(f), RED, fade, 8);
        glow(ctx, x, y, fx.size * 0.8, RED, 0.6 * fade, 0.4);
        break;
      case "fcVent":
        shock(ctx, x, y, fx.size * easeOut(f), "#ffffff", fade * 0.9, 10);
        glow(ctx, x, y, fx.size * (0.4 + 0.6 * f), HEAT, 0.5 * fade, 0.6);
        sparks(ctx, x, y, 12, fx.size, f, HEAT, 7);
        break;
      case "fcOverload":
        if (Math.floor(f * 12) % 2 === 0) glow(ctx, x, y - 6, 16, RED, 0.35, 0);
        break;
      case "fcOathKept":
        glow(ctx, x, y - 20 - f * 10, 14, BLUE, fade, 0.6);
        shock(ctx, x, y, fx.size * easeOut(f), GOLD, fade * 0.8, 4);
        break;
      case "fcOathBroken":
        glow(ctx, x, y - 20, 12, RED, fade * 0.7, 0.2);
        beam(ctx, x - 6, y - 26, x + 4, y - 14, 1, RED, fade);
        break;
      case "fcSpGrow":
        shock(ctx, x, y, fx.size * easeOut(f), LEAF, fade, 4);
        sparks(ctx, x, y, 10, fx.size, f, "#ff9ad8", 3);
        break;
      case "fcSpHit": {
        const tx = snap(fx.toX ?? fx.x);
        const ty = snap(fx.toY ?? fx.y);
        const k = Math.min(1, f * 2.5);
        beam(ctx, x, y, lerp(x, tx, k), lerp(y, ty, k), 1 + fx.size * 0.5, LEAF, fade);
        if (k >= 1) glow(ctx, tx, ty, 6 + fx.size * 2, LEAF, fade, 0.5);
        break;
      }
      case "fcSpThorn":
        shock(ctx, x, y, fx.size * easeOut(f), LEAF, fade, 6);
        sparks(ctx, x, y, 12, fx.size, f, "#c8ff8a", 9);
        break;
      case "fcSpBite":
        sparks(ctx, x, y, 6, 12, f, "#ff6a6a", fx.x);
        glow(ctx, x, y, 8, "#ff6a6a", fade * 0.6, 0.3);
        break;
      case "fcSpDive":
        shock(ctx, x, y, fx.size * easeOut(f), "#fff4c0", fade, 6);
        glow(ctx, x, y, fx.size * 0.6, "#fff4c0", fade * 0.5, 0.6);
        break;
      case "fcSpStomp":
        shock(ctx, x, y, fx.size * easeOut(f), LEAF, fade, 8);
        sparks(ctx, x, y, 10, fx.size, f, "#8a5a2a", 4);
        break;
      case "fcSpFox":
        shock(ctx, x, y, fx.size * easeOut(f), "#d88aff", fade, 5);
        sparks(ctx, x, y, 12, fx.size * 1.4, f, "#ff8a3a", 13);
        break;
      case "fcSpEat":
        glow(ctx, x, y, fx.size * (1 - f * 0.5), LEAF, fade * 0.7, 0.5);
        sparks(ctx, x, y, 8, fx.size, 1 - f, "#ffd86a", 21);
        break;
      case "fcCoreOn":
        shock(ctx, x, y, fx.size * easeOut(f), GOLD, fade, 6);
        sparks(ctx, x, y - 6, 14, fx.size, f, GOLD, 11);
        break;
      case "fcCoreArt":
        coreArt(ctx, fx, x, y, f);
        break;
      case "fcCoreBolt": {
        const c = ART[fx.style ?? 0] ?? GOLD;
        const tx = snap(fx.toX ?? fx.x);
        const ty = snap(fx.toY ?? fx.y);
        const k = Math.min(1, f * 3);
        beam(ctx, x, y, lerp(x, tx, k), lerp(y, ty, k), 3 * fade + 1, c, fade);
        if (k >= 1) glow(ctx, tx, ty, 16, c, fade, 0.6);
        break;
      }
      case "fcCorePillar":
        shock(ctx, x, y, fx.size * easeOut(f), GOLD, fade, 8);
        beam(ctx, x, y - 120 * (1 - f * 0.3), x, y, 10 * fade + 2, GOLD, fade);
        glow(ctx, x, y, fx.size * 0.7, GOLD, 0.6 * fade, 0.8);
        break;
    }
  });
  return true;
}
