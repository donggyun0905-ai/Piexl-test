// 함께 하기 대기실: 방 코드·초대 | 캐릭터 고르기·참가자·시작 | 채팅
import { BATTLE_MAX_PLAYERS, COOP_MAX_PLAYERS, type CharacterId, type RoomView } from "@pixel-rogue/shared";
import { useState, type ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import { TopBar } from "../menu/TopBar";
import { TdPortrait } from "../td/TdScreen";
import { ChatBox } from "./ChatBox";
import { LobbyCharPicker } from "./LobbyCharPicker";
import { copyText, inviteUrl } from "./invite";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
  room: RoomView;
  you: string;
  /** 서버 시각 기준 지금 (ms) */
  serverNow: number;
  chat: { name: string; text: string }[];
  onCharacter: (id: CharacterId) => void;
  onStart: () => void;
  onChat: (text: string) => void;
  onLeave: () => void;
  /** 협동: 참가자 옆 연결 상태 */
  badge?: (pid: string) => ReactNode;
}

/** 남은 시간 m:ss */
export function formatClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** 자리 표시: 찬 자리는 색, 빈 자리는 점선 */
function Seats({ filled, max }: { filled: number; max: number }) {
  return (
    <span className="seats" aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < filled ? "on" : undefined} />
      ))}
    </span>
  );
}

export function BattleLobby({ lang, setLang, t, room, you, serverNow, chat, onCharacter, onStart, onChat, onLeave, badge }: Props) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";
  const me = room.players.find((p) => p.pid === you);
  const host = room.hostPid === you;
  const isPrivate = room.mode === "private";
  const counting = room.phase !== "lobby";
  const coop = room.kind === "coop";
  const max = coop ? COOP_MAX_PLAYERS : BATTLE_MAX_PLAYERS;
  const playing = room.players.filter((p) => p.state !== "watch").length;

  const copyLink = async () => {
    if (await copyText(inviteUrl(room.code, coop))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title: "pixel-rogue", text: t("inviteText"), url: inviteUrl(room.code, coop) });
    } catch {
      // 공유 창을 닫은 경우 등
    }
  };

  return (
    <>
      <TopBar lang={lang} setLang={setLang} t={t} />
      <main className="lobby-screen">
        {/* 왼쪽: 방 코드 · 초대 (빠른 매칭은 상대 찾기 상태) */}
        <section className="lobby-code">
          {isPrivate ? (
            <>
              <span className="field-label">{t("roomCode")}</span>
              <strong className="room-code-value">{room.code}</strong>
              <div className="room-code-actions">
                {canShare && (
                  <button type="button" className="small primary" onClick={() => void share()}>
                    {t("shareLink")}
                  </button>
                )}
                <button type="button" className="small outline" onClick={() => void copyLink()}>
                  {copied ? t("copied") : t("copyLink")}
                </button>
              </div>
              <p className="hint">{t("inviteHint")}</p>
            </>
          ) : (
            <>
              <span className="field-label">{t("quickMatch")}</span>
              <strong className="lobby-status">{room.autoStartAt > 0 ? t("matchFound") : t("waitingPlayers")}</strong>
              {room.autoStartAt > 0 && !counting && (
                <p className="hint">
                  {t("startsIn")} {formatClock(room.autoStartAt - serverNow)}
                </p>
              )}
            </>
          )}
        </section>

        {/* 가운데: 캐릭터 · 참가자 · 시작 */}
        <div className="lobby-main">
          {counting ? (
            <div className="lobby-countdown">
              <span className="field-label">{t("startsIn")}</span>
              <p className="countdown">{formatClock(room.startAt - serverNow)}</p>
            </div>
          ) : (
            <LobbyCharPicker t={t} picked={me?.characterId} onPick={onCharacter} />
          )}

          <section className="player-list">
            <h3>
              {t("players")} {playing}/{max}
              <Seats filled={playing} max={max} />
            </h3>
            <ul>
              {room.players.map((p) => (
                <li key={p.pid} className={p.pid === you ? "mine" : undefined}>
                  <TdPortrait id={p.characterId} size={28} />
                  <span className="nickname">{p.name}</span>
                  <small className="lobby-char-name">{t(p.characterId)}</small>
                  {p.state === "watch" && <span className="badge away">{t("lobbyWatcher")}</span>}
                  {p.pid === room.hostPid && isPrivate && <span className="badge host">{t("host")}</span>}
                  {p.pid === you && <span className="badge me">{t("you")}</span>}
                  {!p.connected && <span className="badge away">{t("bsAway")}</span>}
                  {badge?.(p.pid)}
                </li>
              ))}
            </ul>
          </section>

          {!counting && isPrivate && room.players.length < 2 && (
            <button type="button" className="outline" onClick={() => void (canShare ? share() : copyLink())}>
              {copied ? t("copied") : t("inviteFriends")}
            </button>
          )}

          {!counting && isPrivate && host && (
            <button type="button" className="primary big" onClick={onStart}>
              {t("startBattle")}
            </button>
          )}
          {!counting && isPrivate && host && coop && <p className="hint">{t("coopStartNote")}</p>}
          {!counting && isPrivate && !host && <p className="hint">{t("waitingHost")}</p>}

          {!counting && (
            <button type="button" className="ghost" onClick={onLeave}>
              {t("leaveRoom")}
            </button>
          )}
        </div>

        {/* 오른쪽: 채팅 */}
        <ChatBox t={t} messages={chat} myName={me?.name ?? ""} onSend={onChat} />
      </main>
    </>
  );
}
