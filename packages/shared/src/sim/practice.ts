// 연습장: 문 없는 방 하나에서 아이템을 마음대로 가져 보고 적을 불러 시험함 (기록·업적 없음)
import { ROOM_CX, ROOM_HEIGHT, ROOM_MAX_Y, ROOM_MIN_Y, ROOM_WIDTH } from "../constants";
import { CHARACTERS, ENEMIES, LAST_BOSSES, S2_LAST_BOSSES, type CharacterId, type EnemyKind, type WeaponId } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId, type UseItemId } from "../items";
import { resetCombo } from "./brawl";
import { resetGeneral } from "./general";
import { resetImugi } from "./imugi";
import { resetApostle } from "./apostle";
import { resetStar } from "./star";
import { resetDuck } from "./duck";
import { resetScribe } from "./scribe";
import { resetIdra } from "./idra";
import { resetMorph } from "./morph";
import { resetFly } from "./fly";
import { resetElder } from "./elder";
import { resetPlague } from "./plague";
import { resetSlayer } from "./slayer";
import { resetEater } from "./eater";
import { resetMukin } from "./mukin";
import { resetSamyeol } from "./samyeol";
import { resetAutomata } from "./automata";
import { resetRider } from "./rider";
import { resetBomber } from "./bomber";
import { resetArtifacter } from "./artifacter";
import { resetPunk } from "./punk";
import { resetTracker } from "./tracker";
import { resetForgotten } from "./forgotten";
import { resetRemnant } from "./remnant";
import { resetWanderer } from "./wanderer";
import { resetSilk } from "./silk";
import { resetCollector } from "./collector";
import { resetMiner } from "./miner";
import { resetVoyager } from "./voyager";
import { resetZeus } from "./zeus";
import { resetPilgrim } from "./pgHero";
import { resetFallenKing } from "./fallenKing";
import { resetLux } from "./lux";
import { resetRen } from "./ren";
import { resetSpirit } from "./spirit";
import { resetAbandoned } from "./abandoned";
import { resetTitan } from "./titan";
import { resetOni } from "./oni";
import { resetGun } from "./gun";
import { recalcStats } from "./items";
import { SWARM } from "./minions";
import { createRun } from "./run";
import type { RunState } from "./types";
import { keepInRoom, makeEnemy } from "./util";
import { applyRoom, BIG_COLS, BIG_ROWS } from "./rooms";
import { makeArena } from "./bossPrimeval";
import { bossHpMul } from "./bosses";
import { depth } from "./hero";
import { practiceRoomOff } from "./practiceRoom";

export type PracticeItem =
  | { kind: "weapon"; id: WeaponId }
  | { kind: "passive"; id: PassiveId }
  | { kind: "use"; id: UseItemId };

/** 연습장 시작: 출구가 모두 막힌 시작 방 하나 */
export function createPracticeRun(characterId: CharacterId): RunState {
  const s = createRun(1, characterId);
  const room = s.map.rooms[s.map.startId]!;
  room.exits = room.exits.map(() => -1);
  // 허수아비 아래에서 시작 (보통 판은 아래쪽 벽 옆)
  s.player.y = s.player.prevY = ROOM_HEIGHT / 2 + 48;
  placeDummy(s);
  return s;
}

/** 허수아비 자리: 방 한가운데 (맞아도 쓰러지지 않을 만큼 단단하고, 밀려도 이 자리로 돌아옴 · sim/enemies) */
export const DUMMY_AT = () => ({ x: ROOM_CX, y: ROOM_HEIGHT / 2 });

function placeDummy(s: RunState): void {
  const at = DUMMY_AT();
  const e = makeEnemy(s, "dummy", at.x, at.y, 1, 0);
  e.anchor = [at.x, at.y];
  s.enemies.push(e);
}

/** 허수아비 켜기/끄기. 바뀐 뒤 켜져 있는지를 돌려줌 */
export function practiceToggleDummy(s: RunState): boolean {
  const on = s.enemies.some((e) => e.kind === "dummy");
  if (on) s.enemies = s.enemies.filter((e) => e.kind !== "dummy");
  else placeDummy(s);
  s.rooms[s.roomId]!.enemies = s.enemies;
  return !on;
}

/** 연습장 세기: 이 층의 적처럼 (체력·보스 공격력이 층에 따라 커짐, 7 = 라스트 보스 층) */
export function practiceSetFloor(s: RunState, floor: number): void {
  s.floor = Math.max(1, Math.min(7, Math.round(floor)));
}

/** 여러 번 가질 수 있는 패시브인지 (공격 방식을 바꾸는 효과 아이템은 한 번만) */
export function practiceCanStack(id: PassiveId): boolean {
  const def: PassiveDef = PASSIVES[id];
  return !def.effect;
}

/** 아이템 가지기: 무기는 바꾸고, 패시브는 하나 더 얻고, 사용 아이템은 빈 칸(없으면 먼저 얻은 칸)에 넣음 */
export function practiceGive(s: RunState, item: PracticeItem): void {
  const p = s.player;
  if (item.kind === "weapon") {
    p.weaponId = item.id;
    p.attackCooldown = 0;
    recalcStats(s);
  } else if (item.kind === "passive") {
    // 공격 방식 아이템은 한 판에 하나만
    const def: PassiveDef = PASSIVES[item.id];
    if (def.effect && p.passives.includes(item.id)) return;
    p.passives.push(item.id);
    recalcStats(s);
  } else {
    const empty = p.useSlots.indexOf(null);
    const slot = empty >= 0 ? empty : p.replaceSlot;
    p.useSlots[slot] = item.id;
    p.replaceSlot = (slot + 1) % p.useSlots.length;
  }
}

/** 가진 패시브 하나 빼기 (같은 것이 여러 개면 하나만) */
export function practiceRemovePassive(s: RunState, id: PassiveId): void {
  const i = s.player.passives.lastIndexOf(id);
  if (i < 0) return;
  s.player.passives.splice(i, 1);
  recalcStats(s);
}

/** 사용 아이템 하나 빼기 (뒤쪽 칸부터) */
export function practiceRemoveUse(s: RunState, id: UseItemId): void {
  const i = s.player.useSlots.lastIndexOf(id);
  if (i >= 0) s.player.useSlots[i] = null;
}

/** 적 부르기: 플레이어 앞(바라보는 쪽)에 놓되 방 밖으로 나가지 않게 */
export function practiceSpawn(s: RunState, kind: EnemyKind): void {
  const p = s.player;
  // 라스트 보스: 실제와 같은 큰 방에서 (태초의 빛과 어둠은 상자 벽 방에 둘이 같이)
  if ([...LAST_BOSSES, ...S2_LAST_BOSSES].includes(kind as never) || kind === "pdark") {
    practiceClearEnemies(s);
    s.roomCols = BIG_COLS;
    s.roomRows = BIG_ROWS;
    applyRoom(s);
    if (kind === "plight" || kind === "pdark") s.arena = makeArena(s);
    p.x = p.prevX = ROOM_CX;
    p.y = p.prevY = ROOM_MAX_Y - p.r - 16;
    const pair = kind === "plight" || kind === "pdark" ? (["plight", "pdark"] as const) : [kind];
    pair.forEach((k, i) => s.enemies.push(makeEnemy(s, k, ROOM_CX + (pair.length > 1 ? (i === 0 ? -40 : 40) : 0), ROOM_MIN_Y + 30, bossHpMul(depth(s)), 90)));
    s.rooms[s.roomId]!.enemies = s.enemies;
    return;
  }
  const away = ENEMIES[kind].radius + 36;
  let x = p.x + p.faceX * away;
  let y = p.y + p.faceY * away;
  if (x < 40 || x > ROOM_WIDTH - 40) x = p.x - p.faceX * away;
  if (y < 40 || y > ROOM_HEIGHT - 40) y = p.y - p.faceY * away;
  // 세기(층)에 맞는 체력: 실제 판과 같은 배율 (rooms.spawnEnemies · bosses.spawnBoss)
  const hpMul = ENEMIES[kind].boss ? bossHpMul(depth(s)) : 1 + 0.15 * (depth(s) - 1);
  for (const [ox, oy] of kind === "gnat" ? SWARM : [[0, 0] as const]) s.enemies.push(makeEnemy(s, kind, x + ox, y + oy, hpMul, 60));
}

/** 적·탄 치우기 (허수아비는 남김) */
export function practiceClearEnemies(s: RunState): void {
  // 큰 방(라스트 보스 연습)이었으면 보통 방으로
  if (s.roomCols !== undefined) {
    s.roomCols = s.roomRows = s.arena = undefined;
    applyRoom(s);
    keepInRoom(s.player);
  }
  s.enemies = s.enemies.filter((e) => e.kind === "dummy");
  s.rooms[s.roomId]!.enemies = s.enemies;
  s.projectiles = [];
  s.pendingBlasts = [];
  s.hazards = [];
  s.devices = [];
  s.freezeTicks = 0;
}

/** 초기화: 적·탄을 치우고, 가진 것을 처음 상태(캐릭터 시작 무기, 빈 칸)로 되돌림, 체력 가득 */
export function practiceReset(s: RunState): void {
  const p = s.player;
  practiceClearEnemies(s);
  for (const e of s.enemies) {
    e.hp = e.maxHp;
    e.heat = e.melt = e.stunTicks = e.slowTicks = e.fearTicks = e.rootTicks = e.bleedTicks = e.poisonTicks = e.burnTicks = 0;
  }
  s.effects = [];
  p.weaponId = CHARACTERS[p.characterId].startWeapon;
  p.passives = [];
  p.useSlots = [null, null];
  p.replaceSlot = 0;
  p.shieldTicks = 0;
  p.invulnTicks = 0;
  p.attackCooldown = 0;
  p.dashTicks = 0;
  p.dashCooldown = 0;
  p.streak = p.streakTicks = p.stillTicks = p.ambushTicks = p.attackCount = p.hasteTicks = 0;
  p.loaded = p.reloadTicks = p.handTicks = p.handId = p.rushTicks = p.flyers = undefined;
  resetCombo(p);
  resetGun(p);
  p.support = p.gunsOwned = p.pets = p.shades = p.echoes = p.foresights = p.summons = p.summonCharge = p.lv = p.exp = p.points = p.alloc = undefined;
  p.ck = p.ckHeld = p.ckSpun = p.ckThrows = p.dashCharges = p.vortex = p.dance = p.ghosts = undefined;
  resetGeneral(p);
  resetImugi(p);
  resetApostle(p);
  resetStar(p);
  resetDuck(p);
  resetScribe(p);
  resetIdra(p);
  resetMorph(p);
  resetFly(p);
  resetElder(p);
  resetPlague(p);
  resetSlayer(p);
  resetEater(p);
  resetMukin(p);
  resetSamyeol(p);
  resetAutomata(p);
  resetRider(p);
  resetBomber(p);
  resetArtifacter(p);
  resetPunk(p);
  resetTracker(p);
  resetForgotten(p);
  resetRemnant(p);
  resetWanderer(p);
  resetSilk(p);
  resetCollector(p);
  resetMiner(p);
  resetVoyager(p);
  resetZeus(p);
  resetPilgrim(p);
  resetFallenKing(p);
  resetLux(p);
  resetRen(p);
  resetSpirit(p);
  resetAbandoned(p);
  resetTitan(p);
  resetOni(p);
  p.kageTicks = 0;
  p.frenzyTicks = p.roarTicks = 0;
  p.livesFloor = p.tigerGauge = p.tigerTicks = p.lureTicks = p.lureId = p.netStun = p.darkStacks = p.darkTicks = undefined;
  p.netSeq = p.chains = undefined;
  p.chainTicks = p.mirrorTicks = p.blindTicks = p.parryTicks = undefined;
  p.parryOn = false;
  p.jamTicks = 0;
  p.dashHitIds = [];
  p.beamTicks = p.heat = p.boostTicks = p.overheatTicks = p.shieldPts = 0;
  p.gearTicks = undefined;
  p.leechTick = p.leechSum = p.fullTicks = p.gownTicks = p.antiStore = 0;
  p.tubeTargetId = undefined;
  p.mods = [];
  recalcStats(s);
  p.hp = p.stats.maxHp;
  practiceRoomOff(s);
  p.gym = undefined;
  s.kills = 0;
  s.gold = 0;
  p.x = p.prevX = ROOM_WIDTH / 2;
  p.y = p.prevY = ROOM_HEIGHT / 2;
  s.over = false;
}
