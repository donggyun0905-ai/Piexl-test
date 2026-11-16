// 성탄 눈꽃(한정 스킨) 피해 숫자: 보통은 흰 글자에 빨간 테두리 · 치명타는 금빛 큰 숫자 + 둘레에 도는 눈꽃 넷 (화면 전용)
import { ICE, NIGHT, RED, SNOW, STAR } from "./xmasArt";

type Ctx = CanvasRenderingContext2D;

/** 피해 숫자 (성탄 눈꽃) */
export function drawXmasNumber(ctx: Ctx, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = crit ? Math.max(1.3, 2 - age * 0.1) : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  if (crit) {
    const fade = Math.max(0, 1 - Math.max(0, age - 12) / 14);
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = a0 * fade;
    for (let i = 0; i < 4; i++) {
      const a = age * 0.12 + (i / 4) * Math.PI * 2;
      const fx = Math.round(Math.cos(a) * 13);
      const fy = Math.round(Math.sin(a) * 6) - 5;
      ctx.fillStyle = i % 2 ? ICE : SNOW;
      ctx.fillRect(fx - 1, fy, 3, 1);
      ctx.fillRect(fx, fy - 1, 1, 3);
    }
    ctx.globalAlpha = a0;
  }
  ctx.scale(pop, pop);
  ctx.font = crit ? "900 9px monospace" : "bold 6px monospace";
  ctx.lineJoin = "round";
  ctx.lineWidth = crit ? 3.5 : 2.5;
  ctx.strokeStyle = crit ? NIGHT : RED;
  ctx.strokeText(text, 0, 0);
  if (crit) {
    ctx.fillStyle = RED;
    ctx.fillText(text, 0.8, 0.8);
  }
  ctx.fillStyle = crit ? STAR : SNOW;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
