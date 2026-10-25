// 뽑기 결과 하나의 앞면 (스킨·한정 테마·쿠폰) · 카드를 뒤집을 때 나는 빛 색
import type { TextKey } from "../i18n";
import { SkinPreview } from "./SkinPreview";
import { THEME_KEY } from "./SkinTab";
import { CHARACTER_IDS, parseSkin, skinId } from "./skins";
import type { GachaPrize } from "./wallet";
import { EcoinIcon } from "../event/EcoinIcon";

/** 빛: 한정 스킨 무지개 · 일반 스킨 금빛 · 만능 쿠폰 보라 · 이벤트 코인 초록빛 */
export type PrizeGlow = "rainbow" | "gold" | "purple" | "green";
export function prizeGlow(p: GachaPrize): PrizeGlow {
  if (p.kind === "limited") return "rainbow";
  if (p.kind === "skin") return "gold";
  if (p.kind === "ecoin") return "green";
  return "purple";
}

export function Prize({ p, t, size = 72 }: { p: GachaPrize; t: (k: TextKey) => string; size?: number }) {
  if (p.kind === "coupon")
    return (
      <>
        <span className="gacha-coupon">🎟</span>
        <strong>{t("shopCouponPrize").replace("{n}", String(p.n))}</strong>
      </>
    );
  if (p.kind === "ecoin")
    return (
      <>
        <span className="gacha-coupon"><EcoinIcon big /></span>
        <strong>{t("shopEcoinPrize").replace("{n}", String(p.n))}</strong>
      </>
    );
  const sheet = p.kind === "limited" ? skinId(CHARACTER_IDS[0]!, p.theme) : p.id;
  const { character, theme } = parseSkin(sheet);
  return (
    <>
      <SkinPreview sheet={sheet} size={size} />
      <strong>{p.kind === "limited" ? `${t("shopLimited")} · ${t(THEME_KEY[theme])}` : `${t(character as TextKey)} · ${t(THEME_KEY[theme])}`}</strong>
      <span className="skin-tag">{p.dup ? t("shopDup").replace("{n}", String(p.refund)) : p.kind === "limited" ? t("shopAllChars") : t("shopNew")}</span>
    </>
  );
}
