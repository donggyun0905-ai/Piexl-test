// 라파엘 그리기 (몸 둘레). 몸 뒤: 폭풍 화살비가 떨어질 자리(좁혀 드는 하늘색 고리·과녁)
// 몸 위: 표적이 된 적(돌아가는 붉은 금빛 조준선) · 에테르 스코프 중 눈앞의 푸른 렌즈·조준선 · 천공의 빛 화살을 모으는 동안 활끝에 모이는 빛과 쏠 방향 예고선
import { isRafael, RAFAEL, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, type Ctx } from "./pwFxBits";
import { RF } from "./rafaelFx";

/** 과녁 조준선: 둘레 고리 + 네 방향 눈금 (돌아감) */
function reticle(ctx: Ctx, x: number, y: number, r: number, spin: number, c: string, al: number): void {
  ring(ctx, x, y, r, alpha(c, al), 1);
  ctx.strokeStyle = alpha(c, al);
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3));
    ctx.lineTo(x + Math.cos(a) * (r + 4), y + Math.sin(a) * (r + 4));
    ctx.stroke();
  }
}

/** 몸 뒤 */
export function drawRafaelBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isRafael(p) || s.over) return;
  for (const st of p.rfStorms ?? []) {
    const x = snap(st.x);
    const y = snap(st.y);
    ctx.fillStyle = alpha(RF.storm, 0.12);
    ctx.beginPath();
    ctx.ellipse(x, y, st.r, st.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    additive(ctx, () => {
      ctx.strokeStyle = alpha(RF.sky, 0.7);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, st.r, st.r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, st.r * 0.5, st.r * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

/** 몸 위 */
export function drawRafaelAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isRafael(p) || s.over) return;
  const bx = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  for (const id of p.rfMarks ?? []) {
    const e = s.enemies.find((o) => o.id === id && o.hp > 0);
    if (!e) continue;
    const x = snap(lerp(e.prevX, e.x, a0));
    const y = snap(lerp(e.prevY, e.y, a0)) - e.r * 0.5;
    additive(ctx, () => reticle(ctx, x, y, e.r + 6 + Math.sin(s.tick * 0.15), s.tick * 0.04, RF.red, 0.85));
    ctx.fillStyle = RF.gold;
    ctx.fillRect(x - 1, y - e.r - 12, 3, 3);
  }
  if ((p.rfScope ?? 0) > 0) {
    // 에테르 스코프: 눈앞의 푸른 렌즈 · 앞으로 뻗은 옅은 조준선
    const lx = bx + p.faceX * 8;
    const ly = by - 12 + p.faceY * 4;
    additive(ctx, () => {
      glow(ctx, lx, ly, 6, RF.ether, 0.7, 0.5);
      ctx.strokeStyle = alpha(RF.ether, 0.25);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + p.faceX * 160, ly + p.faceY * 160);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }
  if ((p.rfCharge ?? 0) > 0) {
    // 천공의 빛 화살 모으기: 활끝에 빛이 모이고 쏠 방향으로 깜빡이는 예고선
    const k = 1 - p.rfCharge! / RAFAEL.ultCharge;
    const aim = p.rfAim ?? { x: p.faceX, y: p.faceY };
    const hx = bx + aim.x * 10;
    const hy = by - 10 + aim.y * 6;
    additive(ctx, () => {
      glow(ctx, hx, hy, 6 + k * 18, RF.light, 0.5 + k * 0.5, k);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + s.tick * 0.2;
        const d = 30 * (1 - k) + 4;
        ctx.fillStyle = alpha(RF.white, 0.8);
        ctx.fillRect(Math.round(hx + Math.cos(a) * d), Math.round(hy + Math.sin(a) * d * 0.6), 1, 1);
      }
      ctx.strokeStyle = alpha(RF.light, (s.tick >> 2) % 2 ? 0.5 : 0.25);
      ctx.lineWidth = 2 + k * 6;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + aim.x * 400, hy + aim.y * 400);
      ctx.stroke();
    });
  }
}
