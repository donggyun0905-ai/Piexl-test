// 탈라시아 땅·건물 그리기 (덩어리 캔버스, worldBuild가 부름): 젖은 돌 부두(물웅덩이) · 나무 부두(가로 판자·말뚝) · 해변(조개) — 땅 결 그림이 있으면 무늬는 건너뜀
// 항구 창고(그림 warehouse_t가 있으면 그림 · 없으면 판자 지붕·나무 벽·가운데 큰 문)
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import { blockObj, hasTex } from "./worldTex";

const S = WTILE;
type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

function extent(m: WorldMap, t: number, cx: number, cy: number): [number, number, number, number] {
  const is = (x: number, y: number) => tileAt(m, x, y) === t;
  let [x0, y0, x1, y1] = [cx, cy, cx, cy];
  while (is(x0 - 1, cy)) x0--;
  while (is(cx, y0 - 1)) y0--;
  while (is(x1 + 1, cy)) x1++;
  while (is(cx, y1 + 1)) y1++;
  return [x0, y0, x1, y1];
}

function ground(g: Ctx, t: number, cx: number, cy: number, px: number, py: number): void {
  const h = hash2(cx, cy);
  if (t === WT.wetStone) {
    if ((cx & 1) === 0) box(g, "rgba(40,44,50,0.5)", px, py, 1, S);
    if ((cy & 1) === 0) box(g, "rgba(40,44,50,0.5)", px, py, S, 1);
    if (h % 4 === 0) box(g, "rgba(140,170,190,0.45)", px + 3 + (h >>> 4) % 6, py + 5 + (h >>> 8) % 6, 6, 3);
  } else if (t === WT.dockPlank) {
    for (let y = 0; y < S; y += 4) box(g, "#6e5236", px, py + y, S, 1);
    if (cx % 3 === 0) box(g, "#5a4028", px + 7, py, 1, S);
  } else if (t === WT.beach && h % 5 === 0) {
    box(g, (h >>> 6) & 1 ? "#f8e0e0" : "#fff8e8", px + (h >>> 4) % 12, py + (h >>> 8) % 12, 2, 2);
  }
}

function warehouse(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const b = extent(m, WT.warehouse, cx, cy);
  if (blockObj(g, "warehouse_t", b, cx, cy, px, py, S)) return;
  const [x0, y0, x1, y1] = b;
  if (cy < y1) {
    // 판자 지붕 (세로 줄) · 위 끝 밝게
    box(g, "#7a5a3a", px, py + (cy === y0 ? -4 : 0), S, S + (cy === y0 ? 4 : 0));
    for (let x = (cx & 1) * 2; x < S; x += 4) box(g, "#5e4228", px + x, py + (cy === y0 ? -4 : 0), 1, S + (cy === y0 ? 4 : 0));
    if (cy === y0) box(g, "#a07a50", px, py - 4, S, 2);
    return;
  }
  // 앞벽: 나무 벽 · 가운데 큰 미닫이 문 · 옆 작은 창
  box(g, "#8e6a44", px, py, S, S);
  for (let y = 3; y < S; y += 4) box(g, "#6e5236", px, py + y, S, 1);
  if (cx === Math.floor((x0 + x1) / 2)) {
    box(g, "#3a2a1a", px + 1, py + 3, 14, 13);
    box(g, "#5a4028", px + 2, py + 4, 5, 12);
    box(g, "#5a4028", px + 9, py + 4, 5, 12);
  } else if ((cx + cy) & 1) {
    box(g, "#2a2a30", px + 5, py + 5, 6, 4);
    box(g, "#ffd88a", px + 6, py + 6, 4, 2);
  }
  if (cx === x0 || cx === x1) box(g, "#5a4028", px + (cx === x0 ? 0 : S - 2), py, 2, S);
}

/** 탈라시아 칸이면 그림. 창고는 true, 바닥·바다는 (땅 결 그림이 없을 때만) 무늬 그리고 false */
export function drawSea(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t === WT.warehouse) {
    warehouse(g, m, cx, cy, px, py);
    return true;
  }
  const names: Record<number, string> = { [WT.wetStone]: "wetStone", [WT.dockPlank]: "dockPlank", [WT.beach]: "beach" };
  if (names[t] && !hasTex(names[t])) ground(g, t, cx, cy, px, py);
  return false;
}
