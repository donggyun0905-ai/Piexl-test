// 비르디아 공생 정령 창 (sim/factionSpirit·spiritPack): 시작 카드 3장 고르기 · 보관 꾸러미 꺼내기 · 상자 꾸러미 패시브 고르기 · 여우 바꾸기 버튼
// 누른 것은 controls.queueMenu → 입력 menu · Esc: 꾸러미 창 닫기 / 고르기·상자 창 잠깐 숨김 (작은 버튼으로 다시 엶)
import { menuCode, SPIRIT_KIND, SPIRIT_OP, type PassiveId, type SpiritId, type UseItemId } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import type { Controls } from "./controls";
import { ItemIcon } from "./itemIcon";

export interface SpiritView {
  pick?: SpiritId[];
  bag?: UseItemId[];
  bagOpen?: boolean;
  chest?: PassiveId[];
  /** 여우: 바꾸기 남은 수 · 앞에 바꿀 아이템이 있는지 */
  fox?: number;
  near?: boolean;
}

interface Props {
  view: SpiritView;
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
}

export function SpiritWindows({ view, lang, t, controls }: Props) {
  const send = (op: number, a = 0) => controls()?.queueMenu(menuCode(op, a));
  const [hidePick, setHidePick] = useState(false);
  const [hideChest, setHideChest] = useState(false);
  const ref = useRef(view);
  ref.current = view;
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code !== "Escape" || e.repeat) return;
      const v = ref.current;
      if (v.bagOpen) send(SPIRIT_OP.bag, 63);
      else if (v.pick) setHidePick(true);
      else if (v.chest) setHideChest(true);
      else return;
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const chestKey = view.chest?.join() ?? "";
  useEffect(() => setHideChest(false), [chestKey]);
  return (
    <>
      {view.pick && !hidePick && (
        <div className="sp-window sp-pick" role="dialog" aria-label={t("spPickTitle")}>
          <b>{t("spPickTitle")}</b>
          <div className="sp-cards">
            {view.pick.map((id, i) => (
              <button key={id} type="button" className={`sp-card ${SPIRIT_KIND[id]}`} onClick={() => send(SPIRIT_OP.pick, i)}>
                <small>{t(`spKind_${SPIRIT_KIND[id]}` as TextKey)}</small>
                <strong>{t(`sp_${id}` as TextKey)}</strong>
                <span>{t(`spDesc_${id}` as TextKey)}</span>
              </button>
            ))}
          </div>
          <small className="sp-esc">{t("spEscClose")}</small>
        </div>
      )}
      {view.pick && hidePick && (
        <button type="button" className="sp-later" onClick={() => setHidePick(false)}>
          {t("spPickLater")}
        </button>
      )}
      {view.bagOpen && view.bag && (
        <div className="sp-window sp-bag" role="dialog" aria-label={t("spBagTitle")}>
          <b>{t("spBagTitle")}</b>
          <div className="sp-items">
            {view.bag.map((id, i) => (
              <button key={`${id}${i}`} type="button" title={itemDesc("use", id, lang, t)} onClick={() => send(SPIRIT_OP.bag, i)}>
                <ItemIcon item={{ kind: "use", id }} size={32} />
                <span>{itemName("use", id, lang)}</span>
              </button>
            ))}
          </div>
          <small className="sp-esc">{t("spEscClose")}</small>
        </div>
      )}
      {view.chest && !hideChest && (
        <div className="sp-window sp-chest" role="dialog" aria-label={t("spChestTitle")}>
          <b>{t("spChestTitle")}</b>
          <div className="sp-cards">
            {view.chest.map((id, i) => (
              <button key={id} type="button" className="sp-card" onClick={() => send(SPIRIT_OP.chest, i)}>
                <ItemIcon item={{ kind: "passive", id }} size={40} />
                <strong>{itemName("passive", id, lang)}</strong>
                <span>{itemDesc("passive", id, lang, t)}</span>
              </button>
            ))}
          </div>
          <small className="sp-esc">{t("spEscClose")}</small>
        </div>
      )}
      {view.chest && hideChest && (
        <button type="button" className="sp-later" onClick={() => setHideChest(false)}>
          {t("spChestLater")}
        </button>
      )}
      {view.fox !== undefined && (
        <button type="button" className="sp-fox" disabled={!view.fox || !view.near} title={t("spFoxTip")} onClick={() => send(SPIRIT_OP.fox)}>
          {t("spFox").replace("{n}", String(view.fox))}
        </button>
      )}
    </>
  );
}
