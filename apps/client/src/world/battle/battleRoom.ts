// 지도 전투(C안): 내 주변 지도 한 조각 → 본편 방 틀 글자 (sim/layout: . 바닥 · # 벽 · ~ 구덩이)
// 지도·본편 모두 한 칸 16픽셀 · 방 줄 0은 위쪽 벽, 칸 0은 바닥이라 틀은 줄 1~·칸 1~만 (sim/layout shapeGrid)
import { TILE_DEFS, WT } from "../worldTiles";
import { tileAt, type WorldMap } from "../worldMap";

/** 전투 판 크기 (칸) · 화면(약 19×11칸)보다 조금 큼 */
export const BATTLE_COLS = 24;
export const BATTLE_ROWS = 15;

export interface BattleRoom {
  /** 판 왼쪽 위 칸 (지도 칸) */
  ox: number;
  oy: number;
  cols: number;
  rows: number;
  /** 본편 방 틀 (줄 1~rows-1, 칸 1~cols-1) */
  shape: string[];
}

/** 물은 몸만 막고 탄은 넘어가게 (구덩이) · 나머지 막힌 칸은 벽 */
const charOf = (t: number): string => (t === WT.water || t === WT.deep ? "~" : TILE_DEFS[t]?.solid !== false ? "#" : ".");

/** 가운데 칸(cx, cy) 둘레 조각 · 지도 끝에서는 안쪽으로 밀어 넣음 */
export function sliceRoom(m: WorldMap, cx: number, cy: number): BattleRoom {
  const cols = Math.min(BATTLE_COLS, m.cols);
  const rows = Math.min(BATTLE_ROWS, m.rows);
  const ox = Math.max(0, Math.min(m.cols - cols, Math.round(cx - cols / 2)));
  const oy = Math.max(0, Math.min(m.rows - rows, Math.round(cy - rows / 2)));
  const shape: string[] = [];
  for (let r = 1; r < rows; r++) {
    let line = "";
    for (let c = 1; c < cols; c++) line += charOf(tileAt(m, ox + c, oy + r));
    shape.push(line);
  }
  return { ox, oy, cols, rows, shape };
}
