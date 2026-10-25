// 테라코어 시즌 2 그리기 (셋째): 펑크 네온 베기·모노와이어·맨티스·고릴라 주먹·회오리·해킹 줄·EMP·네온 총알
// 신경 가속: 켜질 때 퍼지는 고리 · 지나온 자리에 분홍·하늘빛 잔상 · 둘레가 보랏빛으로 물듦 · 옆의 게이지
import { punkAccel, punkGauge, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const PINK = "#ff4ad8";
const CYAN = "#4af0ff";
const WHITE = "#ffffff";

/** 탄: 네온 총알 */
export function drawTerraShotC(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "cyBullet") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  ctx.strokeStyle = PINK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - (pr.vx / len) * 6, y - (pr.vy / len) * 6);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = WHITE;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  return true;
}

/** 네온 호 (가운데 a, 폭 w) 두 겹 */
function arc(ctx: Ctx, x: number, y: number, r: number, a: number, w: number, c: string): void {
  for (const [lw, col] of [[4, c], [1, WHITE]] as const) {
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(x, y, r, a - w, a + w);
    ctx.stroke();
  }
}

/** 효과: 베기·줄·주먹·회오리·해킹·EMP·신경 가속 */
export function drawTerraFxC(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y) - 4;
  const a = Math.atan2(fx.dirY, fx.dirX);
  ctx.globalAlpha = (1 - t) * (fx.width ? 0.5 : 1);
  switch (fx.kind) {
    case "cySlash":
      arc(ctx, x, y, fx.size * (0.6 + t * 0.4), a + (t - 0.5) * 1.2, 0.9, PINK);
      break;
    case "cyMantis":
      arc(ctx, x, y, fx.size * 0.8, a - 0.9 + t, 0.6, PINK);
      arc(ctx, x, y, fx.size * 0.8, a + 0.9 - t, 0.6, CYAN);
      break;
    case "cyWire": {
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const k = (i / 12) * Math.min(1, t * 3);
        const off = Math.sin(i * 1.4 + t * 10) * 3 * (1 - k);
        ctx.lineTo(x + fx.dirX * fx.size * k - fx.dirY * off, y + fx.dirY * fx.size * k + fx.dirX * off);
      }
      ctx.stroke();
      break;
    }
    case "cyPunch":
      ctx.fillStyle = "#c8d0e0";
      ctx.beginPath();
      ctx.arc(x + fx.dirX * fx.size * 0.6, y + fx.dirY * fx.size * 0.6, 5 * (1 - t) + 2, 0, Math.PI * 2);
      ctx.fill();
      arc(ctx, x, y, fx.size * (0.5 + t * 0.6), a, 0.6, PINK);
      break;
    case "cySpin":
      for (let i = 0; i < 2; i++) arc(ctx, x, y, fx.size * 0.8, t * 9 + i * Math.PI, 0.7, i ? CYAN : PINK);
      break;
    case "cyHack": {
      // 머리 위에서 적에게 꺾이며 이어지는 데이터 줄
      const tx = fx.toX ?? x;
      const ty = (fx.toY ?? y) - 4;
      ctx.strokeStyle = t % 0.2 < 0.1 ? CYAN : PINK;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - 4);
      for (let i = 1; i <= 5; i++) ctx.lineTo(lerp(x, tx, i / 5) + (i % 2 ? 3 : -3), lerp(y - 4, ty, i / 5));
      ctx.stroke();
      ctx.fillStyle = CYAN;
      ctx.fillRect(Math.round(tx) - 2, Math.round(ty) - 8, 5, 3);
      break;
    }
    case "cyEmp":
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + 4, fx.size * t, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const b = i * 0.8 + t * 4;
        ctx.fillStyle = i % 2 ? WHITE : CYAN;
        ctx.fillRect(Math.round(x + Math.cos(b) * fx.size * t * 0.8), Math.round(y + 4 + Math.sin(b) * fx.size * t * 0.8), 1, 2);
      }
      break;
    case "cyAccel":
      ctx.strokeStyle = PINK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * t, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * t * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      break;
    default:
      ctx.globalAlpha = 1;
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 몸 둘레: 날아가는 EMP · 신경 가속 잔상·보랏빛 둘레 · 옆의 게이지 */
export function drawTerraAuraC(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const g of p.cyEmp ?? []) {
    const k = 1 - g.t / 24;
    const gx = snap(lerp(g.sx, g.x, k));
    const gy = snap(lerp(g.sy, g.y, k) - Math.sin(k * Math.PI) * 18);
    ctx.fillStyle = "#2a2438";
    ctx.fillRect(gx - 2, gy - 2, 4, 4);
    ctx.fillStyle = s.tick % 4 < 2 ? CYAN : WHITE;
    ctx.fillRect(gx - 1, gy - 1, 2, 2);
  }
  if (p.characterId !== "punk") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  if (punkAccel(p)) {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#a84aff";
    ctx.beginPath();
    ctx.arc(x, y, 90, 0, Math.PI * 2);
    ctx.fill();
    for (const [i, q] of (p.cyTrail ?? []).entries()) {
      ctx.globalAlpha = 0.15 + i * 0.06;
      drawCharacter(ctx, "punk", snap(q.x), snap(q.y), p.r, { faceX: p.faceX, faceY: p.faceY, moving: true, casting: false, step: i });
    }
    ctx.globalAlpha = 1;
  }
  // 오른쪽 옆 세로 게이지 (가득이면 분홍·하늘빛으로 깜빡: 대시하면 켜짐)
  const g = punkAccel(p) ? 1 : punkGauge(p);
  ctx.fillStyle = "rgba(10,10,20,0.7)";
  ctx.fillRect(x + 12, y - 14, 3, 18);
  ctx.fillStyle = g >= 1 && s.tick % 10 < 5 ? CYAN : PINK;
  const h = Math.round(16 * g);
  ctx.fillRect(x + 13, y + 3 - h, 1, h);
}
