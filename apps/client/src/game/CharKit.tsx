// 능력치 창 아래: 이 캐릭터의 무기·전용 아이템 목록 (아이콘). PC는 마우스를 올리면, 모바일은 누르면 장비 줄과 같은 설명 말풍선
import { characterWeapons, PASSIVE_IDS, PASSIVES, type CharacterId, type PassiveDef, type PassiveId, type WeaponId } from "@pixel-rogue/shared";
import { useState, type MouseEvent } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { ItemIcon } from "./itemIcon";
import { ItemTip, tipPos, useCloseOutside, type TipPos } from "./ItemTip";

type KitItem = { kind: "weapon"; id: WeaponId } | { kind: "passive"; id: PassiveId };

export function CharKit({ character, lang, t }: { character: CharacterId; lang: Lang; t: (k: TextKey) => string }) {
  const [tip, setTip] = useState<(TipPos & KitItem) | null>(null);
  const touch = window.matchMedia("(pointer: coarse)").matches;
  useCloseOutside(!!tip && touch, ".char-kit-item", setTip);
  const weapons = characterWeapons(character);
  const passives = PASSIVE_IDS.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === character);
  const at = (item: KitItem, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return { ...item, ...tipPos(r.left + r.width / 2, r.top - 4, r.bottom + 4) };
  };
  const on = (item: KitItem) => tip?.kind === item.kind && tip.id === item.id;
  const props = (item: KitItem) => ({
    onMouseEnter: (e: MouseEvent<HTMLElement>) => !touch && setTip(at(item, e.currentTarget)),
    onMouseLeave: () => !touch && setTip(null),
    onClick: (e: MouseEvent<HTMLElement>) => touch && setTip(on(item) ? null : at(item, e.currentTarget)),
  });
  const row = (label: TextKey, items: KitItem[]) =>
    items.length > 0 && (
      <div className="char-kit-row">
        <span>{t(label)}</span>
        {items.map((item) => (
          <span key={item.id} className={`char-kit-item ${on(item) ? "on" : ""}`} aria-label={itemName(item.kind, item.id, lang)} {...props(item)}>
            <ItemIcon item={item} size={20} />
          </span>
        ))}
      </div>
    );
  return (
    <div className="char-kit">
      {row("weapon", weapons.map((id) => ({ kind: "weapon" as const, id })))}
      {row("passives", passives.map((id) => ({ kind: "passive" as const, id })))}
      {tip && <ItemTip pos={tip} icon={tip} name={itemName(tip.kind, tip.id, lang)} desc={itemDesc(tip.kind, tip.id, lang, t)} />}
    </div>
  );
}
