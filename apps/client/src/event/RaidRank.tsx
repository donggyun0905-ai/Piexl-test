// 레이드 랭킹 창 (레이드 목록·준비하기의 '레이드 랭킹' 버튼): 보스를 잡기까지 걸린 시간 빠른 순 · 같이 싸운 캐릭터 · 사람 수. Esc·바깥 누르면 닫힘
import { RAID_EVENT_BOSSES, type RaidEventBoss } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { raidTime } from "../daily/raidTime";
import type { TextKey } from "../i18n";
import { loadNickname } from "../player";
import { useAccEsc } from "./acc/accStore";
import { loadRaidRank, type RaidRankBoards } from "./raidRank";

type T = (key: TextKey) => string;

export function RaidRank({ t, boss = RAID_EVENT_BOSSES[0], onClose }: { t: T; boss?: RaidEventBoss; onClose: () => void }) {
  const [boards, setBoards] = useState<RaidRankBoards | null>(null);
  const [error, setError] = useState(false);
  const [pick, setPick] = useState<RaidEventBoss>(boss);
  useAccEsc(onClose);
  useEffect(() => {
    void loadRaidRank().then((b) => (b ? setBoards(b) : setError(true)));
  }, []);
  const me = loadNickname();
  const list = boards?.[pick] ?? [];
  return (
    <div className="acc-back" onClick={onClose}>
      <div className="acc-win raid-rank" role="dialog" aria-label={t("accRank")} onClick={(e) => e.stopPropagation()}>
        <header className="acc-top">
          <div>
            <h2>🏆 {t("accRank")}</h2>
            <small>{t("accRankSub")}</small>
          </div>
          <div className="acc-tools">
            {RAID_EVENT_BOSSES.length > 1 &&
              RAID_EVENT_BOSSES.map((b) => (
                <button key={b} type="button" className={b === pick ? "primary" : ""} onClick={() => setPick(b)}>
                  {t(`raid_${b}` as TextKey)}
                </button>
              ))}
            <button type="button" className="ghost" onClick={onClose}>
              {t("accClose")}
            </button>
          </div>
        </header>
        {error && <p className="form-error">{t("errOffline")}</p>}
        {!boards ? (
          !error && <p className="acc-empty">…</p>
        ) : list.length === 0 ? (
          <p className="acc-empty">{t("boardEmpty")}</p>
        ) : (
          <ol className="raid-rank-list">
            {list.map((e) => (
              <li key={e.rank} className={`${e.rank <= 3 ? `top${e.rank}` : ""}${e.nickname === me ? " me" : ""}`}>
                <b className="rr-rank">{e.rank}</b>
                <span className="rr-name">
                  {e.nickname}
                  <small>{t(e.character as TextKey)}</small>
                </span>
                <span className="rr-party">
                  {e.party.map((c, i) => (
                    <i key={i} className={`lb-char ${c}`} title={t(c as TextKey)} />
                  ))}
                  <small>{e.humans > 1 ? t("accRankParty").replace("{n}", String(e.humans)) : t("accRankSolo")}</small>
                </span>
                <strong className="rr-time">{raidTime(e.ticks)}</strong>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
