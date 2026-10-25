// 풋내기: 장비 줄 위 레벨·경험치 막대, 스탯 포인트가 있으면 능력치 버튼 (누르면 그 능력치에 한 점 · 입력 statPick으로 기록)
import { NOVICE_STATS, NOVICE_STEP, type NoviceStat } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { Controls } from "./controls";

export interface NoviceView {
  lv: number;
  exp: number;
  need: number;
  points: number;
}

const LABEL: Record<NoviceStat, TextKey> = {
  damage: "statDamage",
  attackSpeed: "statAttackSpeed",
  maxHp: "statHp",
  moveSpeed: "statMoveSpeed",
  range: "statRange",
  projectileSpeed: "statProjectileSpeed",
  luck: "statLuck",
  critChance: "statCritChance",
  critDamage: "statCritDamage",
};

/** 한 점에 오르는 양 (+7% · +12 · 치명타 +6%p) */
function stepText(stat: NoviceStat): string {
  const s = NOVICE_STEP[stat];
  if (stat === "critChance" || stat === "critDamage") return `+${Math.round((s.add ?? 0) * 100)}%`;
  return s.mul ? `+${Math.round(s.mul * 100)}%` : `+${s.add}`;
}

export function NovicePanel({ view, t, controls }: { view: NoviceView; t: (key: TextKey) => string; controls: () => Controls | null }) {
  return (
    <div className="novice-bar">
      <span className="novice-lv">{t("noviceLevel").replace("{n}", String(view.lv))}</span>
      <span className="novice-exp" aria-label={`${view.exp} / ${view.need}`}>
        <span style={{ width: `${Math.min(100, (view.exp / view.need) * 100)}%` }} />
      </span>
      {view.points > 0 && (
        <div className="novice-pick">
          <small>{t("novicePoints").replace("{n}", String(view.points))}</small>
          {NOVICE_STATS.map((stat, i) => (
            <button key={stat} type="button" onClick={() => controls()?.queueStat(i + 1)}>
              {t(LABEL[stat])} <b>{stepText(stat)}</b>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
