// 라스트 보스 탄 모양: 빛의 화살 · 어둠의 화살 · 갓이터 패링의 진짜(빨강)·가짜(보라) 창 · 용의 화염 가루 · 갓이터의 도는 거대한 낫
import type { ProjectileState } from "@pixel-rogue/shared";
import { additive, beam, crescent, glow, glowStroke } from "./pwFxBits";

/** 이 탄 모양이면 그리고 true */
export function drawLastShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.look === "larrow" || pr.look === "darrow") {
    // 빛(금빛) · 어둠(보라) 화살: 꼬리가 긴 빛줄기 + 밝은 촉
    const sp = Math.hypot(pr.vx, pr.vy) || 1;
    const dx = pr.vx / sp;
    const dy = pr.vy / sp;
    const light = pr.look === "larrow";
    additive(ctx, () => {
      beam(ctx, x - dx * 16, y - dy * 16, x, y, 2.5, light ? "#ffe68c" : "#8a4ad8", 0.9);
      glow(ctx, x, y, 6, light ? "#fff4c0" : "#b08aff", 0.9, 1);
    });
    ctx.fillStyle = light ? "#fffbe0" : "#d0a8ff";
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
    return true;
  }
  if (pr.look === "rspear" || pr.look === "fspear") {
    // 갓이터 패링의 창: 진짜는 빨갛게 이글거리고, 가짜는 흐린 보라
    const sp = Math.hypot(pr.vx, pr.vy) || 1;
    const dx = pr.vx / sp;
    const dy = pr.vy / sp;
    const real = pr.look === "rspear";
    additive(ctx, () => {
      beam(ctx, x - dx * 24, y - dy * 24, x, y, real ? 5 : 3, real ? "#ff3a2a" : "#a05aff", real ? 0.8 : 0.4);
      if (real) glow(ctx, x, y, 9, "#ff6a4a", 0.6 + 0.3 * Math.sin(tick / 2), 1);
    });
    ctx.lineCap = "round";
    ctx.strokeStyle = real ? "rgba(255, 40, 40, 0.45)" : "rgba(160, 90, 255, 0.3)";
    ctx.lineWidth = real ? 6 : 4;
    ctx.beginPath();
    ctx.moveTo(x - dx * 18, y - dy * 18);
    ctx.lineTo(x, y);
    glowStroke(ctx);
    ctx.strokeStyle = real ? "#ff5a4a" : "rgba(200, 160, 255, 0.75)";
    ctx.lineWidth = 2;
    glowStroke(ctx);
    ctx.lineCap = "butt";
    ctx.fillStyle = real ? "#fff0e0" : "#e8d8ff";
    ctx.beginPath();
    ctx.moveTo(x + dx * 5, y + dy * 5);
    ctx.lineTo(x - dy * 3, y + dx * 3);
    ctx.lineTo(x + dy * 3, y - dx * 3);
    ctx.fill();
    return true;
  }
  if (pr.look === "ember") {
    // 화염 가루: 벚꽃 꽃잎처럼 한 픽셀, 깜빡이는 불씨 색
    const c = (tick + pr.id) % 10 < 5 ? "#ffe08a" : "#ff7a2a";
    additive(ctx, () => glow(ctx, x, y, 4, c, 0.8));
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    return true;
  }
  if (pr.look === "reaper") {
    // 빙글빙글 도는 거대한 낫: 검은 자루 + 휜 은빛 날
    const a = tick * 0.25;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const r = pr.r;
    ctx.strokeStyle = "#3a2a3a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - c * r, y - sn * r);
    ctx.lineTo(x + c * r, y + sn * r);
    glowStroke(ctx);
    // 붉은 기운이 도는 낫날 잔상
    additive(ctx, () => {
      glow(ctx, x, y, r * 1.6, "#ff3a3a", 0.35);
      crescent(ctx, x + c * r * 0.4, y + sn * r * 0.4, r * 0.95, a + 0.8, 1.2, 6, "#ff4a4a", 0.8);
    });
    ctx.strokeStyle = "rgba(255, 70, 70, 0.55)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x + c * r * 0.4, y + sn * r * 0.4, r * 0.9, a - 0.3, a + 1.9);
    glowStroke(ctx);
    ctx.strokeStyle = "#e8e8f0";
    ctx.lineWidth = 2;
    glowStroke(ctx);
    return true;
  }
  return false;
}
