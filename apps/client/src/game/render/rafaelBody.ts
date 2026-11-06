// 라파엘 그리기 (몸 둘레). 몸 뒤: 폭풍 화살비 자리(옅은 폭풍 그림자·테두리)
// 몸 위: 화살비 위 소용돌이치는 폭풍 구름과 끊임없이 사선으로 쏟아지는 빛의 화살 · 표적이 된 적(돌아가는 꺾쇠 조준선·붉은 마름모) · 에테르 스코프 중 눈앞의 푸른 렌즈·조준선 · 천공의 빛 화살을 모으는 동안 활끝에 모이는 빛과 쏠 방향 예고선
import { isRafael, RAFAEL, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, type Ctx } from "./pwFxBits";
import { hash, lightArrow, RF } from "./rafaelArt";

/** 과녁 조준선: 숨 쉬는 얇은 고리 + 돌아가는 네 꺾쇠 */
function reticle(ctx: Ctx, x: number, y: number, r: number, spin: number, c: string, al: number): void {
  ring(ctx, x, y, r, alpha(c, al * 0.4), 1);
  ctx.strokeStyle = alpha(c, al);
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.arc(x, y, r + 3, a - 0.35, a + 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 1), y + Math.sin(a) * (r + 1));
    ctx.lineTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6));
    ctx.stroke();
  }
}

/** 폭풍 구름과 비: 자리 위 하늘에서 소용돌이치는 짙은 구름 · 쏟아지기 시작하면 끊임없이 사선 빛의 화살 */
function stormCloud(ctx: Ctx, x: number, y: number, r: number, t: number, rain: boolean): void {
  const cy = y - 70;
  additive(ctx, () => {
    for (let i = 0; i < 9; i++) {
      const ang = t * 0.03 + (i / 9) * Math.PI * 2;
      const d = r * (0.35 + 0.35 * hash(i * 7));
      ctx.fillStyle = alpha(i % 2 ? RF.storm : RF.deep, 0.35);
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(ang) * d, cy + Math.sin(ang) * d * 0.3, r * 0.45, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = alpha(RF.sky, 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, cy, r * 0.9, r * 0.28, 0, t * 0.05, t * 0.05 + 4);
    ctx.stroke();
  });
  if (!rain) return;
  for (let i = 0; i < 10; i++) {
    const life = 18;
    const cyc = Math.floor((t + i * 7) / life);
    const u = ((t + i * 7) % life) / life;
    const sd = i * 31 + cyc * 17;
    const ang = hash(sd) * Math.PI * 2;
    const d = Math.sqrt(hash(sd + 1)) * r;
    const gx = x + Math.cos(ang) * d;
    const gy = y + Math.sin(ang) * d * 0.55;
    const hx = gx + 22 * (1 - u);
    const hy = gy - 80 * (1 - u);
    lightArrow(ctx, hx, hy, Math.atan2(80, -22), 8, 0.9, 0.85);
  }
}

/** 몸 뒤 */
export function drawRafaelBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isRafael(p) || s.over) return;
  for (const st of p.rfStorms ?? []) {
    const x = snap(st.x);
    const y = snap(st.y);
    const g = ctx.createRadialGradient(x, y, 0, x, y, st.r);
    g.addColorStop(0, alpha(RF.deep, 0.35));
    g.addColorStop(1, alpha(RF.deep, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, st.r, st.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    additive(ctx, () => {
      ctx.strokeStyle = alpha(RF.sky, 0.45);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -s.tick * 0.5;
      ctx.beginPath();
      ctx.ellipse(x, y, st.r, st.r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }
}

/** 몸 위 */
export function drawRafaelAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isRafael(p) || s.over) return;
  const bx = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  for (const st of p.rfStorms ?? []) stormCloud(ctx, snap(st.x), snap(st.y), st.r, s.tick, !!st.rain);
  for (const id of p.rfMarks ?? []) {
    const e = s.enemies.find((o) => o.id === id && o.hp > 0);
    if (!e) continue;
    const x = snap(lerp(e.prevX, e.x, a0));
    const y = snap(lerp(e.prevY, e.y, a0)) - e.r * 0.5;
    additive(ctx, () => reticle(ctx, x, y, e.r + 5 + Math.sin(s.tick * 0.15) * 1.5, s.tick * 0.04, RF.red, 0.85));
    // 머리 위 붉은 마름모 (위아래로 살짝)
    const my = y - e.r - 14 + ((s.tick >> 4) % 2);
    ctx.fillStyle = RF.red;
    ctx.beginPath();
    ctx.moveTo(x, my - 3);
    ctx.lineTo(x + 2, my);
    ctx.lineTo(x, my + 3);
    ctx.lineTo(x - 2, my);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = RF.white;
    ctx.fillRect(x, my - 1, 1, 1);
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
