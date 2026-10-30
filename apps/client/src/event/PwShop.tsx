// 패왕전 집 상점 창 (쟁탈전 · 전쟁의 서막, B · Esc로 닫음): 맨 위 추천 장비(역할군마다 여섯 중 안 가진 셋) · 내 장비 팔기 · 사용 아이템 · 기본 장비 · 전설 장비
// 전설 장비를 누르면 재료 창(PwShopDetail, body에 그려 보고 있는 화면 가운데): 재료 하나씩 사거나 한 번에 완성 · 집에 있거나 쓰러져 기다리는 동안 살 수 있음
// 누른 것은 controls.queueMenu → 입력 menu → sim/pwGrow.growMenu
import { atHome, buyPlan, fullCost, GROW_MENU, inPlay, PW_BASIC, PW_LEGEND, PW_SHOP_IDS, PW_SHOP_USES, useSeat as takeSeat, type RunState } from "@pixel-rogue/shared";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { Controls } from "../game/controls";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { ROLE_TAG } from "./pwRoles";
import { gearItem, gearLines, gearName, recFor } from "./pwGearView";
import { PwShopDetail } from "./PwShopDetail";

export { gearLines } from "./pwGearView";

interface Props {
  run: RunState;
  me: number;
  lang: Lang;
  t: (k: TextKey) => string;
  controls: () => Controls | null;
  onClose: () => void;
}

/** 내 자리 기준으로 살 수 있는지·돈 (보던 자리로 돌려놓음) */
export function shopView(run: RunState, me: number) {
  const back = run.seat ?? 0;
  takeSeat(run, me);
  const out = { open: atHome(run, me) || !inPlay(run, me), gold: run.gold, gear: [...(run.player.pwGear ?? [])], plans: new Map(PW_SHOP_IDS.map((id) => [id, buyPlan(run, id)])), char: run.player.characterId };
  takeSeat(run, back);
  return out;
}

export function PwShop({ run, me, lang, t, controls, onClose }: Props) {
  const [detail, setDetail] = useState<string | null>(null);
  const v = shopView(run, me);
  const send = (code: number) => controls()?.queueMenu(code);
  const buy = (id: string) => send(GROW_MENU.buy + PW_SHOP_IDS.indexOf(id));
  const card = (id: string) => {
    const use = PW_SHOP_USES[id as keyof typeof PW_SHOP_USES] !== undefined;
    const legend = !!PW_LEGEND[id];
    const plan = v.plans.get(id);
    const cost = plan?.cost ?? fullCost(id);
    const ok = v.open && !!plan && v.gold >= cost;
    return (
      <button key={id} type="button" className={`pw-shop-item${legend ? " legend" : ""}${ok ? "" : " dim"}`} onClick={() => (legend ? setDetail(id) : ok && buy(id))}>
        <ItemIcon item={use ? ({ kind: "use", id } as never) : gearItem(id, lang)} size={40} />
        <span>
          <b>{use ? itemName("use", id, lang) : gearName(id, lang)}</b>
          <small>{use ? "" : gearLines(id, t).join(" · ")}</small>
        </span>
        <em>🪙 {cost}</em>
      </button>
    );
  };
  const rec = recFor(v.char, v.gear);
  return (
    <div className="pw-shop" role="dialog" aria-label={t("pwShopTitle")}>
      <header>
        <b>{t("pwShopTitle")}</b>
        <span className="pw-shop-gold">🪙 {v.gold}</span>
        <small>{t("pwShopClose")}</small>
        <button type="button" className="ghost" onClick={onClose}>
          ✕
        </button>
      </header>
      {!v.open && <p className="pw-shop-away">{t("pwShopAway")}</p>}
      <h4>
        ⭐ {t("pwShopRec")} · {t(ROLE_TAG[rec.role])}
      </h4>
      <div className="pw-shop-rec">
        {rec.list.map(({ id, k }) => (
          <button key={id} type="button" className="pw-shop-item legend rec" onClick={() => setDetail(id)}>
            <ItemIcon item={gearItem(id, lang)} size={44} />
            <span>
              <b>{gearName(id, lang)}</b>
              <small className="why">{t(`pwRec_${rec.role}${k}` as TextKey)}</small>
            </span>
          </button>
        ))}
      </div>
      <h4>{t("pwShopMine")}</h4>
      <div className="pw-shop-mine">
        {v.gear.map((id, k) => (
          <button key={`${id}${k}`} type="button" disabled={!v.open} title={`${gearName(id, lang)}\n${gearLines(id, t).join("\n")}`} onClick={() => send(GROW_MENU.sell + k)}>
            <ItemIcon item={gearItem(id, lang)} size={36} />
          </button>
        ))}
      </div>
      <h4>{t("pwShopUses")}</h4>
      <div className="pw-shop-list">{Object.keys(PW_SHOP_USES).map(card)}</div>
      <h4>{t("pwShopBasic")}</h4>
      <div className="pw-shop-list">{Object.keys(PW_BASIC).map(card)}</div>
      <h4>
        {t("pwShopLegend")} <small>· {t("pwShopRelic")}</small>
      </h4>
      <div className="pw-shop-list">{Object.keys(PW_LEGEND).map(card)}</div>
      {detail && createPortal(<PwShopDetail id={detail} view={v} lang={lang} t={t} onBuy={buy} onClose={() => setDetail(null)} />, document.body)}
    </div>
  );
}
