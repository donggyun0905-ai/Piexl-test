// 패왕전 랭크전: 내 티어 카드 둘(1대1 · 3대3: 로고 · 티어 · 점수 · 승패 · 승률 · 순위) · 랭크전 시작 · 순위표 창
import { RANK_QUEUES, rankOf, type RankQueue } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiGet } from "../api";
import type { TextKey } from "../i18n";
import { getPlayerId } from "../player";
import { RankEmblem } from "./RankEmblem";

export interface RankStat {
  rating: number;
  wins: number;
  losses: number;
  /** 순위 (판이 없으면 0) */
  place: number;
}

interface BoardRow {
  rank: number;
  nickname: string;
  rating: number;
  wins: number;
  losses: number;
}

const ROMAN = ["", "I", "II", "III"];
export const QUEUE_NAME: Record<RankQueue, TextKey> = { solo: "rankSolo", team: "rankTeam" };

/** 티어 이름 (단계 있으면 로마 숫자) */
export function tierText(t: (k: TextKey) => string, rating: number, place: number): string {
  const r = rankOf(rating, place);
  return `${t(`tier_${r.tier}` as TextKey)}${r.div ? ` ${ROMAN[r.div]}` : ""}`;
}

const winRate = (w: number, l: number) => (w + l > 0 ? Math.round((w / (w + l)) * 100) : 0);

export function recordText(t: (k: TextKey) => string, w: number, l: number): string {
  return t("rankRecord").replace("{w}", String(w)).replace("{l}", String(l)).replace("{p}", String(winRate(w, l)));
}

/** 내 랭크 점수 (서버) */
export function useRankMe(): Partial<Record<RankQueue, RankStat>> | null | "offline" {
  const [me, setMe] = useState<Partial<Record<RankQueue, RankStat>> | null | "offline">(null);
  useEffect(() => {
    let live = true;
    void apiGet<Record<RankQueue, RankStat>>(`/api/rank/me?player=${encodeURIComponent(getPlayerId())}`).then((res) => {
      if (live) setMe(res.ok && res.data ? res.data : "offline");
    });
    return () => {
      live = false;
    };
  }, []);
  return me;
}

function TierCard({ queue, stat, t, onPlay }: { queue: RankQueue; stat?: RankStat; t: (k: TextKey) => string; onPlay: () => void }) {
  const rating = stat?.rating ?? 1000;
  const r = rankOf(rating, stat?.place ?? 0);
  const played = !!stat && stat.wins + stat.losses > 0;
  return (
    <button type="button" className={`rank-card ${r.tier}`} onClick={onPlay}>
      <RankEmblem tier={r.tier} div={r.div} size={72} />
      <span className="rank-card-text">
        <strong>{t(QUEUE_NAME[queue])}</strong>
        <b>{tierText(t, rating, stat?.place ?? 0)}</b>
        <small>
          {t("rankPoints").replace("{n}", String(rating))}
          {played && stat!.place > 0 && ` · ${t("rankPlace").replace("{n}", String(stat!.place))}`}
        </small>
        <small>{played ? recordText(t, stat!.wins, stat!.losses) : t("rankNone")}</small>
      </span>
    </button>
  );
}

/** 순위표 창: 대결 탭 · 순위 · 로고 · 이름 · 점수 · 승패 · 승률 */
function RankBoard({ t, onClose }: { t: (k: TextKey) => string; onClose: () => void }) {
  const [queue, setQueue] = useState<RankQueue>("solo");
  // 대결마다 받은 순위표 (없으면 불러오는 중)
  const [boards, setBoards] = useState<Partial<Record<RankQueue, BoardRow[] | "offline">>>({});
  const rows = boards[queue];
  useEffect(() => {
    let live = true;
    void apiGet<{ entries: BoardRow[] }>(`/api/rank/board?queue=${queue}`).then((res) => live && setBoards((b) => ({ ...b, [queue]: res.ok && res.data ? res.data.entries : "offline" })));
    return () => {
      live = false;
    };
  }, [queue]);
  return (
    <div className="game-overlay" onClick={onClose}>
      <div className="modal rank-board" onClick={(e) => e.stopPropagation()}>
        <h2>{t("rankBoard")}</h2>
        <div className="rank-tabs">
          {RANK_QUEUES.map((q) => (
            <button key={q} type="button" className={q === queue ? "on" : ""} onClick={() => setQueue(q)}>
              {t(QUEUE_NAME[q])}
            </button>
          ))}
        </div>
        {rows === "offline" && <p className="hint">{t("rankOffline")}</p>}
        {Array.isArray(rows) && rows.length === 0 && <p className="hint">{t("rankNone")}</p>}
        {Array.isArray(rows) && rows.length > 0 && (
          <ol className="rank-rows">
            {rows.map((row) => {
              const r = rankOf(row.rating, row.rank);
              return (
                <li key={row.rank} className={r.tier}>
                  <span className="rank-no">{row.rank}</span>
                  <RankEmblem tier={r.tier} div={r.div} size={30} />
                  <span className="rank-name">
                    <b>{row.nickname || "?"}</b>
                    <small>{tierText(t, row.rating, row.rank)}</small>
                  </span>
                  <span className="rank-pts">{t("rankPoints").replace("{n}", String(row.rating))}</span>
                  <small className="rank-rec">{recordText(t, row.wins, row.losses)}</small>
                </li>
              );
            })}
          </ol>
        )}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            {t("back")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RankPanel({ t, onPlay }: { t: (k: TextKey) => string; onPlay: (queue: RankQueue) => void }) {
  const me = useRankMe();
  const [board, setBoard] = useState(false);
  const stats = me && me !== "offline" ? me : {};
  return (
    <section className="rank-panel">
      <h3>🏆 {t("rankTitle")}</h3>
      <p className="hint">{t("rankDesc")}</p>
      {me === "offline" && <p className="hint">{t("rankOffline")}</p>}
      <div className="rank-cards">
        {RANK_QUEUES.map((q) => (
          <TierCard key={q} queue={q} stat={stats[q]} t={t} onPlay={() => onPlay(q)} />
        ))}
      </div>
      <button type="button" className="ghost" onClick={() => setBoard(true)}>
        {t("rankBoard")}
      </button>
      {board && <RankBoard t={t} onClose={() => setBoard(false)} />}
    </section>
  );
}
