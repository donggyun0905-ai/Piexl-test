// 레이드 명예의 전당: 라스트 보스 셋을 가장 빨리 잡은 사람들 (보스마다 1위는 크게 · 2~3위 은·동 · 4~10위 목록) · 웅장한 음악
import { RAID_BOSSES } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiGet } from "../api";
import { startHallMusic, stopHallMusic } from "../audio/fanfare";
import type { TextKey } from "../i18n";
import { raidTime } from "./raidTime";

interface Entry {
  rank: number;
  nickname: string;
  ticks: number;
  character: string;
  finished: number;
}

const BOSS_NAME: Record<string, TextKey> = { dragon: "bossDragon", godeater: "bossGodEater", plight: "bossPrimeval" };
/** 흩날리는 빛 가루 (자리·늦게 시작·크기는 순서로 정해 둠) */
const SPARKS = Array.from({ length: 36 }, (_, i) => ({ left: (i * 37) % 100, delay: (i * 0.7) % 9, size: 2 + (i % 3) }));

function Champion({ e, t }: { e: Entry; t: (key: TextKey) => string }) {
  return (
    <div className="hall-champ">
      <div className="hall-crown" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hall-champ-label">{t("hallChampion")}</div>
      <div className="hall-champ-name">{e.nickname}</div>
      <div className="hall-champ-time">{raidTime(e.ticks)}</div>
      <div className="hall-champ-meta">
        <span className={`lb-char ${e.character}`} /> {t(e.character as TextKey)} · {new Date(e.finished).toISOString().slice(0, 10)}
      </div>
    </div>
  );
}

function BossColumn({ boss, entries, t }: { boss: string; entries: Entry[]; t: (key: TextKey) => string }) {
  const [first, ...rest] = entries;
  return (
    <section className={`hall-boss hall-${boss}`}>
      <h3 className="hall-boss-name">
        <span className="hall-gem" aria-hidden="true" />
        {t(BOSS_NAME[boss]!)}
      </h3>
      {first ? <Champion e={first} t={t} /> : <p className="hall-empty">{t("hallEmpty")}</p>}
      {rest.length > 0 && (
        <ol className="hall-list">
          {rest.map((e) => (
            <li key={e.rank} className={e.rank <= 3 ? `hall-podium hall-r${e.rank}` : ""}>
              <span className="hall-rank">{e.rank}</span>
              <span className={`lb-char ${e.character}`} />
              <span className="hall-name">{e.nickname}</span>
              <strong className="hall-time">{raidTime(e.ticks)}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function HallOfFame({ t, onBack }: { t: (key: TextKey) => string; onBack: () => void }) {
  const [boards, setBoards] = useState<Record<string, Entry[]> | null>(null);
  const [error, setError] = useState("");
  const [music, setMusic] = useState(true);

  useEffect(() => {
    void apiGet<{ boards: Record<string, Entry[]> }>("/api/raid/board").then((res) => {
      if (res.ok && res.data) setBoards(res.data.boards);
      else setError(t("errOffline"));
    });
  }, [t]);

  useEffect(() => {
    if (music) startHallMusic();
    else stopHallMusic();
    return stopHallMusic;
  }, [music]);

  return (
    <div className="hall-screen">
      <div className="hall-rays" aria-hidden="true" />
      <div className="hall-sparks" aria-hidden="true">
        {SPARKS.map((p, i) => (
          <span key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, width: p.size, height: p.size }} />
        ))}
      </div>
      <header className="hall-head">
        <div className="hall-laurel" aria-hidden="true">
          ❦ ✦ ❦
        </div>
        <h2 className="hall-title">{t("hallTitle")}</h2>
        <p className="hall-sub">{t("hallSub")}</p>
      </header>
      {error && <p className="form-error">{error}</p>}
      {!boards && !error && <p className="hall-sub">…</p>}
      {boards && (
        <div className="hall-bosses">
          {RAID_BOSSES.map((b) => (
            <BossColumn key={b} boss={b} entries={boards[b] ?? []} t={t} />
          ))}
        </div>
      )}
      <p className="account-note hall-note">{t("hallNote")}</p>
      <div className="hall-buttons">
        <button type="button" className="secondary" onClick={() => setMusic((m) => !m)}>
          {t(music ? "hallMusicOff" : "hallMusicOn")}
        </button>
        <button type="button" className="secondary" onClick={onBack}>
          {t("back")}
        </button>
      </div>
    </div>
  );
}
