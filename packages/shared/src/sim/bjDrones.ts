// 백인장 기본 패시브: 미니 창 드론 5기가 늘 적을 쫓아가 찌르고, 곧게 지나갔다가 돌아와 다시 찌름 (붉은 레이저 자국은 화면이 그림)
// 적이 없으면 몸 둘레에 떠 있음 · 벽은 넘어 다님
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { BJ_DRONE as D } from "../weaponsBaekinjang";
import { bjAlive, bjMarked, hasBj } from "./bjKit";
import { bjHit } from "./bjVolley";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

/** 쉴 때 자리 (몸 둘레 다섯 방향, 위쪽 반원) */
const REST: [number, number][] = [[-1, -0.2], [-0.7, -0.8], [0, -1.1], [0.7, -0.8], [1, -0.2]];

/** 드론 수 (편대 증설) · i번 드론이 쉴 자리 (다섯 방향, 여섯째부터는 바깥 줄) */
const count = (p: RunState["player"]) => (hasBj(p, "bjFleet") ? K.bjFleet.n : D.n);
const rest = (i: number): [number, number] => [REST[i % 5]![0] * D.rest * (i < 5 ? 1 : 1.6), REST[i % 5]![1] * D.rest * (i < 5 ? 1 : 1.6)];

/** 방이 바뀌었을 때 등: 드론을 몸 곁으로 */
export function resetDrones(s: RunState): void {
  const p = s.player;
  p.bjDrones = Array.from({ length: count(p) }, (_, i) => ({ x: p.x + rest(i)[0], y: p.y + rest(i)[1], vx: 0, vy: 0, cd: 0 }));
}

/** 틱마다: 드론 움직임·찌르기 */
export function dronesTick(s: RunState): void {
  const p = s.player;
  if ((p.bjDrones?.length ?? 0) !== count(p)) resetDrones(s);
  const heat = hasBj(p, "bjHeat");
  const [mul, wait] = [heat ? K.bjHeat.mul : D.mul, heat ? K.bjHeat.cd : D.cd];
  // 가까운 차례로 나눠 맡음
  const foes: [EnemyState, number][] = [];
  for (const e of s.enemies) {
    if (!bjAlive(e)) continue;
    const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
    if (d <= (D.seek + e.r) ** 2) foes.push([e, d]);
  }
  foes.sort((a, b) => a[1] - b[1] || a[0].id - b[0].id);
  // 표적 공유: 표식 붙은 적을 모두가 먼저 노림
  const mark = hasBj(p, "bjShare") ? foes.find(([e]) => bjMarked(s, e))?.[0] : undefined;
  p.bjDrones!.forEach((d, i) => {
    if (d.cd > 0) d.cd--;
    const e = mark ?? (foes.length ? foes[i % foes.length]![0] : null);
    const tx = e ? e.x : p.x + rest(i)[0];
    const ty = e ? e.y : p.y + rest(i)[1];
    const dx = tx - d.x;
    const dy = ty - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    // 찌른 바로 뒤에는 방향을 틀지 않고 곧게 지나감
    if (!(e && d.cd > wait - D.pass)) {
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
      d.cd = wait;
      bjHit(s, e, p.stats.damage * mul * (e === mark ? K.bjShare.mul : 1));
      if (hasBj(p, "bjStain")) {
        e.bjBleed = Math.max(e.bjBleed ?? 0, K.bjStain.ticks);
        e.bjBleedDmg = Math.max(e.bjBleedDmg ?? 0, p.stats.damage * K.bjStain.mul);
      }
      addEffect(s, { kind: "bjDroneHit", x: d.x, y: d.y, dirX: d.vx, dirY: d.vy, size: 6, maxTicks: 8 });
    }
  });
}
