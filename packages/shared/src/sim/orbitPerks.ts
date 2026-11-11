// 원소술사 회전체에 붙는 아이템 효과: 일렉트로닉 전깃줄 · 펫 유도탄 · 강철 구슬·지키는 검 막기·행운 튕기기 · 원소술사 탄
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { damageEnemy as damageEnemy_ } from "./combat";
import { segDist2, type OrbBody } from "./orbit";
import type { ProjectileState, RunState } from "./types";
import { addEffect, hasPerk, normalize, weaponOf } from "./util";
const damageEnemy = srcFn("orbitPerks", () => damageEnemy_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 전깃줄: 닿아 있는 동안 0.15초마다, 초당 공격력의 30% · 펫 (1초마다 50%) · 튕기기 30% */
  WIRE_TICKS: 9,
  WIRE_DPS: 0.3,
  PET_TICKS: 60,
  SIDE_MUL: 0.5,
  DEFLECT_CHANCE: 0.3,
};
export { R as ORBIT_PERKS_RULES };

const near2 = (a: { x: number; y: number }, b: { x: number; y: number }) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);

/** 일렉트로닉: 같은 고리의 이웃한 회전체 사이 전깃줄 */
export function wires(s: RunState, bodies: OrbBody[], dmg: number): void {
  const p = s.player;
  if (!hasPerk(p, "electronic")) return; return srcRun(s, "electronic", () => {
  p.wireCd = Math.max(0, (p.wireCd ?? 0) - 1);
  if (p.wireCd > 0) return;
  p.wireCd = R.WIRE_TICKS;
  const hit = new Set<number>();
  for (const [a, b] of wirePairs(bodies)) {
    for (const e of s.enemies) {
      if (e.hp <= 0 || hit.has(e.id) || segDist2(e, a, b) > (e.r + 2) * (e.r + 2)) continue;
      hit.add(e.id);
      damageEnemy(s, e, (dmg * R.WIRE_DPS * R.WIRE_TICKS) / TICK_RATE, 0, 0);
    }
  }
}); }

/** 전깃줄로 이을 쌍: 같은 고리에서 이웃한 것끼리 (펫 제외) */
export function wirePairs(bodies: OrbBody[]): [OrbBody, OrbBody][] {
  const out: [OrbBody, OrbBody][] = [];
  for (const ringNo of new Set(bodies.map((b) => b.ring))) {
    const list = bodies.filter((b) => b.ring === ringNo && b.tag !== "pet");
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) out.push([list[i]!, list[(i + 1) % list.length]!]);
  }
  return out;
}

/** 펫: 새빨간 회전체가 1초마다 가까운 적에게 유도탄 */
export function pet(s: RunState, bodies: OrbBody[], dmg: number): void {
  const p = s.player;
  const b = bodies.find((x) => x.tag === "pet");
  if (!b) return;
  p.petCd = Math.max(0, (p.petCd ?? 0) - 1);
  if (p.petCd > 0) return;
  const target = s.enemies.find((e) => e.hp > 0 && near2(e, b) <= 110 * 110);
  if (!target) return;
  p.petCd = R.PET_TICKS;
  const dir = normalize(target.x - b.x, target.y - b.y) ?? [1, 0];
  s.projectiles.push(orbShot(s, b.x, b.y, dir, 2.4, dmg * R.SIDE_MUL, "pet", { homing: true, ticksLeft: 90 }));
}

/** 원소술사가 쏘는 탄 하나 */
export function orbShot(s: RunState, x: number, y: number, dir: readonly [number, number], speed: number, dmg: number, spirit: ProjectileState["spirit"], extra: Partial<ProjectileState> = {}): ProjectileState {
  return { id: s.nextId++, fromPlayer: true, x, y, prevX: x, prevY: y, r: 2, vx: dir[0] * speed, vy: dir[1] * speed, damage: dmg, ticksLeft: 60, spirit, ...extra };
}

/** 적 탄이 회전체에 닿음: 강철 구슬·웨폰 마스터 풀 검은 막고, 행운이면 30% 튕겨 냄 */
export function guard(s: RunState, bodies: OrbBody[], dmg: number): void {
  const p = s.player;
  const w = weaponOf(p);
  const blockers = w.orbit === "steel" ? bodies.filter((b) => b.tag !== "pet") : w.orbit === "blades" ? bodies.filter((b) => !b.striker) : [];
  const lucky = hasPerk(p, "luckyDeflect");
  if (!blockers.length && !lucky) return;
  s.projectiles = s.projectiles.filter((pr) => {
    const touch = (b: OrbBody) => near2(pr, b) < (b.r + pr.r + 1) * (b.r + pr.r + 1);
    if (pr.fromPlayer || !bodies.some((b) => b.tag !== "pet" && touch(b))) return true;
    if (lucky && createRng(deriveSeed(s.seed, "deflect", pr.id)).nextFloat() < R.DEFLECT_CHANCE) {
      pr.fromPlayer = true;
      pr.vx = -pr.vx;
      pr.vy = -pr.vy;
      pr.damage = dmg;
      pr.ticksLeft = 90;
      addEffect(s, { kind: "hit", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 3, maxTicks: 6 });
      return true;
    }
    if (!blockers.some(touch)) return true;
    addEffect(s, { kind: "hit", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 3, maxTicks: 6 });
    return false;
  });
}
