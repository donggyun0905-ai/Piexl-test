// 패왕전 준비방 (스킬 보기): 고른 캐릭터의 평타·패시브·스킬 1~4 설명(PwSkillList) → 이 캐릭터로 시작
// 무기·패시브 고르기는 없음 (사용 아이템은 경기장에서 주움)
import { CHARACTERS, type CharacterId, type PwLoadout } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { PwSkillList } from "./PwSkillList";

interface Props {
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onStart: (lo: PwLoadout) => void;
  onBack: () => void;
}

export function PwPrep({ characterId, lang, t, onStart, onBack }: Props) {
  const weapon = CHARACTERS[characterId].startWeapon;
  return (
    <div className="pw-prep pw-skills">
      <h2>
        {t(characterId)} · {t("pwSkills")}
      </h2>
      <PwSkillList characterId={characterId} lang={lang} t={t} />
      <p className="hint">{t("pwSkAimHint")}</p>
      <div className="pw-prep-actions">
        <button type="button" className="primary" onClick={() => onStart({ weapon, passives: [], uses: [] })}>
          {t("pwSkReady")}
        </button>
        <button type="button" className="ghost" onClick={onBack}>
          {t("back")}
        </button>
      </div>
    </div>
  );
}
