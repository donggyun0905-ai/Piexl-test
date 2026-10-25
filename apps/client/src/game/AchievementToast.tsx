import type { Lang, TextKey } from "../i18n";
import { achievementName, achievementUnlock } from "../i18n/achievements";

interface Props {
  toasts: { key: number; id: string }[];
  lang: Lang;
  t: (key: TextKey) => string;
}

/** 업적 달성 알림: 화면 위쪽에 잠깐 뜨고 자동으로 사라짐 */
export function AchievementToast({ toasts, lang, t }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((x) => (
        <div key={x.key} className="toast">
          <strong>
            {t("achievementUnlocked")}: {achievementName(x.id, lang)}
          </strong>
          {achievementUnlock(x.id, lang) && <small>{achievementUnlock(x.id, lang)}</small>}
        </div>
      ))}
    </div>
  );
}
