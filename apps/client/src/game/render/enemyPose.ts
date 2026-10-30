// 보스 공격 동작 (그림 칸이 걷기뿐인 보스용, 그리기 전용): 준비 = 뒤로 젖히며 움츠림 · 돌진 = 앞으로 기울임 ·
// 휘두름·쏘기 = 앞으로 내지르며 비틂 + 베기 궤적 · 부르기 = 부풀며 솟음 · 붙어 있으면 몸통 박치기 휘두름
import type { EnemyState, RunState } from "@pixel-rogue/shared";

export interface Pose {
  ox: number;
  oy: number;
  sx: number;
  sy: number;
  rot: number;
  /** 베기 궤적 세기 (0이면 없음) */
  slash: number;
  ux: number;
  uy: number;
}

const REST: Pose = { ox: 0, oy: 0, sx: 1, sy: 1, rot: 0, slash: 0, ux: 1, uy: 0 };

export function enemyPose(s: RunState, e: EnemyState): Pose {
  const dx = s.player.x - e.x;
  const dy = s.player.y - e.y;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  const t = s.tick + e.id * 7;
  const lean = ux >= 0 ? 1 : -1;
  switch (e.phase) {
    case "windup": {
      const k = 0.6 + 0.4 * Math.sin(t * 0.5);
      return { ...REST, ox: -ux * 2 * k, oy: -uy * 2 * k, sx: 1 + 0.08 * k, sy: 1 - 0.08 * k, rot: -lean * 0.12 * k, ux, uy };
    }
    case "charge":
      return { ...REST, ox: ux * 2, oy: uy * 2, sx: 0.94, sy: 1.06, rot: lean * 0.16, ux, uy };
    case "swing":
    case "act":
    case "volley": {
      const k = Math.abs(Math.sin(t * 0.35));
      return { ...REST, ox: ux * 3 * k, oy: uy * 3 * k, sx: 1 + 0.05 * k, sy: 1 - 0.04 * k, rot: lean * 0.28 * (k - 0.3), slash: k > 0.75 ? k : 0, ux, uy };
    }
    case "summon": {
      const k = 0.5 + 0.5 * Math.sin(t * 0.3);
      return { ...REST, oy: -2 * k, sx: 1 + 0.07 * k, sy: 1 + 0.07 * k, ux, uy };
    }
    default: {
      // 걷다가 붙으면 30틱마다 한 번 앞으로 내지름
      if (d > e.r + s.player.r + 8) return REST;
      const c = t % 30;
      if (c >= 12) return REST;
      const k = c < 6 ? c / 6 : (12 - c) / 6;
      return { ...REST, ox: ux * 4 * k, oy: uy * 4 * k, rot: lean * 0.3 * (k - 0.2), sx: 1 + 0.06 * k, sy: 1 - 0.05 * k, slash: c >= 4 && c < 9 ? 1 : 0, ux, uy };
    }
  }
}

/** 베기 궤적 (몸 앞쪽 흰 반달) */
export function drawSlash(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, p: Pose): void {
  if (!p.slash) return;
  const a = Math.atan2(p.uy, p.ux);
  ctx.save();
  ctx.globalAlpha = 0.75 * p.slash;
  ctx.strokeStyle = "#fff4e0";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x + p.ux * r * 0.6, y + p.uy * r * 0.6, r * 1.3, a - 0.9, a + 0.9);
  ctx.stroke();
  ctx.globalAlpha = 0.35 * p.slash;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + p.ux * r * 0.6, y + p.uy * r * 0.6, r * 1.15, a - 0.6, a + 0.6);
  ctx.stroke();
  ctx.restore();
}
