// 피해 없는 상태이상 표시 (모든 적 공통): 느림 = 발밑 노란 물결(바닥) · 기절 = 머리 위 어질어질 별 · 공포 = 머리 위 보랏빛 해골 + 식은땀
// 속박은 몸을 감는 붕대(render/medic drawMedicAir)
import type { EnemyState, RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

const at = (e: EnemyState, alpha: number, snap: Snap) => ({ x: snap(lerp(e.prevX, e.x, alpha)), y: snap(lerp(e.prevY, e.y, alpha)) });

/** 바닥: 느려진 적 발밑에 퍼져 나가는 노란 물결 두 겹 */
export function drawStatusGround(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const e of s.enemies) {
    if (e.hp <= 0 || (e.slowTicks ?? 0) <= 0) continue;
    const { x, y } = at(e, alpha, snap);
    const foot = y + e.r * 0.7;
    ctx.lineWidth = 1;
    for (const off of [0, 15]) {
      const t = ((s.tick + off + e.id * 7) % 30) / 30;
      ctx.globalAlpha = 0.9 * (1 - t * 0.8);
      ctx.strokeStyle = "#ffd84a";
      ctx.beginPath();
      ctx.ellipse(x, foot, e.r * (0.6 + t * 0.9), e.r * (0.22 + t * 0.3), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

const STAR = ["..Y..", ".YWY.", "YWWWY", ".YWY.", "..Y.."];
const SKULL = [".PPP.", "PkPkP", "PPPPP", ".PkP."];

function pixels(ctx: CanvasRenderingContext2D, rows: readonly string[], x: number, y: number, colors: Record<string, string>): void {
  ctx.fillStyle = "#1a1622";
  rows.forEach((r, j) => [...r].forEach((ch, i) => ch !== "." && ctx.fillRect(x + i - 0.5, y + j - 0.5, 2, 2)));
  rows.forEach((r, j) =>
    [...r].forEach((ch, i) => {
      if (ch === ".") return;
      ctx.fillStyle = colors[ch]!;
      ctx.fillRect(x + i, y + j, 1, 1);
    }),
  );
}

/** 머리 위: 기절(도는 별 셋 + 궤도) · 공포(흔들리는 해골 + 식은땀) */
export function drawStatusAir(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const stun = (e.stunTicks ?? 0) > 0;
    const fear = (e.fearTicks ?? 0) > 0;
    if (!stun && !fear) continue;
    const { x, y } = at(e, alpha, snap);
    const top = y - e.r - 5;
    if (stun) {
      const rx = Math.max(6, e.r * 0.9);
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = "#ffe070";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, top, rx, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      const a = s.tick * 0.15 + e.id;
      for (let k = 0; k < 3; k++) {
        const t = a + (k * Math.PI * 2) / 3;
        pixels(ctx, STAR, snap(x + Math.cos(t) * rx) - 2, snap(top + Math.sin(t) * 2.5) - 2, { Y: "#ffd84a", W: "#fff8d0" });
      }
    }
    if (fear) {
      const bob = Math.round(Math.sin(s.tick * 0.5) * 1);
      const sy = top - (stun ? 9 : 2) + bob;
      pixels(ctx, SKULL, x - 2, sy, { P: "#c890ff", k: "#2a1640" });
      // 식은땀: 머리 양옆에서 떨어지는 물방울
      const t = (s.tick % 24) / 24;
      ctx.fillStyle = "#8ad8ff";
      for (const side of [-1, 1]) ctx.fillRect(snap(x + side * (e.r + 1)), snap(y - e.r + t * 6), 1, 2);
    }
  }
}
