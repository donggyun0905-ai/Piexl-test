// 방에 아이템 놓기: 얻을 수 있는 아이템 목록 · 보물방 · 방 정리 보상(돈·사용 아이템·층 보상)
import { PERKS } from "../perks";
import { ROOM_CX as CX, ROOM_CY as CY } from "../constants";
import { WEAPON_IDS, WEAPONS, type CharacterId, type WeaponDef, type WeaponId, type WeaponKind } from "../content";
import { HIDDEN_USE_IDS } from "../itemsHidden";
import { HEAL_ITEMS, PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, type PassiveDef, type PassiveId, type UseItemId } from "../items";
import { createRng, deriveSeed, type Rng } from "../rng";
import { itemAvailable } from "../achievements";
import { healPlayer } from "./combat";
import { petGold } from "./lobbyPet";
import { goldMul } from "./baseStats";
import { bannerHeal, thiefGold } from "./pungHooks";
import type { EnemyState, Pickup, PickupKind, RunState } from "./types";
import { ENEMIES } from "../content";
import { depth, lastFloorOf } from "./hero";
import { addEffect, hasPerk } from "./util";
import { seatNo } from "./party";
import { tabooDown, tabooN } from "./taboo";
import { ONI } from "../weaponsOni";
import { xpOnly } from "./morphXp";
import { goldLocked, oniWeaponOk } from "./oniRules";
import { setRoomClear } from "./buildSetFx";
import { pickPassives } from "./buildBias";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 처음 자금 (레이드 아레나 빼고) */
  START_GOLD: 50,
  /** 전투방을 정리하면 받는 돈: 1~2층 · 3~4층 · 5층부터 */
  ROOM_GOLD_1: 3,
  ROOM_GOLD_3: 5,
  ROOM_GOLD_5: 7,
  /** 강한 적 방(주황)을 정리하면 받는 돈: 1~2층 · 3~4층 · 5층부터 */
  ELITE_GOLD_1: 5,
  ELITE_GOLD_3: 7,
  ELITE_GOLD_5: 10,
  /** 던전에서 몬스터 하나를 잡으면 받는 돈 (날벌레·박쥐 무리는 무리를 다 잡아야 한 번) */
  gold: 1,
  /** 던전 몬스터를 잡았을 때 돈이 나올 확률 (정예·보스는 늘 나옴) */
  GOLD_CHANCE: 0.4,
  /** 던전에서 정예(주황 방의 큰 몬스터)를 잡으면 받는 돈 */
  CHAMP_GOLD: 10,
  /** 가질 수 있는 가장 많은 돈 (패왕전 빼고, 넘으면 더 쌓이지 않음) */
  MAX_GOLD: 999,
};
export { R as LOOT_RULES };
// 단련의 방 기구·여신의 선물 놓기 (sim/gym·golden, rooms가 여기서 가져감)
export { spawnGym } from "./gym";
export { spawnGolden } from "./golden";
export const START_GOLD = () => R.START_GOLD;
/** 몬스터 하나로 받는 가장 큰 돈 (진행 기록 검사) */
export const KILL_GOLD = () => Math.max(R.gold, R.CHAMP_GOLD);
/** 방 하나를 정리해 받는 가장 큰 돈 (진행 기록 검사) */
export const ROOM_GOLD_MAX = () => Math.max(R.ROOM_GOLD_1, R.ROOM_GOLD_3, R.ROOM_GOLD_5, R.ELITE_GOLD_1, R.ELITE_GOLD_3, R.ELITE_GOLD_5);

/** 돈 얻기: 돈 주머니·로비 펫·기본 스탯·금기 가난 → 한도(MAX_GOLD)까지만 (넘친 만큼은 번 돈에도 안 넣음) */
export function addGold(s: RunState, amount: number): void {
  if (hasPerk(s.player, "goldPouch")) amount = Math.round(amount * PERKS.goldPouch.gold);
  amount = Math.round(amount * petGold(s) * goldMul(s.player) * thiefGold(s.player));
  if (s.taboo) amount = Math.round(amount * tabooDown(s, "poverty"));
  if (!s.pvp) amount = Math.max(0, Math.min(amount, R.MAX_GOLD - s.gold));
  s.gold += amount;
  s.goldEarned += amount;
}

/** 적을 잡으면 받는 돈: 던전은 확률로 gold (보스는 늘 · 정예 CHAMP_GOLD · 무리는 마지막 하나만 · 라스트 보스 층 0) · 광야·패왕전·아레나·현상금은 적 표의 돈 */
export function killGold(s: RunState, e: EnemyState): number {
  if (e.bounty !== undefined) return e.bounty;
  if (s.swarm || s.pvp || s.arenaLv) return ENEMIES[e.kind].gold;
  if (s.lastBoss && s.floor === lastFloorOf(s)) return 0;
  // 정예였던 몬스터 (정예가 풀린 뒤 잡아도)
  if (e.champ || e.champK) return R.CHAMP_GOLD;
  if (e.flock !== undefined && s.enemies.some((o) => o !== e && o.flock === e.flock && o.hp > 0)) return 0;
  if (ENEMIES[e.kind].boss) return R.gold;
  return createRng(deriveSeed(s.seed, "killGold", s.floor, s.roomId, e.id)).nextFloat() < R.GOLD_CHANCE ? R.gold : 0;
}

/** 방 가운데 (지금 방 크기를 따름) */
export { ROOM_CX as CX, ROOM_CY as CY } from "../constants";

export function addPickup(
  s: RunState,
  roomId: number,
  kind: PickupKind,
  itemId: string,
  x: number,
  y: number,
  group = 0,
  price = 0,
): void {
  const pk: Pickup = { id: s.nextId++, kind, itemId, x, y, group, armed: true, price };
  // 협동: 지금 자리 사람의 것 (남의 것은 보이지 않고 못 주움)
  if (s.party) pk.owner = seatNo(s);
  s.rooms[roomId]!.pickups.push(pk);
}

/** 협동: 사람마다 다른 아이템이 나오게 시드에 자리 번호를 섞음. 혼자면 그대로 */
export function seatSalt(s: RunState): (string | number)[] {
  return s.party ? ["seat", seatNo(s)] : [];
}

/** 캐릭터가 쓰는 공격 방식: 공용 무기는 이 방식만 얻을 수 있음 (전용 아이템 효과가 맞게). 음양사는 부적(전용 무기)만 */
const NATIVE_KIND: Record<CharacterId, WeaponKind | null> = { warden: "melee", drifter: "ranged", mage: "ranged", mystic: null, engineer: "laser", elementalist: null, brawler: null, doctor: "medic", gunner: null, beast: null, ninja: null, chronomancer: null, summoner: null, novice: null, bedouin: null, general: null, imugi: null, apostle: null, stargazer: null, duck: null, abandoned: null, titan: null, oni: null, scribe: null, idra: null, byeonhui: null, fly: null, elder: null, ren: null, spiritist: null, plague: null, slayer: null, eater: null, mukin: null, samyeol: null, automata: null, rider: null, bomber: null, artifacter: null, punk: null, collector: null, tracker: null, forgotten: null, remnant: null, wanderer: null, silk: null, pungryu: null, leo: null, onyx: null, fenrir: null, eclipse: null, thorken: null, levia: null, tail: null, madQueen: null, hook: null, orca: null, wave: null, miryu: null, beatrice: null, ian: null, miner: null, voyager: null, zeus: null, pilgrim: null, fallenKing: null, lux: null };

/** 이 캐릭터가 얻을 수 있는 무기 (자기 전용 + 자기 공격 방식의 공용, 지금 든 무기 제외, 해금된 것만 · all이면 해금과 상관없이) */
export function weaponPool(s: RunState, all = false): WeaponId[] {
  return characterWeapons(s.player.characterId).filter((id) => id !== s.player.weaponId && (all || (itemAvailable("weapon", id, s.unlocks) && oniWeaponOk(s.player, id))));
}

/** 무기 자리에 놓을 것: 얻을 무기가 없으면(베두인처럼 무기가 하나뿐) 대신 패시브 */
export function weaponSlot(s: RunState, rng: Rng): { kind: "weapon" | "passive"; id: string } {
  const pool = weaponPool(s);
  return pool.length > 0 ? { kind: "weapon", id: rng.pick(pool) } : { kind: "passive", id: rng.pick(passivePool(s)) };
}

/** 이 캐릭터가 쓸 수 있는 무기 전부 (자기 전용 + 자기 공격 방식의 공용) */
export function characterWeapons(c: CharacterId): WeaponId[] {
  return WEAPON_IDS.filter((id) => {
    const def: WeaponDef = WEAPONS[id];
    // 풋내기는 공용 무기 전부 (근접·원거리 모두)
    return def.exclusive === c || (def.exclusive === undefined && (c === "novice" || def.kind === NATIVE_KIND[c]));
  });
}

/** 이 캐릭터가 얻을 수 있는 패시브 (공용 + 자기 전용, 해금된 것만, 공격 방식 아이템은 이미 가졌으면 제외, 정해진 자리 아이템 제외) */
export function passivePool(s: RunState): PassiveId[] {
  const c = s.player.characterId;
  const ownOnly = c === "idra" || c === "slayer";
  // 이드라·학살자: 공용 아이템 없이 자기 전용만 (전용 아이템을 다 모았으면 공용 아이템도: 빈 진열대로 멈추지 않게)
  const own = poolOf(s, ownOnly);
  const pool = own.length > 0 || !ownOnly ? own : poolOf(s, false);
  // 무기 전용 아이템은 행운이 높을수록 잘 나옴 (행운 1마다 한 번 더 넣음, 최대 4번)
  const extra = Math.min(4, Math.floor(s.player.stats.luck));
  return extra > 0 ? [...pool, ...pool.filter((id) => (PASSIVES[id] as PassiveDef).forWeapon).flatMap((id) => Array<PassiveId>(extra).fill(id))] : pool;
}

function poolOf(s: RunState, ownOnly: boolean): PassiveId[] {
  const c = s.player.characterId;
  return PASSIVE_IDS.filter((id) => {
    const def: PassiveDef = PASSIVES[id];
    if (def.special || (def.exclusive !== undefined && def.exclusive !== c)) return false;
    if (ownOnly && def.exclusive !== c) return false;
    // 오니: 무기 전용 아이템은 그 무기를 들었을 때만
    if (def.forWeapon !== undefined && def.forWeapon !== s.player.weaponId) return false;
    // 변희 동물 능력: 사냥 경험치로만 (morphXp)
    if (xpOnly(def)) return false;
    if (def.effect && s.player.passives.includes(id)) return false;
    if (s.sudden && HEAL_ITEMS.has(`passive:${id}`)) return false;
    return itemAvailable("passive", id, s.unlocks);
  });
}

export function usePool(s: RunState, shop = false): UseItemId[] {
  const ids = USE_ITEM_IDS.filter((id) => !HIDDEN_USE_IDS.includes(id) && itemAvailable("use", id, s.unlocks) && !(s.sudden && HEAL_ITEMS.has(`use:${id}`)) && !(shop && id === "moneyBag"));
  // 나오는 몫: 영약 1 · 회복약 3 · 나머지 2 (영약이 회복약보다 드묾)
  return ids.flatMap((id) => Array<UseItemId>(USE_SHARE[id] ?? 2).fill(id));
}
const USE_SHARE: Partial<Record<UseItemId, number>> = { elixir: 1, potion: 3 };

/** 서로 다른 것 n개 고르기 */
export function pickDistinct<T>(rng: Rng, pool: readonly T[], n: number): T[] {
  const left = [...pool];
  const out: T[] = [];
  while (out.length < n && left.length > 0) {
    const i = rng.int(0, left.length - 1);
    const v = left.splice(i, 1)[0]!;
    // 같은 것이 여러 번 들어 있어도(행운으로 더 넣은 오니 아이템) 한 번만
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

/** 보물방: 무기 1개 + 사용 아이템 1개 */
export function spawnTreasure(s: RunState, roomId: number): void {
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "treasure", ...seatSalt(s)));
  goldClubBonus(s);
  const w = weaponSlot(s, rng);
  addPickup(s, roomId, w.kind, w.id, CX - 20, CY);
  const use = rng.pick(usePool(s));
  // 금기: 빈 보물 (무기만)
  if (tabooN(s, "poorTreasure") === 0) addPickup(s, roomId, "use", use, CX + 20, CY);
}

/** 방을 처음 정리했을 때: 전투방은 돈(층마다 정해짐, LOOT_RULES) + 확률로 사용 아이템 (강한 적 방은 돈 더 + 사용 아이템 꼭), 보스방은 층 보상(패시브 3개 중 1개) */
export function onRoomCleared(s: RunState, roomId: number): void {
  const type = s.map.rooms[roomId]!.type;
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "clear", ...seatSalt(s)));
  // 재생 부적: 전투방·보스방을 정리하면 체력 회복
  if ((type === "combat" || type === "elite" || type === "exit") && hasPerk(s.player, "regenCharm")) healPlayer(s, s.player.stats.maxHp * PERKS.regenCharm.heal);
  // 빌드 세트 빛 4 (sim/buildSetFx)
  if (type === "combat" || type === "elite" || type === "exit") setRoomClear(s);
  // 전투식량(거너): 전투가 끝나면 최대 체력의 10% 회복
  if ((type === "combat" || type === "elite" || type === "exit") && hasPerk(s.player, "ration")) healPlayer(s, s.player.stats.maxHp * 0.1);
  // 활빈당 깃발(풍류사)
  if ((type === "combat" || type === "elite" || type === "exit") && bannerHeal(s.player) > 0) healPlayer(s, bannerHeal(s.player));
  // 레이드 아레나: 보스를 잡아도 보상 없음 (레벨마다 보상 방에서)
  if (s.arenaLv) return;
  if (type === "combat" || type === "elite") {
    const elite = type === "elite";
    // 행운이 높을수록 잘 나옴
    const chance = Math.min(0.9, 0.3 + 0.1 * s.player.stats.luck);
    // 금기: 마른 보상 (사용 아이템이 나오지 않음)
    if ((rng.nextFloat() < chance || elite) && tabooN(s, "noUseDrop") === 0) addPickup(s, roomId, "use", rng.pick(usePool(s)), CX, CY);
    const tier = Math.min(2, Math.max(0, Math.floor((depth(s) - 1) / 2)));
    const coins = elite ? [R.ELITE_GOLD_1, R.ELITE_GOLD_3, R.ELITE_GOLD_5][tier]! : [R.ROOM_GOLD_1, R.ROOM_GOLD_3, R.ROOM_GOLD_5][tier]!;
    // 돈은 바닥에 두지 않고 바로 얻음 (그 자리에 얻는 효과만)
    const before = s.goldEarned;
    addGold(s, coins);
    addEffect(s, { kind: "coinGet", x: CX, y: CY + 18, dirX: 0, dirY: 0, size: s.goldEarned - before, maxTicks: 40 });
  } else if (type === "exit") {
    // 금기: 좁은 선택 (고를 수 있는 패시브가 줄어듦)
    const choices = pickPassives(s, rng, passivePool(s), 3).slice(0, Math.max(1, 3 - tabooN(s, "fewChoices")));
    choices.forEach((id, i) => addPickup(s, roomId, "passive", id, CX - 14 * (choices.length - 1) + i * 28, CY - 34, s.floor));
  }
}

/** 라스트 보스 층 시작 방: 여신상 앞에 여신의 축복 하나 */
export function spawnBlessing(s: RunState, roomId: number): void {
  addPickup(s, roomId, "passive", "goddessBlessing", CX, CY + 12, 0);
}

/** 금봉: 보물방·여신의 선물에 들어오면 체력 가득 + 돈 (금빛 효과). 금봉이면 true */
export function goldClubBonus(s: RunState): boolean {
  const p = s.player;
  if (!goldLocked(p)) return false;
  p.hp = p.stats.maxHp;
  const before = s.goldEarned;
  addGold(s, ONI.gold.roomGold);
  addEffect(s, { kind: "coinGet", x: p.x, y: p.y - 14, dirX: 0, dirY: 0, size: s.goldEarned - before, maxTicks: 50 });
  addEffect(s, { kind: "oCoins", x: p.x, y: p.y, dirX: 0, dirY: -1, size: 40, width: -1, maxTicks: 30 });
  addEffect(s, { kind: "plus", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 30 });
  return true;
}
