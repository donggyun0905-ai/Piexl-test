// 비밀의 방 (히든 상점이 나오는 판: 혼자 하기·무한·협동): 일반 전투방에 처음 들어갈 때 5%로 옆·아래 벽 어딘가에 금 간 곳
// 몸이 닿으면 벽이 무너지며(효과·소리) 문이 열리고, 문으로 들어가면 악마의 방·도박꾼의 방·경매장 중 하나 (같은 확률)
// 비밀의 방은 층 지도 끝에 붙는 옆방 (노선도에는 안 보임) · 출구는 원래 방의 출구와 같음 (출구가 없는 방이면 원래 방으로 돌아가는 문)
// 시련 1000점 보상 상자로도 골라 들어감 (openVault, 히든 상점 포함) · 그때는 나오면 시련의 방으로 돌아옴 (남은 상자를 잃지 않게)
import { SECRET_KINDS, SECRET_WALL, type SecretPick } from "../secretDefs";
import { createRng, deriveSeed } from "../rng";
import { auctionTick, spawnAuction } from "./auction";
import { devilRoomTick, spawnDevil } from "./devil";
import { devilTick } from "./devilPerks";
import { gambleTableBlock, spawnGamble } from "./gamble";
import { bodyFits, PLAIN_SHAPE, shapeGrid } from "./layout";
import { meetPilgrim, pilgrimRoom } from "./pilgrim";
import { warpRoom } from "./rooms";
import type { RoomType } from "./floor";
import type { RunState } from "./types";
import { addEffect, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { ROOM_CX as CX } from "../constants";

/** 금 간 벽이 생길 수 있는 판 */
const vaultOn = (s: RunState) => !!s.pilgrim && !s.lastBoss && !s.arenaLv && !s.sudden && !s.hero && !s.swarm && !s.pvp;

/** 금 간 곳의 벽 위 자리 (그리기도 씀) */
export function crackSpot(c: NonNullable<RunState["crack"]>): { x: number; y: number } {
  if (c.side === 0) return { x: ROOM_MIN_X, y: c.pos };
  if (c.side === 1) return { x: ROOM_MAX_X, y: c.pos };
  return { x: c.pos, y: ROOM_MAX_Y };
}

/** 지금 방의 금 간 벽 (없으면 null) */
export const crackHere = (s: RunState) => (s.crack && s.crack.floor === s.floor && s.crack.room === s.roomId ? s.crack : null);

/** 전투방에 처음 들어갈 때 (specialRooms.spawnSpecialRoom): 5%로 금 간 벽 (방·층 시드) */
export function rollCrack(s: RunState, roomId: number): void {
  if (!vaultOn(s) || roomId === pilgrimRoom(s) || (s.crack?.floor === s.floor && s.crack.room === roomId)) return;
  const rng = createRng(deriveSeed(s.seed, "crack", s.floor, roomId));
  if (rng.nextFloat() >= SECRET_WALL.chance) return;
  const kind = SECRET_KINDS[rng.int(0, SECRET_KINDS.length - 1)]!;
  const g = shapeGrid(s.map.rooms[roomId]!.shape);
  const e = SECRET_WALL.edge;
  // 벽 바로 안쪽이 바닥인 자리 (기둥·구덩이에 막히지 않게, 정해진 횟수만 시도)
  for (let tries = 0; tries < 12; tries++) {
    const side = rng.int(0, 2);
    const pos = side < 2 ? rng.int(ROOM_MIN_Y + e, ROOM_MAX_Y - e) : rng.nextFloat() < 0.5 ? rng.int(ROOM_MIN_X + e, CX - e) : rng.int(CX + e, ROOM_MAX_X - e);
    const c = { floor: s.floor, room: roomId, side, pos, kind };
    const at = crackSpot(c);
    const x = at.x + (side === 0 ? 12 : side === 1 ? -12 : 0);
    const y = at.y - (side === 2 ? 12 : 0);
    if (!g || bodyFits(g, x, y, 8)) {
      s.crack = c;
      return;
    }
  }
}

/** 비밀의 방으로: 지도 끝에 옆방을 붙이고 들어감 (협동은 다 같이) · back: 출구가 원래 방으로 돌아가는 문 하나 (시련 보상 상자로 들어간 경우) */
export function openVault(s: RunState, kind: SecretPick, back = false): number {
  const from = s.map.rooms[s.roomId]!;
  const id = s.map.rooms.length;
  const type: RoomType = kind;
  const exits = !back && from.exits.some((x) => x >= 0) ? [...from.exits] : [-1, from.id, -1];
  s.map.rooms.push({ id, layer: -1, lane: 1, type, exits, shape: PLAIN_SHAPE });
  s.rooms.push({ visited: false, cleared: false, pickups: [], enemies: null });
  warpRoom(s, id);
  return id;
}

/** 비밀의 방에 처음 들어감 (specialRooms.spawnSpecialRoom, 사람마다) */
export function spawnVault(s: RunState, type: RoomType, roomId: number): void {
  if (type === "devil") spawnDevil(s, roomId);
  else if (type === "gamble") spawnGamble(s, roomId);
  else if (type === "auction") spawnAuction(s, roomId);
  else if (type === "hidden" && s.pilgrimNpc?.room !== roomId) meetPilgrim(s, roomId);
  else if (type === "combat") rollCrack(s, roomId);
}

/** 틱마다 (사람마다): 악마의 거래 효과 · 악마의 방 암흑 · 경매 · 금 간 벽에 닿음 → 무너짐 → 문으로 들어감 */
export function vaultTick(s: RunState): void {
  devilTick(s);
  devilRoomTick(s);
  auctionTick(s);
  gambleTableBlock(s);
  const c = crackHere(s);
  const p = s.player;
  if (!c || p.hp <= 0) return;
  const at = crackSpot(c);
  const along = c.side < 2 ? Math.abs(p.y - at.y) : Math.abs(p.x - at.x);
  const into = c.side === 0 ? p.x - at.x : c.side === 1 ? at.x - p.x : at.y - p.y;
  if (along > 14 || into > p.r + 3) return;
  if (c.broke === undefined) {
    c.broke = s.tick;
    addEffect(s, { kind: "srCrumble", x: at.x, y: at.y, dirX: c.side, dirY: 0, size: 30, maxTicks: 50 });
    return;
  }
  if (s.tick < c.broke + SECRET_WALL.crumble) return;
  if (c.to !== undefined && s.map.rooms[c.to]) warpRoom(s, c.to);
  else c.to = openVault(s, c.kind);
}
