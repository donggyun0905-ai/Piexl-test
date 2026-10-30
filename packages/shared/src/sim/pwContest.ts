// 패왕전 쟁탈전 규칙 (docs/PW_MODES.md 1): 상대 포탑 둘을 다 부숴야 가운데 점령지를 처음 점령할 수 있음 (그 뒤로는 서로 계속 빼앗음) → 가운데를 가진 편은 병사가 강해지고 상대 집 보스를 때릴 수 있음
// 상대 집 보스를 잡으면 그 집 점령지를 점령할 수 있고, 점령하면 승리 · 시간이 다 되면 부순 포탑·가운데·보스로 점수
import { TICK_RATE, TILE_SIZE } from "../constants";
import { PW_ARENAS } from "../paewangMaps";
import { PW_CONTEST } from "../pwRules";
import { allPlayers } from "./party";
import { inPlay } from "./pvpWorld";
import { roundEnd } from "./pvpZone";
import { inCapZone } from "./pwCapture";
import { homeOf } from "./pwGrow";
import type { RunState } from "./types";

/** 집 점령지 반지름 (px) */
export const BASE_R = 4 * TILE_SIZE;

/** 편 team의 살아 있는 포탑 수 */
export const towersLeft = (s: RunState, team: number): number => s.pvp!.grow!.units.filter((u) => u.kind === "tower" && u.team === team && u.body.hp > 0).length;

/** team이 가운데를 점령할 수 있는지 (상대 포탑을 다 부숨) */
export const canTakeCenter = (s: RunState, team: number): boolean => towersLeft(s, 1 - team) === 0;

function present(s: RunState, inside: (x: number, y: number) => boolean): Set<number> {
  const pv = s.pvp!;
  return new Set(allPlayers(s).flatMap((p, i) => (inPlay(s, i) && inside(p.x, p.y) ? [pv.seats[i]!.team] : [])));
}

export function contestTick(s: RunState): void {
  const pv = s.pvp!;
  const g = pv.grow!;
  const a = PW_ARENAS[pv.arena];
  // 집 보스: 상대가 가운데를 가져야 맞음
  for (const u of g.units) if (u.kind === "boss") u.body.immune = g.owner !== 1 - u.team;
  // 가운데: 처음(주인 없음)은 상대 포탑 둘을 부숴야 점령 · 주인이 생긴 뒤로는 포탑과 상관없이 서로 계속 빼앗음 · 주인 편만 있으면 상대가 쌓던 점령도가 줄어듦
  const mid = present(s, (x, y) => inCapZone(a, x, y));
  if (mid.size === 1) {
    const team = [...mid][0]!;
    const rate = 100 / (PW_CONTEST.centerSec * TICK_RATE);
    if (team === g.owner) for (const k of [0, 1]) g.center[k] = Math.max(0, (g.center[k] ?? 0) - rate);
    else if (g.owner !== undefined || canTakeCenter(s, team)) {
      g.center[team] = (g.center[team] ?? 0) + rate;
      if (g.center[team]! >= 100) {
        g.owner = team;
        g.center = {};
      }
    }
  }
  // 상대 집 점령: 그 집 보스가 쓰러졌고 집 둘레에 공격하는 편만
  for (const home of [0, 1]) {
    if (!g.bossDown[home]) continue;
    const [hx, hy] = homeOf(s, home);
    const at = present(s, (x, y) => (x - hx) ** 2 + (y - hy) ** 2 <= BASE_R ** 2);
    const atk = 1 - home;
    if (at.size === 1 && at.has(atk)) g.base[atk] = Math.min(100, (g.base[atk] ?? 0) + 100 / (PW_CONTEST.baseSec * TICK_RATE));
  }
}

/** 이긴 편 (아직이면 undefined, 비기면 -1) */
export function contestWinner(s: RunState): number | undefined {
  const pv = s.pvp!;
  const g = pv.grow!;
  for (const team of [0, 1]) if ((g.base[team] ?? 0) >= 100) return team;
  if (s.tick < roundEnd(s)) return undefined;
  const score = (team: number) => (2 - towersLeft(s, 1 - team)) + (g.owner === team ? 2 : 0) + (g.bossDown[1 - team] ? 3 : 0);
  const kills = (team: number) => pv.seats.filter((x) => x.team === team).reduce((n, x) => n + x.kills, 0);
  const d = score(0) - score(1) || kills(0) - kills(1);
  return d === 0 ? -1 : d > 0 ? 0 : 1;
}
