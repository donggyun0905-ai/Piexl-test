// 히든 상점 '차원의 순례자' (혼자 하기·무한·협동, s.pilgrim): 층마다 낮은 확률로 전투방 하나가 몬스터 없는 빈 방이 되고,
// 들어가면 벽쪽 포탈에서 큰 배낭을 멘 꼬마가 걸어 나와 가운데로 옴 → 도착하면 히든 물건 3개를 골드로 진열 (itemsHidden)
import { HIDDEN_STOCK, PILGRIM_PRICE } from "../itemsHidden";
import { createRng, deriveSeed } from "../rng";
import { depth } from "./hero";
import { addPickup, CX, CY, pickDistinct, seatSalt } from "./loot";
import type { RunState } from "./types";
import { addEffect } from "./util";

const R = {
  /** 층마다 나올 확률 */
  chance: 0.08,
  /** 포탈에서 가운데까지 걸어오는 틱 · 진열 수 · 진열 간격 */
  walk: 110,
  stock: 3,
  gap: 34,
};
export { R as PILGRIM_RULES };

/** 이 층에서 순례자가 기다리는 방 (없으면 -1) */
export function pilgrimRoom(s: RunState): number {
  if (!s.pilgrim || s.lastBoss || s.arenaLv || s.sudden) return -1;
  const rng = createRng(deriveSeed(s.seed, "pilgrim", s.floor));
  if (rng.nextFloat() >= R.chance) return -1;
  const rooms = s.map.rooms.filter((r) => r.type === "combat");
  return rooms.length ? rng.pick(rooms).id : -1;
}

/** 순례자 방에 처음 들어감 (rooms.enterRoom): 포탈이 열리고 걸어 나오기 시작 */
export function meetPilgrim(s: RunState, roomId: number): void {
  s.pilgrimNpc = { room: roomId, floor: s.floor, t0: s.tick, shown: false };
  s.pilgrimMet = (s.pilgrimMet ?? 0) + 1;
  addEffect(s, { kind: "hdPortal", x: CX, y: CY - 60, dirX: 0, dirY: 0, size: 18, maxTicks: R.walk });
}

/** 순례자가 지금 이 방에 있는지 (그리기도 씀) */
export const pilgrimHere = (s: RunState) => !!s.pilgrimNpc && s.pilgrimNpc.room === s.roomId && (s.pilgrimNpc.floor ?? s.floor) === s.floor;

/** 걸어오는 중인 자리 (그리기·도착 판정): 0~1 */
export const pilgrimWalk = (s: RunState) => (s.pilgrimNpc ? Math.min(1, (s.tick - s.pilgrimNpc.t0) / R.walk) : 0);

/** 틱마다 (origin.tickOrigin): 가운데에 오면 물건을 펼침 (협동은 사람마다 자기 것) */
export function pilgrimTick(s: RunState): void {
  const npc = s.pilgrimNpc;
  if (!npc || !pilgrimHere(s) || pilgrimWalk(s) < 1) return;
  const seat = s.seat ?? 0;
  const done = (npc.seats ??= []);
  if (done.includes(seat)) return;
  done.push(seat);
  if (!npc.shown) npc.shown = true;
  const rng = createRng(deriveSeed(s.seed, "pilgrimStock", s.floor, ...seatSalt(s)));
  const pool = HIDDEN_STOCK.filter((x) => !(x.kind === "passive" && s.player.passives.includes(x.id as never)) && !(s.party && (x.id === "dimensionGate" || x.id === "portalGun")));
  const floor = PILGRIM_PRICE.perFloor * (depth(s) - 1);
  pickDistinct(rng, pool, R.stock).forEach((x, i) => {
    const price = (x.kind === "passive" ? PILGRIM_PRICE.passive : PILGRIM_PRICE.use) + floor;
    addPickup(s, s.roomId, x.kind, x.id, CX + (i - (R.stock - 1) / 2) * R.gap, CY + 12, 0, price);
  });
  addEffect(s, { kind: "hdShow", x: CX, y: CY + 12, dirX: 0, dirY: 0, size: 40, maxTicks: 30 });
}
