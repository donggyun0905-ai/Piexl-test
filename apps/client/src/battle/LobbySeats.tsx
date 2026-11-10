// 대기실 자리 카드 줄: 사람마다 움직이는 캐릭터 그림 · 닉네임 · 캐릭터 · 방장/나/연결 표시 · 빈 자리는 점선(누르면 초대)
// 협동은 자리 색(게임 안 이름표·점 색과 같음)을 카드 위 줄로 보여 줌
import type { RoomView } from "@pixel-rogue/shared";
import type { ReactNode } from "react";
import { seatColor } from "../coop/extras";
import type { TextKey } from "../i18n";
import { SkinPreview } from "../shop/SkinPreview";

interface Props {
  t: (key: TextKey) => string;
  room: RoomView;
  you: string;
  max: number;
  /** 협동: 사람 옆 연결 상태 */
  badge?: (pid: string) => ReactNode;
  /** 빈 자리를 누르면 (친구 방만) */
  onInvite?: () => void;
}

export function LobbySeats({ t, room, you, max, badge, onInvite }: Props) {
  const coop = room.kind === "coop";
  const isPrivate = room.mode === "private";
  const playing = room.players.filter((p) => p.state !== "watch");
  const watching = room.players.filter((p) => p.state === "watch");
  const empty = Math.max(0, max - playing.length);
  return (
    <section className="room-seats" aria-label={`${t("players")} ${playing.length}/${max}`}>
      {[...playing, ...watching].map((p, i) => (
        <article
          key={p.pid}
          className={`room-seat${p.pid === you ? " me" : ""}${p.connected ? "" : " away"}${p.state === "watch" ? " watch" : ""}`}
          style={coop && p.state !== "watch" ? { borderTopColor: seatColor(i) } : undefined}
        >
          <span className="room-seat-art">
            <SkinPreview sheet={p.characterId} size={72} />
          </span>
          <strong className="room-seat-name">{p.name}</strong>
          <small className="room-seat-char">{t(p.characterId)}</small>
          <span className="room-seat-badges">
            {p.pid === room.hostPid && isPrivate && <span className="badge host">{t("host")}</span>}
            {p.pid === you && <span className="badge me">{t("you")}</span>}
            {p.state === "watch" && <span className="badge away">{t("lobbyWatcher")}</span>}
            {!p.connected && <span className="badge away">{t("bsAway")}</span>}
            {badge?.(p.pid)}
          </span>
        </article>
      ))}
      {Array.from({ length: empty }, (_, i) =>
        isPrivate && onInvite ? (
          <button key={`e${i}`} type="button" className="room-seat empty" onClick={onInvite}>
            <span className="room-seat-plus">+</span>
            <small>{t("inviteFriends")}</small>
          </button>
        ) : (
          <div key={`e${i}`} className="room-seat empty">
            <span className="room-seat-plus">…</span>
            <small>{t("roomSeatOpen")}</small>
          </div>
        ),
      )}
    </section>
  );
}
