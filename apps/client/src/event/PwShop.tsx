// 패왕전 집 상점 창 (쟁탈전 · 전쟁의 서막): 사용 아이템 · 기본 장비 · 전설 장비(가진 재료를 쓰고 모자란 재료 값은 더 냄) · 내 장비 팔기
// 누른 것은 controls.queueMenu → 입력 menu → sim/pwGrow.growMenu (집에서만 삼)
import { atHome, buyPlan, fullCost, GROW_MENU, PW_BASIC, PW_LEGEND, PW_SHOP_IDS, PW_SHOP_USES, pwGearDef, useSeat, type PwGearStat, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { ItemIcon } from "../game/itemIcon";
import type { Controls } from "../game/controls";

const PCT = new Set(["dmgMul", "rate", "rangeMul", "shot", "crit", "critDmg", "dashCut", "skillDmg", "skillHeal"]);

/** 장비 능력치 글 (한 줄씩) + 전설 특수 효과 */
export function gearLines(id: string, t: (k: TextKey) => string): string[] {
  const d = pwGearDef(id);
  if (!d) return [];
  const out = Object.entries(d as PwGearStat)
    .filter(([k, v]) => typeof v === "number" && k !== "cost" && v !== 0)
    .map(([k, v]) => t(`pwSt_${k}` as TextKey).replace("{n}", PCT.has(k) ? String(Math.round(v * 100)) : k === "move" ? `${v > 0 ? "+" : ""}${v}` : String(v)));
  if (PW_LEGEND[id]) out.push(t(`pwFx_${id}` as TextKey));
  return out;
}

interface Props {
  run: RunState;
  me: number;
  lang: Lang;
  t: (k: TextKey) => string;
  controls: () => Controls | null;
  onClose: () => void;
}

export function PwShop({ run, me, lang, t, controls, onClose }: Props) {
  // 살 수 있는지 계산은 내 자리를 꺼내 놓고 (보던 자리로 돌려놓음)
  const back = run.seat ?? 0;
  useSeat(run, me);
  const home = atHome(run, me);
  const gold = run.gold;
  const p = run.player;
  const plans = new Map(PW_SHOP_IDS.map((id) => [id, buyPlan(run, id)]));
  useSeat(run, back);
  const send = (code: number) => controls()?.queueMenu(code);
  const card = (id: string) => {
    const use = PW_SHOP_USES[id as keyof typeof PW_SHOP_USES] !== undefined;
    const plan = plans.get(id);
    const cost = plan?.cost ?? fullCost(id);
    const need = Object.entries(PW_LEGEND[id]?.need ?? {});
    return (
      <button key={id} type="button" className="pw-shop-item" disabled={!home || !plan || gold < cost} onClick={() => send(GROW_MENU.buy + PW_SHOP_IDS.indexOf(id))}>
        <ItemIcon item={{ kind: use ? "use" : "passive", id } as never} size={28} />
        <span>
          <b>{itemName(use ? "use" : "passive", id, lang)}</b>
          <small>{use ? "" : gearLines(id, t).join(" · ")}</small>
          {need.length > 0 && (
            <small className="pw-shop-need">
              {t("pwShopNeed")}: {need.map(([m, n]) => `${itemName("passive", m, lang)}${n > 1 ? ` ×${n}` : ""}`).join(" + ")}
            </small>
          )}
        </span>
        <em>{cost}</em>
      </button>
    );
  };
  return (
    <div className="pw-shop" role="dialog" aria-label={t("pwShopTitle")}>
      <header>
        <b>{t("pwShopTitle")}</b>
        <span className="pw-shop-gold">🪙 {t("pwGrowGold").replace("{n}", String(gold))}</span>
        <button type="button" className="ghost" onClick={onClose}>
          ✕
        </button>
      </header>
      {!home && <p className="pw-shop-away">{t("pwShopAway")}</p>}
      <h4>{t("pwShopMine")}</h4>
      <div className="pw-shop-mine">
        {(p.pwGear ?? []).map((id, k) => (
          <button key={`${id}${k}`} type="button" disabled={!home} title={gearLines(id, t).join("\n")} onClick={() => send(GROW_MENU.sell + k)}>
            <ItemIcon item={{ kind: "passive", id } as never} size={24} />
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
    </div>
  );
}
