// 세계 지도 건물 안·성채 그리기 (덩어리 캔버스): 성채(돌벽·탑·큰 문) · 실내 벽(아래가 바닥이면 앞면, 아니면 윗면) · 나무 바닥 판자 · 카펫 테두리
// 가구는 장소 표의 장식(worldDeco)으로 그림 (사람과 앞뒤 순서 때문)
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { isSolid, WT } from "./worldTiles";

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

/** 성채: 위 줄 = 푸른 슬레이트 지붕(양 끝 탑) · 맨 아래 줄 = 돌벽 앞면 + 가운데 큰 아치 문 · 양옆 창 */
export function keep(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const [x0, y0, x1, y1] = extent(m, WT.keep, cx, cy);
  const mid = Math.floor((x0 + x1) / 2);
  const tower = cx === x0 || cx === x1;
  const front = cy === y1;
  const top = cy === y0 ? (tower ? -14 : -6) : 0;
  if (!front || tower) {
    // 지붕 (탑은 더 높고 뾰족)
    const bot = S;
    box(g, "#3e4a78", px, py + top, S, bot - top);
    for (let y = top + 2; y < bot; y += 3) box(g, "#2a3256", px, py + y, S, 1);
    if (cy === y0) {
      box(g, "#6a78b0", px, py + top, S, 2);
      if (tower) {
        box(g, "#2a3256", px + 6, py + top - 6, 4, 6);
        box(g, "#ffd84a", px + 7, py + top - 9, 2, 3);
      }
    }
    if (cx === x0) box(g, "#1e2440", px, py + top, 2, bot - top);
    if (cx === x1) box(g, "#1e2440", px + S - 2, py + top, 2, bot - top);
    if (tower && front) {
      box(g, "#8c8498", px + 2, py + 6, S - 4, S - 6);
      box(g, "#1a1424", px + 6, py + 8, 4, 5);
    }
    return;
  }
  // 앞벽: 돌 블록
  box(g, "#a49cb2", px, py, S, S);
  for (let r = 0; r < 4; r++) {
    box(g, "#7a7290", px, py + r * 4 + 3, S, 1);
    for (let b = 0; b < 3; b++) box(g, "#7a7290", px + ((b * 6 + (r & 1) * 3) % S), py + r * 4, 1, 3);
  }
  box(g, "#cfc8dc", px, py, S, 1);
  if (cx === mid) {
    // 큰 아치 문 (나무 두 짝 · 쇠 띠 · 손잡이)
    box(g, "#4a3a5a", px + 1, py + 1, 14, 15);
    box(g, "#3a2414", px + 2, py + 3, 12, 13);
    box(g, "#3a2414", px + 4, py + 2, 8, 1);
    box(g, "#7a4e2a", px + 3, py + 4, 4, 12);
    box(g, "#8e5e34", px + 9, py + 4, 4, 12);
    box(g, "#2a1a10", px + 7, py + 4, 2, 12);
    box(g, "#5a5468", px + 3, py + 7, 10, 1);
    box(g, "#5a5468", px + 3, py + 12, 10, 1);
    box(g, "#ffd84a", px + 6, py + 10, 1, 1);
    box(g, "#ffd84a", px + 9, py + 10, 1, 1);
  } else if ((cx - mid) % 2 === 0) {
    box(g, "#2a2236", px + 5, py + 4, 6, 7);
    box(g, "#ffd88a", px + 6, py + 5, 4, 5);
    box(g, "#2a2236", px + 7, py + 5, 1, 5);
  }
}

/** 실내 벽: 바로 아래가 걸을 수 있는 칸이면 앞면(회벽 + 나무 징두리 + 걸레받이), 아니면 어두운 윗면 */
export function innerWall(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const below = tileAt(m, cx, cy + 1);
  if (below !== WT.none && !isSolid(below)) {
    box(g, "#e6d8bc", px, py, S, 9);
    box(g, "#d2c2a2", px, py + 8, S, 1);
    box(g, "#7a5634", px, py + 9, S, 6);
    box(g, "#946a42", px, py + 9, S, 1);
    if (hash2(cx, cy) % 2) box(g, "#6a4a2a", px + 7, py + 10, 1, 5);
    box(g, "#3e2614", px, py + 15, S, 1);
    box(g, "rgba(255,255,255,0.15)", px, py, S, 1);
    return;
  }
  box(g, "#2e2438", px, py, S, S);
  box(g, "#3e3248", px + 1, py + 1, S - 2, S - 2);
  // 바닥 쪽 테두리 (밝은 선)
  const open = (x: number, y: number) => !isSolid(tileAt(m, x, y));
  if (open(cx, cy - 1)) box(g, "#5a4a66", px, py, S, 2);
  if (open(cx - 1, cy)) box(g, "#5a4a66", px, py, 2, S);
  if (open(cx + 1, cy)) box(g, "#5a4a66", px + S - 2, py, 2, S);
}

/** 나무 바닥 판자 줄 (땅 바탕 위에) · 벽 바로 아래는 그림자 */
export function woodPlanks(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  for (let r = 0; r < 4; r++) {
    box(g, "rgba(70,40,20,0.35)", px, py + r * 4 + 3, S, 1);
    const off = (hash2(cx, cy * 4 + r) % 4) * 4;
    box(g, "rgba(70,40,20,0.3)", px + off, py + r * 4, 1, 3);
  }
  wallShade(g, m, cx, cy, px, py);
}

/** 카펫: 이웃이 카펫이 아니면 금빛 테두리 */
export function carpetEdge(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const not = (x: number, y: number) => tileAt(m, x, y) !== WT.carpet;
  if (not(cx, cy - 1)) box(g, "#d8a838", px, py + 1, S, 2);
  if (not(cx, cy + 1)) box(g, "#d8a838", px, py + S - 3, S, 2);
  if (not(cx - 1, cy)) box(g, "#d8a838", px + 1, py, 2, S);
  if (not(cx + 1, cy)) box(g, "#d8a838", px + S - 3, py, 2, S);
  wallShade(g, m, cx, cy, px, py);
}

function wallShade(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  if (tileAt(m, cx, cy - 1) !== WT.innerWall) return;
  for (let i = 0; i < 4; i++) box(g, `rgba(20,12,24,${0.3 - i * 0.07})`, px, py + i, S, 1);
}
