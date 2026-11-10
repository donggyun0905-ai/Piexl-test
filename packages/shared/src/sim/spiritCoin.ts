// 비르디아 욕심 많은 코인 정령 (도박형 · 처음부터 궁극체): 주우려는 아이템(무기·패시브·사용 아이템)을 정령이 다 먹음 → 가치만큼 점수 (머리 위 숫자)
// 5번 키(SPIRIT_OP.coin): 다다른 가장 높은 단계 점수를 쓰고 상자가 쏟아짐 (캐릭터 전용 패시브·공용 패시브·아이템). 정령이 내놓은 아이템은 먹지 않음 (수치 spiritDefs.SPIRIT_COIN)
import { DEVIL_IDS } from "../itemsDevil";
import { HIDDEN_PASSIVES, HIDDEN_USE_IDS } from "../itemsHidden";
import { PASSIVES, type PassiveDef } from "../items";
import { createRng, deriveSeed } from "../rng";
import { SPIRIT_COIN as C } from "../spiritDefs";
import { ARENA_USE_GROUP } from "./arena";
import { GOLDEN_GROUP } from "./golden";
import { addPickup, characterWeapons, passivePool, pickDistinct, usePool } from "./loot";
import type { Pickup, RunState } from "./types";
import { rot } from "./orbit";
import { addEffect } from "./util";

const HIDDEN = new Set<string>([...Object.keys(HIDDEN_PASSIVES), ...HIDDEN_USE_IDS]);
const DEVIL = new Set<string>(DEVIL_IDS);

/** 아이템 하나의 가치 (주황 방이면 더함 · 히든 상점이면 히든 값) */
export function coinValue(s: RunState, pk: Pickup): number {
  const room = s.map.rooms[s.roomId]?.type;
  let v = pk.kind === "use" ? C.use : pk.kind === "weapon" ? C.weapon : (PASSIVES[pk.itemId as keyof typeof PASSIVES] as PassiveDef | undefined)?.exclusive ? C.own : C.passive;
  if (DEVIL.has(pk.itemId)) v = C.devil;
  if (HIDDEN.has(pk.itemId) || room === "hidden") v = Math.max(v, C.hidden);
  return v + (room === "elite" ? C.elite : 0);
}

/** 주우려 함 (items.take 처음): 코인 정령이면 먹고 true */
export function coinEat(s: RunState, pk: Pickup): boolean {
  const p = s.player;
  if (p.fcSp !== "coin" || (pk.kind !== "weapon" && pk.kind !== "passive" && pk.kind !== "use")) return false;
  if (pk.itemId === "moneyBag" || pk.group === ARENA_USE_GROUP || p.fcCoinGift?.includes(pk.id)) return false;
  p.fcCoin = (p.fcCoin ?? 0) + coinValue(s, pk);
  const room = s.rooms[s.roomId]!;
  // 보상 묶음은 하나를 먹으면 나머지도 사라짐 (여신의 선물은 그대로)
  room.pickups = room.pickups.filter((x) => x.id !== pk.id && !(pk.group > 0 && pk.group !== GOLDEN_GROUP && x.group === pk.group && x.owner === pk.owner));
  addEffect(s, { kind: "fcSpEat", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 14, maxTicks: 24 });
  return true;
}

/** 지금 점수로 받을 수 있는 단계 (0 = 아직) */
export function coinTier(n: number): number {
  return [C.tier1, C.tier2, C.tier3, C.tier4, C.tier5].filter((t) => n >= t).length;
}

/** 5번 키: 단계 점수를 쓰고 정령에게서 상자가 쏟아짐 */
export function coinMenu(s: RunState): void {
  const p = s.player;
  const tier = coinTier(p.fcCoin ?? 0);
  if (p.fcSp !== "coin" || tier === 0) return;
  p.fcCoin! -= [0, C.tier1, C.tier2, C.tier3, C.tier4, C.tier5][tier]!;
  const rng = createRng(deriveSeed(s.seed, "spiritCoin", s.tick, p.fcCoin!));
  const pool = passivePool(s);
  const own = pickDistinct(rng, pool.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === p.characterId), [0, C.own1, C.own2, C.own3, C.own4, C.own5][tier]!);
  const nOwn = [0, C.own1, C.own2, C.own3, C.own4, C.own5][tier]!;
  const common = pickDistinct(rng, pool.filter((id) => !(PASSIVES[id] as PassiveDef).exclusive && !own.includes(id)), [0, C.com1, C.com2, C.com3, C.com4, C.com5][tier]! + nOwn - own.length);
  const items = [...characterWeapons(p.characterId).filter((w) => w !== p.weaponId).map((id) => ["weapon", id] as const), ...[...new Set(usePool(s))].map((id) => ["use", id] as const)];
  const got = [...own.map((id) => ["passive", id] as const), ...common.map((id) => ["passive", id] as const), ...pickDistinct(rng, items, [0, C.item1, C.item2, C.item3, C.item4, C.item5][tier]!)];
  const cx = p.fcSpX ?? p.x;
  const cy = p.fcSpY ?? p.y;
  got.forEach(([kind, id], i) => {
    const a = (i / got.length) * 6.283185307179586;
    const r = 26 + (i % 2) * 12;
    const [ox, oy] = rot(a);
    const x = p.x + r * ox;
    const y = p.y + r * oy;
    addPickup(s, s.roomId, kind, id, x, y);
    (p.fcCoinGift ??= []).push(s.nextId - 1);
    addEffect(s, { kind: "fcSpBox", x, y, toX: cx, toY: cy, dirX: 0, dirY: 0, size: 8, style: tier, maxTicks: 30 + i * 3 });
  });
  if (p.fcCoinGift && p.fcCoinGift.length > 60) p.fcCoinGift = p.fcCoinGift.slice(-60);
}
