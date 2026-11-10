// 협동 방 공용: 직접 연결 메시지 넘기는 곳(CoopWire) · 오류 글자 · 고른 캐릭터 기억
import { accClamp, CHARACTER_IDS, type AccTotals, type CharacterId } from "@pixel-rogue/shared";
import { myAccTotals } from "../event/acc/accStore";
import { loadAchievements } from "../records";
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
  /** 손님이 보낸 레이드 장신구 능력치 합계 */
  acc: Map<string, AccTotals>;
  onMessage: (pid: string, msg: CoopMsg) => void;
  /** 게임 화면이 뜨기 전에 온 메시지 (게임 화면이 뜨면 차례로 넘김) */
  pending: { pid: string; msg: CoopMsg }[];
  onOpen: (pid: string) => void;
  onClose: (pid: string) => void;
  onPw?: (pid: string, msg: CoopMsg) => void; // 패왕전 같이 하기: 대기실 메시지 · 연결됨 (event/PwRoom)
  onPwOpen?: (pid: string) => void;
}

/** 손님 → 방장: 연결되자마자 보내는 인사 (해금 목록 · 레이드 장신구 능력치 합계) */
export const hiMsg = (): CoopMsg => ({ t: "hi", unlocks: loadAchievements(), acc: myAccTotals() });

/** 방장: 받은 인사 기억 (장신구 합계는 말이 안 되는 값을 자름) */
export function takeHi(w: CoopWire, pid: string, m: Extract<CoopMsg, { t: "hi" }>): void {
  if (Array.isArray(m.unlocks)) w.unlocks.set(pid, m.unlocks.map(String));
  if (m.acc && typeof m.acc === "object") w.acc.set(pid, accClamp(m.acc));
}
