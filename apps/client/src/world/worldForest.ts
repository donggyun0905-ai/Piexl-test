// 비르디아 땅·건물 그리기 (덩어리 캔버스, worldBuild가 부름): 이끼 바닥(고사리·버섯·빛 포자·낙엽) · 거대 나무(둥근 잎 지붕·굵은 줄기·뿌리, 3칸 폭이면 둥근 문과 등불 창 = 나무 집) · 생울타리 성벽(잎 덩어리·나무 기둥·작은 꽃)
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import { blockObj } from "./worldTex";

const S = WTILE;
type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};
const disc = (g: Ctx, c: string, x: number, y: number, r: number) => {
  g.fillStyle = c;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
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

function moss(g: Ctx, cx: number, cy: number, px: number, py: number): void {
  const h = hash2(cx, cy);
  const x = px + 2 + ((h >>> 4) % 10);
  const y = py + 3 + ((h >>> 8) % 9);
  if (h % 5 === 0) {
    // 고사리 (가운데 줄기 · 양옆 잎)
    box(g, "#2e6a3a", x + 2, y, 1, 5);
    for (let i = 0; i < 4; i++) {
      box(g, "#4e9a52", x, y + i + 1, 2, 1);
      box(g, "#4e9a52", x + 3, y + i + 1, 2, 1);
    }
    box(g, "#7cc46e", x + 2, y, 1, 1);
  } else if (h % 7 === 1) {
    // 버섯 (빨강·하양 점 또는 갈색)
    const red = (h >>> 12) & 1;
    box(g, "#e8dcc4", x + 1, y + 2, 2, 3);
    box(g, red ? "#c83a3a" : "#a8743a", x, y, 4, 2);
    box(g, red ? "#ffffff" : "#d4a46a", x + 1, y, 1, 1);
  } else if (h % 9 === 2) {
    // 빛 포자 (정령 숲의 반짝임)
    box(g, "rgba(190,255,170,0.35)", x - 1, y - 1, 3, 3);
    box(g, "#d8ffb8", x, y, 1, 1);
  } else if (h % 4 === 3) {
    // 낙엽
    box(g, (h >>> 14) & 1 ? "#a8743a" : "#c89a3a", x, y, 2, 1);
  }
}

/** 잎 덩어리 (그늘 · 몸 · 빛) */
function leaves(g: Ctx, x: number, y: number, r: number, h: number): void {
  disc(g, "#1e4a2a", x, y + 1, r);
  disc(g, h & 1 ? "#2e7a3e" : "#347e40", x, y, r - 0.5);
  disc(g, "#4e9e52", x - r * 0.3, y - r * 0.35, r * 0.45);
}

function bigTree(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const b = extent(m, WT.bigTree, cx, cy);
  const [x0, y0, x1, y1] = b;
  const w = x1 - x0 + 1;
  // 그림이 있으면: 3칸 폭 = 나무 집, 넓으면 세계수(거대한 나무)
  if (blockObj(g, w <= 3 ? "treehouse" : "giant_tree", b, cx, cy, px, py, S)) return;
  const h = hash2(cx, cy);
  const edgeL = cx === x0;
  const edgeR = cx === x1;
  if (cy < y1) {
    // 잎 지붕: 칸마다 잎 덩어리 몇 개 · 맨 위는 둥글게 솟음 · 양 끝은 안쪽으로
    const l = edgeL ? 4 : 0;
    const r = edgeR ? S - 4 : S;
    box(g, "#2a6a38", px + l, py, r - l, S);
    if (cy === y0) for (let i = 0; i < 2; i++) leaves(g, px + 4 + i * 8, py + 1, 5, h >>> i);
    for (let i = 0; i < 3; i++) {
      const v = hash2(cx * 3 + i, cy * 5 - i);
      leaves(g, px + l + 3 + (v % Math.max(1, r - l - 6)), py + 4 + ((v >>> 5) % 9), 3.5 + ((v >>> 9) % 2), v >>> 3);
    }
    if (edgeL) leaves(g, px + 5, py + 8, 5, h);
    if (edgeR) leaves(g, px + S - 5, py + 8, 5, h >>> 2);
    // 큰 나무(세계수)는 잎 사이로 빛 방울
    if (w > 5 && h % 3 === 0) {
      box(g, "rgba(220,255,180,0.4)", px + 6, py + 6, 3, 3);
      box(g, "#f0ffd8", px + 7, py + 7, 1, 1);
    }
    return;
  }
  // 아래 줄: 가운데는 줄기, 양 끝은 뿌리 (잎 끝이 위에 드리움)
  const trunk = w <= 3 ? !edgeL && !edgeR : cx > x0 + 1 && cx < x1 - 1;
  if (trunk) {
    box(g, "#6a4426", px, py, S, S);
    for (let x = (cx & 1) * 2 + 1; x < S; x += 4) box(g, "#4e301a", px + x, py, 1, S);
    box(g, "#8a5c34", px + ((h >>> 3) % 12), py + 2, 2, 6);
    if (w <= 3) {
      // 나무 집: 둥근 문 · 문 위 등불
      box(g, "#2a180c", px + 4, py + 5, 8, 11);
      disc(g, "#2a180c", px + 8, py + 6, 4);
      box(g, "#7a4e2a", px + 5, py + 6, 6, 10);
      disc(g, "#7a4e2a", px + 8, py + 6, 3);
      box(g, "#ffd84a", px + 9, py + 11, 1, 1);
      box(g, "#ffcc66", px + 7, py, 2, 2);
    } else if (cx === Math.floor((x0 + x1) / 2)) {
      // 세계수: 줄기에 빛나는 무늬
      box(g, "#9affc8", px + 7, py + 3, 2, 8);
      box(g, "#9affc8", px + 5, py + 6, 6, 1);
      box(g, "rgba(154,255,200,0.3)", px + 4, py + 2, 8, 10);
    }
  } else {
    // 뿌리: 땅 위로 굽은 굵은 뿌리 · 위는 잎 끝
    const left = cx < (x0 + x1) / 2;
    box(g, "#6a4426", left ? px + 6 : px, py + 8, 10, 4);
    box(g, "#6a4426", left ? px + 2 : px + 10, py + 11, 4, 4);
    box(g, "#4e301a", left ? px + 6 : px, py + 11, 10, 1);
    leaves(g, px + 8, py + 2, 5, h);
  }
  if (edgeL) box(g, "rgba(20,30,20,0.25)", px, py + 12, 3, 4);
}

function hedge(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const e = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.hedge;
  const face = !e(0, 1);
  const h = hash2(cx, cy);
  // 위: 잎 덩어리 · 앞면: 짙은 잎 벽 · 4칸마다 나무 기둥 · 가끔 작은 꽃
  const top = e(0, -1) ? 0 : -4;
  box(g, "#2a7a4a", px, py + top, S, (face ? 8 : S) - top);
  for (let i = 0; i < 3; i++) {
    const v = hash2(cx * 7 + i, cy * 3 + i);
    disc(g, "#3e9a5a", px + 2 + (v % 12), py + top + 3 + ((v >>> 4) % 4), 3);
  }
  if (!e(0, -1)) for (let x = 2; x < S; x += 5) disc(g, "#3e9a5a", px + x, py - 3, 3);
  if (!face) return;
  box(g, "#1e5a36", px, py + 8, S, S - 8);
  for (let x = (h % 3) + 1; x < S; x += 4) box(g, "#164a2c", px + x, py + 9, 1, 6);
  if (cx % 4 === 0) {
    box(g, "#6a4426", px + 6, py + 2, 4, S - 2);
    box(g, "#8a5c34", px + 6, py + 2, 1, S - 2);
  }
  if (h % 5 === 0) {
    box(g, (h >>> 6) & 1 ? "#ff8ab8" : "#f4f0ff", px + 3 + ((h >>> 3) % 9), py + 10, 2, 2);
    box(g, "#ffd84a", px + 3 + ((h >>> 3) % 9), py + 10, 1, 1);
  }
}

/** 비르디아 칸이면 그림. 건물(거대 나무·생울타리)은 true, 바닥(이끼)은 꾸밈만 그리고 false */
export function drawForest(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t === WT.moss) moss(g, cx, cy, px, py);
  else if (t === WT.bigTree) bigTree(g, m, cx, cy, px, py);
  else if (t === WT.hedge) hedge(g, m, cx, cy, px, py);
  else return false;
  return t !== WT.moss;
}
