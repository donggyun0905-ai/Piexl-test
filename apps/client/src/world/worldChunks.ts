// 세계 지도 덩어리 그리기: 여러 칸을 캔버스 한 장에 미리 그려 두고, 화면에 걸친 덩어리만 그림
// 오래 안 쓴 덩어리는 버림 (휴대폰 메모리 아끼기) → 지도가 아무리 커도 같은 속도
// 땅 결 그림이 있으면 4배 해상도(worldTex)라 덩어리를 16칸으로 작게
import type { View } from "../lobby/walker";
import { drawTile, setChunkOrigin } from "./worldArt";
import { paintGround } from "./worldGround";
import { WTILE, type WorldMap } from "./worldMap";
import { artDens } from "./worldTex";

/** 덩어리 한 변 칸 수 (코드 그림) */
export const CHUNK = 32;

/** 보이는 영역에 걸친 덩어리 번호들 */
export function chunksInView(m: WorldMap, v: View, size = CHUNK): [number, number][] {
  const cpx = size * WTILE;
  const out: [number, number][] = [];
  const x0 = Math.max(0, Math.floor(v.x / cpx));
  const y0 = Math.max(0, Math.floor(v.y / cpx));
  const x1 = Math.min(Math.ceil(m.cols / size) - 1, Math.floor((v.x + v.w) / cpx));
  const y1 = Math.min(Math.ceil(m.rows / size) - 1, Math.floor((v.y + v.h) / cpx));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) out.push([x, y]);
  return out;
}

export function createChunkCache(m: WorldMap) {
  const dens = artDens();
  const size = dens > 1 ? 16 : CHUNK;
  const max = dens > 1 ? 12 : 16;
  const cpx = size * WTILE;
  const cache = new Map<string, HTMLCanvasElement>();
  const build = (kx: number, ky: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = cpx * dens;
    const g = c.getContext("2d")!;
    g.imageSmoothingEnabled = false;
    // 땅 바탕(픽셀마다) → 꾸밈 (옆 덩어리 칸 꾸밈이 넘어오는 것까지: 위·옆 한 칸, 아래 세 칸 — 집·바위가 위로 큼) · 꾸밈은 지도 좌표로 그리고 dens배로 늘림
    g.putImageData(paintGround(m, kx * size, ky * size, size, dens), 0, 0);
    g.scale(dens, dens);
    setChunkOrigin(kx * cpx, ky * cpx, dens);
    for (let y = -1; y <= size + 2; y++) for (let x = -1; x <= size; x++) drawTile(g, m, kx * size + x, ky * size + y, x * WTILE, y * WTILE);
    return c;
  };
  return {
    draw(ctx: CanvasRenderingContext2D, v: View): void {
      for (const [kx, ky] of chunksInView(m, v, size)) {
        const id = `${kx},${ky}`;
        let c = cache.get(id);
        if (c) cache.delete(id);
        else c = build(kx, ky);
        cache.set(id, c);
        ctx.drawImage(c, kx * cpx, ky * cpx, cpx, cpx);
      }
      // 가장 오래 안 쓴 것부터 버림 (Map은 넣은 차례)
      while (cache.size > max) cache.delete(cache.keys().next().value!);
    },
  };
}
