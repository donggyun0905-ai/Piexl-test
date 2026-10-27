// 상점 방의 판매 줄: 사용 아이템·패시브마다 받는 돈. 한 번 누르면 "판매?" 확인, 한 번 더 누르면 팜 (sim/shop.sellItem)
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import type { Controls } from "./controls";
import type { LoadoutView } from "./Loadout";
import { ItemIcon } from "./itemIcon";

interface Props {
  view: LoadoutView;
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
}

export function SellBar({ view, lang, t, controls }: Props) {
  /** 확인을 기다리는 판매 번호 (1·2 = 사용 아이템 칸, 3~ = 패시브 순서) */
  const [armed, setArmed] = useState(0);
  const prices = view.sell ?? [];
  const items: { n: number; item: { kind: "use"; id: string } | { kind: "passive"; id: string } }[] = [];
  view.slots.forEach((id, i) => id && items.push({ n: i + 1, item: { kind: "use", id } }));
  // 같은 패시브가 여럿이면 하나만 보임 (첫째를 팜)
  view.passives.forEach((id, i) => view.passives.indexOf(id) === i && items.push({ n: i + 3, item: { kind: "passive", id } }));
  const shown = items.filter(({ n }) => (prices[n - 1] ?? 0) > 0);
  if (shown.length === 0) return null;
  return (
    <span className="sell-bar">
      <b>{t("sellTitle")}</b>
      {shown.map(({ n, item }) => (
        <button
          key={`${n}:${item.id}`}
          type="button"
          className={`sell-item ${armed === n ? "armed" : ""}`}
          title={itemName(item.kind, item.id as never, lang)}
          onPointerDown={(e) => {
            e.preventDefault();
            if (armed !== n) return setArmed(n);
            setArmed(0);
            controls()?.queueSell(n);
          }}
        >
          <ItemIcon item={item as never} size={18} />
          <small>{armed === n ? t("sellConfirm") : `${prices[n - 1]}G`}</small>
        </button>
      ))}
    </span>
  );
}
