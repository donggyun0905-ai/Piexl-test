// 기록서(아지트 책상·오른쪽 위 할 일) 탭: 서브 퀘스트 · 긴급(일일) 퀘스트 목록 · 이루면 '받기' (보상 칩, progress/rewards)
import { useState } from "react";
import type { TextKey } from "../i18n";
import { BOSS_TEXT } from "../i18n/enemies";
import { claimDaily, dailyClaimed, dailyCount, dailyList, type Daily } from "../progress/dailyQuests";
import { REWARD_RULES } from "../progress/rewards";
import { claimSub, openSubs, subMet, subProgress, woodTotal, type SubQuest } from "../progress/subQuests";
import { groundById } from "./hunt/huntGrounds";
import { mobName } from "./hunt/huntNames";

type T = (k: TextKey) => string;

const huntLine = (t: T, g: string, k: number, n: number) => {
  const gr = groundById(g);
  return t("qcHunt").replace("{place}", gr ? t(gr.name) : "?").replace("{mob}", gr ? mobName(gr) : "?").replace("{k}", String(k)).replace("{n}", String(n));
};

function subLine(t: T, q: SubQuest, regionName: (id: string) => string): string {
  const [k, n] = subProgress(q);
  if ("hunt" in q.cond) return huntLine(t, q.cond.hunt, k, n);
  return t("qcBossWin").replace("{region}", regionName(q.region)).replace("{boss}", t(BOSS_TEXT[q.cond.bossWin] as TextKey));
}

function Row({ t, text, met, done, chips, onClaim }: { t: T; text: string; met: boolean; done: boolean; chips: number; onClaim: () => void }) {
  return (
    <li className={done ? "done" : met ? "now" : ""}>
      <small className={met ? "met" : ""}>
        {met ? "✓" : "·"} {text}
      </small>
      <span className="q-reward">
        {t("qReward").replace("{n}", chips.toLocaleString())}
        {done ? ` · ${t("qClaimed")}` : met && (
          <button type="button" className="small primary" onClick={onClaim}>
            {t("qClaim")}
          </button>
        )}
      </span>
    </li>
  );
}

export function SubList({ t, regionName }: { t: T; regionName: (id: string) => string }) {
  const [, redraw] = useState(0);
  const subs = openSubs();
  if (!subs.length) return <p className="hint">{t("qNoSub")}</p>;
  // 받을 수 있는 것부터
  const sorted = [...subs].sort((a, b) => Number(subMet(b)) - Number(subMet(a)));
  return (
    <ol className="quest-subs">
      {sorted.map((q) => (
        <Row key={q.id} t={t} text={`${regionName(q.region)} · ${subLine(t, q, regionName)}`} met={subMet(q)} done={false} chips={q.chips} onClaim={() => (claimSub(q.id), redraw((v) => v + 1))} />
      ))}
    </ol>
  );
}

const dailyText = (t: T, d: Daily) => ("hunt" in d ? huntLine(t, d.hunt, dailyCount(d), d.n) : t("qcWood").replace("{k}", String(dailyCount(d))).replace("{n}", String(d.n)));

export function DailyList({ t }: { t: T }) {
  const [, redraw] = useState(0);
  return (
    <>
      <ol className="quest-subs">
        {dailyList().map((d) => (
          <Row key={d.id} t={t} text={dailyText(t, d)} met={dailyCount(d) >= d.n} done={dailyClaimed(d)} chips={REWARD_RULES.dailyChips} onClaim={() => (claimDaily(d.id), redraw((v) => v + 1))} />
        ))}
      </ol>
      <p className="hint">
        {t("qDailyNote")} · {t("qWood").replace("{n}", String(woodTotal()))}
      </p>
    </>
  );
}
