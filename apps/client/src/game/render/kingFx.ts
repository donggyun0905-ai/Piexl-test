// 옛 제국의 왕(바스러져가는 왕관)·몰락한 왕 대검 효과 (sim/kingBlade, tint = 붉은빛·푸른빛)
// X자 베기 · 가로로 점점 길어지는 검기 · 내리꽂기 충격 · 적에게 이어진 불꽃 선(점화선처럼 타고 감) · 거대한 불기둥 · 영혼 빛줄기 · 변신
import type { EffectState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { additive, beam, crescent, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

export function drawKingFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("kg")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = fx.tint ?? "#ff4a2a";
  additive(ctx, () => {
    if (fx.kind === "kgSlash") {
      // X자의 한 획: 바라보는 쪽에서 비스듬히 (width ±1 = 사선 방향)
      const a = Math.atan2(fx.dirY, fx.dirX) + (fx.width ?? 1) * 0.55;
      crescent(ctx, x, y, fx.size * (0.8 + 0.3 * t), a, 1.1, 8 * (1 - t) + 2, c, 1 - t);
      crescent(ctx, x, y, fx.size * (0.7 + 0.3 * t), a, 0.9, 3 * (1 - t), "#ffffff", (1 - t) * 0.8);
      sparks(ctx, x + fx.dirX * fx.size, y + fx.dirY * fx.size, 6, 14, t, c, fx.x);
    } else if (fx.kind === "kgWave") {
      // 검기: 앞으로 뻗으며 가로(진행 방향의 옆)로 점점 넓어지는 초승달 띠
      const k = Math.min(1, t * 1.6);
      const ex = fx.x + ((fx.toX ?? fx.x) - fx.x) * k;
      const ey = fx.y + ((fx.toY ?? fx.y) - fx.y) * k;
      const nx = -fx.dirY;
      const ny = fx.dirX;
      const w = fx.size * (0.6 + 2.2 * k);
      beam(ctx, snap(ex - nx * w), snap(ey - ny * w), snap(ex + nx * w), snap(ey + ny * w), 5 * (1 - t) + 2, c, 1 - t * 0.6);
      beam(ctx, x, y, snap(ex), snap(ey), 2, c, 0.35 * (1 - t));
      glow(ctx, ex, ey, w, c, 0.4 * (1 - t), 0.6);
    } else if (fx.kind === "kgPlant") {
      // 검을 땅에 내리꽂음: 갈라지는 충격 고리 + 섬광
      shock(ctx, x, y, fx.size * (0.4 + t), c, 1 - t, 8);
      glow(ctx, x, y, 18 * (1 - t) + 6, c, 1 - t, 1);
      beam(ctx, x, y - 30 * (1 - t), x, y, 4, "#ffffff", 1 - t);
    } else if (fx.kind === "kgLine") {
      // 불꽃 선: 꽂은 자리에서 적까지 이어진 선을 불씨가 점화선처럼 타고 감
      const tx = fx.toX ?? fx.x;
      const ty = fx.toY ?? fx.y;
      beam(ctx, x, y, snap(tx), snap(ty), 1.2, c, 0.55);
      const fx0 = fx.x + (tx - fx.x) * t;
      const fy0 = fx.y + (ty - fx.y) * t;
      beam(ctx, x, y, snap(fx0), snap(fy0), 2.4, c, 0.9);
      glow(ctx, fx0, fy0, 7, c, 1, 1);
      sparks(ctx, fx0, fy0, 4, 6, (t * 5) % 1, c, fx.toX ?? 0);
    } else if (fx.kind === "kgPillar") {
      // 불기둥: 기다리는 동안 바닥 표시 → 거대한 기둥이 솟아오름
      const wait = fx.dirY;
      const age = fx.maxTicks - fx.ticks;
      if (age < wait) {
        ctx.strokeStyle = c;
        ctx.globalAlpha = 0.3 + 0.4 * (age / wait);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, fx.size, fx.size * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        return;
      }
      const k = (age - wait) / Math.max(1, fx.maxTicks - wait);
      const h = 90 * Math.min(1, k * 3);
      const w = fx.size * (1 - k * 0.5);
      const g = ctx.createLinearGradient(x, y - h, x, y);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.3, c);
      g.addColorStop(1, "#ffffff");
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = g;
      ctx.fillRect(x - w * 0.5, y - h, w, h);
      ctx.globalAlpha = 1;
      shock(ctx, x, y, fx.size * (0.6 + k), c, 1 - k, 6);
      sparks(ctx, x, y - h * 0.5, 8, 24, k, c, fx.x + fx.y);
    } else if (fx.kind === "kgSoul") {
      // 잘게 쪼개진 영혼 조각이 빛줄기를 그리며 몸으로 빨려 듦
      const tx = fx.toX ?? fx.x;
      const ty = fx.toY ?? fx.y;
      for (let i = 0; i < 5; i++) {
        const k = Math.min(1, t * 1.3 - i * 0.06);
        if (k <= 0) continue;
        const bend = Math.sin((i + 1) * 1.7) * 14 * (1 - k);
        const px = fx.x + (tx - fx.x) * k + bend;
        const py = fx.y + (ty - fx.y) * k - Math.sin(k * Math.PI) * 18;
        glow(ctx, px, py, 3.5, c, 0.9, 1);
      }
    } else if (fx.kind === "kgForm") {
      // 변신·풀림: 몸을 감싸는 빛 기둥
      glow(ctx, x, y - 20, fx.size * (1 + t), c, 1 - t, 1);
      beam(ctx, x, y - 70 * (1 - t), x, y, fx.size * 0.4, c, 1 - t);
      shock(ctx, x, y, fx.size * (0.5 + t * 1.5), c, 1 - t, 6);
    }
  });
  return true;
}
