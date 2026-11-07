// 비르디아 여우(도박형) · 꾸러미형 정령 (sim/factionSpirit가 부름 · 수치 spiritDefs.SPIRIT_PACK)
// 여우: 방을 끝낼수록 바꾸기가 쌓임 → 앞의 아이템을 무기·패시브(히든·악마 포함)·사용 아이템 전부 중 무작위 하나로 바꿈
// 보관 꾸러미: 칸이 차도 사용 아이템을 계속 넣어 둠(빈 칸 키를 누르면 창 → 꺼냄) + 몇 방마다 무작위 사용 아이템 · 상자 꾸러미: 아이템을 주울수록 패시브 3개 중 고르는 상자 · 먹보 꾸러미: 방에 두고 온 아이템을 먹고 모이면 새 패시브
import { PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, type PassiveDef, type PassiveId, type UseItemId } from "../items";
import { createRng, deriveSeed } from "../rng";
import { SPIRIT_PACK as K } from "../spiritDefs";
import { pickPassives } from "./buildBias";
import { recalcStats } from "./items";
import { characterWeapons, passivePool, usePool } from "./loot";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

const filled = (p: PlayerState) => p.useSlots.filter((x) => x).length;
const rngOf = (s: RunState, ...k: (string | number)[]) => createRng(deriveSeed(s.seed, "spiritPack", ...k));

function givePassive(s: RunState, id: PassiveId): void {
  s.player.passives.push(id);
  recalcStats(s);
  addEffect(s, { kind: "fcSpEat", x: s.player.x, y: s.player.y - 14, dirX: 0, dirY: 0, size: 22, maxTicks: 30, follow: true });
}

/** 방을 끝냄: 여우 바꾸기 · 보관 꾸러미 선물 */
export function packRoomClear(s: RunState): void {
  const p = s.player;
  const n = p.fcSpRooms ?? 0;
  if (p.fcSp === "fox" && n % K.foxRooms === 0) p.fcFox = Math.min(K.foxMax, (p.fcFox ?? 0) + 1);
  if (p.fcSp === "bag" && n % K.bagRooms === 0 && (p.fcBag?.length ?? 0) < K.bagMax) (p.fcBag ??= []).push(rngOf(s, "bag", n).pick(usePool(s)));
}

/** 틱마다: 상자 꾸러미(주운 수 세기) · 먹보(방을 옮기면 두고 온 아이템을 먹음) */
export function packTick(s: RunState): void {
  const p = s.player;
  if (p.fcSp === "chest") {
    const [lp, lu] = p.fcSpSeen ?? [p.passives.length, filled(p)];
    const got = Math.max(0, p.passives.length - lp) + Math.max(0, filled(p) - lu);
    p.fcSpSeen = [p.passives.length, filled(p)];
    if (got > 0) p.fcChestN = (p.fcChestN ?? 0) + got;
    if (!p.fcChest && (p.fcChestN ?? 0) >= K.chestEvery) {
      p.fcChestN! -= K.chestEvery;
      p.fcChest = pickPassives(s, rngOf(s, "chest", p.passives.length, s.tick), passivePool(s), 3);
    }
  }
  if (p.fcSp !== "glutton") return;
  const was = p.fcSpRoom;
  p.fcSpRoom = { floor: s.floor, room: s.roomId };
  if (!was || was.floor !== s.floor || was.room === s.roomId) return;
  const left = s.rooms[was.room]?.pickups;
  if (!left) return;
  const eat = left.filter((pk) => (pk.kind === "passive" || pk.kind === "use" || pk.kind === "weapon") && pk.price === 0 && (pk.owner === undefined || pk.owner === (s.seat ?? 0)));
  if (!eat.length) return;
  s.rooms[was.room]!.pickups = left.filter((pk) => !eat.includes(pk));
  p.fcGlut = (p.fcGlut ?? 0) + eat.length;
  addEffect(s, { kind: "fcSpEat", x: p.fcSpX ?? p.x, y: p.fcSpY ?? p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 24, follow: true });
  while ((p.fcGlut ?? 0) >= K.gluttonEvery) {
    p.fcGlut! -= K.gluttonEvery;
    const pool = passivePool(s);
    if (pool.length) givePassive(s, rngOf(s, "glut", p.passives.length, s.tick).pick(pool));
  }
}

/** 보관 꾸러미: 사용 아이템 칸이 다 찼을 때 줍기 → 넣어 둠 (items.pickUp) */
export function bagStore(s: RunState, item: UseItemId): boolean {
  const p = s.player;
  if (p.fcSp !== "bag" || (p.fcBag?.length ?? 0) >= K.bagMax) return false;
  (p.fcBag ??= []).push(item);
  return true;
}

/** 빈 사용 아이템 칸 키를 누름 → 꾸러미 창 (items.useSlot) */
export function bagOpen(s: RunState): void {
  const p = s.player;
  if (p.fcSp === "bag" && p.fcBag?.length) p.fcBagOpen = true;
}

/** 여우가 바꿀 수 있는 것 전부: 이 캐릭터의 무기 · 패시브(공용·자기 전용·히든·악마 등, 이미 가진 효과 아이템 제외) · 사용 아이템 */
function foxPool(s: RunState): { kind: "weapon" | "passive" | "use"; id: string }[] {
  const p = s.player;
  const ws = characterWeapons(p.characterId).filter((w) => w !== p.weaponId).map((id) => ({ kind: "weapon" as const, id }));
  const ps = PASSIVE_IDS.filter((id) => {
    const d: PassiveDef = PASSIVES[id];
    return (d.exclusive === undefined || d.exclusive === p.characterId) && !(d.effect && p.passives.includes(id));
  }).map((id) => ({ kind: "passive" as const, id }));
  const us = USE_ITEM_IDS.map((id) => ({ kind: "use" as const, id }));
  return [...ws, ...ps, ...us];
}

/** 창·버튼 (factionSpirit.spiritMenu): 21 꾸러미 꺼내기(a=63 닫기) · 22 상자 고르기 · 23 여우 바꾸기 */
export function packMenu(s: RunState, op: number, a: number): void {
  const p = s.player;
  if (op === 21) {
    const slot = p.useSlots.indexOf(null);
    const item = p.fcBag?.[a];
    if (a !== 63 && item && slot >= 0) {
      p.useSlots[slot] = item;
      p.fcBag!.splice(a, 1);
    }
    delete p.fcBagOpen;
  } else if (op === 22) {
    const id = p.fcChest?.[a];
    if (!id) return;
    delete p.fcChest;
    givePassive(s, id);
  } else if (op === 23 && (p.fcFox ?? 0) > 0) {
    const pk = s.rooms[s.roomId]?.pickups.find((x) => x.id === s.nearPickupId);
    if (!pk || (pk.kind !== "weapon" && pk.kind !== "passive" && pk.kind !== "use")) return;
    const pool = foxPool(s);
    const got = rngOf(s, "fox", pk.id, p.fcFox!, s.tick).pick(pool);
    pk.kind = got.kind;
    pk.itemId = got.id;
    p.fcFox!--;
    addEffect(s, { kind: "fcSpFox", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 18, maxTicks: 30 });
  }
}
