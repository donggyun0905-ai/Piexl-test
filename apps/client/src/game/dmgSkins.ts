// 데미지 스킨 (이벤트 상점): 금빛 · 네온 · 테마 세트 피해 숫자. 범 발톱 숫자는 limited/tigerNumber
import type { DmgStyle } from "../shop/effects";
import { themeOf } from "../shop/fxThemes";
import { drawShape } from "./limited/themeShapes";

/** 맞힘·치명타 숫자를 그 스킨으로 그림 (font·정렬은 부르는 쪽에서 맞춰 둠) */
export function drawSkinNumber(ctx: CanvasRenderingContext2D, style: Exclude<DmgStyle, "tiger" | "summer">, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = 1 + (crit ? 0.7 : 0.3) * Math.max(0, 1 - age / (crit ? 8 : 5));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop, pop);
  if (crit) ctx.font = "bold 8px monospace";
  const th = themeOf(style)?.dmg;
  if (th) {
    // 테마 숫자: 두꺼운 테두리 · 글자색 · 치명타는 색이 바뀌고 옆에 테마 장식
    // 테마 빛 번짐 (겹치면 밝아짐)
    const a0 = ctx.globalAlpha;
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = a0 * (crit ? 0.5 : 0.3);
    ctx.strokeStyle = crit ? th.critFill : th.fill;
    ctx.lineWidth = crit ? 6 : 5;
    ctx.strokeText(text, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = a0;
    ctx.strokeStyle = th.stroke;
    ctx.lineWidth = 3;
    ctx.strokeText(text, 0, 0);
    // 위는 밝고 아래로 테마 색
    const g = ctx.createLinearGradient(0, crit ? -8 : -6, 0, 0);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, crit ? th.critFill : th.fill);
    g.addColorStop(1, crit ? th.critFill : th.stroke);
    ctx.fillStyle = g;
    ctx.fillText(text, 0, 0);
    if (crit) {
      const w = ctx.measureText(text).width / 2 + 5;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * w, -3);
        drawShape(ctx, th.mark, 0.7, side * 0.4, th.critFill);
        ctx.restore();
      }
    }
  } else if (style === "gold") {
    ctx.strokeStyle = "#3a2400";
    ctx.lineWidth = 3;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = crit ? "#fff4c0" : "#ffd84a";
    ctx.fillText(text, 0, 0);
    // 윗부분 반짝임
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.fillText(text, 0, -1);
    ctx.fillStyle = crit ? "#ffb020" : "#e8a020";
    ctx.fillText(text, 0, 0.5);
    if (crit) {
      ctx.fillStyle = "#fff4c0";
      ctx.fillText("★", -ctx.measureText(text).width / 2 - 5, 0);
    }
  } else {
    // 네온: 바깥 빛 두 겹 + 밝은 속
    const glow = crit ? "#ff5ae0" : "#3ad8ff";
    ctx.strokeStyle = glow;
    ctx.globalAlpha *= 0.35;
    ctx.lineWidth = 4;
    ctx.strokeText(text, 0, 0);
    ctx.globalAlpha /= 0.35;
    ctx.lineWidth = 1.5;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, 0, 0);
  }
  ctx.restore();
}
