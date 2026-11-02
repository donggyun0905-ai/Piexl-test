// 타워 디펜스 (혼자 하기): 캐릭터를 타워처럼 세워 길로 오는 적·보스를 막음. 20라운드, 5라운드마다 보스, 20라운드는 최종 보스
// 판(RunState) 하나에 적·탄을 담고 기존 게임 계산을 그대로 씀. 시드로만 정해짐 (같은 시드·같은 조작이면 같은 결과)
// 파일: tdTypes(상태) · tdTowers(타워·레벨·공격) · tdWaves(적·길·보스 기술) · tdDefs·tdMaps(수치·맵)
import { TD_ROUNDS, TD_RULES, tdRoundGold } from "../tdDefs";
import { TD_COLS, TD_ROWS, tdMapDef, type TdMapId } from "../tdMaps";
import { updateDelayed } from "./combat";
import { updateBleed } from "./gunExtras";
import { decaySlow } from "./laserGear";
import { PLAIN_SHAPE } from "./layout";
import { applyRoom } from "./rooms";
import { createRun, newPlayer } from "./run";
import { updateSeals } from "./talisman";
import { hitTowers } from "./tdHealth";
import { updateTowers } from "./tdTowers";
import type { TdState } from "./tdTypes";
import { buildSpawns, hatch, isFinal, spawnFinal, spawnTd, updateTdEnemies } from "./tdWaves";
import type { EnemyKind } from "../content";
import type { EffectState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 최종 보스 라운드: 시작 뒤 첫 최종 보스가 나오는 틱 */
  FINAL_AT: 120,
};
export { R as TD_RULES };

export function createTd(seed: number, mapId: TdMapId): TdState {
  const run = createRun(seed, "warden");
  const idle = newPlayer("warden", -100, -100);
  run.player = idle;
  run.fixedStats = true;
  run.map = { floor: 1, rooms: [{ id: 0, layer: 0, lane: 1, type: "start", exits: [-1, -1, -1], shape: PLAIN_SHAPE }], startId: 0, exitId: 0, layers: 1 };
  run.rooms = [{ visited: true, cleared: true, pickups: [], enemies: null }];
  run.roomId = 0;
  run.roomCols = TD_COLS;
  run.roomRows = TD_ROWS;
  run.enemies = [];
  run.projectiles = [];
  run.devices = [];
  const def = tdMapDef(mapId);
  run.gold = Math.round(TD_RULES.startGold * (def?.goldMul ?? 1));
  run.goldEarned = 0;
  const worldFx: EffectState[] = [];
  run.effects = worldFx;
  return {
    mapId,
    run,
    idle,
    towers: [],
    nextTowerId: 1,
    round: 0,
    phase: "build",
    lives: def?.lives ?? TD_RULES.lives,
    roundTick: 0,
    spawns: [],
    finals: [],
    breakTicks: 0,
    worldFx,
    leaked: 0,
    rebuild: {},
  };
}

/** 다음 라운드 시작 (쉬는 시간에 일찍 시작하면 남은 1초마다 돈) */
export function startRound(td: TdState): void {
  if (td.phase !== "build" && td.phase !== "break") return;
  if (td.phase === "break") td.run.gold += Math.floor(td.breakTicks / 60) * TD_RULES.earlyGold;
  td.round++;
  td.spawns = buildSpawns(td);
  td.roundTick = td.run.tick;
  td.phase = "wave";
}

/** 한 틱 진행 */
export function stepTd(td: TdState): void {
  if (td.phase === "won" || td.phase === "lost") return;
  const s = td.run;
  applyRoom(s);
  s.tick++;
  if (td.phase === "break" && --td.breakTicks <= 0) startRound(td);
  if (td.phase === "wave") {
    const t = s.tick - td.roundTick;
    while (td.spawns.length > 0 && td.spawns[0]!.at <= t) {
      const sp = td.spawns.shift()!;
      spawnTd(td, sp.kind as EnemyKind, sp.path, sp.hpMul);
    }
    if (td.finals.length > 0 && t >= R.FINAL_AT && !s.enemies.some(isFinal)) spawnFinal(td);
  }
  updateTdEnemies(td);
  hitTowers(td);

  const before = s.enemies.slice();
  // 적 상태 시간(둔화·수양·출혈·불)은 타워마다가 아니라 여기서 한 번
  s.tdShared = true;
  updateTowers(td);
  decaySlow(s);
  updateSeals(s);
  updateBleed(s);
  updateDelayed(s);
  s.tdShared = false;
  const alive = new Set(s.enemies.map((e) => e.id));
  for (const e of before) if (!alive.has(e.id) && e.hp <= 0 && e.kind === "eggsac") hatch(td, e);

  tickEffects(td);
  if (td.lives <= 0) {
    td.phase = "lost";
    return;
  }
  if (td.phase === "wave" && td.spawns.length === 0 && td.finals.length === 0 && s.enemies.length === 0) {
    s.gold += tdRoundGold(td.round);
    if (td.round >= TD_ROUNDS) td.phase = "won";
    else {
      td.phase = "break";
      td.breakTicks = TD_RULES.breakSec * 60;
    }
  }
}

function tickEffects(td: TdState): void {
  const tick = (list: EffectState[]) => {
    for (const fx of list) fx.ticks--;
    return list.filter((fx) => fx.ticks > 0);
  };
  td.worldFx = tick(td.worldFx);
  td.run.effects = td.worldFx;
  for (const t of td.towers) for (const a of t.atk) a.effects = tick(a.effects);
}
