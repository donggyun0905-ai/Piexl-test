// 이안 기술 효과 — 침묵의 서기관 (금빛 펜끝 · 보랏빛 인과의 실 · 잉크 그림자)
// 펜 찌르기 · 실 휘감기 · 급소 · 기록 · 속박 · 인과의 실 발사 · 그림자 걸음 잔상·찌르기 · 기록 집행 '執' · 인과율 속박 · 인과 되돌림
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

/** 이안 색: 잉크 보라 · 짙은 보라 · 금 펜끝 · 종이 흰빛 · 붉은 급소 */
export const IA = { ink: "#b89aff", violet: "#6a4aff", gold: "#f2c14e", paper: "#fff6e0", red: "#ff4a6a", dark: "#1a1030" } as const;
const IA_FX = new Set(["iaThrust", "iaWhip", "iaVital", "iaRec", "iaBind", "iaThread", "iaStep", "iaStab", "iaWrit", "iaLaw", "iaRebound"]);

/** 가늘고 빛나는 선 (바깥 c · 흰 속) */
export function threadLine(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number, al: number): void {
  ctx.lineCap = "round";
  ctx.strokeStyle = alpha(c, al * 0.5);
  ctx.lineWidth = w + 2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.strokeStyle = alpha(c, al);
  ctx.lineWidth = w;
  ctx.stroke();
  ctx.strokeStyle = `rgba(255,255,255,${al * 0.8})`;
  ctx.lineWidth = Math.max(0.5, w * 0.4);
  ctx.stroke();
  ctx.lineCap = "butt";
}

/** 한자 글자 (빛나는 테두리) */
function glyph(ctx: Ctx, ch: string, x: number, y: number, size: number, c: string, al: number): void {
  ctx.save();
  ctx.globalAlpha = al;
  ctx.font = `bold ${Math.round(size)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 3;
  ctx.strokeStyle = IA.dark;
  ctx.strokeText(ch, x, y);
  ctx.fillStyle = c;
  ctx.fillText(ch, x, y);
  ctx.restore();
}

export function drawIanFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!IA_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = fx.x * 7 + fx.y * 3;
  switch (fx.kind) {
    case "iaThrust": {
      // 펜 찌르기: 금빛 펜끝이 앞으로 쭉 뻗고 뒤에 잉크 자국 · 끝에서 반짝
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y) + (fx.style ?? 0) * 2;
      const k = Math.min(1, f * 6);
      const ex = x + (tx - x) * k;
      const ey = y + (ty - y) * k;
      additive(ctx, () => {
        threadLine(ctx, x, y, ex, ey, IA.violet, 3 * fade, fade * 0.6);
        threadLine(ctx, x + (ex - x) * 0.3, y + (ey - y) * 0.3, ex, ey, IA.gold, 1.5, fade);
        glow(ctx, ex, ey, 7, IA.gold, fade, 0.6);
      });
      return true;
    }
    case "iaWhip": {
      // 실 휘감기: 보랏빛 강철 실 세 가닥이 앞 부채꼴을 한쪽에서 다른 쪽으로 휘감음
      const sweep = easeOut(Math.min(1, f * 2.5));
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) {
          const rr = r * (0.55 + i * 0.2);
          const a0 = a - 1.2;
          const a1 = a0 + 2.4 * sweep;
          ctx.strokeStyle = alpha(i === 1 ? IA.gold : IA.ink, fade * (1 - i * 0.15));
          ctx.lineWidth = i === 1 ? 1 : 1.5;
          ctx.beginPath();
          ctx.ellipse(x, y, rr, rr * 0.7, 0, a0 + i * 0.15, a1 + i * 0.15);
          ctx.stroke();
        }
        glow(ctx, x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.45, r * 0.5, IA.violet, 0.35 * fade);
      });
      return true;
    }
    case "iaVital":
      // 급소: 붉은 십자 별이 번쩍 + 찌른 방향으로 가는 선
      additive(ctx, () => {
        const s = r * (0.5 + 0.5 * easeOut(f));
        threadLine(ctx, x - fx.dirX * s, y - fx.dirY * s, x + fx.dirX * s, y + fx.dirY * s, IA.red, 1.5, fade);
        threadLine(ctx, x - fx.dirY * s * 0.4, y + fx.dirX * s * 0.4, x + fx.dirY * s * 0.4, y - fx.dirX * s * 0.4, IA.paper, 1, fade);
        glow(ctx, x, y, r * 0.6, IA.red, 0.6 * fade, 0.5);
        sparks(ctx, x, y, 5, r, f, IA.gold, seed);
      });
      return true;
    case "iaRec":
      // 기록: 작은 잉크 획이 위로 떠오름
      ctx.fillStyle = alpha(IA.ink, fade);
      ctx.fillRect(x - 2, Math.round(y - f * 6), 4, 1);
      ctx.fillRect(x, Math.round(y - f * 6) - 2, 1, 4);
      return true;
    case "iaBind":
      // 속박: 실 고리가 바깥에서 몸으로 조여 듦 · 금빛 매듭
      additive(ctx, () => {
        for (let i = 0; i < 3; i++) {
          const rr = r + 4 + (1 - easeOut(f)) * (14 + i * 6);
          ctx.strokeStyle = alpha(i === 1 ? IA.gold : IA.ink, fade);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(x, y - 2 + (i - 1) * 4, rr, rr * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        glow(ctx, x, y - 2, r, IA.violet, 0.4 * fade);
      });
      return true;
    case "iaThread":
      // 인과의 실 발사: 펜끝에서 보랏빛이 번쩍
      additive(ctx, () => {
        glow(ctx, x + fx.dirX * 10, y - 4 + fx.dirY * 10, r, IA.ink, fade, 0.5);
        shock(ctx, x + fx.dirX * 10, y - 4 + fx.dirY * 10, 4 + f * r, IA.violet, fade, 2);
      });
      return true;
    case "iaStep":
      // 그림자 걸음: 짙은 보라 그림자 잔상이 남았다가 흩어짐
      ctx.fillStyle = alpha(IA.dark, 0.55 * (1 - f));
      ctx.beginPath();
      ctx.ellipse(x, y - 8, 7, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      additive(ctx, () => glow(ctx, x, y - 8, 10, IA.violet, 0.3 * (1 - f)));
      return true;
    case "iaStab":
      // 그림자 찌르기: 지나간 적 몸에 가는 일직선
      additive(ctx, () => threadLine(ctx, x - fx.dirX * r, y - 3 - fx.dirY * r, x + fx.dirX * r, y - 3 + fx.dirY * r, IA.ink, 1, fade));
      return true;
    case "iaWrit": {
      // 기록 집행: 기록 수만큼 잉크 점이 모여 '執' 글자가 새겨졌다가 터짐
      const pop = 1 + Math.max(0, f - 0.6) * 1.2;
      additive(ctx, () => {
        glow(ctx, x, y - 4, 14 * pop, IA.gold, 0.7 * fade, f > 0.6 ? 0.8 : 0);
        shock(ctx, x, y - 4, 8 + f * 16, IA.ink, fade, 2);
      });
      glyph(ctx, "執", x, y - 4 - f * 6, 13 * pop, IA.gold, fade);
      return true;
    }
    case "iaLaw":
      // 인과율 속박: 발밑에 금빛 문양 · 사방으로 뻗는 실 열여섯 가닥
      additive(ctx, () => {
        const R = 40 + easeOut(f) * 260;
        for (let i = 0; i < 16; i++) {
          const t = (i / 16) * Math.PI * 2;
          threadLine(ctx, x, y - 4, x + Math.cos(t) * R, y - 4 + Math.sin(t) * R * 0.6, i % 2 ? IA.ink : IA.gold, 1, fade * 0.8);
        }
        rune(ctx, x, y, 34 + f * 20, IA.gold, fade, f * 3);
        glow(ctx, x, y - 6, 30, IA.violet, 0.5 * fade, 0.3);
      });
      glyph(ctx, "律", x, y - 34 - f * 8, 16, IA.paper, fade);
      return true;
    case "iaRebound":
      // 인과 되돌림: 몸에서 금·보라 고리가 터지며 '因' 글자
      additive(ctx, () => {
        glow(ctx, x, y - 4, r, IA.gold, 0.8 * fade, 0.6);
        shock(ctx, x, y - 4, r * (0.4 + easeOut(f)), IA.ink, fade, 3);
        sparks(ctx, x, y - 4, 8, r * 1.4, f, IA.gold, seed);
      });
      glyph(ctx, "因", x, y - r - 6, 12, IA.gold, fade);
      return true;
  }
  return false;
}
