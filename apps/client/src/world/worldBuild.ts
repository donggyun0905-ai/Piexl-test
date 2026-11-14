// 세계 지도 만든 것 그리기 (덩어리 캔버스): 성벽(위가 걷는 길·앞이 벽돌·톱니) · 돌 바닥 · 집(이어진 덩어리 = 지붕 + 앞벽·문·창) · 성채·실내는 worldInside
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import { drawEmpire } from "./worldEmpire";
import { drawForest } from "./worldForest";
import { carpetEdge, innerWall, keep, woodPlanks } from "./worldInside";
import { drawMachine } from "./worldMachine";
import { ART_DENS, drawObj, fillTex, hasTex, obj } from "./worldTex";

const S = WTILE;
type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

const ROOFS = [
  ["#b8483a", "#8a2e26", "#d86a52"],
  ["#3e5e9e", "#2a3e70", "#5a80c0"],
  ["#4e7a3a", "#34562a", "#6e9a52"],
  ["#9a6236", "#6e4224", "#ba8452"],
] as const;

function bricks(g: Ctx, px: number, py: number, y0: number, cx: number, cy: number): void {
  box(g, "#5a5468", px, py + y0, S, S - y0);
  for (let r = 0; y0 + r * 4 < S; r++) {
    const y = py + y0 + r * 4;
    for (let b = -1; b < 3; b++) {
      const x = px + b * 8 + (r & 1) * 4;
      const v = hash2(cx * 4 + b, cy * 8 + r);
      const x0 = Math.max(px, x);
      const w = Math.min(px + S, x + 7) - x0;
      if (w <= 0) continue;
      box(g, v & 1 ? "#8a8296" : v & 2 ? "#7e768a" : "#948ca0", x0, y, w, 3);
      box(g, "#a8a0b4", x0, y, w, 1);
    }
  }
}

function wall(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const w = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.wall;
  const face = !w(0, 1);
  const capH = face ? 6 : S;
  // 위 (성벽 위 걷는 길, 그림이 있으면 그 결)
  if (!fillTex(g, "wallTop", px, py, S, capH)) {
    box(g, "#a49cb2", px, py, S, capH);
    for (let y = 0; y < capH; y += 5) box(g, "#8e86a0", px, py + y + 4, S, 1);
    box(g, "#8e86a0", px + ((cy & 1) * 8 + 3), py, 1, capH);
  }
  if (!w(-1, 0)) box(g, "#4a4458", px, py, 2, capH);
  if (!w(1, 0)) box(g, "#4a4458", px + S - 2, py, 2, capH);
  if (!w(0, -1)) {
    // 바깥쪽 톱니 (밝은 위 · 어두운 앞)
    for (let x = (cx & 1) * 8; x < S; x += 8) {
      box(g, "#c4bcd0", px + x, py - 3, 5, 2);
      box(g, "#6e6680", px + x, py - 1, 5, 2);
    }
    box(g, "#c4bcd0", px, py, S, 1);
  }
  if (face) {
    box(g, "#3e384a", px, py + capH - 1, S, 1);
    if (!fillTex(g, "wallFace", px, py + capH, S, S - capH)) bricks(g, px, py, capH, cx, cy);
    box(g, "rgba(20,16,30,0.35)", px, py + S - 2, S, 2);
  }
}

function floorTile(g: Ctx, cx: number, cy: number, px: number, py: number): void {
  // 8×8 판석: 판마다 밝기 조금씩 · 줄 이음매 (줄마다 어긋남)
  for (let r = 0; r < 2; r++) {
    const off = ((cy * 2 + r) & 1) * 4;
    for (let c = -1; c < 2; c++) {
      const x = px + c * 8 + off;
      const v = hash2(cx * 3 + c, cy * 2 + r) % 5;
      const x0 = Math.max(px, x);
      const ww = Math.min(px + S, x + 8) - x0;
      if (ww <= 0) continue;
      if (v === 0) box(g, "rgba(255,248,236,0.12)", x0, py + r * 8, ww, 8);
      if (v === 1) box(g, "rgba(40,30,20,0.08)", x0, py + r * 8, ww, 8);
      box(g, "#867868", x0, py + r * 8 + 7, ww, 1);
      if (x + 7 >= px && x + 7 < px + S) box(g, "#867868", x + 7, py + r * 8, 1, 8);
      box(g, "rgba(255,255,255,0.12)", x0, py + r * 8, ww, 1);
    }
  }
}

function house(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const isH = (x: number, y: number) => tileAt(m, x, y) === WT.house;
  let x0 = cx;
  let y0 = cy;
  while (isH(x0 - 1, cy)) x0--;
  while (isH(cx, y0 - 1)) y0--;
  let x1 = cx;
  let y1 = cy;
  while (isH(x1 + 1, cy)) x1++;
  while (isH(cx, y1 + 1)) y1++;
  // 집 그림이 있으면 덩어리 왼쪽 위 칸에서 한 번에 (덩어리 폭에 맞춤, 지붕은 위 칸으로 조금 올라감)
  const art = obj(hash2(x0, y0) & 1 ? "house_red" : "house_blue") ?? obj("house_red") ?? obj("house_blue");
  if (art) {
    if (cx === x0 && cy === y0) {
      const w = (x1 - x0 + 1) * S;
      drawObj(g, art, px + w / 2, py + (y1 - y0 + 1) * S, w / (art.naturalWidth / ART_DENS));
    }
    return;
  }
  const [roof, dark, lite] = ROOFS[hash2(x0, y0) % ROOFS.length]!;
  const front = cy === y1;
  const roofBot = front ? 4 : S;
  const top = cy === y0 ? -5 : 0;
  // 지붕: 기와 줄 · 맨 위 용마루 · 양 끝 어둡게
  box(g, roof, px, py + top, S, roofBot - top);
  for (let y = top + 2; y < roofBot; y += 3) {
    box(g, dark, px, py + y, S, 1);
    for (let x = ((y + 9) & 2) * 2; x < S; x += 4) box(g, dark, px + x, py + y - 2, 1, 2);
  }
  if (cy === y0) {
    box(g, lite, px, py - 5, S, 2);
    box(g, dark, px, py - 3, S, 1);
  }
  if (cx === x0) box(g, dark, px, py + top, 2, roofBot - top);
  if (cx === x1) box(g, dark, px + S - 2, py + top, 2, roofBot - top);
  if (!front) return;
  // 처마 · 앞벽(회벽 + 나무 틀) · 문(가운데) 또는 창
  box(g, dark, px, py + 4, S, 1);
  box(g, "#e6d8bc", px, py + 5, S, S - 5);
  box(g, "rgba(40,24,16,0.25)", px, py + 5, S, 2);
  box(g, "#6a4a2a", px, py + S - 2, S, 2);
  if (cx === x0) box(g, "#6a4a2a", px, py + 5, 2, S - 5);
  if (cx === x1) box(g, "#6a4a2a", px + S - 2, py + 5, 2, S - 5);
  if (cx === Math.floor((x0 + x1) / 2)) {
    box(g, "#3e2614", px + 4, py + 6, 8, 10);
    box(g, "#7a4e2a", px + 5, py + 7, 6, 9);
    box(g, "#8e5e34", px + 5, py + 7, 2, 9);
    box(g, "#ffd84a", px + 9, py + 11, 1, 1);
  } else {
    box(g, "#6a4a2a", px + 4, py + 7, 8, 6);
    box(g, "#ffd88a", px + 5, py + 8, 6, 4);
    box(g, "#ffefc0", px + 5, py + 8, 2, 2);
    box(g, "#6a4a2a", px + 7, py + 8, 1, 4);
    box(g, "#4e9a46", px + 4, py + 13, 8, 1);
  }
}

/** 성벽·바닥·집이면 그리고 true */
export function drawBuilding(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t >= WT.marble) return drawEmpire(g, m, t, cx, cy, px, py);
  if (t >= WT.moss) return drawForest(g, m, t, cx, cy, px, py);
  if (t >= WT.metal) return drawMachine(g, m, t, cx, cy, px, py);
  if (t === WT.wall) wall(g, m, cx, cy, px, py);
  else if (t === WT.house) house(g, m, cx, cy, px, py);
  else if (t === WT.keep) keep(g, m, cx, cy, px, py);
  else if (t === WT.innerWall) innerWall(g, m, cx, cy, px, py);
  else if (t === WT.woodFloor || t === WT.carpet) {
    if (t === WT.woodFloor) woodPlanks(g, m, cx, cy, px, py);
    else carpetEdge(g, m, cx, cy, px, py);
    return false;
  } else if (t === WT.floor) {
    if (!hasTex("floor")) floorTile(g, cx, cy, px, py);
    return false;
  } else return false;
  return true;
}
