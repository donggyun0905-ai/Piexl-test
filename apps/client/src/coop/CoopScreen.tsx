// 협동: 입장(빠른 매칭 · 방 만들기 · 코드) → 대기실(배틀 대기실을 같이 씀, 방장과 직접 연결) → 게임
import { RANK_MODE, type CharacterId, type RaidEventBoss, type RankChange, type RankQueue, type RoomView } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { apiPost } from "../api";
import { BattleEntry } from "../battle/BattleEntry";
import { BattleLobby } from "../battle/BattleLobby";
import { BattleConnection } from "../battle/connection";
import type { Lang, TextKey } from "../i18n";
import { loadNickname } from "../player";
import { loadAchievements } from "../records";
import { loadText, saveText } from "../storage";
import { RankFinding } from "../event/RankResult";
import { CoopGame } from "./CoopGame";
import { ERRORS, loadCharacter, type CoopWire } from "./coopWire";
export type { CoopWire } from "./coopWire";
import { pwDrafting, PwRoomDraft, PwRoomPanel, pwSeatPids, usePwRoom, useRankDraft } from "../event/PwRoom";
import { CoopNameAsk } from "./CoopNameAsk";
import type { CoopMsg } from "./lockstep";
import { fetchIce, PeerNet } from "./peer";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
  /** 초대 링크로 들어온 방 코드 (바로 들어감) */
  initialCode?: string;
  pw?: boolean; // 패왕전 같이 하기로 들어옴 (방장이 대결을 고름)
  /** 패왕전 랭크전 (빠른 매칭으로 바로 들어가고, 대결은 정해져 있음) · 끝나고 다시 찾기 */
  rank?: RankQueue;
  onAgain?: () => void;
  raid?: RaidEventBoss; // 이벤트 '레이드' (방장이 시작하면 레이드 판, 빈자리는 AI)
  onExit: () => void;
}

export function CoopScreen({ lang, setLang, t, initialCode, pw: pwStart = false, rank, onAgain, raid, onExit }: Props) {
  const [characterId, setCharacterId] = useState<CharacterId>(loadCharacter);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [you, setYou] = useState("");
  const [offset, setOffset] = useState(0);
  const [chat, setChat] = useState<{ name: string; text: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [conn, setConn] = useState<BattleConnection | null>(null);
  const [linked, setLinked] = useState<ReadonlySet<string>>(new Set());
  /** 랭크전 점수 변화 (null = 아직 · 빈 목록 = 반영 안 됨) */
  const [rankChanges, setRankChanges] = useState<RankChange[] | null>(null);
  // 초대 링크로 왔는데 저장된 닉네임이 없으면 먼저 닉네임부터
  const [askName, setAskName] = useState(() => !!initialCode && !loadText("nickname"));
  const wire = useRef<CoopWire>({
    net: null,
    unlocks: new Map(),
    pending: [],
    onMessage: (pid, msg) => {
      if (msg.t === "state" || msg.t === "ticks") wire.current.pending.push({ pid, msg });
    },
    onOpen: () => {},
    onClose: () => {},
  });

  useEffect(() => () => conn?.close(), [conn]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const connect = (roomCode: string, mode: "quick" | "private" = "private") => {
    setError("");
    setChat([]);
    setBusy(true);
    const next = new BattleConnection(
      roomCode,
      mode,
      loadNickname(),
      characterId,
      {
        onRoom: (r, me, off) => {
          if (r.kind !== "coop") {
            next.close();
            setConn(null);
            setRoom(null);
            setBusy(false);
            return setError(t(ERRORS.wrong!));
          }
          setBusy(false);
          setRoom(r);
          setYou(me);
          setOffset(off);
        },
        onChat: (name, text) => setChat((c) => [...c.slice(-50), { name, text }]),
        onError: (e) => {
          // 빠른 매칭 방이 막 시작했으면 다른 방으로
          if (e === "started" && mode === "quick") return void quick(roomCode);
          setBusy(false);
          setRoom(null);
          setError(t(ERRORS[e] ?? "errUnknown"));
        },
        onSignal: (from, data) => void wire.current.net?.onSignal(from, data),
        onRank: setRankChanges,
      },
      "coop",
      rank,
    );
    setConn(next);
  };

  const quick = async (exclude?: string) => {
    setBusy(true);
    const res = rank ? await apiPost<{ code: string }>("/api/match/rank", { exclude, kind: rank }) : await apiPost<{ code: string }>("/api/match/quick", { exclude, kind: raid ? "raid" : "coop" });
    if (res.ok && res.data) connect(res.data.code, "quick");
    else {
      setBusy(false);
      setError(t("errOffline"));
    }
  };

  const create = async () => {
    setBusy(true);
    const res = await apiPost<{ code: string }>("/api/match/create", {});
    if (res.ok && res.data) connect(res.data.code);
    else {
      setBusy(false);
      setError(t("errOffline"));
    }
  };
  const leave = () => {
    setConn(null);
    setRoom(null);
    setBusy(false);
  };
  const hostPid = room?.hostPid ?? "";
  const isHost = !!you && hostPid === you;
  const seatPids = pwSeatPids(room);
  const pw = usePwRoom(wire, rank ? RANK_MODE[rank] : pwStart, isHost, () => (isHost ? (room?.players.map((p) => p.pid).filter((p) => p !== you) ?? []) : [hostPid]), you, seatPids);
  // 직접 연결: 방장이 바뀌면 새로 (손님은 방장하고만 연결)
  useEffect(() => {
    if (!conn || !you || !hostPid) return;
    let dead = false;
    let net: PeerNet | null = null;
    const w = wire.current;
    void fetchIce().then((ice) => {
      if (dead) return;
      net = new PeerNet(ice, (to, data) => conn.send({ t: "signal", to, data }), {
        onOpen: (pid) => {
          setLinked((s) => new Set(s).add(pid));
          if (pid === hostPid && !isHost) net?.send(pid, { t: "hi", unlocks: loadAchievements() } satisfies CoopMsg);
          w.onOpen(pid);
          w.onPwOpen?.(pid);
        },
        onMessage: (pid, msg) => {
          const m = msg as CoopMsg;
          if (m.t === "hi" && Array.isArray(m.unlocks)) w.unlocks.set(pid, m.unlocks.map(String));
          if (m.t === "pwm" || m.t === "pwlo" || m.t === "pwd" || m.t === "pwda") return w.onPw?.(pid, m);
          w.onMessage(pid, m);
        },
        onClose: (pid) => {
          setLinked((s) => {
            const n = new Set(s);
            n.delete(pid);
            return n;
          });
          w.onClose(pid);
        },
      });
      w.net = net;
      setLinked(new Set());
    });
    return () => {
      dead = true;
      net?.close();
      w.net = null;
    };
  }, [conn, you, hostPid, isHost]);

  // 방장: 아직 연결 안 된 손님에게 연결 시작 (끊긴 손님은 다시)
  const players = room?.players.map((p) => `${p.pid}:${p.connected}`).join() ?? "";
  useEffect(() => {
    if (!isHost || !room) return;
    const id = setInterval(() => {
      const net = wire.current.net;
      if (!net) return;
      for (const p of room.players) if (p.pid !== you && p.connected && !net.has(p.pid)) void net.call(p.pid);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, players, you]);

  // 랭크전: 들어오자마자 빠른 매칭
  useEffect(() => {
    if (rank) void quick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 초대 링크로 왔으면 그 방에 바로
  const invitedRef = useRef(false);
  useEffect(() => {
    if (!initialCode || askName || invitedRef.current) return;
    invitedRef.current = true;
    connect(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, askName]);

  const serverNow = now + offset;
  const inGame = !!room && room.phase !== "lobby" && serverNow >= room.startAt;
  useRankDraft(!!rank && isHost && room?.phase === "playing" && !inGame, pw, () => conn?.send({ t: "draftdone" }));
  // 판이 끝나 대기실로 돌아오면 지난 판 메시지는 버림
  useEffect(() => void (inGame || wire.current.pending.splice(0)), [inGame]);

  // 브라우저 뒤로가기: 대기실이면 방 나가기, 게임 중이면 무시(게임 안 메뉴로), 입장 화면이면 메뉴로
  const stateRef = useRef({ room, inGame });
  stateRef.current = { room, inGame };
  useEffect(() => {
    const onPop = () => {
      const s = stateRef.current;
      if (!s.room) return onExit();
      history.pushState({ pr: 1 }, "");
      if (!s.inGame && s.room.phase === "lobby") leave();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onExit]);

  if (room && inGame && conn) {
    return (
      <CoopGame
        room={room}
        you={you}
        characterId={room.players.find((p) => p.pid === you)?.characterId ?? characterId}
        wire={wire.current}
        pw={pw.game}
        raid={raid}
        lang={lang}
        t={t}
        onExit={() => {
          leave();
          onExit();
        }}
        onBackRoom={() => conn.send({ t: "lobby" })}
        rank={rank ? { changes: rankChanges, report: (winner) => conn.send({ t: "rankres", winner }), again: () => (leave(), onAgain?.()) } : undefined}
      />
    );
  }

  if (room && pwDrafting(room, pw)) {
    return (
      <PwRoomDraft room={room} you={you} pw={pw} chat={chat} onChat={(text) => conn?.send({ t: "chat", text })} onLeave={rank ? onExit : leave} lang={lang} startIn={room.phase === "playing" ? Math.max(0, Math.ceil((room.startAt - serverNow) / 1000)) : undefined} onStart={isHost && !rank ? () => conn?.send({ t: "start" }) : undefined} t={t} />
    );
  }

  if (room) {
    return (
      <>
      <PwRoomPanel room={room} you={you} isHost={isHost} characterId={room.players.find((p) => p.pid === you)?.characterId ?? characterId} pw={pw} lang={lang} t={t} />
      <BattleLobby
        lang={lang}
        setLang={setLang}
        t={t}
        room={room}
        you={you}
        serverNow={serverNow}
        chat={chat}
        onCharacter={(c) => {
          setCharacterId(c);
          saveText("coopCharacter", c);
          conn?.send({ t: "character", characterId: c });
        }}
        onStart={() => pw.canStart && conn?.send({ t: "start" })}
        onChat={(text) => conn?.send({ t: "chat", text })}
        onLeave={rank ? onExit : leave}
        badge={(pid) => {
          // 방장과 나 사이의 직접 연결 상태 (방장 화면에서는 손님마다)
          const peer = isHost ? pid : pid === hostPid ? pid : "";
          if (!peer || peer === you) return null;
          return linked.has(peer) ? <span className="badge linked">{t("coopLinked")}</span> : <span className="badge linking">{t("coopLinking")}</span>;
        }}
      />
      </>
    );
  }

  if (rank) return <RankFinding queue={rank} error={error} t={t} onBack={onExit} />;

  if (askName) return <CoopNameAsk lang={lang} setLang={setLang} t={t} onDone={() => setAskName(false)} onBack={onExit} />;

  return (
    <BattleEntry
      lang={lang}
      setLang={setLang}
      t={t}
      busy={busy}
      error={error}
      note={pwStart ? "pwMultiDesc" : raid ? "raidNote" : "coopNote"}
      quickDesc={raid ? "raidQuickDesc" : "coopQuickDesc"}
      onQuick={pwStart ? undefined : () => void quick()}
      onCreate={() => void create()}
      onJoin={(code) => connect(code)}
      onBack={onExit}
    />
  );
}
