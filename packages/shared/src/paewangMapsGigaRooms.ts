// 기간토마키아 건물: 집 8 · 아파트 4(2층, 층마다 방 넷) · 학교 2(복도 + 교실 여섯). 들판엔 담으로 된 건물 + 아래쪽 문,
// 실내는 들판 오른쪽 담 너머 '실내 구역'에 층마다 따로 (문·계단에서 F로 옮겨 감, 실내마다 안개라 밖에서 안 보임)
import { carve, type GigaBuilding, type Rect, type Spot } from "./paewangMapKit";

type Kind = GigaBuilding["kind"];
/** 들판 건물 크기 · 실내 한 층 (바닥 너비·높이, 칸막이 담, 상자 자리, 나가는 문, 계단) — 실내 좌표는 그 층 바닥의 왼쪽 위 기준 */
const OUT: Record<Kind, [number, number]> = { house: [9, 7], apt: [14, 12], school: [22, 14] };
interface Floor {
  w: number;
  h: number;
  walls: Rect[];
  chests: Spot[];
  exit?: Spot;
  stairs?: Spot;
}
const HOUSE: Floor = { w: 12, h: 8, walls: [[5, 0, 1, 3]], chests: [[2, 1], [9, 1]], exit: [6, 7] };
const APT_WALLS: Rect[] = [[11, 0, 1, 4], [11, 8, 1, 4], [0, 6, 4, 1], [7, 6, 9, 1], [19, 6, 3, 1]];
const APT1: Floor = { w: 22, h: 12, walls: APT_WALLS, chests: [[5, 2], [16, 2], [7, 9]], exit: [3, 11], stairs: [19, 11] };
const APT2: Floor = { w: 22, h: 12, walls: APT_WALLS, chests: [[5, 2], [16, 2], [5, 9], [15, 9]], stairs: [19, 11] };
const SCHOOL: Floor = {
  w: 32,
  h: 16,
  // 교실 셋씩 위·아래, 가운데 복도 (교실 문 칸은 비움)
  walls: [[10, 0, 1, 6], [21, 0, 1, 6], [0, 6, 4, 1], [6, 6, 9, 1], [17, 6, 9, 1], [28, 6, 4, 1], [10, 10, 1, 6], [21, 10, 1, 6], [0, 9, 4, 1], [6, 9, 9, 1], [17, 9, 9, 1], [28, 9, 4, 1]],
  chests: [[3, 2], [7, 3], [14, 2], [18, 3], [25, 2], [29, 3], [3, 13], [7, 12], [14, 13], [18, 12], [25, 13], [29, 12]],
  exit: [0, 7],
};
const FLOORS: Record<Kind, Floor[]> = { house: [HOUSE], apt: [APT1, APT2], school: [SCHOOL] };
const KINDS: Kind[] = ["school", "school", "apt", "apt", "apt", "apt", "house", "house", "house", "house", "house", "house", "house", "house"];

export interface GigaRooms {
  buildings: GigaBuilding[];
  portals: { at: Spot; to: Spot; kind: "in" | "out" | "up" | "down"; b: number }[];
  /** 들판 건물 담 + 실내 구역 담 */
  walls: Rect[];
  /** 건물마다 실내 안개 (fogs) */
  fogs: Rect[][];
}

/** 건물 자리 고르기(들판, 시작 자리·서로 겹치지 않게) + 실내 구역 채우기. rand = 맵 시드 랜덤 */
export function gigaRooms(C: number, R: number, inW: number, spots: readonly Spot[], rand: () => number): GigaRooms {
  const placed: Rect[] = [];
  const free = ([c, r, w, h]: Rect) =>
    !spots.some(([x, y]) => x >= c - 4 && x < c + w + 4 && y >= r - 4 && y < r + h + 6) && !placed.some(([a, b, ww, hh]) => c < a + ww + 6 && a < c + w + 6 && r < b + hh + 6 && b < r + h + 6);
  const out = KINDS.map((k) => {
    const [w, h] = OUT[k];
    for (let n = 0; n < 400; n++) {
      const rect: Rect = [6 + Math.floor(rand() * (C - w - 12)), 6 + Math.floor(rand() * (R - h - 14)), w, h];
      if (free(rect)) {
        placed.push(rect);
        return rect;
      }
    }
    return null;
  });
  // 실내 구역: 층마다 왼쪽부터 줄지어 (담 두께 1 + 사이 1)
  const open: Rect[] = [];
  const walls: Rect[] = [[C, 0, 1, R]];
  const buildings: GigaBuilding[] = [];
  const portals: GigaRooms["portals"] = [];
  const fogs: Rect[][] = [];
  let [x, y, rowH] = [C + 2, 2, 0];
  KINDS.forEach((k, b) => {
    const o = out[b];
    if (!o) return;
    const door: Spot = [o[0] + Math.floor(o[2] / 2), o[1] + o[3]];
    const floors = FLOORS[k].map((f) => {
      if (x + f.w + 1 > C + inW - 1) [x, y, rowH] = [C + 2, y + rowH + 2, 0];
      const at: Spot = [x, y];
      open.push([x, y, f.w, f.h]);
      walls.push(...f.walls.map(([c, r, w, h]): Rect => [x + c, y + r, w, h]));
      [x, rowH] = [x + f.w + 2, Math.max(rowH, f.h)];
      return { f, at };
    });
    const g = ([c, r]: Spot, at: Spot): Spot => [at[0] + c, at[1] + r];
    const first = floors[0]!;
    // 들판 문 ↔ 1층 나가는 문 · 층 사이 계단
    portals.push({ at: door, to: g([first.f.exit![0], first.f.exit![1] - 2], first.at), kind: "in", b });
    portals.push({ at: g(first.f.exit!, first.at), to: [door[0], door[1] + 2], kind: "out", b });
    for (let n = 1; n < floors.length; n++) {
      const [lo, hi] = [floors[n - 1]!, floors[n]!];
      portals.push({ at: g(lo.f.stairs!, lo.at), to: g([hi.f.stairs![0] - 2, hi.f.stairs![1]], hi.at), kind: "up", b });
      portals.push({ at: g(hi.f.stairs!, hi.at), to: g([lo.f.stairs![0] - 2, lo.f.stairs![1]], lo.at), kind: "down", b });
    }
    const inside = floors.map(({ f, at }): Rect => [at[0], at[1], f.w, f.h]);
    buildings.push({ kind: k, out: o, inside, chests: floors.flatMap(({ f, at }) => f.chests.map((c) => g(c, at))) });
    fogs.push(inside);
    walls.push(o);
  });
  // 실내 구역은 바닥 말고 모두 담
  walls.push(...carve(inW, R, open.map(([c, r, w, h]): Rect => [c - C, r, w, h])).map(([c, r, w, h]): Rect => [c + C, r, w, h]));
  return { buildings, portals, walls, fogs };
}
