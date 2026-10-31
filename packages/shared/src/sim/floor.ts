// 층 지도 만들기. 같은 시드 + 같은 층 번호면 항상 같은 지도.
// 한 층은 갈림길: 아래(시작 방)에서 위(보스방)로 칸(layer)을 하나씩 올라감.
// 칸마다 방이 3개 있고 (2026-10-31부터 늘 3개), 방을 정리하면 위쪽 벽의 출구로 다음 칸의 가까운 방 중 하나를 골라 감. 되돌아가지 않음
import { createRng, deriveSeed } from "../rng";
import { bossForFloor } from "../enemyDefs";
import { PLAIN_SHAPE, pickShape, type RoomShape } from "./layout";
import { BOSS_SHAPE_KINDS } from "./roomShapes";

export const FLOOR_COUNT = 6;
/** 6층을 깬 뒤 도전하는 라스트 보스 층 */
export const LAST_FLOOR = 7;
/** 한 칸에 놓일 수 있는 방 줄 수 (왼쪽·가운데·오른쪽) */
export const LANES = 3;
/** 한 층의 최대 칸 수 (시작 방·보스방 포함) */
export const MAX_LAYERS = 13;

/** exit = 보스방 (보스를 잡으면 계단이 열림) · elite = 강한 적 (보상이 많음) · rest = 쉼터 (체력 회복) · golden = 황금방 (라스트 보스 층: 돈 300 + 아이템 3개 고르기) */
export type RoomType = "start" | "combat" | "elite" | "rest" | "treasure" | "shop" | "exit" | "golden";

export interface RoomInfo {
  id: number;
  /** 몇 번째 칸인지 (0 = 시작 방) */
  layer: number;
  /** 칸 안의 줄 (0 왼쪽 · 1 가운데 · 2 오른쪽) */
  lane: number;
  type: RoomType;
  /** 줄별 출구가 이어지는 다음 방 id (-1이면 출구 없음). 길이 LANES */
  exits: number[];
  /** 방 안 모양 (전투방·강한 적 방만, 나머지는 네모) */
  shape: RoomShape;
}

export interface FloorMap {
  floor: number;
  rooms: RoomInfo[];
  startId: number;
  exitId: number;
  /** 칸 수 (시작 방·보스방 포함) */
  layers: number;
}

/** 시작 방과 보스방 사이의 칸 수: 1층 7칸, 한 층마다 1칸씩, 최대 11칸 (2026-10-31 3칸씩 늘림) */
export function middleLayersFor(floor: number): number {
  return Math.min(6 + floor, MAX_LAYERS - 2);
}

export function generateFloor(seed: number, floor: number): FloorMap {
  const rng = createRng(deriveSeed(seed, "floor", floor, "map"));
  const middle = middleLayersFor(floor);
  const rooms: RoomInfo[] = [];
  const add = (layer: number, lane: number): RoomInfo => {
    const r: RoomInfo = { id: rooms.length, layer, lane, type: "combat", exits: Array<number>(LANES).fill(-1), shape: PLAIN_SHAPE };
    rooms.push(r);
    return r;
  };
  const byLayer: RoomInfo[][] = [[add(0, 1)]];
  byLayer[0]![0]!.type = "start";
  for (let l = 1; l <= middle; l++) byLayer.push([0, 1, 2].map((lane) => add(l, lane)));
  const exit = add(middle + 1, 1);
  exit.type = "exit";
  byLayer.push([exit]);

  // 출구: 다음 칸에서 줄 차이가 1 이하인 방으로
  for (let l = 0; l < byLayer.length - 1; l++) {
    for (const r of byLayer[l]!) {
      for (const n of byLayer[l + 1]!) if (Math.abs(n.lane - r.lane) <= 1) r.exits[n.lane] = n.id;
    }
  }

  // 방 종류: 보물방은 앞쪽 절반, 상점은 뒤쪽 절반에 하나씩. 보스 바로 앞 칸에 쉼터 하나. 2칸째부터 절반 확률로 강한 적
  const half = Math.ceil(middle / 2);
  const setType = (layer: number, type: RoomType) => {
    const free = byLayer[layer]!.filter((r) => r.type === "combat");
    if (free.length > 0) rng.pick(free).type = type;
  };
  setType(rng.int(1, half), "treasure");
  setType(rng.int(half + 1, middle), "shop");
  setType(middle, "rest");
  for (let l = 2; l <= middle; l++) {
    // 전투방이 하나는 남도록
    if (byLayer[l]!.filter((r) => r.type === "combat").length >= 2 && rng.nextFloat() < 0.5) setType(l, "elite");
  }

  // 방 모양: 방마다 따로 시드를 써서 지도 모양·방 종류에는 영향 없음
  for (const r of rooms) {
    if (r.type === "combat" || r.type === "elite") r.shape = pickShape(createRng(deriveSeed(seed, "floor", floor, "room", r.id, "shape")));
    // 시즌 2 새 보스방은 그 보스에 맞는 벽 배치
    const bossShape = BOSS_SHAPE_KINDS.indexOf(bossForFloor(floor, seed) as (typeof BOSS_SHAPE_KINDS)[number]);
    if (r.type === "exit" && floor <= 6 && bossShape >= 0) r.shape = { id: 1000 + bossShape, flip: false };
  }

  return { floor, rooms, startId: 0, exitId: exit.id, layers: byLayer.length };
}

/** 라스트 보스 층: 시작 방 → 황금방 → 상점 → (아주 큰) 보스방, 한 줄로 */
export function lastFloorMap(): FloorMap {
  const types: RoomType[] = ["start", "golden", "shop", "exit"];
  const rooms: RoomInfo[] = types.map((type, i) => ({ id: i, layer: i, lane: 1, type, exits: [-1, i + 1 < types.length ? i + 1 : -1, -1], shape: PLAIN_SHAPE }));
  return { floor: LAST_FLOOR, rooms, startId: 0, exitId: types.length - 1, layers: types.length };
}
