// 백인장 기본 패시브: 미니 창 드론 5기가 늘 적을 쫓아가 찌르고, 곧게 지나갔다가 돌아와 다시 찌름 (붉은 레이저 자국은 화면이 그림)
// 적이 없으면 몸 둘레에 떠 있음 · 벽은 넘어 다님
import { BJ_DRONE as D } from "../weaponsBaekinjang";
import { bjAlive } from "./bjKit";
import { bjHit } from "./bjVolley";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

/** 쉴 때 자리 (몸 둘레 다섯 방향, 위쪽 반원) */
const REST: [number, number][] = [[-1, -0.2], [-0.7, -0.8], [0, -1.1], [0.7, -0.8], [1, -0.2]];

/** 방이 바뀌었을 때 등: 드론을 몸 곁으로 */
export function resetDrones(s: RunState): void {
  const p = s.player;
  p.bjDrones = Array.from({ length: D.n }, (_, i) => ({ x: p.x + REST[i % 5]![0] * D.rest, y: p.y + REST[i % 5]![1] * D.rest, vx: 0, vy: 0, cd: 0 }));
}

/** 틱마다: 드론 움직임·찌르기 */
export function dronesTick(s: RunState): void {
  const p = s.player;
  if ((p.bjDrones?.length ?? 0) !== D.n) resetDrones(s);
  // 가까운 차례로 나눠 맡음
  const foes: [EnemyState, number][] = [];
  for (const e of s.enemies) {
    if (!bjAlive(e)) continue;
    const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
    if (d <= (D.seek + e.r) ** 2) foes.push([e, d]);
  }
  foes.sort((a, b) => a[1] - b[1] || a[0].id - b[0].id);
  p.bjDrones!.forEach((d, i) => {
    if (d.cd > 0) d.cd--;
    const e = foes.length ? foes[i % foes.length]![0] : null;
    const tx = e ? e.x : p.x + REST[i % 5]![0] * D.rest;
    const ty = e ? e.y : p.y + REST[i % 5]![1] * D.rest;
    const dx = tx - d.x;
    const dy = ty - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    // 찌른 바로 뒤에는 방향을 틀지 않고 곧게 지나감
    if (!(e && d.cd > D.cd - D.pass)) {
      d.vx += (dx / dist) * D.turn;
      d.vy += (dy / dist) * D.turn;
    }
    const top = e ? D.speed : Math.min(D.speed, dist * 0.25 + p.stats.moveSpeed);
    const v = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
    if (v > top) {
      d.vx *= top / v;
      d.vy *= top / v;
    }
    d.x += d.vx;
    d.y += d.vy;
    if (e && d.cd <= 0 && (e.x - d.x) ** 2 + (e.y - d.y) ** 2 <= (e.r + 5) ** 2) {
      d.cd = D.cd;
      bjHit(s, e, p.stats.damage * D.mul);
      addEffect(s, { kind: "bjDroneHit", x: d.x, y: d.y, dirX: d.vx, dirY: d.vy, size: 6, maxTicks: 8 });
    }
  });
}
