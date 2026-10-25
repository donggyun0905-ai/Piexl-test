// 배틀 방 규칙 (웹소켓과 따로 두어 시험하기 쉽게). 서버는 게임을 계산하지 않고 상태만 모아 전달
import {
  BATTLE_COUNTDOWN_MS,
  BATTLE_DURATION_MS,
  BATTLE_MAX_PLAYERS,
  CHARACTER_IDS,
  COOP_MAX_PLAYERS,
  COOP_ROOM_MS,
  cleanChat,
  cleanNickname,
  FLOOR_COUNT,
  QUICK_WAIT_MS,
  RECONNECT_MS,
  type BattlePlayer,
  type CharacterId,
  type ClientMsg,
  type RoomKind,
  type RoomView,
  type ServerMsg,
} from "@pixel-rogue/shared";

export interface RoomData {
  code: string;
  mode: "quick" | "private";
  kind?: RoomKind;
  phase: "lobby" | "playing" | "done";
  seedText: string;
  startAt: number;
  endAt: number;
  hostPid: string;
  /** 빠른 매칭 자동 시작 시각 (0 = 아직) */
  autoStartAt: number;
  players: BattlePlayer[];
  /** 이 판의 게임 수치 지문 */
  balance?: string;
}

/** 보낼 메시지: 모두에게 또는 특정 사람에게 */
export interface Out {
  to: "all" | string[];
  msg: ServerMsg;
}

export function newRoom(code: string, mode: "quick" | "private", kind: RoomKind = "battle"): RoomData {
  return { code, mode, kind, phase: "lobby", seedText: "", startAt: 0, endAt: 0, hostPid: "", autoStartAt: 0, players: [] };
}

/** 데이터 크기 제한: 직접 연결 주선 내용 (연결 정보 글자) */
const SIGNAL_MAX = 6000;

const num = (v: unknown, min: number, max: number): number => {
  const n = typeof v === "number" && Number.isFinite(v) ? Math.round(v) : min;
  return n < min ? min : n > max ? max : n;
};

const validChar = (c: unknown): c is CharacterId => CHARACTER_IDS.includes(c as CharacterId);

export class RoomLogic {
  constructor(
    public data: RoomData,
    private now: () => number,
    private newSeed: () => string,
  ) {}

  /** 구조가 바뀌어 저장해야 하는지 (상태 숫자만 바뀐 것은 저장하지 않음) */
  dirty = false;

  view(): RoomView {
    const d = this.data;
    return { ...d, players: d.players.map((p) => ({ ...p })), now: this.now() };
  }

  private get max(): number {
    return this.data.kind === "coop" ? COOP_MAX_PLAYERS : BATTLE_MAX_PLAYERS;
  }

  private player(pid: string): BattlePlayer | undefined {
    return this.data.players.find((p) => p.pid === pid);
  }

  private broadcast(): Out {
    return { to: "all", msg: { t: "room", room: this.view(), you: "" } };
  }

  /** 들어오기 (다시 연결 포함). 실패하면 오류 메시지 */
  join(pid: string, name: string, characterId: unknown, balance?: unknown): Out[] | ServerMsg {
    const d = this.data;
    const p = this.player(pid);
    if (p) {
      if (p.state === "forfeit") return { t: "error", error: "started" };
      p.connected = true;
      p.leftAt = 0;
      this.dirty = true;
      return [this.broadcast()];
    }
    if (d.phase !== "lobby") return { t: "error", error: "started" };
    if (d.players.length >= this.max) return { t: "error", error: "full" };
    if (typeof pid !== "string" || pid.length < 8 || pid.length > 40) return { t: "error", error: "bad" };
    d.players.push({
      pid,
      name: cleanNickname(String(name ?? "")),
      characterId: validChar(characterId) ? characterId : "warden",
      connected: true,
      state: "alive",
      floor: 1,
      roomId: 0,
      hp: 0,
      maxHp: 0,
      score: 0,
      kills: 0,
      finishedAt: 0,
      leftAt: 0,
      balance: typeof balance === "string" && /^[0-9a-z]{1,16}$/.test(balance) ? balance : undefined,
    });
    if (!d.hostPid) d.hostPid = pid;
    this.dirty = true;
    this.lobbyCheck();
    return [this.broadcast()];
  }

  /** 연결이 끊김 */
  leave(pid: string): Out[] {
    const d = this.data;
    const p = this.player(pid);
    if (!p) return [];
    this.dirty = true;
    if (d.phase === "lobby") {
      // 시작 전에는 바로 빠짐
      d.players = d.players.filter((x) => x.pid !== pid);
      if (d.hostPid === pid) d.hostPid = d.players[0]?.pid ?? "";
      if (d.players.length < 2) d.autoStartAt = 0;
    } else {
      p.connected = false;
      p.leftAt = this.now();
      // 협동: 게임은 방장 화면이 진행하므로 방장이 나가면 연결된 다음 사람이 바로 이어받음 (나간 사람은 1분 안에 돌아오면 손님으로)
      if (d.kind === "coop" && d.hostPid === pid) d.hostPid = d.players.find((x) => x.connected)?.pid ?? pid;
    }
    return [this.broadcast()];
  }

  /** 빠른 매칭: 두 명이 되면 잠깐 기다렸다 시작, 꽉 차면 바로 */
  private lobbyCheck(): void {
    const d = this.data;
    if (d.phase !== "lobby" || d.mode !== "quick") return;
    if (d.players.length >= this.max) this.start();
    else if (d.players.length >= 2 && d.autoStartAt === 0) d.autoStartAt = this.now() + QUICK_WAIT_MS;
  }

  private start(): void {
    const d = this.data;
    const now = this.now();
    d.phase = "playing";
    d.seedText = this.newSeed();
    d.startAt = now + BATTLE_COUNTDOWN_MS;
    d.endAt = d.startAt + (d.kind === "coop" ? COOP_ROOM_MS : BATTLE_DURATION_MS);
    d.autoStartAt = 0;
    // 모두 같은 수치로: 방장 화면의 수치
    d.balance = (this.player(d.hostPid) ?? d.players[0])?.balance;
    for (const p of d.players) p.state = "alive";
    this.dirty = true;
  }

  handle(pid: string, msg: ClientMsg): Out[] {
    const d = this.data;
    const p = this.player(pid);
    if (!p) return [];
    const now = this.now();
    if (msg.t === "character") {
      if (d.phase !== "lobby" || !validChar(msg.characterId)) return [];
      p.characterId = msg.characterId;
      this.dirty = true;
      return [this.broadcast()];
    }
    if (msg.t === "start") {
      if (d.phase !== "lobby" || d.mode !== "private" || d.hostPid !== pid) return [];
      this.start();
      return [this.broadcast()];
    }
    if (msg.t === "status" || msg.t === "end") {
      if (d.phase !== "playing" || p.state !== "alive" || now < d.startAt) return [];
      p.floor = num(msg.floor, 1, FLOOR_COUNT);
      p.roomId = num(msg.roomId, 0, 99);
      p.hp = num(msg.hp, 0, 9999);
      p.score = num(msg.score, 0, 1_000_000);
      p.kills = num(msg.kills, 0, 100_000);
      if (msg.t === "status") p.maxHp = num(msg.maxHp, 1, 9999);
      if (msg.t === "end") {
        p.state = msg.state === "cleared" ? "cleared" : "dead";
        p.finishedAt = now;
        this.dirty = true;
        this.endCheck();
      }
      return [this.broadcast()];
    }
    if (msg.t === "signal") {
      // 협동: 같은 방 사람에게만 그대로 전달
      if (d.kind !== "coop" || !this.player(String(msg.to)) || typeof msg.data !== "string" || msg.data.length > SIGNAL_MAX) return [];
      return [{ to: [String(msg.to)], msg: { t: "signal", from: pid, data: msg.data } }];
    }
    if (msg.t === "chat") {
      // 대기실에서는 모두, 게임 중에는 먼저 끝난 사람끼리만
      const lobby = d.phase === "lobby";
      if (!lobby && p.state === "alive" && d.phase !== "done") return [];
      const text = cleanChat(String(msg.text ?? ""));
      if (!text) return [];
      const to = d.players.filter((x) => lobby || x.state !== "alive" || d.phase === "done").map((x) => x.pid);
      return [{ to, msg: { t: "chat", name: p.name, text, at: now } }];
    }
    return [];
  }

  /** 모두 끝났으면 판 끝 */
  private endCheck(): void {
    const d = this.data;
    if (d.phase === "playing" && d.players.every((p) => p.state !== "alive")) {
      d.phase = "done";
      this.dirty = true;
    }
  }

  /** 알람: 자동 시작 · 기권패 · 시간 끝 */
  tick(): Out[] {
    const d = this.data;
    const now = this.now();
    const before = JSON.stringify(d);
    if (d.phase === "lobby" && d.autoStartAt > 0 && now >= d.autoStartAt) this.start();
    if (d.phase === "playing") {
      for (const p of d.players) {
        if (p.state === "alive" && !p.connected && p.leftAt > 0 && now - p.leftAt >= RECONNECT_MS) {
          p.state = "forfeit";
          p.finishedAt = now;
        }
      }
      if (now >= d.endAt) {
        for (const p of d.players) {
          if (p.state === "alive") {
            p.state = "timeout";
            p.finishedAt = d.endAt;
          }
        }
      }
      this.endCheck();
    }
    if (JSON.stringify(d) === before) return [];
    this.dirty = true;
    return [this.broadcast()];
  }

  /** 다음 알람 시각 (없으면 0) */
  nextAlarm(): number {
    const d = this.data;
    const times: number[] = [];
    if (d.phase === "lobby" && d.autoStartAt > 0) times.push(d.autoStartAt);
    if (d.phase === "playing") {
      times.push(d.endAt);
      for (const p of d.players) if (p.state === "alive" && !p.connected && p.leftAt > 0) times.push(p.leftAt + RECONNECT_MS);
    }
    return times.length ? Math.min(...times) : 0;
  }
}
