// 가브리엘 그림 공용 (코드로 그림): 거대한 빛의 망치 (궁극기 중 휘두르기에 함께 나감) · 빛나는 타일 방패 (방패 돌진)
// 모양은 금빛으로 또렷하게, 둘레 빛만 더해 그림 (다 더하면 하얗게 타서 모양이 안 보임)
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

const GOLD = "#f2c14e";
const DEEP = "#b07a1a";
const LIGHT = "#ffe68a";
const WHITE = "#fff8e0";

/** 빛의 망치 (자루 끝 x,y · a 뻗는 방향 · R 길이 · al 투명도): 빛 자루 + 끝에 가로로 놓인 큰 망치 머리 + 가운데 별 */
export function lightHammer(ctx: Ctx, x: number, y: number, a: number, R: number, al: number): void {
  if (al <= 0) return;
  const cx = R * 0.86;
  const hw = R * 0.14;
  const hh = R * 0.28;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  additive(ctx, () => glow(ctx, cx, 0, R * 0.5, GOLD, 0.6 * al));
  ctx.globalAlpha *= al;
  // 자루
  ctx.fillStyle = DEEP;
  ctx.fillRect(R * 0.15, -2, cx - R * 0.15, 4);
  ctx.fillStyle = LIGHT;
  ctx.fillRect(R * 0.15, -1, cx - R * 0.15, 1);
  // 망치 머리: 금 테두리 · 밝은 판 · 양 끝 띠 · 가운데 별
  ctx.fillStyle = DEEP;
  ctx.fillRect(cx - hw - 1, -hh - 1, hw * 2 + 2, hh * 2 + 2);
  ctx.fillStyle = GOLD;
  ctx.fillRect(cx - hw, -hh, hw * 2, hh * 2);
  ctx.fillStyle = LIGHT;
  ctx.fillRect(cx - hw + 2, -hh + 3, hw * 2 - 4, hh * 2 - 6);
  ctx.fillStyle = DEEP;
  ctx.fillRect(cx - hw, -hh + 3, hw * 2, 1);
  ctx.fillRect(cx - hw, hh - 4, hw * 2, 1);
  ctx.fillStyle = WHITE;
  ctx.fillRect(cx - 1, -hh * 0.45, 2, hh * 0.9);
  ctx.fillRect(cx - hw * 0.6, -1, hw * 1.2, 2);
  ctx.restore();
}

/** 빛나는 타일 방패 (가운데 x,y · a 앞 방향 · h 높이 · al 투명도): 앞을 향해 세운 방패 · 금 테두리 · 타일 줄 · 가운데 별빛 */
export function lightShield(ctx: Ctx, x: number, y: number, a: number, h: number, al: number): void {
  if (al <= 0) return;
  const w = h * 0.42;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  additive(ctx, () => glow(ctx, w * 0.6, 0, h, LIGHT, 0.7 * al));
  ctx.globalAlpha *= al;
  // 방패 판 (앞으로 볼록한 육각 타일)
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, -h / 2);
  ctx.lineTo(w * 0.4, -h / 2);
  ctx.lineTo(w, -h * 0.15);
  ctx.lineTo(w, h * 0.15);
  ctx.lineTo(w * 0.4, h / 2);
  ctx.lineTo(-w * 0.3, h / 2);
  ctx.closePath();
  ctx.fillStyle = alpha(LIGHT, 0.75);
  ctx.fill();
  ctx.strokeStyle = DEEP;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // 타일 줄
  ctx.strokeStyle = alpha(DEEP, 0.8);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const t of [-0.25, 0, 0.25]) {
    ctx.moveTo(-w * 0.25, h * t);
    ctx.lineTo(w * 0.9, h * t);
  }
  ctx.moveTo(w * 0.3, -h * 0.47);
  ctx.lineTo(w * 0.3, h * 0.47);
  ctx.stroke();
  ctx.restore();
  // 가운데 별빛
  additive(ctx, () => glow(ctx, x + Math.cos(a) * w * 0.3, y + Math.sin(a) * w * 0.3, w * 0.35, WHITE, 0.8 * al, 1));
}
