// 헬리오스 땅·건물 그리기 (덩어리 캔버스, worldBuild가 부름): 대리석(금 줄 이음매) · 붉은 벽돌길(엇갈려 쌓기) · 금빛 테 돌바닥 — 땅 결 그림(marble·redBrick·goldStone)이 있으면 무늬는 건너뜀
// 황금 궁전(금 지붕·둥근 지붕 셋·붉은 깃발·기둥·가운데 큰 금 문) · 제국 집(붉은 기와 지붕·금 테·크림 벽·가운데 문)
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import { hasTex } from "./worldTex";

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

function marble(g: Ctx, cx: number, cy: number, px: number, py: number): void {
  // 두 칸마다 큰 판 · 이음매에 가는 금 줄 · 가끔 회색 결
  if ((cx & 1) === 0) box(g, "rgba(200,160,60,0.55)", px, py, 1, S);
  if ((cy & 1) === 0) box(g, "rgba(200,160,60,0.55)", px, py, S, 1);
  const h = hash2(cx, cy);
  if (h % 4 === 0) box(g, "rgba(150,146,140,0.35)", px + 3 + (h >>> 4) % 6, py + 4 + (h >>> 8) % 8, 6, 1);
}

function redBrick(g: Ctx, cx: number, cy: number, px: number, py: number): void {
  // 벽돌 줄 (4픽셀 높이, 줄마다 엇갈림)
  for (let r = 0; r < 4; r++) {
    box(g, "#7a2a22", px, py + r * 4 + 3, S, 1);
    const off = ((cy * 4 + r) & 1) * 4;
    for (let x = off; x < S; x += 8) box(g, "#7a2a22", px + x, py + r * 4, 1, 3);
  }
  if (hash2(cx, cy) % 5 === 0) box(g, "rgba(255,200,170,0.18)", px + 2, py + 1, 5, 2);
}

function goldStone(g: Ctx, cx: number, cy: number, px: number, py: number): void {
  // 세 칸마다 금 띠로 테두리를 두른 큰 돌판
  if (cx % 3 === 0) box(g, "#c89a38", px, py, 2, S);
  if (cy % 3 === 0) box(g, "#c89a38", px, py, S, 2);
  if (cx % 3 === 0 && cy % 3 === 0) box(g, "#f0d070", px, py, 2, 2);
}

function palace(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const [x0, y0, x1, y1] = extent(m, WT.palace, cx, cy);
  const mid = Math.floor((x0 + x1) / 2);
  if (cy < y1) {
    // 금 지붕 (가로 골) · 위 줄에 둥근 지붕(가운데·양 끝) · 양 끝 어둡게
    box(g, "#d8a428", px, py, S, S);
    for (let y = 2; y < S; y += 4) box(g, "#b08020", px, py + y, S, 1);
    if (cx === x0) box(g, "#8a6218", px, py, 2, S);
    if (cx === x1) box(g, "#8a6218", px + S - 2, py, 2, S);
    if (cy === y0) {
      box(g, "#f4d060", px, py, S, 2);
      if (cx === mid || cx === x0 + 1 || cx === x1 - 1) {
        const r = cx === mid ? 9 : 6;
        g.fillStyle = "#e8b830";
        g.beginPath();
        g.arc(px + 8, py, r, Math.PI, 0);
        g.fill();
        box(g, "#fff0a0", px + 5, py - r + 2, 2, 3);
        box(g, "#8a6218", px + 7, py - r - 5, 2, 5);
        box(g, "#ffd84a", px + 6, py - r - 7, 4, 2);
      }
    }
    // 앞벽 바로 위 줄: 붉은 깃발 (세 칸마다)
    if (cy === y1 - 1 && (cx - x0) % 3 === 1 && cx !== mid) {
      box(g, "#a82a2a", px + 4, py + 4, 8, 14);
      box(g, "#d84a3a", px + 4, py + 4, 2, 14);
      box(g, "#ffd84a", px + 7, py + 8, 2, 3);
    }
    return;
  }
  // 앞벽: 크림 돌 · 금 기둥 · 가운데 큰 금 문 · 옆은 아치 창
  box(g, "#efe2c4", px, py, S, S);
  box(g, "#c89a38", px, py, S, 2);
  box(g, "#b8a888", px, py + S - 2, S, 2);
  if (cx === mid) {
    box(g, "#6a4a18", px + 1, py + 2, 14, 14);
    box(g, "#e8b830", px + 2, py + 3, 12, 13);
    box(g, "#b08020", px + 7, py + 3, 2, 13);
    box(g, "#fff0a0", px + 3, py + 4, 2, 10);
    box(g, "#6a4a18", px + 5, py + 9, 1, 2);
    box(g, "#6a4a18", px + 10, py + 9, 1, 2);
  } else if ((cx - x0) & 1) {
    box(g, "#4a3a5a", px + 5, py + 5, 6, 8);
    box(g, "#4a3a5a", px + 6, py + 4, 4, 1);
    box(g, "#ffd88a", px + 6, py + 6, 4, 6);
  } else {
    box(g, "#d8b450", px + 6, py + 2, 4, 14);
    box(g, "#fff0a0", px + 6, py + 2, 1, 14);
  }
}

function villa(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const [x0, y0, x1, y1] = extent(m, WT.villa, cx, cy);
  if (cy < y1) {
    // 붉은 기와 지붕 (반원 기와 줄) · 위 끝 금 테
    const top = cy === y0 ? -5 : 0;
    box(g, "#b8483a", px, py + top, S, S - top);
    for (let y = top + 3; y < S; y += 4) for (let x = (y & 4) ? 0 : 2; x < S; x += 4) box(g, "#8a2e26", px + x, py + y, 3, 1);
    if (cy === y0) box(g, "#e8b830", px, py + top, S, 2);
    if (cx === x0) box(g, "#6e2420", px, py + top, 2, S - top);
    if (cx === x1) box(g, "#6e2420", px + S - 2, py + top, 2, S - top);
    return;
  }
  // 앞벽: 크림 벽 · 금 테 · 가운데 문 · 옆 창(덧문)
  box(g, "#a8382e", px, py, S, 4);
  box(g, "#e8b830", px, py + 4, S, 1);
  box(g, "#f2e6cc", px, py + 5, S, S - 5);
  box(g, "#c8b48c", px, py + S - 2, S, 2);
  if (cx === Math.floor((x0 + x1) / 2)) {
    box(g, "#5a3018", px + 4, py + 6, 8, 10);
    box(g, "#8e4a24", px + 5, py + 7, 6, 9);
    box(g, "#e8b830", px + 5, py + 6, 6, 1);
    box(g, "#ffd84a", px + 9, py + 11, 1, 1);
  } else {
    box(g, "#3e6a5a", px + 3, py + 7, 3, 6);
    box(g, "#3e6a5a", px + 10, py + 7, 3, 6);
    box(g, "#ffe0a0", px + 6, py + 7, 4, 6);
    box(g, "#c84a5a", px + 5, py + 13, 6, 1);
  }
}

/** 헬리오스 칸이면 그림. 건물(궁전·제국 집)은 true, 바닥은 (땅 결 그림이 없을 때만) 무늬 그리고 false */
export function drawEmpire(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t === WT.palace) palace(g, m, cx, cy, px, py);
  else if (t === WT.villa) villa(g, m, cx, cy, px, py);
  else {
    if (t === WT.marble && !hasTex("marble")) marble(g, cx, cy, px, py);
    else if (t === WT.redBrick && !hasTex("redBrick")) redBrick(g, cx, cy, px, py);
    else if (t === WT.goldStone && !hasTex("goldStone")) goldStone(g, cx, cy, px, py);
    return false;
  }
  return true;
}
