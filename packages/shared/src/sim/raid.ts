// 이벤트 '레이드' (5인 레이드 보스, 계획 docs/RAID_LUCIFER.md): 사람이 없는 자리는 AI가 채움 (늘 5명)
// 준비: 무장실(무기 하나·사용 아이템 2개) → 대장간(999원) → 성좌의 방(제단 8개 중 하나, 가운데 카드 증강을 대가 없이) → 단련의 방(포인트 30) → 레이드 방 → 보상 방
// 시작할 때 고른 캐릭터의 전용 패시브 전부 + 여신의 축복 (일반 패시브는 없음)
import { ALTAR_IDS, ALTARS } from "../altarDefs";
import { CHARACTER_IDS, type CharacterId } from "../content";
import { ROOM_CX as CX, ROOM_CY as CY } from "../constants";
import { PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, type PassiveDef, type PassiveId, type UseItemId } from "../items";
import { HIDDEN_USE_IDS } from "../itemsHidden";
import { createRng, deriveSeed, type Rng } from "../rng";
import { altarUsed, ALTAR_Y } from "./altar";
import { ARENA_USE_GROUP } from "./arena";
import { LANES, type FloorMap, type RoomInfo, type RoomType } from "./floor";
import { spawnForge } from "./forge";
import { GYM_STATS, gymBlocked } from "./gym";
import { equipWeapon, recalcStats } from "./items";
import { PLAIN_SHAPE } from "./layout";
import { addPickup, weaponPool } from "./loot";
import { spendStat } from "./novice";
import { lucCutting, spawnLucifer } from "./lucifer";
import { raidBotInput } from "./raidBot";
import { spawnChest } from "./raidReward";
import { allPlayers, eachSeat } from "./party";
import { createParty } from "./partyRun";
import { RAID_ROOM, type RaidEventBoss } from "./raidTypes";
import { startFloor } from "./rooms";
import { EMPTY_INPUT, type EnemyState, type Pickup, type RunState, type TickInput } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 레이드 인원 (빈자리는 AI) */
  SEATS: 5,
  /** 대장간에 쓸 돈 */
  GOLD: 999,
  /** 단련의 방 포인트 */
  GYM_PTS: 30,
  /** 무장실에서 고르는 사용 아이템 수 */
  USE_PICKS: 2,
  /** 레이드 방 크기 (칸): 라스트 보스 방(29×17)의 2배 */
  BOSS_COLS: 58,
  BOSS_ROWS: 34,
  /** 전용 패시브 기준 개수 · 모자란 하나마다 더 주는 단련 포인트 */
  PASSIVE_CAP: 30,
  PER_PASSIVE: 3,
  /** 풋내기(레벨로 크는 캐릭터)가 받는 레벨 (레벨마다 스탯 포인트 1) */
  NOVICE_LV: 30,
};
export { R as RAID_RULES };

export interface RaidMember {
  characterId: CharacterId;
  unlocks: readonly string[];
  ai?: boolean;
}

const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;

/** 이 캐릭터 전용 패시브 전부 (변희 동물 능력처럼 사냥으로만 얻는 것도 모두 · 그 동물을 들었을 때만 효과) */
export function raidOwnPassives(c: CharacterId): PassiveId[] {
  return PASSIVE_IDS.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === c);
}

/** 단련 포인트: 기본 30 + 전용 패시브가 30개보다 적으면 모자란 하나마다 3 (2026-11-09 사용자 요청) */
export function raidGymPts(c: CharacterId): number {
  return R.GYM_PTS + Math.max(0, R.PASSIVE_CAP - raidOwnPassives(c).length) * R.PER_PASSIVE;
}

/** 무장실에 놓는 사용 아이템 (히든·돈주머니 빼고 하나씩) */
export const raidUses = (): UseItemId[] => USE_ITEM_IDS.filter((id) => !HIDDEN_USE_IDS.includes(id) && id !== "moneyBag");

/** 레이드 시작: humans = 방에 있는 사람 (0번이 방장), 나머지 자리는 AI (캐릭터는 시드로 무작위) */
export function createRaid(seed: number, boss: RaidEventBoss, humans: readonly RaidMember[]): RunState {
  const rng = createRng(deriveSeed(seed, "raidRoster"));
  const members: RaidMember[] = humans.slice(0, R.SEATS);
  while (members.length < R.SEATS) members.push({ characterId: rng.pick(CHARACTER_IDS), unlocks: [], ai: true });
  const s = createParty(seed, members);
  s.raidBoss = { boss, ai: members.map((m) => !!m.ai) };
  s.big = true;
  // 진영 특징(게이지·창·알림)은 레이드에서 끔 (2026-11-09 사용자 요청: 방해됨)
  s.noFaction = true;
  eachSeat(s, (i) => {
    const p = s.player;
    p.passives = [...raidOwnPassives(p.characterId), "goddessBlessing"];
    p.useSlots = [null, null];
    s.gold = R.GOLD;
    if (p.characterId === "novice") noviceLevel(s, !!s.raidBoss!.ai[i]);
    if (s.raidBoss!.ai[i]) aiKit(s, createRng(deriveSeed(seed, "raidAi", i)));
    recalcStats(s);
    p.hp = p.stats.maxHp;
  });
  s.floorLog = [];
  startFloor(s, 1);
  return s;
}

/** 풋내기: 레벨을 주고 스탯 포인트를 찍게 함 (AI는 시드로 찍음) */
function noviceLevel(s: RunState, ai: boolean): void {
  const p = s.player;
  p.lv = R.NOVICE_LV;
  p.exp = 0;
  p.points = R.NOVICE_LV - 1;
  const rng = createRng(deriveSeed(s.seed, "raidNovice", s.seat ?? 0));
  if (ai) for (let n = p.points ?? 0; n > 0; n--) spendStat(s, rng.int(1, 9));
  recalcStats(s);
}

/** AI 준비: 무기·사용 아이템 2개·성좌 증강·단련 포인트를 시드로 정해 둠 (준비 방에서는 따라만 다님) */
function aiKit(s: RunState, rng: Rng): void {
  const p = s.player;
  const weapons = weaponPool(s, true);
  if (weapons.length > 0) equipWeapon(s, rng.pick(weapons));
  const uses = raidUses();
  p.useSlots = [rng.pick(uses), rng.pick(uses)];
  giveAugment(s, rng, rng.int(0, ALTAR_IDS.length - 1), RAID_ROOM.altar);
  const g = (p.gym = { pts: 0, lv: {} as Record<string, number>, rooms: [1000 + RAID_ROOM.gym] });
  const can = GYM_STATS.filter((k) => !gymBlocked(p, k));
  for (let n = raidGymPts(p.characterId); n > 0; n--) {
    const k = rng.pick(can);
    if ((g.lv[k] ?? 0) < 10) g.lv[k] = (g.lv[k] ?? 0) + 1;
  }
}

/** 성좌 증강을 대가 없이 (가운데 카드): 가진 패시브 하나에 그 성좌 기술 둘 */
function giveAugment(s: RunState, rng: Rng, idx: number, roomId: number): void {
  const p = s.player;
  const id = ALTAR_IDS[idx]!;
  const keep = p.passives[rng.int(0, p.passives.length - 1)]!;
  (p.augments ??= []).push({ passive: keep, skills: [...ALTARS[id].skills], alt: id });
  const a = (p.altar ??= { rooms: [] });
  a.rooms.push(s.floor * 1000 + roomId);
  a.last = { id, card: 1, tick: s.tick, keep, taken: [] };
  (a.got ??= []).push({ id, card: 1 });
  recalcStats(s);
}

/** 레이드 지도: 준비 방 넷 → 레이드 방 (한 줄로 이어짐) */
export function raidMap(s: RunState): FloorMap {
  const types: RoomType[] = ["start", "forge", "altar", "gym", "exit", "golden"];
  const rooms: RoomInfo[] = types.map((type, id) => ({ id, layer: id, lane: 1, type, exits: Array<number>(LANES).fill(-1), shape: PLAIN_SHAPE }));
  // 준비 방 넷은 가운데 출구로 다음 방 · 왼쪽 출구로 앞 방 (왔다 갔다, 레이드 방에서는 못 돌아감) · 보상 방은 루시퍼를 쓰러뜨리면 옮겨 감 (sim/raidReward)
  for (let i = 0; i < RAID_ROOM.boss; i++) rooms[i]!.exits[1] = i + 1;
  for (let i = 1; i < RAID_ROOM.boss; i++) rooms[i]!.exits[0] = i - 1;
  return { floor: s.floor, rooms, startId: 0, exitId: RAID_ROOM.boss, layers: rooms.length };
}

/** 레이드 방인지 (아주 큰 방) */
export const raidBossRoom = (s: RunState, roomId = s.roomId) => !!s.raidBoss && roomId === RAID_ROOM.boss;
export const raidBossSize = () => ({ cols: R.BOSS_COLS, rows: R.BOSS_ROWS });

/** 방에 처음 들어갈 때 적 (준비 방은 없음 · 레이드 방은 보스) */
export function raidEnemies(s: RunState, roomId: number): EnemyState[] {
  return roomId === RAID_ROOM.boss ? spawnLucifer(s) : roomId === RAID_ROOM.reward ? spawnChest(s) : [];
}

/** 방에 처음 들어갈 때 사람마다 물건 (rooms.enterRoom) */
export function raidSpawn(s: RunState, roomId: number): void {
  // 레이드 방: 사용 아이템 쿨타임을 처음으로 (sim/raidPrep)
  if (roomId === RAID_ROOM.boss) s.player.raidCd = [];
  // AI 준비는 시작 때 정해 둠 (바닥 물건 없음, 돌아다니기만 sim/raidBot)
  if (s.raidBoss?.ai[s.seat ?? 0]) return;
  if (roomId === RAID_ROOM.armory) {
    // 위: 이 캐릭터 무기 전부 (밟으면 바꿈) · 아래: 사용 아이템 하나씩 (두 칸, 밟으면 바꿈 · 사라지지 않음)
    const weapons = weaponPool(s, true);
    weapons.forEach((id, i) => addPickup(s, roomId, "weapon", id, CX + (i - (weapons.length - 1) / 2) * 22, CY - 34));
    const uses = raidUses();
    const perRow = Math.ceil(uses.length / 2);
    uses.forEach((id, i) => {
      const row = Math.floor(i / perRow);
      const n = row === 0 ? perRow : uses.length - perRow;
      addPickup(s, roomId, "use", id, CX + ((i % perRow) - (n - 1) / 2) * 22, CY + 4 + row * 20, ARENA_USE_GROUP);
    });
  } else if (roomId === RAID_ROOM.forge) spawnForge(s, roomId);
  else if (roomId === RAID_ROOM.altar) {
    // 제단 8개 (두 줄) · group = 성좌 차례 + 1
    ALTAR_IDS.forEach((_, i) => addPickup(s, roomId, "altar", "0", CX + ((i % 4) - 1.5) * 64, ALTAR_Y + 40 + Math.floor(i / 4) * 70, 0, 0));
    s.rooms[roomId]!.pickups.slice(-ALTAR_IDS.length).forEach((pk, i) => (pk.group = i + 1));
  } else if (roomId === RAID_ROOM.gym) {
    const p = s.player;
    const g = (p.gym ??= { pts: 0, lv: {}, rooms: [] });
    if (!g.rooms.includes(roomKey(s))) {
      g.pts += raidGymPts(p.characterId);
      g.rooms.push(roomKey(s));
    }
    addPickup(s, roomId, "gym", "0", CX, CY - 8, 0);
  }
}

/** 성좌의 방 제단 앞: F = 그 성좌 증강을 받음 (한 사람에 하나 · 다른 제단에서 F = 대가 없이 바꿈) */
export function raidAltarAt(s: RunState, pk: Pickup, interact: boolean): void {
  const idx = pk.group - 1;
  const last = s.player.altar?.last;
  if (pk.group < 1 || (altarUsed(s) && last?.id === ALTAR_IDS[idx])) return;
  s.prompt = { kind: "station", station: "altar", open: false };
  if (!interact) return;
  if (altarUsed(s) && last) dropAugment(s, last.id, last.keep);
  giveAugment(s, createRng(deriveSeed(s.seed, "raidAltar", s.seat ?? 0, idx)), idx, s.roomId);
  addEffect(s, { kind: "alChoose", x: pk.x, y: pk.y - 20, dirX: idx, dirY: 0, size: 80, maxTicks: 60, width: 1 });
}

/** 성좌 바꾸기: 앞서 받은 증강을 돌려놓음 */
function dropAugment(s: RunState, id: string, keep?: PassiveId): void {
  const p = s.player;
  const k = (p.augments ?? []).findIndex((a) => a.alt === id && a.passive === keep);
  if (k >= 0) p.augments!.splice(k, 1);
  p.altar!.got?.pop();
  p.altar!.rooms = p.altar!.rooms.filter((r) => r !== s.floor * 1000 + s.roomId);
  recalcStats(s);
}

/** 고른 성좌 (그리기: 제단 group) */
export const raidAltarOf = (pk: Pickup) => ALTAR_IDS[pk.group - 1];

/** 한 틱 입력: 사람 자리는 받은 입력, AI 자리는 AI가 정함 (sim/raidBot) · 컷신 동안은 모두 멈춤 */
export function raidInputs(s: RunState, inputs: readonly TickInput[]): TickInput[] {
  const ai = s.raidBoss?.ai ?? [];
  if (lucCutting(s)) return ai.map(() => EMPTY_INPUT);
  let k = 0;
  const out = ai.map((isAi) => (isAi ? EMPTY_INPUT : (inputs[k++] ?? EMPTY_INPUT)));
  eachSeat(s, (i) => {
    if (ai[i]) out[i] = raidBotInput(s);
  });
  return out;
}

/** 사람 자리만 (출구에 모이기·잠김 계산) */
export const raidHuman = (s: RunState, i: number) => !s.raidBoss?.ai[i];

/** 성좌의 방: 사람이 모두 성좌를 골라야 다음 방으로 나갈 수 있음 (앞 방으로는 언제든) */
export function raidLocked(s: RunState, lane = 1): boolean {
  if (!s.raidBoss || s.roomId !== RAID_ROOM.altar || lane === 0) return false;
  const key = s.floor * 1000 + RAID_ROOM.altar;
  return allPlayers(s).some((p, i) => raidHuman(s, i) && !p.altar?.rooms.includes(key));
}
