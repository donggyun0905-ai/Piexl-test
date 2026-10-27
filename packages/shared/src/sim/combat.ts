// 피해 주고받기·처치
import { inkTaken, scribeKill } from "./scribe";
import { petGold } from "./lobbyPet";
import { BEDOUIN_PERKS } from "../itemsBedouin";
import { PERKS } from "../perks";
import { createRng, deriveSeed } from "../rng";
import { ENEMIES } from "../content";
import { SWARM } from "../swarmDefs";
import { titanHurt, titanParried } from "./titan";
import { afterHurt, classTaken } from "./classTaken";
import { dodged, extraTaken, goldMul, onHitExtra, sharpBonus } from "./baseStats";
import { tickDots } from "./status";
export { dotDamage, ignite } from "./status";
import { swarmLucky } from "./swarmRules";
import { SWARM_LEVELS } from "../swarmMaps";
import { ultBoss } from "./bossKit";
import { heal, leechHeal } from "./heal";
import { hatchSlimes } from "./critters";
import { apostleKill } from "./apostleSouls";
import { seatNo, useSeat } from "./party";
import { tabooDown, tabooN, tabooUp } from "./taboo";
import { addHazard } from "./hazards";
import { gainExp, rollCrit } from "./novice";
import type { EnemyState, RunState } from "./types";
import { morphKill } from "./morphXp";
import { recalcStats } from "./items";
import { trackerGuard, trackerTaken } from "./tracker";
import { addEffect, dist2, hasPerk, HIT_INVULN_TICKS, KNOCKBACK, keepInRoom, markCrit, normalize, roomGrid, RUSH_TICKS, STILL_TICKS } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 야성의 포효·생선 간식 지속 틱 (3초) */
  ROAR_TICKS: 180,
  /** 결계: 맞은 뒤 무적 틱 (3초) */
  BARRIER_TICKS: 180,
  /** 에너지 회수: 처치마다 얻는 보호막, 최대 (최대 체력 비율) */
  RECYCLE_BARRIER: 4, RECYCLE_MAX: 0.25,
  /** 의사 가운: 받는 피해 배율, 맞은 뒤 빨라지는 틱 (1초) · 항체 반응: 막은 피해의 이 배율을 돌려줌 */
  GOWN_TAKEN: 0.85, FIRST_AID_HEAL: 3, GOWN_TICKS: 60, ANTIBODY_MUL: 2,
  /** 장갑 용해(부식): 중첩당 받는 피해 증가 */
  MELT_ADD: 0.02,
};
export { R as COMBAT_RULES };


export function damageEnemy(s: RunState, e: EnemyState, dmg: number, dirX: number, dirY: number, knock = true): void {
  // 차례가 아닌 천사장 탑: 맞지 않음
  if (e.immune) return;
  // 받아 넘기기 (갓이터·대검): 확률로 피해 없음
  const parry = ENEMIES[e.kind].parry;
  if (parry && dmg > 0) {
    e.parries = (e.parries ?? 0) + 1;
    if (createRng(deriveSeed(s.seed, "parry", e.id, e.parries)).nextFloat() < parry) {
      addEffect(s, { kind: "parry", x: e.x - dirX * e.r, y: e.y - dirY * e.r, dirX, dirY, size: 6, maxTicks: 10 });
      return;
    }
  }
  // 가디언 방패: 맞을 때마다 한 칸씩 깨지고, 다 깨지기 전에는 피해 없음
  if ((e.shield ?? 0) > 0 && dmg > 0) {
    e.shield = (e.shield ?? 0) - 1;
    e.hitFlash = 3;
    addEffect(s, { kind: "hit", x: e.x + dirX * -e.r, y: e.y + dirY * -e.r, dirX, dirY, size: e.shield === 0 ? 7 : 3, maxTicks: 8 });
    return;
  }
  // 풋내기 치명타
  const roll = rollCrit(s, e, dmg);
  dmg = roll.dmg;
  if (roll.crit) markCrit(s, e);
  // 풍뎅이 부적(베두인): 보스에게 피해 +30%
  if (ENEMIES[e.kind].boss && hasPerk(s.player, "scarabCharm")) dmg *= BEDOUIN_PERKS.scarabCharm.boss;
  // 탐식(악의 사도)·예리함: 방어력이 깎인 적은 더 아픔 · 각주(서기관): 기록이 새겨진 적은 더 아픔
  dmg *= (1 + (e.apDef ?? 0) + inkTaken(s.player, e) + sharpBonus(s, e)) * trackerTaken(e);
  e.hp -= e.melt ? dmg * (1 + R.MELT_ADD * e.melt) : dmg;
  onHitExtra(s, e, dmg);
  e.hitFlash = 6;
  if (s.party) e.lastHit = seatNo(s);
  // 돌진 중인 적·보스는 밀리지 않음 (소환수 공격은 밀지 않음)
  if (knock && !(e.kind === "charger" && e.phase === "charge") && !ENEMIES[e.kind].boss) {
    e.x += dirX * KNOCKBACK;
    e.y += dirY * KNOCKBACK;
    keepInRoom(e, roomGrid(s));
  }
  addEffect(s, { kind: "hit", x: e.x, y: e.y, dirX, dirY, size: roll.crit ? 8 : 4, maxTicks: roll.crit ? 10 : 6 });
}

export function damagePlayer(s: RunState, dmg: number): void {
  const p = s.player;
  // 대시 중·맞은 뒤 무적·보호막이면 피해 없음
  if (p.dashTicks > 0 || p.invulnTicks > 0 || p.shieldTicks > 0) return;
  // 거인 패링: 피해 없이 그대로 에너지로 · 회피
  if (titanParried(s, dmg) || dodged(s)) return;
  // 서든데스: 한 대라도 맞으면 끝
  if (s.sudden) {
    p.hp = 0;
    s.roomDamaged = true;
    addEffect(s, { kind: "hit", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 6, maxTicks: 10 });
    return;
  }
  // 금기: 취약 (받는 피해 증가) · 광야의 새벽은 적이 많아 받는 피해를 줄임
  dmg *= tabooUp(s, "frail") * (s.swarm ? SWARM.taken * (SWARM_LEVELS[s.swarm.level ?? 0]?.taken ?? 1) : 1);
  // 방패 자세: 가만히 서 있으면 받는 피해 절반
  let taken = hasPerk(p, "bulwarkStance") && p.stillTicks >= STILL_TICKS ? dmg * PERKS.bulwarkStance.taken : dmg;
  // 버티기(가라테): 받는 피해 절반, 받은 만큼 모아 되받아침
  if ((p.guardTicks ?? 0) > 0) {
    taken *= 0.5;
    p.guardTaken = (p.guardTaken ?? 0) + taken;
  }
  // 모래 장막(베두인): 차크람을 던져 손이 비어 있으면 받는 피해 감소 · 철벽진(장수): 콤보 사이 쉬는 동안 감소
  if (hasPerk(p, "sandVeil") && p.ckHeld === false) taken *= PERKS.sandVeil.taken;
  if (hasPerk(p, "ironWall") && (p.gPause ?? 0) > 0) taken *= PERKS.ironWall.taken;
  // 용린갑(이무기)
  if (hasPerk(p, "scaleArmor")) taken *= PERKS.scaleArmor.taken;
  // 위장복(추적자)
  taken *= trackerGuard(p);
  // 계약의 방패(소환술사): 소환수 하나마다 받는 피해 감소
  if (hasPerk(p, "bondShield")) taken *= 1 - Math.min(PERKS.bondShield.below, PERKS.bondShield.taken * (p.summons?.length ?? 0));
  // 의사 가운: 받는 피해 감소, 맞은 뒤 잠깐 빨라짐
  if (hasPerk(p, "doctorGown")) {
    taken *= R.GOWN_TAKEN;
    p.gownTicks = R.GOWN_TICKS;
  }
  // 직업마다 (버려진 자들·거인·오니·이드라·변희)
  taken = extraTaken(p, classTaken(s, taken));
  // 보호막(에너지 회수·차력쇼·의사 초과 치료)이 먼저 깎임
  if ((p.shieldPts ?? 0) > 0) {
    const used = Math.min(p.shieldPts ?? 0, taken);
    p.shieldPts = (p.shieldPts ?? 0) - used;
    // 항체 반응: 막은 피해를 모아 두었다가 주변 적에게 돌려줌 (sim/medicGear)
    if (hasPerk(p, "antibody")) p.antiStore = (p.antiStore ?? 0) + used * R.ANTIBODY_MUL;
    taken -= used;
  }
  p.hp -= taken;
  titanHurt(s, dmg);
  if (s.party) p.hurt = (p.hurt ?? 0) + taken;
  s.roomDamaged = true;
  // 배수의 진: 체력이 30% 이하면 무적 시간 2배
  p.invulnTicks = Math.round(HIT_INVULN_TICKS * (hasPerk(p, "lastStand") && p.hp <= p.stats.maxHp * PERKS.lastStand.below ? PERKS.lastStand.invuln : 1) * tabooDown(s, "shortInvuln"));
  // 결벽증: 맞으면 잠깐 빨라짐
  if (hasPerk(p, "cleanFreak")) p.rushTicks = RUSH_TICKS;
  // 연막(닌자): 둘레 적이 느려지고 1초 더 무적
  if (hasPerk(p, "smokeVeil")) {
    for (const e of s.enemies) if (dist2(e, p) <= PERKS.smokeVeil.radius ** 2 && !ENEMIES[e.kind].boss) e.slowTicks = Math.max(e.slowTicks ?? 0, PERKS.smokeVeil.ticks);
    p.invulnTicks += 60;
    addEffect(s, { kind: "puff", x: p.x, y: p.y, dirX: 0, dirY: 0, size: PERKS.smokeVeil.radius, maxTicks: 24 });
  }
  // 결계: 맞은 뒤 3초 무적
  if (hasPerk(p, "barrier")) p.invulnTicks = R.BARRIER_TICKS;
  afterHurt(s);
  // 야성의 포효: 둘레 적을 밀어내며 피해, 3초 동안 고양이 피해 증가
  if (hasPerk(p, "wildRoar")) {
    p.roarTicks = R.ROAR_TICKS;
    blastAt(s, p.x, p.y, 30, p.stats.damage, { push: 10 });
  }
  addEffect(s, { kind: "hit", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 6, maxTicks: 10 });
  // 반격의 방패: 맞으면 주변 적을 밀어내며 공격력만큼 피해
  if (hasPerk(p, "counterGuard")) blastAt(s, p.x, p.y, PERKS.counterGuard.radius, p.stats.damage * PERKS.counterGuard.damage, { push: PERKS.counterGuard.push });
}

/** 범위 안 적 모두에게 피해 (밖으로 밀림). exclude: 제외할 적. 맞힌 적 수를 돌려줌 */
export function blastAt(
  s: RunState,
  x: number,
  y: number,
  radius: number,
  dmg: number,
  opt: { exclude?: EnemyState; push?: number; bloom?: boolean; still?: boolean } = {},
): number {
  const at = { x, y, prevX: x, prevY: y, r: 0 };
  let hits = 0;
  for (const e of s.enemies) {
    if (e === opt.exclude || e.hp <= 0) continue;
    const rr = radius + e.r;
    if (dist2(e, at) >= rr * rr) continue;
    const dir = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemy(s, e, dmg, dir[0], dir[1], !opt.still);
    if (opt.push && !ENEMIES[e.kind].boss) {
      e.x += dir[0] * opt.push;
      e.y += dir[1] * opt.push;
      keepInRoom(e, roomGrid(s));
    }
    hits++;
  }
  // 벚꽃 부적은 폭발 대신 벚꽃이 만개하는 모습 (그리기만 다름)
  addEffect(s, { kind: opt.bloom ? "bloom" : "blast", x, y, dirX: 0, dirY: 0, size: radius, maxTicks: opt.bloom ? 48 : 12 });
  return hits;
}

/** 체력 회복 (의사는 넘친 만큼 보호막, sim/heal) */
export function healPlayer(s: RunState, amount: number): void {
  heal(s, amount);
}

/** 틱마다: 불타는 적 피해, 잠시 뒤 터지는 폭발 */
export function updateDelayed(s: RunState): void {
  tickDots(s);
  updatePending(s);
  removeDead(s);
}

/** 때가 된 잠시 뒤 폭발 터뜨리기 */
export function updatePending(s: RunState): void {
  if (s.pendingBlasts.length === 0) return;
  const due = s.pendingBlasts.filter((b) => b.tick <= s.tick);
  s.pendingBlasts = s.pendingBlasts.filter((b) => b.tick > s.tick);
  for (const b of due) blastAt(s, b.x, b.y, b.radius, b.damage);
}

/** 쓰러진 적 정리: 처치 수·돈. 보스가 쓰러지면 보스가 부른 적도 같이 사라짐 (불려 나온 보스가 쓰러질 때는 아님) */
export function removeDead(s: RunState): void {
  if (!s.enemies.some((e) => e.hp <= 0)) return;
  // 라스트 보스는 궁극기를 쓰기 전에는 쓰러지지 않음 (한 번에 큰 피해로 체력 10%를 건너뛰어도 체력 1로 남아 다음 틱에 궁극기)
  for (const e of s.enemies) if (e.hp <= 0 && !e.ultDone && ultBoss(e)) e.hp = 1;
  const bossDown = s.enemies.some((e) => e.hp <= 0 && ENEMIES[e.kind].boss && !e.noGold);
  const alive: EnemyState[] = [];
  const fallen: { x: number; y: number; seat: number }[] = [];
  const back = seatNo(s);
  for (const e of s.enemies) {
    if (e.hp > 0 && !(bossDown && e.noGold)) {
      alive.push(e);
      continue;
    }
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2, maxTicks: 14 });
    if (e.hp > 0) continue; // 보스와 같이 사라진 적은 처치로 세지 않음
    // 금기: 죽음의 메아리 (쓰러진 자리에 잠시 뒤 폭발)
    if (tabooN(s, "deathBurst") > 0 && e.kind !== "dummy") addHazard(s, e.x, e.y, ENEMIES[e.kind].contactDamage);
    // 협동: 마지막으로 때린 사람이 처치 효과·돈을 받음
    useSeat(s, e.lastHit ?? back);
    // 보스가 부른 적(돈 없음)은 처치 수·쌓이는 힘(빛의 고리·잔영·경험치·먹은 영혼 등)에 넣지 않음
    const minion = e.noGold;
    if (!minion) s.kills++;
    hatchSlimes(s, e, alive);
    const p = s.player;
    if (s.party && !minion) p.kills = (p.kills ?? 0) + 1;
    if (hasPerk(p, "huntFrenzy") && !minion) {
      p.streak = Math.min(PERKS.huntFrenzy.stacks, p.streak + 1);
      p.streakTicks = PERKS.huntFrenzy.ticks;
    }
    fallen.push({ x: e.x, y: e.y, seat: seatNo(s) });
    // 광야의 새벽에서는 영혼·처치 회복이 확률로만 (swarmLucky)
    if (swarmLucky(s, "soul", e.id, SWARM.limits.soulChance)) apostleKill(s, e.x, e.y, minion);
    // 생명 흡수: 처치하면 최대 체력의 3% 회복
    if (hasPerk(p, "lifeLeech") && swarmLucky(s, "leech", e.id)) healPlayer(s, p.stats.maxHp * PERKS.lifeLeech.heal);
    // 생선 간식: 처치하면 고양이가 빨라짐
    if (hasPerk(p, "fishTreat")) p.frenzyTicks = R.ROAR_TICKS;
    // 응급 처치: 처치하면 체력 1 (의사 공격 회복 상한에 포함)
    if (hasPerk(p, "firstAid") && swarmLucky(s, "aid", e.id)) leechHeal(s, R.FIRST_AID_HEAL);
    if (hasPerk(p, "energyRecycle") && swarmLucky(s, "recycle", e.id)) p.shieldPts = Math.min(p.stats.maxHp * R.RECYCLE_MAX, (p.shieldPts ?? 0) + R.RECYCLE_BARRIER);
    scribeKill(s, e);
    if (hasPerk(p, "chaseSteps")) p.dashCooldown = Math.max(0, p.dashCooldown - PERKS.chaseSteps.ticks);
    if (ENEMIES[e.kind].boss && !e.noGold) {
      s.bossKills++;
      if (!s.roomDamaged) s.flawlessBosses++;
    }
    if (!e.noGold) addGold(s, e.bounty ?? ENEMIES[e.kind].gold);
    if (minion) continue;
    gainExp(s, e);
    if (morphKill(s, e)) recalcStats(s);
  }
  s.enemies = alive;
  // 연쇄 폭발: 쓰러진 자리에서 작은 폭발 (이것으로 쓰러진 적은 다음 틱에 정리돼 한 틱씩 이어짐)
  for (const f of fallen) {
    useSeat(s, f.seat);
    if (hasPerk(s.player, "chainBurst")) blastAt(s, f.x, f.y, PERKS.chainBurst.radius, s.player.stats.damage * PERKS.chainBurst.damage);
  }
  useSeat(s, back);
}

export function addGold(s: RunState, amount: number): void {
  // 돈 주머니: 얻는 돈 +50%
  if (hasPerk(s.player, "goldPouch")) amount = Math.round(amount * PERKS.goldPouch.gold);
  // 황금 거북(로비 펫)
  amount = Math.round(amount * petGold(s) * goldMul(s.player));
  // 금기: 가난
  if (s.taboo) amount = Math.round(amount * tabooDown(s, "poverty"));
  s.gold += amount;
  s.goldEarned += amount;
}
