// 운명의 여행자(히든, 시즌 2): 운명의 활로 모아 쏘는 강한 한 발. 모래시계가 다 차면 뒤집히며 주사위를 굴려 운명(버프·기술·능력)이 바뀜
// 주사위 하나면 첫 눈의 줄(6칸)에서 시드로 한 칸, 두 개의 주사위면 (첫 눈, 둘째 눈) 칸 그대로 · 눈의 합만큼 한 발이 세짐
// 수치는 weaponsVoyager.VOYAGER, 운명 표는 voyagerFates, 기술은 voyagerSkills, 능력은 voyagerAbilities
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { VOYAGER_PERKS as K } from "../itemsVoyager";
import { createRng, deriveSeed } from "../rng";
import { FATES, type BuffKind } from "../voyagerFates";
import { VOYAGER as V } from "../weaponsVoyager";
import { nearest } from "./brawlMoves";
import { blastAt as blastAt_, healPlayer } from "./combat";
import { alive, isBoss, strike as strike_, stun } from "./s2Kit";
import type { VoyagerFateState } from "./secretTypes";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, hasPerk, normalize } from "./util";
import { abilityTick, abilityVal } from "./voyagerAbilities";
import { fireSkill, tickVolley } from "./voyagerSkills";
const blastAt = srcFn("voyager", () => blastAt_), strike = srcFn("voyager", () => strike_);

const isVoyager = (p: PlayerState) => p.characterId === "voyager";
/** 배율처럼 곱하는 버프 (축복이면 늘어난 만큼 두 배) */
const MULS: BuffKind[] = ["mul", "boss", "first", "giant"];

/** 지금 운명의 버프 값 (그 종류가 아니면 null) · 여섯 눈의 축복이면 두 배 */
export function buffVal(p: PlayerState, kind: BuffKind): number | null {
  const f = p.vyFate;
  if (!f) return null;
  const [k, v] = FATES[f.i]!.buff;
  if (k !== kind) return null;
  if (!f.blessed) return v;
  return kind === "quick" ? v * v : MULS.includes(kind) ? 1 + (v - 1) * K.vyBlessing.mul : v * K.vyBlessing.mul;
}

/** 화면용: 모래시계 0~1 · 모은 정도 0~1 */
export const voyagerGlass = (p: PlayerState) => Math.min(1, (p.vyGlass ?? 0) / V.glass);
export const voyagerCharge = (p: PlayerState, speed: number) => Math.min(1, (p.vyCharge ?? 0) / chargeNeed(p, speed));

/** 끝까지 모으는 틱 (공격 속도 · 질긴 시위 · 순풍 버프) */
function chargeNeed(p: PlayerState, speed: number): number {
  return Math.max(6, Math.round((V.charge / Math.max(0.1, speed)) * (hasPerk(p, "vyString") ? K.vyString.mul : 1) * (buffVal(p, "quick") ?? 1)));
}

/** 주사위 굴리기 (시드 · 몇 번째 뒤집힘) */
function rollFate(s: RunState): VoyagerFateState {
  const p = s.player;
  const r = createRng(deriveSeed(s.seed, "vyDice", p.vyFlips ?? 0));
  const die = () => (hasPerk(p, "vyLoadedDie") ? 2 + Math.floor(r.nextFloat() * 5) : 1 + Math.floor(r.nextFloat() * 6));
  const d1 = die();
  const bless = hasPerk(p, "vyBlessing");
  if (hasPerk(p, "vyTwinDice")) {
    const d2 = die();
    return { i: (d1 - 1) * 6 + d2 - 1, dice: [d1, d2], pips: d1 + d2, ...(bless && d1 === d2 ? { blessed: true } : {}) };
  }
  return { i: (d1 - 1) * 6 + Math.floor(r.nextFloat() * 6), dice: [d1], pips: d1, ...(bless && d1 === 6 ? { blessed: true } : {}) };
}

/** 모래시계 뒤집기: 이전 운명은 사라지고(운명 붙잡기면 능력만 남음) 새 운명 */
function flip(s: RunState): void {
  const p = s.player;
  if (hasPerk(p, "vyKeepFate") && p.vyFate) p.vyPrev = p.vyFate;
  else delete p.vyPrev;
  p.vyFate = rollFate(s);
  p.vyFlips = (p.vyFlips ?? 0) + 1;
  p.vyGlass = 0;
  p.vyFirst = true;
  p.vyCd = {};
  if (hasPerk(p, "vyHomeward")) {
    healPlayer(s, p.stats.maxHp * K.vyHomeward.heal);
    p.shieldPts = (p.shieldPts ?? 0) + K.vyHomeward.shield;
  }
  addEffect(s, { kind: "vyFlip", x: p.x, y: p.y, dirX: p.vyFate.i, dirY: p.vyFate.pips, size: 30, maxTicks: 150 });
}

/** 노리는 적 쪽으로 돌아섬 */
function faceTarget(s: RunState): void {
  const p = s.player;
  const e = nearest(s, p.stats.range + 40);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
}

/** 한 발 쏘기: 모은 만큼 · 눈의 합 · 버프(배율·첫 발·치명·크기) · 올빼미 능력 → 기술대로 */
function loose(s: RunState, frac: number): void {
  const p = s.player;
  faceTarget(s);
  const full = frac >= 1;
  let dmg = p.stats.damage * (V.baseMul + V.chargeMul * frac) * (full ? V.fullMul : 1) * (1 + (p.vyFate?.pips ?? 0) * V.pip);
  dmg *= (buffVal(p, "mul") ?? 1) * (buffVal(p, "giant") ? 1.3 : 1) * (abilityVal(s, "owl") ?? 1);
  if (p.vyFirst) dmg *= buffVal(p, "first") ?? 1;
  p.vyFirst = false;
  const crit = buffVal(p, "crit");
  if (crit && createRng(deriveSeed(s.seed, "vyCrit", s.tick)).nextFloat() < crit) {
    dmg *= 3;
    addEffect(s, { kind: "vyCrit", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 10, maxTicks: 20 });
  }
  fireSkill(s, dmg, full);
  // 화살통: 끝까지 모은 한 발이 하나 더
  if (full && hasPerk(p, "vyQuiver")) srcRun(s, "vyQuiver", () => fireSkill(s, dmg * 0.6, false, K.vyQuiver.spread));
  addEffect(s, { kind: "vyLoose", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: 6 + frac * 10, maxTicks: 12 });
}

/** 운명의 화살이 맞았을 때: 버프(끝내기·보스·폭발·약화·기절·흡혈) · 약화된 적은 더 아픔 (s2Hits) */
export function voyagerShotHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  if (pr.spirit !== "vyArrow" && pr.spirit !== "vyMagic" && pr.spirit !== "vyChain") return;
  const p = s.player;
  if ((e.vyShredT ?? 0) > s.tick) strike(s, e, pr.damage * (e.vyShred ?? 0));
  const boss = buffVal(p, "boss");
  if (boss && isBoss(e)) strike(s, e, pr.damage * (boss - 1));
  const exe = buffVal(p, "execute");
  if (exe && !isBoss(e) && e.hp > 0 && e.hp < e.maxHp * exe) {
    e.hp = 0;
    addEffect(s, { kind: "vyCrit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: 20 });
  }
  const blast = buffVal(p, "blast");
  if (blast) blastAt(s, e.x, e.y, blast, pr.damage * 0.5, { exclude: e });
  const shred = buffVal(p, "shred");
  if (shred) {
    e.vyShredT = s.tick + 300;
    e.vyShred = shred;
  }
  const st = buffVal(p, "stun");
  if (st) stun(e, st);
  const leech = buffVal(p, "leech");
  if (leech) healPlayer(s, pr.damage * leech);
  if (pr.spirit === "vyChain") chain(s, e, pr.damage);
}

/** 번개처럼 옮겨 붙음 (기술 chain: n번) */
function chain(s: RunState, from: EnemyState, dmg: number): void {
  const p = s.player;
  const fate = p.vyFate ? FATES[p.vyFate.i]! : null;
  const n = fate?.skill[0] === "chain" ? fate.skill[1] : 3;
  const hit = [from.id];
  let at = from;
  for (let i = 0; i < n; i++) {
    const next = alive(s)
      .filter((e) => !hit.includes(e.id))
      .sort((a, b) => Math.hypot(a.x - at.x, a.y - at.y) - Math.hypot(b.x - at.x, b.y - at.y))[0];
    if (!next || Math.hypot(next.x - at.x, next.y - at.y) > 120) break;
    strike(s, next, dmg * 0.7);
    addEffect(s, { kind: "vyChain", x: at.x, y: at.y, dirX: 0, dirY: 0, size: 2, toX: next.x, toY: next.y, maxTicks: 12 });
    hit.push(next.id);
    at = next;
  }
}

/** 틱마다 (운명의 활을 들었을 때 player에서) */
export function voyagerTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (!isVoyager(p)) return;
  if (!p.vyFate) flip(s);
  p.vyGlass = (p.vyGlass ?? 0) + (hasPerk(p, "vySandglass") ? K.vySandglass.mul : 1);
  if (p.vyGlass >= V.glass) flip(s);
  abilityTick(s);
  tickVolley(s);
  if (p.attackCooldown > 0 || p.dashTicks > 0) return;
  const need = chargeNeed(p, speed);
  if (want) {
    p.vyCharge = Math.min(need, (p.vyCharge ?? 0) + 1);
    if (p.vyCharge < need) return;
  } else if (!p.vyCharge) return;
  const frac = (p.vyCharge ?? 0) / need;
  p.vyCharge = 0;
  if (frac < V.minCharge) return;
  p.attackCooldown = Math.max(1, Math.round((V.rest * TICK_RATE) / 60));
  p.attackCount++;
  loose(s, frac);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetVoyager(p: PlayerState): void {
  for (const k of ["vyGlass", "vyFate", "vyPrev", "vyFlips", "vyCharge", "vyFirst", "vyVolley", "vyMarks", "vyCd", "vySeen"] as const) delete p[k];
}

/** 이동 속도: 모으는 동안 느려짐(뱃사람의 걸음은 안 느려짐) · 빠른 걸음 능력 */
export function voyagerMoveMul(p: PlayerState): number {
  if (!isVoyager(p)) return 1;
  const slow = (p.vyCharge ?? 0) > 0 && !hasPerk(p, "vySeaLegs") ? V.chargeMove : 1;
  return slow * swiftOf(p);
}
function swiftOf(p: PlayerState): number {
  let m = 1;
  for (const f of [p.vyFate, p.vyPrev]) {
    const a = f && FATES[f.i]!.ability;
    if (a?.[0] === "swift") m *= a[1];
  }
  return m;
}
