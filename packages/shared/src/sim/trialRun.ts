// 시련 진행: 1 암흑 속 몬스터 무리 · 2 체력 1로 몬스터 무리 · 3 보스 셋(하나씩) · 4 끝없는 몬스터(처치마다 점수, 최대 1000)
// 1·2·3은 이기면 바로 1000점 (쓰러지면 진짜 끝) · 4는 쓰러져도 죽지 않고 그때 점수로 끝남 (체력은 시작 때로)
// 끝나면 점수에 맞는 보상 상자가 비석에서 쏟아짐 (sim/trialRewards). 방을 나가면 시련은 사라짐
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { BOSS_TIERS, ENEMIES, type BossKind } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { spawnBoss } from "./bosses";
import { minionKinds } from "./critters";
import { makeChamps } from "./elite";
import { depth } from "./hero";
import { bodyFits } from "./layout";
import { stalkerKinds } from "./stalkers";
import { spillRewards } from "./trialRewards";
import type { TrialKind } from "./trialTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, makeEnemy, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 무리: 물결 수 · 한 물결 적 수(층 세기마다 더함) · 체력 배율 */
  WAVES: 3,
  WAVE_BASE: 8,
  WAVE_PER_DEPTH: 1,
  WAVE_HP: 1.3,
  /** 보스 셋: 보스 체력 배율 */
  BOSS_HP: 0.7,
  /** 끝없는: 처치 하나에 점수 · 나오는 간격(틱, 점수가 오를수록 줄어듦) · 한 번에 나오는 수 · 한꺼번에 있을 수 있는 적 */
  KILL_SCORE: 10,
  SPAWN_EVERY: 90,
  SPAWN_MIN: 28,
  SPAWN_N: 3,
  MAX_ALIVE: 28,
  /** 끝없는: 점수에 따른 체력 배율 (700점까지는 천천히, 그 뒤로 가파르게) */
  HP_PER_100: 0.18,
  HP_LATE: 9,
  /** 이 점수부터 정예가 섞임 */
  CHAMP_FROM: 600,
};
export { R as TRIAL_RUN_RULES };

const MAX_SCORE = 1000;

/** 시련 시작 (방이 잠기고, 체력 1 시련은 체력을 1로) */
export function startTrial(s: RunState, kind: TrialKind): void {
  const p = s.player;
  s.trialRun = { kind, room: s.roomId, score: 0, left: kind === 3 ? 3 : kind === 4 ? 0 : R.WAVES, t: 60, hp: p.hp, kills: s.kills, got: 0, at: s.tick };
  s.rooms[s.roomId]!.cleared = false;
  if (kind === 2) p.hp = 1;
  (p.trial ??= { rooms: [] }).last = { kind, tick: s.tick };
}

/** 문 쪽을 피해 빈 자리 하나 (플레이어와 떨어진 곳) */
function spot(s: RunState, rng: ReturnType<typeof createRng>, r: number): [number, number] {
  const g = roomGrid(s);
  let x = 0;
  let y = 0;
  for (let tries = 0; tries < 30; tries++) {
    x = rng.int(ROOM_MIN_X + 12, ROOM_MAX_X - 12);
    y = rng.int(ROOM_MIN_Y + 12, ROOM_MAX_Y - 12);
    if ((x - s.player.x) ** 2 + (y - s.player.y) ** 2 > 70 * 70 && (!g || bodyFits(g, x, y, r))) break;
  }
  return [x, y];
}

/** 졸개 n마리 (hpMul 배) */
function spawnMinions(s: RunState, n: number, hpMul: number, salt: number): EnemyState[] {
  const d = depth(s);
  const rng = createRng(deriveSeed(s.seed, "trialSpawn", s.floor, s.roomId, salt));
  const kinds = [...minionKinds(d), ...stalkerKinds(d)].filter((k) => k !== "gnat" && k !== "bat" && k !== "golem");
  const out: EnemyState[] = [];
  for (let i = 0; i < n; i++) {
    const kind = rng.pick(kinds);
    const [x, y] = spot(s, rng, ENEMIES[kind].radius);
    const e = makeEnemy(s, kind, x, y, hpMul * (1 + 0.2 * (d - 1)), rng.int(20, 60));
    e.noGold = true;
    keepInRoom(e, roomGrid(s));
    out.push(e);
    addEffect(s, { kind: "trSpawn", x, y, dirX: 0, dirY: 0, size: 10, maxTicks: 20 });
  }
  s.enemies.push(...out);
  return out;
}

/** 시련용 보스 (지금 층까지의 보스 중 시드로) */
function nextBoss(s: RunState): void {
  const tiers = BOSS_TIERS.slice(0, Math.min(BOSS_TIERS.length, Math.floor((s.floor - 1) / 2) + 1)).flat();
  const rng = createRng(deriveSeed(s.seed, "trialBoss", s.floor, s.roomId, s.trialRun!.left));
  const kind = rng.pick(tiers) as BossKind;
  const b = spawnBoss(s, kind);
  b.hp = b.maxHp = Math.round(b.maxHp * R.BOSS_HP);
  b.noGold = true;
  s.enemies.push(b);
  addEffect(s, { kind: "trSpawn", x: b.x, y: b.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30 });
}

/** 끝없는 시련의 적 체력 배율: 700점까지는 조금씩, 그 뒤로 아주 가파르게 */
export const endlessHp = (score: number) => 1 + R.HP_PER_100 * (score / 100) + R.HP_LATE * Math.max(0, (score - 700) / 300) ** 2;

function finish(s: RunState, score: number): void {
  const run = s.trialRun!;
  const p = s.player;
  s.trialRun = undefined;
  if (run.kind === 2 || run.kind === 4) p.hp = Math.max(p.hp, Math.min(p.stats.maxHp, run.hp));
  if (run.kind === 4) s.enemies = [];
  (p.trial ??= { rooms: [] }).last = { kind: run.kind, score, tick: s.tick };
  p.invulnTicks = Math.max(p.invulnTicks, 90);
  spillRewards(s, score);
}

/** 틱마다 (stepWorld 끝, 쓰러짐 판정 전) */
export function trialTick(s: RunState): void {
  const run = s.trialRun;
  if (!run) return;
  // 방을 나가면 시련은 사라짐 (보상 없음)
  if (s.roomId !== run.room) {
    s.trialRun = undefined;
    return;
  }
  const p = s.player;
  if (run.kind === 1) p.blindTicks = Math.max(p.blindTicks ?? 0, 2);
  if (run.kind === 2 && p.hp > 1) p.hp = 1;
  if (run.t > 0) run.t--;
  if (run.kind === 4) {
    run.score = Math.min(MAX_SCORE, (s.kills - run.kills + (run.got ?? 0)) * R.KILL_SCORE);
    // 쓰러져도 죽지 않음: 그때 점수로 끝
    if (p.hp <= 0 || run.score >= MAX_SCORE) return finish(s, run.score);
    if (run.t <= 0 && s.enemies.length < R.MAX_ALIVE) {
      const out = spawnMinions(s, R.SPAWN_N + Math.floor(run.score / 250), endlessHp(run.score), s.tick);
      if (run.score >= R.CHAMP_FROM) makeChamps(out, depth(s));
      run.t = Math.max(R.SPAWN_MIN, Math.round(R.SPAWN_EVERY - run.score * 0.06));
    }
    return;
  }
  if (s.enemies.length > 0 || run.t > 0) return;
  if (run.left <= 0) return finish(s, MAX_SCORE);
  run.left--;
  run.t = 50;
  if (run.kind === 3) nextBoss(s);
  else spawnMinions(s, R.WAVE_BASE + R.WAVE_PER_DEPTH * depth(s), R.WAVE_HP, run.left);
}
