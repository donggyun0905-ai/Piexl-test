// 금기의 서 창: 금기마다 − / + 로 걸 수 (같은 금기를 여러 번) · 위에 금기 점수 합 · 닫으면 저장
import { TABOO_IDS, TABOO_MAX_POINTS, TABOOS, tabooPoints, type TabooId, type TabooSet } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { TABOO_TEXT } from "../i18n/taboos";
import { Modal } from "../menu/Modal";
import { tabooTier } from "./tabooStore";

/** 묶음: 글자 · TABOO_IDS에서의 범위 */
const GROUPS: [TextKey, number, number][] = [
  ["tabooGroupEnemy", 0, 9],
  ["tabooGroupHurt", 9, 11],
  ["tabooGroupGold", 11, 19],
  ["tabooGroupBody", 19, TABOO_IDS.length],
];

interface Props {
  t: (key: TextKey) => string;
  lang: Lang;
  value: TabooSet;
  onChange: (next: TabooSet) => void;
  onClose: () => void;
}

export function TabooBook({ t, lang, value, onChange, onClose }: Props) {
  const total = tabooPoints(value);
  const set = (id: TabooId, n: number) => onChange({ ...value, [id]: Math.max(0, Math.min(TABOOS[id].max, n)) });

  const row = (id: TabooId) => {
    const def = TABOOS[id];
    const n = value[id] ?? 0;
    const text = TABOO_TEXT[id];
    return (
      <li key={id} className={`taboo-row${n > 0 ? " on" : ""}`}>
        <button type="button" className="taboo-main" disabled={n >= def.max} onClick={() => set(id, n + 1)}>
          <strong>{text.name[lang]}</strong>
          <small>{text.desc[lang]}</small>
        </button>
        <span className="taboo-pts">+{def.pts}</span>
        <span className="taboo-count">
          <button type="button" className="ghost" disabled={n <= 0} onClick={() => set(id, n - 1)} aria-label="-">
            −
          </button>
          <b>
            {n}/{def.max}
          </b>
          <button type="button" className="ghost" disabled={n >= def.max} onClick={() => set(id, n + 1)} aria-label="+">
            +
          </button>
        </span>
      </li>
    );
  };

  return (
    <Modal title={`📕 ${t("tabooBook")}`} t={t} onClose={onClose} className="taboo-book">
      <p className="hint">{t("tabooIntro")}</p>
      <div className="taboo-total">
        <span>{t("tabooTotal")}</span>
        <b className={`taboo-tier-${tabooTier(total)}`}>{total}</b>
        <small>/ {TABOO_MAX_POINTS}</small>
        <button type="button" className="secondary" disabled={total === 0} onClick={() => onChange({})}>
          {t("tabooClear")}
        </button>
      </div>
      {GROUPS.map(([key, from, to]) => (
        <section key={key} className="taboo-group">
          <h3>{t(key)}</h3>
          <ul>{TABOO_IDS.slice(from, to).map(row)}</ul>
        </section>
      ))}
    </Modal>
  );
}

