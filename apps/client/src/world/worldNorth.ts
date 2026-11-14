// 실베르 땅·성벽 그리기 (덩어리 캔버스, worldBuild가 부름): 깊은 눈밭(바람 자국) · 얼음(금) · 얼어붙은 진흙(발자국) · 눈 덮인 돌바닥 — 땅 결 그림이 있으면 무늬는 건너뜀
// 두꺼운 요새 성벽(윗면 눈 쌓인 돌 단 · 앞면 큰 돌 블록, 그림 thickWall이 있으면 앞면은 그림 · 고드름 · 할퀸 자국)
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import { fillTex, hasTex } from "./worldTex";

const S = WTILE;
type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

function ground(g: Ctx, t: number, cx: number, cy: number, px: number, py: number): void {
  const h = hash2(cx, cy);
  if (t === WT.deepSnow) {
    if (h % 3 === 0) box(g, "rgba(150,176,214,0.45)", px + (h >>> 4) % 6, py + 5 + (h >>> 8) % 6, 9, 1);
  } else if (t === WT.ice) {
    box(g, "rgba(255,255,255,0.6)", px + (h % 12), py + 2, 1, 6);
    box(g, "rgba(255,255,255,0.6)", px + (h % 12), py + 7, 5, 1);
    if (h % 4 === 0) box(g, "rgba(255,255,255,0.5)", px + 3, py + 12, 2, 2);
  } else if (t === WT.frozenMud) {
    // 발자국 두 개
    for (let i = 0; i < 2; i++) box(g, "rgba(60,52,48,0.5)", px + 3 + i * 6 + (h % 3), py + 4 + i * 5, 3, 4);
  } else if (t === WT.snowStone) {
    if ((cx & 1) === 0) box(g, "rgba(90,98,112,0.5)", px, py, 1, S);
    if ((cy & 1) === 0) box(g, "rgba(90,98,112,0.5)", px, py, S, 1);
    if (h % 3 === 0) box(g, "rgba(240,246,255,0.7)", px + (h >>> 4) % 8, py + (h >>> 8) % 10, 7, 4);
  }
}

function thickWall(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const w = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.thickWall;
  const face = !w(0, 1);
  const h = hash2(cx, cy);
  const capH = face ? 6 : S;
  // 윗면: 어두운 돌 단 · 눈 덮임 · 바깥 끝 톱니 난간
  box(g, "#565c6e", px, py, S, capH);
  box(g, "#eef4fc", px, py, S, 3);
  if (!w(0, -1)) {
    box(g, "#3e4252", px, py - 4, S, 4);
    box(g, "#eef4fc", px, py - 5, S, 2);
    if (cx & 1) box(g, "#3e4252", px + 4, py - 8, 8, 4);
  }
  if (!face) return;
  // 앞면: 그림 또는 큰 돌 블록 · 아래 눈 · 고드름 · 가끔 할퀸 자국
  if (!fillTex(g, "thickWall", px, py + capH, S, S - capH)) {
    box(g, "#4a5062", px, py + capH, S, S - capH);
    for (let y = capH + 4; y < S; y += 5) box(g, "#343846", px, py + y, S, 1);
    box(g, "#343846", px + ((cy & 1) * 8 + 4), py + capH, 1, S - capH);
  }
  for (let i = 0; i < 3; i++) box(g, "#d8ecfa", px + 2 + i * 5 + (h % 2), py + capH, 1, 2 + ((h >>> i) & 3));
  if (h % 7 === 0) for (let i = 0; i < 3; i++) box(g, "rgba(20,20,28,0.6)", px + 5 + i * 2, py + capH + 3 + i, 1, 6);
  box(g, "rgba(240,246,255,0.8)", px, py + S - 2, S, 2);
}

/** 실베르 칸이면 그림. 성벽은 true, 바닥은 (땅 결 그림이 없을 때만) 무늬 그리고 false */
export function drawNorth(g: Ctx, m: WorldMap, t: number, cx: number, cy: number, px: number, py: number): boolean {
  if (t === WT.thickWall) {
    thickWall(g, m, cx, cy, px, py);
    return true;
  }
  if (t === WT.snowPine) {
    // 나무 그림자 (나무는 worldTrees가 사람과 앞뒤를 맞춰 그림)
    g.fillStyle = "rgba(40,56,90,0.3)";
    g.beginPath();
    g.ellipse(px + 8, py + 13, 9, 3.5, 0, 0, Math.PI * 2);
    g.fill();
    return false;
  }
  const names: Record<number, string> = { [WT.deepSnow]: "deepSnow", [WT.ice]: "ice", [WT.frozenMud]: "frozenMud", [WT.snowStone]: "snowStone" };
  if (names[t] && !hasTex(names[t])) ground(g, t, cx, cy, px, py);
  return false;
}
