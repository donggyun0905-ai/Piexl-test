// 패왕전 전쟁의 서막 규칙 (docs/PW_MODES.md 2): 길 셋 · 체크포인트(그 길 상대 맨 앞 포탑을 부숴야 점령 가능 · 점령하면 집에서 순간이동 · 다시 빼앗을 수 있음)
// 물가는 경기장 water(느려짐) · 안개 지역(paewangGrid.fogAt, 밖에서 안이 안 보임) · 1 파멸의 용 · 2 갓이터(잡은 편 모두 강화) · 3·4 정글 몬스터·보스 몬스터
// 승리: 상대 포탑을 다 부수고 상대 집을 점령 · 시간이 다 되면 부순 포탑·체크포인트·큰 보스로 점수
import { TICK_RATE } from "../constants";
import { PW_ARENAS } from "../paewangMaps";
import { PW_WAR } from "../pwRules";
import { spotXY } from "./paewangGrid";
import { allPlayers, eachSeat } from "./party";
import { inPlay } from "./pvpWorld";
import { roundEnd } from "./pvpZone";
import { BASE_R, towersLeft } from "./pwContest";
import { homeOf } from "./pwGrow";
import type { PwUnit } from "./pwGrowTypes";
import { makeUnit } from "./pwLane";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** team이 lane 체크포인트를 점령할 수 있는지 (그 길 상대 맨 앞 포탑이 부서짐) */
export function canPoint(s: RunState, team: number, lane: number): boolean {
  return !s.pvp!.grow!.units.some((u) => u.kind === "tower" && u.team === 1 - team && u.lane === lane && (u.order ?? 0) === 0 && u.body.hp > 0);
}

function present(s: RunState, x: number, y: number, r: number): Set<number> {
  const pv = s.pvp!;
  return new Set(allPlayers(s).flatMap((p, i) => (inPlay(s, i) && (p.x - x) ** 2 + (p.y - y) ** 2 <= r * r ? [pv.seats[i]!.team] : [])));
}

export function warTick(s: RunState): void {
  const pv = s.pvp!;
  const g = pv.grow!;
  const a = PW_ARENAS[pv.arena];
  g.points ??= (a.points ?? []).map(() => ({ owner: -1, prog: {} }));
  g.campAt ??= (a.camps ?? []).map(() => 0);
  // 정글: 비어 있고 때가 되면 다시 나옴
  (a.camps ?? []).forEach((c, k) => {
    if (g.campAt![k]! > s.tick || g.units.some((u) => u.camp === k)) return;
    const u = makeUnit(s, c.kind, 2, ...spotXY(c.at));
    u.camp = k;
    g.units.push(u);
  });
  // 체크포인트
  (a.points ?? []).forEach((pt, k) => {
    const st = g.points![k]!;
    const at = present(s, ...spotXY(pt.at), PW_WAR.pointR);
    if (at.size !== 1) return;
    const team = [...at][0]!;
    if (team === st.owner || !canPoint(s, team, pt.lane)) return;
    st.prog[team] = (st.prog[team] ?? 0) + 100 / (PW_WAR.pointSec * TICK_RATE);
    if (st.prog[team]! >= 100) [st.owner, st.prog] = [team, {}];
  });
  // 상대 집: 상대 포탑을 다 부순 편만
  for (const home of [0, 1]) {
    const atk = 1 - home;
    if (towersLeft(s, home) > 0) continue;
    const at = present(s, ...homeOf(s, home), BASE_R);
    if (at.size === 1 && at.has(atk)) g.base[atk] = Math.min(100, (g.base[atk] ?? 0) + 100 / (PW_WAR.baseSec * TICK_RATE));
  }
}

/** 정글이 쓰러짐: 다시 나올 때 · 큰 보스면 잡은 편 모두 강화 */
export function campDown(s: RunState, u: PwUnit): void {
  const g = s.pvp!.grow!;
  if (u.camp === undefined || !g.campAt) return;
  const big = u.kind === "dragon" || u.kind === "godeater";
  g.campAt[u.camp] = s.tick + (big ? PW_WAR.bigBack : PW_WAR.campBack);
  const by = u.body.lastHit;
  if (!big || by === undefined) return;
  const team = s.pvp!.seats[by]!.team;
  eachSeat(s, (i) => {
    if (s.pvp!.seats[i]!.team !== team || !inPlay(s, i)) return;
    const p = s.player;
    const b = u.kind === "dragon" ? { dmg: PW_WAR.dragon.dmg, rate: PW_WAR.dragon.rate } : { taken: PW_WAR.godeater.taken, regen: PW_WAR.godeater.regen };
    p.pwBuffs = [...(p.pwBuffs ?? []), { t: PW_WAR.buffTicks, ...b }];
    addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 30, width: 2, follow: true });
  });
}

/** 이긴 편 (아직이면 undefined, 비기면 -1) */
export function warWinner(s: RunState): number | undefined {
  const pv = s.pvp!;
  const g = pv.grow!;
  for (const team of [0, 1]) if ((g.base[team] ?? 0) >= 100) return team;
  if (s.tick < roundEnd(s)) return undefined;
  const all = (PW_ARENAS[pv.arena].towers ?? []).length / 2;
  const score = (team: number) => (all - towersLeft(s, 1 - team)) * 2 + (g.points ?? []).filter((p) => p.owner === team).length;
  const kills = (team: number) => pv.seats.filter((x) => x.team === team).reduce((n, x) => n + x.kills, 0);
  const d = score(0) - score(1) || kills(0) - kills(1);
  return d === 0 ? -1 : d > 0 ? 0 : 1;
}
