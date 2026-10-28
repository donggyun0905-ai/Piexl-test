// 역병의사(헬리오스): 모기떼 · 연기 구역(독·불·죽음·부식) · 쥐떼(갉다가 20%로 흑사병, 걸리면 붙은 쥐가 터짐) · 죽음의 손아귀(20%로 즉사)
// 흑사병: 1초마다 최대 체력의 20% (보스는 최대 체력 1/5의 20%). 수치는 weaponsPlague.PLAGUE, 아이템은 itemsPlague
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, TICK_RATE } from "../constants";
import { ENEMIES } from "../content";
import { PLAGUE_PERKS as K } from "../itemsPlague";
import { createRng, deriveSeed } from "../rng";
import { PLAGUE as P, type PlagueKind } from "../weaponsPlague";
import { dotDamage, healPlayer, ignite } from "./combat";
import { alive, inCircle, inCone, poison, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";

const kindOf = (p: PlayerState): PlagueKind => weaponOf(p).plague ?? "swarm";
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();
const boss = (e: EnemyState) => !!ENEMIES[e.kind].boss || e.kind === "dummy";
/** 상태이상 피해 배율 (독샘) */
const dotMul = (p: PlayerState) => (hasPerk(p, "plGland") ? K.plGland.mul : 1);

/** 새부리 가면: 받는 피해 (classTaken) */
export const plagueTaken = (p: PlayerState) => (p.characterId === "plague" && hasPerk(p, "plMask") ? K.plMask.taken : 1);

function nearest(s: RunState, x: number, y: number, r: number, ok: (e: EnemyState) => boolean = () => true): EnemyState | undefined {
  return alive(s)
    .filter((e) => !e.pwHid && ok(e) && dist2(e, { x, y }) <= r * r)
    .sort((a, b) => dist2(a, { x, y }) - dist2(b, { x, y }) || a.id - b.id)[0];
}

/** 흑사병을 걸고 그 적에 붙은 쥐는 터짐 */
export function infect(s: RunState, e: EnemyState): void {
  if ((e.plague ?? 0) > 0) return;
  e.plague = P.plagueTicks;
  e.plagueDmg = (boss(e) ? (e.kind === "dummy" ? 1000 : e.maxHp) / P.bossDiv : e.maxHp) * P.plaguePct;
  const p = s.player;
  const stuck = (p.plRats ?? []).filter((r) => r.on === e.id);
  for (const r of stuck) {
    strike(s, e, P.burst);
    addEffect(s, { kind: "plBurst", x: r.x, y: r.y, dirX: 0, dirY: 0, size: 6, maxTicks: 14 });
  }
  p.plRats = (p.plRats ?? []).filter((r) => r.on !== e.id);
  addEffect(s, { kind: "plMark", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 30 });
}

function attack(s: RunState, dmg: number): void {
  const p = s.player;
  const w = weaponOf(p);
  switch (kindOf(p)) {
    case "swarm":
      return;
    case "miasma": {
      const e = nearest(s, p.x, p.y, p.stats.range * 1.3);
      const at = e ?? { x: p.x + p.faceX * 40, y: p.y + p.faceY * 40 };
      const max = P.clouds + (hasPerk(p, "plSmog") ? K.plSmog.more : 0);
      const clouds = (p.plClouds ?? []).slice(-(max - 1));
      clouds.push({ x: at.x, y: at.y, r: P.cloudR, t: Math.round(P.cloudTicks * (hasPerk(p, "plSmog") ? K.plSmog.dur : 1)), dmg });
      p.plClouds = clouds;
      addEffect(s, { kind: "plPuff", x: at.x, y: at.y, dirX: 0, dirY: 0, size: P.cloudR, maxTicks: 20 });
      return;
    }
    case "rats": {
      const n = P.rats + (hasPerk(p, "plBurrow") ? K.plBurrow.rats : 0);
      const rats = p.plRats ?? [];
      // 맵 곳곳 아무 자리에서 튀어나옴
      for (let i = 0; i < n && rats.length < P.ratsMax; i++) {
        const id = (p.plRatId = (p.plRatId ?? 0) + 1);
        const x = ROOM_MIN_X + 8 + roll(s, "ratX", id) * (ROOM_MAX_X - ROOM_MIN_X - 16);
        const y = ROOM_MIN_Y + 8 + roll(s, "ratY", id) * (ROOM_MAX_Y - ROOM_MIN_Y - 16);
        rats.push({ id, x, y, t: P.ratTicks, on: 0, cd: i * 2 });
      }
      p.plRats = rats;
      return;
    }
    case "grip": {
      // 사거리·공격 속도는 무기 값 그대로 (아이템으로 늘지 않음)
      const chance = P.gripChance + (hasPerk(p, "plReaper") ? K.plReaper.chance : 0);
      for (const e of inCone(s, w.range, P.gripArc)) {
        strike(s, e, dmg);
        if (e.hp <= 0 || roll(s, "grip", e.id) >= chance) continue;
        const cut = boss(e) ? ((e.kind === "dummy" ? 1000 : e.maxHp) / P.gripBossDiv) * P.gripBossPct : e.hp;
        dotDamage(s, e, "death", cut);
        addEffect(s, { kind: "plMark", x: e.x, y: e.y, dirX: 1, dirY: 0, size: e.r + 6, maxTicks: 26 });
      }
      addEffect(s, { kind: "plGrip", x: p.x + p.faceX * w.range * 0.6, y: p.y + p.faceY * w.range * 0.6, dirX: p.faceX, dirY: p.faceY, size: w.range, maxTicks: 14 });
      return;
    }
  }
}

/** 모기떼·연기·쥐·흑사병 (틱마다) */
function update(s: RunState): void {
  const p = s.player;
  // 모기떼: 가까운 적에게 날아가고 없으면 어깨 곁으로
  if (kindOf(p) === "swarm") {
    const sw = (p.plSwarm ??= { x: p.x, y: p.y, prevX: p.x, prevY: p.y });
    const e = nearest(s, p.x, p.y, p.stats.range * 1.4);
    const to = e ?? { x: p.x - p.faceX * 10, y: p.y - 14 };
    const d = normalize(to.x - sw.x, to.y - sw.y);
    sw.prevX = sw.x;
    sw.prevY = sw.y;
    const step = Math.min(P.swarmSpeed, Math.sqrt(dist2(sw, to)));
    if (d) {
      sw.x += d[0] * step;
      sw.y += d[1] * step;
    }
  } else delete p.plSwarm;
  // 연기 구역: 맥박마다 독·불·죽음·부식
  if (p.plClouds?.length) {
    const corrode = hasPerk(p, "plRust") ? K.plRust.corrode : P.corrode;
    for (const c of p.plClouds) {
      c.t--;
      if (c.t % P.pulse !== 0) continue;
      for (const e of inCircle(s, c.x, c.y, c.r)) {
        poison(e, c.dmg * P.poisonMul * dotMul(p), 90);
        ignite(e, c.dmg * P.burnMul * dotMul(p));
        dotDamage(s, e, "death", c.dmg * P.deathMul * dotMul(p));
        e.apDef = Math.max(e.apDef ?? 0, corrode);
      }
    }
    p.plClouds = p.plClouds.filter((c) => c.t > 0);
  }
  // 쥐떼: 흑사병에 걸리지 않은 가까운 적에게 달라붙어 갉음
  if (p.plRats?.length) {
    const chance = hasPerk(p, "plBlackDeath") ? K.plBlackDeath.chance : P.plagueChance;
    for (const r of p.plRats) {
      r.t--;
      let e = r.on ? s.enemies.find((x) => x.id === r.on && x.hp > 0 && !((x.plague ?? 0) > 0)) : undefined;
      if (!e) {
        r.on = 0;
        e = nearest(s, r.x, r.y, 140, (x) => !((x.plague ?? 0) > 0));
      }
      // 갈 적이 없으면 그 자리에서 기다림 (역병의사 곁으로 몰려들지 않음)
      const to = e ?? { x: r.x, y: r.y };
      const gap = Math.sqrt(dist2(r, to));
      const reach = e ? e.r + 2 : 2;
      if (gap > reach) {
        r.x += ((to.x - r.x) / gap) * Math.min(P.ratSpeed, gap - reach);
        r.y += ((to.y - r.y) / gap) * Math.min(P.ratSpeed, gap - reach);
        continue;
      }
      if (!e) continue;
      r.on = e.id;
      if (--r.cd > 0) continue;
      r.cd = P.gnawEvery;
      // 둘레 여럿을 함께 갉음
      for (const o of inCircle(s, r.x, r.y, P.gnawR)) {
        if ((o.plague ?? 0) > 0) continue;
        strike(s, o, P.gnawDmg);
        if (roll(s, "plagueRat", r.id * 1000 + o.id) < chance) infect(s, o);
      }
    }
    p.plRats = p.plRats.filter((r) => r.t > 0);
  }
  // 흑사병: 1초마다 · 쓰러지면 전염 · 상태이상 적 처치 시 사혈
  for (const e of s.enemies) {
    if ((e.plague ?? 0) <= 0) continue;
    e.plague = (e.plague ?? 0) - 1;
    if (e.hp > 0 && e.plague % TICK_RATE === 0) dotDamage(s, e, "rot", (e.plagueDmg ?? 0) * dotMul(p));
    if (e.hp <= 0 && !e.plSpread) {
      e.plSpread = true;
      if (hasPerk(p, "plContagion")) for (const o of inCircle(s, e.x, e.y, K.plContagion.r)) infect(s, o);
    }
  }
  if (hasPerk(p, "plBloodlet"))
    for (const e of s.enemies) {
      if (e.hp > 0 || e.plBled) continue;
      const sick = (e.plague ?? 0) > 0 || (e.poisonTicks ?? 0) > 0 || (e.burnTicks ?? 0) > 0;
      if (sick && !e.plBled) {
        e.plBled = true;
        healPlayer(s, K.plBloodlet.heal);
      }
    }
}

/** 모기떼: 누르고 있는 동안 쉬지 않고 둘레를 갈아버림 (레이저처럼 피해가 쌓여 오름) */
function grind(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const sw = p.plSwarm;
  if (!want || !sw || s.tick % P.swarmEvery !== 0) return;
  const r = P.swarmR * (hasPerk(p, "plHive") ? K.plHive.r : 1);
  const dmg = (p.stats.damage * speed * P.swarmBoost * P.swarmEvery) / TICK_RATE;
  const hit = inCircle(s, sw.x, sw.y, r);
  for (const e of hit) strike(s, e, dmg);
  if (hit.length && s.tick % (P.swarmEvery * 3) === 0) addEffect(s, { kind: "plSwarmBite", x: sw.x, y: sw.y, dirX: 0, dirY: 0, size: r, maxTicks: 12 });
}

/** 틱마다 (역병의사 무기를 들었을 때 player에서) */
export function plagueTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const target = alive(s).some((e) => dist2(e, p) <= (p.stats.range * 1.5) ** 2);
  if (kindOf(p) === "swarm") grind(s, want, speed);
  else if (want && p.attackCooldown <= 0 && (target || kindOf(p) === "grip")) {
    // 죽음의 손아귀는 공격 속도가 오르지 않음
    const sp = kindOf(p) === "grip" ? weaponOf(p).attackSpeed : speed;
    p.attackCooldown = Math.max(1, Math.round(TICK_RATE / sp));
    p.attackCount++;
    attack(s, p.stats.damage);
  }
  // 공격 뒤에 (이번 틱에 쓰러진 적도 전염·사혈을 보게)
  update(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetPlague(p: PlayerState): void {
  for (const k of ["plSwarm", "plClouds", "plRats", "plRatId"] as const) delete p[k];
}
