// 실버불렛 그리기 (몸 둘레, 몸 위): 적 체력 줄 위 은탄 마크(은탄 ×개수) · 날아가는 은탄(은빛 꼬리, 연사·활 탄은 더 밝게) · 날아가는 성수병(포물선)
// 은빛 활 일제 사격 중 몸 앞 커다란 흰 장식 초승달 활 ) (사용자 그림 sprites/silverBullet_bow ← scripts/art/silverBullet_bow.py · 시위 빛) · 연사 중 두 손 총구 빛 · 달빛 각성 흰 기운
import { isSilverBullet, SILVER_BULLET, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { lazyImg } from "../lazyImage";

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

const BOW = lazyImg(`${import.meta.env.BASE_URL}sprites/silverBullet_bow.png`);
/** 활 세로 반 길이 (계산의 SILVER_BULLET.ultSide와 같게: 양끝 유도탄이 활 끝에서 나감) · 몸에서 앞으로 */
const BOW_HALF = SILVER_BULLET.ultSide;
const BOW_FWD = 14;

/** 은빛 활 ) (사용자 그림 sprites/silverBullet_bow): 바라보는 쪽 앞에 크게 · 처음엔 펼쳐지며 커짐 · 숨 쉬듯 빛남 · 가운데 시위 빛 */
function bow(ctx: Ctx, x: number, y: number, fx: number, fy: number, t: number, left: number): void {
  const a = Math.atan2(fy, fx);
  const cx = x + fx * BOW_FWD;
  const cy = y - 4 + fy * BOW_FWD;
  const open = Math.min(1, (SILVER_BULLET.ultTicks - left) / 10 + 0.3);
  const pulse = 0.8 + 0.2 * Math.sin(t * 0.5);
  const h = BOW_HALF * 2 * open;
  additive(ctx, () => {
    glow(ctx, cx, cy, BOW_HALF * 1.4, SB.moon, 0.22 * pulse, 0.4);
    glow(ctx, cx + fx * 6, cy + fy * 6, 9, "#ffffff", 0.45 * pulse, 0.7);
  });
  if (BOW.complete && BOW.naturalWidth > 0) {
    const w = (BOW.naturalWidth / BOW.naturalHeight) * h;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.drawImage(BOW, -w * 0.55, -h / 2, w, h);
    // 빛 번짐: 한 번 더 더하기로 (조금 크게)
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.35 * pulse;
    ctx.drawImage(BOW, -w * 0.6, -h * 0.53, w * 1.1, h * 1.06);
    ctx.restore();
  }
  // 시위: 양끝에서 가운데 뒤로 모이는 가는 빛
  const ux = -fy;
  const uy = fx;
  ctx.strokeStyle = alpha(SB.moon, 0.55 * pulse);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + ux * h * 0.48 - fx * 6, cy + uy * h * 0.48 - fy * 6);
  ctx.lineTo(cx - fx * 12, cy - fy * 12);
  ctx.lineTo(cx - ux * h * 0.48 - fx * 6, cy - uy * h * 0.48 - fy * 6);
  ctx.stroke();
}

/** 은탄: 옅은 빛 꼬리 · 은빛 몸 · 금빛 탄피 끝 · 앞 끝 흰 점 (연사·활 탄은 더 길고 빛남) */
function bullet(ctx: Ctx, bx: number, by: number, dx: number, dy: number, k: number): void {
  const bright = k >= 3;
  const tail = bright ? 20 : 13;
  const tc = k === 5 ? SB.moon : k === 3 ? "#ffffff" : SB.silver;
  additive(ctx, () => {
    const g = ctx.createLinearGradient(bx - dx * tail, by - dy * tail, bx, by);
    g.addColorStop(0, alpha(tc, 0));
    g.addColorStop(1, alpha(tc, bright ? 0.75 : 0.5));
    ctx.strokeStyle = g;
    ctx.lineWidth = bright ? 3 : 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(bx - dx * tail, by - dy * tail);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.lineCap = "butt";
    glow(ctx, bx, by, bright ? 6 : 4, k === 5 ? SB.moon : "#ffffff", bright ? 0.5 : 0.3);
  });
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(Math.atan2(dy, dx));
  ctx.fillStyle = SB.gold;
  ctx.fillRect(-4, -1, 2, 2);
  ctx.fillStyle = SB.silver;
  ctx.fillRect(-2, -1, 3, 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(1, -0.5, 1.5, 1);
  ctx.restore();
}

export function drawSilverBulletAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isSilverBullet(p) || s.over) return;
  for (const e of s.enemies) if ((e.sbMarks ?? 0) > 0 && e.hp > 0) mark(ctx, snap(e.x) + 1, snap(e.y) - e.r - 9, e.sbMarks!, e.sbMarks! >= 25);
  for (const b of p.sbShots ?? []) {
    const sp = Math.hypot(b.vx, b.vy) || 1;
    bullet(ctx, snap(b.x), snap(b.y), b.vx / sp, b.vy / sp, b.k);
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
  if (p.sbUlt) bow(ctx, x, y, p.faceX, p.faceY, s.tick, p.sbUlt);
  if (p.sbBarrage) additive(ctx, () => glow(ctx, x + p.faceX * 8, y - 4 + p.faceY * 8, 7, "#ffffff", 0.3 + 0.2 * Math.sin(s.tick * 0.9)));
  if ((p.sgAwake ?? 0) > 0) additive(ctx, () => glow(ctx, x, y - 8, 18, SB.moon, 0.18 + 0.06 * Math.sin(s.tick * 0.2)));
}
