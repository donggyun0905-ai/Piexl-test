// 협동 한 판: 시작·한 틱. 혼자 하기(run.ts)와 같은 순서로, 사람마다 자리를 꺼내 놓고 계산 (party.ts)
import { stepPvp } from "./pvp";
import type { CharacterId } from "../content";
import { updateItems } from "./items";
import { allyFeed } from "./allies";
import { allPlayers, eachSeat, isAlive, seatNo, seatOf, useSeat } from "./party";
import { applyRoom, checkCleared, climb, goThrough, onStairs, startFloor, touchingExit } from "./rooms";
import { checkDeath, createRun, newPlayer, stepPlayer, stepWorld } from "./run";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";
import { FLEE_COST } from "./util";
import { tabooSum } from "./taboo";
import { withGymFx } from "./gymPerks";
import { raidHuman, raidInputs, raidLocked } from "./raid";
import { raidAfter, raidLivesLeft } from "./raidLife";

export interface PartyMember {
  characterId: CharacterId;
  /** 그 사람의 해금 (아이템이 사람마다 따로 나오므로 각자 적용) */
  unlocks: readonly string[];
}

/** 협동 시작: 0번 자리가 방장 */
/** 이 인원부터 큰 방 */
export const BIG_ROOM_PLAYERS = 3;

export function createParty(seed: number, members: readonly PartyMember[]): RunState {
  const first = members[0]!;
  const s = createRun(seed, first.characterId, first.unlocks);
  const base = seatOf(s);
  s.party = members.map((m, i) =>
    i === 0 ? base : { ...base, player: newPlayer(m.characterId, s.player.x, s.player.y), devices: [], prompt: { kind: "none" }, unlocks: [...m.unlocks], buys: [] },
  );
  s.seat = 0;
  // 3명부터 큰 방
  s.big = members.length >= BIG_ROOM_PLAYERS;
  applyRoom(s);
  // 모두 자리 잡은 뒤 첫 층을 다시 시작 (아이템이 사람마다 놓이게)
  s.floorLog = [];
  startFloor(s, 1);
  return s;
}

/**
 * 한 틱 진행. inputs[i] = i번 자리 사람의 입력 (없으면 가만히).
 * 화면마다 꺼내 놓은 자리(내 자리)가 달라도 결과가 같게, 계산은 늘 0번 자리를 꺼내 놓고 시작함
 */
export function stepParty(s: RunState, inputs: readonly TickInput[]): void {
  // 패왕전을 같이 하는 판 (협동 방·진행 맞추기를 그대로 씀)
  if (s.pvp) return stepPvp(s, inputs);
  if (s.over) return;
  // 레이드: AI 자리 입력을 채움 (sim/raid)
  if (s.raidBoss) inputs = raidInputs(s, inputs);
  applyRoom(s);
  const view = seatNo(s);
  useSeat(s, 0);
  // 단련의 방 효과 강화는 자리마다 (s.player가 바뀌면 그 사람 단계로, sim/gymPerks)
  withGymFx(s, () => tick(s, inputs));
  useSeat(s, view);
}

function tick(s: RunState, inputs: readonly TickInput[]): void {
  s.tick++;
  for (const b of [...allPlayers(s), ...s.enemies, ...s.projectiles]) {
    b.prevX = b.x;
    b.prevY = b.y;
  }
  const inputOf = (i: number) => inputs[i] ?? EMPTY_INPUT;
  eachSeat(
    s,
    (i) => {
      stepPlayer(s, inputOf(i));
      // 방금 쏜 탄에 쏜 사람 표시 (장치·회전체가 쏜 것 포함)
      for (const pr of s.projectiles) if (pr.fromPlayer && pr.shooter === undefined) pr.shooter = i;
    },
    true,
  );
  partyRoom(s, inputOf);
  if (s.over) return;
  eachSeat(
    s,
    (i) => {
      updateItems(s, inputOf(i));
      allyFeed(s, inputOf(i));
    },
    true,
  );
  stepWorld(s);
  eachSeat(s, () => checkDeath(s), true);
  raidAfter(s);
  if (!allPlayers(s).some(isAlive) && !raidLivesLeft(s)) s.over = true;
}

/** 출구·계단: 살아 있는 모두가 같은 출구(계단)에 서야 이동. 모이는 중이면 몇 명 왔는지 안내 */
function partyRoom(s: RunState, inputOf: (i: number) => TickInput): void {
  checkCleared(s);
  const cleared = s.rooms[s.roomId]!.cleared;
  eachSeat(s, () => {
    s.prompt = { kind: "none" };
  });
  const alive: { i: number; lane: number; stairs: boolean }[] = [];
  eachSeat(s, (i) => raidHuman(s, i) && alive.push({ i, lane: touchingExit(s), stairs: onStairs(s) }), true);
  const need = alive.length;
  if (need === 0) return;
  const players = allPlayers(s);
  const pressed = alive.some((a) => inputOf(a.i).interact);
  const gather = (pick: (a: (typeof alive)[number]) => boolean) => {
    const have = alive.filter(pick);
    for (const a of have) {
      useSeat(s, a.i);
      s.prompt = { kind: "gather", have: have.length, need };
    }
    useSeat(s, alive[0]!.i);
  };

  if (raidLocked(s, alive[0]!.lane)) return;
  const lane = alive[0]!.lane;
  if (alive.some((a) => a.lane >= 0)) {
    if (!alive.every((a) => a.lane === lane)) return gather((a) => a.lane >= 0);
    if (cleared) {
      const push = alive.some((a) => inputOf(a.i).moveY < 0 || players[a.i]!.dashTicks > 0);
      if (push) goThrough(s, lane);
      return;
    }
    // 레이드: 잠긴 방(성좌를 아직 안 고름)은 못 나감
    if (s.raidBoss) return;
    // 잠긴 출구: 모두 각자 체력을 내야 나갈 수 있음 (한 명이라도 모자라면 불가)
    const costs = alive.map((a) => Math.ceil(players[a.i]!.stats.maxHp * (FLEE_COST + tabooSum(s, "fleeCost"))));
    alive.forEach((a, k) => {
      useSeat(s, a.i);
      s.prompt = { kind: "flee", lane, cost: costs[k]! };
    });
    if (pressed && alive.every((a, k) => players[a.i]!.hp > costs[k]!)) {
      alive.forEach((a, k) => (players[a.i]!.hp -= costs[k]!));
      goThrough(s, lane);
    }
    return;
  }
  if (alive.some((a) => a.stairs)) {
    if (!alive.every((a) => a.stairs)) return gather((a) => a.stairs);
    eachSeat(s, () => (s.prompt = { kind: "stairs" }), true);
    if (pressed) climb(s);
  }
}
