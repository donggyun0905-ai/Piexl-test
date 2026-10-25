// 상점 스킨 탭 맨 위: 나만의 스킨 (칸 사기 · 입기 · 그리기 화면 열기) + 무엇인지 설명
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { SkinPreview } from "./SkinPreview";
import { MY_SKIN_PRICE, mySkinId } from "./skins";
import { buySkin, coupons, equippedSkin, equipSkin, ownedSkins } from "./wallet";

/** 그리기 화면 (도트 편집 페이지의 나만의 스킨 모드) */
export const myEditorUrl = (c: CharacterId) => `${import.meta.env.BASE_URL}pixel/?my=${c}`;

export function MySkinCard({ t, char, act }: { t: (k: TextKey) => string; char: CharacterId; act: (fn: () => void) => void }) {
  const id = mySkinId(char);
  const has = ownedSkins().includes(id);
  const wearing = equippedSkin(char) === id;
  return (
    <div className={`skin-card my-skin${wearing ? " wearing" : ""}`}>
      <SkinPreview sheet={id} />
      <div className="my-skin-text">
        <strong>✏️ {t("skinMy")}</strong>
        <p>{t("shopMyDesc")}</p>
        <p className="my-skin-note">{t("shopMyNote")}</p>
        <div className="my-skin-buttons">
          {!has ? (
            <button type="button" className="primary" disabled={coupons() < MY_SKIN_PRICE} title={coupons() < MY_SKIN_PRICE ? t("shopNoCoupon") : undefined} onClick={() => act(() => buySkin(id))}>
              {t("shopBuy")} · 🎟 {MY_SKIN_PRICE}
            </button>
          ) : (
            <>
              <button type="button" className="primary" onClick={() => window.location.assign(myEditorUrl(char))}>
                {t("shopMyDraw")}
              </button>
              {wearing ? (
                <span className="skin-tag">{t("shopEquipped")}</span>
              ) : (
                <button type="button" className="secondary" onClick={() => act(() => equipSkin(char, id))}>
                  {t("shopEquip")}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
