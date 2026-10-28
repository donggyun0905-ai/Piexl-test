// 패왕전 모든 캐릭터 둘러보기 (대결 고르기 화면 '연습장' 아래): 역할 탭 · 캐릭터 카드 전부 → 누르면 스킬 설명 창(PwSkillList) · 연습장에서 해 보기
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { SkinPreview } from "../shop/SkinPreview";
import { PW_ROLES, ROLE_TAG, ROLE_TIP, roleOf, type PwRole } from "./pwRoles";
import { PwSkillList } from "./PwSkillList";

interface Props {
  lang: Lang;
  t: (key: TextKey) => string;
  onTry: (c: CharacterId) => void;
  onBack: () => void;
}

export function PwBrowse({ lang, t, onTry, onBack }: Props) {
  const [tab, setTab] = useState<PwRole | null>(null);
  const [open, setOpen] = useState<CharacterId | null>(null);
  const list = CHARACTER_IDS.filter((c) => !tab || roleOf(c) === tab);
  return (
    <div className="pw-browse">
      <h2>{t("pwBrowse")}</h2>
      <div className="pw-draft-tabs">
        <button type="button" className={!tab ? "on" : ""} onClick={() => setTab(null)}>
          {t("pwDraftAll")}
        </button>
        {PW_ROLES.map((r) => (
          <button key={r} type="button" className={tab === r ? "on" : ""} title={t(ROLE_TIP[r])} onClick={() => setTab(r)}>
            {t(ROLE_TAG[r])}
          </button>
        ))}
      </div>
      <div className="pw-draft-grid pw-browse-grid">
        {list.map((c) => (
          <button key={c} type="button" onClick={() => setOpen(c)}>
            <SkinPreview sheet={c} size={72} />
            <small>{t(c)}</small>
            <em className="pw-role" title={t(ROLE_TIP[roleOf(c)])}>
              {t(ROLE_TAG[roleOf(c)])}
            </em>
          </button>
        ))}
      </div>
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
      {open && (
        <div className="game-overlay" onClick={() => setOpen(null)}>
          <div className="modal pw-skills pw-browse-card" onClick={(e) => e.stopPropagation()}>
            <h2>
              {t(open)} · <em className="pw-role">{t(ROLE_TAG[roleOf(open)])}</em>
            </h2>
            <p className="hint">{t(ROLE_TIP[roleOf(open)])}</p>
            <PwSkillList characterId={open} lang={lang} t={t} />
            <div className="modal-actions">
              <button type="button" className="primary" onClick={() => onTry(open)}>
                🎯 {t("pwBrowseTry")}
              </button>
              <button type="button" onClick={() => setOpen(null)}>
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
