// 라스트 보스 탄 모양: 빛의 화살 · 어둠의 화살 · 갓이터 패링의 진짜(빨강)·가짜(보라) 창 · 용의 화염 가루 · 갓이터의 도는 거대한 낫
import type { ProjectileState } from "@pixel-rogue/shared";

/** 이 탄 모양이면 그리고 true */
export function drawLastShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.look === "larrow" || pr.look === "darrow") {
    // 빛(금빛) · 어둠(보라) 화살: 꼬리가 긴 빛줄기 + 밝은 촉
    const sp = Math.hypot(pr.vx, pr.vy) || 1;
    const dx = pr.vx / sp;
    const dy = pr.vy / sp;
    const light = pr.look === "larrow";
    ctx.strokeStyle = light ? "rgba(255, 230, 140, 0.8)" : "rgba(120, 60, 200, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - dx * 9, y - dy * 9);
    ctx.lineTo(x, y);
    ctx.stroke();
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
    ctx.lineCap = "round";
    ctx.strokeStyle = real ? "rgba(255, 40, 40, 0.45)" : "rgba(160, 90, 255, 0.3)";
    ctx.lineWidth = real ? 6 : 4;
    ctx.beginPath();
    ctx.moveTo(x - dx * 18, y - dy * 18);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.strokeStyle = real ? "#ff5a4a" : "rgba(200, 160, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.stroke();
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
    ctx.fillStyle = (tick + pr.id) % 10 < 5 ? "#ffe08a" : "#ff7a2a";
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
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 70, 70, 0.55)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x + c * r * 0.4, y + sn * r * 0.4, r * 0.9, a - 0.3, a + 1.9);
    ctx.stroke();
    ctx.strokeStyle = "#e8e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  return false;
}
