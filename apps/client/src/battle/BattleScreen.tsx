import { CHARACTER_IDS, type CharacterId, type RoomView } from "@pixel-rogue/shared";
import { useRoomBalance } from "../balance";
import { useEffect, useRef, useState } from "react";
import { loadNickname } from "../player";
import { apiPost } from "../api";
import type { Lang, TextKey } from "../i18n";
import { loadText, saveText } from "../storage";
import { BattleEntry } from "./BattleEntry";
import { BattleGame } from "./BattleGame";
import { BattleLobby } from "./BattleLobby";
import { BattleConnection } from "./connection";

export { formatClock } from "./BattleLobby";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
  /** 초대 링크로 들어온 방 코드 (바로 들어감) */
  initialCode?: string;
  onExit: () => void;
}

const ERRORS: Record<string, TextKey> = {
  full: "battleFull",
  started: "battleStarted",
  disconnected: "battleDisconnected",
  offline: "errOffline",
};

/** 마지막에 고른 캐릭터 (다음 방에도 그대로) */
function loadCharacter(): CharacterId {
  const saved = loadText("battleCharacter") as CharacterId;
  return CHARACTER_IDS.includes(saved) ? saved : "warden";
}

/** 함께 하기: 입장(빠른 매칭 · 방 만들기 · 코드) → 대기실 → 게임 → 관전·결과 */
export function BattleScreen({ lang, setLang, t, initialCode, onExit }: Props) {
  const [characterId, setCharacterId] = useState<CharacterId>(loadCharacter);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [you, setYou] = useState("");
  const [offset, setOffset] = useState(0);
  const [chat, setChat] = useState<{ name: string; text: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [conn, setConn] = useState<BattleConnection | null>(null);

  // 연결을 바꾸거나 화면을 나가면 이전 연결을 닫음
  useEffect(() => () => conn?.close(), [conn]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const connect = (roomCode: string, mode: "quick" | "private") => {
    setError("");
    setChat([]);
    setBusy(true);
    const next = new BattleConnection(roomCode, mode, loadNickname(), characterId, {
      onRoom: (r, me, off) => {
        setBusy(false);
        setRoom(r);
        setYou(me);
        setOffset(off);
      },
      onChat: (name, text) => setChat((c) => [...c.slice(-50), { name, text }]),
      onError: (e) => {
        setBusy(false);
        // 빠른 매칭 방이 이미 시작했으면 다른 방으로 다시
        if (e === "started" && mode === "quick") return void quick(roomCode);
        setRoom(null);
        setError(t(ERRORS[e] ?? "errUnknown"));
      },
    });
    setConn(next);
  };

  const quick = async (exclude?: string) => {
    setBusy(true);
    const res = await apiPost<{ code: string }>("/api/match/quick", { exclude });
    if (res.ok && res.data) connect(res.data.code, "quick");
    else {
      setBusy(false);
      setError(t("errOffline"));
    }
  };

  const create = async () => {
    setBusy(true);
    const res = await apiPost<{ code: string }>("/api/match/create", {});
    if (res.ok && res.data) connect(res.data.code, "private");
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

  // 초대 링크로 왔으면 그 방에 바로 (개발 모드에서 두 번 돌아도 한 번만)
  const invitedRef = useRef(false);
  useEffect(() => {
    if (!initialCode || invitedRef.current) return;
    invitedRef.current = true;
    connect(initialCode, "private");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const serverNow = now + offset;
  // 시작하면 방에서 정한 게임 수치를 받아 둠 (카운트다운 동안)
  const roomBalance = useRoomBalance(room?.balance, !!room && room.phase !== "lobby");
  const inGame = !!room && room.phase !== "lobby" && serverNow >= room.startAt && roomBalance.ready;

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
    const me = room.players.find((p) => p.pid === you);
    return (
      <BattleGame
        room={room}
        balance={roomBalance.values}
        you={you}
        characterId={me?.characterId ?? characterId}
        clockOffset={offset}
        chat={chat}
        conn={conn}
        lang={lang}
        t={t}
        onExit={() => {
          leave();
          onExit();
        }}
      />
    );
  }

  if (room) {
    return (
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
          saveText("battleCharacter", c);
          conn?.send({ t: "character", characterId: c });
        }}
        onStart={() => conn?.send({ t: "start" })}
        onChat={(text) => conn?.send({ t: "chat", text })}
        onLeave={leave}
      />
    );
  }

  return (
    <BattleEntry
      lang={lang}
      setLang={setLang}
      t={t}
      busy={busy}
      error={error}
      onQuick={() => void quick()}
      onCreate={() => void create()}
      onJoin={(code) => connect(code, "private")}
      onBack={onExit}
    />
  );
}
