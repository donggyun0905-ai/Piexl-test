// 상점 휴지통 판매 창 (휴지통 앞에서 F): 무기·사용 아이템·패시브마다 받는 돈. 한 번 누르면 "판매?" 확인, 한 번 더 누르면 팜 (sim/shop.sellItem)
import { SELL_WEAPON } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import type { Controls } from "./controls";
import type { LoadoutView } from "./Loadout";
import { ItemIcon, type IconItem } from "./itemIcon";

/** 판매 번호 차례: 무기 · 사용 아이템 칸 1·2 · 패시브 (3 = 첫째). view.sell 값도 이 차례 */
export const sellCodes = (passives: number): number[] => [SELL_WEAPON, 1, 2, ...Array.from({ length: passives }, (_, i) => i + 3)];

interface Props {
  view: LoadoutView;
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
}

export function SellBar({ view, lang, t, controls }: Props) {
  /** 확인을 기다리는 판매 번호 */
  const [armed, setArmed] = useState(0);
  const prices = view.sell ?? [];
  const codes = sellCodes(view.passives.length);
  const itemOf = (n: number): IconItem | null =>
    n === SELL_WEAPON ? { kind: "weapon", id: view.weaponId } : n <= 2 ? (view.slots[n - 1] ? { kind: "use", id: view.slots[n - 1]! } : null) : { kind: "passive", id: view.passives[n - 3]! };
  // 같은 패시브가 여럿이면 하나만 보임 (첫째를 팜)
  const shown = codes
    .map((n, k) => ({ n, price: prices[k] ?? 0, item: itemOf(n) }))
    .filter((x) => x.price > 0 && x.item && !(x.n >= 3 && view.passives.indexOf(view.passives[x.n - 3]!) !== x.n - 3));
  return (
    <div className="sell-window" role="dialog" aria-label={t("sellTitle")}>
      <b>{t("sellTitle")}</b>
      {shown.length === 0 && <small>{t("sellNone")}</small>}
      <div className="sell-list">
        {shown.map(({ n, price, item }) => (
          <button
            key={`${n}:${item!.id}`}
            type="button"
            className={`sell-item ${armed === n ? "armed" : ""} ${item!.kind}`}
            onPointerDown={(e) => {
              e.preventDefault();
              if (armed !== n) return setArmed(n);
              setArmed(0);
              controls()?.queueSell(n);
            }}
          >
            <ItemIcon item={item!} size={22} />
            <span>{itemName(item!.kind, item!.id as never, lang)}</span>
            <small>{armed === n ? t("sellConfirm") : `${price}G`}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
