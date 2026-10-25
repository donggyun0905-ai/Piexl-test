import { currentBalance, packInputs, summarize, type CharacterId, type RunState, type TickInput } from "@pixel-rogue/shared";
import { useRef, useState } from "react";
import { getPlayerId, loadNickname } from "../player";
import { apiPost } from "../api";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import type { DailyStart } from "./DailyScreen";
import { Leaderboard, type BoardEntry } from "./Leaderboard";

interface Props {
  start: DailyStart;
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
}

type Submit =
  | { state: "sending" }
  | { state: "done"; improved: boolean; best: { score: number; rank: number } | null; entries: BoardEntry[] }
  | { state: "error"; error: string };

/** 일일 도전 한 판: 입력을 기록해 두었다가 끝나면 기록 제출 */
export function DailyGame({ start, characterId, lang, t, onExit }: Props) {
  const inputs = useRef<TickInput[]>([]);
  const [submit, setSubmit] = useState<Submit | null>(null);

  const send = async (run: RunState) => {
    setSubmit({ state: "sending" });
    const res = await apiPost<{ improved: boolean; best: { score: number; rank: number } | null; entries: BoardEntry[] }>(
      "/api/daily/submit",
      {
        player: getPlayerId(),
        ticket: start.ticket,
        nickname: loadNickname(),
        summary: summarize(run),
        inputs: await packInputs(inputs.current.slice(0, run.tick)),
        // 판을 시작할 때 넣은 수치 (판 도중에는 바뀌지 않음)
        balance: currentBalance().hash,
      },
    );
    if (res.ok && res.data) setSubmit({ state: "done", ...res.data });
    else setSubmit({ state: "error", error: res.error === "offline" ? t("errOffline") : `${t("submitRejected")} (${res.error})` });
  };

  const extra = !submit ? null : submit.state === "sending" ? (
    <p className="result-line">{t("submitting")}</p>
  ) : submit.state === "error" ? (
    <p className="form-error">{submit.error}</p>
  ) : (
    <div className="daily-result">
      <p className="result-line">
        {submit.improved ? t("submitImproved") : t("submitNotBetter")}
        {submit.best &&
          ` · ${t("myBest")} ${submit.best.score.toLocaleString()} (${t("rankFmt").replace("{n}", String(submit.best.rank))})`}
      </p>
      <div className="board-wrap small">
        <Leaderboard entries={submit.entries} t={t} />
      </div>
    </div>
  );

  return (
    <GameScreen
      mode="daily"
      sudden={start.mode === "sudden"}
      characterId={characterId}
      seedText={start.seedText}
      unlocks={[]}
      lang={lang}
      t={t}
      onExit={onExit}
      onInput={(i) => inputs.current.push(i)}
      onRunEnd={(run) => void send(run)}
      resultExtra={extra}
    />
  );
}
