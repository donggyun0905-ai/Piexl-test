import { useEffect, useState } from "react";
import { getPlayerId } from "../player";
import { NicknameBar } from "../menu/NicknameBar";
import { apiGet, apiPost } from "../api";
import type { TextKey } from "../i18n";
import { Leaderboard, type BoardEntry } from "./Leaderboard";

export type DailyMode = "normal" | "sudden";

export interface DailyStart {
  day: string;
  mode: DailyMode;
  seedText: string;
  ticket: string;
  resetAt: number;
}

interface Props {
  /** 처음 보여 줄 순위표 (게임에서 돌아오면 하던 모드) */
  initialMode?: DailyMode;
  t: (key: TextKey) => string;
  onBack: () => void;
  onStart: (start: DailyStart) => void;
  /** 레이드 명예의 전당 · 레이드 아레나 순위표 */
  onHall: () => void;
  onArena: () => void;
}

function countdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}

type Best = { score: number; rank: number } | null;

/** 일일 도전: 일반·서든데스 순위표 · 내 최고 기록 · 도전하기 (가입 없이 기기로 구분) · 레이드 명예의 전당 · 레이드 아레나 순위표 버튼 */
export function DailyScreen({ initialMode = "normal", t, onBack, onStart, onHall, onArena }: Props) {
  const [mode, setMode] = useState<DailyMode>(initialMode);
  // 모드별로 한 번만 받아 둠 (탭을 오가도 다시 요청하지 않음, 요청 수 = 비용)
  const [boards, setBoards] = useState<Partial<Record<DailyMode, BoardEntry[]>>>({});
  const [bests, setBests] = useState<Partial<Record<DailyMode, Best>>>({});
  const [resetAt, setResetAt] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const entries = boards[mode] ?? null;
  const best = bests[mode] ?? null;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (boards[mode]) return;
    const query = mode === "sudden" ? "?mode=sudden" : "";
    void apiGet<{ entries: BoardEntry[]; resetAt: number }>(`/api/daily/board${query}`).then((res) => {
      if (res.ok && res.data) {
        const data = res.data;
        setBoards((b) => ({ ...b, [mode]: data.entries }));
        setResetAt(data.resetAt);
      } else setError(t("errOffline"));
    });
    void apiPost<{ best: Best }>("/api/daily/me", { player: getPlayerId(), mode }).then((res) => {
      if (res.ok && res.data) {
        const data = res.data;
        setBests((b) => ({ ...b, [mode]: data.best }));
      }
    });
    // 모드를 처음 볼 때 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const start = async () => {
    setBusy(true);
    const res = await apiPost<DailyStart>("/api/daily/start", { player: getPlayerId(), mode });
    setBusy(false);
    if (res.ok && res.data) onStart(res.data);
    else setError(t("errOffline"));
  };

  return (
    <div className="select-screen daily-screen">
      <h2>{t("daily")}</h2>
      <div className="tabs">
        {(["normal", "sudden"] as const).map((m) => (
          <button key={m} type="button" className={`secondary${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>
            {t(m === "sudden" ? "suddenDeath" : "dailyNormal")}
          </button>
        ))}
        <button type="button" className="secondary hall-button" onClick={onHall}>
          🏆 {t("hallButton")}
        </button>
        <button type="button" className="secondary hall-button" onClick={onArena}>
          ⚔ {t("arenaButton")}
        </button>
      </div>
      <p className="account-note">{t("dailyNote")}</p>
      {mode === "sudden" && <p className="account-note sudden-note">{t("suddenNote")}</p>}
      {resetAt > 0 && (
        <p className="account-note">
          {t("dailyReset")} {countdown(resetAt - now)}
        </p>
      )}
      {best && (
        <p>
          {t("myBest")} <strong>{best.score.toLocaleString()}</strong> · {t("rankFmt").replace("{n}", String(best.rank))}
        </p>
      )}
      <button type="button" className="primary" disabled={busy} onClick={start}>
        {t("dailyStart")}
      </button>
      <NicknameBar t={t} />
      {error && <p className="form-error">{error}</p>}
      <div className="board-wrap">{entries ? <Leaderboard entries={entries} t={t} /> : !error && <p>…</p>}</div>
      <button type="button" className="secondary" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}
