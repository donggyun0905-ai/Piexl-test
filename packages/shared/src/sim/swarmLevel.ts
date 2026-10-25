// 광야의 새벽: 경험치 보석·레벨 업 고르기(무기·패시브, 같은 것을 고르면 레벨 +1, 최대 5)·조합(각성)·황금 상자 보상
import { WEAPONS, type CharacterId, type WeaponId } from "../content";
import { PASSIVE_IDS, PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRng, deriveSeed } from "../rng";
import { SWARM, swarmXpNeed } from "../swarmDefs";
import { equipWeapon, recalcStats } from "./items";
import { characterWeapons, pickDistinct } from "./loot";
import { addGhost, eachFighter, syncFighters } from "./swarmGhosts";
import type { SwarmChoice } from "./swarmTypes";
import type { RunState } from "./types";
import { addEffect } from "./util";
import { apostlePotion } from "./apostle";
import { addGold } from "./combat";

/** 다음 레벨까지 경험치 */
export const xpNeed = swarmXpNeed;

/** 이 모드에서 쓸모없는 패시브 (돈 더 받기) */
const USELESS = new Set<string>(["goldPouch"]);

/** 이 캐릭터가 얻을 수 있는 패시브 (전용 + 공용, 정해진 자리 아이템 제외) */
export function swarmPassives(c: CharacterId): PassiveId[] {
  return PASSIVE_IDS.filter((id) => {
    const def: PassiveDef = PASSIVES[id];
    // 이드라는 전용 아이템만
    return !def.special && !USELESS.has(id) && ((def.exclusive === undefined && c !== "idra") || def.exclusive === c);
  });
}

/** 무기의 조합 짝 패시브: 전용 패시브가 있으면 그중에서, 없으면 공용에서 무기 순서대로 */
export function evoPassive(c: CharacterId, id: WeaponId): PassiveId {
  const all = swarmPassives(c);
  const own = all.filter((p) => (PASSIVES[p] as PassiveDef).exclusive === c);
  const pool = own.length > 0 ? own : all;
  const i = Math.max(0, characterWeapons(c).indexOf(id));
  return pool[i % pool.length]!;
}

/** 지금 무기 레벨 (첫 칸은 본인) */
export function weaponLv(s: RunState, id: WeaponId): number {
  let lv = 0;
  eachFighter(s, (p, w) => {
    if (w.id === id) lv = p.svLv ?? 1;
  });
  return lv;
}

/** 각성할 수 있는 무기 (최대 레벨 + 짝 패시브를 가짐, 아직 각성 전) */
export function evoReady(s: RunState): WeaponId | null {
  const hero = s.player;
  let ready: WeaponId | null = null;
  eachFighter(s, (p, w) => {
    if (!ready && !p.svEvo && (p.svLv ?? 1) >= SWARM.maxLevel && hero.passives.includes(evoPassive(hero.characterId, w.id))) ready = w.id;
  });
  return ready;
}

/** 경험치를 얻음: 넘치면 레벨 업이 쌓임 */
export function gainXp(s: RunState, v: number): void {
  const sw = s.swarm!;
  sw.xp += v;
  while (sw.xp >= xpNeed(sw.lv)) {
    sw.xp -= xpNeed(sw.lv);
    sw.lv++;
    sw.pending++;
  }
}

/** 새 무기·패시브 칸이 열려 있는지: 기본 칸이 남았거나, 가진 것을 모두 최대 레벨로 키웠으면 한 칸 더 */
export function weaponSlotOpen(s: RunState): boolean {
  const sw = s.swarm!;
  return sw.weapons.length < SWARM.maxWeapons || sw.weapons.every((w) => weaponLv(s, w.id) >= SWARM.maxLevel);
}
export function passiveSlotOpen(s: RunState): boolean {
  const sw = s.swarm!;
  return sw.passives.length < SWARM.maxPassives || sw.passives.every((p) => p.lv >= SWARM.maxLevel);
}

/** 레벨 업 후보 (같은 판·같은 차례면 늘 같은 후보) */
export function makeChoices(s: RunState): SwarmChoice[] {
  const sw = s.swarm!;
  const c = s.player.characterId;
  const all: SwarmChoice[] = [];
  for (const w of sw.weapons) {
    const lv = weaponLv(s, w.id);
    if (lv < SWARM.maxLevel) all.push({ kind: "weapon", id: w.id, lv: lv + 1 });
  }
  if (weaponSlotOpen(s)) {
    for (const id of characterWeapons(c)) if (!sw.weapons.some((w) => w.id === id)) all.push({ kind: "weapon", id, lv: 1 });
  }
  for (const p of sw.passives) if (p.lv < SWARM.maxLevel) all.push({ kind: "passive", id: p.id, lv: p.lv + 1 });
  if (passiveSlotOpen(s)) {
    for (const id of swarmPassives(c)) if (!sw.passives.some((p) => p.id === id)) all.push({ kind: "passive", id, lv: 1 });
  }
  // 다 키우면: 회복 · 돈 · 힘(피해 +, 쌓임)
  if (all.length === 0) return [{ kind: "heal" }, { kind: "gold" }, { kind: "might" }];
  const rng = createRng(deriveSeed(s.seed, "swarmPick", sw.picks));
  return pickDistinct(rng, all, SWARM.choices);
}

/** 후보 i를 고름 (고르는 중이 아니면 무시) */
export function chooseSwarm(s: RunState, i: number): void {
  const sw = s.swarm;
  const c = sw?.choices?.[i];
  if (!sw || !c) return;
  sw.choices = null;
  sw.pending = Math.max(0, sw.pending - 1);
  sw.picks++;
  if (c.kind === "heal") {
    // 악의 사도는 회복 대신 체력이 깎임 (회복약과 같음)
    if (s.player.characterId === "apostle") apostlePotion(s, s.player.stats.maxHp * SWARM.heal);
    else s.player.hp = Math.min(s.player.stats.maxHp, s.player.hp + s.player.stats.maxHp * SWARM.heal);
  } else if (c.kind === "gold") addGold(s, SWARM.maxed.gold);
  else if (c.kind === "might") {
    s.player.svMight = (s.player.svMight ?? 0) + 1;
    syncFighters(s);
  } else if (c.kind === "passive") addPassive(s, c.id);
  else if (c.lv === 1) {
    sw.weapons.push(addGhost(s, c.id));
    syncFighters(s);
  } else levelWeapon(s, c.id);
}

function levelWeapon(s: RunState, id: WeaponId): void {
  eachFighter(s, (p, w) => {
    if (w.id !== id) return;
    p.svLv = Math.min(SWARM.maxLevel, (p.svLv ?? 1) + 1);
    recalcStats(s);
  });
}

/** 패시브 얻기 (이미 있으면 레벨 +1). 얻은 레벨 */
export function addPassive(s: RunState, id: PassiveId): number {
  const sw = s.swarm!;
  const hero = s.player;
  const have = sw.passives.find((p) => p.id === id);
  if (have) have.lv = Math.min(SWARM.maxLevel, have.lv + 1);
  else {
    sw.passives.push({ id, lv: 1 });
    hero.passives.push(id);
  }
  hero.svPass = Object.fromEntries(sw.passives.map((p) => [p.id, p.lv]));
  syncFighters(s);
  return have?.lv ?? 1;
}

/** 황금 상자: 각성할 무기가 있으면 각성, 없으면 이 캐릭터 패시브(전용·공용) 하나를 얻거나 레벨 + */
export function openChest(s: RunState): void {
  const sw = s.swarm!;
  const evo = evoReady(s);
  if (evo) {
    eachFighter(s, (p, w) => {
      if (w.id !== evo) return;
      p.svEvo = true;
      recalcStats(s);
      addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 40, maxTicks: 30, width: 3 });
    });
    sw.reward = { kind: "evo", id: evo, tick: s.tick };
    return;
  }
  const pool = swarmPassives(s.player.characterId).filter((id) => {
    const have = sw.passives.find((p) => p.id === id);
    return have ? have.lv < SWARM.maxLevel : passiveSlotOpen(s);
  });
  if (pool.length === 0) {
    s.player.hp = s.player.stats.maxHp;
    return;
  }
  const id = createRng(deriveSeed(s.seed, "swarmChest", s.tick, sw.picks)).pick(pool);
  sw.reward = { kind: "passive", id, lv: addPassive(s, id), tick: s.tick };
}

/** 첫 무기(캐릭터 본인) 정하기 */
export function startWeapon(s: RunState, id: WeaponId): void {
  if (!WEAPONS[id]) return;
  equipWeapon(s, id);
  s.player.svLv = 1;
  s.swarm!.weapons = [{ id }];
}
