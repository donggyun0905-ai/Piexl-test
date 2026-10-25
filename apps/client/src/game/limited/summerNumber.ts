// 여름 파도(한정 스킨) 피해 숫자: 보통은 물빛 글자 + 짙은 바다 테두리 · 치명타는 왕관 모양 물보라 위 노을빛(노랑 → 산호 → 분홍) 큰 숫자 (화면 전용)
import { CORAL, FOAM, SEA, SUN } from "./summerFx";

type Ctx = CanvasRenderingContext2D;

/** 치명타 물보라: 번쩍 → 왕관처럼 솟는 물줄기 · 튀는 물방울 · 바닥 물결 */
function drawSplash(ctx: Ctx, age: number): void {
  const fade = Math.max(0, 1 - Math.max(0, age - 16) / 14);
  const grow = Math.min(1, (age + 1) / 5);
  const a0 = ctx.globalAlpha;
  if (age < 4) {
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
    g.addColorStop(0, `rgba(255, 255, 255, ${0.85 - age * 0.2})`);
    g.addColorStop(1, "rgba(74, 216, 255, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-18, -18, 36, 36);
  }
  ctx.globalAlpha = a0 * fade;
  // 바닥 물결 고리
  ctx.strokeStyle = FOAM;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 6, 8 + age * 0.8, 2.5 + age * 0.25, 0, 0, Math.PI * 2);
  ctx.stroke();
  // 왕관 물줄기 7가닥 (가운데가 가장 높음)
  for (let i = -3; i <= 3; i++) {
    const h = (14 - Math.abs(i) * 3) * grow;
    const x = i * 3.2;
    const lean = i * 0.9 * grow;
    ctx.strokeStyle = SEA;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x, 6);
    ctx.quadraticCurveTo(x + lean * 0.5, 6 - h * 0.6, x + lean, 6 - h);
    ctx.stroke();
    ctx.strokeStyle = FOAM;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // 물줄기 끝 물방울
    const up = age * 0.5;
    ctx.fillStyle = i % 2 ? FOAM : SEA;
    ctx.fillRect(x + lean * 1.4 - 1, 6 - h - 2 - up + up * up * 0.06, 2, 2);
  }
  ctx.globalAlpha = a0;
}

/** 피해 숫자 (여름 파도) */
export function drawSummerNumber(ctx: Ctx, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = crit ? Math.max(1.3, 2.2 - age * 0.12) : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  if (crit) {
    ctx.save();
    ctx.translate(0, -4);
    drawSplash(ctx, age);
    ctx.restore();
  }
  ctx.scale(pop, pop);
  ctx.font = crit ? "900 9px sans-serif" : "bold 6px monospace";
  ctx.lineJoin = "round";
  if (crit) {
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#08203a";
    ctx.strokeText(text, 0, 0);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeText(text, 0, 0);
    const g = ctx.createLinearGradient(0, -9, 0, 0);
    g.addColorStop(0, SUN);
    g.addColorStop(0.5, CORAL);
    g.addColorStop(1, "#e8407a");
    ctx.fillStyle = g;
  } else {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#0a2a4a";
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = SEA;
  }
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
