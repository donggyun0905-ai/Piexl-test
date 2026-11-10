// 장신구 조각: 아이콘(별·강화 단계) · 자세히(기본·추가 능력치·세트 효과) · 별 줄
import { ACC_SET_BONUS, accBase, optValue, type AccItem, type AccStat, type AccTotals } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { accName, iconStyle, statLine, totalsLines } from "./accStore";

type T = (key: TextKey) => string;

export const Stars = ({ n }: { n: number }) => <span className={`acc-stars s${n}`}>{"★".repeat(n)}</span>;

/** 아이콘 칸 (별 수만큼 테두리 빛 · 전설은 무지개) */
export function AccIcon({ it, on, dim, onClick, small }: { it: AccItem; on?: boolean; dim?: boolean; onClick?: () => void; small?: boolean }) {
  const cls = `acc-icon s${it.star}${it.legend !== undefined ? " leg" : ""}${on ? " on" : ""}${dim ? " dim" : ""}${small ? " small" : ""}`;
  return (
    <button type="button" className={cls} onClick={onClick}>
      <i style={iconStyle(it)} />
      <Stars n={it.star} />
      {it.lv > 0 && <b className="acc-lv">+{it.lv}</b>}
    </button>
  );
}

/** 능력치 줄들 */
export function StatLines({ t, tot }: { t: T; tot: AccTotals }) {
  return (
    <ul className="acc-lines">
      {totalsLines(t, tot).map((l) => (
        <li key={l.k} className={l.bad ? "bad" : ""}>
          {l.text}
        </li>
      ))}
    </ul>
  );
}

/** 장신구 자세히 */
export function AccInfo({ t, it }: { t: T; it: AccItem }) {
  return (
    <div className={`acc-info s${it.star}${it.legend !== undefined ? " leg" : ""}`}>
      <div className="acc-info-head">
        <i className="acc-big" style={iconStyle(it)} />
        <div>
          <strong>
            {accName(t, it)}
            {it.lv > 0 && <b className="acc-lv-text"> +{it.lv}</b>}
          </strong>
          <div>
            <Stars n={it.star} /> {it.legend !== undefined && <em className="acc-leg-tag">{t("accLegend")}</em>} <small>{t(`accKind_${it.kind}` as TextKey)}</small>
          </div>
        </div>
      </div>
      <h4>{t("accBase")}</h4>
      <StatLines t={t} tot={accBase(it)} />
      <h4>{t("accOpts")}</h4>
      <ul className="acc-lines opt">
        {it.opts.map((o, i) => (
          <li key={i}>
            {Object.entries(optValue(o))
              .map(([k, v]) => statLine(t, k as AccStat, v))
              .join(" · ")}
          </li>
        ))}
      </ul>
      {it.set >= 0 && <SetInfo t={t} set={it.set} />}
    </div>
  );
}

/** 세트 효과 2·3·4 (have: 지금 낀 수 → 켜진 줄 밝게) */
export function SetInfo({ t, set, have }: { t: T; set: number; have?: number }) {
  return (
    <div className="acc-set">
      <h4>
        {t("accSetBonus")} · {t(`accSet${set}` as TextKey)}
        {have !== undefined && ` (${have})`}
      </h4>
      <ul className="acc-lines">
        {ACC_SET_BONUS[set]!.map((b, i) => (
          <li key={i} className={have !== undefined && have >= i + 2 ? "lit" : have !== undefined ? "off" : ""}>
            <b>{t("accSetN").replace("{n}", String(i + 2))}</b>{" "}
            {Object.entries(b)
              .map(([k, v]) => statLine(t, k as AccStat, v))
              .join(" · ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
