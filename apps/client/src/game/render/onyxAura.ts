// 오닉스 그리기 (2): 몸 둘레 — 비행 중 발밑 그림자·보라 추진 불꽃·뒤로 흐르는 빛 꼬리 · 광륜을 쏘는 동안 발밑 룬 고리·가슴 자수정 빛
// · 등 뒤 광륜의 보석 일곱 (반응한 보석은 잠깐 크게 번쩍)
import { isOnyx, type RunState } from "@pixel-rogue/shared";
import { GEM_COL, GEM_PALE } from "./onyxPillar";
import { additive, alpha, glow, rune, type Ctx } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

const VIO = GEM_COL[6];
/** 광륜 위 보석 자리 (몸 가운데 기준, 그림의 고리 모양: 위 홍옥 → 왼쪽 아래로 · 오른쪽 아래로) */
const SPOTS: [number, number][] = [[0, -19], [-9, -16], [-12, -9], [-11, -2], [9, -16], [12, -9], [11, -2]];

/** 몸보다 먼저: 비행 그림자·추진 불꽃 · 광륜 룬 고리 */
export function drawOnyxBack(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isOnyx(p)) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  if (p.oxFly) {
    const bob = Math.sin(s.tick * 0.15) * 1.5;
    // 떠 있는 몸 밑 넓은 그림자 + 바닥에 비친 보라 빛
    ctx.fillStyle = "rgba(10,0,20,0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y + p.r + 8, p.r * 1.1, p.r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    additive(ctx, () => {
      glow(ctx, x, y + p.r + 8, p.r * 1.6, VIO, 0.45 + 0.15 * Math.sin(s.tick * 0.3));
      // 아래로 뿜는 추진 불꽃 두 줄기 (깜빡이며 길이가 바뀜)
      for (const side of [-1, 1]) {
        const len = 10 + ((s.tick * 7 + side * 5) % 6) + bob;
        const g = ctx.createLinearGradient(0, y + 2, 0, y + 2 + len);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.35, alpha(VIO, 0.9));
        g.addColorStop(1, alpha(VIO, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x + side * 5 - 2.5, y + 2);
        ctx.lineTo(x + side * 5 + 2.5, y + 2);
        ctx.lineTo(x + side * 5, y + 2 + len);
        ctx.fill();
      }
      // 날아가는 반대쪽으로 흐르는 빛 꼬리
      for (let k = 0; k < 5; k++) {
        const u = ((s.tick * 0.08 + k / 5) % 1);
        ctx.fillStyle = alpha(k % 2 ? GEM_PALE[6] : VIO, 0.7 * (1 - u));
        ctx.fillRect(x - p.dashDirX * (8 + u * 26) + (k - 2) * 3, y - 4 - p.dashDirY * (8 + u * 26), 4 - u * 3, 1);
      }
    });
  }
  if ((p.oxCast ?? 0) > 0) rune(ctx, x, y + p.r, 16 + (p.oxCast ?? 0) * 0.2, VIO, 0.9, s.tick * 0.12);
}

/** 몸 위: 광륜 보석 일곱 · 반응한 보석 번쩍 · 쏘는 동안 가슴 빛 */
export function drawOnyxAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (!isOnyx(p)) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a)) - 4;
  const since = s.tick - (p.oxLitAt ?? -999);
  const flash = since < 24 ? 1 - since / 24 : 0;
  additive(ctx, () => {
    SPOTS.forEach(([dx, dy], k) => {
      const lit = flash > 0 && ((p.oxLit ?? 0) >> k) & 1;
      const tw = 0.25 + 0.2 * Math.sin(s.tick * 0.12 + k * 0.9);
      const gx = x + (p.faceX < 0 ? -dx : dx);
      const gy = y + dy;
      glow(ctx, gx, gy, lit ? 12 + flash * 10 : 4, GEM_COL[k]!, lit ? 0.9 * flash + 0.2 : tw, lit ? 1.6 : 0.6);
      if (lit) {
        ctx.fillStyle = `rgba(255,255,255,${flash})`;
        ctx.fillRect(gx - 7 * flash, gy - 0.5, 14 * flash, 1);
        ctx.fillRect(gx - 0.5, gy - 7 * flash, 1, 14 * flash);
      }
    });
    if ((p.oxCast ?? 0) > 0) glow(ctx, x, y - 2, 14, VIO, 0.8, 1.4);
  });
}
