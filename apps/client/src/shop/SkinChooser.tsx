// 캐릭터 선택창의 스킨 고르기 창: 입을 수 있는 스킨을 크게 늘어놓고 눌러서 입음
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { Modal } from "../menu/Modal";
import { SkinPreview } from "./SkinPreview";
import { LIMITED_THEMES, MY_THEME, parseSkin, SKIN_THEMES, skinId } from "./skins";
import { THEME_KEY } from "./SkinTab";
import { equippedSkin, equipSkin, ownedSkins } from "./wallet";

/** 이 캐릭터가 입을 수 있는 스킨 (기본 = null, 나만의 스킨 → 한정 → 상점 순서) */
export function wearable(c: CharacterId): (string | null)[] {
  const owned = ownedSkins();
  return [null, ...[MY_THEME, ...LIMITED_THEMES, ...SKIN_THEMES].map((th) => skinId(c, th)).filter((id) => owned.includes(id))];
}

export function SkinChooser({ char, t, onClose }: { char: CharacterId; t: (k: TextKey) => string; onClose: () => void }) {
  const worn = equippedSkin(char) ?? null;
  return (
    <Modal title={`${t(char as TextKey)} · ${t("skinSwitch")}`} t={t} onClose={onClose} className="skin-chooser">
      <div className="skin-chooser-grid">
        {wearable(char).map((id) => (
          <button
            key={id ?? "default"}
            type="button"
            className={`skin-choice${worn === id ? " wearing" : ""}`}
            onClick={() => {
              equipSkin(char, id);
              onClose();
            }}
          >
            <SkinPreview sheet={id ?? char} size={112} />
            <strong>{id ? t(THEME_KEY[parseSkin(id).theme]) : t("shopDefault")}</strong>
            {worn === id && <small>{t("shopEquipped")}</small>}
          </button>
        ))}
      </div>
    </Modal>
  );
}
