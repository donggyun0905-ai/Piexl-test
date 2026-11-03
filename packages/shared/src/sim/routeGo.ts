// 미리 정한 길로 가기 (화면 노선도에서 길을 정하고 창을 닫으면 menu ROUTE_OP): 정리된 방에서 귀환처럼 1.5초 빛기둥 → 다음 방으로
// 움직이거나 맞으면 취소. 입력(menu)으로만 시작해서 시드·기록 다시 돌리기가 그대로 (끝나는 순간 rooms.updateRoom이 옮김)
import type { RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 빛기둥이 차는 틱 (1.5초) · 이만큼 움직이면 취소(픽셀) */
  TICKS: 90,
  MOVE: 4,
};
export { R as ROUTE_GO_RULES };

/** station.stationMenu의 op */
export const ROUTE_OP = 16;

export interface RoutePlayerState {
  /** 진행 중인 이동: 출구 줄 · 끝나는 틱 · 시작 자리·체력 · 방 */
  routeGo?: { lane: number; end: number; x: number; y: number; hp: number; room: number };
}

/** 이동 시작 (정리된 방 · 그 출구로 이어진 방이 있을 때만, 혼자 할 때) */
export function routeMenu(s: RunState, lane: number): void {
  const p = s.player;
  const to = s.map.rooms[s.roomId]?.exits[lane];
  if (s.party || s.pvp || !s.rooms[s.roomId]?.cleared || to === undefined || to < 0) return;
  p.routeGo = { lane, end: s.tick + R.TICKS, x: p.x, y: p.y, hp: p.hp, room: s.roomId };
}

/** 틱마다 (rooms.updateRoom): 움직이거나 맞거나 방이 바뀌면 취소 · 다 차면 갈 출구 줄 (아니면 -1) */
export function routeDue(s: RunState): number {
  const g = s.player.routeGo;
  if (!g) return -1;
  const p = s.player;
  if (g.room !== s.roomId || p.hp < g.hp || Math.hypot(p.x - g.x, p.y - g.y) > R.MOVE) {
    delete p.routeGo;
    return -1;
  }
  if (s.tick < g.end) return -1;
  delete p.routeGo;
  return g.lane;
}
