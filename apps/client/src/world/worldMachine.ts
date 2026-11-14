// 테라코어 땅·건물 그리기 (덩어리 캔버스, worldBuild가 부름): 철판(이음매·리벳) · 철길(침목·레일, 이웃 따라 가로·세로) · 공장(골함석 지붕·굴뚝·큰 셔터 문·창) · 파이프(이음 고리·김 새는 밸브) · 콜로세움 돌벽(아치·기둥)
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

/** 같은 땅이 이어진 덩어리의 끝 칸 */
function extent(m: WorldMap, t: number, cx: number, cy: number): [number, number, number, number] {
  const is = (x: number, y: number) => tileAt(m, x, y) === t;
  let [x0, y0, x1, y1] = [cx, cy, cx, cy];
  while (is(x0 - 1, cy)) x0--;
  while (is(cx, y0 - 1)) y0--;
  while (is(x1 + 1, cy)) x1++;
  while (is(cx, y1 + 1)) y1++;
  return [x0, y0, x1, y1];
}

function metal(g: Ctx, cx: number, cy: number, px: number, py: number): void {
  // 칸마다 철판 한 장: 이음매 · 네 귀 리벳 · 가끔 녹
  box(g, "rgba(40,44,52,0.55)", px, py + S - 1, S, 1);
  box(g, "rgba(40,44,52,0.55)", px + S - 1, py, 1, S);
  box(g, "rgba(255,255,255,0.12)", px, py, S, 1);
  for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]] as const) {
    box(g, "#6a727e", px + x, py + y, 1, 1);
    box(g, "#c4ccd6", px + x - 1, py + y - 1, 1, 1);
  }
  const h = hash2(cx, cy);
  if (h % 11 === 0) box(g, "rgba(150,80,40,0.35)", px + 4 + (h >>> 4) % 6, py + 5 + (h >>> 8) % 5, 3, 2);
  if (h % 7 === 0) box(g, "rgba(30,34,40,0.3)", px + 3, py + 7, 10, 1);
}

function rail(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const r = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.rail;
  const across = r(-1, 0) || r(1, 0) || !(r(0, -1) || r(0, 1));
  // 자갈 · 침목 · 레일 두 줄 (가로 철길이 세로로 두 칸이면 위·아래 칸에 한 줄씩)
  for (let i = 0; i < 6; i++) box(g, "#7e6e5e", px + ((hash2(cx * 7 + i, cy) >>> 3) % 15), py + ((hash2(cx, cy * 7 + i) >>> 3) % 15), 1, 1);
  if (across) {
    for (let x = 1; x < S; x += 5) box(g, "#5a3a20", px + x, py + 3, 3, 10);
    box(g, "#9aa4b0", px, py + 4, S, 1);
    box(g, "#9aa4b0", px, py + 11, S, 1);
    box(g, "#d4dce6", px, py + 4, S, 0.5);
  } else {
    for (let y = 1; y < S; y += 5) box(g, "#5a3a20", px + 3, py + y, 10, 3);
    box(g, "#9aa4b0", px + 4, py, 1, S);
    box(g, "#9aa4b0", px + 11, py, 1, S);
  }
}

function factory(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const b = extent(m, WT.factory, cx, cy);
  if (blockObj(g, "factory", b, cx, cy, px, py, S)) return;
  const [x0, y0, x1, y1] = b;
  const front = cy === y1;
  const top = cy === y0 ? -6 : 0;
  if (!front) {
    // 골함석 지붕 (세로 골) · 위 가장자리 밝게 · 양 끝 어둡게
    box(g, "#7a8490", px, py + top, S, S - top);
    for (let x = (cx & 1) * 2; x < S; x += 4) box(g, "#5e6772", px + x, py + top, 1, S - top);
    if (cy === y0) box(g, "#a8b2be", px, py + top, S, 2);
    if (cx === x0) box(g, "#4a525c", px, py + top, 2, S - top);
    if (cx === x1) box(g, "#4a525c", px + S - 2, py + top, 2, S - top);
    // 굴뚝 (왼쪽 위 칸)
    if (cx === x0 + 1 && cy === y0) {
      box(g, "#6e4a3a", px + 3, py - 24, 9, 22);
      box(g, "#8e6450", px + 3, py - 24, 3, 22);
      box(g, "#3a2a24", px + 2, py - 26, 11, 3);
      box(g, "#2a2a30", px + 4, py - 26, 7, 1);
    }
    return;
  }
  // 앞벽: 벽돌빛 판 · 가운데 큰 셔터 문 · 옆 창 (불빛)
  box(g, "#9a5a34", px, py, S, S);
  for (let y = 3; y < S; y += 4) box(g, "#7e4628", px, py + y, S, 1);
  box(g, "#4a525c", px, py, S, 2);
  if (cx === Math.floor((x0 + x1) / 2)) {
    box(g, "#3a4048", px + 1, py + 3, 14, 13);
    for (let y = 4; y < S; y += 2) box(g, "#5e6772", px + 2, py + y, 12, 1);
    box(g, "#ffd84a", px + 7, py + 3, 2, 1);
  } else {
    box(g, "#2a2a30", px + 4, py + 5, 8, 6);
    box(g, (cx + cy) & 1 ? "#ffcc66" : "#ffb04a", px + 5, py + 6, 6, 4);
    box(g, "#2a2a30", px + 7, py + 6, 1, 4);
  }
  if (cx === x0) box(g, "#5e3420", px, py, 2, S);
  if (cx === x1) box(g, "#5e3420", px + S - 2, py, 2, S);
}

function pipe(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const p = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.pipe;
  const across = p(-1, 0) || p(1, 0);
  // 받침대 · 굵은 관 (윗면 밝게) · 이음 고리 · 가끔 밸브
  if (across) {
    box(g, "#4a525c", px + 6, py + 10, 4, 6);
    box(g, "#3e8a8a", px, py + 3, S, 8);
    box(g, "#6ec0c0", px, py + 4, S, 2);
    box(g, "#2a5e5e", px, py + 10, S, 1);
    if ((cx & 3) === 0) box(g, "#a8b2be", px + 1, py + 2, 3, 10);
  } else {
    box(g, "#3e8a8a", px + 4, py, 8, S);
    box(g, "#6ec0c0", px + 5, py, 2, S);
    if ((cy & 3) === 0) box(g, "#a8b2be", px + 3, py + 1, 10, 3);
  }
  if (hash2(cx, cy) % 9 === 0) {
    box(g, "#c84a3a", px + 6, py, 4, 3);
    box(g, "#4a525c", px + 7, py + 3, 2, 2);
  }
}

function arena(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const a = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.arena;
  const face = !a(0, 1);
  const capH = face ? 5 : S;
  // 위: 관중석 돌 단 · 앞면: 큰 돌 블록과 아치 (두 칸마다)
  box(g, "#cfc2a4", px, py, S, capH);
  for (let y = 2; y < capH; y += 4) box(g, "#b4a684", px, py + y, S, 1);
  if (!a(0, -1)) box(g, "#e6dcc4", px, py - 2, S, 2);
  if (!face) return;
  box(g, "#b8a888", px, py + capH, S, S - capH);
  box(g, "#8e7e62", px, py + capH, S, 1);
  if ((cx & 1) === 0) {
    box(g, "#4a3e30", px + 4, py + 8, 8, 8);
    box(g, "#4a3e30", px + 5, py + 7, 6, 1);
  } else box(g, "#9a8a6c", px + 7, py + capH, 2, S - capH);
}

/** 테라코어 칸이면 그림. 건물(공장·파이프·콜로세움 벽)은 true, 바닥(철판·철길)은 무늬만 그리고 false */
export function drawMachine(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t === WT.metal) {
    if (!hasTex("metalFloor")) metal(g, cx, cy, px, py);
  }
  else if (t === WT.rail) rail(g, m, cx, cy, px, py);
  else if (t === WT.factory) factory(g, m, cx, cy, px, py);
  else if (t === WT.pipe) pipe(g, m, cx, cy, px, py);
  else if (t === WT.arena) arena(g, m, cx, cy, px, py);
  else return false;
  return t !== WT.metal && t !== WT.rail;
}
