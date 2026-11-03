// 방·층 이동: 방 들어가기(적 배치), 출구 잠김·억지로 나가기, 쉼터, 계단
import { eliteWave, spawnEnemies } from "./roomSpawn";
export { spawnEnemies } from "./roomSpawn";
import { introRooms } from "./intro";
import { PERKS } from "../perks";
import { COOP_ROOM, ROOM_CX as CX, ROOM_CY as CY, setRoomSize } from "../constants";
import { bossForFloor, type BossKind } from "../content";
import { FLOOR_COUNT, generateFloor, LANES, LAST_FLOOR, lastFloorMap } from "./floor";
import { spawnBoss } from "./bosses";
import { makeTerrain } from "./terrain";
import { healPlayer } from "./combat";
import { onRoomCleared, spawnBlessing, spawnGolden, spawnTreasure } from "./loot";
import { roomLocked, spawnSpecialRoom } from "./specialRooms";
import { makeArena } from "./bossPrimeval";
import { arenaBig, arenaEnemies, arenaMap, arenaNext, arenaPrimeval } from "./arena";
import { devilPact, spawnShop } from "./shop";
import { endlessBosses, endlessPrimeval, endlessSize } from "./endless";
import { heroBosses, heroNext, heroPair, lastFloorOf } from "./hero";
import { eachSeat, placeParty } from "./party";
import { tabooDown, tabooN, tabooSum } from "./taboo";
import type { RunState, TickInput } from "./types";
import { meetPilgrim, pilgrimRoom } from "./pilgrim";
import { luxRoom } from "./luxFoes";
import { skipTrials } from "./trialRun";
import { hiddenAt, pickHidden, startHidden } from "./hiddenTrial";
import { terraBoss } from "./hiddenDice";
import { DOOR_HALF, EXIT_X, FLEE_COST, hasPerk, PLAYER_RADIUS, ROOM_MAX_Y, ROOM_MIN_Y } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 계단에 닿았다고 보는 거리 */
  STAIRS_REACH: 12,
  /** 보스방에 들어온 뒤 보스가 첫 공격을 준비하기까지 최소 틱 (1.5초) */
  BOSS_ENTRY_DELAY: 90,
  /** 보스가 여럿일 때 사이 거리 */
  BOSS_SPREAD: 64,
};
export { R as ROOMS_RULES };
/** 보스 시작 자리 (방 위쪽 가운데) */
const BOSS_START_Y = ROOM_MIN_Y + 20;
/** 쉼터에 처음 들어가면 회복하는 체력 (최대 체력 비율) */
export const REST_HEAL = 0.3;
/** 라스트 보스방 크기 (칸 수, 보통 방 21×13보다 큼 · 화면이 플레이어를 따라감) */
export const BIG_COLS = 29, BIG_ROWS = 17;

/** 이 판의 지금 방 크기로 맞춤 (게임 계산·그리기 전에) */
export function applyRoom(s: RunState): void {
  // 로그 던전 방은 옆·아래 벽이 얇음 (패왕전·광야의 새벽·타워 디펜스 경기장은 그대로)
  const thin = !s.pvp && !s.pw && !s.swarm && !s.fixedStats;
  // 협동 3~5명: 보통 방 대신 큰 방 (방 모양 틀·출구는 가운데로)
  if (s.big && s.roomCols === undefined) setRoomSize(COOP_ROOM.cols, COOP_ROOM.rows, true, thin);
  else if (s.roomCols === undefined) setRoomSize(undefined, undefined, true, thin);
  else setRoomSize(s.roomCols, s.roomRows, false, thin);
}

/** 6층을 깬 뒤 라스트 보스에 도전: 7층으로 (지도는 floor.lastFloorMap) */
export function continueToLastFloor(s: RunState, boss: BossKind): void {
  s.lastBoss = boss;
  s.over = false;
  startFloor(s, LAST_FLOOR);
}

/** 층 시작: 지도 만들고 시작 방으로 */
export function startFloor(s: RunState, floor: number): void {
  s.floor = floor;
  s.map = s.arenaLv ? arenaMap(s) : s.lastBoss && floor === lastFloorOf(s) ? lastFloorMap(devilPact(s)) : generateFloor(s.seed, floor, s.customRooms);
  s.rooms = s.map.rooms.map(() => ({ visited: false, cleared: false, pickups: [], enemies: null }));
  skipTrials(s);
  pickHidden(s);
  introRooms(s);
  s.enemies = [];
  s.projectiles = [];
  s.prompt = { kind: "none" };
  s.floorLog.push({ floor, tick: s.tick, hp: Math.ceil(s.player.hp), gold: s.gold });
  applyRoom(s); // 방 크기(얇은 벽)를 이 판 기준으로 먼저 (다른 판이 남긴 크기로 자리를 정하지 않게)
  placeParty(s, ROOM_MAX_Y - PLAYER_RADIUS - 10, false);
  enterRoom(s, s.map.startId);
}

function enterRoom(s: RunState, roomId: number): void {
  s.roomId = roomId;
  // 라스트 보스방은 아주 큼 (나머지는 보통 방)
  const exit = s.map.rooms[roomId]!.type === "exit";
  // 무한 모드 11층부터: 보스방이 큰 방 (17층부터 그 2배, sim/endless)
  const grow = exit ? endlessSize(s) : null;
  const big = (s.lastBoss !== undefined && exit) || arenaBig(s, roomId) || !!grow;
  s.roomCols = grow?.cols ?? (big ? BIG_COLS : undefined);
  s.roomRows = grow?.rows ?? (big ? BIG_ROWS : undefined);
  applyRoom(s);
  // 태초의 빛과 어둠: 큰 방에 상자 벽 6개
  s.arena = big && (s.lastBoss === "plight" || arenaPrimeval(s, roomId) || (exit && endlessPrimeval(s))) ? makeArena(s) : undefined;
  s.projectiles = [];
  const info = s.map.rooms[roomId]!;
  const st = s.rooms[roomId]!;
  st.visited = true;
  s.pendingBlasts = [];
  s.hazards = [];
  // 층 보스에 맞는 지형 (진흙·용암·물·가시 함정)
  s.terrain = makeTerrain(s, roomId, terraBoss(s));
  eachSeat(s, () => {
    s.roomDamaged = false;
    if (s.devices) s.devices = [];
    // 바닥에 남는 사멸 독연기·라이더 불꽃 자국은 방을 옮기면 사라짐
    delete s.player.smGas;
    delete s.player.rdFire;
    // 금기: 피의 통행료 (방에 들어갈 때마다 체력, 1 아래로는 안 내려감)
    if (tabooN(s, "bloodToll") > 0) s.player.hp = Math.max(1, s.player.hp - tabooSum(s, "bloodToll"));
    // 마력 방패: 방에 들어갈 때마다 2초 동안 피해 없음
    if (hasPerk(s.player, "arcaneShield")) s.player.shieldTicks = Math.max(s.player.shieldTicks, PERKS.arcaneShield.ticks);
  });
  if (st.enemies === null) {
    st.enemies = s.arenaLv
      ? arenaEnemies(s, roomId)
      : info.type === "combat" || info.type === "elite"
        ? roomId === pilgrimRoom(s) ? [] : hiddenAt(s, roomId) ? startHidden(s) : luxRoom(s, roomId, spawnEnemies(s, roomId, info.type === "elite"))
        : info.type === "exit"
          ? s.lastBoss === "plight"
            ? [spawnBoss(s, "plight"), spawnBoss(s, "pdark")]
            : s.hero && !s.lastBoss
              ? heroPair(heroBosses(s).map((b) => spawnBoss(s, b)))
              : (endlessBosses(s) ?? [spawnBoss(s, s.lastBoss ?? terraBoss(s) ?? bossForFloor(s.floor, s.seed))])
          : [];
    // 협동: 방 물건·쉼터 회복은 사람마다
    eachSeat(s, () => {
      if (info.type === "treasure") spawnTreasure(s, roomId);
      else spawnSpecialRoom(s, info.type, roomId);
      if (info.type === "shop") spawnShop(s, roomId);
      if (info.type === "golden") spawnGolden(s, roomId);
      if (info.type === "start" && s.lastBoss && s.floor === lastFloorOf(s)) spawnBlessing(s, roomId);
      // 큰 보스방(7층·영웅의 길·무한 11층~) 처음 들어가면 체력 가득
      if (exit && big && !s.arenaLv) s.player.hp = s.player.stats.maxHp;
      if (info.type === "rest") healPlayer(s, s.player.stats.maxHp * REST_HEAL * tabooDown(s, "dryWell"));
    });
    // 레이드 시간은 라스트 보스방에 처음 들어간 때부터
    if (big) s.raidStart = s.tick;
    // 히든 상점: 빈 방에 차원의 순례자 (sim/pilgrim)
    if (roomId === pilgrimRoom(s)) meetPilgrim(s, roomId);
  }
  // 방 안에서는 s.enemies만 (같은 배열을 나눠 쓰면 JSON으로 옮긴 뒤 달라짐)
  [s.enemies, st.enemies] = [st.enemies, []];
  st.cleared = s.enemies.length === 0;
  if ((info.type === "exit" || (s.arenaLv && info.type === "elite")) && !st.cleared) placeBossFight(s);
}

/** 보스방 입장: 플레이어는 아래쪽 가운데, 보스는 위쪽 가운데에서 시작 (들어오자마자 맞지 않게) */
function placeBossFight(s: RunState): void {
  placeParty(s, ROOM_MAX_Y - PLAYER_RADIUS - 16);
  // 다시 들어온 경우: 불러낸 졸개는 치우고 보스는 처음 자리·걷기 상태로
  s.enemies = s.enemies.filter((e) => !e.noGold);
  s.enemies.forEach((e, i) => {
    // 보스가 여럿이면 (태초의 빛과 어둠 · 레이드 아레나) 나란히
    e.x = e.prevX = CX + (i - (s.enemies.length - 1) / 2) * R.BOSS_SPREAD;
    e.y = e.prevY = BOSS_START_Y;
    e.phase = "walk";
    e.timer = Math.max(e.timer, R.BOSS_ENTRY_DELAY);
  });
}

/** 플레이어가 닿아 있는 출구 줄 (위쪽 벽에 붙어 있고 출구 구멍 안), 없으면 -1 */
export function touchingExit(s: RunState): number {
  const p = s.player;
  const exits = s.map.rooms[s.roomId]!.exits;
  if (p.y > ROOM_MIN_Y + p.r + 0.01) return -1;
  for (let lane = 0; lane < LANES; lane++) {
    if ((exits[lane] ?? -1) >= 0 && Math.abs(p.x - EXIT_X[lane]!) <= DOOR_HALF) return lane;
  }
  return -1;
}

/** 출구로 다음 방에 감: 다음 방 아래쪽 가운데에서 시작 */
export function goThrough(s: RunState, lane: number): void {
  const next = s.map.rooms[s.roomId]!.exits[lane]!;
  s.rooms[s.roomId]!.enemies = s.enemies;
  placeParty(s, ROOM_MAX_Y - PLAYER_RADIUS - 10);
  enterRoom(s, next);
}

/** 포탈건: 이 층의 다른 방으로 바로 감 (아래쪽 가운데에서 시작) */
export function warpRoom(s: RunState, roomId: number): void {
  s.rooms[s.roomId]!.enemies = s.enemies;
  placeParty(s, ROOM_MAX_Y - PLAYER_RADIUS - 10);
  enterRoom(s, roomId);
}

/** 적을 다 잡았으면 방 정리 (보상은 사람마다) */
export function checkCleared(s: RunState): void {
  const st = s.rooms[s.roomId]!;
  if (!st.cleared && s.enemies.length === 0 && !roomLocked(s) && !eliteWave(s)) {
    st.cleared = true;
    eachSeat(s, () => onRoomCleared(s, s.roomId));
    if (s.lastBoss && s.raidStart !== undefined && s.map.rooms[s.roomId]!.type === "exit") s.raidTicks = s.tick - s.raidStart;
  }
}

/** 계단 위에 서 있는지 (마지막 방을 정리한 뒤) */
export function onStairs(s: RunState): boolean {
  if (s.map.rooms[s.roomId]!.type !== "exit" || !s.rooms[s.roomId]!.cleared) return false;
  const dx = s.player.x - CX;
  const dy = s.player.y - CY;
  return dx * dx + dy * dy <= R.STAIRS_REACH * R.STAIRS_REACH;
}

/** 계단으로 다음 층 (마지막 층이면 클리어) */
export function climb(s: RunState): void {
  if (s.arenaLv) arenaNext(s, startFloor);
  else if (s.hero) heroNext(s, startFloor);
  else if (s.floor >= FLOOR_COUNT && !s.endless) {
    s.won = true;
    s.over = true;
  } else {
    startFloor(s, s.floor + 1);
  }
}

/** 플레이어가 움직인 뒤: 방 정리 여부, 문·계단 처리 */
export function updateRoom(s: RunState, input: TickInput): void {
  const st = s.rooms[s.roomId]!;
  checkCleared(s);
  s.prompt = { kind: "none" };

  const p = s.player;
  const lane = touchingExit(s);
  if (lane >= 0) {
    const pushing = input.moveY < 0;
    if (st.cleared) {
      if (pushing || p.dashTicks > 0) goThrough(s, lane);
      return;
    }
    // 잠긴 출구: 최대 체력의 20%를 내고 나감 (모자라면 불가, 서든데스는 불가)
    if (s.sudden || s.arenaLv || roomLocked(s)) return;
    const cost = Math.ceil(p.stats.maxHp * (FLEE_COST + tabooSum(s, "fleeCost")));
    s.prompt = { kind: "flee", lane, cost };
    if (input.interact && p.hp > cost) {
      p.hp -= cost;
      goThrough(s, lane);
    }
    return;
  }

  if (onStairs(s)) {
    s.prompt = { kind: "stairs" };
    if (input.interact) climb(s);
  }
}
