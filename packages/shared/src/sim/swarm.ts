// 이벤트 '광야의 새벽': 넓은 들판에서 시간이 갈수록 몰려오는 적을 버팀. 공격은 저절로, 무기 4칸·패시브 6칸
// 레벨 업마다 무기·패시브를 골라 키우고(최대 5), 최대 레벨 무기 + 짝 패시브면 황금 상자(보스가 떨굼)로 각성. 최종 보스를 잡으면 클리어, 계속하면 끝없이
// 파일: swarmTypes(상태) · swarmSpawn(적·상자·보스) · swarmLevel(경험치·고르기·각성) · swarmGhosts(두 번째~ 무기) · swarmMods(능력치)
// · swarmEvents(특수 이벤트) · swarmTerrain·swarmGrid(맵 땅) · 수치 swarmDefs·swarmMaps
import { TICK_RATE, TILE_SIZE } from "../constants";
import { CHARACTERS, ENEMIES, type CharacterId } from "../content";
import { createRng, deriveSeed } from "../rng";
import { SWARM, type SwarmDropKind } from "../swarmDefs";
import { recallChakram } from "./bedouin";
import { addGold, blastAt, healPlayer } from "./combat";
import { PLAIN_SHAPE } from "./layout";
import { applyRoom } from "./rooms";
import { checkDeath, createRun, stepSim } from "./run";
import { evoNova } from "./swarmEvo";
import { updateGhosts } from "./swarmGhosts";
import { updateEvents } from "./swarmEvents";
import { placeTowers, updateTerrain } from "./swarmTerrain";
import { apostlePotion } from "./apostle";
import type { SwarmMapId } from "../swarmMaps";
import { gainXp, makeChoices, openChest, startWeapon } from "./swarmLevel";
import { swarmMinutes, updateSpawns } from "./swarmSpawn";
import type { EnemyState, RunState, TickInput } from "./types";
import { dist2, normalize } from "./util";

export function createSwarm(seed: number, c: CharacterId, map: SwarmMapId = "plains", level = 0): RunState {
  const s = createRun(seed, c);
  s.map = { floor: 1, rooms: [{ id: 0, layer: 0, lane: 1, type: "start", exits: [-1, -1, -1], shape: PLAIN_SHAPE }], startId: 0, exitId: 0, layers: 1 };
  s.rooms = [{ visited: true, cleared: true, pickups: [], enemies: null }];
  s.roomId = 0;
  s.roomCols = SWARM.cols;
  s.roomRows = SWARM.rows;
  s.enemies = [];
  s.gold = 0;
  s.swarm = { map, level, lv: 1, xp: 0, weapons: [], passives: [], gems: [], drops: [], choices: null, pending: 0, picks: 0, spawnAcc: 0, bosses: 0, finalId: 0, kills: 0 };
  applyRoom(s);
  const p = s.player;
  p.x = p.prevX = (SWARM.cols * TILE_SIZE) / 2;
  p.y = p.prevY = (SWARM.rows * TILE_SIZE) / 2;
  startWeapon(s, CHARACTERS[c].startWeapon);
  placeTowers(s);
  return s;
}

/** 최종 보스를 잡은 뒤: 계속하면 끝없이 (더 세짐), 그만두면 클리어로 끝 */
export function continueSwarm(s: RunState, go: boolean): void {
  const sw = s.swarm;
  if (!sw?.ask) return;
  sw.ask = false;
  if (go) sw.endless = true;
  else s.over = true;
}

/** 한 틱 진행. 레벨 업으로 고르는 중이면 멈추고 false (화면이 chooseSwarm으로 고름) */
export function stepSwarm(s: RunState, input: TickInput): boolean {
  const sw = s.swarm;
  if (!sw || s.over) return true;
  if (sw.choices || sw.ask) return false;
  if (sw.pending > 0) {
    sw.choices = makeChoices(s);
    return false;
  }
  const before = new Map(s.enemies.map((e) => [e.id, e]));
  // 공격은 늘 저절로
  const inp = { ...input, attack: true };
  stepSim(s, inp);
  if (!s.over) {
    // 공격이 저절로라 떨어진 차크람(베두인)은 혼자 돌아옴
    recallChakram(s.player);
    evoNova(s);
    updateGhosts(s, inp);
    updateTerrain(s);
    if (checkDeath(s)) s.over = true;
  }
  const alive = new Set(s.enemies.map((e) => e.id));
  for (const [id, e] of before) if (!alive.has(id) && e.hp <= 0) fallen(s, e);
  if (s.over) return true;
  if (s.player.hp < s.player.stats.maxHp) s.player.hp = Math.min(s.player.stats.maxHp, s.player.hp + SWARM.regen / TICK_RATE);
  updateSpawns(s);
  updateEvents(s);
  updateGems(s);
  updateDrops(s);
  return true;
}

/** 쓰러진 적: 보석 (보스는 큰 보석 + 황금 상자) · 상자: 아이템 · 최종 보스면 클리어 */
function fallen(s: RunState, e: EnemyState): void {
  const sw = s.swarm!;
  if (e.svBox) {
    drop(s, e.x, e.y, boxDrop(s, e));
    return;
  }
  sw.kills++;
  const boss = ENEMIES[e.kind].boss;
  addGem(s, e.x, e.y, boss ? SWARM.gemBoss : Math.max(1, Math.round(e.maxHp / 40)));
  if (boss) drop(s, e.x, e.y + 8, "chest");
  // 최종 보스: 클리어 (계속할지 묻고 멈춤)
  if (e.id === sw.finalId && !s.won) {
    s.won = true;
    sw.ask = true;
  }
}

function boxDrop(s: RunState, e: EnemyState): SwarmDropKind {
  let r = createRng(deriveSeed(s.seed, "swarmBox", e.id)).nextFloat();
  for (const [kind, p] of SWARM.drops) {
    if (r < p) return kind;
    r -= p;
  }
  return "gold";
}

function drop(s: RunState, x: number, y: number, kind: SwarmDropKind): void {
  s.swarm!.drops.push({ id: s.nextId++, x, y, kind });
}

function addGem(s: RunState, x: number, y: number, v: number): void {
  const gems = s.swarm!.gems;
  // 너무 많으면 가장 오래된 보석에 합침
  if (gems.length >= SWARM.maxGems) gems[0]!.v += v;
  else gems.push({ id: s.nextId++, x, y, v });
}

/** 보석: 가까우면 끌려와 먹힘 (행운만큼 더 멀리서) */
function updateGems(s: RunState): void {
  const sw = s.swarm!;
  const p = s.player;
  const reach = SWARM.magnet * (1 + 0.08 * Math.max(0, p.stats.luck));
  sw.gems = sw.gems.filter((g) => {
    const d2 = dist2(g, p);
    if (!g.pull && d2 > reach * reach) return true;
    g.pull = true;
    if (d2 <= (p.r + 3) ** 2) {
      gainXp(s, g.v);
      return false;
    }
    const dir = normalize(p.x - g.x, p.y - g.y) ?? [0, 0];
    const step = Math.min(Math.sqrt(d2), SWARM.gemSpeed + p.stats.moveSpeed);
    g.x += dir[0] * step;
    g.y += dir[1] * step;
    return true;
  });
}

/** 바닥 아이템: 닿으면 먹음 */
function updateDrops(s: RunState): void {
  const sw = s.swarm!;
  const p = s.player;
  sw.drops = sw.drops.filter((d) => {
    if (dist2(d, p) > (p.r + 6) ** 2) return true;
    // 고기: 악의 사도는 회복약처럼 오히려 체력이 깎임
    if (d.kind === "heal" && p.characterId === "apostle") apostlePotion(s, p.stats.maxHp * SWARM.heal);
    else if (d.kind === "heal") healPlayer(s, p.stats.maxHp * SWARM.heal);
    else if (d.kind === "magnet") for (const g of sw.gems) g.pull = true;
    else if (d.kind === "bomb") blastAt(s, p.x, p.y, SWARM.bombR, SWARM.bombDamage * (1 + SWARM.hpPerMin * swarmMinutes(s)), { still: true });
    else if (d.kind === "gold") addGold(s, 5 + Math.floor(swarmMinutes(s)));
    else openChest(s);
    return false;
  });
}

/** 기록: 버틴 시간(틱) · 레벨 · 처치 수 */
export function swarmResult(s: RunState): { ticks: number; lv: number; kills: number; won: boolean } {
  return { ticks: s.tick, lv: s.swarm?.lv ?? 1, kills: s.swarm?.kills ?? 0, won: s.won };
}
