// 펑크(테라코어, 시즌 2): 네온과 크롬으로 몸을 바꾼 여자. 사이버 무기 10 + 몸에 심는 능력(전용 아이템) 10
// 신경 가속: 맞힐 때마다 게이지가 차고, 가득 차면 다음 대시에 켜짐 → 둘레의 시간이 느려지고(적·적 탄) 내 공격이 빨라지며 잔상이 남음
// 수치는 weaponsPunk.PUNK, 아이템은 itemsPunk
import { TICK_RATE } from "../constants";
import { PUNK_PERKS as K } from "../itemsPunk";
import { createRng, deriveSeed } from "../rng";
import { PUNK as P, type CyberStyle } from "../weaponsPunk";
import { nearest } from "./brawlMoves";
import { blastAt, dotDamage, healPlayer } from "./combat";
import { alive, fan, inCircle, inCone, inLine, shoot, strike, stun } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, markCrit, weaponOf } from "./util";

const styleOf = (p: PlayerState): CyberStyle => weaponOf(p).cyber ?? { move: "slash", reach: 30 };
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 피하 장갑: 받는 피해 (classTaken) */
export const punkTaken = (p: PlayerState) => (p.characterId === "punk" && hasPerk(p, "cySkin") ? K.cySkin.taken : 1);
/** 신경 가속 게이지 0~1 · 켜져 있는지 (화면용) */
export const punkGauge = (p: PlayerState) => Math.min(1, (p.cyGauge ?? 0) / P.gaugeMax);
export const punkAccel = (p: PlayerState) => (p.cyAccel ?? 0) > 0;

/** 맞힌 수만큼 게이지 · 혈액 정화기 */
function landed(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0) return;
  if (!punkAccel(p)) p.cyGauge = Math.min(P.gaugeMax, (p.cyGauge ?? 0) + n * (hasPerk(p, "cyCharge") ? K.cyCharge.mul : 1));
  if (hasPerk(p, "cyLeech")) {
    p.cyHits = (p.cyHits ?? 0) + n;
    while (p.cyHits >= K.cyLeech.every) {
      p.cyHits -= K.cyLeech.every;
      healPlayer(s, K.cyLeech.heal);
    }
  }
}

/** 탄이 맞았을 때 (s2Hits) */
export function punkShotHit(s: RunState, _pr: ProjectileState, _e: EnemyState): void {
  if (s.player.characterId === "punk") landed(s, 1);
}

/** 여러 적을 맞힘 (치명타면 표시) */
function hitAll(s: RunState, list: EnemyState[], dmg: number, crit: boolean, push = 0, stunT = 0): void {
  for (const e of list) {
    strike(s, e, dmg, push);
    if (stunT) stun(e, stunT);
    if (crit) markCrit(s, e);
  }
  landed(s, list.length);
}

/** 한 번 공격 (mul: 잔상이면 절반) */
function attack(s: RunState, mul: number): void {
  const p = s.player;
  const st = styleOf(p);
  const crit = hasPerk(p, "cyOptics") && roll(s, "cyCrit", mul) < K.cyOptics.chance;
  const dmg = p.stats.damage * mul * (crit ? K.cyOptics.mul : 1) * (punkAccel(p) && hasPerk(p, "cyBerserk") ? K.cyBerserk.mul : 1);
  const fx = (kind: "cySlash" | "cyWire" | "cyMantis" | "cyPunch" | "cySpin", size: number) => addEffect(s, { kind, x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size, maxTicks: 12, width: mul < 1 ? 1 : 0 });
  switch (st.move) {
    case "slash":
      hitAll(s, inCone(s, st.reach, 0.2), dmg, crit);
      fx("cySlash", st.reach);
      break;
    case "wire": {
      const hit = inLine(s, st.reach, 4);
      hitAll(s, hit, dmg, crit);
      for (const e of hit) dotDamage(s, e, "bleed", dmg * P.bleedMul);
      fx("cyWire", st.reach);
      break;
    }
    case "mantis":
      hitAll(s, inCone(s, st.reach, -0.3), dmg, crit);
      fx("cyMantis", st.reach);
      break;
    case "gorilla":
      hitAll(s, inCone(s, st.reach, 0.3), dmg, crit, st.push ?? 0);
      fx("cyPunch", st.reach);
      break;
    case "spin":
      hitAll(s, inCircle(s, p.x, p.y, st.reach), dmg, crit, 3);
      fx("cySpin", st.reach);
      break;
    case "pierce":
      hitAll(s, inLine(s, st.reach, 3), dmg, crit);
      addEffect(s, { kind: "adBeam", x: p.x, y: p.y - 3, dirX: p.faceX, dirY: p.faceY, size: 2, toX: p.x + p.faceX * st.reach, toY: p.y - 3 + p.faceY * st.reach, maxTicks: 10, tint: "#ff4ad8" });
      break;
    case "hack": {
      const list = alive(s)
        .filter((e) => dist2(e, p) <= (st.reach + e.r) ** 2)
        .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)
        .slice(0, st.n ?? 3);
      hitAll(s, list, dmg, crit, 0, st.stun ?? 0);
      for (const e of list) addEffect(s, { kind: "cyHack", x: p.x, y: p.y - 8, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: 16 });
      break;
    }
    case "smart":
      for (let i = 0; i < (st.n ?? 3); i++) {
        shoot(s, (i - ((st.n ?? 3) - 1) / 2) * 0.35, { damage: dmg, spirit: "cyBullet", range: st.reach, speed: 3.2 });
        s.projectiles[s.projectiles.length - 1]!.homing = true;
      }
      break;
    case "shotgun":
      fan(s, st.n ?? 6, 0.12, { damage: dmg, spirit: "cyBullet", range: st.reach });
      break;
    case "emp": {
      const t = nearest(s, p.stats.range * 1.2);
      const x = t ? t.x : p.x + p.faceX * p.stats.range * 0.6;
      const y = t ? t.y : p.y + p.faceY * p.stats.range * 0.6;
      (p.cyEmp ??= []).push({ x, y, sx: p.x, sy: p.y - 6, t: P.empFuse, dmg });
      break;
    }
  }
}

/** 이동 속도 배율: 빠른 몸 · 신경 가속 중 훨씬 빠름 */
export function punkMoveMul(p: PlayerState): number {
  if (p.characterId !== "punk") return 1;
  return P.baseMove * (punkAccel(p) ? P.accelMove : 1);
}

/** 신경 가속 중: 적이 이번 틱을 쉬는지 (일반 적은 네 틱 중 세 틱, 보스는 두 틱 중 한 틱 쉼) */
export function timeSlowed(s: RunState, boss: boolean): boolean {
  if (!punkAccel(s.player)) return false;
  return s.tick % (boss ? P.bossEvery : P.slowEvery) !== 0;
}

/** 신경 가속 켜기 (게이지가 가득일 때 대시하면) · 광학 위장 */
function onDash(s: RunState): void {
  const p = s.player;
  if (hasPerk(p, "cyCloak")) p.invulnTicks = Math.max(p.invulnTicks, K.cyCloak.ticks);
  if ((p.cyGauge ?? 0) < P.gaugeMax || punkAccel(p)) return;
  p.cyGauge = 0;
  p.cyAccel = Math.round(P.accelTicks * (hasPerk(p, "cyBoost") ? K.cyBoost.mul : 1));
  addEffect(s, { kind: "cyAccel", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 24 });
}

/** 신경 가속 중: 적과 적 탄이 느려짐 (끝나면 탄은 원래 빠르기로) · 잔상 자리 */
function accel(s: RunState): void {
  const p = s.player;
  if (!punkAccel(p)) return;
  p.cyAccel!--;
  // 무적
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  const frozen = new Set(p.cyFrozen ?? []);
  for (const pr of s.projectiles) {
    if (pr.fromPlayer || frozen.has(pr.id)) continue;
    pr.vx *= P.shotSlow;
    pr.vy *= P.shotSlow;
    pr.ticksLeft = Math.ceil(pr.ticksLeft / P.shotSlow);
    frozen.add(pr.id);
  }
  if (s.tick % 3 === 0) p.cyTrail = [...(p.cyTrail ?? []), { x: p.x, y: p.y }].slice(-6);
  if (p.cyAccel! > 0) {
    p.cyFrozen = [...frozen];
    return;
  }
  for (const pr of s.projectiles) if (frozen.has(pr.id)) {
    pr.vx /= P.shotSlow;
    pr.vy /= P.shotSlow;
    pr.ticksLeft = Math.ceil(pr.ticksLeft * P.shotSlow);
  }
  delete p.cyFrozen;
  delete p.cyTrail;
}

/** EMP 수류탄이 날아가 터짐 */
function emps(s: RunState): void {
  const p = s.player;
  if (!p.cyEmp?.length) return;
  const st = styleOf(p);
  for (const g of p.cyEmp) {
    if (--g.t > 0) continue;
    const list = inCircle(s, g.x, g.y, st.reach);
    blastAt(s, g.x, g.y, st.reach, g.dmg, { still: true });
    for (const e of list) stun(e, st.stun ?? 40);
    landed(s, list.length);
    addEffect(s, { kind: "cyEmp", x: g.x, y: g.y, dirX: 0, dirY: 0, size: st.reach, maxTicks: 20 });
  }
  p.cyEmp = p.cyEmp.filter((g) => g.t > 0);
}

/** 틱마다 (펑크 무기를 들었을 때 player에서) */
export function punkTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.dashTicks > 0 && !p.cyDash) onDash(s);
  p.cyDash = p.dashTicks > 0;
  accel(s);
  emps(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / (speed * (punkAccel(p) ? P.accelSpeed : 1))));
  p.attackCount++;
  attack(s, 1);
  if (punkAccel(p) && hasPerk(p, "cyEcho")) attack(s, K.cyEcho.mul);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetPunk(p: PlayerState): void {
  for (const k of ["cyGauge", "cyAccel", "cyFrozen", "cyTrail", "cyEmp", "cyHits"] as const) delete p[k];
}
