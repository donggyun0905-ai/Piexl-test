import { useState } from "react";
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENTS, achievementProgress, type AchievementCategory } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "./i18n";
import { achievementDesc, achievementName, achievementUnlock, categoryName } from "./i18n/achievements";
import { loadAchievements, loadCareer } from "./records";

type Filter = "all" | AchievementCategory;

/** 업적 목록: 전체 달성률, 묶음 탭(달성 수), 업적 카드(달성 여부·누적 진행도·해금) */
export function AchievementList({ lang, t }: { lang: Lang; t: (key: TextKey) => string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const owned = new Set(loadAchievements());
  const career = loadCareer();
  const count = (list: readonly { id: string }[]) => list.filter((a) => owned.has(a.id)).length;
  const done = count(ACHIEVEMENTS);
  const shown = filter === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.category === filter);
  const tabs: Filter[] = ["all", ...ACHIEVEMENT_CATEGORIES];

  return (
    <div className="achievements">
      <div className="ach-head">
      <div className="ach-summary">
        <span>
          {t("achievementsDone")} <strong>{done}</strong> / {ACHIEVEMENTS.length}
        </span>
        <span className="ach-bar">
          <span style={{ width: `${(done / ACHIEVEMENTS.length) * 100}%` }} />
        </span>
      </div>
      <div className="ach-tabs" role="tablist">
        {tabs.map((f) => {
          const list = f === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.category === f);
          const got = count(list);
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`small${filter === f ? " active" : ""}${got === list.length ? " complete" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? t("achievementsAll") : categoryName(f, lang)} <small>{got}/{list.length}</small>
            </button>
          );
        })}
      </div>
      </div>
      <ul className="achievement-list">
        {shown.map(({ id }) => {
          const has = owned.has(id);
          const prog = achievementProgress(id, career);
          const unlock = achievementUnlock(id, lang);
          return (
            <li key={id} className={has ? "done" : ""}>
              <span className="ach-icon" aria-label={has ? t("achievementsDone") : t("locked")}>
                {has ? "★" : "☆"}
              </span>
              <div className="ach-body">
                <strong>{achievementName(id, lang)}</strong>
                <div className="achievement-desc">{achievementDesc(id, lang)}</div>
                {prog && !has && (
                  <div className="ach-progress">
                    <span className="ach-bar">
                      <span style={{ width: `${(prog.value / prog.goal) * 100}%` }} />
                    </span>
                    <small>
                      {prog.value.toLocaleString()} / {prog.goal.toLocaleString()}
                    </small>
                  </div>
                )}
                {unlock && <div className="achievement-unlock">{unlock}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
