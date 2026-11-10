// 루나틱 그리기 (몸 위): 월광 표적 (적 머리 위 은빛 조준점: 도는 고리 · 십자 눈금 · 가운데 초승달, 사라지기 전 깜빡임) · 만월 각성 중 모든 적 머리 위 옅은 조준점
// 날아가는 월광 검기 (초승달 칼빛) · 곧 터질 달빛 베기 자리 (조여드는 흰 고리) · 떨어지는 초승달 비 · 만월 각성 몸 둘레 달빛
// 이펙트 그림: sprites/lunatic_thrust·lunatic_slash ← scripts/art/lunatic_fx.py (render/lunaticFx)
import { isLunatic, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, crescent, glow, type Ctx } from "./pwFxBits";

export const LN = { white: "#ffffff", moon: "#cfd8ff", blue: "#7a8aff", deep: "#3a3ad8", gold: "#f0d070", dark: "#10142a" };

/** 조준점: 도는 고리 · 십자 눈금 넷 · 가운데 작은 초승달 (al 투명도 · r 반지름) */
export function crosshair(ctx: Ctx, x: number, y: number, r: number, t: number, al: number): void {
  const spin = t * 0.06;
  additive(ctx, () => {
    glow(ctx, x, y, r + 4, LN.blue, 0.25 * al);
    ctx.strokeStyle = alpha(LN.moon, al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, spin, spin + Math.PI * 1.6);
    ctx.stroke();
    ctx.strokeStyle = alpha(LN.white, al);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = -spin + (i * Math.PI) / 2;
      ctx.moveTo(x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2));
      ctx.lineTo(x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3));
    }
    ctx.stroke();
    crescent(ctx, x, y, r * 0.45, -Math.PI / 4, 1.2, r * 0.25, LN.moon, al);
  });
}

export function drawLunaticAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isLunatic(p) || s.over) return;
  const awake = (p.sgAwake ?? 0) > 0;
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const m = e.lnMark ?? 0;
    const blink = m > 0 && m < 50 && Math.floor(s.tick / 4) % 2 === 0;
    if (m > 0 && !blink) crosshair(ctx, snap(e.x), snap(e.y) - e.r - 9, 6, s.tick, 0.95);
    else if (awake && m <= 0) crosshair(ctx, snap(e.x), snap(e.y) - e.r - 9, 5, s.tick, 0.35);
  }
  for (const w of p.lnWaves ?? []) {
    const a = Math.atan2(w.vy, w.vx);
    additive(ctx, () => {
      glow(ctx, snap(w.x), snap(w.y), 9, LN.blue, 0.45);
      crescent(ctx, snap(w.x), snap(w.y), 8, a, 1.1, 4, LN.moon, 0.9);
    });
  }
  for (const b of p.lnStrikes ?? []) {
    if (b.k === 0) {
      const e = s.enemies.find((f) => f.id === b.tg);
      const [x, y] = e ? [snap(e.x), snap(e.y)] : [snap(b.x), snap(b.y)];
      additive(ctx, () => glow(ctx, x, y, b.r * 0.6, LN.white, 0.4));
    } else if (b.k === 1) {
      // 초승달 비: 위에서 비스듬히 떨어짐
      const f = Math.max(0, 1 - b.t / 14);
      const x = snap(lerp(b.x0, b.x, f));
      const y = snap(lerp(b.y - 40, b.y, f));
      additive(ctx, () => crescent(ctx, x, y, 5, Math.PI / 2, 1.2, 3, LN.moon, 0.9));
    }
  }
  if (!awake) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  additive(ctx, () => glow(ctx, x, y - 8, 20, LN.moon, 0.18 + 0.06 * Math.sin(s.tick * 0.2)));
}
