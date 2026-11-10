// 크루세이더 그리기 (몸 둘레 · 상태): 들어 올리는 동안 머리 위 금빛이 모이고 찍을 자리에 십자 예고 · 떨어지는 심판의 십자가 (그림자가 커짐)
// 성묘 (박힌 십자가) · 여진 예고 · 가시 후광 (도는 가시 고리) · 성벽 돌진 흙먼지 · 무게 가득 금빛 · 강림 거인화 (몸 크게 · 금빛 기운)
// 화면 왼쪽 위 "WEIGHT" 막대 (render/screenHud) · 효과는 render/crusaderFx
import { CRUSADER, isCrusader, WEAPONS, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { brand, CR, crossSprite, dust } from "./crusaderBits";
import { hudScale } from "./imugiAura";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, type Ctx } from "./pwFxBits";

/** 사거리 배율 (shared util.reachOf와 같은 셈) */
const reach = (p: PlayerState) => Math.max(0.5, p.stats.range / Math.max(1, WEAPONS[p.weaponId]?.range ?? p.stats.range));
const awake = (p: PlayerState) => (p.sgAwake ?? 0) > 0;

/** 그림 크기 배율: 강림 중 거인화 (처음 0.3초 동안 커짐) */
export function crusaderScale(p: PlayerState): number {
  if (!isCrusader(p) || !awake(p)) return 1;
  const t = Math.min(1, ((p.sgAwakeMax ?? 1) - (p.sgAwake ?? 0)) / 18);
  return 1 + (CRUSADER.awakeScale - 1) * t;
}

/** 몸 그리기를 거인화 크기로 (발 footY 기준, 강림이 아니면 그대로) */
export function giantBody(ctx: Ctx, p: PlayerState, x: number, footY: number, draw: () => void): void {
  const k = crusaderScale(p);
  if (k === 1) return draw();
  ctx.save();
  ctx.translate(x, footY);
  ctx.scale(k, k);
  ctx.translate(-x, -footY);
  draw();
  ctx.restore();
}

/** 가시 후광: 금빛 고리 + 도는 가시 */
function halo(ctx: Ctx, x: number, y: number, spin: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, 12, CR.gold, 0.5, 0.3);
    ring(ctx, x, y, 7, CR.gold, 2);
    ctx.fillStyle = CR.light;
    for (let i = 0; i < 8; i++) {
      const a = spin + (i / 8) * Math.PI * 2;
      ctx.fillRect(Math.round(x + Math.cos(a) * 10) - 1, Math.round(y + Math.sin(a) * 10) - 1, 2, 2);
    }
  });
}

export function drawCrusaderAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isCrusader(p) || s.over) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const rm = reach(p);
  // 떨어지는 십자가 · 성묘 · 여진 예고
  for (const z of p.crZones ?? []) {
    const zx = snap(z.x);
    const zy = snap(z.y);
    if (z.k === 1) {
      additive(ctx, () => glow(ctx, zx, zy - 4, z.r * 0.6, CR.gold, 0.25 + 0.1 * Math.sin(s.tick * 0.2), 0.2));
      crossSprite(ctx, zx, zy + 2, z.r / 36, Math.min(1, z.t / 30), 10);
    } else if (z.k === 0) {
      additive(ctx, () => ring(ctx, zx, zy, z.r * (1 - z.t / z.max) + 2, alpha(CR.gold, 0.5), 1));
      dust(ctx, zx, zy, z.r * 0.6, 0.3, s.tick >> 2, 4, 0.25);
    } else {
      // 심판의 십자가가 하늘에서 떨어짐: 바닥 그림자·예고 고리가 커지고, 갈수록 빨라짐
      const f = 1 - z.t / z.max;
      ctx.fillStyle = alpha(CR.dark, 0.15 + 0.35 * f);
      ctx.beginPath();
      ctx.ellipse(zx, zy, z.r * f * 0.7, z.r * f * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      additive(ctx, () => ring(ctx, zx, zy, z.r, alpha(CR.gold, 0.25 + 0.5 * f), 1));
      crossSprite(ctx, zx, zy - (1 - f) ** 2 * 200, z.r / (z.k === 2 ? 30 : 24), 0.4 + 0.6 * f);
    }
  }
  if (p.crHalo) halo(ctx, snap(p.crHalo.x), snap(p.crHalo.y), s.tick * 0.5);
  // 성벽 돌진: 발밑에서 흙먼지가 뒤로 끌림 · 앞에 금빛 방패 빛
  if (p.crRam && p.dashTicks > 0) {
    dust(ctx, x - p.dashDirX * 10, y - p.dashDirY * 10 + 2, 6, 0.4, s.tick, 4, 0.5);
    additive(ctx, () => glow(ctx, x + p.dashDirX * 12, y - 8 + p.dashDirY * 12, 14, CR.gold, 0.5, 0.3));
  }
  // 들어 올리는 중: 머리 위 금빛이 모이고, 찍을 자리에 십자 낙인 예고
  if (p.crWind && p.crWindMax) {
    const k = 1 - p.crWind / p.crWindMax;
    const tx = x + p.faceX * CRUSADER.slamFwd * rm;
    const ty = y + p.faceY * CRUSADER.slamFwd * rm;
    brand(ctx, tx, ty, p.faceX, p.faceY, CRUSADER.slamR * rm, 0.15 + 0.45 * k, 1);
    additive(ctx, () => {
      ring(ctx, tx, ty, CRUSADER.slamR * rm * (1.4 - 0.4 * k), alpha(CR.gold, 0.2 + 0.5 * k), 1);
      glow(ctx, x, y - 34 * crusaderScale(p), 6 + 12 * k, CR.gold, 0.25 + 0.5 * k, 0.4 * k);
    });
  }
  // 무게 가득: 몸에 금빛 · 강림: 금빛 기운과 올라가는 빛 알갱이
  const full = (p.crWeight ?? 0) >= CRUSADER.weightMax && !awake(p);
  if (full) additive(ctx, () => glow(ctx, x, y - 14, 18, CR.gold, 0.18 + 0.1 * Math.sin(s.tick * 0.3), 0.1));
  if (!awake(p)) return;
  additive(ctx, () => glow(ctx, x, y - 20, 34, CR.gold, 0.22 + 0.06 * Math.sin(s.tick * 0.15), 0.15));
  for (let i = 0; i < 5; i++) {
    const t = ((s.tick + i * 13) % 48) / 48;
    ctx.fillStyle = i % 2 ? CR.gold : CR.light;
    ctx.fillRect(Math.round(x - 14 + i * 7), Math.round(y - 6 - t * 40), 1, 2);
  }
}

/** 화면 왼쪽 위 "WEIGHT" 막대 (가득 차면 JUDGMENT 깜빡임) · 강림 중 DESCENT 남은 초 */
export function drawCrusaderHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  if (!isCrusader(p) || s.over) return;
  const w = p.crWeight ?? 0;
  if (w <= 0 && !awake(p)) return;
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  const full = w >= CRUSADER.weightMax;
  ctx.font = "bold 7px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1a140e";
  const label = awake(p) ? `DESCENT ${Math.ceil(p.sgAwake! / 60)}s` : full ? "JUDGMENT" : `WEIGHT ${Math.floor(w)}`;
  ctx.fillStyle = full && !awake(p) && (s.tick >> 3) % 2 ? "#ffffff" : CR.gold;
  ctx.strokeText(label, 0, 0);
  ctx.fillText(label, 0, 0);
  ctx.fillStyle = "rgba(26,20,14,0.85)";
  ctx.fillRect(0, 3, 62, 5);
  ctx.fillStyle = CR.deep;
  ctx.fillRect(1, 4, 60 * Math.min(1, w / CRUSADER.weightMax), 3);
  ctx.fillStyle = CR.light;
  ctx.fillRect(1, 4, 60 * Math.min(1, w / CRUSADER.weightMax), 1);
  ctx.restore();
}
