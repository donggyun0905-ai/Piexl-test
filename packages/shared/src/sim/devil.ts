// 악마의 방 (비밀의 방, sim/vault): 텅 빈 암흑 속 가운데 사탄의 석상, 그 앞에 거래 셋 (itemsDevil 여섯 중 무작위)
// 거래 앞 F → 최대 체력을 바치고 그 패시브를 얻음 (여러 번 가능). 한 번이라도 거래하면
// 7층(라스트 보스 층)이 '시작 방(여신의 축복) → 단순 상점(산 자리는 새로고침해도 다시 안 채움) → 바로 라스트 보스'가 됨 (floor.lastFloorMap)
import { DEVIL_IDS, DEVIL_PERKS, DEVIL_ROOM, type DevilId } from "../itemsDevil";
import { createRng, deriveSeed } from "../rng";
import { addBoonMod } from "./boons";
import { recalcStats } from "./items";
import { addPickup, CX, pickDistinct, seatSalt } from "./loot";
import type { Pickup, PlayerState, RunState } from "./types";
import { addEffect, ROOM_MIN_Y } from "./util";

/** 사탄의 석상 자리 (방 위쪽 가운데) · 거래 물건 줄 */
export const statueY = () => ROOM_MIN_Y + 46;
export const offerY = () => statueY() + 68;
const OFFER_GAP = 46;

/** 거래 조건: 바치는 최대 체력 (이미 한 악마 거래 하나마다 DEVIL_ROOM.more 더) */
export const devilCost = (id: DevilId, p?: PlayerState) => DEVIL_PERKS[id].cost + (p ? p.passives.filter((x) => x in DEVIL_PERKS).length * DEVIL_ROOM.more : 0);

/** 협동이면 한 사람이라도 거래했는지 (7층 지도는 모두 같이 씀) */
export function devilPact(s: RunState): boolean {
  const seats = s.party?.map((x) => x.player) ?? [s.player];
  return seats.some((p) => !!p.devil?.pact) || !!s.player.devil?.pact;
}

/** 방에 처음 들어가면: 가진 것을 뺀 거래 셋 */
export function spawnDevil(s: RunState, roomId: number): void {
  const rng = createRng(deriveSeed(s.seed, "devil", s.floor, roomId, ...seatSalt(s)));
  const pool = DEVIL_IDS.filter((id) => !s.player.passives.includes(id));
  const list = pickDistinct(rng, pool, DEVIL_ROOM.offers);
  list.forEach((id, i) => addPickup(s, roomId, "devil", id, CX + (i - (list.length - 1) / 2) * OFFER_GAP, offerY(), 0));
}

/** 거래 앞 (station.stationAt): 안내 · F = 거래 */
export function devilAt(s: RunState, pk: Pickup, interact: boolean): void {
  if (s.prompt.kind !== "none") return;
  s.prompt = { kind: "station", station: "devil", open: false };
  if (!interact) return;
  const p = s.player;
  const id = pk.itemId as DevilId;
  const cost = devilCost(id, p);
  const d = (p.devil ??= {});
  // 최대 체력이 모자라면 석상이 거절함
  if (p.stats.maxHp - cost < DEVIL_ROOM.minHp) {
    d.last = { id, ok: false, tick: s.tick };
    addEffect(s, { kind: "srRefuse", x: pk.x, y: pk.y, dirX: 0, dirY: 0, size: 18, maxTicks: 30 });
    return;
  }
  addBoonMod(s, { stat: "maxHp", add: -cost });
  p.passives.push(id);
  recalcStats(s);
  p.hp = Math.min(p.hp, p.stats.maxHp);
  d.pact = true;
  d.last = { id, ok: true, tick: s.tick };
  const room = s.rooms[s.roomId]!;
  room.pickups = room.pickups.filter((x) => x.id !== pk.id);
  addEffect(s, { kind: "srDeal", x: pk.x, y: pk.y, toX: CX, toY: statueY(), dirX: DEVIL_IDS.indexOf(id), dirY: 0, size: 60, maxTicks: 60 });
}

/** 틱마다 (사람마다): 악마의 방 안은 암흑 */
export function devilRoomTick(s: RunState): void {
  if (s.map.rooms[s.roomId]?.type === "devil") s.player.blindTicks = Math.max(s.player.blindTicks ?? 0, 2);
}
