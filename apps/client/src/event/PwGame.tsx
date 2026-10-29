// 이벤트 '패왕전' 혼자 한 판 (나 + AI): 게임 화면(GameScreen)에 진행을 맡기고 위에 정보(PwHud)·점수판(PwBoard) · 끝나면 결과와 보상 칩
import { usePwBalanceRun } from "../balance";
import { createPvp, isGiga, stepPvp, type CharacterId, type PwLoadout, type PwMode, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { PwBoard, useBoard } from "./PwBoard";
import { StatsPanel } from "../game/GameHud";
import { statRows } from "../game/statsView";
import { PwGigaHud } from "./PwGigaHud";
import { claimGoods, clearGiga, saveGiga } from "./pwGigaStore";
import { PwGrowHud } from "./PwGrowHud";
import { PwHud } from "./PwHud";
import type { PwMapPick } from "./PwMaps";
import { PwResult } from "./PwResult";
import { PwWatch } from "./PwWatch";
import { savePwResult } from "./pwRecords";

interface Props {
  mode: PwMode;
  /** 고른 경기장 (null = 무작위) */
  map: PwMapPick;
  characterId: CharacterId;
  /** 밴픽으로 정한 자리마다 캐릭터 (0번 = 나, 나머지는 그 캐릭터의 AI) */
  picks?: readonly CharacterId[];
  loadout?: PwLoadout;
  lang: Lang;
  t: (key: TextKey) => string;
  onExit: () => void;
  onRetry?: () => void;
  /** 월드 워 리그: AI끼리 관전(내 자리도 AI · 보상 없음) · 끝나면 0번 자리 편이 이겼는지 */
  watch?: boolean;
  onEnd?: (won: boolean) => void;
  /** 기간토마키아: 밴된 캐릭터(AI에서 뺌) · 이어하기 판 */
  bans?: readonly CharacterId[];
  resume?: RunState;
}

const HUD_MS = 250;

export function PwGame({ mode, map, characterId, picks, loadout, lang, t, onExit, onRetry, watch, onEnd, bans, resume }: Props) {
  // 꾸밈이 아니라 판 시드: 판마다 다르게 (판 안의 계산은 이 시드로만)
  usePwBalanceRun();
  const [run] = useState(() => resume ?? createPvp(Math.floor(Math.random() * 0x7fffffff), mode, picks ? picks.map((c, i) => (i || watch ? { characterId: c, ai: true } : { characterId: c, loadout })) : [{ characterId, loadout }], map ?? undefined, bans));
  // 게임 화면은 처음 캐릭터로 고정 (데스매치 레벨업·관전으로 바뀌어도 다시 시작하지 않게 · 누르던 키 유지)
  const [firstChar] = useState(() => run.player.characterId);
  const [, refresh] = useState(0);
  const [chips, setChips] = useState<number | null>(null);
  const [board, toggleBoard] = useBoard();
  const [goods, setGoods] = useState<string[]>([]);
  useEffect(() => {
    const id = window.setInterval(() => refresh((n) => n + 1), HUD_MS);
    // 기간토마키아: 30초마다 · 나갈 때 이 기기에 저장 (이어하기)
    const save = isGiga(run) ? window.setInterval(() => saveGiga(run), 30000) : 0;
    return () => {
      window.clearInterval(id);
      window.clearInterval(save);
      if (isGiga(run)) saveGiga(run);
    };
  }, [run]);
  const ended = chips !== null;
  return (
    <>
      <GameScreen
        mode="paewang"
        characterId={firstChar}
        seedText=""
        initialRun={run}
        unlocks={[]}
        lang={lang}
        t={t}
        onExit={onExit}
        step={(r, input) => {
          stepPvp(r, [input]);
          return true;
        }}
        onRunEnd={(end) => {
          setChips(watch ? 0 : savePwResult(mode, end.won));
          // 기간토마키아: 이기거나 출구로 나가면 배낭 전부, 쓰러졌으면 금고만 가져감
          if (isGiga(run)) {
            clearGiga();
            const p = run.player;
            const out = end.won || !!run.pvp?.grow?.out?.includes(0);
            setGoods(claimGoods([...(out ? (p.pwBag ?? []) : []), ...(p.pwVault ? [p.pwVault] : [])]));
          }
          onEnd?.(end.won);
        }}
        afterRun={ended ? <PwResult run={run} me={0} lang={lang} t={t} onExit={onExit} onRetry={onRetry} extra={goods.length > 0 && <p className="pw-chips">🎁 {goods.map((g) => t(`pwGoods_${g.slice(2)}` as TextKey)).join(" · ")}</p>} /> : undefined}
        withControls={(controls) =>
          !ended && (
            <>
              <PwGrowHud run={run} me={0} lang={lang} t={t} controls={controls} />
              <PwGigaHud run={run} me={0} lang={lang} t={t} controls={controls} />
            </>
          )
        }
      />
      {!ended && <PwWatch run={run} me={0} watching={watch} t={t} />}
      {!ended && <PwHud run={run} me={0} t={t} onBoard={toggleBoard} />}
      {board && <PwBoard run={run} me={0} lang={lang} t={t} />}
      {/* Tab: 왼쪽에 내(보는 사람) 능력치 */}
      {board && (
        <div className="pw-stats-side">
          <StatsPanel rows={statRows(run, t)} t={t} />
        </div>
      )}
    </>
  );
}
