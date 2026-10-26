/** 게임 버전 (패치 노트 맨 위 버전과 같게 유지) */
export const GAME_VERSION = "0.48.123";

/** 한 칸(타일) 크기, 픽셀 */
export const TILE_SIZE = 16;
/** 보통 방 크기, 칸 수 (한 화면에 방 하나, 0.48.77부터 15×9 → 21×13) · 화면에 보이는 크기 (픽셀) */
export const BASE_ROOM_COLS = 21;
export const BASE_ROOM_ROWS = 13;
/** 방 모양 틀(13×7)·출구 줄이 맞춰진 예전 방 크기: 큰 방에서는 이만큼을 가운데에 놓음 */
const SHAPE_COLS = 15;
const SHAPE_ROWS = 9;
export const VIEW_WIDTH = BASE_ROOM_COLS * TILE_SIZE;
export const VIEW_HEIGHT = BASE_ROOM_ROWS * TILE_SIZE;

/**
 * 지금 방 크기 (칸 수·픽셀·벽 안쪽 범위·가운데). 보통 방은 위 크기, 라스트 보스방은 더 큼.
 * 게임 계산 한 틱마다·그리기 전에 setRoomSize로 그 판의 지금 방 크기로 맞춤 (sim/run applyRoom)
 */
export let ROOM_COLS = BASE_ROOM_COLS;
export let ROOM_ROWS = BASE_ROOM_ROWS;
export let ROOM_WIDTH = ROOM_COLS * TILE_SIZE;
export let ROOM_HEIGHT = ROOM_ROWS * TILE_SIZE;
/** 벽 안쪽 범위 (테두리 한 칸은 벽) */
export const ROOM_MIN_X = TILE_SIZE;
export const ROOM_MIN_Y = TILE_SIZE;
export let ROOM_MAX_X = (ROOM_COLS - 1) * TILE_SIZE;
export let ROOM_MAX_Y = (ROOM_ROWS - 1) * TILE_SIZE;
/** 방 가운데 */
export let ROOM_CX = ROOM_WIDTH / 2;
export let ROOM_CY = ROOM_HEIGHT / 2;

/** 협동 3~5명 큰 방 (보통 방 대신) */
export const COOP_ROOM = { cols: 25, rows: 15 } as const;
/** 방 모양 틀(13×7)을 가운데에 놓을 때 밀리는 칸 수 (보통 방·협동 큰 방, 라스트 보스방·타워 디펜스는 0) */
export let SHAPE_DX = 0;
export let SHAPE_DY = 0;
/** 위쪽 벽 출구의 가로 가운데 (줄 0 왼쪽 · 1 가운데 · 2 오른쪽). 방 모양 틀의 칸 3·7·11 */
export let EXIT_X: readonly number[] = [3.5 * TILE_SIZE, 7.5 * TILE_SIZE, 11.5 * TILE_SIZE];

/** center: 방 모양 틀·출구를 가운데로 (보통 방·협동 큰 방) */
export function setRoomSize(cols = BASE_ROOM_COLS, rows = BASE_ROOM_ROWS, center = true): void {
  const dx = center ? Math.floor((cols - SHAPE_COLS) / 2) : 0;
  if (cols === ROOM_COLS && rows === ROOM_ROWS && dx === SHAPE_DX) return;
  SHAPE_DX = dx;
  SHAPE_DY = center ? Math.floor((rows - SHAPE_ROWS) / 2) : 0;
  EXIT_X = [3.5, 7.5, 11.5].map((c) => (c + dx) * TILE_SIZE);
  ROOM_COLS = cols;
  ROOM_ROWS = rows;
  ROOM_WIDTH = cols * TILE_SIZE;
  ROOM_HEIGHT = rows * TILE_SIZE;
  ROOM_MAX_X = (cols - 1) * TILE_SIZE;
  ROOM_MAX_Y = (rows - 1) * TILE_SIZE;
  ROOM_CX = ROOM_WIDTH / 2;
  ROOM_CY = ROOM_HEIGHT / 2;
}

// 처음 값은 보통 방 (방 모양 틀을 가운데로)
setRoomSize();

/** 게임 계산 횟수, 1초당 (고정 간격) */
export const TICK_RATE = 60;
export const TICK_MS = 1000 / TICK_RATE;

/** 이 값 이상 동전은 큰 동전 (크게 그리고 닿는 거리도 넓음, 황금방 300원) */
export const BIG_COIN = 100;
