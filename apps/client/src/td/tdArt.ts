// 타워 디펜스 맵 그림: 테마마다 땅·길·울타리 색과 꾸밈. 한 번 그려 둔 그림(캔버스)을 매 프레임 붙이고, 움직이는 것(용암 빛·눈·반딧불 등)만 따로
import { TD_COLS, TD_DECOR, TD_EDGE, TD_MAPS, TD_PATH, TD_ROWS, TILE_SIZE, mapTiles, tdMapDef, tdThemeOf, tileHash, type TdMapDef, type TdMapId, type TdTheme } from "@pixel-rogue/shared";
import { drawDecor, drawEdge } from "./tdDecor";

const T = TILE_SIZE;
export const MAP_W = TD_COLS * T;
export const MAP_H = TD_ROWS * T;

export interface Theme {
  ground: readonly string[];
  speck: string;
  path: string;
  pathEdge: string;
  pathSpeck: string;
  edge: string;
  edgeTop: string;
  /** 지킬 곳 깃발 색 */
  flag: string;
}

export const THEMES: Record<TdTheme, Theme> = {
  meadow: { ground: ["#4f8a3c", "#56933f", "#4a8338"], speck: "#78b856", path: "#c9a66b", pathEdge: "#8f6c3e", pathSpeck: "#b08e58", edge: "#2c5226", edgeTop: "#3d6e30", flag: "#e05050" },
  desert: { ground: ["#dcb66c", "#d4ad62", "#e2bf76"], speck: "#c09650", path: "#b08250", pathEdge: "#7c5432", pathSpeck: "#9a6e42", edge: "#9a6438", edgeTop: "#b87a46", flag: "#3a8ad8" },
  frost: { ground: ["#e2ecf5", "#d6e3ef", "#eaf2f9"], speck: "#ffffff", path: "#94bcdc", pathEdge: "#5f88ac", pathSpeck: "#b8d6ee", edge: "#6a88a8", edgeTop: "#f4f8fc", flag: "#d84a6a" },
  swamp: { ground: ["#3e5c3a", "#38553a", "#44623e"], speck: "#5e8048", path: "#6e5c3c", pathEdge: "#43361f", pathSpeck: "#584a30", edge: "#1e3a34", edgeTop: "#2c5248", flag: "#e0c040" },
  volcano: { ground: ["#3c2c2a", "#352624", "#43302c"], speck: "#5c3c32", path: "#5a4640", pathEdge: "#ff7a2a", pathSpeck: "#6e5650", edge: "#1c1010", edgeTop: "#3a1a14", flag: "#ffd040" },
  crystal: { ground: ["#2c2644", "#27223c", "#312a4a"], speck: "#4c4072", path: "#5c5680", pathEdge: "#9a8ae0", pathSpeck: "#6e68a0", edge: "#141026", edgeTop: "#2a2048", flag: "#4af0d0" },
  sky: { ground: ["#ece8f4", "#e2dcee", "#f2eef8"], speck: "#d0c8e2", path: "#d8bc6a", pathEdge: "#a07c32", pathSpeck: "#ead08a", edge: "#7ab8ea", edgeTop: "#ffffff", flag: "#7a5ad8" },
  abyss: { ground: ["#16101e", "#120c1a", "#1a1424"], speck: "#3a1e3e", path: "#2e1a2e", pathEdge: "#ff3a6a", pathSpeck: "#4a2440", edge: "#08040c", edgeTop: "#2a0e24", flag: "#ff3a6a" },
};

/** 맵 모양마다 (관리자가 맵을 다시 저장하면 새로 그림) */
const cache = new WeakMap<TdMapDef, HTMLCanvasElement>();

/** 맵 바탕 그림 (테두리·땅·길·꾸밈·입구·지킬 곳) */
export function mapCanvas(mapId: TdMapId): HTMLCanvasElement {
  const hit = cache.get(tdMapDef(mapId));
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = MAP_W;
  c.height = MAP_H;
  const ctx = c.getContext("2d")!;
  paintMap(ctx, mapId);
  cache.set(tdMapDef(mapId), c);
  return c;
}

export function paintMap(ctx: CanvasRenderingContext2D, mapId: TdMapId): void {
  const theme = tdThemeOf(mapId);
  const th = THEMES[theme];
  const tiles = mapTiles(mapId);
  const salt = TD_MAPS.findIndex((m) => m.id === mapId) + 11;
  const at = (c: number, r: number) => tiles[r]?.[c];
  for (let r = 0; r < TD_ROWS; r++) {
    for (let c = 0; c < TD_COLS; c++) {
      const x = c * T;
      const y = r * T;
      const h = tileHash(c, r, salt);
      ctx.fillStyle = th.ground[Math.floor(h * th.ground.length)]!;
      ctx.fillRect(x, y, T, T);
      // 땅 무늬 점
      ctx.fillStyle = th.speck;
      for (let i = 0; i < 3; i++) {
        const hh = tileHash(c * 7 + i, r * 13 + i, salt);
        if (hh < 0.6) ctx.fillRect(x + Math.floor(hh * 97) % 15, y + Math.floor(hh * 61) % 15, 1, hh < 0.2 ? 2 : 1);
      }
    }
  }
  for (let r = 0; r < TD_ROWS; r++) {
    for (let c = 0; c < TD_COLS; c++) {
      const v = at(c, r);
      if (v === TD_PATH) paintPath(ctx, th, c, r, (dc, dr) => at(c + dc, r + dr) === TD_PATH, salt);
    }
  }
  for (let r = 0; r < TD_ROWS; r++) {
    for (let c = 0; c < TD_COLS; c++) {
      const v = at(c, r);
      if (v === TD_EDGE) drawEdge(ctx, theme, th, c * T, r * T, tileHash(c, r, salt + 3));
      else if (v === TD_DECOR) drawDecor(ctx, theme, c * T, r * T, tileHash(c, r, salt + 5));
    }
  }
  const def = tdMapDef(mapId);
  for (const path of def.paths) paintGate(ctx, path[0]!);
  paintHome(ctx, th, def.paths[0]![def.paths[0]!.length - 1]!);
}

function paintPath(ctx: CanvasRenderingContext2D, th: Theme, c: number, r: number, isPath: (dc: number, dr: number) => boolean, salt: number): void {
  const x = c * T;
  const y = r * T;
  ctx.fillStyle = th.path;
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = th.pathSpeck;
  for (let i = 0; i < 4; i++) {
    const h = tileHash(c * 3 + i, r * 5 - i, salt + 9);
    ctx.fillRect(x + 2 + (Math.floor(h * 113) % 12), y + 2 + (Math.floor(h * 71) % 12), h < 0.3 ? 2 : 1, 1);
  }
  // 길 가장자리 (옆이 길이 아니면 테두리)
  ctx.fillStyle = th.pathEdge;
  if (!isPath(0, -1)) ctx.fillRect(x, y, T, 2);
  if (!isPath(0, 1)) ctx.fillRect(x, y + T - 2, T, 2);
  if (!isPath(-1, 0)) ctx.fillRect(x, y, 2, T);
  if (!isPath(1, 0)) ctx.fillRect(x + T - 2, y, 2, T);
  // 안쪽 모서리 점
  for (const [dc, dr] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    if (isPath(dc, 0) && isPath(0, dr) && !isPath(dc, dr)) ctx.fillRect(x + (dc < 0 ? 0 : T - 2), y + (dr < 0 ? 0 : T - 2), 2, 2);
  }
}

/** 적이 나오는 굴 입구 */
function paintGate(ctx: CanvasRenderingContext2D, [c, r]: readonly [number, number]): void {
  const x = c * T;
  const y = r * T;
  ctx.fillStyle = "#1a1220";
  ctx.fillRect(x + 1, y + 1, T - 2, T - 2);
  ctx.fillStyle = "#3a2a48";
  ctx.fillRect(x + 1, y + 1, T - 2, 2);
  ctx.fillRect(x + 1, y + 1, 2, T - 2);
  ctx.fillRect(x + T - 3, y + 1, 2, T - 2);
  ctx.fillStyle = "#c04a6a";
  ctx.fillRect(x + 5, y + 6, 2, 2);
  ctx.fillRect(x + 9, y + 6, 2, 2);
}

/** 지킬 곳: 작은 성과 깃발 */
function paintHome(ctx: CanvasRenderingContext2D, th: Theme, [c, r]: readonly [number, number]): void {
  const x = c * T;
  const y = r * T;
  ctx.fillStyle = "#3a3448";
  ctx.fillRect(x + 1, y + 4, 14, 12);
  ctx.fillStyle = "#9a94b0";
  ctx.fillRect(x + 2, y + 5, 12, 10);
  ctx.fillStyle = "#c8c2dc";
  for (const bx of [2, 6, 10]) ctx.fillRect(x + bx, y + 3, 3, 3);
  ctx.fillStyle = "#3a2a20";
  ctx.fillRect(x + 6, y + 10, 4, 5);
  ctx.fillStyle = "#5a4a3a";
  ctx.fillRect(x + 7, y - 4, 1, 8);
  ctx.fillStyle = th.flag;
  ctx.fillRect(x + 8, y - 4, 5, 3);
}

/** 움직이는 꾸밈 (t = 초) */
export function drawMapFx(ctx: CanvasRenderingContext2D, id: TdMapId, t: number): void {
  const mapId = tdThemeOf(id);
  const n = 18;
  for (let i = 0; i < n; i++) {
    const a = i * 12.9898;
    const fx = (Math.sin(a) * 43758.5453) % 1;
    const fy = (Math.cos(a) * 24634.6345) % 1;
    const bx = Math.abs(fx) * MAP_W;
    const by = Math.abs(fy) * MAP_H;
    if (mapId === "frost") {
      // 눈송이
      const y = (by + t * (8 + (i % 5) * 3)) % MAP_H;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(bx + Math.sin(t + i) * 4, y, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
    } else if (mapId === "swamp") {
      // 반딧불
      const glow = 0.4 + 0.4 * Math.sin(t * 3 + i * 1.7);
      ctx.fillStyle = `rgba(220,255,120,${glow})`;
      ctx.fillRect(bx + Math.sin(t * 0.7 + i) * 8, by + Math.cos(t * 0.5 + i) * 6, 1, 1);
    } else if (mapId === "volcano") {
      // 떠오르는 불씨
      const y = MAP_H - ((MAP_H - by + t * (10 + (i % 4) * 4)) % MAP_H);
      ctx.fillStyle = `rgba(255,${120 + (i % 5) * 20},40,${0.5 + 0.4 * Math.sin(t * 4 + i)})`;
      ctx.fillRect(bx + Math.sin(t * 2 + i) * 3, y, 1, 1);
    } else if (mapId === "crystal") {
      // 반짝임
      const s = Math.sin(t * 2.2 + i * 2.3);
      if (s > 0.7) {
        ctx.fillStyle = `rgba(180,240,255,${(s - 0.7) * 3})`;
        ctx.fillRect(bx - 1, by, 3, 1);
        ctx.fillRect(bx, by - 1, 1, 3);
      }
    } else if (mapId === "abyss") {
      // 균열에서 새어 나오는 붉은 기운 (아래에서 위로 흔들리며 올라감)
      const y = MAP_H - ((MAP_H - by + t * (6 + (i % 3) * 3)) % MAP_H);
      ctx.fillStyle = `rgba(${200 + (i % 3) * 25},40,${90 + (i % 4) * 30},${0.35 + 0.35 * Math.sin(t * 3 + i)})`;
      ctx.fillRect(bx + Math.sin(t * 1.5 + i) * 5, y, 1, 2);
    } else if (mapId === "sky" && i < 6) {
      // 흘러가는 구름
      const x = ((bx + t * (4 + i)) % (MAP_W + 40)) - 20;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x, by, 14, 3);
      ctx.fillRect(x + 3, by - 2, 8, 2);
    } else if (mapId === "meadow" && i < 8) {
      // 나비
      const x = bx + Math.sin(t * 0.6 + i) * 20;
      const y = by + Math.sin(t * 1.3 + i * 2) * 8;
      ctx.fillStyle = i % 2 ? "#fff6a0" : "#ffd0f0";
      const flap = Math.sin(t * 12 + i) > 0 ? 1 : 0;
      ctx.fillRect(x - 1 - flap, y, 1 + flap, 1);
      ctx.fillRect(x + 1, y, 1 + flap, 1);
    } else if (mapId === "desert" && i < 5) {
      // 모래바람
      const x = ((bx + t * 30) % (MAP_W + 30)) - 15;
      ctx.fillStyle = "rgba(255,240,200,0.35)";
      ctx.fillRect(x, by, 10, 1);
    }
  }
  // 심연: 화면 전체가 천천히 붉게 맥박침
  if (mapId === "abyss") {
    ctx.fillStyle = `rgba(160,20,60,${0.06 + 0.06 * Math.sin(t * 1.2)})`;
    ctx.fillRect(0, 0, MAP_W, MAP_H);
  }
  // 용암 길 테두리가 숨 쉬듯 빛남
  if (mapId === "volcano") {
    ctx.fillStyle = `rgba(255,120,40,${0.08 + 0.06 * Math.sin(t * 2)})`;
    ctx.fillRect(0, 0, MAP_W, MAP_H);
  }
}
