// 세계 지도 칸 그리기 (덩어리 캔버스에 한 번만 그림, worldChunks) · 칸마다 정해진 무늬(좌표 해시, 매번 같은 모양)
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { TILE_DEFS, WT } from "./worldTiles";

const S = WTILE;
/** 좌표 → 정해진 수 (꾸밈 무늬용) */
export const cellHash = (x: number, y: number): number => (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ 0x5bd1e995) >>> 0;

function dots(g: CanvasRenderingContext2D, px: number, py: number, h: number, colors: readonly [string, string], n: number): void {
  for (let i = 0; i < n; i++) {
    const v = (h >>> (i * 3)) ^ Math.imul(h, i + 1);
    g.fillStyle = colors[i & 1]!;
    g.fillRect(px + ((v >>> 4) % (S - 1)), py + ((v >>> 9) % (S - 1)), 1 + (i % 2), 1);
  }
}

/** 칸 하나 (px, py = 덩어리 캔버스 안 자리) */
export function drawTile(g: CanvasRenderingContext2D, m: WorldMap, cx: number, cy: number, px: number, py: number): void {
  const t = tileAt(m, cx, cy);
  const d = TILE_DEFS[t]!;
  const h = cellHash(cx, cy);
  g.fillStyle = d.base;
  g.fillRect(px, py, S, S);
  if (t === WT.none) return;
  dots(g, px, py, h, d.dots, t === WT.water || t === WT.deep ? 2 : 5);
  const near = (dx: number, dy: number) => tileAt(m, cx + dx, cy + dy);
  switch (t) {
    case WT.water:
    case WT.deep: {
      // 물결 · 물가 거품
      g.fillStyle = d.dots[0];
      const wy = py + 4 + (h % 8);
      g.fillRect(px + 3 + (h % 5), wy, 5, 1);
      g.fillStyle = "#cfe6ff";
      if (near(0, -1) !== WT.water && near(0, -1) !== WT.deep && near(0, -1) !== WT.bridge) g.fillRect(px, py, S, 1);
      if (near(-1, 0) !== WT.water && near(-1, 0) !== WT.deep && near(-1, 0) !== WT.bridge) g.fillRect(px, py, 1, S);
      break;
    }
    case WT.tree: {
      g.fillStyle = "#5a3a22";
      g.fillRect(px + 7, py + 10, 3, 5);
      g.fillStyle = "#1f5a2a";
      g.fillRect(px + 2, py + 3, 12, 8);
      g.fillRect(px + 4, py + 1, 8, 12);
      g.fillStyle = "#2f7a38";
      g.fillRect(px + 4, py + 3, 6, 5);
      g.fillStyle = "#4a9a4a";
      g.fillRect(px + 5, py + 3, 2, 2);
      break;
    }
    case WT.wall: {
      // 돌 쌓기 · 아래가 벽이 아니면 앞면을 어둡게
      g.fillStyle = "#5a5464";
      for (let r = 0; r < 4; r++) g.fillRect(px, py + r * 4 + 3, S, 1);
      for (let r = 0; r < 4; r++) g.fillRect(px + ((r & 1) * 6 + 4), py + r * 4, 1, 3);
      if (near(0, 1) !== WT.wall) {
        g.fillStyle = "rgba(20,16,28,0.35)";
        g.fillRect(px, py + 10, S, 6);
      }
      if (near(0, -1) !== WT.wall) {
        g.fillStyle = "#a49cb0";
        g.fillRect(px, py, S, 2);
      }
      break;
    }
    case WT.rock: {
      g.fillStyle = "#4a3e32";
      g.fillRect(px + 2, py + 5, 12, 9);
      g.fillStyle = "#8a7864";
      g.fillRect(px + 3, py + 4, 9, 6);
      g.fillStyle = "#a8967e";
      g.fillRect(px + 4, py + 4, 4, 2);
      break;
    }
    case WT.bridge: {
      g.fillStyle = "#6e4824";
      for (let i = 0; i < 4; i++) g.fillRect(px, py + i * 4 + 3, S, 1);
      g.fillStyle = "#4a3018";
      g.fillRect(px, py, 1, S);
      g.fillRect(px + S - 1, py, 1, S);
      break;
    }
    case WT.flower: {
      for (let i = 0; i < 3; i++) {
        const v = cellHash(cx + i * 7, cy - i * 3);
        g.fillStyle = d.dots[i & 1]!;
        g.fillRect(px + 2 + (v % 12), py + 2 + ((v >>> 5) % 12), 2, 2);
      }
      break;
    }
    case WT.field: {
      g.fillStyle = "#a08a30";
      for (let i = 0; i < 4; i++) g.fillRect(px, py + i * 4 + 1, S, 1);
      break;
    }
    case WT.floor: {
      g.fillStyle = "#968878";
      g.fillRect(px, py + S - 1, S, 1);
      g.fillRect(px + S - 1, py, 1, S);
      break;
    }
  }
}
