// 패왕전 같이 하기 대기실 (협동 방을 그대로 씀): 방장이 대결을 고르고, 저마다 준비방에서 장비를 골라 방장에게 보냄.
// 편 대결은 대기실에서 밴픽(pwRoomDraft)으로 캐릭터를 정함 (랭크전은 자리가 정해진 뒤 시작 전에 방장이 바로 밴픽을 시작). 초대 링크로 들어온 손님은 방장이 보낸 대결(pwm)을 받으면 패왕전 대기실로 바뀜
import { draftDone, PW_MODE, PW_MODES, rankSeats, type CharacterId, type PwLoadout, type PwMode, type RoomView } from "@pixel-rogue/shared";
import { useEffect, useState, type RefObject } from "react";
import { ChatBox } from "../battle/ChatBox";
import type { CoopWire } from "../coop/CoopScreen";
import type { CoopMsg } from "../coop/lockstep";
import type { Lang, TextKey } from "../i18n";
import { diffKey, PW_NAME } from "./PwModes";
import { type PwMapPick, PwMapList } from "./PwMaps";
import { PwDraftView } from "./PwDraft";
import { PwPrep } from "./PwPrep";
import { usePwRoomDraft } from "./pwRoomDraft";

/** 게임 화면에 넘기는 것: 대결 · 내 장비 · 사람마다 장비(방장) */
export interface PwRoomGame {
  mode: PwMode;
  /** 방장이 고른 경기장 (null = 무작위, 랭크전은 늘 무작위) */
  map: PwMapPick;
  lo?: PwLoadout;
  los: ReadonlyMap<string, PwLoadout>;
  /** 밴픽으로 정한 자리마다 캐릭터 (밴픽이 없는 대결은 없음) */
  picks?: readonly CharacterId[];
}

/** peers: 메시지를 보낼 다른 사람들 (방장은 손님 모두, 손님은 방장) */
/** start: 패왕전으로 들어옴(처음엔 3대3) · 대결을 정해서 들어옴(랭크전) · seatPids: 자리마다 사람 (밴픽 자리, "" = AI) */
export function usePwRoom(wireRef: RefObject<CoopWire>, start: boolean | PwMode, isHost: boolean, peers: () => string[], you: string, seatPids: readonly string[]) {
  const [mode, setModeState] = useState<PwMode | null>(typeof start === "string" ? start : start ? "trio" : null);
  const [map, setMapState] = useState<PwMapPick>(null);
  const [lo, setLo] = useState<PwLoadout | undefined>();
  /** 손님마다 받은 장비 (방장) */
  const [los, setLos] = useState<ReadonlyMap<string, PwLoadout>>(new Map());
  const send = (msg: CoopMsg, to?: string) => {
    const net = wireRef.current.net;
    if (!net) return;
    if (to) net.send(to, msg);
    else for (const pid of peers()) if (net.isOpen(pid)) net.send(pid, msg);
  };
  const draft = usePwRoomDraft(mode, isHost, you, seatPids, send);
  useEffect(() => {
    const wire = wireRef.current;
    wire.onPw = (pid, msg) => {
      if (msg.t === "pwm" && PW_MODES.includes(msg.mode)) {
        setModeState(msg.mode);
        setMapState(msg.map && PW_MODE[msg.mode].maps.includes(msg.map) ? msg.map : null);
      }
      if (msg.t === "pwlo" && msg.lo) setLos((m) => new Map(m).set(pid, msg.lo));
      draft.onMsg(pid, msg);
    };
    // 방장: 새로 연결된 손님에게 지금 대결 · 손님: 방장과 연결되면 내 장비
    wire.onPwOpen = (pid) => {
      if (isHost && mode) send({ t: "pwm", mode, map }, pid);
      if (!isHost && lo) send({ t: "pwlo", lo }, pid);
      draft.onOpen(pid);
    };
  });
  const setMode = (m: PwMode) => {
    setModeState(m);
    setMapState(null);
    if (isHost) send({ t: "pwm", mode: m, map: null });
  };
  const setMap = (m: PwMapPick) => {
    if (!mode || !isHost) return;
    setMapState(m);
    send({ t: "pwm", mode, map: m });
  };
  const ready = (l: PwLoadout) => {
    setLo(l);
    if (!isHost) send({ t: "pwlo", lo: l });
  };
  const picks = draft.on && draft.d && draftDone(draft.d) ? draft.d.picks.map((c) => c!) : undefined;
  const game: PwRoomGame | null = mode ? { mode, map, lo, los, picks } : null;
  /** 시작해도 되는지 (밴픽이 있으면 끝나야 함) */
  const canStart = !draft.on || !!picks;
  return { mode, setMode, map, setMap, lo, ready, game, draft, canStart };
}

/** 밴픽 자리 = 게임 자리 (CoopGame과 같은 규칙: 친구 방은 들어온 순서, 랭크전은 두 편에 나눔) */
export function pwSeatPids(room: RoomView | null): string[] {
  const pids = room?.players.filter((p) => p.state !== "watch").map((p) => p.pid) ?? [];
  return room?.rank ? rankSeats(room.rank, pids) : pids;
}

/** 랭크전 밴픽이 끝난 뒤 준비방 시간 */
const RANK_PREP_MS = 15000;

/** 랭크전 밴픽: 자리가 정해지면(시작 전) 방장이 밴픽을 시작하고, 다 고르면 done (서버에 알려 곧 시작) */
export function useRankDraft(drafting: boolean, pw: ReturnType<typeof usePwRoom>, done: () => void) {
  useEffect(() => {
    if (!drafting) return;
    if (!pw.draft.d) pw.draft.start();
    else if (pw.canStart) {
      // 다 고른 뒤 준비방(스킬 설명·작은 연습장)을 볼 시간을 주고 시작
      const id = window.setTimeout(done, RANK_PREP_MS);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafting, pw.draft.d, pw.canStart]);
}

interface DraftProps {
  room: RoomView;
  you: string;
  pw: ReturnType<typeof usePwRoom>;
  chat: { name: string; text: string }[];
  onChat: (text: string) => void;
  onLeave: () => void;
  lang: Lang;
  /** 랭크전: 판 시작까지 남은 초 (밴픽이 끝나면 준비방을 보여 줌) */
  startIn?: number;
  t: (key: TextKey) => string;
}

/** 친구 방·랭크전 밴픽 (혼자 하기와 같은 전체 화면): 사람 이름 · 빈 자리는 AI · 아래 채팅·나가기 · 랭크전은 끝나면 준비방 */
export function PwRoomDraft({ room, you, pw, chat, onChat, onLeave, lang, startIn, t }: DraftProps) {
  const { draft } = pw;
  if (!draft.d) return null;
  // 랭크전: 다 고르면 혼자 하기처럼 준비방 (스킬 설명 · 오른쪽 작은 연습장), 판은 저절로 시작
  const mine = draft.d.picks[draft.me];
  if (room.rank && draftDone(draft.d) && mine) return <PwPrep characterId={mine} lang={lang} t={t} startIn={startIn !== undefined && startIn > RANK_PREP_MS / 1000 + 5 ? -1 : startIn} onStart={() => {}} onBack={onLeave} />;
  const names = draft.d.picks.map((_, i) => room.players.find((p) => p.pid === draft.seats[i])?.name ?? "AI");
  return (
    <PwDraftView d={draft.d} names={names} ai={names.map((_, i) => !draft.seats[i])} me={draft.me} mine={draft.mine} endAt={draft.endAt} onAct={draft.act} t={t}>
      <ChatBox t={t} messages={chat} myName={room.players.find((p) => p.pid === you)?.name ?? ""} onSend={onChat} />
      <button type="button" className="ghost" onClick={onLeave}>
        {t("back")}
      </button>
    </PwDraftView>
  );
}

/** 밴픽 화면을 보일 때: 밴픽 중 (랭크전은 끝나도 판이 시작될 때까지) */
export const pwDrafting = (room: RoomView, pw: ReturnType<typeof usePwRoom>): boolean => !!pw.draft.d && (!draftDone(pw.draft.d) || !!room.rank);

interface PanelProps {
  room: RoomView;
  you: string;
  isHost: boolean;
  characterId: CharacterId;
  pw: ReturnType<typeof usePwRoom>;
  lang: Lang;
  t: (key: TextKey) => string;
}

/** 대기실 위쪽: 대결 고르기(방장) · 준비방 열기 · 장비를 고른 사람 수 */
export function PwRoomPanel({ room, you, isHost, characterId, pw, lang, t }: PanelProps) {
  const [prep, setPrep] = useState(false);
  if (!pw.mode) return null;
  const { draft } = pw;
  const def = PW_MODE[pw.mode];
  const done = room.players.filter((p) => (p.pid === you ? !!pw.lo : pw.game?.los.has(p.pid))).length;
  if (prep) {
    return (
      <div className="pw-room-prep">
        <PwPrep characterId={pw.game?.picks?.[draft.me] ?? characterId} lang={lang} t={t} onBack={() => setPrep(false)} onStart={(l) => (pw.ready(l), setPrep(false))} />
      </div>
    );
  }
  return (
    <div className="pw-room">
      <h3>
        {t("paewang")} · {t(PW_NAME[pw.mode])} <em className={`pw-diff ${diffKey(def.diff)}`}>{t(diffKey(def.diff))}</em>
      </h3>
      {isHost && !room.rank && (
        <div className="pw-room-modes">
          {PW_MODES.map((m) => (
            <button key={m} type="button" className={m === pw.mode ? "on" : ""} onClick={() => pw.setMode(m)}>
              {t(PW_NAME[m])}
            </button>
          ))}
        </div>
      )}
      {!room.rank && <PwMapList mode={pw.mode} pick={pw.map} t={t} onPick={pw.setMap} disabled={!isHost} />}
      <p className="hint">{t("pwRoomHint")}</p>
      {draft.on && isHost && !room.rank && (
        <button type="button" className={draft.d ? "ghost" : "primary"} onClick={draft.start}>
          {t(draft.d ? "pwDraftAgain" : "pwDraftStart")}
        </button>
      )}
      {draft.on && !room.rank && !pw.canStart && <small> {t("pwDraftNeed")}</small>}
      {def.prep && (!draft.on || pw.canStart) && (
        <button type="button" className={pw.lo ? "ghost" : "primary"} onClick={() => setPrep(true)}>
          {t("pwPrep")} {pw.lo ? "✓" : ""}
        </button>
      )}
      {def.prep && !draft.on && isHost && <small> {t("pwReady").replace("{n}", String(done)).replace("{m}", String(room.players.length))}</small>}
    </div>
  );
}
