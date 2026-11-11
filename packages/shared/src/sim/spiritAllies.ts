// 비르디아 동행형 정령 (sim/factionSpirit가 부름): 내 곁이 아닌 따로 움직이며 싸움 (맞지 않음 · 방이 바뀌면 내 옆으로)
// 숲늑대: 가까운 적에게 달려가 물어뜯음 · 부엉이: 내 둘레를 날며 깃털을 날림(궁극체는 가장 튼튼한 적에게 급강하 폭발) · 이끼 골렘: 느리게 걸어가 땅을 내려찍어 둘레 피해(궁극체는 + 속박)
// 유년기는 고정 피해 1 · 단계마다 간격·피해가 다름 (수치 spiritDefs.SPIRIT_ALLY)
import { logDmg } from "./dmgSrc";
import { ENEMIES } from "../content";
import { SPIRIT_ALLY as A } from "../spiritDefs";
import { blastAt, damageEnemy } from "./combat";
import { spiritStage } from "./factionSpirit";
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

/** 유년기: 고정 피해 (배율 없이 그대로) */
function poke(s: RunState, e: EnemyState): void {
  e.hp -= A.fixed;
  logDmg(s, e, A.fixed);
  e.hitFlash = Math.max(e.hitFlash, 3);
}

/** 부엉이 깃털: 가장 가까운 적 쪽으로 n개 부채꼴 */
function feathers(s: RunState, c: { x: number; y: number }, foe: EnemyState, n: number, dmg: number): void {
  const [dx, dy] = normalize(foe.x - c.x, foe.y - c.y) ?? [1, 0];
  const speed = 3.6;
  for (let i = 0; i < n; i++) {
    const [ox, oy] = rot((i - (n - 1) / 2) * 0.18);
    const vx = dx * ox - dy * oy;
    const vy = dx * oy + dy * ox;
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: c.x, y: c.y, prevX: c.x, prevY: c.y, r: 2.5, vx: vx * speed, vy: vy * speed, damage: dmg, ticksLeft: Math.ceil(A.owlRange / speed), spirit: "feather" });
  }
  addEffect(s, { kind: "fcSpFeather", x: c.x, y: c.y, dirX: dx, dirY: dy, size: 8, maxTicks: 12 });
}

export function allyTick(s: RunState): void {
  const p = s.player;
  const id = p.fcSp;
  if (id !== "wolf" && id !== "owl" && id !== "golem") return;
  const c = (p.fcCo ??= { x: p.x + 16, y: p.y, cd: 30, a: 0 });
  // 너무 멀어지면(방을 옮김) 내 옆으로
  if (Math.abs(c.x - p.x) > 400 || Math.abs(c.y - p.y) > 300) [c.x, c.y] = [p.x + 16, p.y];
  if (c.cd > 0) c.cd--;
  const st = spiritStage(p);
  const pw = p.stats.damage;
  const foe = nearestTo(s, c.x, c.y);
  if (id === "wolf") {
    if (!foe) return void walk(s, c, p.x + 18, p.y + 6, A.wolfSpeed, 20);
    if (!walk(s, c, foe.x, foe.y, A.wolfSpeed, A.wolfReach + foe.r) || c.cd > 0) return;
    c.cd = st >= 3 ? A.wolfEvery3 : st === 2 ? A.wolfEvery2 : A.wolfEvery1;
    const [dx, dy] = normalize(foe.x - c.x, foe.y - c.y) ?? [1, 0];
    if (st === 0) poke(s, foe);
    else damageEnemy(s, foe, pw * (st >= 3 ? A.wolfMul3 : st === 2 ? A.wolfMul2 : A.wolfMul1), dx, dy, false);
    addEffect(s, { kind: "fcSpBite", x: foe.x, y: foe.y, dirX: dx, dirY: dy, size: 8, maxTicks: 12 });
  } else if (id === "owl") {
    if (c.dive) {
      const done = walk(s, c, c.dive.x, c.dive.y, 5, 3) || --c.dive.t <= 0;
      if (!done) return;
      blastAt(s, c.x, c.y, A.owlR, pw * A.owlMul3, { push: 6 });
      addEffect(s, { kind: "fcSpDive", x: c.x, y: c.y, dirX: 0, dirY: 0, size: A.owlR, maxTicks: 22 });
      delete c.dive;
      c.cd = A.owlEvery3;
      return;
    }
    c.a = (c.a + 0.03) % 6.283185307179586;
    const [ox, oy] = rot(c.a);
    walk(s, c, p.x + ox * A.owlOrbit, p.y + oy * A.owlOrbit * 0.6 - 10, 3, 1);
    if (c.cd > 0 || !foe) return;
    if (st >= 3) {
      const big = live(s).reduce((a, e) => (e.hp > a.hp ? e : a), foe);
      c.dive = { x: big.x, y: big.y, t: 60 };
      return;
    }
    if ((foe.x - c.x) ** 2 + (foe.y - c.y) ** 2 > A.owlRange ** 2) return;
    c.cd = st === 2 ? A.owlEvery2 : A.owlEvery1;
    if (st === 0) {
      poke(s, foe);
      addEffect(s, { kind: "fcSpFeather", x: foe.x, y: foe.y, dirX: 0, dirY: 0, size: 6, maxTicks: 12 });
    } else feathers(s, c, foe, st === 2 ? A.owlN2 : A.owlN1, pw * (st === 2 ? A.owlMul2 : A.owlMul1));
  } else {
    if (!foe) return void walk(s, c, p.x - 18, p.y + 6, A.golemSpeed, 20);
    if (!walk(s, c, foe.x, foe.y, A.golemSpeed, A.golemReach) || c.cd > 0) return;
    c.cd = st >= 3 ? A.golemEvery3 : st === 2 ? A.golemEvery2 : A.golemEvery1;
    const near = live(s).filter((e) => (e.x - c.x) ** 2 + (e.y - c.y) ** 2 <= (A.golemR + e.r) ** 2);
    if (st >= 3) for (const e of near) if (!ENEMIES[e.kind].boss) e.rootTicks = Math.max(e.rootTicks ?? 0, A.golemRoot);
    if (st === 0) near.forEach((e) => poke(s, e));
    else blastAt(s, c.x, c.y, A.golemR, pw * (st >= 3 ? A.golemMul3 : st === 2 ? A.golemMul2 : A.golemMul1), { push: 0 });
    addEffect(s, { kind: "fcSpStomp", x: c.x, y: c.y, dirX: 0, dirY: 0, size: A.golemR, maxTicks: 24 });
  }
}
