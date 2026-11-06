// 세레나 기술 효과 — 환혹의 무희 (금빛 · 흰 빛 · 분홍 · 맹독 초록 · 에테르 하늘)
// 채찍 휘두르기(사슬 채찍이 부채꼴로 쓸고 지나감) · 환혹의 회오리(기울어진 세 회전 고리 / \ - 를 따라 비수 사슬이 돎) · 사슬 맞힘 반짝임 · 스텝 · 매혹 · 맹독 비수 · 환혹의 무도(꽃이 피며 무희처럼 도는 꽃잎 · 분홍 눈가루) · 마비 · 가시 꽃망울
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, crescent, easeOut, glow, rune, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { chainWhip, dagger, flyingChain, hash, heartAt, onTilt, petal, SN, type Pt } from "./serenaArt";

const SN_FX = new Set(["snWhipFx", "snWhirlFx", "snHitFx", "snDashFx", "snCharmFx", "snKnifeFx", "snUltFx", "snNumbFx", "snBloomFx"]);

/** 사슬 채찍 한 줄이 각 a로 뻗어 있음 (r 길이, 뒤로 bend만큼 휨) */
function whipAt(ctx: Ctx, x: number, y: number, r: number, a: number, bend: number, al: number, c: string): void {
  const tx = x + Math.cos(a) * r;
  const ty = y + Math.sin(a) * r * 0.6;
  const cx = x + Math.cos(a - bend) * r * 0.6;
  const cy = y + Math.sin(a - bend) * r * 0.36;
  chainWhip(ctx, x, y, cx, cy, tx, ty, al, c);
}

/** 회오리 고리 셋의 기울기: / (-30°) · \\ (+30°) · - (0°) */
const TILTS = [-Math.PI / 6, Math.PI / 6, 0] as const;
/** 환혹의 스텝 돌진마다: 기울기(1번 / · 2번 - · 3번 \\\\) · 사슬 색(연한 회색 · 연한 노랑 · 연한 분홍) */
export const DASH_TILT = [-Math.PI / 6, 0, Math.PI / 6] as const;
export const DASH_LINK = ["#dde0e8", "#fff2a0", "#ffc8e0"] as const;

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
      // 환혹의 회오리: 기울어진 세 고리(/ \ -)를 따라 비수 사슬이 한 바퀴씩 휘돎 · 지나간 자리에 빛 자국 · 튀는 빛
      const dir = fx.style === 1 ? -1 : 1;
      const head = easeOut(f) * Math.PI * 2.2;
      const cy = y - 6;
      TILTS.forEach((tilt, j) => {
        const start = a + (j * Math.PI * 2) / 3;
        const th = start + dir * head;
        const trail: Pt[] = [];
        for (let k = 0; k <= 20; k++) trail.push(onTilt(x, cy, r, tilt, th - dir * k * 0.11));
        additive(ctx, () => {
          ctx.lineCap = "round";
          for (const [w, c, al] of [[6, SN.pink, 0.22], [2, SN.white, 0.55]] as const) {
            ctx.strokeStyle = alpha(c, al * fade);
            ctx.lineWidth = w;
            ctx.beginPath();
            for (let k = 0; k <= 30; k++) {
              const [px, py] = onTilt(x, cy, r, tilt, th - dir * k * 0.09);
              ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.lineCap = "butt";
        });
        flyingChain(ctx, trail, fade, j === 2 ? SN.light : j ? SN.ether : SN.pink);
      });
      additive(ctx, () => sparks(ctx, x, cy, 12, r, f, SN.light, seed, fade));
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
    case "snCharmFx": {
      // 매혹: 분홍 하트 테두리가 크게 퍼지며 반짝임 · 장미 꽃잎이 소용돌이치며 날아감 · 작은 하트가 떠오름 · 발밑 분홍 물결 두 겹
      const grow = easeOut(Math.min(1, f * 1.5));
      const cy = y - 8;
      additive(ctx, () => {
        ctx.fillStyle = alpha(SN.pink, 0.1 * fade);
        ctx.beginPath();
        ctx.ellipse(x, y, r * grow, r * grow * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        shock(ctx, x, y, r * grow, SN.pink, fade * 0.8, 2);
        shock(ctx, x, y, r * 0.6 * easeOut(f), SN.rose, fade * 0.5, 2);
        // 큰 하트 테두리: 넓은 분홍 빛 + 가는 흰 선 · 테두리를 따라 도는 반짝임
        for (const [w, c, al] of [[6, SN.rose, 0.25], [3, SN.pink, 0.5], [1, SN.white, 0.9]] as const) {
          ctx.strokeStyle = alpha(c, al * fade);
          ctx.lineWidth = w;
          ctx.beginPath();
          for (let k = 0; k <= 48; k++) {
            const [hx, hy] = heartAt(x, cy, r * 0.55 * grow, (k / 48) * Math.PI * 2);
            ctx.lineTo(hx, hy);
          }
          ctx.stroke();
        }
        for (let i = 0; i < 3; i++) {
          const [sx, sy] = heartAt(x, cy, r * 0.55 * grow, f * Math.PI * 4 + (i * Math.PI * 2) / 3);
          glow(ctx, sx, sy, 5, SN.white, fade);
        }
        glow(ctx, x, cy, 16 * (1 - f) + 6, SN.pink, 0.5 * fade);
        // 소용돌이치며 퍼지는 장미 꽃잎
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2 + f * 3;
          const d = r * grow * (0.5 + 0.5 * hash(seed + i));
          petal(ctx, x + Math.cos(ang) * d, cy + Math.sin(ang) * d * 0.6, ang + f * 6, 6, 2.5, i % 2 ? SN.rose : SN.pink, 0.8 * fade);
        }
        // 떠오르는 작은 하트
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          const hx = Math.round(x + Math.cos(ang) * r * 0.4 * grow);
          const hy = Math.round(cy + Math.sin(ang) * r * 0.24 * grow - f * 18 - hash(seed + i) * 6);
          ctx.fillStyle = alpha(i % 2 ? SN.rose : SN.pink, fade);
          ctx.fillRect(hx - 2, hy, 2, 1);
          ctx.fillRect(hx + 1, hy, 2, 1);
          ctx.fillRect(hx - 2, hy + 1, 5, 1);
          ctx.fillRect(hx - 1, hy + 2, 3, 1);
          ctx.fillRect(hx, hy + 3, 1, 1);
        }
        sparks(ctx, x, cy, 14, r, f, SN.pink, seed, fade);
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
      // 환혹의 무도: 꽃이 피어나며(꽃잎 세 겹이 서로 반대로 빙글) 무희처럼 돎 · 발밑 문양 · 흩날리는 분홍 눈가루
      const open = easeOut(Math.min(1, f * 1.8));
      const spin = f * Math.PI * 1.5;
      additive(ctx, () => {
        rune(ctx, x, y, r * (0.6 + 0.4 * open), SN.pink, fade * 0.8, f * 2);
        for (let i = 0; i < 10; i++) petal(ctx, x, y - 4, spin + (i / 10) * Math.PI * 2, r * 1.1 * open, r * 0.3, SN.pink, 0.45 * fade);
        for (let i = 0; i < 8; i++) petal(ctx, x, y - 4, -spin * 1.4 + ((i + 0.5) / 8) * Math.PI * 2, r * 0.7 * open, r * 0.24, SN.white, 0.3 * fade);
        for (let i = 0; i < 6; i++) petal(ctx, x, y - 4, spin * 2 + (i / 6) * Math.PI * 2, r * 0.35 * open, r * 0.16, SN.rose, 0.6 * fade);
        glow(ctx, x, y - 10, 24 * (1 - f) + 8, SN.pink, 0.45 * fade, 0.4 * (1 - f));
        for (let i = 0; i < 60; i++) {
          const ang = hash(seed + i) * Math.PI * 2;
          const d = r * 1.4 * hash(seed + i * 3) * open;
          ctx.fillStyle = alpha(i % 3 ? SN.pink : SN.white, fade * (0.5 + 0.5 * hash(i + Math.floor(f * 20))));
          ctx.fillRect(Math.round(x + Math.cos(ang + spin * 0.3) * d), Math.round(y - 10 + Math.sin(ang + spin * 0.3) * d * 0.6 + f * 12), 1, 1);
        }
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
