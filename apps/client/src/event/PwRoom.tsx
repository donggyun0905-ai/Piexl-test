// 패왕전 같이 하기 대기실 (협동 방을 그대로 씀): 방장이 대결을 고르고, 저마다 준비방에서 장비를 골라 방장에게 보냄.
// 초대 링크로 들어온 손님은 방장이 보낸 대결(pwm)을 받으면 패왕전 대기실로 바뀜
import { PW_MODE, PW_MODES, type CharacterId, type PwLoadout, type PwMode, type RoomView } from "@pixel-rogue/shared";
import { useEffect, useState, type RefObject } from "react";
import type { CoopWire } from "../coop/CoopScreen";
import type { CoopMsg } from "../coop/lockstep";
import type { Lang, TextKey } from "../i18n";
import { diffKey, PW_NAME } from "./PwModes";
import { PwPrep } from "./PwPrep";

/** 게임 화면에 넘기는 것: 대결 · 내 장비 · 사람마다 장비(방장) */
export interface PwRoomGame {
  mode: PwMode;
  lo?: PwLoadout;
  los: ReadonlyMap<string, PwLoadout>;
}

/** peers: 메시지를 보낼 다른 사람들 (방장은 손님 모두, 손님은 방장) */
export function usePwRoom(wireRef: RefObject<CoopWire>, start: boolean, isHost: boolean, peers: () => string[]) {
  const [mode, setModeState] = useState<PwMode | null>(start ? "trio" : null);
  const [lo, setLo] = useState<PwLoadout | undefined>();
  /** 손님마다 받은 장비 (방장) */
  const [los, setLos] = useState<ReadonlyMap<string, PwLoadout>>(new Map());
  const send = (msg: CoopMsg, to?: string) => {
    const net = wireRef.current.net;
    if (!net) return;
    if (to) net.send(to, msg);
    else for (const pid of peers()) if (net.isOpen(pid)) net.send(pid, msg);
  };
  useEffect(() => {
    const wire = wireRef.current;
    wire.onPw = (pid, msg) => {
      if (msg.t === "pwm" && PW_MODES.includes(msg.mode)) setModeState(msg.mode);
      if (msg.t === "pwlo" && msg.lo) setLos((m) => new Map(m).set(pid, msg.lo));
    };
    // 방장: 새로 연결된 손님에게 지금 대결 · 손님: 방장과 연결되면 내 장비
    wire.onPwOpen = (pid) => {
      if (isHost && mode) send({ t: "pwm", mode }, pid);
      if (!isHost && lo) send({ t: "pwlo", lo }, pid);
    };
  });
  const setMode = (m: PwMode) => {
    setModeState(m);
    if (isHost) send({ t: "pwm", mode: m });
  };
  const ready = (l: PwLoadout) => {
    setLo(l);
    if (!isHost) send({ t: "pwlo", lo: l });
  };
  const game: PwRoomGame | null = mode ? { mode, lo, los } : null;
  return { mode, setMode, lo, ready, game };
}

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
  const def = PW_MODE[pw.mode];
  const done = room.players.filter((p) => (p.pid === you ? !!pw.lo : pw.game?.los.has(p.pid))).length;
  if (prep) {
    return (
      <div className="pw-room-prep">
        <PwPrep characterId={characterId} lang={lang} t={t} onBack={() => setPrep(false)} onStart={(l) => (pw.ready(l), setPrep(false))} />
      </div>
    );
  }
  return (
    <div className="pw-room">
      <h3>
        {t("paewang")} · {t(PW_NAME[pw.mode])} <em className={`pw-diff ${diffKey(def.diff)}`}>{t(diffKey(def.diff))}</em>
      </h3>
      {isHost && (
        <div className="pw-room-modes">
          {PW_MODES.map((m) => (
            <button key={m} type="button" className={m === pw.mode ? "on" : ""} onClick={() => pw.setMode(m)}>
              {t(PW_NAME[m])}
            </button>
          ))}
        </div>
      )}
      <p className="hint">{t("pwRoomHint")}</p>
      {def.prep && (
        <button type="button" className={pw.lo ? "ghost" : "primary"} onClick={() => setPrep(true)}>
          {t("pwPrep")} {pw.lo ? "✓" : ""}
        </button>
      )}
      {def.prep && isHost && <small> {t("pwReady").replace("{n}", String(done)).replace("{m}", String(room.players.length))}</small>}
    </div>
  );
}
