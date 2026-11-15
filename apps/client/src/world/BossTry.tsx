// 지도 최종보스 입구에서 바로 들어간 판 (world/bossGates): 지도에서 걷던 캐릭터 + 낀 레이드 장신구 능력치로 7층 보스방부터
// 기록·업적·순위에는 안 넣음(game/bossTryRuns → game/runTracker) · 잡으면 보상(칩 · 1~2성 장신구, progress/rewards) + 서브 퀘스트 기록
import { continueToLastFloor, createRun, parseSeed, recalcStats, type LastBossKind } from "@pixel-rogue/shared";
import { useEffect, useMemo, useState } from "react";
import { myAccTotals } from "../event/acc/accStore";
import { GameScreen } from "../game/GameScreen";
import { markBossTry } from "../game/bossTryRuns";
import type { Lang, TextKey } from "../i18n";
import { BOSS_TEXT } from "../i18n/enemies";
import { loadAchievements, newSeedText } from "../records";
import { bossReward, type Reward } from "../progress/rewards";
import { noteBossWin } from "../progress/subQuests";
import { loadWorldChar } from "./worldPlayer";

interface Props {
  boss: LastBossKind;
  lang: Lang;
  t: (k: TextKey) => string;
  onExit: () => void;
}

export function BossTry({ boss, lang, t, onExit }: Props) {
  const seedText = useMemo(() => newSeedText(), []);
  const who = useMemo(() => loadWorldChar(), []);
  const run = useMemo(() => {
    const r = createRun(parseSeed(seedText), who, loadAchievements());
    markBossTry(r);
    // 레이드처럼 낀 장신구 능력치 (sim/accStats)
    r.player.acc = myAccTotals();
    recalcStats(r);
    r.player.hp = r.player.stats.maxHp;
    continueToLastFloor(r, boss);
    return r;
  }, [seedText, who, boss]);
  const [end, setEnd] = useState<{ won: boolean; reward: Reward | null } | null>(null);
  return (
    <GameScreen
      mode="solo"
      characterId={who}
      seedText={seedText}
      initialRun={run}
      unlocks={loadAchievements()}
      lang={lang}
      t={t}
      onExit={onExit}
      onRunEnd={(r) => {
        if (end) return;
        const won = r.won && r.lastBoss === boss;
        if (won) noteBossWin(boss);
        setEnd({ won, reward: won ? bossReward() : null });
      }}
      afterRun={end && <BossResult t={t} boss={boss} won={end.won} reward={end.reward} onExit={onExit} />}
    />
  );
}

function BossResult({ t, boss, won, reward, onExit }: { t: (k: TextKey) => string; boss: LastBossKind; won: boolean; reward: Reward | null; onExit: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter") && onExit();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });
  return (
    <div className="modal-backdrop">
      <div className="modal boss-result" role="dialog" aria-modal="true">
        <h2>{won ? t("bgWon") : t("bgLost")}</h2>
        <p>{t(BOSS_TEXT[boss] as TextKey)}</p>
        {reward && (
          <ul>
            <li>{t("bgRewardChips").replace("{n}", reward.chips.toLocaleString())}</li>
            {reward.acc.map((a) => (
              <li key={a.uid}>{t("bgRewardAcc").replace("{n}", String(a.star)).replace("{kind}", t(`accKind_${a.kind}` as TextKey))}</li>
            ))}
          </ul>
        )}
        <button type="button" className="primary" onClick={onExit}>
          {t("bgBack")}
        </button>
      </div>
    </div>
  );
}
