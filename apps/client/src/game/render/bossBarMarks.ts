// 보스 체력바 꾸밈: 아래에 남은 체력 % · 필살기를 쓰는 체력 자리에 표식 (괴력난신은 70·50·10%, 라스트 보스는 10%)
// 표식: 막대를 가로지르는 금빛 선 + 위에 작은 마름모 + 아래에 % 글자 · 다가오면(5% 안) 깜박임 · 지나가면 흐린 회색
import { ultMarks, type EnemyState } from "@pixel-rogue/shared";

const NEAR = 0.05;

export function drawBossBarMarks(ctx: CanvasRenderingContext2D, boss: EnemyState, tick: number, bx: number, by: number, bw: number, bh: number): void {
  const frac = Math.max(0, boss.hp) / boss.maxHp;
  const fs = Math.max(9, Math.round(bh * 1.15));
  ctx.font = `bold ${fs}px sans-serif`;
  ctx.textBaseline = "top";
  for (const m of ultMarks(boss.kind)) {
    const x = Math.round(bx + bw * m);
    const used = frac <= m;
    const near = !used && frac - m < NEAR;
    const lit = near && (tick >> 3) % 2 === 0;
    const color = used ? "rgba(150,150,160,0.6)" : lit ? "#fff6c0" : "#ffcc4a";
    const d = Math.max(3, Math.round(bh * 0.7));
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(x - 2, by - d - 1, 4, bh + d + 3);
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, by - d + 1, 2, bh + d + 1);
    // 마름모 (위쪽)
    ctx.beginPath();
    ctx.moveTo(x, by - d * 2 - 1);
    ctx.lineTo(x + d, by - d - 1);
    ctx.lineTo(x, by - 1);
    ctx.lineTo(x - d, by - d - 1);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, by - d * 2 + 1);
    ctx.lineTo(x + d - 2, by - d - 1);
    ctx.lineTo(x, by - 3);
    ctx.lineTo(x - d + 2, by - d - 1);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    // 표식 아래 % 글자
    ctx.textAlign = "center";
    label(ctx, `${Math.round(m * 100)}%`, x, by + bh + 4, color);
  }
  // 남은 체력 % (막대 오른쪽 아래)
  ctx.textAlign = "right";
  label(ctx, `${Math.ceil(frac * 100)}%`, bx + bw, by + bh + 4, "#ffffff");
  ctx.textAlign = "left";
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string): void {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(0,0,0,0.85)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
