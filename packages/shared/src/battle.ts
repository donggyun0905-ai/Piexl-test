// 배틀 공용: 서버와 주고받는 메시지 · 순위 매기기. 서버는 게임을 다시 계산하지 않고 상태만 전달
import type { CharacterId } from "./content";

export const BATTLE_MAX_PLAYERS = 10;
/** 협동 방 (같은 대기실을 씀): 최대 인원, 시간 제한 없음 (방은 이만큼 지나면 정리) */
export const COOP_MAX_PLAYERS = 5;
export const COOP_ROOM_MS = 6 * 60 * 60 * 1000;
/** battle: 같은 시드 레이스 · coop: 협동 (게임은 플레이어끼리 직접 연결, 서버는 대기실·연결 주선만) */
export type RoomKind = "battle" | "coop";
/** 시간 제한 15분 */
export const BATTLE_DURATION_MS = 15 * 60 * 1000;
/** 시작 전 카운트다운 */
export const BATTLE_COUNTDOWN_MS = 5000;
/** 빠른 매칭: 두 번째 사람이 들어오고 이만큼 기다렸다 시작 */
export const QUICK_WAIT_MS = 20_000;
/** 나간 뒤 이만큼 안 돌아오면 기권패 */
export const RECONNECT_MS = 60_000;
/** 상태는 바뀔 때만, 이 간격보다 자주 보내지 않음 */
export const STATUS_INTERVAL_MS = 1000;

/** playing은 startAt 전까지 카운트다운 */
export type BattlePhase = "lobby" | "playing" | "done";
/** watch: 협동 방에 게임 중에 들어와 관전하는 사람 (방으로 돌아가면 같이 함) */
export type BattleState = "alive" | "dead" | "cleared" | "timeout" | "forfeit" | "watch";

export interface BattlePlayer {
  pid: string;
  name: string;
  characterId: CharacterId;
  connected: boolean;
  state: BattleState;
  floor: number;
  roomId: number;
  hp: number;
  maxHp: number;
  score: number;
  kills: number;
  /** 끝난 시각 (ms, 같은 점수면 먼저 끝낸 사람이 위) */
  finishedAt: number;
  /** 연결이 끊긴 시각 (0이면 연결됨) */
  leftAt: number;
  /** 이 사람 화면에 들어 있는 게임 수치의 지문 (관리자 페이지) */
  balance?: string;
}

export interface RoomView {
  code: string;
  mode: "quick" | "private";
  /** 없으면 battle (예전 방) */
  kind?: RoomKind;
  phase: BattlePhase;
  seedText: string;
  startAt: number;
  endAt: number;
  hostPid: string;
  /** 빠른 매칭 자동 시작 시각 (0 = 아직) */
  autoStartAt: number;
  players: BattlePlayer[];
  /** 이 판의 게임 수치 지문 (시작할 때 방장 것으로 정함. 모두 이 수치로 함) */
  balance?: string;
  /** 서버 시각 (화면 시계 맞추기) */
  now: number;
}

/** 화면 → 서버 */
export type ClientMsg =
  | { t: "hello"; pid: string; name: string; characterId: CharacterId; balance?: string }
  | { t: "character"; characterId: CharacterId }
  | { t: "start" }
  /** 협동: 방장이 끝난 판에서 모두 대기실로 (같은 방에서 다시) */
  | { t: "lobby" }
  | { t: "status"; floor: number; roomId: number; hp: number; maxHp: number; score: number; kills: number }
  | { t: "end"; state: "dead" | "cleared"; floor: number; roomId: number; hp: number; score: number; kills: number }
  | { t: "chat"; text: string }
  /** 협동: 직접 연결 주선 (서버는 내용을 보지 않고 to에게 그대로 전달) */
  | { t: "signal"; to: string; data: string };

/** 서버 → 화면 */
export type ServerMsg =
  | { t: "room"; room: RoomView; you: string }
  | { t: "chat"; name: string; text: string; at: number }
  | { t: "signal"; from: string; data: string }
  | { t: "error"; error: "full" | "started" | "bad" };

const ORDER: Record<BattleState, number> = { cleared: 0, alive: 0, timeout: 0, dead: 0, forfeit: 1, watch: 2 };

/** 순위: 기권은 맨 뒤, 나머지는 점수 → 먼저 끝낸 사람 */
export function rankPlayers(players: readonly BattlePlayer[]): BattlePlayer[] {
  return [...players].sort(
    (a, b) => ORDER[a.state] - ORDER[b.state] || b.score - a.score || (a.finishedAt || Infinity) - (b.finishedAt || Infinity),
  );
}
