// 사막 땅·건물 그리기 (덩어리 캔버스, worldBuild가 부름): 모래 언덕(바람 물결) · 자갈 · 갈라진 땅 · 묻힌 돌길 · 오아시스 — 땅 결 그림이 있으면 무늬는 건너뜀
// 사암 신전·옛 성벽(윗면 돌 단 · 앞면 큰 돌 블록과 기둥 · 넓은 건물은 가운데 어두운 입구)
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

function ground(g: Ctx, t: number, cx: number, cy: number, px: number, py: number): void {
  const h = hash2(cx, cy);
  if (t === WT.dune) {
    // 바람 물결 두 줄 (칸마다 조금씩 어긋남)
    for (const y of [4, 11]) box(g, "rgba(170,130,70,0.35)", px + ((h >>> (y & 7)) % 5), py + y + ((cx + y) & 1), 10, 1);
  } else if (t === WT.gravel) {
    for (let i = 0; i < 5; i++) {
      const v = hash2(cx * 5 + i, cy * 7 - i);
      box(g, i & 1 ? "#8a5440" : "#d0b090", px + (v % 14), py + ((v >>> 5) % 14), 2, 1 + (i & 1));
    }
  } else if (t === WT.cracked) {
    // 갈라진 금 (칸 가장자리 둘 + 안쪽 꺾인 금)
    box(g, "#8a5a34", px, py + (h % 16), 7, 1);
    box(g, "#8a5a34", px + 6, py + (h % 16), 1, 6);
    box(g, "#8a5a34", px + (h >>> 6) % 16, py, 1, 8);
  } else if (t === WT.buriedRoad) {
    // 반쯤 묻힌 큰 돌판 (두 칸마다 이음매 · 모래가 덮은 자리)
    if ((cx & 1) === 0) box(g, "rgba(120,96,64,0.5)", px, py, 1, S);
    if ((cy & 1) === 0) box(g, "rgba(120,96,64,0.5)", px, py, S, 1);
    if (h % 3 === 0) box(g, "rgba(232,208,150,0.6)", px + (h >>> 4) % 8, py + 4 + (h >>> 8) % 6, 8, 4);
  }
}

function temple(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const is = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.temple;
  const face = !is(0, 1);
  const h = hash2(cx, cy);
  const capH = face ? 6 : S;
  // 윗면: 사암 돌 단 · 맨 위 줄은 톱니 난간
  box(g, "#c8945a", px, py, S, capH);
  for (let y = 3; y < capH; y += 5) box(g, "#a8743e", px, py + y, S, 1);
  if (!is(0, -1)) {
    box(g, "#dcac70", px, py - 3, S, 3);
    if (cx & 1) box(g, "#dcac70", px + 4, py - 6, 8, 3);
  }
  if (!face) return;
  // 앞면: 큰 돌 블록 · 짝수 칸 기둥 · 넓은 덩어리 가운데는 어두운 입구 · 가끔 금간 돌
  const front = (x: number) => tileAt(m, x, cy) === WT.temple && tileAt(m, x, cy + 1) !== WT.temple;
  let [x0, x1] = [cx, cx];
  while (front(x0 - 1)) x0--;
  while (front(x1 + 1)) x1++;
  box(g, "#b07c46", px, py + capH, S, S - capH);
  for (let y = capH + 4; y < S; y += 5) box(g, "#8e5e30", px, py + y, S, 1);
  if (is(0, -1) && x1 - x0 >= 4 && cx === Math.floor((x0 + x1) / 2)) {
    box(g, "#2a1a10", px + 2, py + capH, 12, S - capH);
    box(g, "#d8a04a", px + 2, py + capH, 12, 1);
  } else if ((cx & 1) === 0) {
    box(g, "#d4a468", px + 6, py + capH, 4, S - capH);
    box(g, "#e8c088", px + 6, py + capH, 1, S - capH);
  }
  if (h % 5 === 0) box(g, "#6e4624", px + 3 + (h >>> 3) % 8, py + capH + 2, 1, 5);
}

/** 사막 칸이면 그림. 신전·옛 성벽은 true, 바닥은 (땅 결 그림이 없을 때만) 무늬 그리고 false */
export function drawDesert(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t === WT.temple) {
    temple(g, m, cx, cy, px, py);
    return true;
  }
  const names: Record<number, string> = { [WT.dune]: "dune", [WT.gravel]: "gravel", [WT.cracked]: "cracked", [WT.buriedRoad]: "buriedRoad" };
  if (names[t] && !hasTex(names[t])) ground(g, t, cx, cy, px, py);
  return false;
}
