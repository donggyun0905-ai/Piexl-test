// 추적자 그리기: 저격탄·연발탄 꼬리 · 강력한 한방 모으기(앞의 빛 벽·조준 레이저·총구 빛) · 빔 · 저격 맞음
// 암습 저격: 화면 전체가 까매지고 조준 원 안만 보임 (PC는 마우스 자리, 모바일·자동 조준은 노리는 적) · 쏠 때 원이 위로 튐 · 남은 발·남은 시간 표시
import { TRACKER, type EffectState, type EnemyState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const GOLD = "#ffd860";
const SCOPE = "#ff4a4a";

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** 저격탄·연발탄·도탄 */
export function drawTrackerShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "trBullet" && pr.spirit !== "trBurst" && pr.spirit !== "trRico") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  const tail = pr.spirit === "trBullet" ? 18 : 8;
  ctx.globalAlpha = 0.5;
  line(ctx, x - dx * tail, y - dy * tail, x, y, pr.spirit === "trBurst" ? "#ffb060" : "#fff6c0", 1);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  return true;
}

/** 강력한 한방을 모으는 동안: 앞의 빛 벽 · 앞으로 뻗는 붉은 조준선 · 총구에 모이는 빛 */
export function drawTrackerAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "tracker" || !p.trCharge) return;
  const x = lerp(p.prevX, p.x, alpha);
  const y = lerp(p.prevY, p.y, alpha);
  const k = 1 - p.trCharge / TRACKER.powerCharge;
  ctx.globalAlpha = 0.5 + 0.3 * k;
  line(ctx, snap(x), snap(y - 3), snap(x + p.faceX * 400), snap(y - 3 + p.faceY * 400), SCOPE, 1);
  // 빛 벽 (탄을 막음)
  const cx = x + p.faceX * TRACKER.wallDist;
  const cy = y + p.faceY * TRACKER.wallDist;
  const hw = TRACKER.wallWidth / 2;
  const nx = -p.faceY;
  const ny = p.faceX;
  ctx.globalAlpha = 0.35 + 0.15 * Math.sin(s.tick * 0.4);
  line(ctx, snap(cx - nx * hw), snap(cy - ny * hw), snap(cx + nx * hw), snap(cy + ny * hw), "#6ac8ff", 5);
  ctx.globalAlpha = 0.9;
  line(ctx, snap(cx - nx * hw), snap(cy - ny * hw), snap(cx + nx * hw), snap(cy + ny * hw), "#e8f8ff", 1);
  // 총구 빛
  ctx.globalAlpha = 0.6 + 0.4 * k;
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(snap(x + p.faceX * 8), snap(y - 3 + p.faceY * 8), 1 + k * 4, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/** 효과: 저격 맞음 · 빔 · 스킬 쓸 때 */
export function drawTrackerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  if (fx.kind === "trSnipe") {
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = fx.width ? "#ffffff" : "#ffb0b0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 2 + t * fx.size, 0, TAU);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i * TAU) / 6 + 0.3;
      line(ctx, x + Math.cos(a) * 2, y + Math.sin(a) * 2, x + Math.cos(a) * (4 + t * 10), y + Math.sin(a) * (4 + t * 10), GOLD, 1);
    }
  } else if (fx.kind === "trBeam") {
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const w = fx.size * (1 - t * 0.7);
    ctx.globalAlpha = (1 - t) * 0.5;
    line(ctx, x, y, tx, ty, "#6ac8ff", w * 1.8);
    ctx.globalAlpha = 1 - t;
    line(ctx, x, y, tx, ty, "#ffffff", Math.max(1, w * 0.6));
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(x, y, w, 0, TAU);
    ctx.fill();
  } else if (fx.kind === "trSkill") {
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = ["#ff4a4a", "#6ac8ff", "#ffb060"][fx.dirX] ?? GOLD;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 6 + t * fx.size, 0, TAU);
    ctx.stroke();
  } else return false;
  ctx.globalAlpha = 1;
  return true;
}

/** 자동 조준이 노리는 적 (가장 가까운 적) */
function autoTarget(s: RunState): EnemyState | undefined {
  const p = s.player;
  let best: EnemyState | undefined;
  let bd = Infinity;
  for (const e of s.enemies) {
    const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
    if (e.hp > 0 && !e.immune && d < bd) [best, bd] = [e, d];
  }
  return best;
}

/** 암습 저격 화면: 조준 원만 남기고 까맣게. cursor = 마우스 자리(게임 좌표, 없으면 자동 조준) */
export function drawAmbushOverlay(ctx: Ctx, s: RunState, snap: Snap, cursor: { x: number; y: number } | null): void {
  const p = s.player;
  const a = p.trAmbush;
  if (p.characterId !== "tracker" || !a) return;
  const ring = TRACKER.ambushR * (p.passives.includes("trScope") ? 1.5 : 1) + 6;
  const target = cursor ? null : autoTarget(s);
  // 쏜 뒤 잠깐 위로 튐 (반동)
  const kick = Math.max(0, 1 - (s.tick - (p.trShot ?? -99)) / 10);
  const cx = snap((cursor?.x ?? target?.x ?? p.x + p.faceX * 60));
  const cy = snap((cursor?.y ?? target?.y ?? p.y + p.faceY * 60) - kick * 7);
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.94)";
  ctx.beginPath();
  ctx.rect(-2000, -2000, 5000, 5000);
  ctx.arc(cx, cy, ring, 0, TAU, true);
  ctx.fill();
  // 조준경: 원 테두리 · 십자선 · 가운데 점
  ctx.strokeStyle = SCOPE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, ring, 0, TAU);
  ctx.stroke();
  line(ctx, cx - ring, cy, cx - 3, cy, SCOPE, 0.6);
  line(ctx, cx + 3, cy, cx + ring, cy, SCOPE, 0.6);
  line(ctx, cx, cy - ring, cx, cy - 3, SCOPE, 0.6);
  line(ctx, cx, cy + 3, cx, cy + ring, SCOPE, 0.6);
  ctx.fillStyle = SCOPE;
  ctx.fillRect(cx - 0.5, cy - 0.5, 1, 1);
  // 남은 시간 (바깥 금빛 호) · 남은 발 (아래 점)
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, ring + 3, -Math.PI / 2, -Math.PI / 2 + TAU * (a.t / TRACKER.ambushTicks));
  ctx.stroke();
  for (let i = 0; i < a.shots; i++) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - a.shots * 1.5 + i * 3, cy + ring + 5, 2, 2);
  }
  ctx.restore();
}
