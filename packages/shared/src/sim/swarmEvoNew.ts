// 광야의 새벽 각성 기술 (둘째 묶음 10개): 검기 셋 · 벽에 튕기는 마력 화살 · 거대한 마력 화살 · 맵을 가르는 일직선 베기 · 저주 안개(독·불·느려짐)
// 부채 사격 · 연쇄 번개 · 블랙홀(빨아들였다 터짐) · 빛기둥 · 돌아오는 부메랑. 지금 run.player 기준 (swarmEvo가 나눠 부름)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { ENEMIES } from "../content";
import { blastAt, dotDamage, ignite } from "./combat";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, normalize } from "./util";

export type SwarmSkill2 = "wave" | "bounce" | "lance" | "cleave" | "curse" | "fan" | "chain" | "vortex" | "pillar" | "boomerang";

/** 수치: 주기(틱) · 수 · 피해 배율 · 크기 */
export const EVO2 = {
  wave: { every: 70, count: 3, mul: 1.2, speed: 3.6, range: 180 },
  bounce: { every: 90, count: 4, mul: 0.9, speed: 3.4, bounces: 4 },
  lance: { every: 110, mul: 3.5, speed: 4.2, r: 9 },
  cleave: { every: 130, mul: 2.2, w: 12 },
  curse: { every: 60, r: 70, mul: 0.5, slow: 60 },
  fan: { every: 45, count: 7, spread: 0.13, mul: 0.6, speed: 4 },
  chain: { every: 85, jumps: 6, reach: 70, mul: 1.1 },
  vortex: { every: 160, r: 80, pull: 0.08, ticks: 50, mul: 2.5 },
  pillar: { every: 100, count: 4, r: 22, mul: 1.6 },
  boomerang: { every: 75, mul: 1.3, speed: 3.2, span: 40 },
};

const alive = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.svBox);
const boss = (e: EnemyState) => !!ENEMIES[e.kind].boss;

function nearestTo(s: RunState, x: number, y: number, skip: ReadonlySet<number> = new Set()): EnemyState | undefined {
  return alive(s)
    .filter((e) => !skip.has(e.id))
    .sort((a, b) => dist2(a, { x, y }) - dist2(b, { x, y }) || a.id - b.id)[0];
}

/** 나에게서 a 방향(라디안)으로 탄 하나 */
function fire(s: RunState, a: number, speed: number, dmg: number, ticks: number, extra: Partial<ProjectileState>): void {
  const p = s.player;
  s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x, y: p.y, prevX: p.x, prevY: p.y, r: 3, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, damage: dmg, ticksLeft: ticks, ...extra });
}

/** 가까운 적 쪽 각도 (없으면 바라보는 쪽) */
function aim(s: RunState): number {
  const p = s.player;
  const e = nearestTo(s, p.x, p.y);
  return e ? Math.atan2(e.y - p.y, e.x - p.x) : Math.atan2(p.faceY, p.faceX);
}

/** 블랙홀: 남은 틱 동안 둘레 적을 빨아들이고 끝나면 터짐 */
function vortexTick(s: RunState, dmg: number): void {
  // 광야의 새벽은 판에, 던전(제단의 방 증강)은 플레이어에 블랙홀 하나
  const sw: { vortex?: { x: number; y: number; t: number } } = s.swarm ?? (s.player.augVortex ??= {});
  const v = sw.vortex;
  if (!v) return;
  const K = EVO2.vortex;
  for (const e of alive(s)) {
    if (boss(e) || dist2(e, v) > K.r * K.r) continue;
    e.x += (v.x - e.x) * K.pull;
    e.y += (v.y - e.y) * K.pull;
  }
  if (--v.t > 0) return;
  blastAt(s, v.x, v.y, K.r * 0.6, dmg * K.mul, { still: true });
  addEffect(s, { kind: "dark", x: v.x, y: v.y, dirX: 0, dirY: 0, size: K.r * 0.6, maxTicks: 20 });
  delete sw.vortex;
}

/** 틱마다 (각성 기술이 둘째 묶음이면) */
export function evoSkill2(s: RunState, skill: SwarmSkill2): void {
  const p = s.player;
  const dmg = p.stats.damage;
  const t = s.tick;
  if (skill === "vortex") vortexTick(s, dmg);
  const K = EVO2[skill];
  if (t % K.every) return;
  switch (skill) {
    case "wave": {
      // 앞으로 크게 날아가는 검기 셋 (모두 꿰뚫음)
      const a = aim(s);
      for (const d of [-0.25, 0, 0.25]) fire(s, a + d, EVO2.wave.speed, dmg * EVO2.wave.mul, Math.ceil(EVO2.wave.range / EVO2.wave.speed), { r: 6, pierce: 99, hitIds: [], spirit: "crescent", tint: "#bfe8ff", ghost: true });
      return;
    }
    case "bounce":
      // 사방으로 벽에 튕기는 마력 화살
      for (let i = 0; i < EVO2.bounce.count; i++) fire(s, (i / EVO2.bounce.count) * Math.PI * 2 + t * 0.02, EVO2.bounce.speed, dmg * EVO2.bounce.mul, 200, { bounces: EVO2.bounce.bounces, pierce: 3, hitIds: [], tint: "#c8a8ff" });
      return;
    case "lance":
      // 거대한 마력 화살: 크고 느리게 모두 꿰뚫음
      fire(s, aim(s), EVO2.lance.speed, dmg * EVO2.lance.mul, 90, { r: EVO2.lance.r, pierce: 99, hitIds: [], tint: "#8ad8ff", ghost: true });
      return;
    case "cleave": {
      // 가까운 적을 지나 맵 끝에서 끝까지 한 줄로 벰
      const a = aim(s);
      const span = Math.hypot(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
      const ax = p.x - Math.cos(a) * span;
      const ay = p.y - Math.sin(a) * span;
      const bx = p.x + Math.cos(a) * span;
      const by = p.y + Math.sin(a) * span;
      const vx = bx - ax;
      const vy = by - ay;
      const l2 = vx * vx + vy * vy;
      for (const e of alive(s)) {
        const k = Math.max(0, Math.min(1, ((e.x - ax) * vx + (e.y - ay) * vy) / l2));
        if (Math.hypot(e.x - ax - vx * k, e.y - ay - vy * k) <= EVO2.cleave.w + e.r) dotDamage(s, e, "bleed", dmg * EVO2.cleave.mul);
      }
      addEffect(s, { kind: "slLine", x: ax, y: ay, dirX: 0, dirY: 0, size: EVO2.cleave.w, maxTicks: 16, toX: bx, toY: by });
      return;
    }
    case "curse":
      // 저주 안개: 둘레 적에게 독 · 불 · 느려짐
      for (const e of alive(s)) {
        if (dist2(e, p) > (EVO2.curse.r + e.r) ** 2) continue;
        dotDamage(s, e, "poison", dmg * EVO2.curse.mul);
        e.poisonTicks = Math.max(e.poisonTicks ?? 0, 120);
        e.poisonDmg = Math.max(e.poisonDmg ?? 0, dmg * EVO2.curse.mul);
        ignite(e, dmg * EVO2.curse.mul);
        if (!boss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, EVO2.curse.slow);
      }
      addEffect(s, { kind: "smGas", x: p.x, y: p.y, dirX: 0, dirY: 0, size: EVO2.curse.r, maxTicks: 30 });
      return;
    case "fan": {
      // 공격이 여러 갈래로: 가까운 적 쪽으로 부채꼴 일곱 발
      const a = aim(s);
      for (let i = 0; i < EVO2.fan.count; i++) fire(s, a + (i - (EVO2.fan.count - 1) / 2) * EVO2.fan.spread, EVO2.fan.speed, dmg * EVO2.fan.mul, 50, { tint: "#ffe070" });
      return;
    }
    case "chain": {
      // 연쇄 번개: 가까운 적에서 시작해 여섯 번 옮겨 감
      const hit = new Set<number>();
      let from = { x: p.x, y: p.y };
      for (let i = 0; i < EVO2.chain.jumps; i++) {
        const e = nearestTo(s, from.x, from.y, hit);
        if (!e || (i > 0 && dist2(e, from) > EVO2.chain.reach ** 2)) break;
        hit.add(e.id);
        dotDamage(s, e, "shock", dmg * EVO2.chain.mul);
        addEffect(s, { kind: "bolt", x: from.x, y: from.y, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: e.x, toY: e.y, width: 2 });
        from = { x: e.x, y: e.y };
      }
      return;
    }
    case "vortex": {
      // 블랙홀: 적이 가장 많은 곳 근처(가까운 적 자리)에 열림
      const sw: { vortex?: { x: number; y: number; t: number } } = s.swarm ?? (p.augVortex ??= {});
      const e = nearestTo(s, p.x, p.y);
      if (!e || sw.vortex) return;
      sw.vortex = { x: e.x, y: e.y, t: EVO2.vortex.ticks };
      addEffect(s, { kind: "dark", x: e.x, y: e.y, dirX: 0, dirY: 0, size: EVO2.vortex.r, maxTicks: EVO2.vortex.ticks });
      return;
    }
    case "pillar": {
      // 빛기둥: 가까운 적 넷 자리에 차례로 솟음
      const skip = new Set<number>();
      for (let i = 0; i < EVO2.pillar.count; i++) {
        const e = nearestTo(s, p.x, p.y, skip);
        if (!e) break;
        skip.add(e.id);
        blastAt(s, e.x, e.y, EVO2.pillar.r, dmg * EVO2.pillar.mul, { still: true });
        addEffect(s, { kind: "holy", x: e.x, y: e.y, dirX: 0, dirY: 0, size: EVO2.pillar.r, maxTicks: 20 });
      }
      return;
    }
    case "boomerang": {
      // 크게 돌며 날아갔다가 돌아오는 부메랑 (모두 꿰뚫음)
      const d = normalize(Math.cos(aim(s)), Math.sin(aim(s))) ?? [1, 0];
      fire(s, Math.atan2(d[1], d[0]), EVO2.boomerang.speed, dmg * EVO2.boomerang.mul, EVO2.boomerang.span, { r: 6, pierce: 99, hitIds: [], back: true, span: EVO2.boomerang.span, spirit: "chakram", ghost: true });
      return;
    }
  }
}
