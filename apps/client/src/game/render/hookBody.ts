// 훅 그리기 (몸 둘레). 몸 뒤: 튕겨 날아가는 적 뒤 물살 꼬리 · 몸 위: 밧줄 + 빛 갈고리(나감·감아 옴·밧줄 타기) · 쏠 때 품에서 꺼낸 더블배럴 산탄총
import { HOOK, isHook, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, type Ctx } from "./pwFxBits";
import { HK_AQUA, HK_FOAM, hookShape, rope, shotgun } from "./hookArt";

/** 몸 뒤: 튕겨 날아가는 적 뒤로 물살 꼬리 */
export function drawHookBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isHook(p) || s.over) return;
  for (const w of p.hkSlides ?? []) {
    const e = s.enemies.find((o) => o.id === w.id);
    if (!e) continue;
    const x = snap(e.x);
    const y = snap(e.y);
    additive(ctx, () => {
      const g = ctx.createLinearGradient(x, y, x - w.vx * 6, y - w.vy * 6);
      g.addColorStop(0, alpha(HK_AQUA, 0.6));
      g.addColorStop(1, alpha(HK_AQUA, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = e.r * 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - w.vx * 6, y - w.vy * 6);
      ctx.stroke();
      ctx.lineCap = "butt";
    });
  }
}

/** 적 머리 위 약화 스택: 아주 작은 빛 갈고리 (스택 수만큼) */
function drawMarks(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const e of s.enemies) {
    const n = e.hp > 0 ? (e.hkMark ?? 0) : 0;
    if (n <= 0) continue;
    const y = snap(e.y) - e.r - 9;
    for (let i = 0; i < n; i++) hookShape(ctx, snap(e.x) + (i - (n - 1) / 2) * 5, y, -Math.PI / 2, 0.32, n >= HOOK.markMax ? 1 : 0.8);
  }
}

/** 몸 위: 갈고리·밧줄 · 산탄총 · 적 약화 스택 */
export function drawHookAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isHook(p) || s.over) return;
  drawMarks(ctx, s, snap);
  const px = snap(lerp(p.prevX, p.x, a0));
  const py = snap(lerp(p.prevY, p.y, a0)) - 4;
  const h = p.hkHook;
  if (h && h.k <= 2) {
    const hx = snap(h.x);
    const hy = snap(h.y);
    rope(ctx, px + p.faceX * 4, py, hx, hy, s.tick);
    // 나갈 때는 빙글 돌며 날아가고, 걸리면 앞을 향함
    const spin = h.k === 0 && h.caught.length === 0 ? s.tick * 0.5 : 0;
    const dir = h.k === 1 ? Math.atan2(py - hy, px - hx) + Math.PI : Math.atan2(h.dy, h.dx);
    hookShape(ctx, hx, hy, dir + spin, 1.5, 1);
  }
  if (h && h.k >= 3) {
    // 보스에게 끌려가는 중 / 튕겨 돌아오는 중: 몸 둘레 물빛 바람
    additive(ctx, () => {
      ctx.strokeStyle = alpha(HK_FOAM, 0.6);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(px, py, 10 + i * 4, s.tick * 0.3 + i, s.tick * 0.3 + i + 1.4);
        ctx.stroke();
      }
    });
  }
  const since = s.tick - (p.hkShot ?? -99);
  if (since < 16 || (h && h.k === 1)) shotgun(ctx, px + p.faceX * 6, py + 3, Math.atan2(p.faceY, p.faceX), since < 6 ? 1 - since / 6 : 0);
}
