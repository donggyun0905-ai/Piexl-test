// 협동 진행 맞추기 (공용): 메시지 · 입력 묶기 · 상태 요약 · 앞서 짐작해 보여 주기.
// 게임 계산은 시드·입력이 같으면 결과가 같음. 그래서 모두의 입력이 다 모인 틱까지는 "확정"으로 계산하고(모든 화면이 같음),
// 그 뒤 지금 시각까지는 아직 안 온 남의 입력을 "마지막 입력 그대로"로 짐작해 미리 계산해서 보여 줌 (내 조작은 바로 반응).
// 실제 입력이 오면 확정에서 다시 계산하므로 짐작이 틀려도 결과는 모두 같음. 방장이 입력을 확정해 나눠 줌 (hostSync · guestSync)
import { applyRoom, EMPTY_INPUT, stepParty, useSeat, allPlayers, type PwArenaId, type PwLoadout, type PwMode, type RunState, type TickInput } from "@pixel-rogue/shared";

/** 직접 연결로 주고받는 메시지 */
export type CoopMsg =
  /** 손님 → 방장: 연결되자마자 내 해금 목록 */
  | { t: "hi"; unlocks: string[] }
  /** 손님 → 방장: n번 틱부터 내 입력 (SEND_EVERY 틱마다 묶어서) */
  | { t: "in"; n: number; i: number[][] }
  /** 손님 → 방장: 상태가 어긋남, 전체 상태 다시 */
  | { t: "resync" }
  /** 방장 → 손님: 확정 상태와 내 자리. at = 보낼 때 방장의 지금 틱 · watch = 게임 중에 들어온 관전자 (자리 없이 보기만) */
  | { t: "state"; seat: number; s: RunState; at: number; watch?: boolean }
  /** 방장 → 손님: n번 틱부터 확정된 모두의 입력. h = 마지막 틱 뒤 상태 요약, at = 방장의 지금 틱 */
  | { t: "ticks"; n: number; ins: number[][][]; h?: number; at: number }
  /** 빠른 신호 (게임 계산과 상관없음. 방장이 다른 손님에게 넘겨 줌) */
  | { t: "sig"; seat: number; k: number }
  /** 연결 지연 재기: 보낸 시각을 그대로 돌려줌 */
  | { t: "pg"; ts: number }
  /** 패왕전 같이 하기 대기실: 방장 → 손님 대결 · 손님 → 방장 내 준비방 장비 (event/PwRoom) */
  | { t: "pwm"; mode: PwMode; map?: PwArenaId | null }
  | { t: "pwlo"; lo: PwLoadout }
  | { t: "po"; ts: number };

/** 몇 틱마다 상태 요약을 보내 비교할지 (2초) */
export const HASH_EVERY = 120;
/** 몇 틱씩 묶어 보낼지 (메시지 수·중계 사용량 줄이기) */
export const SEND_EVERY = 2;
/** 짐작으로 앞서 갈 수 있는 최대 틱 (넘으면 기다림, 0.6초) */
export const MAX_AHEAD = 36;

const FLAG = { attack: 1, dash: 2, interact: 4, autoAim: 8 };

export function packInput(i: TickInput): number[] {
  const flags = (i.attack ? FLAG.attack : 0) | (i.dash ? FLAG.dash : 0) | (i.interact ? FLAG.interact : 0) | (i.autoAim ? FLAG.autoAim : 0);
  return [i.moveX, i.moveY, i.aimX, i.aimY, flags, i.useSlot, i.pickChoice, i.statPick, i.skill, i.sell ?? 0];
}

export function unpackInput(a: readonly number[] | undefined): TickInput {
  if (!a || a.length < 7) return EMPTY_INPUT;
  const f = a[4]!;
  return {
    moveX: a[0]!,
    moveY: a[1]!,
    aimX: a[2]!,
    aimY: a[3]!,
    attack: (f & FLAG.attack) !== 0,
    dash: (f & FLAG.dash) !== 0,
    interact: (f & FLAG.interact) !== 0,
    autoAim: (f & FLAG.autoAim) !== 0,
    useSlot: a[5]!,
    pickChoice: a[6]!,
    statPick: a[7] ?? 0,
    skill: a[8] ?? 0,
    ...(a[9] ? { sell: a[9] } : {}),
  };
}

/** 짐작용: 계속 누르는 값만 남기고 한 번 누르는 값(대시·상호작용·아이템·보상 고르기·스탯 찍기)은 뺌 */
export function held(i: TickInput): TickInput {
  return i.dash || i.interact || i.useSlot || i.pickChoice || i.statPick || i.skill || i.sell ? { ...i, dash: false, interact: false, useSlot: 0, pickChoice: 0, statPick: 0, skill: 0, sell: 0 } : i;
}

/** 상태 요약 값 (틱·위치·체력) */
export function stateHash(s: RunState): number {
  let h = 2166136261;
  const add = (v: number) => {
    const str = String(v);
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  };
  add(s.tick);
  add(s.nextId);
  add(s.floor);
  add(s.roomId);
  for (const p of allPlayers(s)) [p.x, p.y, p.hp].forEach(add);
  for (const e of s.enemies) [e.id, e.x, e.y, e.hp].forEach(add);
  return h >>> 0;
}

/** 게임 화면이 들고 있는 객체를 다른 상태로 바꿔 끼움 (같은 객체를 그대로 씀) */
export function replaceRun(run: RunState, next: RunState, seat: number): void {
  for (const k of Object.keys(run)) delete (run as unknown as Record<string, unknown>)[k];
  Object.assign(run, next);
  useSeat(run, seat);
  applyRoom(run);
}

/** 확정 상태에서 upTo 틱까지 짐작으로 계산해 화면에 보여 줌 (확정 상태는 그대로) */
export function showPredicted(display: RunState, confirmed: RunState, upTo: number, inputsAt: (tick: number) => TickInput[]): void {
  const s = structuredClone(confirmed);
  for (let t = s.tick + 1; t <= upTo && !s.over; t++) stepParty(s, inputsAt(t));
  // 짐작으로 끝난 판은 확정될 때까지 끝내지 않음 (게임 화면이 멈추지 않게)
  if (s.over && !confirmed.over) s.over = false;
  replaceRun(display, s, s.seat ?? 0);
}
