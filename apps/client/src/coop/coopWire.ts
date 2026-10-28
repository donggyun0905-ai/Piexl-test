// 협동 방 공용: 직접 연결 메시지 넘기는 곳(CoopWire) · 오류 글자 · 고른 캐릭터 기억
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { loadText } from "../storage";
import type { CoopMsg } from "./lockstep";
import type { PeerNet } from "./peer";

export const ERRORS: Record<string, TextKey> = {
  full: "battleFull",
  started: "battleStarted",
  disconnected: "battleDisconnected",
  offline: "errOffline",
  wrong: "coopWrongRoom",
};

export function loadCharacter(): CharacterId {
  const saved = loadText("coopCharacter") as CharacterId;
  return CHARACTER_IDS.includes(saved) ? saved : "warden";
}

/** 직접 연결에서 받은 메시지를 게임 쪽으로 넘기는 곳 */
export interface CoopWire {
  net: PeerNet | null;
  /** 손님이 보낸 해금 목록 (방장이 판을 만들 때 씀) */
  unlocks: Map<string, string[]>;
  onMessage: (pid: string, msg: CoopMsg) => void;
  /** 게임 화면이 뜨기 전에 온 메시지 (게임 화면이 뜨면 차례로 넘김) */
  pending: { pid: string; msg: CoopMsg }[];
  onOpen: (pid: string) => void;
  onClose: (pid: string) => void;
  onPw?: (pid: string, msg: CoopMsg) => void; // 패왕전 같이 하기: 대기실 메시지 · 연결됨 (event/PwRoom)
  onPwOpen?: (pid: string) => void;
}
