// CardRoom Durable Object: 로비 카드·타일 게임 같이 하기 방 (방 코드마다 하나, 웹소켓 잠자기)
// 판정은 공용 규칙(TableLogic)으로 서버에서. 바뀔 때만 저장하고, 자리마다 자기 패만 보이게 보냄
import { CARD_GAMES, newTable, TableLogic, type CardClientMsg, type CardGame, type CardServerMsg, type TableData } from "@pixel-rogue/shared";

interface Attachment {
  pid: string;
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

export class CardRoom {
  private logic: TableLogic | null = null;

  constructor(private state: State) {}

  private async load(code: string, game: CardGame, mode: "quick" | "private"): Promise<TableLogic> {
    if (this.logic) return this.logic;
    const stored = await this.state.storage.get<TableData>("table");
    const seed = crypto.getRandomValues(new Uint32Array(1))[0] ?? 1;
    this.logic = new TableLogic(stored ?? newTable(code, game, mode, Date.now(), seed), Date.now);
    if (!stored) this.logic.dirty = true;
    return this.logic;
  }

  private async commit(logic: TableLogic): Promise<void> {
    if (logic.dirty) {
      logic.dirty = false;
      await this.state.storage.put("table", logic.data);
    }
    const alarm = logic.nextAlarm();
    if (alarm > 0) await this.state.storage.setAlarm(alarm);
    else await this.state.storage.deleteAlarm();
    for (const ws of this.state.getWebSockets()) {
      const a = ws.deserializeAttachment() as Attachment | null;
      if (!a) continue;
      const msg: CardServerMsg = { t: "table", view: logic.view(a.pid) };
      try {
        ws.send(JSON.stringify(msg));
      } catch {
        // 끊긴 연결은 닫힘 처리에서 정리
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("websocket only", { status: 426 });
    const url = new URL(request.url);
    const code = url.pathname.split("/").pop() ?? "";
    const g = url.searchParams.get("game") as CardGame;
    const game = CARD_GAMES.includes(g) ? g : "blackjack";
    const mode = url.searchParams.get("mode") === "quick" ? "quick" : "private";
    await this.load(code, game, mode);
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer): Promise<void> {
    if (typeof raw !== "string" || raw.length > 2000) return;
    let msg: CardClientMsg;
    try {
      msg = JSON.parse(raw) as CardClientMsg;
    } catch {
      return;
    }
    const logic = await this.load("", "blackjack", "private");
    const a = ws.deserializeAttachment() as Attachment | null;
    if (msg.t === "hello") {
      if (a) return;
      const err = logic.join(String(msg.pid).slice(0, 40), String(msg.name));
      if (err) {
        ws.send(JSON.stringify({ t: "error", error: err } satisfies CardServerMsg));
        ws.close(1000, err);
        return;
      }
      ws.serializeAttachment({ pid: String(msg.pid).slice(0, 40) } satisfies Attachment);
    } else if (a) logic.handle(a.pid, msg);
    else return;
    await this.commit(logic);
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const a = ws.deserializeAttachment() as Attachment | null;
    if (!a) return;
    ws.serializeAttachment(null);
    const logic = await this.load("", "blackjack", "private");
    const still = this.state.getWebSockets().some((w) => w !== ws && (w.deserializeAttachment() as Attachment | null)?.pid === a.pid);
    if (!still) logic.leave(a.pid);
    // 사람이 아무도 없으면 방 정리
    if (!logic.data.seats.some((s) => s.pid && s.connected)) {
      await this.state.storage.deleteAll();
      this.logic = null;
      return;
    }
    await this.commit(logic);
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    await this.webSocketClose(ws);
  }

  async alarm(): Promise<void> {
    const logic = await this.load("", "blackjack", "private");
    logic.tick();
    await this.commit(logic);
  }
}
