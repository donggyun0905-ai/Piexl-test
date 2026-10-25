// 상점 뽑기 탭: 한정 테마 배너 · 1번 · 10번(1번 덤). 뽑으면 봉투 뜯기·카드 뒤집기 연출(GachaReveal)
import { useState } from "react";
import type { TextKey } from "../i18n";
import { GachaReveal } from "./GachaReveal";
import { SkinPreview } from "./SkinPreview";
import { THEME_KEY } from "./SkinTab";
import { ALL_SKINS, GACHA10_PRICE, GACHA_PRICE, GACHA_REFUND, LIMITED_REFUND, LIMITED_THEMES, skinId } from "./skins";
import { coupons, gacha, ownedSkins, type GachaPrize } from "./wallet";

/** 배너에 보여 줄 캐릭터 */
const SHOWCASE = ["mage", "warden", "beast", "gunner", "ninja"] as const;

export function GachaTab({ t, onChange }: { t: (k: TextKey) => string; onChange: () => void }) {
  const [result, setResult] = useState<GachaPrize[]>([]);
  const [pulls, setPulls] = useState(0);
  const pull = (n: number, price: number) => {
    const r = gacha(n, price);
    if (r) {
      setResult(r);
      setPulls((k) => k + 1);
    }
    onChange();
  };
  return (
    <div className="shop-gacha">
      {LIMITED_THEMES.map((th) => (
        <div key={th} className={`gacha-banner ${th}`}>
          <span className="limited-badge">{t("shopLimited")}</span>
          <strong>{t(THEME_KEY[th])}</strong>
          <div className="banner-row">
            {SHOWCASE.map((c) => (
              <SkinPreview key={c} sheet={skinId(c, th)} size={64} />
            ))}
          </div>
          <p>{t("shopLimitedDesc")}</p>
        </div>
      ))}
      <p className="shop-note">{t("shopOwned").replace("{n}", String(ownedSkins().filter((id) => ALL_SKINS.includes(id)).length)).replace("{all}", String(ALL_SKINS.length))}</p>
      <div className="gacha-buttons">
        <button type="button" className="primary big" disabled={coupons() < GACHA_PRICE} onClick={() => pull(1, GACHA_PRICE)}>
          {t("shopGacha1")} · 🎟 {GACHA_PRICE}
        </button>
        <button type="button" className="primary big" disabled={coupons() < GACHA10_PRICE} onClick={() => pull(11, GACHA10_PRICE)}>
          {t("shopGacha10")} · 🎟 {GACHA10_PRICE}
        </button>
      </div>
      <p className="shop-note">{t("shopGachaNote").replace("{n}", String(GACHA_REFUND)).replace("{m}", String(LIMITED_REFUND))}</p>
      {result.length > 0 && <GachaReveal key={pulls} prizes={result} t={t} onClose={() => setResult([])} />}
    </div>
  );
}
