// 관리자가 만든 던전 방 틀 쓰기 (customMaps): 혼자 하기 판을 시작할 때 방 모양 목록에 넣기 · 연습장에서 지금 방을 그 틀로 바꿔 보기
import { customMaps } from "../customMaps";
import { PLAIN_SHAPE } from "./layout";
import { startFloor } from "./rooms";
import { terrainFromRows } from "./terrain";
import type { RunState } from "./types";

/** 새로 시작한 판에 관리자가 만든 방 틀을 넣고 첫 층을 다시 만듦 (순위·기록 모드는 부르지 않음 · 이어하기는 저장된 그대로) */
export function useCustomRooms(s: RunState): void {
  const rooms = customMaps("room").map((m) => [...m.tiles]);
  if (s.tick > 0 || !rooms.length || s.customRooms) return;
  s.customRooms = rooms;
  startFloor(s, s.floor);
}

/** 연습장: 지금 방을 그 틀로 (null이면 네모 방으로) · 틀의 진흙·용암·물·가시도 깔림 */
export function practiceShape(s: RunState, rows: readonly string[] | null): void {
  const info = s.map.rooms[s.roomId];
  if (!info) return;
  info.shape = rows ? { id: -2, flip: false, rows } : PLAIN_SHAPE;
  s.terrain = rows ? terrainFromRows(s.roomId, rows) : undefined;
}
