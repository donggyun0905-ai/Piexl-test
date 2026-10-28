// 패왕전 준비방 (스킬 보기): 고른 캐릭터의 평타(기본 무기) · 패시브(캐릭터 능력) · 스킬 1~4 설명 → 이 캐릭터로 시작
// 무기·패시브 고르기는 없음 (사용 아이템은 경기장에서 주움)
import { CHARACTERS, kitOf, type CharacterId, type PwLoadout } from "@pixel-rogue/shared";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { keyLabel, useSettings } from "../settings";
import { skillLines, skillName } from "./pwSkillText";

interface Props {
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onStart: (lo: PwLoadout) => void;
  onBack: () => void;
}

export function PwPrep({ characterId, lang, t, onStart, onBack }: Props) {
  const keys = useSettings().skillKeys;
  const kit = kitOf(characterId);
  const weapon = CHARACTERS[characterId].startWeapon;
  return (
    <div className="pw-prep pw-skills">
      <h2>
        {t(characterId)} · {t("pwSkills")}
      </h2>
      <div className="pw-skill-row">
        <ItemIcon item={{ kind: "weapon", id: weapon }} size={32} />
        <span>
          <b>{t("pwSkBasic")}</b> · {itemName("weapon", weapon, lang)}
          {kit && kit.basic > 1 && <small> (+{Math.round((kit.basic - 1) * 100)}%)</small>}
        </span>
      </div>
      <div className="pw-skill-row">
        <span className="pw-skill-badge">P</span>
        <span>
          <b>{t("pwSkPassive")}</b>
          <small>{t(`${characterId}Desc` as TextKey)}</small>
        </span>
      </div>
      {kit?.skills.map((def, k) => (
        <div key={k} className={`pw-skill-row ${k === 3 ? "ult" : ""}`} style={{ "--tint": def.tint } as React.CSSProperties}>
          <span className="pw-skill-icon">
            <ItemIcon item={{ kind: "weapon", id: def.icon }} size={32} />
            <kbd>{keyLabel(keys[k] ?? String(k + 1))}</kbd>
          </span>
          <span>
            <b>
              {skillName(characterId, k, t)}
              {k === 3 && <em> · {t("pwSkUlt")}</em>}
            </b>
            {skillLines(def, t).map((l) => (
              <small key={l}>{l}</small>
            ))}
          </span>
        </div>
      ))}
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
