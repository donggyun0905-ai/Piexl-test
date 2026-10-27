// 게임 계산 (화면·서버 공용). 1틱 = 1/60초 고정 간격.
// 같은 시드 + 같은 입력 기록이면 어디서 계산해도 같은 결과가 나와야 한다 (일일 도전 다시 돌리기 검증).
// - 랜덤은 시드로만 (Math.random 금지). 용도별 시드는 deriveSeed로 나눔
// - 게임 결과에 영향을 주는 계산에는 Math.sin·cos·atan2·pow 등을 쓰지 않음 (사칙연산·sqrt만)
//
// 파일: types(입력·상태) · util(수치·도우미) · run(시작·한 틱 진행) · floor(층 지도) · rooms(방 이동·문·계단) · items(아이템 줍기·바꾸기·사용) · player · enemies · projectiles · combat(피해) · laser·laserGear(기계공학자 레이저·장치)
import { endlessTick } from "./endless";
import { PERKS } from "../perks";
import { petRevive } from "./lobbyPet";
import { artifacterRevive } from "./artifacter";
import { slayerSave } from "./slayer";
import { ROOM_COLS, ROOM_ROWS, TILE_SIZE } from "../constants";
import { baseStats, CHARACTERS, type CharacterId } from "../content";
import { computeStats } from "../stats";
import { updateEnemies } from "./enemies";
import { withDecoy } from "./remnant";
import { ultBusy } from "./bossKit";
import { updatePlayer } from "./player";
import { updateLaserGear } from "./laserGear";
import { updateOrbit } from "./orbit";
import { updateMedicGear } from "./medicGear";
import { updateDelayed } from "./combat";
import { updateHazards } from "./hazards";
import { updateProjectiles } from "./projectiles";
import { updateCharms } from "./talisman";
import type { PlayerState, RunState, TickInput } from "./types";
import type { TabooSet } from "../taboo";
import { recalcStats, updateItems } from "./items";
import { applyRoom, startFloor, updateRoom } from "./rooms";
import { arenaFloor } from "./arena";
import { giveRandomKit } from "./randomKit";
import { eachSeat } from "./party";
import { addEffect, hasPerk, PLAYER_RADIUS } from "./util";
import { TITAN } from "../weaponsTitan";
import { extraTick } from "./baseStats";

// ───────── 시작 ─────────

/** 처음 상태의 플레이어 (시작 무기, (x, y)에 섬) */
export function newPlayer(characterId: CharacterId, x: number, y: number): PlayerState {
  const weaponId = CHARACTERS[characterId].startWeapon;
  const stats = computeStats(baseStats(characterId, weaponId), []);
  return {
    x,
    y,
    prevX: x,
    prevY: y,
    r: characterId === "titan" ? TITAN.radius : PLAYER_RADIUS,
    characterId,
    weaponId,
    passives: [],
    mods: [],
    stats,
    useSlots: [null, null],
    replaceSlot: 0,
    shieldTicks: 0,
    hp: stats.maxHp,
    faceX: 1,
    faceY: 0,
    attackCooldown: 0,
    dashTicks: 0,
    dashCooldown: 0,
    dashDirX: 1,
    dashDirY: 0,
    invulnTicks: 0,
    streak: 0,
    streakTicks: 0,
    stillTicks: 0,
    ambushTicks: 0,
    attackCount: 0,
    dashHitIds: [],
    hasteTicks: 0,
  };
}

/** unlocks: 해금된 업적 id (혼자 하기만, 일일 도전·배틀은 비워 둠). sudden: 서든데스 (일일 도전). endless: 무한 모드 (층 끝없이). arena: 레이드 아레나. hero: 영웅의 길. taboo: 금기의 서 (혼자 하기) */
export function createRun(seed: number, characterId: CharacterId, unlocks: readonly string[] = [], sudden = false, endless = false, arena = false, hero = false, taboo?: TabooSet, randomKit = false): RunState {
  const cx = (ROOM_COLS * TILE_SIZE) / 2;
  const cy = (ROOM_ROWS * TILE_SIZE) / 2;
  const run: RunState = {
    seed: seed >>> 0,
    tick: 0,
    player: newPlayer(characterId, cx, cy),
    enemies: [],
    projectiles: [],
    pendingBlasts: [],
    effects: [],
    nextId: 1,
    floor: 1,
    map: { floor: 1, rooms: [], startId: 0, exitId: 0, layers: 0 },
    roomId: 0,
    rooms: [],
    prompt: { kind: "none" },
    nearPickupId: 0,
    holdPickupId: 0,
    holdTicks: 0,
    kills: 0,
    bossKills: 0,
    gold: 0,
    goldEarned: 0,
    goldSpent: 0,
    purchases: 0,
    roomDamaged: false,
    flawlessBosses: 0,
    freezeTicks: 0,
    floorLog: [],
    buys: [],
    unlocks: [...unlocks],
    sudden,
    ...(endless ? { endless } : {}),
    ...(hero ? { hero } : {}),
    ...(arena ? { arenaLv: 1, arenaDone: [] } : {}),
    ...(taboo && Object.keys(taboo).length ? { taboo: { ...taboo } } : {}),
    autoTargetId: 0,
    over: false,
    won: false,
  };
  // 금기의 몸 변화 (최대 체력 등)는 처음부터
  if (run.taboo) {
    recalcStats(run);
    run.player.hp = run.player.stats.maxHp;
  }
  // 무작위 캐릭터: 직업 무기·패시브·사용 아이템 2개
  if (randomKit) giveRandomKit(run);
  startFloor(run, arena ? arenaFloor(1) : 1);
  return run;
}

// ───────── 한 틱 진행 ─────────

/** 한 틱 진행 (상태를 직접 바꿈) */
export function stepSim(s: RunState, input: TickInput): void {
  if (s.over) return;
  applyRoom(s);
  s.tick++;

  const p = s.player;
  p.prevX = p.x;
  p.prevY = p.y;
  for (const e of s.enemies) {
    e.prevX = e.x;
    e.prevY = e.y;
  }
  for (const pr of s.projectiles) {
    pr.prevX = pr.x;
    pr.prevY = pr.y;
  }

  stepPlayer(s, input);
  updateRoom(s, input);
  updateItems(s, input);
  if (s.over) return;
  stepWorld(s);
  // 무한 모드 AI 대결 (sim/endless)
  if (s.pw) endlessTick(s);
  if (checkDeath(s)) s.over = true;
}

/** 플레이어 한 사람: 움직임·공격·직업 장치 (협동은 자리마다) */
export function stepPlayer(s: RunState, input: TickInput): void {
  updatePlayer(s, input);
  extraTick(s);
  updateLaserGear(s);
  updateOrbit(s);
  updateMedicGear(s);
}

/** 플레이어 다음: 적·위험 표시·투사체·부적·폭발·효과 (협동도 같이 씀) */
export function stepWorld(s: RunState): void {
  // 얼음 시계: 적·적 탄이 멈춤 (라스트 보스 궁극기 동안은 멈추지 않음)
  const frozen = s.freezeTicks > 0 && !s.enemies.some(ultBusy);
  if (frozen) s.freezeTicks--;
  else {
    // 잔영 분신이 있으면 적은 분신을 쫓음
    withDecoy(s, () => updateEnemies(s));
    updateHazards(s);
  }
  updateProjectiles(s, frozen);
  eachSeat(s, () => updateCharms(s));
  updateDelayed(s);
  updateEffects(s);
}

/** 체력이 0 이하면 (되살아나는 아이템이 있으면 버팀) 쓰러짐: true */
export function checkDeath(s: RunState): boolean {
  const p = s.player;
  const dying = p.hp <= 0;
  if (p.hp <= 0 && !s.sudden && hasPerk(p, "secondWind")) {
    // 두 번째 숨: 한 번 되살아나고 아이템은 사라짐
    p.passives.splice(p.passives.indexOf("secondWind"), 1);
    recalcStats(s);
    p.hp = Math.ceil(p.stats.maxHp * PERKS.secondWind.hp);
    p.invulnTicks = 120;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 16 });
  }
  // 아홉 목숨(야수): 층마다 한 번 체력 1로 버팀
  // 여신의 축복: 한 번 체력 50%로 되살아남 (아이템은 남아 대시·이동 속도 효과는 그대로)
  if (p.hp <= 0 && !s.sudden && hasPerk(p, "goddessBlessing") && !p.blessUsed) {
    p.blessUsed = true;
    p.hp = Math.ceil(p.stats.maxHp * 0.5);
    p.invulnTicks = 120;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 20, maxTicks: 20 });
  }
  // 아홉 목숨: 광야의 새벽은 층(세기 단계)이 자주 바뀌어 한 판에 한 번만
  if (p.hp <= 0 && !s.sudden && hasPerk(p, "nineLives") && p.livesFloor !== s.floor && !(s.swarm && p.livesFloor !== undefined)) {
    p.livesFloor = s.floor;
    p.hp = 1;
    p.invulnTicks = 120;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 16 });
  }
  // 불사조(로비 펫): 한 판에 한 번
  slayerSave(s);
  if (p.hp <= 0) petRevive(s);
  artifacterRevive(s);
  if (p.hp > 0) {
    // 한 번 되살아남 (오니 무기 조건)
    if (dying) p.revived = true;
    return false;
  }
  p.hp = 0;
  return true;
}

export function updateEffects(s: RunState): void {
  for (const fx of s.effects) fx.ticks--;
  s.effects = s.effects.filter((fx) => fx.ticks > 0);
}
