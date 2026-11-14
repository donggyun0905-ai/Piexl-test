// 작은 지도 그리기 (M 지도 창 · 전체 세계 지도가 같이 씀): 땅 종류마다 한 색 · 한 칸 = 한 픽셀 (CSS로 키움) · 받은 지도는 다시 받지 않음
import { useEffect, useState } from "react";
import { loadWorldMap, type WorldMap } from "./worldMap";
import type { Region } from "./worldPlaces";

/** 땅 종류(WT 번호) → 지도 색 */
const MINI = [
  "#0c0a12", "#5aa04a", "#c8a870", "#3c78c8", "#22448c", "#e0cc92", "#245c2e", "#787088", "#b0a090", "#685848", "#986838", "#e8eef8", "#7cb05a", "#d0b448",
  "#a04a2a", "#b4605a", "#606ca8", "#a87c50", "#38303e", "#a02838", "#8c96a0", "#5a463c", "#a8602e", "#3c8c8c", "#c8b896", "#3a6e44", "#6a4426", "#2a7a4a",
  "#e8e2d4", "#963228", "#c8b478", "#e6b428", "#c86e5a",
  "#e2c478", "#aa8264", "#c88c5a", "#beaa82", "#3cc8be", "#a06e3c",
  "#e2ecf8", "#96d2ec", "#786e68", "#b0b8c4", "#464c5c", "#285046",
  "#5a6064", "#8c6e50", "#f0e4be", "#46c8dc", "#143c78", "#785a3c", "#ecece4",
];
const cache = new Map<string, Promise<WorldMap>>();

/** 지역 지도 받기 (한 번 받은 것은 다시 받지 않음) */
export function useWorldMap(path: string): WorldMap | null {
  const [map, setMap] = useState<WorldMap | null>(null);
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}${path}`;
    if (!cache.has(url)) cache.set(url, loadWorldMap(url));
    let alive = true;
    cache.get(url)!.then((m) => alive && setMap(m), () => undefined);
    return () => {
      alive = false;
    };
  }, [path]);
  return map;
}

/** 지도 → 작은 캔버스 */
export function paintMini(c: HTMLCanvasElement, m: WorldMap, mini: Region["mini"]): void {
  c.width = m.cols;
  c.height = m.rows;
  const g = c.getContext("2d")!;
  const img = g.createImageData(m.cols, m.rows);
  for (let i = 0; i < m.tiles.length; i++) {
    const h = mini?.[m.tiles[i]!] ?? MINI[m.tiles[i]!] ?? MINI[0]!;
    for (let k = 0; k < 3; k++) img.data[i * 4 + k] = parseInt(h.slice(1 + k * 2, 3 + k * 2), 16);
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}
