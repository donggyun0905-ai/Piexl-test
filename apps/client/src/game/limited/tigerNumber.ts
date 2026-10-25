// 범 풍류(한정 스킨) 피해 숫자: 보통은 금빛 · 치명타는 큰 발톱 자국 위 붉은 숫자 (화면 전용)
import { drawTigerSprite } from "./tigerSprites";
import { GOLD } from "./tigerArt";

type Ctx = CanvasRenderingContext2D;

/** 발톱 자국 하나: 양끝은 날카롭고 가운데가 두꺼운 초승달 (점들을 이어 채움) */
export function clawPath(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, bend: number, width: number, grow: number): { x: number; y: number }[] {
  const mid: { x: number; y: number }[] = [];
  const n = 12;
  const nx = -(y1 - y0);
  const ny = x1 - x0;
  const len = Math.hypot(nx, ny) || 1;
  const top: [number, number][] = [];
  const bot: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * grow;
    const b = Math.sin(t * Math.PI) * bend;
    const x = x0 + (x1 - x0) * t + (nx / len) * b;
    const y = y0 + (y1 - y0) * t + (ny / len) * b;
    const w = Math.sin((i / n) * Math.PI) * width;
    mid.push({ x, y });
    top.push([x + (nx / len) * w, y + (ny / len) * w]);
    bot.push([x - (nx / len) * w, y - (ny / len) * w]);
  }
  ctx.beginPath();
  ctx.moveTo(top[0]![0], top[0]![1]);
  for (const [x, y] of top) ctx.lineTo(x, y);
  for (const [x, y] of bot.reverse()) ctx.lineTo(x, y);
  ctx.closePath();
  return mid;
}

/** 치명타: 순간 번쩍임 · 대각선 발톱 자국 셋(검은 몸 · 안쪽 불씨 줄 · 바깥쪽 흰 빛) · 튀는 불씨 */
function drawSlash(ctx: Ctx, age: number): void {
  // 도트 그림이 있으면 그걸로 (장면: 번쩍 · 자국 · 불씨 · 흐려짐)
  const fade = Math.max(0, 1 - Math.max(0, age - 18) / 14);
  const a = ctx.globalAlpha;
  ctx.globalAlpha = a * fade;
  const drawn = drawTigerSprite(ctx, "crit", age < 3 ? 0 : age < 10 ? 1 : age < 18 ? 2 : 3);
  ctx.globalAlpha = a;
  if (drawn) return;
  const grow = Math.min(1, (age + 1) / 3);
  // 번쩍임
  if (age < 4) {
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
    g.addColorStop(0, `rgba(255, 245, 220, ${0.8 - age * 0.2})`);
    g.addColorStop(1, "rgba(255, 120, 40, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-18, -18, 36, 36);
  }
  ctx.globalAlpha *= fade;
  for (let i = -1; i <= 1; i++) {
    const ox = i * 6;
    const oy = i * 2;
    const x0 = -14 + ox;
    const y0 = -12 + oy;
    const x1 = 12 + ox;
    const y1 = 10 + oy;
    const w = i === 0 ? 3.2 : 2.4;
    // 바깥 흰 빛 (조금 두껍게 깔고)
    clawPath(ctx, x0, y0, x1, y1, 3, w + 1, grow);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fill();
    // 검은 몸
    const mid = clawPath(ctx, x0, y0, x1, y1, 3, w, grow);
    ctx.fillStyle = "#0c0406";
    ctx.fill();
    // 안쪽 불씨 줄
    ctx.beginPath();
    mid.forEach((p, k) => (k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = "#ff4a1a";
    ctx.lineWidth = 0.9;
    ctx.stroke();
    // 튀는 불씨
    if (grow >= 1 && age < 16) {
      for (let k = 2; k < mid.length - 1; k += 3) {
        const p = mid[k]!;
        const up = (age * 0.4 + ((k * 7 + i * 3) % 5)) % 6;
        ctx.fillStyle = k % 2 ? "#ffb040" : "#ff6a2a";
        ctx.fillRect(p.x + ((k * 13) % 5) - 2, p.y - up, 1, 1);
      }
    }
  }
}

/** 피해 숫자 (범 풍류): 보통은 금빛 글자 + 붉은 먹 테두리. 치명타는 발톱 자국 위에 묵직한 붉은 글자(위 밝은 주홍 → 아래 짙은 진홍) + 검붉은 테두리, 크게 튐 */
export function drawTigerNumber(ctx: Ctx, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = crit ? Math.max(1.3, 2.2 - age * 0.12) : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  if (crit) {
    ctx.save();
    ctx.translate(0, -6);
    drawSlash(ctx, age);
    ctx.restore();
  }
  ctx.scale(pop, pop);
  ctx.font = crit ? "900 9px sans-serif" : "bold 6px monospace";
  ctx.lineJoin = "round";
  if (crit) {
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#1e0004";
    ctx.strokeText(text, 0, 0);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "#7a0410";
    ctx.strokeText(text, 0, 0);
    const g = ctx.createLinearGradient(0, -9, 0, 0);
    g.addColorStop(0, "#ffb08a");
    g.addColorStop(0.45, "#ff3a2a");
    g.addColorStop(1, "#b8000e");
    ctx.fillStyle = g;
  } else {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#5a1010";
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = GOLD;
  }
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
