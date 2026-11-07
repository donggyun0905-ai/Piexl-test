// 비르디아 동행형 정령 (sim/factionSpirit가 부름): 내 곁이 아닌 따로 움직이며 싸움 (맞지 않음 · 방이 바뀌면 내 옆으로)
// 숲늑대: 가까운 적에게 달려가 물어뜯음 · 부엉이: 내 둘레를 날다 가장 튼튼한 적에게 급강하 폭발 · 이끼 골렘: 느리게 걸어가 땅을 내려찍어 둘레 피해 + 속박 (수치 spiritDefs.SPIRIT_ALLY)
import { ENEMIES } from "../content";
import { SPIRIT_ALLY as A } from "../spiritDefs";
import { blastAt, damageEnemy } from "./combat";
import { spiritPower } from "./factionSpirit";
import { rot } from "./orbit";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

const live = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.immune);
function nearestTo(s: RunState, x: number, y: number): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of live(s)) {
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d < bd) [best, bd] = [e, d];
  }
  return best;
}

/** 목표 쪽으로 걸음 (방 안으로) · 닿았는지 */
function walk(s: RunState, c: { x: number; y: number }, tx: number, ty: number, speed: number, reach: number): boolean {
  const d = Math.hypot(tx - c.x, ty - c.y);
  if (d <= reach) return true;
  const [dx, dy] = normalize(tx - c.x, ty - c.y) ?? [0, 0];
  const b = { x: c.x + dx * Math.min(speed, d - reach), y: c.y + dy * Math.min(speed, d - reach), prevX: c.x, prevY: c.y, r: 4 };
  keepInRoom(b, roomGrid(s));
  c.x = b.x;
  c.y = b.y;
  return false;
}

export function allyTick(s: RunState): void {
  const p = s.player;
  const id = p.fcSp;
  if (id !== "wolf" && id !== "owl" && id !== "golem") return;
  const c = (p.fcCo ??= { x: p.x + 16, y: p.y, cd: 30, a: 0 });
  // 너무 멀어지면(방을 옮김) 내 옆으로
  if (Math.abs(c.x - p.x) > 400 || Math.abs(c.y - p.y) > 300) [c.x, c.y] = [p.x + 16, p.y];
  if (c.cd > 0) c.cd--;
  const pw = p.stats.damage * spiritPower(p);
  const foe = nearestTo(s, c.x, c.y);
  if (id === "wolf") {
    if (!foe) return void walk(s, c, p.x + 18, p.y + 6, A.wolfSpeed, 20);
    if (!walk(s, c, foe.x, foe.y, A.wolfSpeed, A.wolfReach + foe.r) || c.cd > 0) return;
    c.cd = A.wolfEvery;
    const [dx, dy] = normalize(foe.x - c.x, foe.y - c.y) ?? [1, 0];
    damageEnemy(s, foe, pw * A.wolfMul, dx, dy, false);
    addEffect(s, { kind: "fcSpBite", x: foe.x, y: foe.y, dirX: dx, dirY: dy, size: 8, maxTicks: 12 });
  } else if (id === "owl") {
    if (c.dive) {
      const done = walk(s, c, c.dive.x, c.dive.y, 5, 3) || --c.dive.t <= 0;
      if (!done) return;
      blastAt(s, c.x, c.y, A.owlR, pw * A.owlMul, { push: 6 });
      addEffect(s, { kind: "fcSpDive", x: c.x, y: c.y, dirX: 0, dirY: 0, size: A.owlR, maxTicks: 22 });
      delete c.dive;
      c.cd = A.owlEvery;
      return;
    }
    c.a = (c.a + 0.03) % 6.283185307179586;
    const [ox, oy] = rot(c.a);
    walk(s, c, p.x + ox * A.owlOrbit, p.y + oy * A.owlOrbit * 0.6 - 10, 3, 1);
    if (c.cd > 0 || !foe) return;
    const big = live(s).reduce((a, e) => (e.hp > a.hp ? e : a), foe);
    c.dive = { x: big.x, y: big.y, t: 60 };
  } else {
    if (!foe) return void walk(s, c, p.x - 18, p.y + 6, A.golemSpeed, 20);
    if (!walk(s, c, foe.x, foe.y, A.golemSpeed, A.golemReach) || c.cd > 0) return;
    c.cd = A.golemEvery;
    for (const e of live(s)) if ((e.x - c.x) ** 2 + (e.y - c.y) ** 2 <= (A.golemR + e.r) ** 2 && !ENEMIES[e.kind].boss) e.rootTicks = Math.max(e.rootTicks ?? 0, A.golemRoot);
    blastAt(s, c.x, c.y, A.golemR, pw * A.golemMul, { push: 0 });
    addEffect(s, { kind: "fcSpStomp", x: c.x, y: c.y, dirX: 0, dirY: 0, size: A.golemR, maxTicks: 24 });
  }
}
