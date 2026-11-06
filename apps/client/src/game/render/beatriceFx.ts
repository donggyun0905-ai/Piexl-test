// 베아트리스 기술 효과 — 심판의 불꽃 (평소 주황 칼빛 · 태양 검날·자애 중엔 태양처럼 새빨간 붉은빛 + 금빛 테두리)
// 대각선 칼선(1·2타가 겹쳐 X자) · X자 다시 베어 터뜨림 · 강화 쌍검 칼선 · 처단 X자 · 심판 예고·심판(맵을 가르는 거대한 X자)
// 낙인 검기 발사 · 태양 검날 · 자애 발동 · 화상 불티 · 악 쌓임 · 홍염 · 처치한 적의 악이 나에게 날아옴
import type { EffectState } from "@pixel-rogue/shared";
import { additive, crescent, easeOut, glow, glowEdge, rnd, shock, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { bladeStroke, BT, embers, featherField, rays } from "./beatriceArt";

export { BT } from "./beatriceArt";
const BT_FX = new Set(["btSlash", "btCross", "btTwin", "btExec", "btJudgeWarn", "btJudge", "btBrand", "btSolar", "btGrace", "btBurn", "btEvil", "btFlare", "btSoul", "btDance", "btSwirl", "btNeedle"]);

/** X자 칼선 둘 (가운데 x, y · 반 길이 r · 바라보는 각 a, 두 획은 a±45도 = 1·2타와 같은 X) · k 그어진 정도 */
export function xMark(ctx: Ctx, x: number, y: number, r: number, a: number, w: number, c: string, al: number, k = 1): void {
  for (const d of [Math.PI / 4, -Math.PI / 4]) {
    const dx = Math.cos(a + d) * r;
    const dy = Math.sin(a + d) * r;
    bladeStroke(ctx, x - dx, y - dy, x + dx, y + dy, 0, k, w, c, al);
  }
}

/** 칼빛 색: 평소 주황 · 태양 검날(1번)·자애 중 빨강 (바깥 · 안쪽 · 빛) */
const SLASH = { orange: ["#ffb060", "#ff7a1a", "#ffd0a0"], red: ["#ff5a3a", "#e81a1a", "#ffb0a0"] } as const;

/** 파수꾼 검격(baseFx.drawSwing)과 같은 초승달 칼빛을 (ax,ay)→(bx,by) 대각선 위에: 앞쪽(fwd)으로 휘어 쓸고 지나감 · g 휘두른 정도 · t 남은 정도(1→0) */
export function arcSlash(ctx: Ctx, ax: number, ay: number, bx: number, by: number, fwdX: number, fwdY: number, g: number, t: number, red: boolean): void {
  const half = 0.7;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let nx = -(by - ay) / len;
  let ny = (bx - ax) / len;
  if (nx * fwdX + ny * fwdY < 0) [nx, ny] = [-nx, -ny];
  const R = len / 2 / Math.sin(half);
  const d = R * Math.cos(half);
  const cx = (ax + bx) / 2 - nx * d;
  const cy = (ay + by) / 2 - ny * d;
  let aA = Math.atan2(ay - cy, ax - cx);
  let aB = Math.atan2(by - cy, bx - cx);
  if (aB - aA > Math.PI) aB -= Math.PI * 2;
  if (aA - aB > Math.PI) aA -= Math.PI * 2;
  const cur = aA + (aB - aA) * g;
  const mid = (aA + cur) / 2;
  const arc = Math.abs(cur - aA) / 2;
  if (arc < 0.02) return;
  const [c0, c1, c2] = red ? SLASH.red : SLASH.orange;
  const am = Math.atan2(ny, nx);
  additive(ctx, () => {
    crescent(ctx, cx, cy, R, mid, arc, 5 * t + 1, c0, t);
    crescent(ctx, cx, cy, R * 0.82, mid, arc * 0.85, 3 * t, c1, t * 0.5);
    glow(ctx, cx + Math.cos(am) * R * 0.7, cy + Math.sin(am) * R * 0.7, len * 0.35, c2, t * 0.5);
  });
}

/** 방랑객 칼선처럼 빛 테두리를 두른 선·호 (색 c · 굵기 w) */
function edgeLine(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function edgeArc(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), a0, a1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}

/** 칼선 하나: 초승달이 빠르게 쓸고 지나간 뒤 천천히 옅어짐 (그래서 1·2타가 겹쳐 X자가 보임) */
function stroke(ctx: Ctx, fx: EffectState, snap: Snap, f: number, red: boolean): void {
  arcSlash(ctx, snap(fx.x), snap(fx.y), snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y), fx.dirX, fx.dirY, Math.min(1, f * 10), 1 - f, red);
}

/** 가운데 (x, y)에 초승달 둘로 X자 (a 바라보는 쪽 · r 반 길이) */
function crescentX(ctx: Ctx, x: number, y: number, a: number, r: number, f: number, red: boolean): void {
  for (const d of [Math.PI / 4, -Math.PI / 4]) {
    const dx = Math.cos(a + d) * r;
    const dy = Math.sin(a + d) * r;
    arcSlash(ctx, x - dx, y - dy, x + dx, y + dy, Math.cos(a), Math.sin(a), Math.min(1, f * 10), 1 - f, red);
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
  switch (fx.kind) {
    case "btSlash":
      stroke(ctx, fx, snap, f, sun);
      return true;
    case "btTwin":
      // 강화 쌍검: 같은 칼빛 둘 (두 자루, 빨강)
      stroke(ctx, fx, snap, f, true);
      stroke(ctx, { ...fx, x: fx.x + fx.dirX * 5, y: fx.y + fx.dirY * 5, toX: (fx.toX ?? 0) + fx.dirX * 5, toY: (fx.toY ?? 0) + fx.dirY * 5 }, snap, Math.min(1, f + 0.05), true);
      return true;
    case "btCross":
      // 3타: 1·2타가 만든 X자를 같은 칼빛 둘로 다시 벰
      crescentX(ctx, x, y, a, r * 0.75, f, sun);
      return true;
    case "btExec": {
      // 처단: 기본 공격과 같은 칼빛 X자가 적 몸 곳곳에 하나씩 (자리·크기만 조금씩 다름)
      const i = fx.dirX;
      crescentX(ctx, x + (rnd(i, 3) - 0.5) * r * 0.6, y + (rnd(i, 5) - 0.5) * r * 0.6, 0, r * (0.8 + rnd(i, 7) * 0.4), f, sun);
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
      // 일식의 춤: 지나간 자리에 옅은 주황 빛 꼬리와 불티만 (둘레 칼빛이 잘 보이게)
      additive(ctx, () => glow(ctx, x, y - 6, r * (1 + f * 0.5), BT.flame, 0.25 * fade, 0.2));
      embers(ctx, x - fx.dirX * 6, y - fx.dirY * 6, 4, r, f, seed, fade * 0.8);
      return true;
    }
    case "btSwirl": {
      // 일식의 춤: 무희가 돌며 베고 지나간 둘레 곳곳에 작은 초승달 칼빛이 휙 그어짐 (흰 칼빛 + 주황/빨강 번짐)
      const [, c1] = sun ? SLASH.red : SLASH.orange;
      ctx.globalAlpha = 1 - f;
      edgeArc(ctx, x, y, r, a, a + 0.6 + f * 1.6, "#ffffff", 2 * (1 - f) + 0.6);
      ctx.globalAlpha = (1 - f) * 0.5;
      edgeArc(ctx, x, y, r - 2, a, a + 0.4 + f * 1.6, c1, 2);
      ctx.globalAlpha = 1;
      return true;
    }
    case "btNeedle": {
      // 일식의 춤에 베인 적: 몸에 바늘처럼 가는 일직선 칼선이 한순간 쭉 (양끝 뾰족한 흰빛 + 주황/빨강 번짐)
      const [c0] = sun ? SLASH.red : SLASH.orange;
      const len = Math.hypot(fx.dirX, fx.dirY) || 1;
      const ux = fx.dirX / len;
      const uy = fx.dirY / len;
      const L = r * 1.4 * Math.min(1, f * 5);
      const w = 1.6 * (1 - f);
      ctx.globalAlpha = (1 - f) * 0.5;
      edgeLine(ctx, x - ux * L, y - uy * L, x + ux * L, y + uy * L, c0, 2.5 * (1 - f) + 0.5);
      ctx.globalAlpha = 1 - f * 0.8;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(x - ux * L, y - uy * L);
      ctx.lineTo(x - uy * w, y + ux * w);
      ctx.lineTo(x + ux * L, y + uy * L);
      ctx.lineTo(x + uy * w, y - ux * w);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
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
