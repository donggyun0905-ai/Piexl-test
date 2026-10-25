// 보스 상태 표시 (무적 방벽 등) · 적 탄 모양 (화살·음표·창·씨앗·영혼·깃털·빛 구슬·불덩이)
import type { EnemyState, ProjectileState } from "@pixel-rogue/shared";
import { drawLastShot } from "./lastShots";

const TAU = Math.PI * 2;

function line(ctx: CanvasRenderingContext2D, x: number, y: number, tx: number, ty: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

/** 적 탄 모양 (화살·음표·창·씨앗·영혼·깃털)이면 그리고 true */
export function drawEnemyShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (!pr.look) return false;
  if (drawLastShot(ctx, pr, x, y, tick)) return true;
  const sp = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / sp;
  const dy = pr.vy / sp;
  if (pr.look === "arrow" || pr.look === "spear") {
    const len = pr.look === "spear" ? 10 : 6;
    ctx.strokeStyle = pr.look === "spear" ? "#a07040" : "#d8c8a0";
    ctx.lineWidth = 1;
    line(ctx, x - dx * len, y - dy * len, x, y);
    ctx.fillStyle = "#e8ecf4";
    ctx.fillRect(Math.round(x + dx) - 1, Math.round(y + dy) - 1, 2, 2);
    return true;
  }
  if (pr.look === "note") {
    // 음표: 동그란 머리 + 기둥 + 깃발, 크기만큼 크게
    const r = pr.r;
    ctx.fillStyle = pr.lure ? "#ff8ad8" : "#7ae0f0";
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.8, r * 0.6, -0.4, 0, TAU);
    ctx.fill();
    ctx.fillRect(Math.round(x + r * 0.6), Math.round(y - r * 2.2), 1, Math.round(r * 2.2));
    ctx.fillRect(Math.round(x + r * 0.6), Math.round(y - r * 2.2), Math.round(r), 1 + (Math.floor(tick / 8) % 2));
    return true;
  }
  if (pr.look === "orbRuin" || pr.look === "orbChaos") {
    // 갓이터 거대한 구슬: 파괴(붉은) · 혼돈(보라)
    const ruin = pr.look === "orbRuin";
    ctx.fillStyle = ruin ? "rgba(200, 50, 50, 0.45)" : "rgba(140, 70, 220, 0.45)";
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 3, 0, TAU);
    ctx.fill();
    ctx.fillStyle = ruin ? "#ff8a7a" : "#c8a0ff";
    ctx.beginPath();
    ctx.arc(x, y, pr.r * 0.7, 0, TAU);
    ctx.fill();
    return true;
  }
  if (pr.look === "rock") {
    // 바위 파편
    ctx.fillStyle = "#6a5a4a";
    ctx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 6, 6);
    ctx.fillStyle = "#9a8a7a";
    ctx.fillRect(Math.round(x) - 2, Math.round(y) - 3, 3, 2);
    return true;
  }
  if (pr.look === "bigwave") {
    // 거대한 검기: 크게 휜 흰 초승달 + 붉은 테두리
    const a = Math.atan2(dy, dx);
    ctx.strokeStyle = "rgba(255, 80, 80, 0.6)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x - dx * pr.r, y - dy * pr.r, pr.r * 1.6, a - 1.1, a + 1.1);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  if (pr.look === "bat") {
    // 박쥐: 퍼덕이는 날개
    const up = Math.floor(tick / 4) % 2 === 0;
    ctx.fillStyle = "#2a1a3a";
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
    ctx.fillRect(Math.round(x) - 4, Math.round(y) - (up ? 2 : 0), 3, 2);
    ctx.fillRect(Math.round(x) + 2, Math.round(y) - (up ? 2 : 0), 3, 2);
    ctx.fillStyle = "#ff5a5a";
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    return true;
  }
  if (pr.look === "net") {
    // 빛의 그물: 격자 무늬 원
    ctx.strokeStyle = "#fff4c8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 1, 0, TAU);
    ctx.moveTo(x - pr.r, y);
    ctx.lineTo(x + pr.r, y);
    ctx.moveTo(x, y - pr.r);
    ctx.lineTo(x, y + pr.r);
    ctx.stroke();
    return true;
  }
  if (pr.look === "wave") {
    // 검기: 날아가는 쪽으로 휜 흰 초승달
    const a = Math.atan2(dy, dx);
    ctx.strokeStyle = "#f0f0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x - dx * 3, y - dy * 3, 5, a - 1, a + 1);
    ctx.stroke();
    return true;
  }
  if (pr.look === "fire") {
    // 용의 불덩이: 주황 테두리 + 노란 가운데
    ctx.fillStyle = "rgba(255, 110, 30, 0.75)";
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 1, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffe08a";
    ctx.beginPath();
    ctx.arc(x, y, pr.r * 0.5, 0, TAU);
    ctx.fill();
    return true;
  }
  if (pr.look === "light") {
    // 천사장 빛 구슬: 금빛 테두리 + 흰 가운데
    ctx.fillStyle = "rgba(255, 220, 120, 0.5)";
    ctx.beginPath();
    ctx.arc(x, y, pr.r + 2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fffbe8";
    ctx.beginPath();
    ctx.arc(x, y, pr.r * 0.6, 0, TAU);
    ctx.fill();
    return true;
  }
  const color = pr.look === "seed" ? "#8ad050" : pr.look === "soul" ? "#b890ff" : "#ffffff";
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillRect(Math.round(x - dx * 3) - 1, Math.round(y - dy * 3) - 1, 2, 2);
  return true;
}

/** 무적 방벽: 몸 둘레 흰 점선 고리 */
function shieldRing(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(x, y, r + 9, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
}

/** 그림 위 상태 표시: 무적 방벽 · 천사장 탑 차례 · 태초의 빛·어둠 기운 (생김새는 public/sprites/enemies 그림) */
export function drawBossStatus(ctx: CanvasRenderingContext2D, e: EnemyState, x: number, y: number): void {
  const r = e.r;
  const ring = (rad: number, color: string, w: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TAU);
    ctx.stroke();
  };
  switch (e.kind) {
    case "tower":
      // 차례인 탑은 금빛 고리, 아닌 탑은 흐린 방패 고리
      ring(r + 3, e.immune ? "rgba(160, 170, 200, 0.7)" : "rgba(255, 230, 140, 0.9)", 1);
      break;
    case "dragon":
      if (e.immune) ring(r + 6, "rgba(255, 140, 40, 0.9)", 2);
      break;
    case "godeater":
      if (e.immune) ring(r + 5, "rgba(160, 120, 220, 0.8)", 2);
      break;
    case "ruinblade":
    case "chaosblade":
      if (e.immune) ring(r + 6, "rgba(170, 90, 255, 0.85)", 1);
      break;
    case "plight":
      if (e.immune) shieldRing(ctx, x, y, r);
      ring(r + 4, "rgba(255, 230, 140, 0.9)", 1);
      break;
    case "pdark":
      if (e.immune) shieldRing(ctx, x, y, r);
      ring(r + 4, "rgba(120, 60, 200, 0.6)", 2);
      break;
    default:
      break;
  }
}
