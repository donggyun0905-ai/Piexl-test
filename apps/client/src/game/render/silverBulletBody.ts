// 실버불렛 그리기 (몸 둘레, 몸 위): 적 체력 줄 위 은탄 마크(은탄 ×개수) · 날아가는 은탄(은빛 꼬리, 연사·활 탄은 더 밝게) · 날아가는 성수병(포물선)
// 은빛 활 일제 사격 중 몸 앞 흰 활 ) (바라보는 쪽 · 시위 빛) · 연사 중 두 손 총구 빛 · 달빛 각성 흰 기운
import { isSilverBullet, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

export const SB = { silver: "#d8e0ec", light: "#f4f8ff", holy: "#8ad0ff", moon: "#cfe0ff", gold: "#e8c860", dark: "#1a1e28" };

/** 은탄 마크: 작은 은탄 그림 + ×개수 */
function mark(ctx: Ctx, x: number, y: number, n: number, need: boolean): void {
  ctx.fillStyle = SB.gold;
  ctx.fillRect(x - 6, y - 1, 2, 3);
  ctx.fillStyle = need ? SB.light : SB.silver;
  ctx.fillRect(x - 4, y - 1, 3, 3);
  ctx.fillRect(x - 1, y, 1, 1);
  ctx.font = "bold 6px monospace";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 2;
  ctx.strokeStyle = SB.dark;
  ctx.strokeText(`×${n}`, x + 1, y + 1);
  ctx.fillStyle = need ? "#ffffff" : SB.silver;
  ctx.fillText(`×${n}`, x + 1, y + 1);
}

/** 흰 활 ): 바라보는 쪽 앞에 휘어진 활대 · 양끝 빛 · 가운데 시위 빛 */
function bow(ctx: Ctx, x: number, y: number, fx: number, fy: number, t: number): void {
  const a = Math.atan2(fy, fx);
  const cx = x + fx * 8;
  const cy = y - 4 + fy * 8;
  const pulse = 0.75 + 0.25 * Math.sin(t * 0.6);
  additive(ctx, () => {
    ctx.strokeStyle = alpha("#ffffff", 0.35 * pulse);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, a - 1.1, a + 1.1);
    ctx.stroke();
    glow(ctx, cx + fx * 14, cy + fy * 14, 10, SB.moon, 0.35 * pulse, 0.5);
    for (const s of [-1, 1]) glow(ctx, cx + Math.cos(a + s * 1.1) * 14, cy + Math.sin(a + s * 1.1) * 14, 6, "#ffffff", 0.5 * pulse);
  });
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, a - 1.1, a + 1.1);
  ctx.stroke();
  // 시위 (양끝을 잇는 가는 선)
  ctx.strokeStyle = alpha(SB.moon, 0.7);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(a - 1.1) * 14, cy + Math.sin(a - 1.1) * 14);
  ctx.lineTo(cx + fx * 4, cy + fy * 4);
  ctx.lineTo(cx + Math.cos(a + 1.1) * 14, cy + Math.sin(a + 1.1) * 14);
  ctx.stroke();
}

export function drawSilverBulletAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isSilverBullet(p) || s.over) return;
  for (const e of s.enemies) if ((e.sbMarks ?? 0) > 0 && e.hp > 0) mark(ctx, snap(e.x) + 1, snap(e.y) - e.r - 9, e.sbMarks!, e.sbMarks! >= 25);
  for (const b of p.sbShots ?? []) {
    const sp = Math.hypot(b.vx, b.vy) || 1;
    const [dx, dy] = [b.vx / sp, b.vy / sp];
    const bright = b.k >= 3;
    const tail = bright ? 16 : 11;
    additive(ctx, () => {
      ctx.strokeStyle = alpha(b.k === 5 ? SB.moon : "#ffffff", bright ? 0.6 : 0.4);
      ctx.lineWidth = bright ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(snap(b.x - dx * tail), snap(b.y - dy * tail));
      ctx.lineTo(snap(b.x), snap(b.y));
      ctx.stroke();
      if (bright) glow(ctx, b.x, b.y, 4, SB.moon, 0.4);
    });
    ctx.fillStyle = SB.light;
    ctx.fillRect(snap(b.x) - 1, snap(b.y) - 1, 2, 2);
  }
  for (const b of p.sbBombs ?? []) {
    const f = 1 - b.t / b.T;
    const x = snap(lerp(b.x0, b.x, f));
    const y = snap(lerp(b.y0, b.y, f) - Math.sin(f * Math.PI) * 18);
    ctx.fillStyle = SB.holy;
    ctx.fillRect(x - 2, y - 2, 4, 5);
    ctx.fillStyle = SB.light;
    ctx.fillRect(x - 1, y - 4, 2, 2);
    additive(ctx, () => glow(ctx, x, y, 6, SB.holy, 0.4));
  }
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0));
  if (p.sbUlt) bow(ctx, x, y, p.faceX, p.faceY, s.tick);
  if (p.sbBarrage) additive(ctx, () => glow(ctx, x + p.faceX * 8, y - 4 + p.faceY * 8, 7, "#ffffff", 0.3 + 0.2 * Math.sin(s.tick * 0.9)));
  if ((p.sgAwake ?? 0) > 0) additive(ctx, () => glow(ctx, x, y - 8, 18, SB.moon, 0.18 + 0.06 * Math.sin(s.tick * 0.2)));
}
