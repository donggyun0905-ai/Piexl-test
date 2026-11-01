// 관리자 티어 플레잉 한 판: 보통 로그(1~6층, 쓰러지면 되살아나고 횟수만 셈) → 깨면 바로 무작위 라스트 보스 (쓰러지면 끝)
// 자동 기록: 로그를 깬 시간·점수·쓰러진 횟수·보스·깎은 체력 → 끝나면 TierRate 작은 창에서 별점·비고를 적어 저장
import { computeScore, createRun, ENEMIES, LAST_BOSSES, parseSeed, raidCleared, S2_LAST_BOSSES, type CharacterId, type LastBossKind, type RunState } from "@pixel-rogue/shared";
import { useMemo, useRef, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { loadAchievements, newSeedText } from "../records";
import { TierRate } from "./TierRate";
import type { TierRecord } from "./tierPlayData";

interface Props {
  character: CharacterId;
  lang: Lang;
  t: (k: TextKey) => string;
  onSaved: () => void;
  onQuit: () => void;
}

/** 라스트 보스 무리의 깎인 체력 비율 (0~100) */
function bossCut(r: RunState): number {
  const bosses = r.enemies.filter((e) => ENEMIES[e.kind]?.boss);
  const max = bosses.reduce((a, e) => a + e.maxHp, 0);
  if (max <= 0) return 0;
  return Math.round((1 - bosses.reduce((a, e) => a + Math.max(0, e.hp), 0) / max) * 100);
}

export function TierRun({ character, lang, t, onSaved, onQuit }: Props) {
  const seedText = useMemo(() => newSeedText(), []);
  const run = useMemo(() => {
    const r = createRun(parseSeed(seedText), character, loadAchievements());
    r.tierPlay = { deaths: 0 };
    return r;
  }, [seedText, character]);
  const auto = useRef<Pick<TierRecord, "clearTicks" | "score" | "boss" | "bossPct">>({ clearTicks: 0, score: 0, boss: "", bossPct: 0 });
  /** 끝난 판의 자동 기록 (작은 창에 넘김) */
  const [end, setEnd] = useState<Pick<TierRecord, "clearTicks" | "score" | "boss" | "bossPct" | "deaths" | "bossCleared"> | null>(null);
  const bosses = [...LAST_BOSSES, ...S2_LAST_BOSSES] as LastBossKind[];

  return (
    <GameScreen
      mode="solo"
      characterId={character}
      seedText={seedText}
      initialRun={run}
      unlocks={loadAchievements()}
      lang={lang}
      t={t}
      onExit={onQuit}
      autoLastBoss={() => {
        // 로그를 깬 순간 (이 뒤로 바로 라스트 보스): 걸린 시간·점수
        auto.current.clearTicks = run.tick;
        auto.current.score = computeScore(run).total;
        const boss = bosses[Math.floor(Math.random() * bosses.length)]!;
        auto.current.boss = boss;
        return boss;
      }}
      onAdvance={(r) => {
        if (r.lastBoss) auto.current.bossPct = Math.max(auto.current.bossPct, bossCut(r));
      }}
      onRunEnd={(r) => {
        if (!r.lastBoss) return;
        const cleared = raidCleared(r);
        if (cleared) auto.current.bossPct = 100;
        setEnd({ ...auto.current, deaths: r.tierPlay?.deaths ?? 0, bossCleared: cleared });
      }}
      afterRun={end && <TierRate character={character} auto={end} onSaved={onSaved} onQuit={onQuit} />}
    />
  );
}
