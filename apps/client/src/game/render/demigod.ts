// 시즌 2 라스트 보스 괴력난신 그리기: 동작마다 그림 칸(걷기·주먹·두 손 들기) · 50% 필살기 붉은 주먹 기운 · 기 주먹 난사 노란 기운
// 10% 원기옥: 머리 위에서 커지는 거대한 기 구슬 · 맵 전체 노란 깜박임 세 번(다음 박자에 대시) · 기 주먹 탄
import { SPIRIT_BLINK, SPIRIT_CHARGE, spiritBlink, spiritSlam, type EnemyState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";
import { C } from "./palette";

const TAU = Math.PI * 2;
/** 깜박임이 보이는 틱 */
const FLASH = 6;

/** 그림 칸: 0·1 걷기 · 2 주먹 · 3 두 손 들기 */
function frameOf(s: RunState, e: EnemyState): number {
  if (e.gUlt === 3 || e.phase === "volley") return 3;
  if (e.combo) return e.combo.t > 8 ? 2 : 0;
  if (e.phase === "charge" || (e.gUlt === 2 && s.tick % 18 < 9)) return 2;
  return Math.floor(s.tick / 14) % 2;
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number): void {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, color.replace("A", String(alpha)));
  g.addColorStop(1, color.replace("A", "0"));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

/** 괴력난신이면 그리고 true */
export function drawDemigodActor(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind !== "demigod") return false;
  const flip = e.dirX < 0;
  // 발밑 그림자 (그림은 몸 가운데보다 위로)
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 24, 16, 5, 0, 0, TAU);
  ctx.fill();
  if (e.phase === "volley") glow(ctx, x, y - 8, 40, "rgba(255, 220, 90, A)", 0.45 + 0.15 * Math.sin(s.tick / 3));
  if (e.gUlt === 2) glow(ctx, x, y - 6, 36, "rgba(255, 30, 30, A)", 0.5);
  const stunned = (e.stunTicks ?? 0) > 0;
  const tint: readonly [string, number] | undefined = e.hitFlash > 0 ? [C.hit, 1] : stunned ? [C.frozen, 0.45] : undefined;
  drawEnemySprite(ctx, "demigod", x, y - 6, frameOf(s, e), flip, tint);
  // 50% 필살기: 두 주먹에 새빨간 파동
  if (e.gUlt === 2) {
    for (const side of [-1, 1]) {
      const fx = x + (flip ? -1 : 1) * (side > 0 ? 14 : -12);
      ctx.strokeStyle = `rgba(255, 40, 40, ${0.6 + 0.3 * Math.sin(s.tick / 2 + side)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx, y + 8, 6 + (s.tick % 6), 0, TAU);
      ctx.stroke();
    }
  }
  // 그로기: 머리 위 별
  if (stunned) {
    ctx.fillStyle = "#ffe066";
    for (let i = 0; i < 3; i++) {
      const a = s.tick / 10 + (i * TAU) / 3;
      ctx.fillRect(Math.round(x + Math.cos(a) * 10), Math.round(y - 40 + Math.sin(a) * 3), 2, 2);
    }
  }
  if (e.gUlt === 3 && e.ultAt !== undefined) {
    // 원기옥: 모으는 동안 커지고, 내리꽂을 때마다 번쩍
    const t = s.tick - e.ultAt;
    const r = Math.min(1, t / SPIRIT_CHARGE) * 34 + 6;
    glow(ctx, x, y - 46 - r * 0.5, r * 1.6, "rgba(255, 230, 120, A)", 0.45);
    ctx.fillStyle = "#fff4b0";
    ctx.beginPath();
    ctx.arc(x, y - 46 - r * 0.5, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffd040";
    ctx.beginPath();
    ctx.arc(x + r * 0.2, y - 46 - r * 0.35, r * 0.7, 0, TAU);
    ctx.fill();
  }
  return true;
}

/** 원기옥 깜박임: 맵 전체가 노랗게 세 번 → 다음 박자에 내리꽂음(하얗게) */
export function drawDemigodAir(ctx: CanvasRenderingContext2D, s: RunState): void {
  const e = s.enemies.find((o) => o.kind === "demigod" && o.gUlt === 3 && o.ultAt !== undefined);
  if (!e) return;
  const t = s.tick - e.ultAt!;
  let color = "";
  for (let k = 0; k < 3; k++) {
    for (let j = 0; j < 3; j++) {
      const at = spiritBlink(k) + j * SPIRIT_BLINK;
      if (t >= at && t < at + FLASH) color = "rgba(255, 220, 40, 0.35)";
    }
    if (t >= spiritSlam(k) && t < spiritSlam(k) + FLASH) color = "rgba(255, 255, 230, 0.6)";
  }
  if (!color) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/** 기 주먹 탄: 노란 빛에 싸인 주먹 */
export function drawKiFist(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.look !== "kifist") return false;
  const sp = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / sp;
  const dy = pr.vy / sp;
  ctx.strokeStyle = "rgba(255, 200, 60, 0.5)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - dx * 8, y - dy * 8);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = tick % 8 < 4 ? "#ffd84a" : "#ffb020";
  ctx.beginPath();
  ctx.arc(x, y, pr.r + 1, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#fff6c8";
  ctx.fillRect(Math.round(x + dx * 2 - 1), Math.round(y + dy * 2 - 1), 2, 2);
  return true;
}
