// 네온 펄스(한정 스킨) 피해 숫자: 보통은 청록 글자 + 분홍으로 살짝 어긋난 그림자(색 갈라짐) · 치명타는 글리치로 떨리는 큰 숫자 + 스캔 테두리 (화면 전용)
import { CHROME, CYAN, NIGHT, PINK, VOLT } from "./cyberFx";

type Ctx = CanvasRenderingContext2D;

/** 치명타 둘레: 모서리 꺾쇠 네 개가 모였다 퍼짐 + 가로 스캔 줄 */
function drawScan(ctx: Ctx, age: number): void {
  const fade = Math.max(0, 1 - Math.max(0, age - 14) / 14);
  const r = 14 - Math.min(6, age);
  const a0 = ctx.globalAlpha;
  ctx.globalAlpha = a0 * fade;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1;
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    ctx.beginPath();
    ctx.moveTo(sx * r, sy * r * 0.6 - sy * 3);
    ctx.lineTo(sx * r, sy * r * 0.6);
    ctx.lineTo(sx * r - sx * 4, sy * r * 0.6);
    ctx.stroke();
  }
  ctx.fillStyle = PINK;
  ctx.fillRect(-r, -r * 0.6 + ((age * 2) % (r * 1.2)), r * 2, 1);
  ctx.globalAlpha = a0;
}

/** 피해 숫자 (네온 펄스) */
export function drawCyberNumber(ctx: Ctx, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = crit ? Math.max(1.3, 2.1 - age * 0.12) : 1;
  // 치명타는 처음 몇 틱 동안 옆으로 떨림
  const jit = crit && age < 8 ? ((age * 5) % 3) - 1 : 0;
  ctx.save();
  ctx.translate(x + jit, y);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  if (crit) {
    ctx.save();
    ctx.translate(0, -4);
    drawScan(ctx, age);
    ctx.restore();
  }
  ctx.scale(pop, pop);
  ctx.font = crit ? "900 9px monospace" : "bold 6px monospace";
  ctx.lineJoin = "round";
  ctx.lineWidth = crit ? 3 : 2.5;
  ctx.strokeStyle = NIGHT;
  ctx.strokeText(text, 0, 0);
  // 색 갈라짐: 분홍이 왼쪽, 청록이 오른쪽으로 살짝
  ctx.fillStyle = PINK;
  ctx.fillText(text, -0.7, 0);
  ctx.fillStyle = crit ? VOLT : CYAN;
  ctx.fillText(text, 0.7, 0);
  ctx.fillStyle = crit ? CHROME : CYAN;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
