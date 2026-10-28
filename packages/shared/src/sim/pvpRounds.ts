// 패왕전 3판 2선승: 한 판이 끝나면 이긴 편 점수 +1, 두 판을 먼저 이긴 편이 승리 · 다음 판은 모두 처음 자리·체력으로 (처치·데스·피해 기록은 이어짐)
import { PW, PW_MODE } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { spotXY } from "./paewangGrid";
import { eachSeat } from "./party";
import { freshStart } from "./pvpFlow";
import { recapReset } from "./pvpRecap";
import type { RunState } from "./types";

/** i번 자리를 시작 자리에 (팀 대결은 편마다 자리, 모두가 적이면 자리 목록) */
export function placeSeat(s: RunState, i: number): void {
  const pv = s.pvp!;
  const def = PW_MODE[pv.mode];
  const arena = PW_ARENAS[pv.arena];
  const seat = pv.seats[i]!;
  const size = def.allies + 1;
  const spot = def.ffa ? arena.spots[i % arena.spots.length]! : (seat.team === 0 ? arena.teamA : arena.teamB)[(i % size) % arena.teamA.length]!;
  const [x, y] = spotXY(spot);
  recapReset(seat);
  const p = s.player;
  p.x = p.prevX = x;
  p.y = p.prevY = y;
  p.faceX = seat.team === 1 ? -1 : 1;
  p.faceY = 0;
}

/** 한 판의 승자가 정해짐: 시리즈가 이어지면 다음 판을 열고 true (비기면 점수 없이 다시) · 끝났으면 false */
export function nextRound(s: RunState, team: number): boolean {
  const pv = s.pvp!;
  const def = PW_MODE[pv.mode];
  if (def.rounds <= 1) return false;
  const wins = (pv.wins ??= {});
  if (team >= 0) wins[team] = (wins[team] ?? 0) + 1;
  if (team >= 0 && wins[team]! > def.rounds / 2) return false;
  pv.round = (pv.round ?? 1) + 1;
  pv.lastRound = { team, at: s.tick };
  // 마지막에 쓰러진 사람도 끝난 장면을 보게 잠시 그대로 두었다가 정리 (resetRound)
  pv.resetAt = s.tick + PW.roundWait;
  return true;
}

/** 다음 판 준비: 판 사이 정리 · 자리로 · 3·2·1 */
export function resetRound(s: RunState): void {
  const pv = s.pvp!;
  const def = PW_MODE[pv.mode];
  pv.resetAt = undefined;
  pv.readyAt = s.tick + PW.ready + PW.roundGap;
  // 판 사이 정리: 탄·효과·폭발·위험 표시·바닥 물건·얼음
  s.projectiles = [];
  s.effects = [];
  s.pendingBlasts = [];
  s.hazards = [];
  s.rooms[s.roomId]!.pickups = [];
  pv.orbs = [];
  pv.ice = [];
  pv.casts = [];
  pv.mins = [];
  const size = def.allies + 1;
  eachSeat(s, (i) => {
    const seat = pv.seats[i]!;
    seat.on = pv.mode !== "tourney" || i % size === 0;
    seat.fell = false;
    seat.back = seat.by = seat.iced = undefined;
    seat.stun = seat.slow = seat.root = seat.silence = 0;
    seat.push = undefined;
    const p = s.player;
    p.pwCd = undefined;
    p.pwBuffs = p.pwDash = undefined;
    placeSeat(s, i);
    freshStart(s);
  });
}
