// 관리자 티어 플레잉 화면 (/?tierplay, 관리자 페이지 '티어 플레잉'의 플레이하기 버튼): 캐릭터를 처음부터 차례로 한 판씩
// 다음 캐릭터 시작 · 아무 캐릭터나 골라 다시 하기 · 다 끝나면 관리자 페이지로 (기록 표는 관리자 페이지에서 봄)
import type { CharacterId } from "@pixel-rogue/shared";
import { useCallback, useEffect, useState } from "react";
import { homeServer, session } from "../admin/adminApi";
import { useLang, type TextKey } from "../i18n";
import { TierRun } from "./TierRun";
import { loadRecords, PLAY_ORDER, type TierRecord } from "./tierPlayData";

export function TierPlay() {
  const { lang, t } = useLang();
  const [records, setRecords] = useState<TierRecord[]>([]);
  const [playing, setPlaying] = useState<CharacterId | null>(null);
  const reload = useCallback(() => void loadRecords().then(setRecords), []);
  useEffect(reload, [reload]);

  const done = new Set(records.map((r) => r.character));
  const next = PLAY_ORDER.find((c) => !done.has(c));
  const loggedIn = session(homeServer()) !== "";
  const admin = `${import.meta.env.BASE_URL}admin/`;

  if (playing) {
    return (
      <TierRun
        key={playing}
        character={playing}
        lang={lang}
        t={t}
        onSaved={() => {
          setPlaying(null);
          reload();
        }}
        onQuit={() => setPlaying(null)}
      />
    );
  }

  return (
    <main className="tier-play">
      <h1>티어 플레잉</h1>
      <p>
        캐릭터마다 로그(1~6층)를 끝까지 깬 뒤 라스트 보스까지 한 판. 로그에서 쓰러지면 바로 되살아나고 횟수만 셉니다. 라스트 보스는 쓰러지거나 깨면 끝 →
        별점·비고를 적어 저장합니다. ({done.size} / {PLAY_ORDER.length})
      </p>
      {!loggedIn && <p className="tier-warn">관리자 로그인이 안 되어 있어 기록이 이 브라우저에만 남습니다. 관리자 페이지에서 먼저 로그인하세요.</p>}
      {next ? (
        <button type="button" className="primary tier-next" onClick={() => setPlaying(next)}>
          ▶ 다음: {t(next as TextKey)} 플레이
        </button>
      ) : (
        <p className="tier-all">모든 캐릭터를 다 해 봤어요! 관리자 페이지 티어 플레잉에서 기록을 보고 티어를 매기세요.</p>
      )}
      <div className="tier-play-list">
        {PLAY_ORDER.map((c, i) => (
          <button key={c} type="button" className={done.has(c) ? "done" : c === next ? "next" : ""} onClick={() => setPlaying(c)} title="이 캐릭터로 (다시) 하기">
            {i + 1}. {t(c as TextKey)} {done.has(c) ? "✓" : ""}
          </button>
        ))}
      </div>
      <a className="tier-back" href={admin}>
        ← 관리자 페이지 (기록 보기·티어 매기기)
      </a>
    </main>
  );
}
