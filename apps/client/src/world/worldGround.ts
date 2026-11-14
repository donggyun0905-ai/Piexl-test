// 세계 지도 땅 바탕 (픽셀마다 계산해 덩어리 캔버스에 한 번만): 결 무늬(부드러운 얼룩·작은 점) · 땅끼리 경계 섞기
// 경계: 순위가 높은 땅(풀 > 눈 > 밭 > 길 > 모래 > 물 > 깊은 물)이 낮은 땅 쪽으로 들쭉날쭉 1~4픽셀 덮고, 덮인 쪽 가장자리는 테두리 색
// 무늬는 지도 전체 픽셀 좌표로 정해서 칸·덩어리 경계에서 끊기지 않음
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import { sampleTex, texOf } from "./worldTex";

type Rgb = readonly [number, number, number];
interface Ground {
  /** 얼룩 어두운 쪽 · 밝은 쪽 */
  lo: Rgb;
  hi: Rgb;
  /** 얼룩 크기 (픽셀) · 가로로 늘림 (물결) */
  size: number;
  stretch: number;
  /** 작은 점 밝은 · 어두운 */
  fleck: readonly [Rgb, Rgb];
  /** 덮인 쪽 가장자리: 1보다 작으면 어둡게, 크면 흰색 쪽으로 (물거품) */
  rim: number;
  /** 경계 순위 (0 = 섞지 않음: 벽·바닥 같은 만든 것) */
  pri: number;
  /** 땅 결 그림 이름 (public/world/tex, 있으면 코드 무늬 대신) */
  tex?: string;
}

const GRASS: Ground = { lo: [70, 136, 62], hi: [104, 172, 82], size: 14, stretch: 1, fleck: [[128, 192, 96], [56, 112, 52]], rim: 0.86, pri: 7, tex: "grass" };
const G: Partial<Record<number, Ground>> = {
  [WT.grass]: GRASS,
  [WT.path]: { lo: [178, 140, 90], hi: [208, 172, 118], size: 11, stretch: 1, fleck: [[226, 196, 146], [150, 114, 72]], rim: 0.8, pri: 4, tex: "path" },
  [WT.sand]: { lo: [214, 192, 128], hi: [236, 218, 160], size: 12, stretch: 1, fleck: [[246, 232, 186], [196, 170, 108]], rim: 0.88, pri: 3, tex: "sand" },
  [WT.water]: { lo: [48, 112, 200], hi: [72, 140, 222], size: 9, stretch: 3, fleck: [[120, 180, 240], [40, 96, 180]], rim: 1.7, pri: 2, tex: "water" },
  [WT.deep]: { lo: [30, 66, 150], hi: [44, 86, 172], size: 12, stretch: 3, fleck: [[64, 110, 196], [24, 52, 128]], rim: 1.25, pri: 1, tex: "deep" },
  [WT.snow]: { lo: [214, 226, 242], hi: [244, 248, 255], size: 14, stretch: 1, fleck: [[255, 255, 255], [196, 210, 232]], rim: 0.9, pri: 6, tex: "snow" },
  [WT.field]: { lo: [184, 150, 56], hi: [214, 184, 76], size: 10, stretch: 1, fleck: [[232, 206, 104], [156, 124, 40]], rim: 0.82, pri: 5, tex: "field" },
  [WT.floor]: { lo: [150, 138, 124], hi: [176, 164, 150], size: 8, stretch: 1, fleck: [[190, 180, 166], [128, 116, 104]], rim: 1, pri: 0, tex: "floor" },
  [WT.wall]: { lo: [104, 98, 116], hi: [128, 120, 140], size: 8, stretch: 1, fleck: [[140, 132, 152], [88, 82, 98]], rim: 1, pri: 0, tex: "wallTop" },
  [WT.woodFloor]: { lo: [150, 104, 62], hi: [178, 128, 80], size: 6, stretch: 4, fleck: [[196, 146, 96], [128, 88, 52]], rim: 1, pri: 0, tex: "woodFloor" },
  [WT.carpet]: { lo: [140, 28, 40], hi: [164, 40, 52], size: 5, stretch: 1, fleck: [[184, 56, 64], [120, 22, 34]], rim: 1, pri: 0, tex: "carpet" },
  [WT.innerWall]: { lo: [44, 34, 52], hi: [56, 44, 64], size: 8, stretch: 1, fleck: [[64, 52, 74], [36, 28, 44]], rim: 1, pri: 0 },
  [WT.metal]: { lo: [118, 126, 136], hi: [140, 148, 158], size: 6, stretch: 1, fleck: [[164, 172, 182], [96, 102, 112]], rim: 1, pri: 0 },
  [WT.rail]: { lo: [112, 96, 80], hi: [132, 114, 96], size: 6, stretch: 1, fleck: [[150, 132, 112], [88, 74, 60]], rim: 1, pri: 0 },
  [WT.bridge]: { lo: [48, 112, 200], hi: [72, 140, 222], size: 9, stretch: 3, fleck: [[120, 180, 240], [40, 96, 180]], rim: 1, pri: 0, tex: "water" },
};
const NONE: Ground = { lo: [12, 10, 18], hi: [12, 10, 18], size: 8, stretch: 1, fleck: [[12, 10, 18], [12, 10, 18]], rim: 1, pri: 0 };

/** 나무·꽃·바위·울타리 밑은 풀 · 집 밑은 바닥 */
export function groundOf(t: number): number {
  if (t === WT.tree || t === WT.flower || t === WT.rock || t === WT.fence) return WT.grass;
  if (t === WT.house || t === WT.keep) return WT.floor;
  if (t === WT.factory || t === WT.pipe || t === WT.arena) return WT.metal;
  return t;
}
const gdef = (t: number): Ground => G[groundOf(t)] ?? NONE;

/** 좌표 → 정해진 수 */
export const hash2 = (x: number, y: number): number => {
  let h = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ 0x5bd1e995) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0;
  return (h ^ (h >>> 12)) >>> 0;
};
const unit = (x: number, y: number): number => (hash2(x, y) & 1023) / 1023;
const smooth = (t: number): number => t * t * (3 - 2 * t);

/** 부드러운 얼룩 0~1 (칸마다 정한 수를 이어 섞음) */
export function vnoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const a = unit(ix, iy) + (unit(ix + 1, iy) - unit(ix, iy)) * fx;
  const b = unit(ix, iy + 1) + (unit(ix + 1, iy + 1) - unit(ix, iy + 1)) * fx;
  return a + (b - a) * fy;
}

/** 땅 결 색 (지도 픽셀 좌표) */
function texel(d: Ground, gx: number, gy: number, out: number[]): void {
  const n = vnoise(gx / (d.size * d.stretch), gy / d.size) * 0.7 + vnoise(gx / 4 + 31, gy / 4 + 17) * 0.3;
  const k = Math.min(1, Math.max(0, (n - 0.2) / 0.6));
  for (let i = 0; i < 3; i++) out[i] = d.lo[i]! + (d.hi[i]! - d.lo[i]!) * k;
  const h = hash2(gx, gy) % 41;
  if (h < 2) {
    const f = d.fleck[h]!;
    for (let i = 0; i < 3; i++) out[i] = f[i]!;
  }
}

/** 경계를 따라 덮는 깊이 1~4 (경계선마다 이어지는 들쭉날쭉) */
function edgeDepth(along: number, line: number): number {
  return 1 + Math.round(vnoise(along / 3.5, line * 7.3) * 3);
}

/** 이 픽셀을 덮는 이웃 땅 (없으면 null) · rim = 덮이지 않았지만 바로 옆이라 테두리 */
function cover(m: WorldMap, cx: number, cy: number, lx: number, ly: number, gx: number, gy: number, me: Ground): { d: Ground | null; rim: boolean; lip: boolean } {
  let best: Ground | null = null;
  let rim = false;
  let lip = false;
  const S = WTILE;
  const sides: [number, number, number, number, number][] = [
    // 이웃 dx, dy, 경계까지 거리, 경계 따라 좌표, 경계선 번호
    [-1, 0, lx, gy, cx * 2 + 1],
    [1, 0, S - 1 - lx, gy, (cx + 1) * 2 + 1],
    [0, -1, ly, gx, cy * 2],
    [0, 1, S - 1 - ly, gx, (cy + 1) * 2],
  ];
  for (const [dx, dy, dist, along, line] of sides) {
    const n = gdef(tileAt(m, cx + dx, cy + dy));
    if (n.pri <= me.pri || !me.pri) continue;
    const depth = edgeDepth(along, line);
    if (dist < depth) {
      if (!best || n.pri > best.pri) [best, lip] = [n, dist === depth - 1];
    } else if (dist === depth) rim = true;
  }
  // 모서리만 닿은 이웃 (둥글게)
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const n = gdef(tileAt(m, cx + dx, cy + dy));
    if (n.pri <= me.pri || !me.pri || (best && n.pri <= best.pri)) continue;
    const ex = dx < 0 ? lx : S - 1 - lx;
    const ey = dy < 0 ? ly : S - 1 - ly;
    const r = 2 + (hash2(cx * 2 + dx, cy * 2 + dy) % 2);
    if (ex + ey < r) [best, lip] = [n, ex + ey === r - 1];
    else if (ex + ey === r && !best) rim = true;
  }
  return { d: best, rim: rim && !best, lip };
}

/** 덩어리 하나의 땅 바탕 (x0, y0 = 덩어리 왼쪽 위 칸, n = 한 변 칸 수, dens = 지도 1픽셀당 그림 픽셀)
 * 경계·테두리는 지도 픽셀마다 계산하고, 결은 땅 결 그림이 있으면 그림 픽셀마다 */
export function paintGround(m: WorldMap, x0: number, y0: number, n: number, dens = 1): ImageData {
  const N = n * WTILE;
  const W = N * dens;
  const img = new ImageData(W, W);
  const px = img.data;
  const c = [0, 0, 0];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const gx = x0 * WTILE + x;
      const gy = y0 * WTILE + y;
      const cx = Math.floor(gx / WTILE);
      const cy = Math.floor(gy / WTILE);
      const me = gdef(tileAt(m, cx, cy));
      const cv = me.pri ? cover(m, cx, cy, gx - cx * WTILE, gy - cy * WTILE, gx, gy, me) : null;
      const d = cv?.d ?? me;
      let f = 1;
      if (cv?.lip) f = 0.9;
      else if (cv?.rim) f = me.rim;
      const t = dens > 1 ? texOf(d.tex) : undefined;
      if (!t) texel(d, gx, gy, c);
      for (let sy = 0; sy < dens; sy++) {
        for (let sx = 0; sx < dens; sx++) {
          if (t) sampleTex(t, gx * dens + sx, gy * dens + sy, c);
          const i = ((y * dens + sy) * W + x * dens + sx) * 4;
          for (let k = 0; k < 3; k++) px[i + k] = Math.min(255, f > 1 ? c[k]! + (255 - c[k]!) * (f - 1) * 0.6 : c[k]! * f);
          px[i + 3] = 255;
        }
      }
    }
  }
  return img;
}

/** 이 땅의 결 그림 이름 (꾸밈 코드가 결 그림이 있으면 코드 무늬를 건너뛸 때) */
export const texNameOf = (t: number): string | undefined => gdef(t).tex;
