// 레이드 아레나 (혼자 하기): 레벨마다 보상 방(체력 다 참 · 무기 마음껏 · 패시브 3개 중 1 · 사용 아이템 3개 중 2) → 보스전
// Lv1~4 1단계 보스: 1마리 → 2마리 동시 → 3마리 동시 → 승급전(모두 차례로, 사이 보상 없이 체력 이어짐) · Lv5~8 2단계 · Lv9~12 3단계
// Lv13~15 최종 보스: 보상 방 출구마다 남은 최종 보스, 골라서 하나씩 (아주 큰 방). 셋 다 잡으면 완료
import { BOSS_TIERS, LAST_BOSSES, type BossKind } from "../content";
import { ROOM_CX as CX, ROOM_CY as CY } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { spawnBoss } from "./bosses";
import { LANES, LAST_FLOOR, type FloorMap, type RoomInfo, type RoomType } from "./floor";
import { PLAIN_SHAPE } from "./layout";
import { addPickup, passivePool, pickDistinct, usePool, weaponPool } from "./loot";
import type { EnemyState, Pickup, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  STAGE_LEVELS: 4,
  /** 보상 묶음: 패시브(하나만) · 사용 아이템(두 개까지) */
  PASSIVE_GROUP: 951,
  USE_PICKS: 2,
};
export { R as ARENA_RULES };

/** 전체 레벨 수 · 단계마다 레벨 수 · 단계마다 보스 체력 기준 층 */
export const ARENA_LEVELS = 15;
const STAGE_FLOOR = [2, 4, 6];
export const ARENA_USE_GROUP = 950;
/** 최종 보스 출구 줄 (남은 수마다) */
const FINAL_LANES: Record<number, number[]> = { 1: [1], 2: [0, 2], 3: [0, 1, 2] };

/** 최종 보스 레벨인지 (Lv13~15) */
export const arenaFinal = (level: number) => level > R.STAGE_LEVELS * BOSS_TIERS.length;

/** 레벨의 보스 체력 기준 층 */
export function arenaFloor(level: number): number {
  return arenaFinal(level) ? LAST_FLOOR : STAGE_FLOOR[Math.floor((level - 1) / R.STAGE_LEVELS)]!;
}

/** 승급전 레벨인지 (Lv4·8·12) */
export const arenaPromotion = (level: number) => !arenaFinal(level) && level % R.STAGE_LEVELS === 0;

/** 이 레벨의 보스방들 (방마다 함께 나오는 보스) */
function levelFights(s: RunState, level: number): BossKind[][] {
  const tier = [...BOSS_TIERS[Math.floor((level - 1) / R.STAGE_LEVELS)]!];
  const rng = createRng(deriveSeed(s.seed, "arena", level));
  for (let i = tier.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [tier[i], tier[j]] = [tier[j]!, tier[i]!];
  }
  if (arenaPromotion(level)) return tier.map((b) => [b]);
  return [tier.slice(0, ((level - 1) % R.STAGE_LEVELS) + 1)];
}

/** 이 레벨 지도: 보상 방(시작) → 보스방 (승급전은 보스방이 한 줄로 이어짐 · 최종은 출구마다 남은 최종 보스) */
export function arenaMap(s: RunState): FloorMap {
  const level = s.arenaLv ?? 1;
  const rooms: RoomInfo[] = [];
  const add = (type: RoomType, layer: number, lane: number): RoomInfo => {
    const r: RoomInfo = { id: rooms.length, layer, lane, type, exits: Array<number>(LANES).fill(-1), shape: PLAIN_SHAPE };
    rooms.push(r);
    return r;
  };
  const start = add("start", 0, 1);
  const bosses: BossKind[][] = [[]];
  if (arenaFinal(level)) {
    const left = LAST_BOSSES.filter((b) => !(s.arenaDone ?? []).includes(b));
    left.forEach((b, i) => {
      const lane = FINAL_LANES[left.length]![i]!;
      start.exits[lane] = add("exit", 1, lane).id;
      bosses.push([b]);
    });
  } else {
    const fights = levelFights(s, level);
    let prev = start;
    fights.forEach((f, i) => {
      const r = add(i === fights.length - 1 ? "exit" : "elite", i + 1, 1);
      prev.exits[1] = r.id;
      prev = r;
      bosses.push(f);
    });
  }
  s.arenaRooms = bosses;
  return { floor: s.floor, rooms, startId: 0, exitId: rooms.length - 1, layers: rooms.length };
}

/** 아레나 방에 들어갈 때 처음 한 번: 보상 방은 체력을 다 채우고 보상을 놓음, 보스방은 보스 (태초의 빛은 어둠과 함께) */
export function arenaEnemies(s: RunState, roomId: number): EnemyState[] {
  const kinds = s.arenaRooms?.[roomId] ?? [];
  if (kinds.length === 0) {
    s.player.hp = s.player.stats.maxHp;
    arenaRewards(s, roomId);
    return [];
  }
  return kinds.flatMap((k) => (k === "plight" ? [spawnBoss(s, "plight"), spawnBoss(s, "pdark")] : [spawnBoss(s, k)]));
}

/** 이 방이 최종 보스용 아주 큰 방인지 · 태초의 빛과 어둠 방인지 */
export function arenaBig(s: RunState, roomId: number): boolean {
  return s.arenaLv !== undefined && arenaFinal(s.arenaLv) && (s.arenaRooms?.[roomId]?.length ?? 0) > 0;
}
export const arenaPrimeval = (s: RunState, roomId: number) => s.arenaRooms?.[roomId]?.[0] === "plight";

/** 보상: 이 캐릭터 무기 전부(마음껏 바꿈) · 패시브 3개 중 1 · 사용 아이템 3개 중 2 */
function arenaRewards(s: RunState, roomId: number): void {
  const rng = createRng(deriveSeed(s.seed, "arena", s.arenaLv ?? 1, "reward"));
  const weapons = weaponPool(s, true);
  const perRow = Math.ceil(weapons.length / 2);
  weapons.forEach((id, i) => {
    const row = Math.floor(i / perRow);
    const n = row === 0 ? perRow : weapons.length - perRow;
    addPickup(s, roomId, "weapon", id, CX + ((i % perRow) - (n - 1) / 2) * 22, CY - 38 + row * 16);
  });
  pickDistinct(rng, passivePool(s), 3).forEach((id, i) => addPickup(s, roomId, "passive", id, CX - 28 + i * 28, CY + 2, R.PASSIVE_GROUP));
  pickDistinct(rng, usePool(s), 3).forEach((id, i) => addPickup(s, roomId, "use", id, CX - 28 + i * 28, CY + 22, ARENA_USE_GROUP));
  s.arenaPicks = 0;
}

/** 보상 사용 아이템을 가짐: 두 개를 가지면 남은 것은 사라짐 (칸이 차서 바꾼 아이템은 묶음에서 빠짐) */
export function arenaUsePick(s: RunState, pk: Pickup, swapped: boolean): void {
  // 레이드 무장실은 사라지지 않음 (언제든 바꿔 고름, sim/raid)
  if (s.raidBoss) return;
  const n = (s.arenaPicks = (s.arenaPicks ?? 0) + 1);
  if (swapped) pk.group = 0;
  if (n >= R.USE_PICKS) {
    const room = s.rooms[s.roomId]!;
    room.pickups = room.pickups.filter((x) => x.group !== ARENA_USE_GROUP || x.owner !== pk.owner);
  }
}

/** 레벨의 마지막 보스방 계단: 다음 레벨로 (최종 보스는 잡은 보스를 기록). 모두 깨면 완료 */
export function arenaNext(s: RunState, startLevel: (s: RunState, floor: number) => void): void {
  const level = s.arenaLv ?? 1;
  if (arenaFinal(level)) {
    const boss = s.arenaRooms?.[s.roomId]?.[0];
    if (boss) s.arenaDone = [...(s.arenaDone ?? []), boss];
  }
  if (level >= ARENA_LEVELS) {
    s.won = true;
    s.over = true;
    return;
  }
  s.arenaLv = level + 1;
  startLevel(s, arenaFloor(level + 1));
}

/** 기록할 레벨: 깬 레벨 수 */
export function arenaCleared(s: RunState): number {
  return s.won ? ARENA_LEVELS : (s.arenaLv ?? 1) - 1;
}
