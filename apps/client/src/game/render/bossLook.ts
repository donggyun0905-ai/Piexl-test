// 보스 상태 표시 (무적 방벽 등) · 적 탄 모양 (화살·음표·창·씨앗·영혼·깃털·빛 구슬·불덩이)
import type { EnemyState, ProjectileState } from "@pixel-rogue/shared";
import { drawLastShot } from "./lastShots";
import { drawBeastShot } from "./beastUlts";
import { drawKiFist } from "./demigod";
import { drawSageShot } from "./sage";
import { drawLookShot } from "./enemyShots";

const TAU = Math.PI * 2;

/** 적 탄 모양 (화살·음표·창·씨앗·영혼·깃털)이면 그리고 true */
export function drawEnemyShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (!pr.look) return false;
  if (drawLastShot(ctx, pr, x, y, tick) || drawBeastShot(ctx, pr, x, y, tick) || drawKiFist(ctx, pr, x, y, tick) || drawSageShot(ctx, pr, x, y, tick)) return true;
  drawLookShot(ctx, pr, x, y, tick);
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
    case "tower": {
      // 차례인 탑은 금빛 고리 + 수정에서 하늘로 솟는 빛기둥, 아닌 탑은 흐린 방패 고리
      ring(r + 3, e.immune ? "rgba(160, 170, 200, 0.7)" : "rgba(255, 230, 140, 0.9)", 1);
      if (!e.immune) {
        const top = y - r * 1.6;
        const g = ctx.createLinearGradient(0, top - 36, 0, top);
        g.addColorStop(0, "rgba(255, 240, 170, 0)");
        g.addColorStop(1, "rgba(255, 240, 170, 0.55)");
        ctx.fillStyle = g;
        ctx.fillRect(x - 2.5, top - 36, 5, 36);
        ctx.fillStyle = "rgba(255, 255, 235, 0.8)";
        ctx.fillRect(x - 0.5, top - 30, 1, 30);
      }
      break;
    }
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
