// 협동 직접 연결 (WebRTC 데이터 채널). 방장 ↔ 손님 한 줄씩 (손님끼리는 연결하지 않음).
// 연결 정보(offer·answer·ICE)는 배틀 방 서버를 거쳐 주고받고, 연결된 뒤 게임 데이터는 서버를 거치지 않음
import { SERVER_URL } from "../serverStatus";

export interface PeerEvents {
  onOpen: (pid: string) => void;
  onMessage: (pid: string, msg: unknown) => void;
  onClose: (pid: string) => void;
}

type Signal = { k: "offer"; sdp: string } | { k: "answer"; sdp: string } | { k: "ice"; c: RTCIceCandidateInit };

const FALLBACK_ICE: RTCIceServer[] = [{ urls: ["stun:stun.cloudflare.com:3478", "stun:stun.l.google.com:19302"] }];

/** 직접 연결이 안 될 때: 서버에서 중계(TURN) 주소 받기. 못 받으면 null (열쇠가 없거나 이번 달 한도) */
async function fetchTurn(): Promise<RTCIceServer[] | null> {
  try {
    const res = await fetch(`${SERVER_URL}/coop/turn`, { method: "POST" });
    const data = (await res.json()) as { turn?: boolean; iceServers?: RTCIceServer[] };
    return data.turn && data.iceServers?.length ? data.iceServers : null;
  } catch {
    return null;
  }
}

/** 이 시간 안에 연결되지 않으면 실패로 보고 다시 (중계는 TCP로 붙을 수 있어 더 기다림) */
const OPEN_WAIT_MS = 10_000;
const OPEN_WAIT_TURN_MS = 20_000;

/** 서버에서 연결 도우미 주소 받기 (못 받으면 STUN만) */
export async function fetchIce(): Promise<RTCIceServer[]> {
  try {
    const res = await fetch(`${SERVER_URL}/coop/ice`);
    const data = (await res.json()) as { iceServers?: RTCIceServer[] };
    return data.iceServers?.length ? data.iceServers : FALLBACK_ICE;
  } catch {
    return FALLBACK_ICE;
  }
}

interface Link {
  pc: RTCPeerConnection;
  ch: RTCDataChannel | null;
  /** 상대 정보가 오기 전에 도착한 ICE */
  early: RTCIceCandidateInit[];
}

export class PeerNet {
  private links = new Map<string, Link>();
  private closed = false;
  /** 중계: no = 아직 안 씀 · asking = 받는 중 · yes = 받음 · none = 받을 수 없음 */
  private turn: "no" | "asking" | "yes" | "none" = "no";

  constructor(
    private ice: RTCIceServer[],
    private sendSignal: (to: string, data: string) => void,
    private ev: PeerEvents,
  ) {}

  private link(pid: string): Link {
    const old = this.links.get(pid);
    if (old) return old;
    const pc = new RTCPeerConnection({ iceServers: this.ice });
    const l: Link = { pc, ch: null, early: [] };
    this.links.set(pid, l);
    pc.onicecandidate = (e) => {
      if (e.candidate) this.signal(pid, { k: "ice", c: e.candidate.toJSON() });
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") this.failed(pid);
      else if (pc.connectionState === "closed") this.drop(pid);
    };
    // 정해진 시간 안에 안 열리면 직접 연결이 막힌 것으로 봄
    setTimeout(() => {
      if (this.links.get(pid) === l && l.ch?.readyState !== "open") this.failed(pid);
    }, this.turn === "yes" ? OPEN_WAIT_TURN_MS : OPEN_WAIT_MS);
    pc.ondatachannel = (e) => this.bind(pid, l, e.channel);
    return l;
  }

  private bind(pid: string, l: Link, ch: RTCDataChannel): void {
    l.ch = ch;
    ch.onopen = () => this.ev.onOpen(pid);
    ch.onclose = () => this.drop(pid);
    ch.onmessage = (e) => {
      try {
        this.ev.onMessage(pid, JSON.parse(String(e.data)));
      } catch {
        // 깨진 메시지는 무시
      }
    };
  }

  private signal(to: string, s: Signal): void {
    this.sendSignal(to, JSON.stringify(s));
  }

  /** 방장: 손님에게 연결 시작 */
  async call(pid: string): Promise<void> {
    if (this.closed || this.links.has(pid)) return;
    const l = this.link(pid);
    this.bind(pid, l, l.pc.createDataChannel("game", { ordered: true }));
    await l.pc.setLocalDescription(await l.pc.createOffer());
    this.signal(pid, { k: "offer", sdp: l.pc.localDescription?.sdp ?? "" });
  }

  /** 서버를 거쳐 온 연결 정보 */
  async onSignal(from: string, data: string): Promise<void> {
    if (this.closed) return;
    let s: Signal;
    try {
      s = JSON.parse(data) as Signal;
    } catch {
      return;
    }
    try {
      if (s.k === "offer") {
        // 다시 걸려 온 연결이면 예전 것을 버림
        if (this.links.has(from)) this.drop(from, false);
        const l = this.link(from);
        await l.pc.setRemoteDescription({ type: "offer", sdp: s.sdp });
        for (const c of l.early.splice(0)) await l.pc.addIceCandidate(c);
        await l.pc.setLocalDescription(await l.pc.createAnswer());
        this.signal(from, { k: "answer", sdp: l.pc.localDescription?.sdp ?? "" });
      } else if (s.k === "answer") {
        const l = this.links.get(from);
        if (!l) return;
        await l.pc.setRemoteDescription({ type: "answer", sdp: s.sdp });
        for (const c of l.early.splice(0)) await l.pc.addIceCandidate(c);
      } else {
        const l = this.links.get(from);
        if (!l) return;
        if (l.pc.remoteDescription) await l.pc.addIceCandidate(s.c);
        else l.early.push(s.c);
      }
    } catch {
      // 연결 정보가 맞지 않음: 끊긴 것으로 처리 (방장이 다시 연결)
      this.drop(from);
    }
  }

  /** 연결 실패: 끊고(방장이 다시 연결), 아직이면 중계 주소를 받아 다음 연결부터 씀 */
  private failed(pid: string): void {
    this.drop(pid);
    if (this.turn !== "no") return;
    this.turn = "asking";
    void fetchTurn().then((list) => {
      if (list) this.ice = list;
      this.turn = list ? "yes" : "none";
    });
  }

  isOpen(pid: string): boolean {
    return this.links.get(pid)?.ch?.readyState === "open";
  }

  has(pid: string): boolean {
    return this.links.has(pid);
  }

  send(pid: string, msg: unknown): void {
    const ch = this.links.get(pid)?.ch;
    if (ch?.readyState === "open") ch.send(JSON.stringify(msg));
  }

  drop(pid: string, notify = true): void {
    const l = this.links.get(pid);
    if (!l) return;
    this.links.delete(pid);
    l.ch?.close();
    l.pc.close();
    if (notify && !this.closed) this.ev.onClose(pid);
  }

  close(): void {
    this.closed = true;
    for (const pid of [...this.links.keys()]) this.drop(pid, false);
  }
}
