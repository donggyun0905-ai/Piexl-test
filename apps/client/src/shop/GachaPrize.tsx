// 뽑기 결과 하나의 앞면 (한정 테마·이벤트 코인·쿠폰) · 카드를 뒤집을 때 나는 빛 색
import type { TextKey } from "../i18n";
import { SkinPreview } from "./SkinPreview";
import { THEME_KEY } from "./SkinTab";
import { CHARACTER_IDS, limitedSkins, skinId } from "./skins";
import type { GachaPrize } from "./wallet";
import { EcoinIcon } from "../event/EcoinIcon";

/** 빛: 한정 스킨 무지개 · 만능 쿠폰 보라 · 이벤트 코인 초록빛 */
export type PrizeGlow = "rainbow" | "purple" | "green";
export function prizeGlow(p: GachaPrize): PrizeGlow {
  if (p.kind === "limited") return "rainbow";
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
  const sheet = limitedSkins(p.theme)[0] ?? skinId(CHARACTER_IDS[0]!, p.theme);
  return (
    <>
      <SkinPreview sheet={sheet} size={size} />
      <strong>{`${t("shopLimited")} · ${t(THEME_KEY[p.theme])}`}</strong>
      <span className="skin-tag">{p.dup ? t("shopDup").replace("{n}", String(p.refund)) : t("shopAllChars")}</span>
    </>
  );
}
