// 관리자 AI 측정 한 판: 봇(benchBot)이 보통 로그 1~6층(쓰러지면 되살아나고 횟수만, 티어 플레잉과 같음) → 깨면 바로 최종보스(아스모데우스의 화신체 고정, 여기서도 쓰러지면 되살아나고 횟수만 → 잡을 때까지 걸린 시간)
// 기록: 클리어 시간 · 쓰러진 횟수 · 준 피해 · 받은 피해 · 회복 · 넘긴 방 · 보스 결과·시간·깎은 체력 (받은 피해·회복은 틱마다 체력이 바뀐 만큼, 준 피해는 게임 계산의 출처별 기록)
import { climb, continueToLastFloor, createRun, ENEMIES, goThrough, stepSim, TICK_RATE, type CharacterId, type LastBossKind, type RunState } from "@pixel-rogue/shared";
import { botInput, newMem, pickLane } from "./benchBot";

/** 측정 규칙: 고정 최종보스 · 적 없이 이 틱(15초)이면 방 넘김 · 싸우는데 이 틱(45초) 동안 못 깎으면 넘김 · 로그 한도(60분)·보스 한도(20분) */
export const BENCH = { boss: "asmodeus" as LastBossKind, calmSkip: 15 * TICK_RATE, stallSkip: 45 * TICK_RATE, runLimit: 60 * 60 * TICK_RATE, bossLimit: 20 * 60 * TICK_RATE };

export interface BenchRow {
  character: CharacterId;
  /** 로그(1~6층) 클리어 틱 (못 깼으면 0) · 도달한 층 */
  clearTicks: number;
  floor: number;
  deaths: number;
  dealt: number;
  /** 싸운 틱 (적이 있던 틱) → 초당 피해 */
  fightTicks: number;
  taken: number;
  healed: number;
  /** 막혀서 넘긴 방 수 */
  skips: number;
  /** 최종보스: 잡았는지 · 쓰러진 횟수 · 걸린 틱 · 깎은 체력 % · 보스전에서 준·받은 피해 */
  bossCleared: boolean;
  bossDeaths: number;
  bossTicks: number;
  bossPct: number;
  bossDealt: number;
  bossTaken: number;
}

export interface BenchJob {
  /** 이만큼(ms) 돌림 · 끝났으면 true */
  step: (ms: number) => boolean;
  row: BenchRow;
  run: RunState;
}

/** 보스 무리의 깎인 체력 % */
function bossCut(s: RunState): number {
  const bosses = s.enemies.filter((e) => ENEMIES[e.kind]?.boss);
  const max = bosses.reduce((a, e) => a + e.maxHp, 0);
  return max <= 0 ? 0 : Math.round((1 - bosses.reduce((a, e) => a + Math.max(0, e.hp), 0) / max) * 100);
}

export function startBench(character: CharacterId, seed: number): BenchJob {
  const s = createRun(seed, character, []);
  s.tierPlay = { deaths: 0 };
  const row: BenchRow = { character, clearTicks: 0, floor: 1, deaths: 0, dealt: 0, fightTicks: 0, taken: 0, healed: 0, skips: 0, bossCleared: false, bossDeaths: 0, bossTicks: 0, bossPct: 0, bossDealt: 0, bossTaken: 0 };
  const mem = newMem();
  /** 지난 틱까지 준 피해 합 */
  let dealtWas = 0;
  let where = "";
  let [calm, stall, bossStart, done] = [0, 0, 0, false];

  const tick = (): void => {
    const p = s.player;
    const [hpWas, deathsWas] = [p.hp, s.tierPlay!.deaths];
    stepSim(s, botInput(s, mem));
    const boss = !!s.lastBoss;
    // 받은 피해·회복 (되살아난 틱은 회복으로 안 셈)
    if (p.hp < hpWas) row[boss ? "bossTaken" : "taken"] += hpWas - Math.max(0, p.hp);
    else if (p.hp > hpWas && s.tierPlay!.deaths === deathsWas && !boss) row.healed += p.hp - hpWas;
    // 준 피해: 게임 계산이 적어 둔 출처별 피해 합(sim/dmgSrc)이 늘어난 만큼
    const now = `${s.floor}/${s.roomId}`;
    if (now !== where) [where, calm, stall] = [now, 0, 0];
    let sum = 0;
    for (const v of Object.values(p.dmgBy ?? {})) sum += v;
    const hit = Math.max(0, sum - dealtWas);
    dealtWas = sum;
    row[boss ? "bossDealt" : "dealt"] += hit;
    if (s.enemies.length > 0) {
      if (!boss) row.fightTicks++;
      [calm, stall] = [0, hit > 0 ? 0 : stall + 1];
    } else [calm, stall] = [calm + 1, 0];
    if (boss) row.bossPct = Math.max(row.bossPct, bossCut(s));
    else row.floor = s.floor;
    // 막힘: 방을 넘김 (마지막 방은 계단, 보스전은 그대로 끝냄)
    if (calm > BENCH.calmSkip || stall > BENCH.stallSkip) {
      if (boss && stall > BENCH.stallSkip) return void (done = true);
      row.skips++;
      [calm, stall] = [0, 0];
      const lane = pickLane(s);
      if (lane >= 0) goThrough(s, lane);
      else {
        s.enemies = [];
        s.rooms[s.roomId]!.cleared = true;
        climb(s);
      }
    }
    if (!s.over) {
      if (!boss && s.tick > BENCH.runLimit) done = true;
      if (boss && s.tick - bossStart > BENCH.bossLimit) done = true;
      return;
    }
    if (boss && p.hp <= 0) {
      // 최종보스에서 쓰러짐: 되살아나고 횟수만 (잡은 시간을 재려고)
      row.bossDeaths++;
      [s.over, p.hp, p.invulnTicks] = [false, p.stats.maxHp, 120];
      return;
    }
    if (!boss && s.won) {
      // 로그를 깸 → 바로 최종보스
      row.clearTicks = s.tick;
      bossStart = s.tick;
      continueToLastFloor(s, BENCH.boss);
      return;
    }
    done = true;
  };

  const finish = (): void => {
    const p0 = s.player;
    row.deaths = s.tierPlay!.deaths;
    if (!s.lastBoss) return;
    // 잡음 = 보스 층 계단까지 올라 판이 끝남 (쓰러져 끝나는 일은 없음)
    row.bossCleared = s.over && p0.hp > 0;
    if (row.bossCleared) row.bossPct = 100;
    row.bossTicks = row.bossCleared ? (s.raidTicks ?? s.tick - bossStart) : s.tick - bossStart;
  };

  return {
    row,
    run: s,
    step(ms) {
      const end = performance.now() + ms;
      while (!done && performance.now() < end) for (let i = 0; i < 60 && !done; i++) tick();
      if (done) finish();
      return done;
    },
  };
}
