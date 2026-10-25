// 배틀 서버 연결: 끊기면 1분 동안 다시 연결 시도, 상태는 바뀔 때만 1초에 한 번까지 묶어서 보냄
import { latestBalanceHash } from "../balance";
import {
  computeScore,
  STATUS_INTERVAL_MS,
  type CharacterId,
  type ClientMsg,
  type RoomView,
  type RunState,
  type ServerMsg,
} from "@pixel-rogue/shared";
import { SERVER_URL } from "../serverStatus";

/** 이 탭의 배틀 참가 id (다시 연결할 때 같은 사람으로) */
export function battlePid(): string {
  try {
    const saved = sessionStorage.getItem("pixel-rogue:battlePid");
    if (saved) return saved;
    const id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
    sessionStorage.setItem("pixel-rogue:battlePid", id);
    return id;
  } catch {
    return `p${Date.now()}${Math.floor(performance.now())}`;
  }
}

export interface ConnectionEvents {
  onRoom: (room: RoomView, you: string, clockOffset: number) => void;
  onChat: (name: string, text: string) => void;
  onError: (error: string) => void;
  /** 협동: 직접 연결 주선 내용 */
  onSignal?: (from: string, data: string) => void;
}

export class BattleConnection {
  readonly pid = battlePid();
  private ws: WebSocket | null = null;
  private closed = false;
  private retryTimer = 0;
  private gaveUpAt = 0;
  private lastStatusKey = "";
  private lastStatusAt = 0;
  private pendingStatus: ClientMsg | null = null;
  private statusTimer = 0;
  private done = false;

  constructor(
    private code: string,
    private mode: "quick" | "private",
    private name: string,
    private characterId: CharacterId,
    private ev: ConnectionEvents,
    private kind: "battle" | "coop" = "battle",
  ) {
    this.open();
  }

  private open(): void {
    const base = SERVER_URL.replace(/^http/, "ws");
    const ws = new WebSocket(`${base}/battle/${this.code}?mode=${this.mode}&kind=${this.kind}`);
    this.ws = ws;
    ws.onopen = () => {
      this.gaveUpAt = 0;
      this.raw({ t: "hello", pid: this.pid, name: this.name, characterId: this.characterId, balance: latestBalanceHash() });
    };
    ws.onmessage = (e) => {
      let msg: ServerMsg;
      try {
        msg = JSON.parse(String(e.data)) as ServerMsg;
      } catch {
        return;
      }
      if (msg.t === "room") {
        if (msg.room.phase === "done") this.done = true;
        this.ev.onRoom(msg.room, msg.you, msg.room.now - Date.now());
      } else if (msg.t === "chat") this.ev.onChat(msg.name, msg.text);
      else if (msg.t === "signal") this.ev.onSignal?.(msg.from, msg.data);
      else if (msg.t === "error") {
        this.closed = true;
        this.ev.onError(msg.error);
      }
    };
    ws.onclose = () => {
      if (this.closed || this.done) return;
      // 1분 안에 다시 연결 (서버는 1분 동안 자리를 남겨 둠)
      if (this.gaveUpAt === 0) this.gaveUpAt = Date.now() + 60_000;
      if (Date.now() > this.gaveUpAt) return this.ev.onError("disconnected");
      this.retryTimer = window.setTimeout(() => this.open(), 2000);
    };
  }

  private raw(msg: ClientMsg): void {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  send(msg: ClientMsg): void {
    this.raw(msg);
  }

  /** 게임 상태: 바뀌었을 때만, 1초에 한 번까지 (받는 메시지 수 = 비용) */
  status(run: RunState): void {
    const p = run.player;
    const msg: ClientMsg = {
      t: "status",
      floor: run.floor,
      roomId: run.roomId,
      hp: Math.ceil(p.hp),
      maxHp: Math.round(p.stats.maxHp),
      score: computeScore(run).total,
      kills: run.kills,
    };
    const key = `${msg.floor}/${msg.roomId}/${msg.hp}/${msg.maxHp}/${msg.score}`;
    if (key === this.lastStatusKey) return;
    this.lastStatusKey = key;
    this.pendingStatus = msg;
    const wait = this.lastStatusAt + STATUS_INTERVAL_MS - Date.now();
    if (wait <= 0) this.flushStatus();
    else if (!this.statusTimer) this.statusTimer = window.setTimeout(() => this.flushStatus(), wait);
  }

  private flushStatus(): void {
    this.statusTimer = 0;
    if (!this.pendingStatus) return;
    this.raw(this.pendingStatus);
    this.pendingStatus = null;
    this.lastStatusAt = Date.now();
  }

  /** 쓰러짐·클리어 (시간이 끝나서 멈춘 경우는 마지막 상태만 보냄) */
  finish(run: RunState): void {
    clearTimeout(this.statusTimer);
    this.statusTimer = 0;
    this.pendingStatus = null;
    if (!run.won && run.player.hp > 0) {
      this.lastStatusKey = "";
      this.lastStatusAt = 0;
      this.status(run);
      return;
    }
    const p = run.player;
    this.raw({
      t: "end",
      state: run.won ? "cleared" : "dead",
      floor: run.floor,
      roomId: run.roomId,
      hp: Math.max(0, Math.ceil(p.hp)),
      score: computeScore(run).total,
      kills: run.kills,
    });
  }

  close(): void {
    this.closed = true;
    clearTimeout(this.retryTimer);
    clearTimeout(this.statusTimer);
    this.ws?.close(1000, "bye");
  }
}
