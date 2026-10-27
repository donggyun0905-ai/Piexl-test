// 방에 아이템 놓기: 얻을 수 있는 아이템 목록 · 보물방 · 방 정리 보상(돈·사용 아이템·층 보상)
import { PERKS } from "../perks";
import { ROOM_CX as CX, ROOM_CY as CY } from "../constants";
import { WEAPON_IDS, WEAPONS, type CharacterId, type WeaponDef, type WeaponId, type WeaponKind } from "../content";
import { HEAL_ITEMS, PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, type PassiveDef, type PassiveId, type UseItemId } from "../items";
import { createRng, deriveSeed, type Rng } from "../rng";
import { itemAvailable } from "../achievements";
import { addGold, healPlayer } from "./combat";
import type { Pickup, PickupKind, RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { seatNo } from "./party";
import { tabooN } from "./taboo";
import { ONI } from "../weaponsOni";
import { xpOnly } from "./morphXp";
import { goldLocked, oniWeaponOk } from "./oniRules";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  GOLDEN_GOLD: 300,
};
export { R as LOOT_RULES };

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
const NATIVE_KIND: Record<CharacterId, WeaponKind | null> = { warden: "melee", drifter: "ranged", mage: "ranged", mystic: null, engineer: "laser", elementalist: null, brawler: null, doctor: "medic", gunner: null, beast: null, ninja: null, chronomancer: null, summoner: null, novice: null, bedouin: null, general: null, imugi: null, apostle: null, stargazer: null, duck: null, abandoned: null, titan: null, oni: null, scribe: null, idra: null, byeonhui: null, fly: null, elder: null, ren: null, spiritist: null, plague: null, slayer: null, eater: null, mukin: null, samyeol: null, automata: null, rider: null, bomber: null, artifacter: null, punk: null, tracker: null, forgotten: null, remnant: null, wanderer: null };

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

export function usePool(s: RunState): UseItemId[] {
  return USE_ITEM_IDS.filter((id) => itemAvailable("use", id, s.unlocks) && !(s.sudden && HEAL_ITEMS.has(`use:${id}`)));
}

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

/** 방을 처음 정리했을 때: 전투방은 돈 + 확률로 사용 아이템 (강한 적 방은 돈 2배 + 사용 아이템 꼭), 보스방은 층 보상(패시브 3개 중 1개) */
export function onRoomCleared(s: RunState, roomId: number): void {
  const type = s.map.rooms[roomId]!.type;
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "clear", ...seatSalt(s)));
  // 재생 부적: 전투방·보스방을 정리하면 체력 회복
  if ((type === "combat" || type === "elite" || type === "exit") && hasPerk(s.player, "regenCharm")) healPlayer(s, s.player.stats.maxHp * PERKS.regenCharm.heal);
  // 전투식량(거너): 전투가 끝나면 최대 체력의 10% 회복
  if ((type === "combat" || type === "elite" || type === "exit") && hasPerk(s.player, "ration")) healPlayer(s, s.player.stats.maxHp * 0.1);
  // 레이드 아레나: 보스를 잡아도 보상 없음 (레벨마다 보상 방에서)
  if (s.arenaLv) return;
  if (type === "combat" || type === "elite") {
    const elite = type === "elite";
    // 행운이 높을수록 잘 나옴
    const chance = Math.min(0.9, 0.3 + 0.1 * s.player.stats.luck);
    // 금기: 마른 보상 (사용 아이템이 나오지 않음)
    if ((rng.nextFloat() < chance || elite) && tabooN(s, "noUseDrop") === 0) addPickup(s, roomId, "use", rng.pick(usePool(s)), CX, CY);
    const coins = (rng.int(2, 5) + Math.floor(s.player.stats.luck)) * (elite ? 2 : 1);
    // 돈은 바닥에 두지 않고 바로 얻음 (그 자리에 얻는 효과만)
    const before = s.goldEarned;
    addGold(s, coins);
    addEffect(s, { kind: "coinGet", x: CX, y: CY + 18, dirX: 0, dirY: 0, size: s.goldEarned - before, maxTicks: 40 });
  } else if (type === "exit") {
    // 금기: 좁은 선택 (고를 수 있는 패시브가 줄어듦)
    const choices = pickDistinct(rng, passivePool(s), 3).slice(0, Math.max(1, 3 - tabooN(s, "fewChoices")));
    choices.forEach((id, i) => addPickup(s, roomId, "passive", id, CX - 14 * (choices.length - 1) + i * 28, CY - 34, s.floor));
  }
}

/** 황금방: 아이템 9개를 공짜로 늘어놓고 그중 3개만 가질 수 있음 (다 고르면 나머지는 사라짐) + 돈 300 */
export const GOLDEN_GROUP = 900;
export const GOLDEN_PICKS = 3;

/** 라스트 보스 층 시작 방: 여신상 앞에 여신의 축복 하나 */
export function spawnBlessing(s: RunState, roomId: number): void {
  addPickup(s, roomId, "passive", "goddessBlessing", CX, CY + 12, 0);
}

/** 금봉: 보물방·황금방에 들어오면 체력 가득 + 돈 (금빛 효과). 금봉이면 true */
function goldClubBonus(s: RunState): boolean {
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

export function spawnGolden(s: RunState, roomId: number): void {
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "golden", ...seatSalt(s)));
  let pool = [...passivePool(s)];
  // 금봉: 황금방에 들어오면 체력 가득 + 돈, 진열은 패시브 6개 + 사용 아이템 3개 (사용 아이템은 따로 가짐)
  const gold = goldClubBonus(s);
  for (let i = 0; i < 9 && pool.length > 0; i++) {
    const at: [number, number] = [CX - 40 + (i % 3) * 40, CY - 36 + Math.floor(i / 3) * 24];
    if (gold && i >= 6) {
      addPickup(s, roomId, "use", rng.pick(usePool(s)), at[0], at[1], 0);
      continue;
    }
    const id = pool[rng.int(0, pool.length - 1)]!;
    pool = pool.filter((x) => x !== id);
    addPickup(s, roomId, "passive", id, at[0], at[1], GOLDEN_GROUP);
  }
  addPickup(s, roomId, "coin", "coin", CX - 80, CY - 12, 0, R.GOLDEN_GOLD);
  s.goldenPicks = 0;
}
