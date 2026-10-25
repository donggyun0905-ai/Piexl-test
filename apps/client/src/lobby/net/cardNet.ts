// 카드·타일 게임 방 연결: 빠른 시작·방 만들기는 서버에 방 코드를 받고, 웹소켓으로 들어감 (상태는 서버가 보내 줌)
import type { CardClientMsg, CardGame, CardServerMsg, TableView } from "@pixel-rogue/shared";
import { apiPost } from "../../api";
import { battlePid } from "../../battle/connection";
import { loadNickname } from "../../player";
import { SERVER_URL } from "../../serverStatus";

/** 빠른 시작(모으는 중인 방) · 방 만들기(친구 초대 코드) */
export async function findRoom(game: CardGame, quick: boolean): Promise<{ code: string; mode: "quick" | "private" } | null> {
  const res = await apiPost<{ code: string; mode: "quick" | "private" }>(`/api/match/${quick ? "cards" : "create"}`, { game });
  return res.ok && res.data ? { code: res.data.code, mode: res.data.mode } : null;
}

export class CardConnection {
  private ws: WebSocket;
  private closed = false;
  /** 서버 시계 - 내 시계 */
  offset = 0;

  constructor(code: string, game: CardGame, mode: "quick" | "private", onView: (v: TableView) => void, onError: (e: string) => void) {
    const base = SERVER_URL.replace(/^http/, "ws");
    this.ws = new WebSocket(`${base}/cards/${code}?game=${game}&mode=${mode}`);
    this.ws.onopen = () => this.send({ t: "hello", pid: battlePid(), name: loadNickname() });
    this.ws.onmessage = (e) => {
      let msg: CardServerMsg;
      try {
        msg = JSON.parse(String(e.data)) as CardServerMsg;
      } catch {
        return;
      }
      if (msg.t === "table") {
        this.offset = msg.view.now - Date.now();
        onView(msg.view);
      } else onError(msg.error);
    };
    this.ws.onclose = () => {
      if (!this.closed) onError("closed");
    };
  }

  send(msg: CardClientMsg): void {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  close(): void {
    this.closed = true;
    this.ws.close();
  }
}
