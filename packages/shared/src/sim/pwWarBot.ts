// 패왕전 전쟁의 서막 AI (pwGrowBot.growSteer가 부름). 편마다 역할: 위 1 · 가운데 1 · 아래 2 · 정글 1 (편 안 자리 차례)
// 10분 전: 위·아래·가운데는 우리 맨 앞 병사 곁에서 병사를 잡으며 상대와 싸움, 병사 없이 상대 포탑 사거리엔 들어가지 않음 (병사가 있으면 포탑도 때림)
//   가운데는 가끔 상대와 붙은 다른 길·정글을 도우러 감 · 정글은 큰 보스를 빼고 정글 몬스터를 돌며 잡고, 다 잡았으면 도우러 가거나 집에서 장보기
// 모두: 체력이 낮거나 돈이 쌓이면 상대가 없는 곳에서 귀환 (가까이 상대가 있으면 먼저 집 쪽으로 물러남)
// 10분 뒤: 나누지 않고 함께 싸우며 포탑 부수기 (원래 길 목표, pwGrowBot.objective) · 정글·가운데는 살아 있는 큰 보스를 노림. 무작위 없음
import { TICK_RATE } from "../constants";
import { PW_ARENAS } from "../paewangMaps";
import { PW_UNIT, PW_WAR } from "../pwRules";
import { spotXY } from "./paewangGrid";
import { allPlayers, seatNo } from "./party";
import { inPlay } from "./pvpWorld";
import { atHome, GROW_MENU, growMenu, homeOf } from "./pwGrow";
import { laneMinutes } from "./pwLane";
import type { RunState, TickInput } from "./types";

export type WarRole = "top" | "mid" | "bot" | "jungle";
const ROLES: readonly WarRole[] = ["top", "mid", "bot", "bot", "jungle"];
/** 역할마다 길 번호 (0 위 · 1 가운데 · 2 아래, 두 편이 같은 길) */
const LANE: Record<WarRole, number> = { top: 0, mid: 1, bot: 2, jungle: 1 };

type Walk = (s: RunState, input: TickInput, x: number, y: number) => TickInput;

/** 자리 i의 역할 (같은 편 안에서 몇 번째인지) */
export function warRole(s: RunState, i: number): WarRole {
  const seats = s.pvp!.seats;
  let k = 0;
  for (let j = 0; j < i; j++) if (seats[j]!.team === seats[i]!.team) k++;
  return ROLES[k % ROLES.length]!;
}

/** 아직 길마다 나뉘어 성장하는 때 (10분 전) */
export const warEarly = (s: RunState): boolean => laneMinutes(s) < PW_WAR.splitMin;

const d2 = (a: { x: number; y: number }, x: number, y: number) => (a.x - x) ** 2 + (a.y - y) ** 2;

/** 우리 편 맨 앞 병사 자리 (없으면 우리 맨 앞 포탑 → 체크포인트) */
function laneFront(s: RunState, team: number, lane: number): [number, number] {
  const g = s.pvp!.grow!;
  let best: (typeof g.units)[number] | undefined;
  for (const u of g.units) {
    if ((u.kind !== "minion" && u.kind !== "archer") || u.team !== team || u.lane !== lane || u.body.hp <= 0) continue;
    if (!best || (team === 0 ? u.wp > best.wp : u.wp < best.wp)) best = u;
  }
  if (best) return [best.body.x, best.body.y];
  const tower = g.units.filter((u) => u.kind === "tower" && u.team === team && u.lane === lane && u.body.hp > 0).sort((x, y) => (x.order ?? 0) - (y.order ?? 0))[0];
  return tower ? [tower.hx, tower.hy] : spotXY(PW_ARENAS[s.pvp!.arena].points![lane]!.at);
}

/** 상대 캐릭터가 (x, y) 둘레 r 안에 있는지 */
function foeNear(s: RunState, team: number, x: number, y: number, r: number): boolean {
  const pv = s.pvp!;
  return allPlayers(s).some((q, j) => pv.seats[j]!.team !== team && inPlay(s, j) && d2(q, x, y) < r * r);
}

/** 우리 병사 없이 상대 포탑 사거리 안 (포탑이 맞지 않는 때) */
function underTower(s: RunState, team: number): boolean {
  const p = s.player;
  const r = PW_UNIT.tower.range + 10;
  return s.pvp!.grow!.units.some((u) => u.kind === "tower" && u.team !== team && u.body.hp > 0 && u.body.immune && d2(p, u.hx, u.hy) < r * r);
}

/** 도와줄 같은 편 (상대 캐릭터와 붙어 있는 사람, 가장 가까운) */
function allyInFight(s: RunState, i: number, team: number): number | undefined {
  const pv = s.pvp!;
  const p = s.player;
  let best: number | undefined;
  let bd = Infinity;
  allPlayers(s).forEach((q, j) => {
    if (j === i || pv.seats[j]!.team !== team || !inPlay(s, j) || !foeNear(s, team, q.x, q.y, 200)) return;
    const d = d2(p, q.x, q.y);
    if (d < bd) [best, bd] = [j, d];
  });
  return best;
}

/** 정글이 갈 몬스터 (큰 보스 빼고, 보스 몬스터는 eliteLv부터, 가장 가까운) */
function nextCamp(s: RunState): [number, number] | null {
  const p = s.player;
  let best: [number, number] | null = null;
  let bd = Infinity;
  for (const u of s.pvp!.grow!.units) {
    if (u.team !== 2 || u.body.hp <= 0 || u.kind === "dragon" || u.kind === "godeater" || (u.kind === "elite" && (p.pwLv ?? 1) < PW_WAR.eliteLv)) continue;
    const d = d2(p, u.body.x, u.body.y);
    if (d < bd) [best, bd] = [[u.body.x, u.body.y], d];
  }
  return best;
}

/** 귀환: 상대가 가까우거나 방금 귀환이 끊겼으면(맞는 중) 집 쪽으로 물러나고, 아니면 그 자리에서 귀환 (5초 가만히) */
function goHome(s: RunState, input: TickInput, walk: Walk, team: number): TickInput {
  const p = s.player;
  const st = s.pvp!.seats[seatNo(s)]!;
  const cut = st.rcAt !== undefined && s.tick - st.rcAt < PW_UNIT.recall + 4 * TICK_RATE;
  if (cut || foeNear(s, team, p.x, p.y, 170)) return walk(s, { ...input, attack: false, skill: 0 }, ...homeOf(s, team));
  growMenu(s, GROW_MENU.recall);
  st.rcAt = s.tick;
  return { ...input, moveX: 0, moveY: 0, attack: false, skill: 0 };
}

/** 전쟁의 서막 AI 움직임 (null = 원래 성장 대결 움직임대로). wantsShop: 집에 가면 살 것이 있는지 */
export function warSteer(s: RunState, input: TickInput, walk: Walk, wantsShop: () => boolean): TickInput | null {
  const i = seatNo(s);
  const pv = s.pvp!;
  const st = pv.seats[i]!;
  const p = s.player;
  const team = st.team;
  const role = warRole(s, i);
  const home = atHome(s, i);
  // 귀환 중이면 가만히 (맞으면 저절로 끊김)
  if (p.pwRecall) return { ...input, moveX: 0, moveY: 0, attack: false, skill: 0 };
  if (!home && (p.hp < p.stats.maxHp * 0.35 || (s.gold >= PW_WAR.shopGold && wantsShop()))) return goHome(s, input, walk, team);
  // 병사 없이 상대 포탑 밑이면 물러남
  if (underTower(s, team)) return walk(s, { ...input, attack: false }, ...homeOf(s, team));
  const early = warEarly(s);
  if (!early) {
    // 10분 뒤: 정글·가운데는 살아 있는 큰 보스부터 (체력이 넉넉할 때), 나머지는 원래 목표
    const big = pv.grow!.units.find((u) => (u.kind === "dragon" || u.kind === "godeater") && u.body.hp > 0);
    if ((role === "jungle" || role === "mid") && big && !input.attack && p.hp > p.stats.maxHp * 0.6) return walk(s, input, big.body.x, big.body.y);
    return null;
  }
  // 돕는 중: 도울 사람이 쓰러졌거나 시간이 지나면 그만
  if (st.roam && (s.tick > st.roam.until || !inPlay(s, st.roam.seat))) st.roam = undefined;
  if (input.attack) return input;
  if (st.roam) {
    const q = allPlayers(s)[st.roam.seat]!;
    return walk(s, input, q.x, q.y);
  }
  if (role === "jungle") {
    const camp = nextCamp(s);
    if (camp) return walk(s, input, ...camp);
    // 다 잡았으면: 붙어 있는 같은 편 돕기 → 돈이 있으면 장보기 → 가장 먼저 다시 나올 자리에서 기다림
    const help = allyInFight(s, i, team);
    if (help !== undefined) {
      st.roam = { seat: help, until: s.tick + 25 * TICK_RATE };
      return input;
    }
    if (!home && s.gold >= PW_WAR.shopGold / 2 && wantsShop()) return goHome(s, input, walk, team);
    const a = PW_ARENAS[pv.arena];
    const at = pv.grow!.campAt ?? [];
    const k = (a.camps ?? []).reduce((m, c, j) => (c.kind === "jungle" && (m < 0 || at[j]! < at[m]!) ? j : m), -1);
    return k >= 0 ? walk(s, input, ...spotXY(a.camps![k]!.at)) : input;
  }
  const lane = LANE[role];
  // 집에서: 우리 길 체크포인트를 가졌으면 순간이동
  if (home && pv.grow!.points?.[lane]?.owner === team) growMenu(s, GROW_MENU.tp + lane);
  // 가운데: 20초마다 한 번, 체력이 넉넉하면 붙어 있는 다른 길·정글을 도우러 감 (20초)
  if (role === "mid" && (s.tick + i * 131) % (20 * TICK_RATE) === 0 && p.hp > p.stats.maxHp * 0.6) {
    const help = allyInFight(s, i, team);
    if (help !== undefined) {
      st.roam = { seat: help, until: s.tick + 20 * TICK_RATE };
      return input;
    }
  }
  return walk(s, input, ...laneFront(s, team, lane));
}
