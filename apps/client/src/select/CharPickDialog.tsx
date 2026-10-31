// 캐릭터 선택창에서 카드를 누르면 뜨는 창: 생김새·설명·능력치·숙련도 → 취소(Esc) · 진행하기
import { baseStats, CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { useEffect } from "react";
import type { Lang, TextKey } from "../i18n";
import { achievementName } from "../i18n/achievements";
import { CHARACTER_GOALS, characterOpen } from "../characterGoals";
import { SkinPreview } from "../shop/SkinPreview";
import { parseSkin } from "../shop/skins";
import { THEME_KEY } from "../shop/SkinTab";
import { equippedSkin } from "../shop/wallet";
import { CHAR_DESC } from "./charDesc";
import { cardOf, frameOf, masteryLevel, MASTERY_AT, playsOf, toNext } from "../mastery/mastery";


/** 입은 스킨 이름 (없으면 기본) */
export function skinName(t: (k: TextKey) => string, c: CharacterId): string {
  const worn = equippedSkin(c);
  return worn ? t(THEME_KEY[parseSkin(worn).theme]) : t("shopDefault");
}

/** 숙련도 한 줄 + 막대 */
export function MasteryLine({ t, c }: { t: (k: TextKey) => string; c: CharacterId }) {
  const n = playsOf(c);
  const lv = masteryLevel(n);
  const left = toNext(n);
  const from = lv === 0 ? 0 : MASTERY_AT[lv - 1]!;
  const to = MASTERY_AT[lv] ?? from;
  const pct = left === null ? 100 : Math.round(((n - from) / Math.max(1, to - from)) * 100);
  return (
    <div className="cs-mastery-line" title={t("masteryHint")}>
      <b className={`cs-lv lv-${lv}`}>{t("masteryLv").replace("{n}", String(lv))}</b>
      <span className="cs-bar">
        <i style={{ width: `${pct}%` }} />
      </span>
      <small>{n === 0 ? t("masteryNone") : left === null ? t("masteryMaxed") : t("masteryNext").replace("{n}", String(left))}</small>
    </div>
  );
}

interface Props {
  t: (k: TextKey) => string;
  lang: Lang;
  c: CharacterId;
  onGo: () => void;
  onClose: () => void;
}

export function CharPickDialog({ t, lang, c, onGo, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const s = baseStats(c, CHARACTERS[c].startWeapon);
  const open = characterOpen(c);
  const goal = CHARACTER_GOALS[c];
  const card = cardOf(c);
  const stats: [TextKey, number][] = [
    ["statHp", s.maxHp],
    ["statDamage", Math.round(s.damage)],
    ["statAttackSpeed", Math.round(s.attackSpeed * 100) / 100],
    ["statRange", s.range],
    ["statMoveSpeed", Math.round(s.moveSpeed * 100) / 100],
  ];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal cs-pick" role="dialog" aria-modal="true" aria-label={t(c as TextKey)} onClick={(e) => e.stopPropagation()}>
        <div className="cs-pick-main">
          <div className={`cs-frame frame-${frameOf(c)}`}>
            <span className={`character-card cs-pick-look ${c}${card ? ` card-skin-${card}` : ""}`}>
              <SkinPreview sheet={equippedSkin(c) ?? c} size={160} still />
            </span>
          </div>
          <div className="cs-pick-info">
            <h2>{t(c as TextKey)}</h2>
            <small className="cs-skin">{skinName(t, c)}</small>
            <MasteryLine t={t} c={c} />
            <p className="cs-pick-desc">{t(CHAR_DESC[c])}</p>
            <h3>{t("csStats")}</h3>
            <dl className="cs-pick-stats">
              {stats.map(([k, v]) => (
                <div key={k}>
                  <dt>{t(k)}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {!open && goal && <p className="character-lock">🔒 {t("charGoalLock").replace("{name}", achievementName(goal, lang))}</p>}
          </div>
        </div>
        <div className="cs-pick-actions">
          <button type="button" className="secondary" onClick={onClose}>
            {t("csCancel")}
          </button>
          <button type="button" className="primary" disabled={!open} onClick={onGo}>
            {t("csGo")} ▶
          </button>
        </div>
      </div>
    </div>
  );
}
