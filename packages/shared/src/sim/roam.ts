// 따로 돌아다니는 분신 공용 (오토마타 자매 인형 · 풍류사 분신): 저마다 다른 적을 찾아가 그 둘레에 자리 잡음
// 나에게서 너무 멀어지면 빨리 돌아오고, 적이 없으면 내 둘레를 천천히 돎
import { alive } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import { dist2, keepInRoom, roomGrid } from "./util";

export interface RoamSpec {
  /** 나에게서 이 거리 안의 적만 고름 · 공격 사거리 · 적이 없을 때 내 둘레 거리 · 움직이는 빠르기 */
  leash: number;
  range: number;
  gap: number;
  speed: number;
}

/** 분신 하나(i번째, 모두 n) 한 틱 움직임. taken = 다른 분신이 이미 고른 적. 반환: 고른 적 */
export function roamStep(s: RunState, d: { x: number; y: number }, i: number, n: number, spec: RoamSpec, taken: Set<number>): EnemyState | undefined {
  const p = s.player;
  // 가까운 적 중 다른 분신이 고르지 않은 적 (없으면 아무 적)
  const near = alive(s)
    .filter((e) => dist2(e, p) <= spec.leash ** 2)
    .sort((a, b) => dist2(a, d) - dist2(b, d) || a.id - b.id);
  const e = near.find((o) => !taken.has(o.id)) ?? near[0];
  let tx: number;
  let ty: number;
  if (e) {
    taken.add(e.id);
    // 적에게서 사거리 반쯤 떨어진 자리로 (분신마다 다른 쪽에서)
    const a = Math.atan2(d.y - e.y, d.x - e.x) + (i - (n - 1) / 2) * 0.3;
    tx = e.x + Math.cos(a) * spec.range * 0.45;
    ty = e.y + Math.sin(a) * spec.range * 0.45;
  } else {
    const a = (i / n) * Math.PI * 2 + s.tick * 0.012;
    tx = p.x + Math.cos(a) * spec.gap;
    ty = p.y + Math.sin(a) * spec.gap;
  }
  const dd = Math.hypot(tx - d.x, ty - d.y);
  if (dd > 1) {
    const step = Math.min(dd, spec.speed * (dd > spec.leash ? 3 : 1));
    d.x += ((tx - d.x) / dd) * step;
    d.y += ((ty - d.y) / dd) * step;
  }
  // 방 밖·벽 안으로 나가지 않게
  const body = { x: d.x, y: d.y, prevX: d.x, prevY: d.y, r: 4 };
  keepInRoom(body, roomGrid(s));
  d.x = body.x;
  d.y = body.y;
  return e;
}
