// 적 공격 예고 (적보다 먼저 그림): 탄을 쏘기 직전 입에 모이는 빛과 조준선 · 돌진 직전 바닥에 차오르는 화살표 길 · 보스가 곧 탄·소환을 쓰면 조여 드는 빛 고리
import { allPlayers, isAlive, type EnemyState, type PlayerState, type RunState } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import { lerp, type Snap } from "./palette";
import { drawGuardianWarn } from "./minions";

type Ctx = CanvasRenderingContext2D;

/** 곧 탄·소환·범위 공격을 쓰기 전 몸 둘레 고리가 줄어드는 보스 */
const RING_WARN = new Set<string>(["brood", "seer", "archer", "siren", "plant", "reaper", "archangel", "toad", "salamander", "jelly", "captain"]);

/** 협동: 적이 노리는 가장 가까운 살아 있는 사람 (혼자면 나) */
function nearest(s: RunState, e: EnemyState): PlayerState {
  let best = s.player;
  let bestD = Infinity;
  for (const p of allPlayers(s)) {
    const d = (p.x - e.x) ** 2 + (p.y - e.y) ** 2;
    if (isAlive(p) && d < bestD) [best, bestD] = [p, d];
  }
  return best;
}

/** 돌진 길: 바닥에 붉은 띠가 차오르고 화살표 무늬가 앞으로 흐름 */
function chargeLane(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, w: number, f: number, tick: number): void {
  const a = Math.atan2(dy, dx);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.fillStyle = `rgba(255, 70, 70, ${0.12 + 0.12 * f})`;
  ctx.fillRect(0, -w / 2, len, w);
  ctx.fillStyle = `rgba(255, 90, 90, ${0.25 + 0.3 * f})`;
  ctx.fillRect(0, -w / 2, len * f, w);
  ctx.strokeStyle = `rgba(255, 200, 200, ${0.5 + 0.4 * f})`;
  ctx.lineWidth = 1;
  for (let d = ((tick * 1.5) % 10) + 2; d < len - 3; d += 10) {
    ctx.beginPath();
    ctx.moveTo(d, -w / 2 + 1);
    ctx.lineTo(d + 4, 0);
    ctx.lineTo(d, w / 2 - 1);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawTelegraphs(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  for (const e of s.enemies) {
    const x = snap(lerp(e.prevX, e.x, alpha));
    const y = snap(lerp(e.prevY, e.y, alpha));
    drawGuardianWarn(ctx, e, x, y);
    if (e.kind === "spitter" && e.timer > 0 && e.timer <= 28) {
      // 침 뱉기 직전: 입에 산성 빛이 모이고 가는 조준선
      const p = nearest(s, e);
      const d = Math.hypot(p.x - e.x, p.y - e.y) || 1;
      const dx = (p.x - e.x) / d;
      const dy = (p.y - e.y) / d;
      const f = 1 - e.timer / 28;
      ctx.strokeStyle = `rgba(160, 240, 90, ${0.25 + 0.4 * f})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx * Math.min(d, 90), y + dy * Math.min(d, 90));
      ctx.stroke();
      ctx.setLineDash([]);
      additive(ctx, () => glow(ctx, x + dx * 5, y + dy * 5, 3 + 5 * f, "#9ae84a", 0.5 + 0.5 * f, f));
    } else if ((e.kind === "charger" || e.kind === "hulk" || e.kind === "guardian" || e.kind === "centaur") && e.phase === "windup") {
      // 켄타우로스는 돌진 방향을 마지막에 정하므로 플레이어 쪽
      const c = e.kind === "centaur" ? Math.hypot(s.player.x - e.x, s.player.y - e.y) || 1 : 1;
      const dx = e.kind === "centaur" ? (s.player.x - e.x) / c : e.dirX;
      const dy = e.kind === "centaur" ? (s.player.y - e.y) / c : e.dirY;
      const len = e.kind === "hulk" ? 86 : e.kind === "centaur" ? 64 : 62;
      const f = Math.max(0, Math.min(1, 1 - e.timer / 30));
      chargeLane(ctx, x, y, dx, dy, len, e.r * 1.4, f, s.tick);
      // 발을 구르며 힘을 모음: 몸 둘레 붉은 기운
      additive(ctx, () => glow(ctx, x, y, e.r + 8, "#ff4a4a", 0.3 + 0.4 * f));
    } else if (RING_WARN.has(e.kind) && e.phase !== "blink" && e.phase !== "act" && e.timer > 0 && e.timer <= 22) {
      // 보스가 곧 탄·소환을 씀: 몸 둘레로 조여 드는 빛 고리 + 차오르는 기운
      const f = e.timer / 22;
      additive(ctx, () => {
        shock(ctx, x, y, e.r + 3 + 14 * f, "#ff6a6a", 0.9 - 0.5 * f, 4);
        glow(ctx, x, y, e.r + 6, "#ff8a6a", 0.5 * (1 - f));
      });
    }
  }
}
