import { allPlayers, ROOM_HEIGHT, ROOM_WIDTH, type RunState } from "@pixel-rogue/shared";
import { fitPan, panOffset } from "./cameraPan";
import { viewH, viewW } from "./viewSize";

/** 관전: 화면이 따라갈 자리 (패왕전에서 쓰러진 뒤 다른 사람 보기, event/PwWatch) · 없으면 나 */
let watchSeat: number | undefined;
export function setWatchSeat(i?: number): void {
  watchSeat = i;
}

/** 보이는 영역의 왼쪽 위 (플레이어를 따라가되 방 밖은 보이지 않게). 보이는 크기는 보통 방 크기 ÷ 확대, 큰 방(라스트 보스)은 따라다님 · 끌어 본 만큼 옮김 (cameraPan) */
export function cameraFor(s: RunState, zoom: number, alpha = 1): { x: number; y: number } {
  const p = (watchSeat !== undefined && s.party && allPlayers(s)[watchSeat]) || s.player;
  const o = panOffset();
  const px0 = p.prevX + (p.x - p.prevX) * alpha;
  const py0 = p.prevY + (p.y - p.prevY) * alpha;
  // 끌어 본 화면 가운데는 방 안까지만 (방 끝을 넘어 끌어도 쌓이지 않게)
  const px = Math.min(ROOM_WIDTH, Math.max(0, px0 + o.x));
  const py = Math.min(ROOM_HEIGHT, Math.max(0, py0 + o.y));
  if (o.x || o.y) fitPan(px - px0, py - py0);
  const vw = viewW() / zoom;
  const vh = viewH() / zoom;
  // 방이 보이는 영역보다 작으면(넓힌 화면) 가운데에 둠
  const clampTo = (v: number, max: number) => (max < 0 ? max / 2 : Math.min(max, Math.max(0, v)));
  return { x: clampTo(px - vw / 2, ROOM_WIDTH - vw), y: clampTo(py - vh / 2, ROOM_HEIGHT - vh) };
}

/** 확대 한도·처음 배율 (휠·두 손가락): 보통 1(방 전체) · 큰 패왕전 경기장(쟁탈전·전쟁의 서막·기간토마키아)은 위아래가 좁아 0.6까지 줄여 넓게, 처음부터 조금 줄여 둠 (끌어 보기도 이 대결만) */
export function zoomFor(s: RunState): { min: number; start: number } {
  return s.pvp && ["contest", "war", "giganto"].includes(s.pvp.mode) ? { min: 0.6, start: 0.75 } : { min: 1, start: 1 };
}
