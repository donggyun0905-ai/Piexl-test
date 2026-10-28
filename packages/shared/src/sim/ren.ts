// 렌(비르디아): 맨손으로 거대한 토목을 부림. 공격마다 차례로 타격 → 묶기 → 날려버리기 → 짓뭉개기 → 가두기 (넓고 세지만 느림)
// 둘레를 도는 수호 토목: 부딪힌 적에게 조금씩 피해 · 원거리 탄은 확률로 막음 (몸으로 부딪히는 공격은 못 막음). 수치는 weaponsRen.REN, 아이템은 itemsRen
import { PW_PASSIVE } from "../paewangPassive";
import { TICK_RATE } from "../constants";
import { REN_PERKS as K } from "../itemsRen";
import { createRng, deriveSeed } from "../rng";
import { REN as R, REN_MOVES, type RenMove } from "../weaponsRen";
import { blastAt, dotDamage, healPlayer } from "./combat";
import { alive, inCircle, isBoss, root, stun, strike } from "./s2Kit";
import { earthAttack, earthTick } from "./renEarth";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk } from "./util";

/** 수호 토목 수 · 자리 (그리기도 씀) */
export const renGuards = (p: PlayerState) => R.guards + (hasPerk(p, "renGuardPlus") ? K.renGuardPlus.guards : 0);
export function guardSpots(p: PlayerState, tick: number): { x: number; y: number }[] {
  const n = renGuards(p);
  return Array.from({ length: n }, (_, i) => {
    const a = tick * 0.06 + (i * Math.PI * 2) / n;
    return { x: p.x + Math.cos(a) * R.guardR, y: p.y - 3 + Math.sin(a) * R.guardR * 0.8 };
  });
}

/** 적 탄이 닿을 때 (projectiles): 확률로 막음. 막았으면 true */
/** 몸으로 부딪히는 근접 공격 피해: 렌은 원거리 탄을 막는 대신 2배로 받음 */
export const renMelee = (s: RunState, dmg: number): number => (s.player.characterId === "ren" ? dmg * R.meleeTaken : dmg);

export function renBlock(s: RunState, pr: ProjectileState): boolean {
  const p = s.player;
  if (p.characterId !== "ren") return false;
  const chance = s.pvp ? PW_PASSIVE.renBlock : hasPerk(p, "renWall") ? K.renWall.block : R.block;
  if (createRng(deriveSeed(s.seed, "renBlock", pr.id, s.tick)).nextFloat() >= chance) return false;
  addEffect(s, { kind: "hit", x: pr.x, y: pr.y, dirX: 0, dirY: 0, size: 5, maxTicks: 8, tint: "#c8a060" });
  if (hasPerk(p, "renRegrow")) healPlayer(s, K.renRegrow.heal);
  if (hasPerk(p, "renReflect")) {
    // 쏜 적 쪽으로 되돌려 보냄 (내 탄이 됨)
    s.projectiles.push({ ...pr, id: s.nextId++, fromPlayer: true, vx: -pr.vx, vy: -pr.vy, damage: p.stats.damage * K.renReflect.mul, ticksLeft: 90, pierce: 0, hitIds: [] });
  }
  return true;
}

/** 토목 한 번 (move: 차례, at: 떨어지는 자리) */
function slam(s: RunState, move: RenMove, x: number, y: number, mulAll = 1): void {
  const p = s.player;
  const r = R.slamR * (hasPerk(p, "renBigger") ? K.renBigger.r : 1);
  const base = p.stats.damage * R.mul[move] * mulAll;
  for (const e of inCircle(s, x, y, r)) {
    const dmg = base * (isBoss(e) && hasPerk(p, "renHeavy") ? K.renHeavy.mul : 1);
    strike(s, e, dmg, move === "launch" ? R.launchPush : 0);
    if (move === "bind") root(e, R.bindTicks * (hasPerk(p, "renBindLong") ? K.renBindLong.mul : 1));
    if (move === "crush" && hasPerk(p, "renCrushStun")) stun(e, K.renCrushStun.ticks);
    if (move === "prison" && !isBoss(e) && e.kind !== "dummy") {
      stun(e, R.prisonTicks);
      e.renJail = R.prisonTicks;
    }
  }
  addEffect(s, { kind: "renSlam", x, y, dirX: REN_MOVES.indexOf(move), dirY: 0, size: r, maxTicks: 20 });
  if (hasPerk(p, "renQuake")) s.pendingBlasts.push({ tick: s.tick + K.renQuake.delay, x, y, radius: r * 0.8, damage: base * K.renQuake.mul });
}

/** 토목이 떨어질 자리: 사거리 안 가장 가까운 적, 없으면 바라보는 쪽 */
function aim(s: RunState): { x: number; y: number } {
  const p = s.player;
  const e = alive(s)
    .filter((t) => dist2(t, p) <= p.stats.range ** 2)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
  return e ? { x: e.x, y: e.y } : { x: p.x + p.faceX * p.stats.range * 0.6, y: p.y + p.faceY * p.stats.range * 0.6 };
}

/** 갇힌 적: 갇힌 동안 피해 · 풀릴 때 터짐 */
function jails(s: RunState): void {
  const p = s.player;
  for (const e of s.enemies) {
    if (!e.renJail) continue;
    e.renJail--;
    if (hasPerk(p, "renPrisonDmg") && e.renJail % 30 === 0) dotDamage(s, e, "rot", p.stats.damage * K.renPrisonDmg.per);
    if (e.renJail > 0) continue;
    delete e.renJail;
    if (hasPerk(p, "renBurstPrison")) blastAt(s, e.x, e.y, K.renBurstPrison.r, p.stats.damage * K.renBurstPrison.mul, { push: 8 });
  }
}

/** 수호 토목이 부딪힌 적 */
function guardHits(s: RunState): void {
  const p = s.player;
  if (s.tick % R.guardEvery !== 0) return;
  const dmg = p.stats.damage * R.guardMul * (hasPerk(p, "renThorn") ? K.renThorn.mul : 1);
  const hit = new Set<EnemyState>();
  for (const g of guardSpots(p, s.tick)) for (const e of inCircle(s, g.x, g.y, 4)) hit.add(e);
  for (const e of hit) strike(s, e, dmg, 3);
}

/** 틱마다 (맨손 토목을 들었을 때 player에서) */
export function renTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  jails(s);
  guardHits(s);
  earthTick(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const i = p.rMove ?? 0;
  const at = aim(s);
  slam(s, REN_MOVES[i] ?? "strike", at.x, at.y);
  earthAttack(s, at.x, at.y);
  p.rMove = (i + 1) % REN_MOVES.length;
  // 대지 붕괴: 한 바퀴를 다 돌면 사거리 안 모든 적에게
  if (p.rMove === 0 && hasPerk(p, "renCollapse")) {
    for (const e of alive(s).filter((t) => dist2(t, p) <= p.stats.range ** 2)) slam(s, "crush", e.x, e.y, K.renCollapse.mul / R.mul.crush);
  }
}

/** 연습장 등에서 다시 시작할 때 */
export function resetRen(p: PlayerState): void {
  for (const k of ["rMove", "rWyrms", "rStones", "rDrop"] as const) delete p[k];
}
