// 협동: 여러 플레이어가 한 판(RunState)을 같이 씀.
// 사람마다 다른 값(플레이어·돈·안내·주운 기록 등)은 자리(Seat)에 두고, 계산할 때 그 사람 자리를 RunState에 꺼내 놓는다.
// 그래서 기존 계산 코드는 s.player만 보면 됨. 혼자 하기(party 없음)는 아무것도 바뀌지 않음
import { ROOM_WIDTH } from "../constants";
import type { Body, BuyLogEntry, Device, PlayerState, Prompt, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 방에 들어설 때 자리: 가로로 나란히 (혼자면 가운데) */
  SPREAD: 14,
};
export { R as PARTY_RULES };

export const PARTY_MAX = 5;
/** 협동 적 세기: 한 명 늘 때마다 적 체력 +20%, 일반 적 수 +25% (1:1로 늘리지 않음. 테스트하며 조정) */
export const PARTY_HP_STEP = 0.2;
export const PARTY_COUNT_STEP = 0.25;

/** 인원에 따른 적 체력 배율 (혼자면 1) */
export function partyHpMul(s: RunState): number {
  const n = s.party?.length ?? 1;
  return n > 1 ? 1 + PARTY_HP_STEP * (n - 1) : 1;
}

/** 인원에 따라 더 나오는 일반 적 수 (혼자면 0) */
export function partyExtraEnemies(s: RunState, base: number): number {
  const n = s.party?.length ?? 1;
  return n > 1 ? Math.round(base * PARTY_COUNT_STEP * (n - 1)) : 0;
}

/** 사람마다 따로인 값 */
export interface Seat {
  player: PlayerState;
  prompt: Prompt;
  nearPickupId: number;
  holdPickupId: number;
  holdTicks: number;
  gold: number;
  goldEarned: number;
  goldSpent: number;
  purchases: number;
  roomDamaged: boolean;
  autoTargetId: number;
  unlocks: string[];
  buys: BuyLogEntry[];
  /** 기계공학자 장치 */
  devices?: Device[];
}

export function seatOf(s: Seat | RunState): Seat {
  return {
    player: s.player,
    prompt: s.prompt,
    nearPickupId: s.nearPickupId,
    holdPickupId: s.holdPickupId,
    holdTicks: s.holdTicks,
    gold: s.gold,
    goldEarned: s.goldEarned,
    goldSpent: s.goldSpent,
    purchases: s.purchases,
    roomDamaged: s.roomDamaged,
    autoTargetId: s.autoTargetId,
    unlocks: s.unlocks,
    buys: s.buys,
    devices: s.devices,
  };
}

/** 지금 꺼내 놓은 자리 번호 (혼자 하기는 0) */
export function seatNo(s: RunState): number {
  return s.seat ?? 0;
}

/** i번 자리를 꺼내 놓음 (지금 자리는 저장) */
export function useSeat(s: RunState, i: number): void {
  const party = s.party;
  if (!party || s.seat === i) return;
  party[seatNo(s)] = seatOf(s);
  Object.assign(s, party[i]!);
  s.seat = i;
}

/** 지금 자리 값을 party 목록에도 적어 둠 (저장·보내기 전에) */
export function syncSeat(s: RunState): void {
  if (s.party) s.party[seatNo(s)] = seatOf(s);
}

export const isAlive = (p: PlayerState): boolean => p.hp > 0;

/** 자리마다 그 자리를 꺼내 놓고 fn 실행 (끝나면 원래 자리로). aliveOnly: 살아 있는 사람만 */
export function eachSeat(s: RunState, fn: (i: number) => void, aliveOnly = false): void {
  const party = s.party;
  if (!party) {
    if (!aliveOnly || isAlive(s.player)) fn(0);
    return;
  }
  const back = seatNo(s);
  for (let i = 0; i < party.length; i++) {
    useSeat(s, i);
    if (!aliveOnly || isAlive(s.player)) fn(i);
  }
  useSeat(s, back);
}

/** 모든 플레이어 (지금 꺼낸 자리 포함) */
export function allPlayers(s: RunState): PlayerState[] {
  if (!s.party) return [s.player];
  return s.party.map((seat, i) => (i === seatNo(s) ? s.player : seat.player));
}

/** 가장 가까운 살아 있는 사람 자리 (거리가 같으면 앞 번호). 없으면 지금 자리 */
export function nearestSeat(s: RunState, b: Body): number {
  let best = seatNo(s);
  let bestD = Infinity;
  allPlayers(s).forEach((p, i) => {
    if (!isAlive(p)) return;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

export function placeParty(s: RunState, y: number, resetDash = true): void {
  const list = allPlayers(s);
  list.forEach((p, i) => {
    p.x = p.prevX = ROOM_WIDTH / 2 + (i - (list.length - 1) / 2) * R.SPREAD;
    p.y = p.prevY = y;
    if (resetDash) p.dashTicks = 0;
  });
}
