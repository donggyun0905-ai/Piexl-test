// 가브리엘 기술 효과 — 철옹의 방패 (황금빛 · 흰 빛 · 중력의 짙은 보라)
// 망치 휘두르기 · 대지 강타(갈라지는 땅) · 빛의 망치(사용자 그림 sprites/gabriel_fx: 하늘에서 내리꽂힘) · 방패 돌진 · 중력 붕괴 · 성벽 · 불멸의 성벽 · 가시 방패
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

/** 가브리엘 색: 금 · 밝은 빛 · 흰 빛 · 중력 보라 · 짙은 보라 · 갈라진 땅 */
export const GB = { gold: "#f2c14e", light: "#ffe68a", white: "#fff8e0", grav: "#7a4aff", deep: "#1e1040", stone: "#5a4a3a" } as const;
const GB_FX = new Set(["gbSwing", "gbSlam", "gbHammer", "gbBash", "gbWell", "gbWall", "gbUlt", "gbThorn"]);
const img = new Image();
img.src = `${import.meta.env.BASE_URL}sprites/gabriel_fx.png`;

/** 빛의 망치 그림 (아래 가운데 = 땅에 닿는 자리 x,y · h 높이 · al 투명도 · top: 위에서부터 그릴 몫, 떨어지는 동안은 땅 고리를 빼고 망치만) */
export function hammerImage(ctx: Ctx, x: number, y: number, h: number, al: number, top = 1): void {
  if (!img.complete || !img.naturalWidth || al <= 0) return;
  const sw = img.naturalWidth;
  const sh = img.naturalHeight * top;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, al);
  additive(ctx, () => ctx.drawImage(img, 0, 0, sw, sh, Math.round(x - h / 2), Math.round(y - h), Math.round(h), Math.round(h * top)));
  ctx.restore();
}

/** 갈라지는 땅: 가운데서 뻗는 금빛 금 n줄 (원근으로 납작하게) */
function cracks(ctx: Ctx, x: number, y: number, r: number, al: number, seed: number): void {
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 9; i++) {
    const t = (i / 9) * Math.PI * 2 + (seed % 7) * 0.1;
    const len = r * (0.6 + ((seed + i * 37) % 10) / 25);
    const mx = x + Math.cos(t + 0.2) * len * 0.5;
    const my = y + Math.sin(t + 0.2) * len * 0.25;
    ctx.strokeStyle = alpha(i % 2 ? GB.gold : GB.light, al);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(mx, my);
    ctx.lineTo(x + Math.cos(t) * len, y + Math.sin(t) * len * 0.5);
    ctx.stroke();
  }
}

export function drawGabrielFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!GB_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  switch (fx.kind) {
    case "gbSwing": {
      // 1타 내려찍기: 좁고 두꺼운 금빛 초승달 · 2타 휘두르기: 넓게 쓸고 지나가는 초승달
      const wide = fx.style === 1;
      const sweep = easeOut(Math.min(1, f * 3));
      additive(ctx, () => {
        crescent(ctx, x, y, r * (0.7 + 0.3 * sweep), a, wide ? 1.4 : 0.8, wide ? 8 : 11, GB.gold, fade);
        crescent(ctx, x, y, r * (0.72 + 0.3 * sweep), a, wide ? 1.2 : 0.6, 3, GB.white, fade);
        glow(ctx, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.4, GB.light, 0.4 * fade);
      });
      return true;
    }
    case "gbSlam":
      // 대지 강타: 땅이 금빛으로 갈라지고 흙먼지 고리가 두 번 퍼짐
      ctx.fillStyle = alpha(GB.stone, 0.45 * fade);
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.8, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      additive(ctx, () => {
        cracks(ctx, x, y, r, fade, seed);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.5);
        shock(ctx, 0, 0, r * (0.3 + easeOut(f)), GB.gold, fade, 6);
        shock(ctx, 0, 0, r * 0.6 * easeOut(Math.max(0, f - 0.15)), GB.light, fade * 0.8, 4);
        ctx.restore();
        sparks(ctx, x, y - 4, 10, r, f, GB.light, seed);
      });
      return true;
    case "gbHammer": {
      // 빛의 망치: 하늘에서 내리꽂힘 (dirX: 땅에 닿기까지 틱) → 땅에 박혀 번쩍이다 사라짐
      const delay = fx.dirX;
      const e = fx.maxTicks - fx.ticks;
      const h = r * 2.6;
      if (e < delay) {
        const k = e / Math.max(1, delay);
        hammerImage(ctx, x, y - h * 0.9 * (1 - k * k) + r * 0.35, h, 0.4 + 0.6 * k, 0.72);
        additive(ctx, () => glow(ctx, x, y, r * (0.4 + 0.6 * k), GB.gold, 0.35 * k));
        return true;
      }
      const g = (e - delay) / Math.max(1, fx.maxTicks - delay);
      const pop = 1 + 0.12 * Math.max(0, 1 - g * 4);
      hammerImage(ctx, x, y + r * 0.35, h * pop, g < 0.4 ? 1 : 1 - (g - 0.4) / 0.6);
      additive(ctx, () => glow(ctx, x, y, r * 1.2, GB.light, 0.7 * (1 - g), 0.8));
      return true;
    }
    case "gbBash":
      // 방패 돌진: 앞을 막는 금빛 방패 빛 (세로로 길쭉한 판) + 뒤로 흐르는 빛줄기
      additive(ctx, () => {
        const sx = x + fx.dirX * 14 * (1 + f * 6);
        const sy = y - 6 + fx.dirY * 14 * (1 + f * 6);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(a);
        ctx.fillStyle = alpha(GB.gold, 0.55 * fade);
        ctx.fillRect(-2, -r * 0.7, 5, r * 1.4);
        ctx.fillStyle = alpha(GB.white, 0.8 * fade);
        ctx.fillRect(0, -r * 0.6, 2, r * 1.2);
        ctx.restore();
        glow(ctx, sx, sy, r, GB.light, 0.5 * fade);
      });
      return true;
    case "gbWell":
      // 중력 붕괴: 짙은 보라 중력장이 안으로 말려 들고 금빛 문양이 돎
      ctx.fillStyle = alpha(GB.deep, 0.35 * fade);
      ctx.beginPath();
      ctx.ellipse(x, y, r * (1 - 0.3 * f), r * 0.5 * (1 - 0.3 * f), 0, 0, Math.PI * 2);
      ctx.fill();
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) {
          const rr = r * (1 - ((f * 2 + i / 3) % 1));
          ctx.strokeStyle = alpha(GB.grav, fade * (rr / r));
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x, y, rr, rr * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        rune(ctx, x, y, r * 0.55, GB.gold, fade, -f * 6);
        glow(ctx, x, y - 4, r * 0.4, GB.grav, 0.6 * fade);
      });
      return true;
    case "gbWall":
      // 성벽: 둘레로 금빛 성벽 고리가 솟아 퍼짐 · 방패 문양
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.5);
        shock(ctx, 0, 0, r * easeOut(f), GB.gold, fade, 10);
        ctx.restore();
        for (let i = 0; i < 12; i++) {
          const t = (i / 12) * Math.PI * 2;
          const px = x + Math.cos(t) * r * easeOut(f);
          const py = y + Math.sin(t) * r * 0.5 * easeOut(f);
          ctx.fillStyle = alpha(GB.light, 0.7 * fade);
          ctx.fillRect(px - 2, py - 10 * fade, 4, 10 * fade);
        }
        rune(ctx, x, y, 22, GB.gold, fade, f * 2);
      });
      return true;
    case "gbUlt":
      // 불멸의 성벽: 하늘에서 빛기둥 · 금빛 성역 문양이 펼쳐짐
      additive(ctx, () => {
        const w = 26 * (1 - f);
        const g = ctx.createLinearGradient(x, y - 200, x, y);
        g.addColorStop(0, alpha(GB.light, 0));
        g.addColorStop(1, alpha(GB.white, 0.8 * fade));
        ctx.fillStyle = g;
        ctx.fillRect(x - w / 2, y - 200, w, 200);
        rune(ctx, x, y, r * easeOut(Math.min(1, f * 2)), GB.gold, fade, f * 2);
        glow(ctx, x, y - 10, 40, GB.light, 0.6 * fade, 0.6);
        sparks(ctx, x, y - 10, 16, r, f, GB.gold, seed);
      });
      return true;
    case "gbThorn":
      // 가시 방패: 몸에서 금빛 가시가 사방으로 튀어나옴
      additive(ctx, () => {
        for (let i = 0; i < 10; i++) {
          const t = (i / 10) * Math.PI * 2;
          const l = r * easeOut(Math.min(1, f * 3));
          ctx.strokeStyle = alpha(i % 2 ? GB.gold : GB.white, fade);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(t) * 8, y - 6 + Math.sin(t) * 5);
          ctx.lineTo(x + Math.cos(t) * l, y - 6 + Math.sin(t) * l * 0.6);
          ctx.stroke();
        }
      });
      return true;
  }
  return false;
}
