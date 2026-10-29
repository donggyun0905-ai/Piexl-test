// 상점 스킨 탭: 캐릭터를 고르면 기본 + 테마 9개, 사기 · 입기
import type { CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../i18n";
import { MySkinCard } from "./MySkinCard";
import { SkinPreview } from "./SkinPreview";
import { CHARACTER_IDS, hasLimited, LIMITED_THEMES, SKIN_PRICE, SKIN_THEMES, skinId, VICTORY_THEME, type SkinTheme } from "./skins";
import { buySkin, coupons, equippedSkin, equipSkin, ownedSkins } from "./wallet";

export const THEME_KEY: Record<SkinTheme, TextKey> = {
  swim: "skinSwim",
  xmas: "skinXmas",
  halloween: "skinHalloween",
  school: "skinSchool",
  newyear: "skinNewyear",
  japan: "skinJapan",
  china: "skinChina",
  usa: "skinUsa",
  swap: "skinSwap",
  tiger: "skinTiger",
  summer: "skinSummer",
  victory: "skinVictory",
  my: "skinMy",
};

export function SkinTab({ t, onChange }: { t: (k: TextKey) => string; onChange: () => void }) {
  const [char, setChar] = useState<CharacterId>("warden");
  const [, redraw] = useState(0);
  const owned = ownedSkins();
  const worn = equippedSkin(char) ?? null;
  const act = (fn: () => void) => {
    fn();
    redraw((n) => n + 1);
    onChange();
  };
  const cards: { id: string | null; label: string; limited?: boolean; reward?: boolean }[] = [
    { id: null, label: t("shopDefault") },
    ...LIMITED_THEMES.filter((th) => hasLimited(th, char)).map((th) => ({ id: skinId(char, th), label: t(THEME_KEY[th]), limited: true })),
    { id: skinId(char, VICTORY_THEME), label: t("skinVictory"), limited: true, reward: true },
    ...SKIN_THEMES.map((th) => ({ id: skinId(char, th), label: t(THEME_KEY[th]) })),
  ];
  return (
    <div className="shop-skins">
      <div className="shop-chars">
        {CHARACTER_IDS.map((c) => (
          <button key={c} type="button" className={c === char ? "active" : ""} onClick={() => setChar(c)}>
            {t(c as TextKey)}
          </button>
        ))}
      </div>
      <MySkinCard t={t} char={char} act={act} />
      <div className="shop-grid">
        {cards.map(({ id, label, limited, reward }) => {
          const has = id === null || owned.includes(id);
          const wearing = worn === id;
          return (
            <div key={id ?? "default"} className={`skin-card${wearing ? " wearing" : ""}${limited ? " limited" : ""}`}>
              {limited && <span className="limited-badge">{t("shopLimited")}</span>}
              <SkinPreview sheet={id ?? char} />
              <strong>{label}</strong>
              {wearing ? (
                <span className="skin-tag">{t("shopEquipped")}</span>
              ) : has ? (
                <button type="button" className="secondary" onClick={() => act(() => equipSkin(char, id))}>
                  {t("shopEquip")}
                </button>
              ) : limited ? (
                <span className="skin-tag">{t(reward ? "pwLeagueOnly" : "shopLimitedLock")}</span>
              ) : (
                <button type="button" className="primary" disabled={coupons() < SKIN_PRICE} title={coupons() < SKIN_PRICE ? t("shopNoCoupon") : undefined} onClick={() => act(() => buySkin(id!))}>
                  {t("shopBuy")} · 🎟 {SKIN_PRICE}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
