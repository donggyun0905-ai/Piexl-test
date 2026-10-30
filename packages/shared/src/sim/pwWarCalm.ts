// 전쟁의 서막 AI 판단 (pvpBot·pwWarBot이 부름): 큰 보스는 우리 편이 셀 때만 핑을 찍고 모여서 잡음 · 핑 따르기 · 10분 전엔 상대 캐릭터를 먼저 치지 않음
import { PW_MODE } from "../paewangDefs";
import { PW_PING, PW_WAR } from "../pwRules";
import { allPlayers, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { homeOf } from "./pwGrow";
import type { PwUnit } from "./pwGrowTypes";
import { laneMinutes } from "./pwLane";
import { addPing, teamPing } from "./pwPing";
import type { EnemyState, RunState, TickInput } from "./types";
import { weaponOf } from "./util";

type Walk = (s: RunState, input: TickInput, x: number, y: number) => TickInput;
const isWar = (s: RunState) => PW_MODE[s.pvp!.mode].rule === "war";
const BOSS_PING = 25 * 60;

const bigBoss = (s: RunState): PwUnit | undefined => s.pvp!.grow!.units.find((u) => (u.kind === "dragon" || u.kind === "godeater") && u.body.hp > 0);

/** 살아 있는 우리 편 (자리 번호) */
const alive = (s: RunState, team: number) => s.pvp!.seats.flatMap((x, j) => (x.team === team && inPlay(s, j) ? [j] : []));

/** 보스 둘레(220px)에 모인 우리 편 수가 넉넉한지 */
function gathered(s: RunState, team: number, u: PwUnit): boolean {
  const all = alive(s, team);
  const ps = allPlayers(s);
  const n = all.filter((j) => (ps[j]!.x - u.body.x) ** 2 + (ps[j]!.y - u.body.y) ** 2 < 220 ** 2).length;
  return n >= Math.min(PW_WAR.bossGather, all.length);
}

/** AI가 이 적을 노리지 않음: 큰 보스는 우리 편 보스 핑이 있고 모였을 때만 · 10분 전 상대 캐릭터는 맞았거나 가까울 때만 */
export function warSkip(s: RunState, e: EnemyState, d2: number): boolean {
  if (!isWar(s)) return false;
  const pv = s.pvp!;
  const st = pv.seats[seatNo(s)]!;
  const u = pv.grow!.units.find((x) => x.body === e);
  if (u && (u.kind === "dragon" || u.kind === "godeater")) return !(teamPing(s, st.team, "boss", BOSS_PING) && gathered(s, st.team, u));
  if (u || laneMinutes(s) >= PW_WAR.splitMin) return false;
  if (st.hurtAt !== undefined && s.tick - st.hurtAt < PW_WAR.calmHurt) return false;
  const w = weaponOf(s.player);
  const r = (w.kind === "melee" ? w.range : w.range * 0.5) + e.r;
  return d2 > r * r;
}

/** 핑 따르기 · 큰 보스 (null = 원래대로) */
export function pingSteer(s: RunState, input: TickInput, walk: Walk, team: number, caller: boolean): TickInput | null {
  const p = s.player;
  const i = seatNo(s);
  const big = bigBoss(s);
  // 큰 보스: 정글·가운데가 우리 편이 넉넉히 셀 때 '잡겠습니다' 핑 → 모두 모여 기다렸다가 함께 침
  if (big) {
    let ping = teamPing(s, team, "boss", BOSS_PING);
    if (!ping && caller && p.hp > p.stats.maxHp * 0.6) {
      const all = alive(s, team);
      const lv = all.reduce((n, j) => n + (allPlayers(s)[j]!.pwLv ?? 1), 0);
      if (all.length >= PW_WAR.bossGather && lv >= (PW_WAR.bossLv[big.kind] ?? 40)) ping = addPing(s, i, big.body.x, big.body.y);
    }
    if (ping?.kind === "boss" && p.hp > p.stats.maxHp * 0.45) {
      if (gathered(s, team, big)) return walk(s, input, big.body.x, big.body.y);
      if (input.attack) return input;
      // 보스 손이 닿지 않는 곳(우리 집 쪽 130px)에서 기다림
      const [hx, hy] = homeOf(s, team);
      const len = Math.hypot(hx - big.body.x, hy - big.body.y) || 1;
      return walk(s, input, big.body.x + ((hx - big.body.x) / len) * 130, big.body.y + ((hy - big.body.y) / len) * 130);
    }
  }
  if (input.attack) return null;
  // 위험 핑 둘레면 집 쪽으로 · 모여·공격 핑은 가까우면 감
  const danger = teamPing(s, team, "danger", 3 * 60);
  if (danger && (p.x - danger.x) ** 2 + (p.y - danger.y) ** 2 < 300 ** 2) return walk(s, input, ...homeOf(s, team));
  const go = teamPing(s, team, "go") ?? teamPing(s, team, "attack");
  if (go && go.seat !== i && pv(s, go.seat) && (p.x - go.x) ** 2 + (p.y - go.y) ** 2 < PW_PING.follow ** 2) return walk(s, input, go.x, go.y);
  return null;
}

/** 핑을 찍은 사람이 사람(사람 핑만 AI가 따라감, AI끼리는 보스 핑만) */
const pv = (s: RunState, seat: number) => !!s.pvp!.seats[seat]?.human;
