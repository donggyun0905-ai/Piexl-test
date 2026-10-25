// BattleRoom Durable Object: 방 코드마다 하나. 웹소켓 잠자기 API (연결을 붙잡고 있어도 쉬는 동안은 비용 없음)
// 저장: 방 구조(들어오기·나가기·시작·끝)는 저장소에, 자주 바뀌는 체력·위치는 각 연결의 첨부 값에 (저장 쓰기 줄이기)
import { createRng, seedToText, type BattlePlayer, type ClientMsg, type RoomKind, type ServerMsg } from "@pixel-rogue/shared";
import { newRoom, RoomLogic, type Out, type RoomData } from "./roomLogic";

interface Attachment {
  pid: string;
  status?: Partial<BattlePlayer>;
}

interface State {
  storage: {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
    deleteAll(): Promise<void>;
    setAlarm(time: number): Promise<void>;
    deleteAlarm(): Promise<void>;
  };
  acceptWebSocket(ws: WebSocket): void;
  getWebSockets(): WebSocket[];
}

function randomSeedText(): string {
  return seedToText(createRng(crypto.getRandomValues(new Uint32Array(1))[0] ?? 1));
}

export class BattleRoom {
  private logic: RoomLogic | null = null;

  constructor(private state: State) {}

  private async load(code: string, mode: "quick" | "private", kind: RoomKind = "battle"): Promise<RoomLogic> {
    if (this.logic) return this.logic;
    const stored = await this.state.storage.get<RoomData>("room");
    const data = stored ?? newRoom(code, mode, kind);
    // 잠자는 동안 메모리가 비워졌으면: 살아 있는 연결의 첨부 값으로 최신 상태를 되살림
    const live = new Set<string>();
    for (const ws of this.state.getWebSockets()) {
      const a = ws.deserializeAttachment() as Attachment | null;
      if (!a) continue;
      live.add(a.pid);
      const p = data.players.find((x) => x.pid === a.pid);
      if (p && a.status) Object.assign(p, a.status);
    }
    for (const p of data.players) p.connected = live.has(p.pid);
    this.logic = new RoomLogic(data, Date.now, randomSeedText);
    // 새 방은 코드·방식을 바로 저장 (잠자기 뒤에도 알 수 있게)
    if (!stored) this.logic.dirty = true;
    return this.logic;
  }

  private async commit(logic: RoomLogic, outs: Out[]): Promise<void> {
    if (logic.dirty) {
      logic.dirty = false;
      await this.state.storage.put("room", logic.data);
    }
    const alarm = logic.nextAlarm();
    if (alarm > 0) await this.state.storage.setAlarm(alarm);
    else await this.state.storage.deleteAlarm();
    // 첨부 값 갱신 (체력·위치 등)
    for (const ws of this.state.getWebSockets()) {
      const a = ws.deserializeAttachment() as Attachment | null;
      const p = a && logic.data.players.find((x) => x.pid === a.pid);
      if (a && p) {
        const status: Partial<BattlePlayer> = { state: p.state, floor: p.floor, roomId: p.roomId, hp: p.hp, maxHp: p.maxHp, score: p.score, kills: p.kills, finishedAt: p.finishedAt };
        ws.serializeAttachment({ pid: a.pid, status } satisfies Attachment);
      }
    }
    this.send(outs);
  }

  private send(outs: Out[]): void {
    if (outs.length === 0) return;
    for (const ws of this.state.getWebSockets()) {
      const a = ws.deserializeAttachment() as Attachment | null;
      if (!a) continue;
      for (const o of outs) {
        if (o.to !== "all" && !o.to.includes(a.pid)) continue;
        const msg: ServerMsg = o.msg.t === "room" ? { ...o.msg, you: a.pid } : o.msg;
        try {
          ws.send(JSON.stringify(msg));
        } catch {
          // 끊긴 연결은 무시 (닫힘 처리에서 정리)
        }
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("websocket only", { status: 426 });
    const url = new URL(request.url);
    const code = url.pathname.split("/").pop() ?? "";
    const mode = url.searchParams.get("mode") === "quick" ? "quick" : "private";
    const kind = url.searchParams.get("kind") === "coop" ? "coop" : "battle";
    const logic = await this.load(code, mode, kind);
    if (logic.dirty) {
      logic.dirty = false;
      await this.state.storage.put("room", logic.data);
    }
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer): Promise<void> {
    // 협동의 연결 주선 내용은 조금 김
    if (typeof raw !== "string" || raw.length > 8000) return;
    let msg: ClientMsg;
    try {
      msg = JSON.parse(raw) as ClientMsg;
    } catch {
      return;
    }
    const logic = await this.load("", "private");
    const a = ws.deserializeAttachment() as Attachment | null;
    if (msg.t === "hello") {
      if (a) return;
      const res = logic.join(String(msg.pid), String(msg.name), msg.characterId, msg.balance);
      if (!Array.isArray(res)) {
        ws.send(JSON.stringify(res));
        ws.close(1000, res.t === "error" ? res.error : "bad");
        return;
      }
      ws.serializeAttachment({ pid: String(msg.pid) } satisfies Attachment);
      await this.commit(logic, res);
      return;
    }
    if (!a) return;
    await this.commit(logic, logic.handle(a.pid, msg));
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const a = ws.deserializeAttachment() as Attachment | null;
    if (!a) return;
    ws.serializeAttachment(null);
    const logic = await this.load("", "private");
    // 같은 사람이 다시 연결해 둔 다른 연결이 있으면 그대로
    const still = this.state
      .getWebSockets()
      .some((w) => w !== ws && (w.deserializeAttachment() as Attachment | null)?.pid === a.pid);
    if (!still) await this.commit(logic, logic.leave(a.pid));
    if (this.state.getWebSockets().every((w) => w === ws || !w.deserializeAttachment())) {
      // 아무도 없고 끝났거나 시작 전이면 방 정리
      if (logic.data.phase === "done" || logic.data.players.length === 0) {
        await this.state.storage.deleteAll();
        this.logic = null;
      }
    }
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    await this.webSocketClose(ws);
  }

  async alarm(): Promise<void> {
    const logic = await this.load("", "private");
    await this.commit(logic, logic.tick());
  }
}
