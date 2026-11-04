// 패왕전 캐릭터 스킬 목록: 평타(기본 무기) · 패시브(캐릭터 능력) · 스킬 1~4 (준비방 PwPrep · 밴픽 PwDraft)
import { CHARACTERS, kitOf, type CharacterId } from "@pixel-rogue/shared";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { PW_PASSIVE_TEXT } from "../i18n/text/pwPassives";
import { keyLabel, useSettings } from "../settings";
import { skillLines, skillName } from "./pwSkillText";

/** 패왕전에서만 바꾼 패시브 · 기본 공격 설명 */
const PAS: Partial<Record<CharacterId, TextKey>> = { novice: "pwPasNovice", rider: "pwPasRider", fly: "pwPasFly" };
/** 패왕전 패시브 설명 글자 (스킬 칸 왼쪽 패시브 칸도 씀) */
export function pwPassiveKey(c: CharacterId): TextKey {
  const pv = `pwPv${c[0]!.toUpperCase()}${c.slice(1)}`;
  return PAS[c] ?? (pv in PW_PASSIVE_TEXT ? (pv as TextKey) : (`${c}Desc` as TextKey));
}
const BASIC: Partial<Record<CharacterId, TextKey>> = { bedouin: "pwBasicBedouin", slayer: "pwBasicSlayer", remnant: "pwBasicRemnant", apostle: "pwBasicAim", elder: "pwBasicAim", silk: "pwBasicAim", pungryu: "pwBasicAim" };

export function PwSkillList({ characterId, lang, t }: { characterId: CharacterId; lang: Lang; t: (key: TextKey) => string }) {
  const keys = useSettings().skillKeys;
  const kit = kitOf(characterId);
  const weapon = CHARACTERS[characterId].startWeapon;
  return (
    <>
      <div className="pw-skill-row">
        <ItemIcon item={{ kind: "weapon", id: weapon }} size={32} />
        <span>
          <b>{t("pwSkBasic")}</b> · {itemName("weapon", weapon, lang)}
          {kit && kit.basic > 1 && <small> (+{Math.round((kit.basic - 1) * 100)}%)</small>}
          {BASIC[characterId] && <small>{t(BASIC[characterId]!)}</small>}
        </span>
      </div>
      <div className="pw-skill-row">
        <span className="pw-skill-badge">P</span>
        <span>
          <b>{t("pwSkPassive")}</b>
          <small>{t(pwPassiveKey(characterId))}</small>
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
    </>
  );
}
