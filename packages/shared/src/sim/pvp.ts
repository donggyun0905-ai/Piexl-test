// 이벤트 '패왕전': 나·친구·AI 모두 진짜 캐릭터(협동 자리 s.party)로 겨룸. AI는 사람처럼 키를 누름 (pvpBot)
// 파일: pvpWorld(그림자 적·피해 옮기기) · pvpBot(AI 입력) · pvpFlow(쓰러짐·차례·레벨·함정·아이템·승패) · paewangKit(장비)
// · 상태 paewangTypes(PvpState) · 수치 paewangDefs·paewangMaps
import { CHARACTER_IDS, type CharacterId } from "../content";
import { PW, PW_MODE, PW_TIERS, type PwMode } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { createRng, deriveSeed } from "../rng";
import { updateItems } from "./items";
import { PLAIN_SHAPE } from "./layout";
import { spotXY } from "./paewangGrid";
import { applyLoadout, gunSwap, randomLoadout } from "./paewangKit";
import type { PvpSeat, PwLoadout } from "./paewangTypes";
import { allPlayers, eachSeat, seatNo, useSeat } from "./party";
import { createParty } from "./partyRun";
import { botInput } from "./pvpBot";
import { bringBack, decide, freshStart, settleDeaths, updateDrops, updateTraps, watchTeam } from "./pvpFlow";
import { inPlay, makeProxies, pvpWorld, syncProxies } from "./pvpWorld";
import { applyRoom } from "./rooms";
import { stepPlayer } from "./run";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";

/** 사람 한 명: 고른 캐릭터·준비방 장비 (데스매치는 무시하고 무작위) */
export interface PwHuman {
  characterId: CharacterId;
  loadout?: PwLoadout;
}

/** 모드의 전체 자리 수 */
export function pwSeatCount(mode: PwMode): number {
  const def = PW_MODE[mode];
  return def.ffa ? def.foes + 1 : (def.allies + 1) * 2;
}

/** 판 만들기: 사람은 앞 자리부터 (팀 대결은 우리 편이 다 차면 상대 편으로), 나머지는 AI · null 자리도 AI (랭크전은 사람을 두 편에 나눔) */
export function createPvp(seed: number, mode: PwMode, humans: readonly (PwHuman | null)[]): RunState {
  const def = PW_MODE[mode];
  const arena = PW_ARENAS[def.arena];
  const n = pwSeatCount(mode);
  const size = def.allies + 1;
  const rng = createRng(deriveSeed(seed, "pwRoster"));
  const chars = Array.from({ length: n }, (_, i): CharacterId => (mode === "gungame" ? PW_TIERS[0]! : (humans[i]?.characterId ?? rng.pick(CHARACTER_IDS))));
  const s = createParty(seed, chars.map((characterId) => ({ characterId, unlocks: [] })));
  s.map = { floor: 1, rooms: [{ id: 0, layer: 0, lane: 1, type: "start", exits: [-1, -1, -1], shape: PLAIN_SHAPE }], startId: 0, exitId: 0, layers: 1 };
  s.rooms = [{ visited: true, cleared: true, pickups: [], enemies: null }];
  s.roomCols = arena.cols;
  s.roomRows = arena.rows;
  s.enemies = [];
  s.projectiles = [];
  const seats = chars.map((_, i): PvpSeat => {
    const team = def.ffa ? 100 + i : i < size ? 0 : 1;
    // 토너먼트는 편마다 첫 사람만 나옴
    const on = mode !== "tourney" || i % size === 0;
    return { team, human: !!humans[i], on, kills: 0, deaths: 0, lv: 1, stun: 0, slow: 0, root: 0, side: i % 2 ? 1 : -1, sideT: 60, stuck: 0, goalX: 0, goalY: 0, dashCd: 0 };
  });
  s.pvp = { mode, arena: def.arena, seats, proxies: [] };
  applyRoom(s);
  eachSeat(s, (i) => {
    const seat = seats[i]!;
    const spot = def.ffa ? arena.spots[i % arena.spots.length]! : (seat.team === 0 ? arena.teamA : arena.teamB)[(i % size) % arena.teamA.length]!;
    const [x, y] = spotXY(spot);
    const p = s.player;
    p.x = p.prevX = x;
    p.y = p.prevY = y;
    p.faceX = seat.team === 1 ? -1 : 1;
    const lo = humans[i]?.loadout;
    if (mode === "gungame") gunSwap(s, chars[i]!, i * 100 + 1);
    else applyLoadout(s, lo ?? randomLoadout(chars[i]!, createRng(deriveSeed(seed, "pwBotKit", i))));
    freshStart(s);
  });
  useSeat(s, 0);
  makeProxies(s);
  return s;
}

/** 한 틱 진행. inputs[i] = i번 사람 자리 입력 (AI 자리는 스스로). 계산은 늘 0번 자리부터, 끝나면 보던 자리로 */
export function stepPvp(s: RunState, inputs: readonly TickInput[]): void {
  const pv = s.pvp;
  if (!pv || s.over) return;
  const view = seatNo(s);
  useSeat(s, 0);
  applyRoom(s);
  s.tick++;
  for (const b of [...allPlayers(s), ...s.projectiles]) {
    b.prevX = b.x;
    b.prevY = b.y;
  }
  const start = syncProxies(s);
  eachSeat(s, (i) => {
    const seat = pv.seats[i]!;
    s.prompt = { kind: "none" };
    if (!inPlay(s, i)) return;
    // 사람은 자동 공격 없이 직접 조준만 (AI는 그대로)
    let input = seat.human ? { ...(inputs[i] ?? EMPTY_INPUT), autoAim: false } : botInput(s);
    // 기절: 아무것도 못 함 · 묶임: 못 움직임 · 느려짐: 반만
    if (seat.stun > 0) input = EMPTY_INPUT;
    else if (seat.root > 0) input = { ...input, moveX: 0, moveY: 0, dash: false };
    else if (seat.slow > 0) input = { ...input, moveX: Math.round(input.moveX / 2), moveY: Math.round(input.moveY / 2) };
    for (const k of ["stun", "slow", "root"] as const) if (seat[k] > 0) seat[k]--;
    stepPlayer(s, input);
    for (const pr of s.projectiles) if (pr.fromPlayer && pr.shooter === undefined) pr.shooter = i;
    updateItems(s, input);
  });
  pvpWorld(s, start);
  updateTraps(s);
  updateDrops(s);
  settleDeaths(s);
  bringBack(s);
  watchTeam(s);
  decide(s);
  useSeat(s, view);
}

/** 패왕전 능력치: AI는 모드 보정(체력·공격력) (items.recalcStats가 부름) */
export function pvpStats(s: RunState): void {
  const pv = s.pvp;
  if (!pv) return;
  const st = s.player.stats;
  const seat = pv.seats[seatNo(s)];
  const diff = PW_MODE[pv.mode].diff;
  st.maxHp = Math.round(st.maxHp * (seat && !seat.human ? diff.hp : 1));
  if (seat && !seat.human) st.damage *= diff.dmg;
}

/** 결과 (me = 내 자리): 이겼는지 · 처치·데스 · 데스매치 레벨 · 대난투 순위 · 받을 돈 */
export function pvpResult(s: RunState, me = 0): { won: boolean; kills: number; deaths: number; lv: number; place: number; reward: number } {
  const pv = s.pvp!;
  const seat = pv.seats[me]!;
  const won = pv.winner === seat.team;
  return { won, kills: seat.kills, deaths: seat.deaths, lv: Math.min(seat.lv, PW.gunLevels), place: won ? 1 : (pv.place ?? 0), reward: won ? PW_MODE[pv.mode].reward : 0 };
}
