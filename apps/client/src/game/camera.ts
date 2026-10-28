import { allPlayers, ROOM_HEIGHT, ROOM_WIDTH, type RunState } from "@pixel-rogue/shared";
import { viewH, viewW } from "./viewSize";

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
  const vw = viewW() / zoom;
  const vh = viewH() / zoom;
  // 방이 보이는 영역보다 작으면(넓힌 화면) 가운데에 둠
  const clampTo = (v: number, max: number) => (max < 0 ? max / 2 : Math.min(max, Math.max(0, v)));
  return { x: clampTo(px - vw / 2, ROOM_WIDTH - vw), y: clampTo(py - vh / 2, ROOM_HEIGHT - vh) };
}
