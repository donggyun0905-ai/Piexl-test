// 협동 한 판: 방장은 게임을 진행하며 입력을 나눠 주고, 손님은 받은 입력으로 같이 진행.
// 방장이 나가면 서버가 정한 다음 사람이 지금 상태 그대로 이어서 방장이 됨
import { createParty, parseSeed, type CharacterId, type RoomView, type RunState } from "@pixel-rogue/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { loadAchievements } from "../records";
import type { CoopWire } from "./CoopScreen";
import { drawCoopOverlay } from "./coopDraw";
import { CoopParty, CoopStats, type Member } from "./CoopParty";
import { CoopExtras } from "./extras";
import { GuestSync } from "./guestSync";
import { HostSync } from "./hostSync";
import type { CoopMsg } from "./lockstep";

interface Props {
  room: RoomView;
  you: string;
  characterId: CharacterId;
  wire: CoopWire;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
}

type Sync = { host: HostSync; guest: null } | { host: null; guest: GuestSync };

export function CoopGame({ room, you, characterId, wire, lang, t, onExit }: Props) {
  const hostPid = room.hostPid;
  const isHost = hostPid === you;
  const hostRef = useRef(hostPid);
  hostRef.current = hostPid;
  const [ready, setReady] = useState(isHost);
  const [hostLost, setHostLost] = useState(false);
  const [ended, setEnded] = useState(false);
  const extras = useMemo(() => new CoopExtras(), []);

  // 자리 순서 = 방에 들어온 순서 (시작할 때 0번이 방장). 판은 한 객체를 끝까지 씀 (손님은 받은 상태로 내용만 바꿈)
  const seats = useMemo(() => room.players.map((p) => p.pid), [room.players]);
  const seatsRef = useRef(seats);
  // run = 화면에 보이는 상태 (확정 + 짐작). 확정 상태는 HostSync·GuestSync가 따로 들고 있음
  const run = useMemo((): RunState => {
    if (!isHost) return {} as RunState;
    const members = seatsRef.current.map((pid) => ({
      characterId: room.players.find((p) => p.pid === pid)?.characterId ?? "warden",
      unlocks: pid === you ? loadAchievements() : (wire.unlocks.get(pid) ?? []),
    }));
    return createParty(parseSeed(room.seedText), members);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 자리 순서대로 이름·연결 상태
  const members: Member[] = seatsRef.current.map((pid) => {
    const p = room.players.find((x) => x.pid === pid);
    return { pid, name: p?.name ?? "?", connected: p?.connected ?? false };
  });
  const names = members.map((m) => m.name);
  const namesRef = useRef(names);
  namesRef.current = names;

  const link = useMemo(() => ({ send: (pid: string, msg: CoopMsg) => wire.net?.send(pid, msg), isOpen: (pid: string) => !!wire.net?.isOpen(pid) }), [wire]);
  const sync = useRef<Sync | null>(null);
  // 방장이 바뀌면 역할을 바꿈 (내가 이어받으면 지금 상태 그대로 진행)
  if (!sync.current || (isHost && !sync.current.host) || (!isHost && !sync.current.guest)) {
    // 이어받으면 손님일 때의 확정 상태에서 계속 (처음 방장은 새 판)
    const confirmed = sync.current?.guest?.confirmed ?? structuredClone(run);
    sync.current = isHost
      ? { host: new HostSync(confirmed, seatsRef.current, link, Math.max(0, seatsRef.current.indexOf(you))), guest: null }
      : {
          host: null,
          guest: new GuestSync(
            (msg) => wire.net?.send(hostRef.current, msg),
            () => extras.rtt.get(hostRef.current),
          ),
        };
  }

  useEffect(() => {
    setHostLost(false);
    const handle = (pid: string, msg: CoopMsg) => {
      const s = sync.current;
      // 편의 기능 (방장·손님 같음): 연결 지연 재기 · 빠른 신호 (방장은 다른 손님에게도 넘겨 줌)
      if (msg.t === "pg") return wire.net?.send(pid, { t: "po", ts: msg.ts } satisfies CoopMsg);
      if (msg.t === "po") return void extras.rtt.set(pid, performance.now() - msg.ts);
      if (msg.t === "sig") {
        extras.addSignal(msg.seat, msg.k);
        if (s?.host) for (const other of seatsRef.current) if (other !== you && other !== pid) wire.net?.send(other, msg);
        return;
      }
      if (s?.host) {
        if (msg.t === "in" && Array.isArray(msg.i)) s.host.onGuestInput(pid, Number(msg.n), msg.i);
        else if (msg.t === "resync") s.host.sendState(pid);
      } else if (s?.guest && pid === hostRef.current) {
        if (msg.t === "state") {
          s.guest.onState(run, msg);
          setReady(true);
          setHostLost(false);
        } else if (msg.t === "ticks") s.guest.onTicks(msg);
      }
    };
    wire.onMessage = handle;
    for (const p of wire.pending.splice(0)) handle(p.pid, p.msg);
    // 방장: 시작 뒤에(또는 이어받은 뒤에) 연결된 손님에게 상태를 보냄
    wire.onOpen = (pid) => sync.current?.host?.sendState(pid);
    wire.onClose = (pid) => {
      sync.current?.host?.onGuestLeft(pid);
      if (!sync.current?.host && pid === hostRef.current) setHostLost(true);
    };
    const s = sync.current;
    if (s?.host) for (const pid of seatsRef.current) if (pid !== you && wire.net?.isOpen(pid)) s.host.sendState(pid);
    return () => {
      wire.onMessage = () => {};
      wire.onOpen = () => {};
      wire.onClose = () => {};
    };
  }, [wire, run, you, hostPid, extras]);

  // 연결 지연: 2초마다 연결된 상대에게 (손님은 방장에게만)
  useEffect(() => {
    const id = setInterval(() => {
      const peers = isHost ? seatsRef.current.filter((pid) => pid !== you) : [hostPid];
      for (const pid of peers) if (wire.net?.isOpen(pid)) wire.net.send(pid, { t: "pg", ts: performance.now() } satisfies CoopMsg);
    }, 2000);
    return () => clearInterval(id);
  }, [wire, isHost, hostPid, you]);

  const signal = (k: number) => {
    const seat = run.seat ?? 0;
    extras.addSignal(seat, k);
    const msg: CoopMsg = { t: "sig", seat, k };
    for (const pid of isHost ? seatsRef.current : [hostPid]) if (pid !== you) wire.net?.send(pid, msg);
  };
  const signalRef = useRef(signal);
  signalRef.current = signal;
  // 키 3~6: 빠른 신호
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = ["Digit3", "Digit4", "Digit5", "Digit6"].indexOf(e.code);
      if (k >= 0 && !e.repeat && !(e.target instanceof HTMLInputElement)) signalRef.current(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!ready) {
    return (
      <div className="game-screen coop-wait">
        <p>{t("coopWaitState")}</p>
        <button type="button" className="ghost" onClick={onExit}>
          {t("leaveRoom")}
        </button>
      </div>
    );
  }

  return (
    <>
      <GameScreen
        mode="coop"
        characterId={characterId}
        seedText={room.seedText}
        initialRun={run}
        unlocks={[]}
        lang={lang}
        t={t}
        onExit={onExit}
        onRunEnd={() => setEnded(true)}
        resultExtra={ended ? <CoopStats run={run} members={members} t={t} /> : null}
        overlay={(ctx, r, alpha, snap) => drawCoopOverlay(ctx, r, alpha, snap, namesRef.current, extras, t)}
        step={(r, input) => {
          const s = sync.current;
          return s?.host ? s.host.step(r, input) : (s?.guest.step(r, input) ?? false);
        }}
        show={(r) => {
          const s = sync.current;
          if (s?.host) s.host.show(r);
          else s?.guest.show(r);
        }}
      />
      {!ended && <CoopParty run={run} members={members} extras={extras} t={t} onSignal={signal} />}
      {hostLost && (
        <div className="coop-banner" role="alert">
          <span>{t("coopHostLeft")}</span>
          <button type="button" className="small primary" onClick={onExit}>
            {t("leaveRoom")}
          </button>
        </div>
      )}
    </>
  );
}
