// 세계 지도 칸 꾸밈 (땅 바탕 worldGround 위, 덩어리 캔버스에 한 번만): 풀숲·꽃·밭·물결·바위·다리·울타리·그림자
// 건물(성벽·바닥·집)은 worldBuild · 나무는 사람과 앞뒤를 맞춰야 해서 worldTrees(매 장면)
import { hash2, texNameOf } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { drawBuilding } from "./worldBuild";
import { WT } from "./worldTiles";
import { drawObj, fillTex, hasTex, obj } from "./worldTex";

export { setChunkOrigin } from "./worldTex";

const S = WTILE;
type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};
/** 그림자 (반투명 납작 타원) */
export function shadow(g: Ctx, x: number, y: number, rx: number, ry: number, a = 0.28): void {
  g.fillStyle = `rgba(16,24,20,${a})`;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
}

const FLOWERS = [
  ["#f4f0ff", "#ffd84a"],
  ["#ff8ab8", "#fff0a0"],
  ["#ffd84a", "#e07a20"],
  ["#9ab8ff", "#ffffff"],
  ["#ff6a5a", "#ffe0a0"],
] as const;

function tuft(g: Ctx, x: number, y: number, h: number): void {
  const dark = "#3c7a36";
  const lite = h & 1 ? "#8ccc6a" : "#7abd5c";
  box(g, dark, x, y + 1, 1, 3);
  box(g, dark, x + 2, y, 1, 4);
  box(g, dark, x + 4, y + 1, 1, 3);
  box(g, lite, x + 2, y, 1, 2);
  box(g, lite, x + 1, y + 2, 1, 2);
  box(g, lite, x + 3, y + 2, 1, 1);
}

function flower(g: Ctx, x: number, y: number, h: number): void {
  const [p, c] = FLOWERS[h % FLOWERS.length]!;
  box(g, "#3c7a36", x + 1, y + 2, 1, 2);
  box(g, p, x, y, 3, 1);
  box(g, p, x + 1, y - 1, 1, 3);
  box(g, c, x + 1, y, 1, 1);
}

/** 둥근 바위 (줄마다 폭을 원 모양으로 · 위 왼쪽 밝게) · 옆이 바위면 크게 해서 산처럼 이어짐 */
function rock(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number, h: number): void {
  const mass = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => tileAt(m, cx + dx!, cy + dy!) === WT.rock).length;
  const img = obj(mass >= 2 || h % 3 !== 0 ? "rock_big" : "rock_small");
  if (img) {
    shadow(g, px + 9, py + 15, mass >= 2 ? 10 : 7, 2.5, 0.3);
    drawObj(g, img, px + 8 + ((h >>> 3) % 3) - 1, py + 16, mass >= 2 ? 1.15 : 1);
    return;
  }
  const w = mass >= 2 ? 18 + (h % 3) : 11 + (h % 4);
  const hh = Math.round(w * 0.8);
  const ox = px + 8 + ((h >>> 3) % 3) - 1;
  const bot = py + 15;
  const top = bot - hh;
  shadow(g, ox + 1, bot, w / 2 + 1, 2.5, 0.3);
  for (let i = 0; i < hh; i++) {
    const k = (i + 0.5) / hh * 2 - 1;
    const half = Math.round((w / 2) * Math.sqrt(1 - k * k * 0.85));
    const y = top + i;
    box(g, "#3e342c", ox - half - 1, y, half * 2 + 2, 1);
    const shade = i < hh * 0.3 ? "#a8967e" : i < hh * 0.7 ? "#8a7864" : "#6e5e4e";
    box(g, shade, ox - half, y, half * 2, 1);
    // 오른쪽 그늘
    box(g, i < hh * 0.3 ? "#8a7864" : "#5e5044", ox + Math.round(half * 0.4), y, Math.max(0, half - Math.round(half * 0.4)), 1);
  }
  box(g, "#3e342c", ox - Math.round(w / 4), top - 1, Math.round(w / 2), 1);
  box(g, "#c8b498", ox - Math.round(w / 4), top + 1, 3, 1);
  box(g, "#4e4238", ox - 1 + (h % 3), top + Math.round(hh / 3), 1, 3);
  box(g, "#4e4238", ox + (h % 3), top + Math.round(hh / 3) + 3, 2, 1);
  if (h & 4) box(g, "#5e9a4a", ox - Math.round(w / 4) + 1, top + 1, 3, 1);
}

function fence(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const f = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.fence;
  const wood = "#9a6a3a";
  const dark = "#5a3a1e";
  const lite = "#c08c52";
  shadow(g, px + 8, py + 13, 6, 1.5, 0.22);
  if (f(-1, 0) || f(1, 0) || !(f(0, -1) || f(0, 1))) {
    const x0 = f(-1, 0) ? px : px + 6;
    const x1 = f(1, 0) ? px + S : px + 10;
    for (const ry of [6, 10]) {
      box(g, dark, x0, py + ry + 1, x1 - x0, 1);
      box(g, wood, x0, py + ry, x1 - x0, 1);
    }
  }
  if (f(0, -1)) box(g, wood, px + 7, py, 2, 6);
  if (f(0, 1)) box(g, wood, px + 7, py + 8, 2, 8);
  box(g, dark, px + 6, py + 3, 4, 10);
  box(g, wood, px + 6, py + 3, 3, 9);
  box(g, lite, px + 6, py + 3, 3, 1);
}

/** 칸 하나의 꾸밈 (px, py = 덩어리 캔버스 안 자리, 칸 밖으로 조금 넘쳐도 됨) */
export function drawTile(g: Ctx, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const t = tileAt(m, cx, cy);
  const h = hash2(cx, cy);
  if (drawBuilding(g, m, t, cx, cy, px, py)) return;
  // 벽·집 바로 아래 땅에는 그림자
  const up = tileAt(m, cx, cy - 1);
  if ((up === WT.wall || up === WT.house || up === WT.keep) && t !== WT.wall && t !== WT.house && t !== WT.keep && t !== WT.none) {
    for (let i = 0; i < 5; i++) box(g, `rgba(20,16,30,${0.32 - i * 0.06})`, px, py + i, S, 1);
  }
  // 땅 결 그림이 있으면 코드 잔무늬(풀숲·자갈·이삭·물결)는 건너뜀
  const plain = !hasTex(texNameOf(t));
  switch (t) {
    case WT.grass:
    case WT.flower:
    case WT.tree:
      if (t === WT.tree) shadow(g, px + 8 + ((h % 5) - 2), py + 13, 9, 3.5, 0.32);
      else if (t === WT.grass && h % 37 === 0 && obj("bush")) drawObj(g, obj("bush")!, px + 8, py + 14);
      else if (plain && h % 3 === 0) tuft(g, px + 2 + (h >>> 4) % 9, py + 3 + (h >>> 8) % 9, h);
      if (t === WT.flower) for (let i = 0; i < 3 + (h % 3); i++) {
        const v = hash2(cx * 5 + i, cy * 3 - i);
        flower(g, px + 1 + (v % 12), py + 2 + ((v >>> 6) % 11), v >>> 11);
      }
      else if (t === WT.grass && h % 17 === 0) box(g, "#e8e0d0", px + 4 + (h >>> 5) % 8, py + 6 + (h >>> 9) % 6, 2, 1);
      break;
    case WT.path:
    case WT.sand:
      if (plain && h % 4 === 0) {
        const x = px + 2 + (h >>> 4) % 11;
        const y = py + 2 + (h >>> 8) % 11;
        box(g, t === WT.path ? "#8a6a44" : "#b49a64", x, y + 1, 3, 1);
        box(g, t === WT.path ? "#d8c09a" : "#f4e8c0", x, y, 2, 1);
      }
      break;
    case WT.field: {
      if (!plain) break;
      // 이삭 줄: 아래 그림자 · 위 이삭 알갱이 (밭이 아닌 옆쪽은 3픽셀 비움 → 풀 경계가 보임)
      const fl = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy) === WT.field;
      const xa = fl(-1, 0) ? 0 : 3;
      const xb = fl(1, 0) ? S : S - 3;
      for (let r = fl(0, -1) ? 0 : 1; r < (fl(0, 1) ? 4 : 3); r++) {
        const y = py + r * 4;
        box(g, "#8e7020", px + xa, y + 3, xb - xa, 1);
        for (let x = xa + (r & 1) * 2; x < xb - 1; x += 4) {
          const v = hash2(cx * S + x, cy * 4 + r);
          box(g, v & 1 ? "#f0d470" : "#e4c058", px + x, y + (v % 2), 2, 2);
          box(g, "#a8882e", px + x + 1, y + 2, 1, 1);
        }
      }
      break;
    }
    case WT.water:
    case WT.deep:
      if (plain && h % 2 === 0) {
        const x = px + 2 + (h >>> 3) % 9;
        const y = py + 3 + (h >>> 7) % 10;
        box(g, t === WT.water ? "#7ab4ee" : "#4a74c4", x, y, 4, 1);
        box(g, t === WT.water ? "#7ab4ee" : "#4a74c4", x + 1, y - 1, 2, 1);
      }
      break;
    case WT.rock:
      rock(g, m, cx, cy, px, py, h);
      break;
    case WT.fence:
      fence(g, m, cx, cy, px, py);
      break;
    case WT.bridge: {
      const side = (dx: number) => tileAt(m, cx + dx, cy) !== WT.bridge;
      // 판자는 걷는 방향(가로)에 수직 (판자 그림이 있으면 그것으로)
      if (!fillTex(g, "bridge", px, py, S, S)) for (let i = 0; i < 4; i++) {
        const x = px + i * 4;
        box(g, "#5a3a1e", x + 3, py, 1, S);
        box(g, hash2(cx * 4 + i, cy) & 1 ? "#a8743e" : "#9a6a36", x, py, 3, S);
        box(g, "#c08c52", x, py, 1, S);
        if (hash2(cx * 4 + i, cy + 3) % 3 === 0) box(g, "#4a3018", x + 1, py + 3 + i * 3, 1, 1);
      }
      // 다리 끝 (물과 닿는 위아래) 난간
      for (const dy of [-1, 1]) {
        const n = tileAt(m, cx, cy + dy);
        if (n === WT.water || n === WT.deep) {
          const y = dy < 0 ? py : py + S - 3;
          box(g, "#4a3018", px, y + 2, S, 1);
          box(g, "#7c5228", px, y, S, 2);
          box(g, "#a87442", px, y, S, 1);
          if (side(-1) || cx % 2 === 0) {
            box(g, "#4a3018", px + 1, y - 3, 3, 6);
            box(g, "#8a5a2c", px + 1, y - 3, 2, 5);
          }
        }
      }
      break;
    }
  }
}
