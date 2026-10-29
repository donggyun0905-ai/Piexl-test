// 패왕전 상점 전설 장비 재료 창: 완성 장비 능력치·효과 · 재료마다 (가짐 ✓ / 값, 누르면 그 재료를 삼) · 한 번에 완성하기
import { PW_BASIC, PW_LEGEND } from "@pixel-rogue/shared";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { gearItem, gearLines, gearName } from "./pwGearView";
import type { shopView } from "./PwShop";

interface Props {
  id: string;
  view: ReturnType<typeof shopView>;
  lang: Lang;
  t: (k: TextKey) => string;
  onBuy: (id: string) => void;
  onClose: () => void;
}

export function PwShopDetail({ id, view, lang, t, onBuy, onClose }: Props) {
  const leg = PW_LEGEND[id]!;
  const have = [...view.gear];
  // 재료 칸마다: 이미 가진 것(하나씩 지움)은 ✓
  const parts = Object.entries(leg.need ?? {}).flatMap(([m, n]) => Array.from({ length: n }, () => m)).map((m) => {
    const at = have.indexOf(m);
    if (at >= 0) have.splice(at, 1);
    return { m, own: at >= 0 };
  });
  const plan = view.plans.get(id);
  const can = (cost: number) => view.open && view.gold >= cost;
  return (
    <div className="pw-shop-detail" role="dialog" aria-label={gearName(id, lang)}>
      <header>
        <ItemIcon item={gearItem(id, lang)} size={56} />
        <span>
          <b>{gearName(id, lang)}</b>
          <small>{gearLines(id, t).join(" · ")}</small>
        </span>
        <button type="button" className="ghost" onClick={onClose}>
          ✕
        </button>
      </header>
      <h4>{t("pwShopNeed")}</h4>
      <div className="pw-shop-parts">
        {parts.map(({ m, own }, k) => {
          const cost = PW_BASIC[m]!.cost;
          const ok = !own && !!view.plans.get(m) && can(cost);
          return (
            <button key={`${m}${k}`} type="button" className={`pw-shop-item${own ? " own" : ok ? "" : " dim"}`} onClick={() => ok && onBuy(m)}>
              <ItemIcon item={gearItem(m, lang)} size={40} />
              <span>
                <b>{gearName(m, lang)}</b>
                <small>{gearLines(m, t).join(" · ")}</small>
              </span>
              <em>{own ? `✓ ${t("pwShopOwn")}` : `🪙 ${cost}`}</em>
            </button>
          );
        })}
        <div className="pw-shop-item part-fee">
          <span>
            <b>{t("pwShopFee")}</b>
          </span>
          <em>🪙 {leg.cost}</em>
        </div>
      </div>
      <button type="button" className="primary pw-shop-make" disabled={!plan || !can(plan.cost)} onClick={() => onBuy(id)}>
        {t("pwShopMake")} · 🪙 {plan?.cost ?? "—"}
      </button>
      {!plan && <p className="pw-shop-away">{t("pwShopCant")}</p>}
    </div>
  );
}
