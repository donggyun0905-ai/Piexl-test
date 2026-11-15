// 지도 전투(C안, docs/WORLD_MAP.md): 지도 조각을 본편 방으로 만들어 본편 계산(stepSim)으로 싸움 · 무기·스킬·대시·이펙트·장신구가 본편과 같음
// 화면 전용 (기록·순위·서버 없음) · 시드는 지역 + 몇 번째 싸움 · 방 크기는 본편 전체가 같이 쓰는 값이라 돌릴 때·그릴 때마다 applyRoom
import { applyRoom, createRun, deriveSeed, foeHpMul, makeEnemy, recalcStats, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, stepSim, TICK_MS, type EnemyKind, type RunState, type TickInput, type CharacterId } from "@pixel-rogue/shared";
import { myAccTotals } from "../../event/acc/accStore";
import { loadAchievements } from "../../records";
import { WTILE } from "../worldMap";
import type { Mob } from "../hunt/huntSim";
import type { BattleRoom } from "./battleRoom";

/** 판 밖으로 미는 동안 이 틱 수(1초)가 지나면 도망 · 한 번에 따라잡는 최대 틱 */
const FLEE_TICKS = 60;
const MAX_CATCH_UP = 6;

export interface FieldBattle {
  run: RunState;
  room: BattleRoom;
  /** 본편 적 id → 지도 몬스터 */
  mobs: Map<number, Mob>;
  acc: number;
  push: number;
}

export type BattleEnd = "won" | "fled" | "down";

/** 사냥터 권장 투력 → 본편 층 (적 체력·피해가 층마다 커짐) */
export const floorFor = (power: number): number => Math.max(1, Math.min(6, Math.round(1 + (power - 1500) / 1000)));

/** 판 만들기: 나는 지도 자리 그대로 · 몬스터는 판 안에 있는 것만 (hpLeft: 지도 체력 몫 0~1) */
export function startBattle(room: BattleRoom, who: CharacterId, seed: number, me: readonly [number, number], hpLeft: number, mobs: readonly Mob[], power: number): FieldBattle {
  const s = createRun(deriveSeed(seed, "fieldBattle"), who, loadAchievements());
  s.floor = floorFor(power);
  const info = s.map.rooms[s.roomId]!;
  info.exits = info.exits.map(() => -1);
  info.shape = { id: -2, flip: false, rows: room.shape };
  s.terrain = undefined;
  s.roomCols = room.cols;
  s.roomRows = room.rows;
  applyRoom(s);
  s.rooms[s.roomId]!.pickups = [];
  // 레이드처럼 낀 장신구 능력치 (sim/accStats)
  s.player.acc = myAccTotals();
  recalcStats(s);
  const p = s.player;
  p.hp = Math.max(1, p.stats.maxHp * hpLeft);
  [p.x, p.y] = [me[0] - room.ox * WTILE, me[1] - room.oy * WTILE];
  [p.prevX, p.prevY] = [p.x, p.y];
  const map = new Map<number, Mob>();
  s.enemies = [];
  for (const m of mobs) {
    const e = makeEnemy(s, m.g.kind as EnemyKind, m.x - room.ox * WTILE, m.y - room.oy * WTILE, foeHpMul(s.floor) * Math.max(0.05, m.hp / m.g.hp), 20);
    s.enemies.push(e);
    map.set(e.id, m);
  }
  s.rooms[s.roomId]!.enemies = s.enemies;
  return { run: s, room, mobs: map, acc: 0, push: 0 };
}

/** 판 끝에서 바깥쪽으로 미는지 (도망) */
function pushingOut(s: RunState, input: TickInput): boolean {
  const p = s.player;
  const edge = 2;
  return (input.moveX < 0 && p.x - p.r <= ROOM_MIN_X + edge) || (input.moveX > 0 && p.x + p.r >= ROOM_MAX_X - edge) || (input.moveY < 0 && p.y - p.r <= ROOM_MIN_Y + edge) || (input.moveY > 0 && p.y + p.r >= ROOM_MAX_Y - edge);
}

/** 지난 시간(ms)만큼 틱 진행 · 끝났으면 그 까닭 · 잡은 지도 몬스터는 onKill */
export function stepBattle(b: FieldBattle, ms: number, read: () => TickInput, onKill: (m: Mob) => void, onTick: (s: RunState) => void): BattleEnd | null {
  const s = b.run;
  applyRoom(s);
  b.acc += ms;
  let n = 0;
  while (b.acc >= TICK_MS && n < MAX_CATCH_UP) {
    const input = read();
    b.push = pushingOut(s, input) ? b.push + 1 : 0;
    stepSim(s, input);
    onTick(s);
    b.acc -= TICK_MS;
    n++;
    for (const [id, m] of b.mobs) {
      if (s.enemies.some((e) => e.id === id)) continue;
      b.mobs.delete(id);
      onKill(m);
    }
    if (s.player.hp <= 0 || s.over) return "down";
    if (!s.enemies.length) return "won";
    if (b.push >= FLEE_TICKS) return "fled";
  }
  if (n === MAX_CATCH_UP) b.acc = 0;
  return null;
}

/** 끝난 뒤 지도 자리·체력 몫 · 남은 몬스터 (지도로 돌려보냄) */
export function battleResult(b: FieldBattle): { at: [number, number]; hpLeft: number; alive: [Mob, number, number, number][] } {
  const { run: s, room } = b;
  const alive: [Mob, number, number, number][] = [];
  for (const e of s.enemies) {
    const m = b.mobs.get(e.id);
    if (m) alive.push([m, e.x + room.ox * WTILE, e.y + room.oy * WTILE, e.hp / e.maxHp]);
  }
  return { at: [s.player.x + room.ox * WTILE, s.player.y + room.oy * WTILE], hpLeft: Math.max(0, s.player.hp / s.player.stats.maxHp), alive };
}
