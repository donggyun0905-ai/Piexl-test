// 지도에서 레벨업 능력치 찍기 (거짓된 용사·아슈바르): 본편 장비 줄의 NovicePanel·NoirPanel을 그대로 · 0.3초마다 다시 읽음 (지도 전투 판·보관한 판, battle/fieldCarry)
import { expToNext } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { Controls } from "../../game/controls";
import { NoirPanel } from "../../game/NoirPanel";
import { noirView } from "../../game/noirView";
import { NovicePanel } from "../../game/NovicePanel";
import type { TextKey } from "../../i18n";
import { pickStat, statRun } from "./fieldCarry";

/** 패널이 부르는 것은 queueStat 하나 */
const pad = { queueStat: pickStat } as unknown as Controls;

export function FieldStats({ t }: { t: (k: TextKey) => string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((v) => v + 1), 300);
    return () => window.clearInterval(id);
  }, []);
  const run = statRun();
  if (!run) return null;
  const p = run.player;
  const noir = noirView(run).noir;
  if (p.characterId !== "novice" && !noir) return null;
  return (
    <div className="world-stats">
      {noir ? <NoirPanel view={noir} t={t} controls={() => pad} /> : <NovicePanel view={{ lv: p.lv ?? 1, exp: p.exp ?? 0, need: expToNext(p.lv ?? 1), points: p.points ?? 0 }} t={t} controls={() => pad} />}
    </div>
  );
}
