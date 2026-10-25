// 라스트 보스를 잡은 판 · 레이드 아레나 판 결과 창: 기록을 서버에 보냄 (순위 안이면 서버가 판 전체를 다시 돌려 확인)
// 명예의 전당 = 보스방 시간 (10위까지) · 레이드 아레나 = 깬 레벨과 전체 시간 (30위까지)
import { arenaCleared, currentBalance, packInputs, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiPost } from "../api";
import { getPlayerId, loadNickname } from "../player";
import type { TextKey } from "../i18n";
import { raidTime } from "../daily/raidTime";
import { raidInputs } from "./raidLog";

type State = { kind: "sending" } | { kind: "noLog" } | { kind: "error"; error: string } | { kind: "done"; improved: boolean; rank: number | null };

export function RaidSubmit({ run, seedText, t }: { run: RunState; seedText: string; t: (key: TextKey) => string }) {
  const arena = run.arenaLv !== undefined;
  const [inputs] = useState(() => raidInputs(run));
  const [state, setState] = useState<State>(inputs ? { kind: "sending" } : { kind: "noLog" });

  useEffect(() => {
    if (!inputs) return;
    void (async () => {
      const record = arena ? { level: arenaCleared(run), ticks: run.tick } : { boss: run.lastBoss, ticks: run.raidTicks };
      const res = await apiPost<{ improved: boolean; rank: number | null }>(arena ? "/api/arena/submit" : "/api/raid/submit", {
        player: getPlayerId(),
        nickname: loadNickname(),
        seedText,
        character: run.player.characterId,
        unlocks: run.unlocks,
        ...record,
        inputs: await packInputs(inputs),
        // 판을 시작할 때 넣은 게임 수치 (판 도중에는 바뀌지 않음)
        balance: currentBalance().hash,
      });
      if (res.ok && res.data) setState({ kind: "done", ...res.data });
      else setState({ kind: "error", error: res.error === "offline" ? t("errOffline") : `${t("submitRejected")} (${res.error})` });
    })();
  }, [arena, inputs, run, seedText, t]);

  return (
    <div className="raid-submit">
      <p className="raid-submit-time">
        {arena ? `${t("arenaRun")} Lv ${arenaCleared(run)} · ` : `${t("raidTimeLabel")} `}
        <strong>{raidTime(arena ? run.tick : (run.raidTicks ?? 0))}</strong>
      </p>
      {state.kind === "sending" && <p className="result-line">{t("submitting")}</p>}
      {state.kind === "noLog" && <p className="account-note">{t("raidNoLog")}</p>}
      {state.kind === "error" && <p className="form-error">{state.error}</p>}
      {state.kind === "done" &&
        (state.rank !== null ? (
          <p className="raid-submit-rank">
            {(state.improved ? t(arena ? "arenaRanked" : "raidRanked") : t("raidKept")).replace("{n}", String(state.rank))}
          </p>
        ) : (
          <p className="result-line">{t(arena ? "arenaNotRanked" : "raidNotRanked")}</p>
        ))}
    </div>
  );
}
