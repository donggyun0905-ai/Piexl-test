// 진영 특징 그리기 (로그만): 효과 — 물결 콤보 물보라 · 타락 폭주 붉은 폭발 · 과열 배출 증기 폭발 · 과부하 연기 · 맹세 지킴(푸른 방패 문장)·깨짐(붉은 금) · 정령 자람 · 정령 탄 · 핵심 스킬 각성 금빛 · 금빛 빛기둥
// 몸 둘레 — 비르디아 정령(싹·꽃·나무 정령 픽셀 그림) · 폭주 중 붉은 기운 · 열이 높으면 주황 아지랑이 · 콤보 높으면 물결 고리
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";

const SEA = "#6ad4ff";
const RED = "#ff2a3a";
const HEAT = "#ff8a2a";
const BLUE = "#6aa0ff";
const LEAF = "#6ae07a";
const GOLD = "#ffd84a";

/** 정령 픽셀 그림 (단계별: 1 짙은 초록 · 2 밝은 초록 · 3 꽃잎 · 4 줄기·나무) */
const SPIRIT = [
  ["00200", "02120", "00400", "00400"],
  ["03330", "33233", "03330", "00400", "02420"],
  ["0222220", "2211122", "2214122", "0224220", "0044400", "0444440", "4404044"],
];
const SP_COL: Record<string, string> = { "1": "#2a8a3a", "2": LEAF, "3": "#ff9ad8", "4": "#8a5a2a" };

/** 한 칸 = 2px */
function sprite(ctx: Ctx, rows: string[], x: number, y: number): void {
  const w = rows[0]!.length;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < w; c++) {
      const v = rows[r]![c]!;
      if (v === "0") continue;
      ctx.fillStyle = SP_COL[v]!;
      ctx.fillRect(Math.round(x + (c - w / 2) * 2), Math.round(y + (r - rows.length / 2) * 2), 2, 2);
    }
  }
}

/** 몸 둘레 (forgotten.drawAuras에서) */
export function drawFactionBody(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (s.over || s.pvp) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  const t = s.tick;
  if (p.fcSpX !== undefined && p.fcSpY !== undefined) {
    const st = (p.fcSpKills ?? 0) >= 80 ? 2 : (p.fcSpKills ?? 0) >= 30 ? 1 : 0;
    const sx = snap(p.fcSpX);
    const sy = snap(p.fcSpY + Math.sin(t * 0.08) * 2);
    additive(ctx, () => glow(ctx, sx, sy, 12 + st * 4, LEAF, 0.35, 0.3));
    sprite(ctx, SPIRIT[st]!, sx, sy);
  }
  if ((p.fcRampage ?? 0) > 0) {
    additive(ctx, () => {
      glow(ctx, x, y - 6, 26, RED, 0.45 + 0.15 * Math.sin(t * 0.3), 0.2);
      sparks(ctx, x, y - 6, 6, 18, (t % 20) / 20, RED, Math.floor(t / 20), 0.8);
    });
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

const FX = new Set(["fcTideUp", "fcRampage", "fcVent", "fcOverload", "fcOathKept", "fcOathBroken", "fcSpGrow", "fcSpHit", "fcCoreOn", "fcCorePillar"]);

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
      case "fcCoreOn":
        shock(ctx, x, y, fx.size * easeOut(f), GOLD, fade, 6);
        sparks(ctx, x, y - 6, 14, fx.size, f, GOLD, 11);
        break;
      case "fcCorePillar":
        shock(ctx, x, y, fx.size * easeOut(f), GOLD, fade, 8);
        beam(ctx, x, y - 120 * (1 - f * 0.3), x, y, 10 * fade + 2, GOLD, fade);
        glow(ctx, x, y, fx.size * 0.7, GOLD, 0.6 * fade, 0.8);
        break;
    }
  });
  return true;
}
