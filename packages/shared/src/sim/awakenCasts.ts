// 각성 증강 기술 15가지 (꼬리표마다 하나, 대기 시간은 buildAwaken) · 그림은 효과 "awaken" (motif = 꼬리표, from = 모양)
import { AWAKEN as A } from "../buildSetDefs";
import { ENEMIES } from "../enemyDefs";
import type { ItemTag } from "../itemsTags";
import { createRng, deriveSeed } from "../rng";
import type { AwField } from "./buildAwaken";
import { damageEnemy, healPlayer } from "./combat";
import { raiseShield } from "./imugiMods";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, DIR16 } from "./util";

type Opt = { toX?: number; toY?: number; width?: number };
const boss = (e: EnemyState) => !!ENEMIES[e.kind].boss;
const live = (s: RunState) => s.enemies.filter((e) => e.hp > 0 && !e.immune);
const rngOf = (s: RunState, tag: string) => createRng(deriveSeed(s.seed, "awaken", tag, s.tick));

/** 각성 그림 한 장 */
function fx(s: RunState, tag: ItemTag, from: string, x: number, y: number, size: number, ticks: number, o: Opt = {}): void {
  addEffect(s, { kind: "awaken", motif: tag, from, x, y, dirX: 0, dirY: 0, size, maxTicks: ticks, ...o });
}

/** 공격력 배율 피해 */
const hurt = (s: RunState, e: EnemyState, mul: number) => damageEnemy(s, e, s.player.stats.damage * mul, 0, 0, false);

/** 둥근 범위 안 (ir: 안쪽은 빼고) 적마다 */
function area(s: RunState, x: number, y: number, r: number, fn: (e: EnemyState) => void, ir = 0): void {
  for (const e of live(s)) {
    const d = dist2(e, { x, y });
    if (d <= (r + e.r) ** 2 && d >= ir * ir) fn(e);
  }
}

/** 가까운 적 (없으면 플레이어 자리) */
function nearest(s: RunState, x = s.player.x, y = s.player.y, skip: number[] = [], range = A.range): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = range * range;
  for (const e of live(s)) {
    const d = dist2(e, { x, y });
    if (!skip.includes(e.id) && d <= bd) [best, bd] = [e, d];
  }
  return best;
}

/** 범위 안 적 중 n번 고르기 (적이 적으면 겹쳐 고름) */
function targets(s: RunState, tag: ItemTag, n: number): EnemyState[] {
  const p = s.player;
  const near = live(s).filter((e) => dist2(e, p) <= A.range ** 2);
  if (!near.length) return [];
  const rng = rngOf(s, tag);
  return Array.from({ length: n }, (_, i) => (i < near.length ? near[i]! : near[rng.int(0, near.length - 1)]!));
}

const push = (s: RunState, f: AwField) => (s.player.awFields ??= []).push(f);

/** 떨어지는 공격 n개 (delay 틱 뒤, 하나씩 gap 틱 늦게) */
function rain(s: RunState, tag: ItemTag, from: string, n: number, r: number, delay: number, gap: number, ticks = 18): void {
  targets(s, tag, n).forEach((e, i) => {
    const at = delay + i * gap;
    push(s, { tag, x: e.x, y: e.y, r, end: s.tick + at });
    fx(s, tag, from, e.x, e.y, r, at + ticks, { width: at });
  });
}

/** 깔리는 장판 */
function field(s: RunState, tag: ItemTag, x: number, y: number, c: { r: number; ticks: number; every: number }, o: Partial<AwField> = {}): void {
  push(s, { tag, x, y, r: c.r, end: s.tick + c.ticks, next: s.tick + c.every, every: c.every, ...o });
}

export const CASTS: Record<ItemTag, (s: RunState) => void> = {
  ice(s) {
    const e = nearest(s) ?? s.player;
    field(s, "ice", e.x, e.y, A.ice);
    fx(s, "ice", "field", e.x, e.y, A.ice.r, A.ice.ticks);
  },
  fire: (s) => rain(s, "fire", "meteor", A.fire.n, A.fire.r, A.fire.delay, 5, 22),
  bolt(s) {
    const p = s.player;
    let from = { x: p.x, y: p.y - 8 };
    const hit: number[] = [];
    for (let i = 0; i < A.bolt.jumps; i++) {
      const e = nearest(s, from.x, from.y, hit, i === 0 ? A.range : A.bolt.range);
      if (!e) break;
      hit.push(e.id);
      fx(s, "bolt", "zap", from.x, from.y, 3, 18 + i * 2, { toX: e.x, toY: e.y });
      hurt(s, e, A.bolt.dmg);
      from = { x: e.x, y: e.y };
    }
  },
  poison(s) {
    const e = nearest(s) ?? s.player;
    field(s, "poison", e.x, e.y, A.poison);
    fx(s, "poison", "field", e.x, e.y, A.poison.r, A.poison.ticks);
  },
  light(s) {
    const p = s.player;
    healPlayer(s, p.stats.maxHp * A.light.heal);
    fx(s, "light", "halo", p.x, p.y, 40, 40);
    rain(s, "light", "pillar", A.light.n, A.light.r, A.light.delay, 4, 20);
  },
  dark(s) {
    const e = nearest(s) ?? s.player;
    field(s, "dark", e.x, e.y, A.dark);
    fx(s, "dark", "field", e.x, e.y, A.dark.r, A.dark.ticks);
  },
  death(s) {
    const p = s.player;
    fx(s, "death", "scythe", p.x, p.y, A.death.r, 34);
    area(s, p.x, p.y, A.death.r, (e) => {
      if (!boss(e) && e.kind !== "dummy" && e.hp < e.maxHp * A.death.exec) e.hp = 0;
      else hurt(s, e, A.death.dmg);
    });
  },
  earth(s) {
    const p = s.player;
    const E = A.earth;
    for (let i = 0; i < E.rings; i++) push(s, { tag: "earth", x: p.x, y: p.y, r: E.gap * (i + 1), ir: E.gap * i, end: s.tick + E.step * (i + 1) });
    fx(s, "earth", "quake", p.x, p.y, E.gap * E.rings, E.step * E.rings + 36, { width: E.step });
  },
  water(s) {
    const p = s.player;
    const e = nearest(s);
    const d = Math.sqrt(e ? dist2(e, p) : 0) || 1;
    const [dx, dy] = e ? [(e.x - p.x) / d, (e.y - p.y) / d] : [p.faceX || 1, 0];
    field(s, "water", p.x, p.y, { r: A.water.w / 2, ticks: A.water.ticks, every: 2 }, { dx, dy, start: s.tick, hit: [] });
    fx(s, "water", "wave", p.x, p.y, A.water.w, A.water.ticks, { toX: p.x + dx * A.water.len, toY: p.y + dy * A.water.len });
  },
  sharp: (s) => rain(s, "sharp", "sword", A.sharp.n, A.sharp.r, A.sharp.delay, 3, 16),
  tough(s) {
    const p = s.player;
    raiseShield(p, p.stats.maxHp * A.tough.shield, p.stats.maxHp * A.tough.shield * 2);
    field(s, "tough", p.x, p.y, A.tough);
    fx(s, "tough", "dome", p.x, p.y, A.tough.r, 36);
  },
  wind(s) {
    const p = s.player;
    const e = nearest(s);
    const d = Math.sqrt(e ? dist2(e, p) : 0) || 1;
    const [vx, vy] = e ? [((e.x - p.x) / d) * A.wind.speed, ((e.y - p.y) / d) * A.wind.speed] : [A.wind.speed, 0];
    field(s, "wind", p.x, p.y, A.wind, { vx, vy });
    fx(s, "wind", "cyclone", p.x, p.y, A.wind.r, A.wind.ticks, { toX: p.x + vx * A.wind.ticks, toY: p.y + vy * A.wind.ticks });
  },
  luck: (s) => rain(s, "luck", "coin", A.luck.n, A.luck.r, A.luck.delay, 3, 16),
  summon(s) {
    const p = s.player;
    field(s, "summon", p.x, p.y - 4, { r: 18, ticks: A.summon.ticks, every: A.summon.every });
    fx(s, "summon", "totem", p.x, p.y - 4, 18, A.summon.ticks);
  },
  blood(s) {
    const p = s.player;
    fx(s, "blood", "moon", p.x, p.y - 46, 16, 70);
    rain(s, "blood", "spike", A.blood.n, A.blood.r, A.blood.delay, 4, 20);
  },
};

/** 틱마다 장판: 회오리 움직임 · 심연 끌어당김 · 요새는 플레이어를 따라감 · 해일 물결 */
export function fieldTick(s: RunState, f: AwField): void {
  const p = s.player;
  if (f.vx || f.vy) [f.x, f.y] = [f.x + (f.vx ?? 0), f.y + (f.vy ?? 0)];
  if (f.tag === "tough") [f.x, f.y] = [p.x, p.y];
  if (f.tag === "dark")
    area(s, f.x, f.y, f.r, (e) => {
      if (boss(e) || e.kind === "dummy") return;
      const d = Math.sqrt(dist2(e, f)) || 1;
      const k = Math.min(d, A.dark.pull) / d;
      [e.x, e.y] = [e.x + (f.x - e.x) * k, e.y + (f.y - e.y) * k];
    });
}

/** 장판 맥박 (every 틱마다) */
export function fieldPulse(s: RunState, f: AwField): void {
  const p = s.player;
  switch (f.tag) {
    case "ice":
      return area(s, f.x, f.y, f.r, (e) => {
        hurt(s, e, A.ice.dmg);
        if (!boss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, A.ice.slow);
      });
    case "poison":
      return area(s, f.x, f.y, f.r, (e) => {
        hurt(s, e, A.poison.dmg);
        e.poisonTicks = Math.max(e.poisonTicks ?? 0, 60);
        e.poisonDmg = Math.max(e.poisonDmg ?? 0, p.stats.damage * A.poison.poison);
      });
    case "dark":
      return area(s, f.x, f.y, f.r, (e) => hurt(s, e, A.dark.dmg));
    case "tough":
      fx(s, "tough", "dome", f.x, f.y, f.r, 36);
      return area(s, f.x, f.y, f.r, (e) => hurt(s, e, A.tough.dmg));
    case "wind":
      return area(s, f.x, f.y, f.r, (e) => hurt(s, e, A.wind.dmg));
    case "summon":
      for (let k = 0; k < A.summon.n; k++) {
        const [ox, oy] = DIR16[(k * 5 + Math.floor(s.tick / 4)) % 16]!;
        const at = { x: f.x + ox * 16, y: f.y + oy * 16 };
        const e = nearest(s, at.x, at.y, [], A.summon.range);
        if (!e) return;
        fx(s, "summon", "zap", at.x, at.y, 2, 16, { toX: e.x, toY: e.y });
        hurt(s, e, A.summon.dmg);
      }
      return;
    case "water": {
      // 물결 앞자리: 시작 자리에서 나아간 거리
      const along = (A.water.len * (s.tick - (f.start ?? s.tick))) / A.water.ticks;
      for (const e of live(s)) {
        if (f.hit?.includes(e.id)) continue;
        const rx = e.x - f.x;
        const ry = e.y - f.y;
        const a = rx * (f.dx ?? 1) + ry * (f.dy ?? 0);
        const side = Math.abs(rx * (f.dy ?? 0) - ry * (f.dx ?? 1));
        if (Math.abs(a - along) > 16 + e.r || side > f.r + e.r) continue;
        f.hit?.push(e.id);
        hurt(s, e, A.water.dmg);
        if (!boss(e) && e.kind !== "dummy") [e.x, e.y] = [e.x + (f.dx ?? 1) * A.water.push, e.y + (f.dy ?? 0) * A.water.push];
      }
    }
  }
}

/** 떨어지는 공격이 닿음 (유성·빛기둥·칼·금화·피의 가시·대지 고리) */
export function strike(s: RunState, f: AwField): void {
  const p = s.player;
  const rng = rngOf(s, `${f.tag}${f.x | 0}`);
  switch (f.tag) {
    case "fire":
      return area(s, f.x, f.y, f.r, (e) => {
        hurt(s, e, A.fire.dmg);
        ignite(e, p.stats.damage);
      });
    case "light":
      return area(s, f.x, f.y, f.r, (e) => hurt(s, e, A.light.dmg));
    case "sharp":
      return area(s, f.x, f.y, f.r, (e) => hurt(s, e, A.sharp.dmg));
    case "luck":
      return area(s, f.x, f.y, f.r, (e) => hurt(s, e, A.luck.dmg * (rng.nextFloat() < A.luck.crit ? 3 : 1)));
    case "blood":
      return area(s, f.x, f.y, f.r, (e) => {
        const before = e.hp;
        hurt(s, e, A.blood.dmg);
        healPlayer(s, Math.max(0, before - e.hp) * A.blood.leech);
      });
    case "earth":
      return area(
        s,
        f.x,
        f.y,
        f.r,
        (e) => {
          hurt(s, e, A.earth.dmg);
          e.stunTicks = Math.max(e.stunTicks ?? 0, boss(e) ? A.earth.stun / 3 : A.earth.stun);
        },
        f.ir,
      );
  }
}
