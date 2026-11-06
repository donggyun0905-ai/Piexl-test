// 세레나 기술 효과 — 환혹의 무희 (금빛 · 흰 빛 · 분홍 · 맹독 초록 · 에테르 하늘)
// 채찍 휘두르기(사슬 채찍이 부채꼴로 쓸고 지나감) · 환혹의 회오리(여러 사슬 채찍이 둘레를 크게 휘저음) · 사슬 맞힘 반짝임 · 스텝 · 가시 정원 · 맹독 비수 · 환혹의 무도 · 마비 · 가시 꽃망울
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { chainWhip, dagger, SN } from "./serenaArt";

const SN_FX = new Set(["snWhipFx", "snWhirlFx", "snHitFx", "snDashFx", "snFieldFx", "snKnifeFx", "snUltFx", "snNumbFx", "snBloomFx"]);

/** 사슬 채찍 한 줄이 각 a로 뻗어 있음 (r 길이, 뒤로 bend만큼 휨) */
function whipAt(ctx: Ctx, x: number, y: number, r: number, a: number, bend: number, al: number, c: string): void {
  const tx = x + Math.cos(a) * r;
  const ty = y + Math.sin(a) * r * 0.6;
  const cx = x + Math.cos(a - bend) * r * 0.6;
  const cy = y + Math.sin(a - bend) * r * 0.36;
  chainWhip(ctx, x, y, cx, cy, tx, ty, al, c);
}

export function drawSerenaFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!SN_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const seed = Math.abs(Math.round(fx.x * 7 + fx.y * 3));
  switch (fx.kind) {
    case "snWhipFx": {
      // 채찍 휘두르기: 사슬 채찍이 한쪽에서 반대쪽으로 넓게 쓸고 지나감 · 지나간 자리에 초승달 빛
      const dir = fx.style === 1 ? -1 : 1;
      const sweep = easeOut(Math.min(1, f * 2.2));
      const now = a + dir * (-1.5 + 3 * sweep);
      additive(ctx, () => {
        crescent(ctx, x, y, r * 0.95, a, 1.5 * sweep, 6, SN.gold, fade * 0.8);
        crescent(ctx, x, y, r * 0.97, a, 1.3 * sweep, 2, SN.white, fade * 0.7);
      });
      whipAt(ctx, x, y, r, now, dir * 0.6, fade, SN.light);
      return true;
    }
    case "snWhirlFx": {
      // 환혹의 회오리: 여러 사슬 채찍이 둘레를 한 바퀴 휘저음 · 붉은 금빛 소용돌이 고리 · 튀는 빛
      const dir = fx.style === 1 ? -1 : 1;
      const spin = easeOut(f) * Math.PI * 2 * dir;
      additive(ctx, () => {
        ctx.fillStyle = alpha(SN.rose, 0.12 * fade);
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(1, 0.6);
          crescent(ctx, 0, 0, r * (0.75 + i * 0.07), a + spin + (i * Math.PI) / 2, 0.9, 7, i % 2 ? SN.gold : SN.pink, fade * 0.85);
          ctx.restore();
        }
        sparks(ctx, x, y, 10, r, f, SN.light, seed, fade);
      });
      for (let i = 0; i < 5; i++) whipAt(ctx, x, y - 6, r, a + spin + (i / 5) * Math.PI * 2, dir * 0.7, fade * 0.9, i % 2 ? SN.ether : SN.light);
      return true;
    }
    case "snHitFx": {
      // 사슬 맞힘: 금빛·흰 빛 십자 반짝임 (빛 피해)
      const k = 1 - f;
      additive(ctx, () => {
        ctx.fillStyle = alpha(SN.white, k);
        ctx.fillRect(x - 4 * k, y - 4, 8 * k, 1);
        ctx.fillRect(x, y - 4 - 4 * k, 1, 8 * k);
        glow(ctx, x, y - 4, 6 * k + 2, SN.light, 0.6 * k);
      });
      return true;
    }
    case "snDashFx": {
      // 환혹의 스텝: 시작 자리에 흩어지는 분홍 꽃잎과 빛 고리
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.5 + f), SN.pink, fade * 0.7, 2);
        sparks(ctx, x, y - 6, 8, r * 1.5, f, SN.pink, seed, fade);
      });
      return true;
    }
    case "snFieldFx": {
      // 가시 정원을 흩뿌림: 퍼져 나가는 금빛 고리 · 빛의 가시 조각
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f), SN.gold, fade, 3);
        sparks(ctx, x, y, 14, r, f, SN.light, seed, fade);
      });
      return true;
    }
    case "snKnifeFx": {
      // 맹독 비수: 부채꼴로 날아가는 에테르 비수 · 맹독 초록 꼬리
      const n = Math.max(1, fx.style ?? 7);
      const d = r * easeOut(Math.min(1, f * 1.6));
      for (let i = 0; i < n; i++) {
        const ang = a + (n === 1 ? 0 : (i / (n - 1) - 0.5) * 1.6);
        const tx = x + Math.cos(ang) * d;
        const ty = y + Math.sin(ang) * d * 0.6;
        additive(ctx, () => {
          ctx.strokeStyle = alpha(SN.venom, 0.5 * fade);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(ang) * d * 0.5, y + Math.sin(ang) * d * 0.3);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        });
        dagger(ctx, tx, ty, Math.atan2(Math.sin(ang) * 0.6, Math.cos(ang)), 9, fade, SN.venom);
      }
      return true;
    }
    case "snUltFx": {
      // 환혹의 무도: 발밑 문양 · 분홍 빛 기둥 · 퍼지는 꽃잎
      additive(ctx, () => {
        rune(ctx, x, y, r * (0.6 + 0.4 * easeOut(f)), SN.pink, fade, f * 2);
        rune(ctx, x, y, r * 0.5, SN.gold, fade * 0.7, -f * 3);
        glow(ctx, x, y - 10, 30 * (1 - f) + 10, SN.pink, 0.6 * fade, 1 - f);
        sparks(ctx, x, y - 8, 18, r * 1.2, f, SN.pink, seed, fade);
      });
      return true;
    }
    case "snNumbFx": {
      // 마비: 분홍 고리가 조여 듦
      additive(ctx, () => shock(ctx, x, y - 4, r * (1.4 - f), SN.pink, fade, 2));
      return true;
    }
    case "snBloomFx": {
      // 가시 꽃망울: 장미빛으로 터지며 가시 조각이 흩어짐
      additive(ctx, () => {
        glow(ctx, x, y - 4, r * 0.5 * (1 - f) + 6, SN.rose, 0.7 * fade, 0.5);
        shock(ctx, x, y, r * easeOut(f), SN.rose, fade, 3);
        sparks(ctx, x, y - 4, 16, r, f, SN.gold, seed, fade);
      });
      return true;
    }
  }
  return false;
}
