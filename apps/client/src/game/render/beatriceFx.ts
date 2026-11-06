// 베아트리스 기술 효과 — 심판의 불꽃 (평소 주황 칼빛 · 태양 검날·자애 중엔 태양처럼 새빨간 붉은빛 + 금빛 테두리)
// 쌍검 베기 · X자 터짐 · 강화 쌍검 베기 · 처단 X자 · 심판 예고·심판(맵을 가르는 거대한 X자) · 낙인 검기 발사 · 태양 검날 · 자애 · 화상 불티 · 악 쌓임 · 홍염
import type { EffectState } from "@pixel-rogue/shared";
import { additive, beam, crescent, easeOut, glow, shock, sparks, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";

/** 색: 평소 주황 · 태양 붉은빛 · 금 · 흰 */
export const BT = { orange: "#ff9a3a", sun: "#ff2a10", flame: "#ff6a1a", gold: "#ffd24a", white: "#fff6d8", dark: "#5a0a14", evil: "#c0102a" };
const BT_FX = new Set(["btSlash", "btCross", "btTwin", "btExec", "btJudgeWarn", "btJudge", "btBrand", "btSolar", "btGrace", "btBurn", "btEvil", "btFlare"]);

/** X자 한 획씩 (가운데 x, y · 반 길이 r · 돌림 a · 굵기 w) */
export function xMark(ctx: Ctx, x: number, y: number, r: number, a: number, w: number, c: string, al: number, grow = 1): void {
  for (const d of [Math.PI / 4, -Math.PI / 4]) {
    const dx = Math.cos(a + d) * r * grow;
    const dy = Math.sin(a + d) * r * grow;
    beam(ctx, x - dx, y - dy, x + dx, y + dy, w, c, al);
  }
}

export function drawBeatriceFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!BT_FX.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const fade = f < 0.4 ? 1 : 1 - (f - 0.4) / 0.6;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const seed = fx.x * 7 + fx.y * 3;
  const r = fx.size;
  const sun = fx.tint === "sun";
  const main = sun ? BT.sun : BT.orange;
  switch (fx.kind) {
    case "btSlash": {
      // 쌍검 베기: 한쪽에서 반대쪽으로 크게 지나가는 초승달 칼빛 (태양 검날이면 붉은 태양빛 + 불티)
      const side = fx.style ?? 1;
      const arc = fx.arc ?? 1.2;
      const k = easeOut(Math.min(1, f / 0.3));
      const mid = a + side * arc * (1 - 2 * k) * 0.5;
      additive(ctx, () => {
        glow(ctx, x, y, r * 0.9, main, 0.22 * fade);
        crescent(ctx, x, y, r, mid, arc * (0.4 + 0.6 * k), 8 + (sun ? 4 : 0), main, 0.85 * fade);
        if (sun) crescent(ctx, x, y, r * 1.08, mid, arc * 0.6 * k, 3, BT.gold, 0.6 * fade);
        if (sun) sparks(ctx, x + Math.cos(mid) * r, y + Math.sin(mid) * r, 6, 14, f, BT.flame, seed, fade);
      });
      return true;
    }
    case "btCross": {
      // 3타: 생긴 X자를 다시 X자로 베어 터뜨림 (첫 X → 45도 돈 둘째 X → 둥근 폭발)
      additive(ctx, () => {
        const g1 = easeOut(Math.min(1, f / 0.25));
        xMark(ctx, x, y, r, a, 6, main, fade, g1);
        if (f > 0.15) xMark(ctx, x, y, r * 1.1, a + Math.PI / 4, 7, sun ? BT.sun : BT.flame, fade, easeOut(Math.min(1, (f - 0.15) / 0.25)));
        if (f > 0.35) {
          const b = (f - 0.35) / 0.65;
          glow(ctx, x, y, r * (0.6 + b * 0.8), main, 0.5 * (1 - b), 0.4);
          shock(ctx, x, y, r * (0.4 + b), BT.gold, 0.8 * (1 - b), 3);
          sparks(ctx, x, y, 12, r * 1.2, b, BT.gold, seed, 1 - b);
        }
      });
      return true;
    }
    case "btTwin": {
      // 강화 쌍검 베기: 두 자루가 동시에 그리는 붉은 칼빛 두 줄
      additive(ctx, () => {
        crescent(ctx, x, y, r, a + 0.25, 1.1, 7, BT.sun, fade);
        crescent(ctx, x, y, r * 0.86, a - 0.25, 1.1, 6, BT.gold, 0.8 * fade);
      });
      return true;
    }
    case "btExec": {
      // 처단: 적 몸에 X자가 하나씩 박히며 터짐 (차례마다 기울기가 다름)
      const tilt = fx.dirX * 0.37;
      additive(ctx, () => {
        xMark(ctx, x, y, r, tilt, 4, BT.sun, fade, easeOut(Math.min(1, f / 0.3)));
        glow(ctx, x, y, r * 0.8, BT.evil, 0.4 * fade, 0.3);
        sparks(ctx, x, y, 7, r * 1.3, f, BT.gold, seed + fx.dirX, fade);
      });
      return true;
    }
    case "btJudgeWarn": {
      // 심판 예고: 하늘에서 태양빛이 모이며 화면을 가르는 얇은 X자 선이 차오름
      const L = 900;
      additive(ctx, () => {
        xMark(ctx, x, y, L, 0, 2 + f * 4, BT.sun, 0.25 + 0.5 * f);
        glow(ctx, x, y, 60 + 40 * f, BT.gold, 0.3 * f, 0.4);
      });
      return true;
    }
    case "btJudge": {
      // 심판: 맵 전체를 가르는 거대한 X자 태양 검격 → 하얀 번쩍임 → 붉은 잔광
      const L = 1000;
      const k = easeOut(Math.min(1, f / 0.2));
      additive(ctx, () => {
        xMark(ctx, x, y, L, 0, 40 * (1 - f) + 6, BT.sun, fade, k);
        xMark(ctx, x, y, L, 0, 14 * (1 - f) + 2, BT.gold, fade, k);
        if (f < 0.25) glow(ctx, x, y, 500, BT.white, 0.5 * (1 - f / 0.25), 0.6);
        glow(ctx, x, y, 200 + 300 * f, BT.sun, 0.35 * fade);
      });
      return true;
    }
    case "btBrand": {
      // 태양의 낙인 발사: 앞으로 뿜어지는 불꽃
      additive(ctx, () => {
        glow(ctx, x + fx.dirX * 14, y + fx.dirY * 14, r, BT.flame, 0.6 * fade, 0.3);
        sparks(ctx, x + fx.dirX * 10, y + fx.dirY * 10, 8, r, f, BT.gold, seed, fade);
      });
      return true;
    }
    case "btSolar": {
      // 태양 검날: 몸에서 붉은 태양이 피어오름
      additive(ctx, () => {
        glow(ctx, x, y, r * (0.6 + f), BT.sun, 0.6 * fade, 0.4);
        shock(ctx, x, y, r * (0.5 + f * 1.4), BT.gold, fade, 3);
        sparks(ctx, x, y, 14, r * 1.6, f, BT.flame, seed, fade);
      });
      return true;
    }
    case "btGrace": {
      // 자애: 하얀 빛기둥과 금빛 고리 (체력 1)
      additive(ctx, () => {
        beam(ctx, x, y + 6, x, y - 90 * easeOut(Math.min(1, f / 0.3)), 10 * fade + 2, BT.gold, fade);
        shock(ctx, x, y, r * (0.4 + f), BT.white, fade, 3);
        glow(ctx, x, y, r, BT.sun, 0.5 * fade, 0.5);
      });
      return true;
    }
    case "btBurn": {
      // 화상 불티: 적 위로 작은 불꽃이 피어오름
      additive(ctx, () => {
        sparks(ctx, x, y + 4, 4, r * 0.8, f, BT.flame, seed, fade * 0.8);
        glow(ctx, x, y + r * 0.6, r * 0.6, BT.flame, 0.25 * fade);
      });
      return true;
    }
    case "btEvil": {
      // 악 쌓임: 적 머리 위 짙은 붉은 X (수가 많을수록 크게)
      additive(ctx, () => xMark(ctx, x, y - f * 6, 3 + r * 0.4, 0, 2, BT.evil, fade));
      return true;
    }
    case "btFlare": {
      // 홍염: 화상이 가득한 적이 쓰러지며 불꽃으로 터짐
      additive(ctx, () => {
        glow(ctx, x, y, r * (0.5 + f * 0.7), BT.flame, 0.6 * fade, 0.3);
        shock(ctx, x, y, r * (0.3 + f), BT.sun, fade, 4);
        sparks(ctx, x, y, 14, r * 1.3, f, BT.gold, seed, fade);
      });
      return true;
    }
  }
  return false;
}
