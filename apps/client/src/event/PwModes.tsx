// 패왕전 대결 고르기: 7가지 (경기장 미리 보기 · 난이도 · 승리 보상 · 이긴 횟수)
import { PW_ARENAS, PW_MODE, PW_MODES, type PwArenaId, type PwDiff, type PwMode, type RankQueue } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import type { TextKey } from "../i18n";
import { pwWins } from "./pwRecords";
import { PwGuide } from "./PwGuide";
import { RankPanel } from "./RankPanel";

interface Props {
  t: (key: TextKey) => string;
  onPick: (mode: PwMode) => void;
  /** 친구와 같이 하기 (협동 방) */
  onMulti: () => void;
  /** 월드 워 리그 */
  onLeague: () => void;
  onPractice: () => void;
  onBrowse: () => void;
  /** 랭크전 (모르는 사람과 점수 대결) */
  onRank: (queue: RankQueue) => void;
  onBack: () => void;
}

const CELL = 2;
const NAME: Record<PwMode, TextKey> = { duel: "pwDuel", pair: "pwPair", trio: "pwTrio", squad: "pwSquad", tourney: "pwTourney", brawl: "pwBrawl", gungame: "pwGungame", capture: "pwCapture", contest: "pwContest", war: "pwWar", giganto: "pwGiga" };
const DESC: Record<PwMode, TextKey> = { duel: "pwDuelDesc", pair: "pwPairDesc", trio: "pwTrioDesc", squad: "pwSquadDesc", tourney: "pwTourneyDesc", brawl: "pwBrawlDesc", gungame: "pwGungameDesc", capture: "pwCaptureDesc", contest: "pwContestDesc", war: "pwWarDesc", giganto: "pwGigaDesc" };
/** 미리 보기 바닥색: 숲·들판은 풀빛, 나머지는 흙빛 */
const groundOf = (id: PwArenaId) => (id === "forest" || id.startsWith("q") || id.startsWith("b") || id === "field" ? "#3e5a30" : "#6a5a44");

/** 난이도 글자: AI 체력 보정으로 나눔 */
export const diffKey = (d: PwDiff): TextKey => (d.hp < 1 ? "pwEasy" : d.hp < 1.2 ? "pwNormal" : d.hp < 1.5 ? "pwHard" : "pwBrutal");

export function ArenaPreview({ id }: { id: PwArenaId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const a = PW_ARENAS[id];
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = groundOf(id);
    ctx.fillRect(0, 0, a.cols * CELL, a.rows * CELL);
    const rects = (list: readonly (readonly number[])[], color: string) => {
      ctx.fillStyle = color;
      for (const [c = 0, r = 0, w = 1, h = 1] of list) ctx.fillRect(c * CELL, r * CELL, w * CELL, h * CELL);
    };
    rects(a.decks, "#8a6a40");
    rects(a.mud ?? [], "#5a4024");
    rects(a.water ?? [], "#3a8ab0");
    rects(a.lava ?? [], "#e0581e");
    rects(a.spikes ?? [], "#c8c8d0");
    rects(a.bushes, "#3a7a34");
    rects(a.traps, "#a03a3a");
    rects(a.ponds, "#2a5a8a");
    rects(a.walls, "#2a2630");
    rects(a.rocks, id === "forest" ? "#1a3018" : "#8a8478");
    // 점령전: 낭떠러지 · 점령 구역 · 버프 자리
    rects(a.cliffs ?? [], "#07060a");
    if (a.zone?.rect) rects([a.zone.rect], "rgba(90, 140, 255, 0.55)");
    if (a.zone?.circle) {
      const [c, r, rad] = a.zone.circle;
      ctx.fillStyle = "rgba(90, 140, 255, 0.55)";
      ctx.beginPath();
      ctx.arc((c + 0.5) * CELL, (r + 0.5) * CELL, rad * CELL, 0, Math.PI * 2);
      ctx.fill();
    }
    rects((a.buffs ?? []).map(([c, r]) => [c, r, 1, 1]), "#f2d040");
    ctx.strokeStyle = "#2a2630";
    ctx.strokeRect(0.5, 0.5, a.cols * CELL - 1, a.rows * CELL - 1);
  }, [id, a]);
  return <canvas ref={ref} width={a.cols * CELL} height={a.rows * CELL} className="pw-preview" aria-hidden="true" />;
}

export function PwModes({ t, onPick, onMulti, onLeague, onPractice, onBrowse, onRank, onBack }: Props) {
  return (
    <div className="td-maps pw-modes">
      <h2>{t("paewang")}</h2>
      <PwGuide t={t} />
      <RankPanel t={t} onPlay={onRank} />
      <p className="hint">{t("pwPick")}</p>
      <div className="td-map-list">
        {PW_MODES.map((m) => {
          const def = PW_MODE[m];
          const wins = pwWins(m);
          return (
            <button key={m} type="button" className="td-map-card pw-mode-card" onClick={() => onPick(m)}>
              <ArenaPreview id={def.maps[0]!} />
              <span className="td-map-text">
                <strong>
                  {t(NAME[m])} <em className={`pw-diff ${diffKey(def.diff)}`}>{t(diffKey(def.diff))}</em>
                  {def.rounds > 1 && <em className="pw-bo3">{t("pwBo3")}</em>}
                </strong>
                <small>{t(DESC[m])}</small>
                <small className="pw-reward">
                  🪙 {t("pwReward").replace("{n}", def.reward.toLocaleString())}
                  {wins > 0 && ` · ${t("pwWins").replace("{n}", String(wins))}`}
                  {` · ⏱ ${t("pwTimeLimit").replace("{n}", String(Math.round(def.timeSec / 60)))}`}
                  {def.zone && ` · ${t("pwZoneOn")}`}
                </small>
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" className="primary" onClick={onLeague}>
        {t("pwLeagueOpen")}
      </button>
      <p className="hint">{t("pwLeagueDesc")}</p>
      <button type="button" className="primary" onClick={onMulti}>
        👥 {t("pwMulti")}
      </button>
      <p className="hint">{t("pwMultiDesc")}</p>
      <button type="button" onClick={onPractice}>
        🎯 {t("pwPractice")}
      </button>
      <p className="hint">{t("pwPracticeDesc")}</p>
      <button type="button" onClick={onBrowse}>
        📖 {t("pwBrowse")}
      </button>
      <p className="hint">{t("pwBrowseDesc")}</p>
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}

export const PW_NAME = NAME;
