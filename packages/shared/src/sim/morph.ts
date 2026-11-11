// 변희(비르디아, 만물의 소녀): 든 무기의 동물로 변해 그 동물처럼 싸움. 동물마다 공격이 다르고, 아이템 셋이 그 동물만 강하게 함
// 늑대 물기 · 곰 할퀴기 · 독수리 깃털 · 뱀 독 물기 · 멧돼지 돌진 · 전갈 꼬리 · 박쥐 음파 · 코끼리 짓밟기 · 거미 거미줄 · 불사조 불덩이
// 수치는 weaponsMorph.MORPH, 아이템은 itemsMorph
import { srcRun } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { MORPH_PERKS as K } from "../itemsMorph";
import { MORPH as M } from "../weaponsMorph";
import { blastAt, damageEnemy, healPlayer, ignite } from "./combat";
import { alive, fan, inCircle, inCone, inLine, poison, root, rushTick, shoot, startRush, stun, strike } from "./s2Kit";
import type { EnemyState, PlayerState, ProjectileState, RunState } from "./types";
import { addEffect, dist2, hasPerk, weaponOf } from "./util";
import { evoSkill, evoTaken, evoTakenPvp, heatTick, raidTick } from "./morphEvo";

const animalOf = (p: PlayerState) => (p.characterId === "byeonhui" ? weaponOf(p).animal : undefined);

/** 그 동물일 때 받는 피해 배율 (combat.damagePlayer) */
export function morphTaken(p: PlayerState, pvp = false): number {
  const a = animalOf(p);
  const evo = pvp ? evoTakenPvp(p) : evoTaken(p);
  if (a === "bear" && hasPerk(p, "bearHide")) return K.bearHide.taken * evo;
  if (a === "scorpion" && hasPerk(p, "scorpShell")) return K.scorpShell.taken * evo;
  if (a === "elephant" && hasPerk(p, "eleHerd")) return K.eleHerd.taken * evo;
  return evo;
}

/** 몇 번째마다 (지금 동물로 센 공격 수) */
const every = (p: PlayerState, n: number) => (p.mCount ?? 0) % n === 0;

/** 박쥐: 준 피해 일부 회복 */
function leech(s: RunState, dmg: number): void {
  healPlayer(s, dmg * M.leech * (hasPerk(s.player, "batDrain") ? K.batDrain.mul : 1));
}

/** 한 번 공격 (동물마다) */
function attack(s: RunState, dmg: number): void {
  const p = s.player;
  const reach = p.stats.range;
  const fx = { x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY };
  switch (animalOf(p)) {
    case "wolf": {
      const big = every(p, hasPerk(p, "wolfPack") ? K.wolfPack.every : M.wolfEvery);
      for (const e of inCone(s, reach, M.biteArc)) strike(s, e, dmg * (big ? M.wolfMul : 1));
      if (big && hasPerk(p, "wolfHowl")) for (const e of inCircle(s, p.x, p.y, K.wolfHowl.r)) stun(e, K.wolfHowl.stun);
      addEffect(s, { kind: "imBite", ...fx, x: p.x + p.faceX * reach * 0.6, y: p.y + p.faceY * reach * 0.6, size: big ? 10 : 7, maxTicks: 10 });
      return;
    }
    case "bear": {
      const mul = hasPerk(p, "bearRage") && p.hp <= p.stats.maxHp * K.bearRage.below ? K.bearRage.damage : 1;
      for (const e of inCone(s, reach, M.bearArc)) strike(s, e, dmg * mul, M.bearPush);
      addEffect(s, { kind: "bearSwipe", ...fx, x: p.x + p.faceX * reach * 0.5, y: p.y + p.faceY * reach * 0.5, size: reach * 0.6, maxTicks: 16 });
      if (hasPerk(p, "bearQuake") && every(p, K.bearQuake.every)) srcRun(s, "bearQuake", () => blastAt(s, p.x, p.y, K.bearQuake.r, dmg * K.bearQuake.mul, { push: 8 }));
      return;
    }
    case "eagle": {
      const n = hasPerk(p, "eagleStorm") ? K.eagleStorm.feathers : M.feathers;
      fan(s, n, M.featherSpread, { damage: dmg, spirit: "eagleFeather", range: reach });
      if (hasPerk(p, "eagleDive") && every(p, K.eagleDive.every)) srcRun(s, "eagleDive", () => {
        const e = nearest(s, reach);
        if (e) {
          for (const t of inCircle(s, e.x, e.y, K.eagleDive.r)) strike(s, t, dmg * K.eagleDive.mul);
          addEffect(s, { kind: "streak", ...fx, size: 3, toX: e.x, toY: e.y, maxTicks: 12 });
        }
      });
      return;
    }
    case "snake": {
      const venom = dmg * M.venom * (hasPerk(p, "snakeVenom") ? K.snakeVenom.mul : 1);
      for (const e of inLine(s, reach, M.snakeWidth)) {
        strike(s, e, dmg);
        poison(e, venom, M.venomTicks);
        if (hasPerk(p, "snakeCoil")) root(e, K.snakeCoil.ticks);
      }
      addEffect(s, { kind: "thrust", ...fx, size: reach, toX: p.x + p.faceX * reach, toY: p.y + p.faceY * reach, width: 3, maxTicks: 8, tint: "#7ae05a" });
      if (hasPerk(p, "snakeSpit") && every(p, K.snakeSpit.every)) srcRun(s, "snakeSpit", () => shoot(s, 0, { damage: dmg * K.snakeSpit.mul, spirit: "venomSpit", range: K.snakeSpit.range, speed: 3.5 }));
      return;
    }
    case "boar": {
      // 돌진: 몇 틱 동안 앞으로 달리며 지나간 적을 들이받음 (틱마다 s2Kit.rushTick)
      startRush(p, {
        t: M.rushTicks,
        dx: p.faceX,
        dy: p.faceY,
        step: (reach * (hasPerk(p, "boarStampede") ? K.boarStampede.reach : 1)) / M.rushTicks,
        dmg: dmg * (hasPerk(p, "boarTusk") ? K.boarTusk.mul : 1),
        push: 12,
        invuln: hasPerk(p, "boarMud"),
        tint: "#c89060",
      });
      return;
    }
    case "scorpion": {
      if (hasPerk(p, "scorpPincer")) for (const e of inCone(s, K.scorpPincer.reach, 0.3)) strike(s, e, dmg * K.scorpPincer.mul);
      for (const e of inLine(s, reach, M.stingWidth)) {
        strike(s, e, dmg);
        stun(e, M.stingStun);
        if (hasPerk(p, "scorpTail")) poison(e, dmg * M.venom, M.venomTicks);
      }
      addEffect(s, { kind: "stab", ...fx, size: reach, toX: p.x + p.faceX * reach, toY: p.y + p.faceY * reach, width: 2, maxTicks: 8 });
      return;
    }
    case "bat": {
      let dealt = 0;
      for (const e of inCone(s, reach, M.sonicArc)) {
        strike(s, e, dmg);
        dealt += dmg;
      }
      leech(s, dealt);
      addEffect(s, { kind: "quack", ...fx, size: reach, width: M.sonicArc, maxTicks: 12, tint: "#c08aff" });
      if (hasPerk(p, "batEcho")) s.pendingBlasts.push({ tick: s.tick + K.batEcho.delay, x: p.x + p.faceX * reach * 0.7, y: p.y + p.faceY * reach * 0.7, radius: K.batEcho.r, damage: dmg });
      if (hasPerk(p, "batSwarm") && every(p, K.batSwarm.every)) srcRun(s, "batSwarm", () => fan(s, K.batSwarm.bats, 0.4, { damage: dmg * K.batSwarm.mul, spirit: "batling", range: reach * 2, speed: 2.6 }));
      return;
    }
    case "elephant": {
      const r = reach * (hasPerk(p, "eleMammoth") ? K.eleMammoth.reach : 1);
      for (const e of inCircle(s, p.x, p.y, r)) {
        strike(s, e, dmg, 4);
        stun(e, M.stompStun);
      }
      addEffect(s, { kind: "slam", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 16 });
      if (hasPerk(p, "eleTrunk")) for (const e of inCone(s, r * 1.2, 0.5)) strike(s, e, 0, K.eleTrunk.push);
      return;
    }
    case "spider": {
      const n = hasPerk(p, "spiderBrood") && every(p, K.spiderBrood.every) ? 3 : 1;
      fan(s, n, 0.3, { damage: dmg, spirit: "web", r: 3, slow: M.webSlow, range: reach });
      return;
    }
    case "phoenix": {
      shoot(s, 0, { damage: dmg, spirit: "phoenixFire", r: 3.5, range: reach });
      if (hasPerk(p, "phoenixSun") && every(p, K.phoenixSun.every)) srcRun(s, "phoenixSun", () => {
        blastAt(s, p.x, p.y, K.phoenixSun.r, dmg * K.phoenixSun.mul);
        for (const e of inCircle(s, p.x, p.y, K.phoenixSun.r)) ignite(e, dmg);
        addEffect(s, { kind: "oFlame", x: p.x, y: p.y, dirX: 0, dirY: -1, size: K.phoenixSun.r, width: -1, maxTicks: 22 });
      });
      return;
    }
  }
}

function nearest(s: RunState, r: number): EnemyState | undefined {
  const p = s.player;
  return alive(s)
    .filter((e) => dist2(e, p) <= r * r)
    .sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
}

/** 동물 탄이 맞았을 때 (s2Hits) */
export function morphShotHit(s: RunState, pr: ProjectileState, e: EnemyState): void {
  const p = s.player;
  if (pr.spirit === "venomSpit") poison(e, pr.damage * M.venom * (hasPerk(p, "snakeVenom") ? K.snakeVenom.mul : 1), M.venomTicks);
  else if (pr.spirit === "batling") leech(s, pr.damage);
  else if (pr.spirit === "web") {
    if (hasPerk(p, "spiderFang") && (e.slowTicks ?? 0) > 0) damageEnemy(s, e, pr.damage * K.spiderFang.mul, 0, 0, false);
    if (hasPerk(p, "spiderNest")) {
      for (const t of inCircle(s, e.x, e.y, K.spiderNest.r)) t.slowTicks = Math.max(t.slowTicks ?? 0, M.webSlow);
      addEffect(s, { kind: "ring", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.spiderNest.r, maxTicks: 18, width: 1 });
    }
  } else if (pr.spirit === "phoenixFire") {
    const r = M.fireR * (hasPerk(p, "phoenixFlare") ? K.phoenixFlare.r : 1);
    blastAt(s, e.x, e.y, r, pr.damage * 0.5, { exclude: e, still: true });
    for (const t of inCircle(s, e.x, e.y, r)) ignite(t, pr.damage * 0.6);
  }
}

/** 틱마다 (동물 무기를 들었을 때 player에서) */
export function morphTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.s2Rush) rushTick(s);
  // 공중 습격 중에는 다른 공격 없음
  if (p.mRaid) {
    raidTick(s);
    return;
  }
  heatTick(s);
  if (animalOf(p) === "phoenix" && hasPerk(p, "phoenixRebirth") && p.hp > 0 && p.hp <= p.stats.maxHp * K.phoenixRebirth.below && s.tick % K.phoenixRebirth.every === 0) healPlayer(s, K.phoenixRebirth.heal);
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.mCount = (p.mCount ?? 0) + 1;
  delete p.mHuman;
  attack(s, p.stats.damage);
  evoSkill(s, p.stats.damage);
}

/** 연습장 등에서 다시 시작할 때 · 무기(동물)를 바꿨을 때 */
export function resetMorph(p: PlayerState): void {
  delete p.mCount;
  delete p.mHuman;
  delete p.s2Rush;
  delete p.mRaid;
  delete p.mHeat;
  delete p.mXp;
}
