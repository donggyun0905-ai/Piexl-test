// 베아트리스 기술 효과 — 심판의 불꽃 (평소 주황 칼빛 · 태양 검날·자애 중엔 태양처럼 새빨간 붉은빛 + 금빛 테두리)
// 대각선 칼선(1·2타가 겹쳐 X자) · X자 다시 베어 터뜨림 · 강화 쌍검 칼선 · 처단 X자 · 심판 예고·심판(맵을 가르는 거대한 X자)
// 낙인 검기 발사 · 태양 검날 · 자애 발동 · 화상 불티 · 악 쌓임 · 홍염 · 처치한 적의 악이 나에게 날아옴
import type { EffectState } from "@pixel-rogue/shared";
import { additive, easeOut, glow, rnd, shock, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bladeStroke, BT, embers, featherField, rays } from "./beatriceArt";

export { BT } from "./beatriceArt";
const BT_FX = new Set(["btSlash", "btCross", "btTwin", "btExec", "btJudgeWarn", "btJudge", "btBrand", "btSolar", "btGrace", "btBurn", "btEvil", "btFlare", "btSoul", "btDance"]);

/** X자 칼선 둘 (가운데 x, y · 반 길이 r · 바라보는 각 a, 두 획은 a±45도 = 1·2타와 같은 X) · k 그어진 정도 */
export function xMark(ctx: Ctx, x: number, y: number, r: number, a: number, w: number, c: string, al: number, k = 1): void {
  for (const d of [Math.PI / 4, -Math.PI / 4]) {
    const dx = Math.cos(a + d) * r;
    const dy = Math.sin(a + d) * r;
    bladeStroke(ctx, x - dx, y - dy, x + dx, y + dy, 0, k, w, c, al);
  }
}

/** 칼선 하나: 앞부분이 그어지며 나아가고, 다 그어진 칼선은 천천히 남았다 사라짐 (그래서 1·2타가 겹쳐 X자가 보임) */
function stroke(ctx: Ctx, fx: EffectState, snap: Snap, f: number, c: string, w: number): void {
  const ax = snap(fx.x);
  const ay = snap(fx.y);
  const bx = snap(fx.toX ?? fx.x);
  const by = snap(fx.toY ?? fx.y);
  const k = easeOut(Math.min(1, f / 0.18));
  const fade = f < 0.3 ? 1 : 1 - (f - 0.3) / 0.7;
  bladeStroke(ctx, ax, ay, bx, by, 0, k, w * (1 + 0.4 * (1 - fade)), c, fade);
  if (f < 0.22) {
    const hx = ax + (bx - ax) * k;
    const hy = ay + (by - ay) * k;
    additive(ctx, () => glow(ctx, hx, hy, 10, BT.gold, 0.8 * (1 - f / 0.22), 0.6));
  }
  embers(ctx, (ax + bx) / 2, (ay + by) / 2, 8, Math.hypot(bx - ax, by - ay) * 0.8, f, ax + by, fade * 0.9);
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
    case "btSlash":
      stroke(ctx, fx, snap, f, main, sun ? 7 : 5.5);
      return true;
    case "btTwin":
      // 강화 쌍검: 붉은 칼선 + 바로 옆에 금빛 칼선 하나 더 (두 자루)
      stroke(ctx, fx, snap, f, BT.sun, 7);
      stroke(ctx, { ...fx, x: fx.x + fx.dirX * 5, y: fx.y + fx.dirY * 5, toX: (fx.toX ?? 0) + fx.dirX * 5, toY: (fx.toY ?? 0) + fx.dirY * 5 }, snap, Math.min(1, f + 0.05), BT.gold, 4);
      return true;
    case "btCross": {
      // 3타: 1·2타가 만든 X자 그대로 다시 X자로 베고 → 가운데에서 태양처럼 터짐
      const k = easeOut(Math.min(1, f / 0.2));
      xMark(ctx, x, y, r * 1.05, a, sun ? 9 : 7, main, fade, k);
      if (f > 0.18) {
        const b = (f - 0.18) / 0.82;
        additive(ctx, () => {
          glow(ctx, x, y, r * (0.5 + b * 0.9), main, 0.6 * (1 - b), 0.5);
          if (b < 0.25) glow(ctx, x, y, r * 0.7, BT.white, 0.7 * (1 - b / 0.25), 0.8);
          shock(ctx, x, y, r * (0.3 + b * 1.1), BT.gold, 0.9 * (1 - b), 3);
          shock(ctx, x, y, r * (0.2 + b * 0.8), main, 0.6 * (1 - b), 2);
        });
        embers(ctx, x, y, 16, r * 1.6, b, seed, 1 - b);
      }
      return true;
    }
    case "btExec": {
      // 처단: 적 몸 곳곳에 X자가 하나씩 박히며 터짐 (모양은 늘 X, 자리·크기만 조금씩 다름)
      const i = fx.dirX;
      const ox = (rnd(i, 3) - 0.5) * r * 0.6;
      const oy = (rnd(i, 5) - 0.5) * r * 0.6;
      const sc = 0.8 + rnd(i, 7) * 0.4;
      xMark(ctx, x + ox, y + oy, r * sc, 0, 5, i % 2 ? BT.sun : BT.evil, fade, easeOut(Math.min(1, f / 0.25)));
      additive(ctx, () => glow(ctx, x + ox, y + oy, r * 0.7, BT.sun, 0.45 * fade, 0.3));
      embers(ctx, x + ox, y + oy, 8, r, f, seed + i, fade);
      return true;
    }
    case "btJudgeWarn": {
      // 심판 예고: 하늘에서 태양빛이 모이며 화면을 가르는 가는 X자 선이 점점 짙어짐 · 발밑 둥근 성흔
      const L = 900;
      xMark(ctx, x, y, L, 0, 1.5 + f * 4, BT.sun, 0.2 + 0.5 * f);
      additive(ctx, () => {
        glow(ctx, x, y, 50 + 50 * f, BT.gold, 0.35 * f, 0.4);
        shock(ctx, x, y, 70 * (1 - f) + 18, BT.gold, 0.5 + 0.5 * f, 2);
      });
      rays(ctx, x, y, 20, 60 + 40 * f, 16, f * 2, BT.holy, 0.5 * f, 1.5);
      return true;
    }
    case "btJudge": {
      // 심판: 맵 전체를 가르는 거대한 X자 태양 검격 → 하얀 번쩍임 → 붉은 잔광 · 칼선을 따라 불티
      const L = 1000;
      const k = easeOut(Math.min(1, f / 0.15));
      xMark(ctx, x, y, L, 0, 36 * (1 - f * 0.7), BT.sun, fade, k);
      additive(ctx, () => {
        if (f < 0.25) glow(ctx, x, y, 520, BT.white, 0.55 * (1 - f / 0.25), 0.6);
        glow(ctx, x, y, 160 + 320 * f, BT.sun, 0.3 * fade);
        shock(ctx, x, y, 40 + 500 * f, BT.gold, fade, 6);
      });
      for (let i = -4; i <= 4; i++) {
        embers(ctx, x + i * 90, y + i * 90, 6, 40, f, seed + i, fade);
        embers(ctx, x + i * 90, y - i * 90, 6, 40, f, seed - i, fade);
      }
      return true;
    }
    case "btBrand": {
      // 태양의 낙인 발사: 앞으로 뿜어지는 불꽃과 빛살
      additive(ctx, () => glow(ctx, x + fx.dirX * 14, y + fx.dirY * 14, r * 1.2, BT.flame, 0.7 * fade, 0.4));
      rays(ctx, x + fx.dirX * 12, y + fx.dirY * 12, 4, r * 1.6, 10, a, BT.gold, fade, 2);
      embers(ctx, x + fx.dirX * 16, y + fx.dirY * 16, 12, r, f, seed, fade);
      return true;
    }
    case "btSolar": {
      // 태양 검날: 몸에서 붉은 태양이 피어오르고 빛살이 돌며 퍼짐
      additive(ctx, () => {
        glow(ctx, x, y, r * (0.7 + f), BT.sun, 0.65 * fade, 0.5);
        shock(ctx, x, y, r * (0.5 + f * 1.6), BT.gold, fade, 3);
      });
      rays(ctx, x, y, r * 0.4, r * (1 + f * 1.4), 14, f * 1.5, BT.gold, fade, 2);
      embers(ctx, x, y + 6, 18, r * 1.6, f, seed, fade);
      return true;
    }
    case "btGrace": {
      // 자애 발동: 하늘에서 내려오는 빛기둥 · 금빛·흰빛 고리 · 깃털이 사방으로 터져 나감
      additive(ctx, () => {
        const h = 120 * easeOut(Math.min(1, f / 0.25));
        glow(ctx, x, y - h / 2, 26 * fade + 8, BT.holy, 0.5 * fade, 0.6);
        glow(ctx, x, y, r * 1.6, BT.white, 0.6 * fade, 0.7);
        shock(ctx, x, y, r * (0.4 + f * 1.8), BT.gold, fade, 3);
        shock(ctx, x, y, r * (0.2 + f * 1.2), BT.white, fade, 2);
      });
      rays(ctx, x, y, 10, r * (1.2 + f), 20, f, BT.holy, fade, 1.5);
      featherField(ctx, x, y, r * (1 + f * 1.5), 18, f * 120, fade);
      return true;
    }
    case "btBurn":
      // 화상 불티: 적 위로 작은 불꽃이 피어오름
      embers(ctx, x, y + r * 0.8, 6, r * 1.2, f, seed, fade);
      additive(ctx, () => glow(ctx, x, y + r * 0.6, r * 0.7, BT.flame, 0.3 * fade));
      return true;
    case "btEvil":
      // 악 쌓임: 적 머리 위에서 붉은 X가 번쩍 (마크·숫자는 beatriceBody)
      xMark(ctx, x, y - f * 6, 4 + r * 0.4, 0, 2.5, BT.evil, fade);
      return true;
    case "btFlare":
      // 홍염: 화상이 가득한 적이 쓰러지며 불꽃으로 터짐
      additive(ctx, () => {
        glow(ctx, x, y, r * (0.5 + f * 0.8), BT.flame, 0.7 * fade, 0.4);
        shock(ctx, x, y, r * (0.3 + f), BT.sun, fade, 4);
      });
      embers(ctx, x, y, 16, r * 1.4, f, seed, fade);
      return true;
    case "btDance": {
      // 일식의 춤: 지나간 자리마다 검은 해를 두른 붉은 일식 고리 잔상 + 불티
      additive(ctx, () => {
        glow(ctx, x, y - 6, r * (1 + f * 0.5), BT.sun, 0.45 * fade, 0.2);
        shock(ctx, x, y - 6, r * (0.8 + f * 0.6), BT.gold, 0.8 * fade, 2);
      });
      ctx.fillStyle = `rgba(30,4,8,${0.55 * fade})`;
      ctx.beginPath();
      ctx.arc(x, y - 6, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      embers(ctx, x - fx.dirX * 6, y - fx.dirY * 6, 6, r, f, seed, fade);
      return true;
    }
    case "btSoul": {
      // 처치한 적의 악이 붉은 넋이 되어 곡선을 그리며 나에게 날아옴
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const k = easeOut(f);
      const mx = (x + tx) / 2 + (ty - y) * 0.3;
      const my = (y + ty) / 2 - Math.abs(tx - x) * 0.3 - 20;
      const at = (u: number): [number, number] => [(1 - u) ** 2 * x + 2 * (1 - u) * u * mx + u * u * tx, (1 - u) ** 2 * y + 2 * (1 - u) * u * my + u * u * ty];
      additive(ctx, () => {
        for (let i = 0; i < 6; i++) {
          const [px, py] = at(Math.max(0, k - i * 0.05));
          glow(ctx, px, py, 5 - i * 0.6 + r * 0.2, i ? BT.evil : BT.sun, (1 - i / 6) * 0.8, i ? 0 : 0.5);
        }
        if (f > 0.85) glow(ctx, tx, ty, 14, BT.sun, (1 - f) * 5, 0.4);
      });
      return true;
    }
  }
  return false;
}
