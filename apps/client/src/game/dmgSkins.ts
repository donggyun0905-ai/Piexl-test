// 데미지 스킨 (이벤트 상점): 금빛 · 네온 피해 숫자. 범 발톱 숫자는 limited/tigerNumber
import type { DmgStyle } from "../shop/effects";

/** 맞힘·치명타 숫자를 그 스킨으로 그림 (font·정렬은 부르는 쪽에서 맞춰 둠) */
export function drawSkinNumber(ctx: CanvasRenderingContext2D, style: Exclude<DmgStyle, "tiger" | "summer">, text: string, x: number, y: number, age: number, crit: boolean): void {
  const pop = crit ? 1 + 0.6 * Math.max(0, 1 - age / 8) : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop, pop);
  if (crit) ctx.font = "bold 8px monospace";
  if (style === "gold") {
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
