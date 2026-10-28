import { allPlayers, ROOM_HEIGHT, ROOM_WIDTH, VIEW_HEIGHT, VIEW_WIDTH, type RunState } from "@pixel-rogue/shared";

/** 관전: 화면이 따라갈 자리 (패왕전에서 쓰러진 뒤 다른 사람 보기, event/PwWatch) · 없으면 나 */
let watchSeat: number | undefined;
export function setWatchSeat(i?: number): void {
  watchSeat = i;
}

/** 보이는 영역의 왼쪽 위 (플레이어를 따라가되 방 밖은 보이지 않게). 보이는 크기는 보통 방 크기 ÷ 확대, 큰 방(라스트 보스)은 따라다님 */
export function cameraFor(s: RunState, zoom: number, alpha = 1): { x: number; y: number } {
  const p = (watchSeat !== undefined && s.party && allPlayers(s)[watchSeat]) || s.player;
  const px = p.prevX + (p.x - p.prevX) * alpha;
  const py = p.prevY + (p.y - p.prevY) * alpha;
  const vw = VIEW_WIDTH / zoom;
  const vh = VIEW_HEIGHT / zoom;
  const clampTo = (v: number, max: number) => Math.min(max, Math.max(0, v));
  return { x: clampTo(px - vw / 2, ROOM_WIDTH - vw), y: clampTo(py - vh / 2, ROOM_HEIGHT - vh) };
}
