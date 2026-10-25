// 상점: 진열·가격·새로고침
import type { UseItemId } from "../items";
import { SHOP_PRICES } from "../perks";
import { createRng, deriveSeed } from "../rng";
import { addPickup, CX, CY, passivePool, seatSalt, usePool, weaponPool, weaponSlot } from "./loot";
import type { WeaponId } from "../content";
import { addGold } from "./combat";
import { equipWeapon } from "./items";
import { goldLocked } from "./oniRules";
import type { Pickup, RunState } from "./types";
import { addEffect } from "./util";
import { depth, lastFloorOf } from "./hero";
import { tabooN, tabooUp } from "./taboo";

const PRICE = SHOP_PRICES.price;

/** 상점 가격: 층마다 조금씩 오르고, 행운이 높으면 조금 싸짐 (최대 maxDiscount) */
function shopPrice(s: RunState, base: number): number {
  const discount = Math.min(PRICE.maxDiscount, PRICE.luckDiscount * s.player.stats.luck);
  // 금기: 물가 상승
  return Math.max(1, Math.round((base + PRICE.perFloor * (depth(s) - 1)) * (1 - discount) * tabooUp(s, "inflation")));
}

/** 금기: 빈 진열대 (1번 = 사용 아이템 칸, 2번 = 무기 칸도 없음) · 새로고침 세금 (한 번마다 2배) */
const shelfGone = (s: RunState, slot: "use" | "weapon") => tabooN(s, "emptyShelf") >= (slot === "use" ? 1 : 2);
const rerollPrice = (s: RunState, base: number) => shopPrice(s, base) * [1, 2, 4][tabooN(s, "rerollTax")]!;

/** 사용 아이템 기본 가격: 체력을 모두 채우는 명약은 회복약보다 훨씬 비쌈 */
const useBase = (id: UseItemId) => (id === "potion" ? PRICE.potion : id === "elixir" ? PRICE.elixir : PRICE.use);

/** 상점 진열 자리 (가운데 기준 x). 마지막 자리는 늘 회복약 */
const SHOP_X = { passive: -42, weapon: -14, use: 14, potion: 42 } as const;
const shopY = () => CY - 8;

/** 상점: 패시브 · 무기 · 사용 아이템 · 회복약 + 새로고침. F(모바일은 버튼)로만 삼 */
export function spawnShop(s: RunState, roomId: number): void {
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", roomId, "shop", ...seatSalt(s)));
  const use = rng.pick(usePool(s));
  addPickup(s, roomId, "passive", rng.pick(passivePool(s)), CX + SHOP_X.passive, shopY(), 0, shopPrice(s, PRICE.passive));
  const w = weaponSlot(s, rng);
  if (!shelfGone(s, "weapon")) addPickup(s, roomId, w.kind, w.id, CX + SHOP_X.weapon, shopY(), 0, shopPrice(s, PRICE[w.kind]));
  if (!shelfGone(s, "use")) addPickup(s, roomId, "use", use, CX + SHOP_X.use, shopY(), 0, shopPrice(s, useBase(use)));
  // 서든데스는 회복약 자리를 비워 둠
  if (!s.sudden) addPickup(s, roomId, "use", "potion", CX + SHOP_X.potion, shopY(), 0, shopPrice(s, useBase("potion")));
  // 새로고침: itemId는 이 상점에서 누른 횟수
  addPickup(s, roomId, "reroll", "0", CX, CY + 18, 0, rerollPrice(s, PRICE.reroll));
  // 휴지통: price = 버리면 돌려받는 돈 (무기 값의 1/4), itemId "1" = 한 번 눌러 확인을 기다리는 중
  addPickup(s, roomId, "trash", "0", CX + SHOP_X.potion, CY + 18, 0, Math.max(1, Math.round(shopPrice(s, PRICE.weapon) / 4)));
}

/** 상점에서 산 물건과 바꿔 내려놓은 것은 진열대 아래로 (진열 자리를 가리지 않게) */
export function clearShelf(pk: Pickup): void {
  if (pk.y === shopY()) pk.y += 14;
}

/** 무기를 버린 빈손 (풋내기 맨손과 같음, 땅에 내려놓지 않음) */
export const EMPTY_HANDS: WeaponId = "fists";

/** 휴지통 앞: F 한 번 = 확인 안내, 한 번 더 = 들고 있는 무기를 버리고 빈손(맨손)으로 (돈을 조금 돌려받음). 이미 빈손이면 안내 없음 */
export function trashAt(s: RunState, pk: Pickup, interact: boolean): void {
  const p = s.player;
  if (s.prompt.kind !== "none" || p.weaponId === EMPTY_HANDS || goldLocked(p)) return;
  const confirm = pk.itemId === "1";
  s.prompt = { kind: "trash", price: pk.price, confirm };
  if (!interact) return;
  if (!confirm) {
    pk.itemId = "1";
    return;
  }
  pk.itemId = "0";
  equipWeapon(s, EMPTY_HANDS);
  addGold(s, pk.price);
  addEffect(s, { kind: "hit", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 6, maxTicks: 10 });
}

/** 새로고침: 아직 안 산 진열 물건(회복약 자리 제외)만 다시 뽑음. 산 자리는 비어 있는 그대로 (라스트 보스 층은 산 자리도 채움) */
export function rerollShop(s: RunState, reroll: Pickup): void {
  const count = Number(reroll.itemId) + 1;
  const rng = createRng(deriveSeed(s.seed, "floor", s.floor, "room", s.roomId, "reroll", count, ...seatSalt(s)));
  const pickNew = <T extends string>(pool: readonly T[], cur: string): T => {
    const other = pool.filter((id) => id !== cur);
    return rng.pick(other.length > 0 ? other : pool);
  };
  for (const pk of s.rooms[s.roomId]!.pickups) {
    if (pk.owner !== reroll.owner) continue;
    // 산 물건·내려놓은 물건은 가격이 0이라 그대로 둠
    if (pk.price <= 0 || pk.y !== shopY() || pk.x === CX + SHOP_X.potion) continue;
    if (pk.kind === "passive") {
      pk.itemId = pickNew(passivePool(s), pk.itemId);
      pk.price = shopPrice(s, PRICE.passive);
    } else if (pk.kind === "weapon") {
      pk.itemId = pickNew(weaponPool(s), pk.itemId);
      pk.price = shopPrice(s, PRICE.weapon);
    } else if (pk.kind === "use") {
      const id = pickNew(usePool(s), pk.itemId);
      pk.itemId = id;
      pk.price = shopPrice(s, useBase(id));
    } else continue;
    addEffect(s, { kind: "hit", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 5, maxTicks: 8 });
  }
  // 라스트 보스 층 상점: 산 자리도 새로 채움
  if (s.floor === lastFloorOf(s)) {
    const room = s.rooms[s.roomId]!;
    const empty = (dx: number) => !room.pickups.some((pk) => pk.price > 0 && pk.y === shopY() && pk.x === CX + dx);
    if (empty(SHOP_X.passive)) addPickup(s, s.roomId, "passive", rng.pick(passivePool(s)), CX + SHOP_X.passive, shopY(), 0, shopPrice(s, PRICE.passive));
    if (empty(SHOP_X.weapon) && !shelfGone(s, "weapon")) {
      const w = weaponSlot(s, rng);
      addPickup(s, s.roomId, w.kind, w.id, CX + SHOP_X.weapon, shopY(), 0, shopPrice(s, PRICE[w.kind]));
    }
    if (empty(SHOP_X.use) && !shelfGone(s, "use")) {
      const use = rng.pick(usePool(s));
      addPickup(s, s.roomId, "use", use, CX + SHOP_X.use, shopY(), 0, shopPrice(s, useBase(use)));
    }
    // 회복약 자리도 산 뒤 새로고침하면 다시 채움
    if (empty(SHOP_X.potion) && !s.sudden) addPickup(s, s.roomId, "use", "potion", CX + SHOP_X.potion, shopY(), 0, shopPrice(s, useBase("potion")));
  }
  reroll.itemId = String(count);
  reroll.price = rerollPrice(s, PRICE.reroll + PRICE.rerollStep * count);
}
