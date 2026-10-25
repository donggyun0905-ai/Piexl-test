// 기본 치명타 피해 숫자 (화면 전용): 굵은 숫자 · 두 겹 테두리 · 위는 희고 아래로 붉어지는 색 · 뒤로 번쩍 지나가는 날카로운 섬광과 튀는 불꽃
type Ctx = CanvasRenderingContext2D;

/** 처음 튀어나올 때 크기 · 줄어드는 틱 · 섬광이 남는 틱 */
const POP = 1.7;
const POP_TICKS = 7;
const FLASH_TICKS = 12;

/** 치명타 숫자 하나 (x, y = 숫자 가운데 아래) */
export function drawCrit(ctx: Ctx, text: string, x: number, y: number, ticks: number): void {
  // 크게 튀어나왔다가 살짝 작아졌다 제자리 (탄성)
  const t = Math.min(1, ticks / POP_TICKS);
  const pop = t < 1 ? 1 + (POP - 1) * (1 - t) * (1 - t) - 0.08 * Math.sin(t * Math.PI) : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop, pop);
  ctx.font = "900 10px sans-serif";
  const w = ctx.measureText(text).width;
  if (ticks < FLASH_TICKS) flash(ctx, w, ticks);
  ctx.lineJoin = "round";
  // 바깥 검은 테두리 → 안쪽 짙은 붉은 테두리
  ctx.strokeStyle = "#160404";
  ctx.lineWidth = 4;
  ctx.strokeText(text, 0, 0);
  ctx.strokeStyle = "#8a1a08";
  ctx.lineWidth = 1.8;
  ctx.strokeText(text, 0, 0);
  // 위는 흰 노랑 → 주황 → 붉은 아래
  const g = ctx.createLinearGradient(0, -9, 0, 0);
  g.addColorStop(0, "#fffbe8");
  g.addColorStop(0.4, "#ffd23a");
  g.addColorStop(0.75, "#ff7a1a");
  g.addColorStop(1, "#e8301a");
  ctx.fillStyle = g;
  ctx.fillText(text, 0, 0);
  // 막 나왔을 때 한 번 하얗게 번쩍
  if (ticks < 3) {
    ctx.globalAlpha *= 0.7 - ticks * 0.22;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, 0, 0);
  }
  ctx.restore();
}

/** 숫자 뒤로 비스듬히 지나가는 가는 섬광 (양끝 뾰족) · 왼쪽 위 십자 반짝임 · 튀는 불꽃 */
function flash(ctx: Ctx, w: number, ticks: number): void {
  const k = ticks / FLASH_TICKS;
  const a = ctx.globalAlpha;
  const half = w / 2 + 7;
  const grow = Math.min(1, (ticks + 1) / 3);
  // 섬광: 왼쪽 아래 → 오른쪽 위로 그어지는 마름모
  ctx.globalAlpha = a * (1 - k);
  const x0 = -half;
  const y0 = -1;
  const x1 = -half + 2 * half * grow;
  const y1 = -1 - 6 * grow;
  const nx = y0 - y1;
  const ny = x1 - x0;
  spike(ctx, x0, y0, x1, y1, 2.2 - k, nx, ny, "rgba(255, 140, 40, 0.9)");
  spike(ctx, x0, y0, x1, y1, 0.9, nx, ny, "#fffbe8");
  // 십자 반짝임 (커졌다 작아짐)
  const s = Math.sin(Math.min(1, ticks / 8) * Math.PI) * 5;
  if (s > 0.3) star(ctx, -w / 2 - 2, -9, s);
  // 불꽃 조각: 숫자 둘레에서 바깥으로 튀며 사라짐
  ctx.fillStyle = "#ffd23a";
  for (let i = 0; i < 6; i++) {
    const ang = -Math.PI / 2 + (i - 2.5) * 0.55;
    const r = 6 + ticks * 1.1;
    const px = Math.cos(ang) * (r + w / 2 * Math.abs(Math.cos(ang)));
    const py = -4 + Math.sin(ang) * r * 0.7;
    ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
  }
  ctx.globalAlpha = a;
}

/** 양끝이 뾰족한 가는 마름모 (nx, ny = 두께 방향) */
function spike(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, width: number, nx: number, ny: number, color: string): void {
  const len = Math.hypot(nx, ny) || 1;
  const ux = (nx / len) * width;
  const uy = (ny / len) * width;
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(mx + ux, my + uy);
  ctx.lineTo(x1, y1);
  ctx.lineTo(mx - ux, my - uy);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/** 네 갈래 반짝임 (가운데 x, y · 팔 길이 s) */
function star(ctx: Ctx, x: number, y: number, s: number): void {
  const t = s * 0.22;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + t, y - t);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x + t, y + t);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - t, y + t);
  ctx.lineTo(x - s, y);
  ctx.lineTo(x - t, y - t);
  ctx.closePath();
  ctx.fillStyle = "#fffbe8";
  ctx.fill();
}
