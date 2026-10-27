// 이벤트 '패왕전': AI 캐릭터들과 겨룸 (1대1 · 3대3 · 5대5 · 토너먼트 · 대난투 20명 · 데스매치 21레벨)
// 파일: paewangTypes(상태) · paewangUnits(AI 만들기·맞히기) · paewangAi(AI 머리) · paewangFlow(쓰러짐·차례·함정·아이템·승패)
// · paewangKit(준비방 장비·데스매치 캐릭터 바꾸기) · paewangGrid(경기장 칸) · 수치 paewangDefs·paewangMaps
import { CHARACTER_IDS, type CharacterId } from "../content";
import { PW_MODE, PW_TIERS, type PwMode } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { createRng, deriveSeed } from "../rng";
import { updateItems } from "./items";
import { PLAIN_SHAPE } from "./layout";
import { thinkAll } from "./paewangAi";
import { meDown, foeDown, settle, updateDrops, updateTraps } from "./paewangFlow";
import { spotXY } from "./paewangGrid";
import { applyLoadout, gunSwap } from "./paewangKit";
import type { PwLoadout } from "./paewangTypes";
import { spawnAlly, spawnFoe } from "./paewangUnits";
import { applyRoom } from "./rooms";
import { checkDeath, createRun, stepPlayer, stepWorld } from "./run";
import type { EnemyState, RunState, TickInput } from "./types";

export function createPaewang(seed: number, mode: PwMode, char: CharacterId, loadout?: PwLoadout): RunState {
  const def = PW_MODE[mode];
  const arena = PW_ARENAS[def.arena];
  const s = createRun(seed, mode === "gungame" ? PW_TIERS[0]! : char);
  s.map = { floor: 1, rooms: [{ id: 0, layer: 0, lane: 1, type: "start", exits: [-1, -1, -1], shape: PLAIN_SHAPE }], startId: 0, exitId: 0, layers: 1 };
  s.rooms = [{ visited: true, cleared: true, pickups: [], enemies: null }];
  s.roomId = 0;
  s.roomCols = arena.cols;
  s.roomRows = arena.rows;
  s.enemies = [];
  s.projectiles = [];
  s.pw = { mode, arena: def.arena, allies: [], benchA: [], benchB: [], waiting: [], down: false, lv: 1, kills: 0, tags: 1 };
  applyRoom(s);
  const me = spotXY(def.ffa ? arena.spots[0]! : arena.teamA[0]!);
  const p = s.player;
  p.x = p.prevX = me[0];
  p.y = p.prevY = me[1];
  if (mode === "gungame") gunSwap(s, PW_TIERS[0]!);
  else if (loadout) applyLoadout(s, loadout);
  // 나오는 캐릭터는 판 시드로 (같은 캐릭터가 겹칠 수 있음)
  const rng = createRng(deriveSeed(seed, "pwRoster"));
  const pick = () => rng.pick(CHARACTER_IDS);
  const pw = s.pw;
  if (mode === "tourney") {
    pw.benchA = Array.from({ length: def.allies }, pick);
    pw.benchB = Array.from({ length: def.foes }, pick);
    const at = spotXY(arena.teamB[0]!);
    spawnFoe(s, pw.benchB.shift()!, 1, at[0], at[1], pw.tags++);
  } else if (def.ffa) {
    for (let i = 0; i < def.foes; i++) {
      const at = spotXY(arena.spots[(i + 1) % arena.spots.length]!);
      spawnFoe(s, mode === "gungame" ? PW_TIERS[0]! : pick(), 100 + i, at[0], at[1], pw.tags++, mode === "gungame" ? 1 : undefined);
    }
  } else {
    for (let i = 0; i < def.allies; i++) {
      const at = spotXY(arena.teamA[(i + 1) % arena.teamA.length]!);
      spawnAlly(s, pick(), at[0], at[1], pw.tags++);
    }
    for (let i = 0; i < def.foes; i++) {
      const at = spotXY(arena.teamB[i % arena.teamB.length]!);
      spawnFoe(s, pick(), 1, at[0], at[1], pw.tags++);
    }
  }
  return s;
}

/** 한 틱 진행 (GameScreen step). 늘 true */
export function stepPaewang(s: RunState, input: TickInput): boolean {
  const pw = s.pw;
  if (!pw || s.over) return true;
  applyRoom(s);
  s.tick++;
  const p = s.player;
  for (const b of [p, ...s.enemies, ...s.projectiles, ...pw.allies]) {
    b.prevX = b.x;
    b.prevY = b.y;
  }
  const before = new Map<number, EnemyState>();
  for (const e of s.enemies) if (e.pw && e.hp > 0) before.set(e.id, e);
  s.prompt = { kind: "none" };
  if (!pw.down) {
    stepPlayer(s, input);
    updateItems(s, input);
  } else watch(s);
  stepWorld(s);
  // 내 공격으로 쓰러진 AI (투사체·근접 계산이 이미 목록에서 뺌)
  const alive = new Set(s.enemies.map((e) => e.id));
  for (const [id, e] of before) if (!alive.has(id) && !s.over) foeDown(s, e, true);
  if (!s.over) thinkAll(s);
  updateTraps(s);
  updateDrops(s);
  if (!s.over && !pw.down && checkDeath(s)) meDown(s);
  if (!s.over) settle(s);
  return true;
}

/** 쓰러진 뒤: 살아 있는 내 편을 따라다니며 지켜봄 (화면이 나를 따라오므로 내 자리를 옮김) */
function watch(s: RunState): void {
  const p = s.player;
  p.invulnTicks = 2;
  const a = s.pw!.allies.find((o) => o.hp > 0);
  if (!a) return;
  p.x = a.x;
  p.y = a.y;
}

/** 결과: 이겼는지 · 내가 쓰러뜨린 수 · 데스매치 레벨 · 대난투 순위 · 받을 돈 */
export function paewangResult(s: RunState): { won: boolean; kills: number; lv: number; place: number; reward: number } {
  const pw = s.pw!;
  return { won: s.won, kills: pw.kills, lv: Math.min(pw.lv, 21), place: s.won ? 1 : (pw.place ?? 0), reward: s.won ? PW_MODE[pw.mode].reward : 0 };
}
