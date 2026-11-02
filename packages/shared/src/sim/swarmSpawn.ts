// 광야의 새벽: 시간이 갈수록 화면 밖에서 적이 더 많이·더 세게 (맵·난이도만큼) · 들판에 나무 상자 · 정해진 때 보스(1·2·3단계 둘씩 + 최종), 계속하면 끝없이
import { TICK_RATE } from "../constants";
import { BOSS_TIERS, ENEMIES, type EnemyKind } from "../enemyDefs";
import { createRng, deriveSeed, type Rng } from "../rng";
import { SWARM } from "../swarmDefs";
import { SWARM_LEVELS, swarmMapDef } from "../swarmMaps";
import { bossHpMul } from "./bosses";
import { BAT_FLOCK, minionKinds } from "./critters";
import type { EnemyState, RunState } from "./types";
import { DIR16, dist2, keepInRoom, makeEnemy, roomGrid, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

/** 맵·난이도 세기: 체력 배율 · 나오는 수 배율 · 받는 피해 배율 */
export function swarmPower(s: RunState): { hp: number; spawn: number; taken: number } {
  const sw = s.swarm;
  const map = swarmMapDef(sw?.map);
  const lv = SWARM_LEVELS[sw?.level ?? 0] ?? SWARM_LEVELS[0];
  // 클리어 뒤 계속하면 1분마다 더 세짐
  const more = sw?.endless ? 1 + SWARM.endlessHpPerMin * Math.max(0, swarmMinutes(s) - SWARM.bossSec[SWARM.bossSec.length - 1]! / 60) : 1;
  return { hp: map.power * lv.hp * more, spawn: Math.sqrt(map.power) * lv.spawn, taken: lv.taken };
}

/** 지난 분 (0부터) */
export const swarmMinutes = (s: RunState) => s.tick / (TICK_RATE * 60);
/** 졸개 종류·세기 단계 (2.5분마다 +1, 최대 6) */
export const swarmDepth = (s: RunState) => Math.min(6, 1 + Math.floor(s.tick / (TICK_RATE * SWARM.depthSec)));

/** 플레이어 둘레 화면 밖 한 자리 (방 안, 너무 가까우면 다른 쪽) */
function ringSpot(s: RunState, rng: Rng, dist: number): [number, number] {
  const p = s.player;
  let best: [number, number] = [p.x, p.y];
  for (let tries = 0; tries < 6; tries++) {
    const [dx, dy] = DIR16[rng.int(0, 15)]!;
    const jitter = rng.int(-30, 30);
    const x = Math.min(ROOM_MAX_X - 8, Math.max(ROOM_MIN_X + 8, p.x + dx * (dist + jitter)));
    const y = Math.min(ROOM_MAX_Y - 8, Math.max(ROOM_MIN_Y + 8, p.y + dy * (dist + jitter)));
    best = [x, y];
    if ((x - p.x) ** 2 + (y - p.y) ** 2 > (dist * 0.6) ** 2) break;
  }
  return best;
}

const isBox = (e: EnemyState) => e.svBox !== undefined;

/** 틱마다: 졸개 나오기 · 멀어진 졸개 다시 앞으로 · 상자 채우기 · 보스 */
export function updateSpawns(s: RunState): void {
  const sw = s.swarm!;
  const rng = createRng(deriveSeed(s.seed, "swarm", s.tick));
  const min = swarmMinutes(s);
  s.floor = swarmDepth(s);
  const foes = s.enemies.filter((e) => !isBox(e));
  const power = swarmPower(s);
  sw.spawnAcc += ((SWARM.spawnBase + SWARM.spawnPerMin * min) * power.spawn) / TICK_RATE;
  const kinds = minionKinds(s.floor);
  const hpMul = (1 + SWARM.hpPerMin * min) * power.hp;
  let alive = foes.length;
  while (sw.spawnAcc >= 1) {
    sw.spawnAcc--;
    if (alive >= SWARM.maxEnemies) continue;
    const kind = rng.pick(kinds);
    const [x, y] = ringSpot(s, rng, SWARM.spawnDist);
    for (const [ox, oy] of kind === "bat" ? BAT_FLOCK : [[0, 0] as const]) {
      const e = makeEnemy(s, kind, x + ox, y + oy, hpMul, rng.int(10, 40));
      keepInRoom(e, roomGrid(s));
      s.enemies.push(e);
      alive++;
    }
  }
  // 너무 멀어진 졸개는 플레이어 앞쪽 화면 밖으로
  if (s.tick % 30 === 0) {
    for (const e of foes) {
      if (ENEMIES[e.kind].boss || dist2(e, s.player) < SWARM.farDist ** 2) continue;
      [e.x, e.y] = ringSpot(s, rng, SWARM.spawnDist);
      keepInRoom(e, roomGrid(s));
      e.prevX = e.x;
      e.prevY = e.y;
    }
  }
  fillCrates(s, rng);
  if (sw.bosses < SWARM.bossSec.length && s.tick >= SWARM.bossSec[sw.bosses]! * TICK_RATE) spawnSwarmBoss(s, rng);
  // 마지막 보스 뒤 (못 잡았거나 계속하는 중): 보스가 일정 간격으로 끝없이 (점점 세게, 여럿을 함께 상대)
  else if (sw.bosses >= SWARM.bossSec.length && s.tick >= (SWARM.bossSec[SWARM.bossSec.length - 1]! + SWARM.endlessEvery * ((sw.more ?? 0) + 1)) * TICK_RATE) spawnSwarmBoss(s, rng);
}

/** 들판 나무 상자를 정해진 수만큼 (멀리 떨어진 상자는 치우고 플레이어 둘레에 새로). 황금 상자는 보스에게서만 */
function fillCrates(s: RunState, rng: Rng): void {
  if (s.tick % 20 !== 0) return;
  s.enemies = s.enemies.filter((e) => !isBox(e) || dist2(e, s.player) < (SWARM.farDist * 1.5) ** 2);
  const boxes = s.enemies.filter(isBox).length;
  if (boxes >= SWARM.crates) return;
  const [x, y] = ringSpot(s, rng, rng.int(140, 360));
  const e = makeEnemy(s, "dummy", x, y, 1, 0);
  e.hp = e.maxHp = Math.round(SWARM.crateHp * (1 + 0.1 * swarmMinutes(s)));
  e.r = 6;
  keepInRoom(e, roomGrid(s));
  e.anchor = [e.x, e.y];
  e.svBox = 1;
  s.enemies.push(e);
}

/** 보스: 정해진 단계 중 하나 (마지막은 최종 보스, 잡으면 클리어) · 계속하는 중에는 모든 단계에서, 나올수록 세게 */
function spawnSwarmBoss(s: RunState, rng: Rng): void {
  const sw = s.swarm!;
  const n = sw.bosses;
  const extra = n >= SWARM.bossSec.length;
  const tier = extra ? BOSS_TIERS.flat() : BOSS_TIERS[SWARM.bossTier[n]!]!;
  const kind = rng.pick(tier) as EnemyKind;
  const [x, y] = ringSpot(s, rng, SWARM.spawnDist - 60);
  const final = n === SWARM.bossSec.length - 1;
  const step = extra ? 1 + SWARM.endlessBossHp * ((sw.more ?? 0) + 1) : 1;
  const e = makeEnemy(s, kind, x, y, bossHpMul(2 + SWARM.bossTier[Math.min(n, SWARM.bossTier.length - 1)]! * 2) * SWARM.bossHp * swarmPower(s).hp * (final ? SWARM.finalHp : 1) * step, 90);
  keepInRoom(e, roomGrid(s));
  s.enemies.push(e);
  if (extra) sw.more = (sw.more ?? 0) + 1;
  else sw.bosses++;
  if (final) sw.finalId = e.id;
}
