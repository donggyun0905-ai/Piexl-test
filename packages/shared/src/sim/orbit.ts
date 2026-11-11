// 원소술사 회전체: 도는 자리 계산(삼각함수 없이 사칙연산만) · 닿으면 때리기 · 원소·행성 효과 · 날아가 때리는 검·별 · 은하수 장판·중력 둔화
// 공격 키로 쓰는 것(강철 총알·트리거·중력 내려찍기·갓 핸드)은 orbitAttack, 전깃줄·펫·탄 막기는 orbitPerks
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { blastAt as blastAt_, damageEnemy as damageEnemy_, ignite } from "./combat";
import { elementEffect, ELEMENTS, lightEffect, planetEffect, PLANETS, weaponDot, type Element, type Planet } from "./orbitElements";
import { updateHand } from "./orbitAttack";
import { flyK, flyStrikers, pickTarget } from "./orbitBlades";
import { guard, pet, wires } from "./orbitPerks";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, segDist2, weaponOf } from "./util";
const blastAt = srcFn("orbit", () => blastAt_), damageEnemy = srcFn("orbit", () => damageEnemy_);

export { segDist2 } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const V = {
  TAU: 6.283185307179586,
  /** 투사체 속도 1당 한 틱에 도는 각도 (라디안) */
  SPIN_PER_SPEED: 0.012,
  /** 결벽증: 맞은 뒤 (RUSH_TICKS) 이동 +30%, 도는 빠르기 2.5배 */
  RUSH_MOVE: 1.3,
  RUSH_SPIN: 2.5,
  /** 날아가 때리는 회전체의 다시 때리기 간격 배율 (날아가는 방식은 orbitBlades) */
  STRIKE_SLOW: 2,
  /** 은하수: 맞을 때 불이 붙을 확률 */
  GALAXY_BURN: 0.1,
  /** 화려하게 15% · 중력 안에 들어온 적 탄 빠르기 */
  FLASHY_CHANCE: 0.15,
  GRAVITY_SHOT: 0.5,
  /** 은하수: 안에 있는 적에게 이 틱마다 스택 1, 다 차면 빅뱅 (반경 · 공격력 배율) */
  GALAXY_EVERY: 3,
  GALAXY_MAX: 100,
  BANG_R: 50,
  BANG_MUL: 10,
  /** 웨폰 마스터: 차례(불·물·번개·땅·풀) 중 앞의 몇 원소가 날아가는 검인지 (나머지는 몸 둘레를 지킴) */
  BLADE_FLY: 3,
};
export { V as ORBIT_RULES };

export { ELEMENTS, PLANETS, type Element, type Planet } from "./orbitElements";

export interface OrbBody {
  x: number;
  y: number;
  r: number;
  /** 몇 번째 고리 (별똥별: 0 안쪽 · 1 가운데 · 2 바깥) */
  ring: number;
  tag: Element | Planet | "plain" | "light" | "blade" | "star" | "steel" | "pet";
  /** 닿아서 때리지 않고 날아가 때림 (웨폰 마스터 검·별똥별 바깥 고리) */
  striker?: boolean;
  /** 날아간 검·별이 돌아올 제자리 */
  homeX?: number;
  homeY?: number;
}

/** 웨폰 마스터 검 원소 (날아가는 셋 → 지키는 둘) */
const BLADE_TAGS: readonly Element[] = ["fire", "water", "thunder", "earth", "grass"];

/** 닿아 있는 동안 틱 피해 간격 (0.15초) */
export const ORB_TICK = 9;

function roll(s: RunState, ...labels: (string | number)[]): number {
  return createRng(deriveSeed(s.seed, ...labels, s.tick)).nextFloat();
}

type Vec = [number, number];
const mulV = (a: Vec, b: Vec): Vec => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];

/** 작은 각도 a만큼 돌리는 [cos, sin] (테일러 급수, 기기마다 같은 결과) */
function smallRot(a: number): Vec {
  const a2 = a * a;
  return [1 - a2 / 2 + (a2 * a2) / 24, a - (a * a2) / 6 + (a * a2 * a2) / 120];
}

/** 아무 각도: 16등분해 돌린 뒤 네 번 제곱 */
export function rot(a: number): Vec {
  let v = smallRot(a / 16);
  for (let i = 0; i < 4; i++) v = mulV(v, v);
  return v;
}

const spacing = new Map<number, Vec>();
function step(n: number): Vec {
  let v = spacing.get(n);
  if (!v) spacing.set(n, (v = rot(V.TAU / n)));
  return v;
}

/** 무기 구슬 수 + 천지창조 개수 */
export function orbCount(p: PlayerState): number {
  return (weaponOf(p).orbs ?? 0) + p.passives.filter((id) => id === "genesis").length;
}

/** 지금 회전체 자리 (cx·cy = 몸 중심). 그리기도 같은 함수를 씀 */
export function orbBodies(p: PlayerState, cx: number, cy: number, tick: number): OrbBody[] {
  const w = weaponOf(p);
  if (w.kind !== "orbit") return [];
  const dir: Vec = p.orbDir ?? [1, 0];
  const out: OrbBody[] = [];
  const ring = (n: number, R: number, d: Vec, r: number, ringNo: number, tag: (i: number) => OrbBody["tag"], striker = false) => {
    if (n <= 0) return;
    let v = d;
    const st = step(n);
    for (let i = 0; i < n; i++) {
      out.push({ x: cx + v[0] * R, y: cy + v[1] * R, r, ring: ringNo, tag: tag(i), ...(striker ? { striker } : {}) });
      v = mulV(v, st);
    }
  };
  const n = orbCount(p);
  const R = w.ringR ?? p.stats.range;
  switch (w.orbit) {
    case "elements":
      ring(n, R, dir, 3, 0, (i) => ELEMENTS[i % ELEMENTS.length]!);
      break;
    case "light":
      ring(n, R, dir, 2, 0, () => "light");
      break;
    case "planets":
      ring(n, R, dir, 4, 0, (i) => PLANETS[i % PLANETS.length]!);
      break;
    case "blades": {
      // 웨폰 마스터: 검은 불→물→번개→땅→풀 차례로 늘어남 (천지창조로 6번째부터 다시 불부터).
      // 날아가는 원소(앞의 BLADE_FLY개: 불·물·번개)는 몸 위에 떠 있다가 적에게 날아가 때리고,
      // 나머지(땅·풀)는 날아가지 않고 몸 둘레를 빠르게 돌며 탄을 막고 붙은 적을 벰
      const tags = Array.from({ length: n }, (_, i) => BLADE_TAGS[i % BLADE_TAGS.length]!);
      const flies = (t: Element) => BLADE_TAGS.indexOf(t) < V.BLADE_FLY;
      const fly = tags.filter(flies);
      const guard = tags.filter((t) => !flies(t));
      ring(fly.length, R, [0, -1], 5, 0, (i) => fly[i]!, true);
      const d2 = mulV(dir, dir);
      ring(guard.length, R + 8, mulV(d2, d2), 5, 1, (i) => guard[i]!);
      for (const b of out) if (b.ring === 1) b.striker = false;
      break;
    }
    case "stars": {
      // 안쪽 3개는 제자리에서 돎, 가운데 4개는 거꾸로 돌며 넓게 퍼졌다 돌아옴 (3초), 바깥 5개는 각자 적에게 날아갔다 돌아옴
      const t = (tick % 180) / 90;
      const pulse = t < 1 ? t : 2 - t;
      ring(n, R, dir, 2, 0, () => "star");
      ring(4, R + 8 + 34 * pulse, [dir[0], -dir[1]], 2, 1, () => "star");
      ring(5, R + 30, mulV(dir, dir), 2, 2, () => "star", true);
      break;
    }
    case "steel":
      ring(n, R, dir, 3, 0, () => "steel");
      break;
    case "trigger":
      ring(p.loaded ?? n, R, dir, 2.5, 0, () => "plain");
      break;
    default:
      break;
  }
  // 날아가는 검·별: 별은 제자리에서 노리는 적까지 갔다가 돌아옴 · 검은 자유롭게 날아다니는 자리 (orbitBlades)
  for (const f of p.flyers ?? []) {
    const b = out[f.i];
    if (!b?.striker) continue;
    b.homeX = b.x;
    b.homeY = b.y;
    if (f.px !== undefined) {
      b.x = f.px;
      b.y = f.py!;
      continue;
    }
    const k = flyK(f, b.tag);
    b.x += (f.x - b.x) * k;
    b.y += (f.y - b.y) * k;
  }
  if (hasPerk(p, "pet")) out.push({ x: cx - dir[0] * (R + 10), y: cy + dir[1] * (R + 10), r: 3, ring: 9, tag: "pet" });
  return out;
}

/** 결벽증으로 빨라진 이동 속도 배율 */
export function orbitMoveMul(p: PlayerState): number {
  return (p.rushTicks ?? 0) > 0 ? V.RUSH_MOVE : 1;
}

/** 회전체 하나가 적을 때림 */
export function orbHit(s: RunState, b: OrbBody, e: EnemyState, dmg: number): void {
  const dir = normalize(e.x - b.x, e.y - b.y) ?? [1, 0];
  damageEnemy(s, e, dmg, dir[0], dir[1]);
  orbEffect(s, b, e, dmg);
}

/** 회전체 효과만 (원소·행성·빛 경직·화려하게). dmg = 공격 한 번 피해 기준 */
function orbEffect(s: RunState, b: OrbBody, e: EnemyState, dmg: number): void {
  const dir = normalize(e.x - b.x, e.y - b.y) ?? [1, 0];
  if ((ELEMENTS as readonly string[]).includes(b.tag)) elementEffect(s, e, b.tag as Element, dmg, dir[0], dir[1]);
  else if ((PLANETS as readonly string[]).includes(b.tag)) planetEffect(s, e, b.tag as Planet, dmg, dir[0], dir[1]);
  else if (b.tag === "star") weaponDot(s, e, "storm", dmg);
  else if (b.tag === "light") lightEffect(s, e, dmg, roll(s, "lightBurst", e.id));
  // 화려하게: 가끔 원소 효과 하나 더
  if (hasPerk(s.player, "flashy") && roll(s, "flashy", e.id) < V.FLASHY_CHANCE) srcRun(s, "flashy", () => {
    elementEffect(s, e, ELEMENTS[Math.floor(roll(s, "flashyEl", e.id) * ELEMENTS.length)]!, dmg, dir[0], dir[1]);
  });
}

/** 회전체 틱 피해: 0.15초마다 공격력 × 공격 속도 × 0.15 (밀지 않음) */
function tickHit(s: RunState, e: EnemyState, dmg: number): void {
  if (s.tick - (e.orbDmgTick ?? -ORB_TICK) < ORB_TICK) return;
  e.orbDmgTick = s.tick;
  const x = e.x;
  const y = e.y;
  damageEnemy(s, e, (dmg * s.player.stats.attackSpeed * ORB_TICK) / TICK_RATE, 0, 0);
  e.x = x;
  e.y = y;
}

/** 틱마다 (원소술사 무기를 들었을 때) */
export function updateOrbit(s: RunState): void {
  const p = s.player;
  const w = weaponOf(p);
  if ((p.rushTicks ?? 0) > 0) p.rushTicks = (p.rushTicks ?? 0) - 1;
  if (w.kind !== "orbit") return;
  // 돌리기 (길이를 다시 1로 맞춰 오차가 쌓이지 않게)
  const a = p.stats.projectileSpeed * V.SPIN_PER_SPEED * ((p.rushTicks ?? 0) > 0 ? V.RUSH_SPIN : 1);
  const d = mulV(p.orbDir ?? [1, 0], smallRot(a));
  p.orbDir = normalize(d[0], d[1]) ?? [1, 0];
  // 트리거 재장전: 기본보다 빨리 돌수록 그만큼 빨리 참 (느려져도 기본보다 늦지는 않음)
  if ((p.reloadTicks ?? 0) > 0) {
    p.reloadTicks = Math.max(0, p.reloadTicks! - Math.max(1, a / (w.projectileSpeed * V.SPIN_PER_SPEED)));
    if (p.reloadTicks === 0) p.loaded = orbCount(p);
  }
  updateHand(s);

  const dmg = p.stats.damage;
  const interval = Math.max(1, Math.round(TICK_RATE / p.stats.attackSpeed));
  const bodies = orbBodies(p, p.x, p.y, s.tick);
  const cd = p.orbCd ?? [];
  while (cd.length < Math.max(1, bodies.length)) cd.push(0);
  cd.length = Math.max(1, bodies.length);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  p.orbCd = cd;

  flyStrikers(s, bodies, dmg);
  const touched = new Map<EnemyState, OrbBody>();
  bodies.forEach((b, i) => {
    // 펫은 탄만, 트리거 구슬은 쏘는 탄으로만 씀
    if (cd[i]! > 0 || b.tag === "pet" || w.orbit === "trigger") return;
    if (b.striker) {
      // 날아가는 검·별은 닿아서 때리는 것보다 두 배 느리게 (사거리 안 어디든 맞히므로)
      if ((p.flyers ?? []).some((f) => f.i === i)) return;
      const e = pickTarget(s, b);
      if (!e) return;
      (p.flyers ??= []).push({ i, id: e.id, t: 0, x: e.x, y: e.y });
      cd[i] = interval * V.STRIKE_SLOW;
      return;
    }
    // 몸에서 구슬까지 잇는 선 전체가 휩쓸고 지나감 (몸에 붙은 적도 맞게)
    for (const o of s.enemies) if (o.hp > 0 && !touched.has(o) && segDist2(o, p, b) < (o.r + b.r) * (o.r + b.r)) touched.set(o, b);
  });
  // 닿아 있는 동안 0.15초마다 틱 피해 (초당 피해 = 공격력 × 공격 속도), 원소 효과는 공격 속도 간격마다 한 번
  // 별똥별은 틱 피해 대신 공격 속도 간격마다 공격력만큼 한 번
  const stars = w.orbit === "stars";
  for (const [e, b] of touched) {
    if (!stars) tickHit(s, e, dmg);
    if (s.tick - (e.orbHitTick ?? -interval) < interval) continue;
    e.orbHitTick = s.tick;
    if (stars) orbHit(s, b, e, dmg);
    else orbEffect(s, b, e, dmg);
  }

  if (w.orbit === "galaxy") {
    // 은하수: 사거리 안 모든 적에게 틱 피해, 공격 속도 간격마다 가끔 불 · 안에 있는 동안 스택이 쌓여 다 차면 빅뱅
    const burn = cd[0] === 0;
    if (burn) cd[0] = interval;
    for (const e of s.enemies) {
      const rr = p.stats.range + e.r;
      if (e.hp <= 0 || dist2(e, p) > rr * rr) continue;
      tickHit(s, e, dmg);
      if (burn && roll(s, "galaxy", e.id) < V.GALAXY_BURN) ignite(e, dmg);
      if (burn) weaponDot(s, e, "voidbolt", dmg);
      if (s.tick % V.GALAXY_EVERY === 0 && (e.galaxy = (e.galaxy ?? 0) + 1) >= V.GALAXY_MAX) {
        e.galaxy = 0;
        blastAt(s, e.x, e.y, V.BANG_R, dmg * V.BANG_MUL, { still: true });
        addEffect(s, { kind: "elBang", x: e.x, y: e.y, dirX: 0, dirY: 0, size: V.BANG_R, maxTicks: 40 });
      }
    }
  } else if (w.orbit === "gravity") {
    // 중력: 사거리 안 적이 느려짐 (보스 제외는 적 쪽에서)
    for (const e of s.enemies) {
      const rr = p.stats.range + e.r;
      if (dist2(e, p) <= rr * rr) e.slowTicks = Math.max(e.slowTicks ?? 0, 2);
    }
    // 들어온 적 탄도 느려짐 (한 번만)
    const r2 = p.stats.range * p.stats.range;
    for (const pr of s.projectiles) {
      if (pr.fromPlayer || pr.slowed || dist2(pr, p) > r2) continue;
      pr.slowed = true;
      pr.vx *= V.GRAVITY_SHOT;
      pr.vy *= V.GRAVITY_SHOT;
    }
  }
  wires(s, bodies, dmg);
  pet(s, bodies, dmg);
  guard(s, bodies, dmg);
}
