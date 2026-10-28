// 패왕전 대결 고르기: 6가지 (경기장 미리 보기 · 난이도 · 승리 보상 · 이긴 횟수)
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
  /** 랭크전 (모르는 사람과 점수 대결) */
  onRank: (queue: RankQueue) => void;
  onBack: () => void;
}

const CELL = 2;
const NAME: Record<PwMode, TextKey> = { duel: "pwDuel", trio: "pwTrio", squad: "pwSquad", tourney: "pwTourney", brawl: "pwBrawl", gungame: "pwGungame" };
const DESC: Record<PwMode, TextKey> = { duel: "pwDuelDesc", trio: "pwTrioDesc", squad: "pwSquadDesc", tourney: "pwTourneyDesc", brawl: "pwBrawlDesc", gungame: "pwGungameDesc" };
const GROUND: Record<PwArenaId, string> = { small: "#6a5a44", wide: "#6a5a44", forest: "#2e4a2a", field: "#4a6a34", manor: "#5a4e44" };

/** 난이도 글자: AI 체력 보정으로 나눔 */
export const diffKey = (d: PwDiff): TextKey => (d.hp < 1 ? "pwEasy" : d.hp < 1.2 ? "pwNormal" : d.hp < 1.5 ? "pwHard" : "pwBrutal");

export function ArenaPreview({ id }: { id: PwArenaId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const a = PW_ARENAS[id];
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = GROUND[id];
    ctx.fillRect(0, 0, a.cols * CELL, a.rows * CELL);
    const rects = (list: readonly (readonly number[])[], color: string) => {
      ctx.fillStyle = color;
      for (const [c = 0, r = 0, w = 1, h = 1] of list) ctx.fillRect(c * CELL, r * CELL, w * CELL, h * CELL);
    };
    rects(a.decks, "#8a6a40");
    rects(a.bushes, "#3a7a34");
    rects(a.traps, "#a03a3a");
    rects(a.ponds, "#2a5a8a");
    rects(a.walls, "#2a2630");
    rects(a.rocks, id === "forest" ? "#1a3018" : "#8a8478");
    ctx.strokeStyle = "#2a2630";
    ctx.strokeRect(0.5, 0.5, a.cols * CELL - 1, a.rows * CELL - 1);
  }, [id, a]);
  return <canvas ref={ref} width={a.cols * CELL} height={a.rows * CELL} className="pw-preview" aria-hidden="true" />;
}

export function PwModes({ t, onPick, onMulti, onRank, onBack }: Props) {
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
              <ArenaPreview id={def.arena} />
              <span className="td-map-text">
                <strong>
                  {t(NAME[m])} <em className={`pw-diff ${diffKey(def.diff)}`}>{t(diffKey(def.diff))}</em>
                </strong>
                <small>{t(DESC[m])}</small>
                <small className="pw-reward">
                  🪙 {t("pwReward").replace("{n}", def.reward.toLocaleString())}
                  {wins > 0 && ` · ${t("pwWins").replace("{n}", String(wins))}`}
                </small>
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" className="primary" onClick={onMulti}>
        👥 {t("pwMulti")}
      </button>
      <p className="hint">{t("pwMultiDesc")}</p>
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}

export const PW_NAME = NAME;
