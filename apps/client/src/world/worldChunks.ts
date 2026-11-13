// 세계 지도 덩어리 그리기: 32×32칸을 캔버스 한 장에 미리 그려 두고, 화면에 걸친 덩어리만 그림
// 오래 안 쓴 덩어리는 버림 (휴대폰 메모리 아끼기) → 지도가 아무리 커도 같은 속도
import type { View } from "../lobby/walker";
import { drawTile } from "./worldArt";
import { paintGround } from "./worldGround";
import { WTILE, type WorldMap } from "./worldMap";

/** 덩어리 한 변 칸 수 */
export const CHUNK = 32;
const CPX = CHUNK * WTILE;

/** 보이는 영역에 걸친 덩어리 번호들 */
export function chunksInView(m: WorldMap, v: View): [number, number][] {
  const out: [number, number][] = [];
  const x0 = Math.max(0, Math.floor(v.x / CPX));
  const y0 = Math.max(0, Math.floor(v.y / CPX));
  const x1 = Math.min(Math.ceil(m.cols / CHUNK) - 1, Math.floor((v.x + v.w) / CPX));
  const y1 = Math.min(Math.ceil(m.rows / CHUNK) - 1, Math.floor((v.y + v.h) / CPX));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) out.push([x, y]);
  return out;
}

export function createChunkCache(m: WorldMap, max = 16) {
  const cache = new Map<string, HTMLCanvasElement>();
  const build = (kx: number, ky: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = CPX;
    const g = c.getContext("2d")!;
    // 땅 바탕(픽셀마다) → 꾸밈 (옆 덩어리 칸 꾸밈이 넘어오는 것까지 한 칸 더)
    g.putImageData(paintGround(m, kx * CHUNK, ky * CHUNK, CHUNK), 0, 0);
    for (let y = -1; y <= CHUNK; y++) for (let x = -1; x <= CHUNK; x++) drawTile(g, m, kx * CHUNK + x, ky * CHUNK + y, x * WTILE, y * WTILE);
    return c;
  };
  return {
    draw(ctx: CanvasRenderingContext2D, v: View): void {
      for (const [kx, ky] of chunksInView(m, v)) {
        const id = `${kx},${ky}`;
        let c = cache.get(id);
        if (c) cache.delete(id);
        else c = build(kx, ky);
        cache.set(id, c);
        ctx.drawImage(c, kx * CPX, ky * CPX);
      }
      // 가장 오래 안 쓴 것부터 버림 (Map은 넣은 차례)
      while (cache.size > max) cache.delete(cache.keys().next().value!);
    },
  };
}
