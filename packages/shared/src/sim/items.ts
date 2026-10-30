// 아이템: 바닥 아이템 줍기·바꾸기, 사용 아이템 쓰기, 능력치 다시 계산 (놓기는 loot, 상점은 shop)
import { pvpStats } from "./pvp";
import { throwIce } from "./pvpExtras";
import { BIG_COIN } from "../constants";
import { morphMods } from "./morphEvo";
import { eaterMods } from "./eater";
import { automataMods } from "./automata";
import { petMods } from "./lobbyPet";
import { secretMods } from "./secretMods";
import { itemVal } from "../pwItems";
import { kingStats } from "./kingForm";
import { TIGER } from "../weaponsBeast";
import { baseStats, CHARACTERS, type CharacterDef, type WeaponId } from "../content";
import { PASSIVES, USE_ITEMS, type PassiveDef, type PassiveId, type UseItemId } from "../items";
import { computeStats, type StatMod } from "../stats";
import { addGold, damageEnemy, healPlayer, removeDead } from "./combat";
import { GOLDEN_GROUP, GOLDEN_PICKS } from "./loot";
import { ARENA_USE_GROUP, arenaUsePick } from "./arena";
import type { Pickup, RunState, TickInput } from "./types";
import { downedNear, seatNo } from "./party";
import { tabooDown, tabooMods } from "./taboo";
import { addEffect, hasPerk } from "./util";
import { charmed } from "./bossesTwo";
import { clearShelf, EMPTY_HANDS, hiddenUse, isStation, rerollShop, sellItem, stationAt, stationMenu, stationMods, trashAt } from "./shop";
import { resetCombo } from "./brawl";
import { resetGun } from "./gun";
import { resetAbandoned } from "./abandoned";
import { noviceMods, spendStat } from "./novice";
import { imugiMods } from "./imugiMods";
import { apostleMods, apostlePotion } from "./apostle";
import { mukinPotion } from "./mukin";
import { swarmMods } from "./swarmMods";
import { goldLocked, noUseItems, oniConvert } from "./oniRules";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 닿았다고 보는 거리 (플레이어 반지름에 더함) */
  TOUCH: 9,
  /** 설명을 띄우는 거리 */
  NEAR: 16,
  /** 협동: 쓰러진 친구에게 닿는 거리 */
  REVIVE_REACH: 16,
};
export { R as ITEMS_RULES };

/** 처방전(의사): 포션·회복 아이템 회복량 배율 */
export const PRESCRIPTION_MUL = 1.5;
/** 바꾸기·고르기는 이만큼 서 있으면 가짐 (0.5초). 지나가다 실수로 바뀌지 않게 */
export const PICKUP_HOLD_TICKS = 30;

/** 무기·패시브가 바뀌면 능력치 다시 계산. 최대 체력이 늘면 그만큼 체력도 늘어남 */
export function recalcStats(s: RunState): void {
  const p = s.player;
  const oldMax = p.stats.maxHp;
  // 풋내기가 찍은 스탯·순례자 도감·몰락한 왕 영혼도 능력치 변화로 · 오니: 공격력·공격 속도·사거리 변화는 최대 체력·재생력·효과 범위로 (oniRules)
  p.mods = oniConvert(p, [...p.passives.flatMap((id): StatMod[] => [...PASSIVES[id].mods]), ...noviceMods(p), ...imugiMods(p), ...apostleMods(p), ...tabooMods(s), ...swarmMods(p), ...morphMods(p), ...eaterMods(p), ...automataMods(p), ...petMods(s), ...stationMods(s), ...secretMods(p)]);
  p.stats = kingStats(p) ?? computeStats(baseStats(p.characterId, p.weaponId), p.mods);
  // 거너: 최대 체력 고정 (체력 아이템을 먹어도 그대로)
  const fixed = p.curseHp ?? (CHARACTERS[p.characterId] as CharacterDef).fixedHp;
  if (fixed) p.stats.maxHp = fixed;
  // 패왕전: 모두 최대 체력 ×10, AI는 모드 보정
  pvpStats(s);
  if (p.stats.maxHp > oldMax) p.hp += p.stats.maxHp - oldMax;
  if (p.hp > p.stats.maxHp) p.hp = p.stats.maxHp;
}

/** 무기 바꾸기: 무기마다 따로인 상태를 처음으로 하고 능력치 다시 계산 */
export function equipWeapon(s: RunState, id: WeaponId): void {
  const p = s.player;
  p.weaponId = id;
  p.attackCooldown = 0;
  p.gearTicks = undefined;
  p.loaded = p.reloadTicks = p.handTicks = p.handId = p.flyers = undefined;
  // 무기를 바꾸면 호랑이 변신이 풀림 (남은 추가 체력도 거둠)
  if ((p.tigerTicks ?? 0) > 0) p.shieldPts = Math.max(0, (p.shieldPts ?? 0) - TIGER.hp);
  p.tigerTicks = undefined;
  resetCombo(p);
  resetGun(p);
  // 버려진 자들: 무기마다 콤보·조합이 달라 처음부터 (교대 자동은 그대로)
  const auto = p.abAuto;
  resetAbandoned(p);
  if (auto) p.abAuto = auto;
  recalcStats(s);
}

/** 지금 방의 층 보상(하나만 고르는 패시브) 목록. 클릭 번호(pickChoice)는 이 순서 */
export function rewardChoices(s: RunState): Pickup[] {
  return (s.rooms[s.roomId]?.pickups ?? []).filter((pk) => mine(s, pk) && pk.kind === "passive" && pk.group > 0 && pk.price === 0);
}

/** 협동: 내가 가질 수 있는 아이템인지 (혼자 하기는 늘 true) */
export function mine(s: RunState, pk: Pickup): boolean {
  return pk.owner === undefined || pk.owner === seatNo(s);
}

function touching(s: RunState, pk: Pickup, reach: number): boolean {
  const dx = pk.x - s.player.x;
  const dy = pk.y - s.player.y;
  const r = s.player.r + reach;
  return dx * dx + dy * dy <= r * r;
}

/** 닿은 아이템 줍기·바꾸기, 사용 아이템 쓰기 */
export function updateItems(s: RunState, input: TickInput): void {
  const p = s.player;
  if (p.shieldTicks > 0) p.shieldTicks--;
  // 세이렌에게 홀린 동안은 물약 등 사용 아이템을 못 씀
  if (input.useSlot > 0 && !charmed(s.player)) useSlot(s, input.useSlot - 1, input);
  if (input.statPick > 0) spendStat(s, input.statPick);
  if (input.sell) sellItem(s, input.sell);
  if (input.menu) stationMenu(s, input.menu);
  if (input.pickChoice > 0) { // 층 보상은 클릭(모바일은 탭)으로 고름. 거리 상관없음
    const pk = rewardChoices(s)[input.pickChoice - 1];
    if (pk) take(s, pk);
  }

  const room = s.rooms[s.roomId]!;
  if (s.prompt.kind === "none" && downedNear(s, R.REVIVE_REACH)) s.prompt = { kind: "revive", ready: room.cleared };
  s.nearPickupId = 0;
  let nearest = Infinity;
  /** 이번 틱에 서 있는 바꾸기·고르기 아이템 (한 번에 하나) */
  let holdId = 0;
  const dist2 = (pk: Pickup) => (pk.x - p.x) ** 2 + (pk.y - p.y) ** 2;
  // 가까운 것부터 (겹쳐 있으면 가까운 쪽이 안내를 가짐)
  for (const pk of [...room.pickups].sort((a, b) => dist2(a) - dist2(b))) {
    if (!mine(s, pk)) continue;
    const d2 = dist2(pk);
    if (d2 < nearest && touching(s, pk, R.NEAR)) {
      nearest = d2;
      s.nearPickupId = pk.id;
    }
    if (pk.kind === "coin") {
      // 큰 동전(100원 이상, 황금방 300원)은 크게 그려서 닿는 거리도 넓음
      if (touching(s, pk, pk.price >= BIG_COIN ? R.TOUCH + 8 : R.TOUCH)) {
        addGold(s, pk.price);
        room.pickups = room.pickups.filter((x) => x.id !== pk.id);
        addEffect(s, { kind: "hit", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 3, maxTicks: 6 });
      }
      continue;
    }
    if (!touching(s, pk, R.TOUCH)) {
      // 한 번 떨어지면 다시 주울 수 있음 (무기·사용 아이템을 번갈아 써 보고 고를 수 있게)
      pk.armed = true;
      if (pk.kind === "trash" || isStation(pk)) pk.itemId = "0";
      continue;
    }
    if (pk.kind === "trash" || isStation(pk)) {
      (pk.kind === "trash" ? trashAt : stationAt)(s, pk, input.interact);
      continue;
    }
    if (!pk.armed || !room.pickups.includes(pk)) continue;
    if (pk.kind === "use" && noUseItems(p)) continue;
    if (pk.price > 0) {
      // 상점 물건: 서 있기로는 사지 않고 F·버튼으로만 (금봉을 든 오니는 상점을 못 씀)
      if (s.prompt.kind !== "none" || goldLocked(p)) continue;
      s.prompt = { kind: "buy", pickupId: pk.id, price: pk.price };
      if (input.interact && s.gold >= pk.price) {
        s.gold -= pk.price;
        s.goldSpent += pk.price;
        if (pk.kind !== "reroll") s.purchases++;
        s.buys.push({ floor: s.floor, roomId: s.roomId, kind: pk.kind, itemId: pk.itemId, price: pk.price });
        if (pk.kind === "reroll") {
          // 새로고침은 사도 남아 있고 다음 가격이 오름 (산 물건 수에는 넣지 않음)
          rerollShop(s, pk);
          continue;
        }
        pk.price = 0;
        take(s, pk);
        clearShelf(pk);
      }
      continue;
    }
    // 빈 칸에 들어가는 사용 아이템은 닿으면 바로. 꽉 찬 칸 바꾸기는 잠깐 서 있으면 가짐
    // (F·버튼을 누르면 바로). 무기 바꾸기·층 보상은 서 있기로는 가지지 않음 (F·버튼, 층 보상은 클릭도)
    // (레이드 아레나 보상 아이템은 지나가다 줍지 않게 F·버튼으로만)
    // 금봉을 든 오니는 다른 무기를 못 잡음
    if (pk.kind === "weapon" && goldLocked(p)) continue;
    const instant = pk.kind === "use" && p.useSlots.includes(null) && pk.group !== ARENA_USE_GROUP;
    if (!instant) {
      if (s.prompt.kind === "none") s.prompt = { kind: "pick", pickupId: pk.id };
      const pressed = input.interact && s.prompt.kind === "pick" && s.prompt.pickupId === pk.id;
      if (pk.group > 0 || pk.kind === "weapon") {
        if (pressed) take(s, pk);
        continue;
      }
      if (holdId !== 0) continue;
      holdId = pk.id;
      const held = s.holdPickupId === pk.id && s.holdTicks + 1 >= PICKUP_HOLD_TICKS;
      if (!pressed && !held) continue;
      holdId = -1; // 가졌으니 이번 틱은 더 세지 않음
    }
    take(s, pk);
  }
  if (holdId > 0) {
    s.holdTicks = s.holdPickupId === holdId ? s.holdTicks + 1 : 1;
    s.holdPickupId = holdId;
  } else {
    s.holdPickupId = 0;
    s.holdTicks = 0;
  }
}

function take(s: RunState, pk: Pickup): void {
  const p = s.player;
  const room = s.rooms[s.roomId]!;
  const remove = (pred: (x: Pickup) => boolean) => {
    room.pickups = room.pickups.filter((x) => !pred(x));
  };
  if (pk.kind === "weapon") {
    // 바꾸기: 들고 있던 무기를 그 자리에 내려놓음
    const old = p.weaponId;
    equipWeapon(s, pk.itemId as WeaponId);
    pk.itemId = old;
    pk.armed = false;
    // 빈손(휴지통에 버린 뒤)이었으면 내려놓을 것이 없음
    if (old === EMPTY_HANDS && p.characterId !== "novice") remove((x) => x.id === pk.id);
  } else if (pk.kind === "use") {
    const item = pk.itemId as UseItemId;
    const empty = p.useSlots.indexOf(null);
    const slot = empty >= 0 ? empty : p.replaceSlot;
    if (empty >= 0) {
      p.useSlots[slot] = item;
      remove((x) => x.id === pk.id);
    } else {
      // 칸이 다 찼으면 먼저 얻은 아이템과 바꿈
      pk.itemId = p.useSlots[slot]!;
      p.useSlots[slot] = item;
      pk.armed = false;
    }
    if (pk.group === ARENA_USE_GROUP) arenaUsePick(s, pk, empty < 0);
    // 다음에 바꿀 칸은 방금 넣은 칸이 아닌 쪽 (더 오래된 아이템)
    p.replaceSlot = (slot + 1) % p.useSlots.length;
  } else {
    p.passives.push(pk.itemId as PassiveId);
    recalcStats(s);
    if (pk.group === GOLDEN_GROUP) {
      // 황금방: 3개까지 고르면 나머지는 사라짐
      s.goldenPicks = (s.goldenPicks ?? 0) + 1;
      remove((x) => x.id === pk.id || ((s.goldenPicks ?? 0) >= GOLDEN_PICKS && x.group === GOLDEN_GROUP));
    } else {
      // 보상 묶음은 하나만 고를 수 있음
      remove((x) => x.id === pk.id || (pk.group > 0 && x.group === pk.group && x.owner === pk.owner));
    }
    // 한 번만 먹는 패시브: 같은 것이 둘 놓여 있었으면(상점 두 자리 등) 나머지도 치움
    if ((PASSIVES[pk.itemId as PassiveId] as PassiveDef | undefined)?.effect) remove((x) => x.kind === "passive" && x.itemId === pk.itemId && x.owner === pk.owner);
  }
  addEffect(s, { kind: "hit", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 5, maxTicks: 8 });
}

function useSlot(s: RunState, slot: number, input: TickInput): void {
  const p = s.player;
  const item = p.useSlots[slot];
  if (!item) return;
  p.useSlots[slot] = null;
  // 협동: 전투가 끝난 방에서 쓰러진 친구 옆이면 회복약으로 일으킴 (회복약 회복량만큼)
  const down = (item === "potion" || item === "elixir") && s.rooms[s.roomId]!.cleared ? downedNear(s, R.REVIVE_REACH) : null;
  if (down) {
    down.hp = Math.max(1, down.stats.maxHp * itemVal(!!s.pvp, item as "potion" | "elixir").healRatio);
    down.invulnTicks = 120;
    addEffect(s, { kind: "burst", x: down.x, y: down.y, dirX: 0, dirY: 0, size: 14, maxTicks: 16 });
  } else if (item === "potion" || item === "elixir") {
    // 처방전(의사): 회복량 +30% · 의사는 넘친 만큼 보호막 (healPlayer) · 악의 사도는 회복 대신 그만큼 피해
    // 금기: 쓴 약
    const amount = p.stats.maxHp * itemVal(!!s.pvp, item).healRatio * (hasPerk(p, "prescription") ? PRESCRIPTION_MUL : 1) * tabooDown(s, "bitterPotion");
    if (p.characterId === "apostle") apostlePotion(s, amount);
    else if (p.characterId === "mukin") mukinPotion(s, amount);
    else healPlayer(s, amount);
  } else if (item === "frost") {
    // 패왕전: 누른 곳으로 얼음 폭탄을 던져 범위 안 상대를 얼림
    if (s.pvp) throwIce(s, input);
    else s.freezeTicks = USE_ITEMS.frost.ticks;
  } else if (item === "bomb") {
    const b = itemVal(!!s.pvp, "bomb");
    // 기간토마키아는 폭탄이 더 아픔 (PW_ITEMS.bomb.giga)
    const [damage, radius] = [s.pvp?.mode === "giganto" ? b.giga : b.damage, b.radius];
    for (const e of s.enemies) {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= radius + e.r) damageEnemy(s, e, damage, d === 0 ? 1 : dx / d, d === 0 ? 0 : dy / d);
    }
    removeDead(s);
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: 16 });
  } else if (item === "ward") {
    p.shieldTicks = itemVal(!!s.pvp, "ward").ticks;
  } else if (item === "moneyBag") {
    const before = s.goldEarned;
    addGold(s, USE_ITEMS.moneyBag.gold);
    addEffect(s, { kind: "coinGet", x: p.x, y: p.y - 12, dirX: 0, dirY: 0, size: s.goldEarned - before, maxTicks: 45 });
  } else hiddenUse(s, item, slot);
}
