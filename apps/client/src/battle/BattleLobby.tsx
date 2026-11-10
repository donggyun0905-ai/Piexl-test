// 함께 하기·협동 대기실: 위 제목·방 코드(복사·공유) · 자리 카드 줄 · 캐릭터 고르기 | 채팅 · 아래 나가기·시작 줄
import { BATTLE_MAX_PLAYERS, COOP_MAX_PLAYERS, type CharacterId, type RoomView } from "@pixel-rogue/shared";
import { useState, type ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import { TopBar } from "../menu/TopBar";
import { ChatBox } from "./ChatBox";
import { LobbyCharPicker } from "./LobbyCharPicker";
import { LobbySeats } from "./LobbySeats";
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
  /** 위 제목 (함께 하기·협동·레이드·패왕전) */
  title?: TextKey;
}

/** 남은 시간 m:ss */
export function formatClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function BattleLobby({ lang, setLang, t, room, you, serverNow, chat, onCharacter, onStart, onChat, onLeave, badge, title = "playTogether" }: Props) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";
  const me = room.players.find((p) => p.pid === you);
  const host = room.hostPid === you;
  const isPrivate = room.mode === "private";
  const counting = room.phase !== "lobby";
  const coop = room.kind === "coop";
  const max = coop ? COOP_MAX_PLAYERS : BATTLE_MAX_PLAYERS;

  const copyLink = async () => {
    if (await copyText(inviteUrl(room.code, coop))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title: "Pixel Toybox", text: t("inviteText"), url: inviteUrl(room.code, coop) });
    } catch {
      // 공유 창을 닫은 경우 등
    }
  };
  const invite = () => void (canShare ? share() : copyLink());

  return (
    <>
      <TopBar lang={lang} setLang={setLang} t={t} />
      <main className="room-screen">
        {/* 위: 제목 · 방 코드와 초대 (빠른 매칭은 상대 찾기 상태) */}
        <header className="room-head">
          <div className="room-title">
            <h1>{t(title)}</h1>
            <p className="hint">{isPrivate ? t("inviteHint") : room.autoStartAt > 0 ? t("matchFound") : t("waitingPlayers")}</p>
          </div>
          {isPrivate ? (
            <div className="room-code">
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
            </div>
          ) : (
            room.autoStartAt > 0 &&
            !counting && (
              <div className="room-code">
                <span className="field-label">{t("startsIn")}</span>
                <strong className="room-code-value">{formatClock(room.autoStartAt - serverNow)}</strong>
              </div>
            )
          )}
        </header>

        <LobbySeats t={t} room={room} you={you} max={max} badge={badge} onInvite={invite} />

        {/* 가운데: 캐릭터 고르기(시작 전) 또는 남은 시간 | 채팅 */}
        <div className="room-body">
          {counting ? (
            <div className="room-countdown">
              <span className="field-label">{t("startsIn")}</span>
              <p className="countdown">{formatClock(room.startAt - serverNow)}</p>
            </div>
          ) : (
            <LobbyCharPicker t={t} picked={me?.characterId} onPick={onCharacter} />
          )}
          <ChatBox t={t} messages={chat} myName={me?.name ?? ""} onSend={onChat} />
        </div>

        {/* 아래: 나가기 · 안내 · 시작 */}
        {!counting && (
          <footer className="room-actions">
            <button type="button" className="ghost" onClick={onLeave}>
              {t("leaveRoom")}
            </button>
            <p className="hint">{isPrivate ? (host ? (coop ? t("coopStartNote") : "") : t("waitingHost")) : ""}</p>
            {isPrivate && host && (
              <button type="button" className="primary big" onClick={onStart}>
                {t("startBattle")}
              </button>
            )}
          </footer>
        )}
      </main>
    </>
  );
}
