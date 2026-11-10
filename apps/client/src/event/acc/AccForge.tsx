// 승급 · 강화 · 재설정 창 (장비창 위에 뜸, Esc는 이 창만 닫음)
// 승급: 대상 고르기 → 재료 고르기 (장착한 것은 재료로 못 씀) · 강화: 5성만, 로비 칩 · 재설정: 추가 능력치 3줄 다시, 1만 칩
import { ACC_RULES, accBase, accOf, canEnhance, enhance, enhanceCost, enhanceRate, isEquipped, promote, promoNeed, reroll, type AccItem } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { addChips, loadChips } from "../../lobby/chips";
import { AccIcon, AccInfo, StatLines } from "./AccParts";
import { accRnd, useAccEsc, useBag } from "./accStore";

type T = (key: TextKey) => string;
export type ForgeMode = "promote" | "enhance" | "reroll";

/** 이 창에서 대상으로 고를 수 있는 것 */
const CAN: Record<ForgeMode, (it: AccItem) => boolean> = {
  promote: (it) => !!promoNeed(it),
  enhance: (it) => it.star >= ACC_RULES.enhanceFrom,
  reroll: () => true,
};
const TITLE: Record<ForgeMode, TextKey> = { promote: "accPromote", enhance: "accEnhance", reroll: "accReroll" };
const HOW: Record<ForgeMode, TextKey> = { promote: "accPromoteHow", enhance: "accEnhanceHow", reroll: "accRerollHow" };

export function AccForge({ t, mode, start, onClose, onChanged }: { t: T; mode: ForgeMode; start: number | null; onClose: () => void; onChanged: () => void }) {
  const [bag, change] = useBag();
  const first = accOf(bag, start);
  const [uid, setUid] = useState<number | null>(first && CAN[mode](first) ? first.uid : null);
  const [mats, setMats] = useState<number[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok: boolean; key: number } | null>(null);
  useAccEsc(onClose);
  const it = accOf(bag, uid);
  const say = (text: string, ok: boolean) => setMsg((m) => ({ text, ok, key: (m?.key ?? 0) + 1 }));
  const pay = (cost: number) => {
    if (loadChips() < cost) return say(t("accNoChips"), false), false;
    addChips(-cost);
    return true;
  };
  const done = (fn: (b: typeof bag) => void) => {
    change(fn);
    onChanged();
  };

  const need = it && mode === "promote" ? promoNeed(it) : null;
  const matList = need ? bag.items.filter((m) => need.ok(m) && !isEquipped(bag, m.uid)) : [];
  const toggle = (m: number) => setMats((l) => (l.includes(m) ? l.filter((x) => x !== m) : need && l.length < need.count ? [...l, m] : l));

  const doPromote = () => {
    if (!it || !need || mats.length !== need.count) return;
    done((b) => promote(b, it.uid, mats));
    setMats([]);
    say(t("accPromoted").replace("{star}", String(it.star + 1)), true);
  };
  const doEnhance = () => {
    if (!it || !canEnhance(it) || !pay(enhanceCost(it.lv))) return;
    let ok = false;
    let lv = 0;
    done((b) => {
      const x = accOf(b, it.uid)!;
      ok = enhance(x, accRnd);
      lv = x.lv;
    });
    say(t(ok ? "accEnhanceOk" : "accEnhanceFail").replace("{lv}", String(lv)), ok);
  };
  const doReroll = () => {
    if (!it || !pay(ACC_RULES.rerollCost)) return;
    done((b) => reroll(accOf(b, it.uid)!, accRnd));
    say(t("accRerollDone"), true);
  };

  return (
    <div className="acc-back forge" onClick={onClose}>
      <div className={`acc-forge ${mode}`} role="dialog" aria-label={t(TITLE[mode])} onClick={(e) => e.stopPropagation()}>
        <header className="acc-top">
          <h2>{t(TITLE[mode])}</h2>
          <span className="acc-chips">🪙 {t("accChips").replace("{n}", loadChips().toLocaleString())}</span>
        </header>
        <p className="acc-how">{t(HOW[mode])}</p>
        <div className="acc-forge-body">
          <div className="acc-forge-pick">
            <div className="acc-grid">
              {bag.items.filter(CAN[mode]).map((x) => (
                <AccIcon key={x.uid} small it={x} on={x.uid === uid} onClick={() => (setUid(x.uid), setMats([]), setMsg(null))} />
              ))}
            </div>
            {bag.items.filter(CAN[mode]).length === 0 && <p className="acc-empty">{t(mode === "promote" ? "accPromoteNo" : mode === "enhance" ? "accEnhanceNo" : "accEmpty")}</p>}
          </div>
          <div className={`acc-anvil${msg ? (msg.ok ? " ok" : " fail") : ""}`} key={msg?.key}>
            {it ? <AccInfo t={t} it={it} /> : <p className="acc-empty">{t("accPick")}</p>}
            {it && mode === "promote" && need && (
              <>
                <h4>{t("accMats").replace("{n}", String(mats.length)).replace("{max}", String(need.count))}</h4>
                <div className="acc-grid mats">
                  {matList.map((m) => (
                    <AccIcon key={m.uid} small it={m} on={mats.includes(m.uid)} onClick={() => toggle(m.uid)} />
                  ))}
                </div>
                <button type="button" className="primary" disabled={mats.length !== need.count} onClick={doPromote}>
                  {t("accPromoteGo")}
                </button>
              </>
            )}
            {it && mode === "enhance" && (
              <>
                {canEnhance(it) ? (
                  <>
                    <div className="acc-next">
                      <span>+{it.lv}</span> → <b>+{it.lv + 1}</b>
                      <StatLines t={t} tot={accBase({ ...it, lv: it.lv + 1 })} />
                    </div>
                    <button type="button" className="primary" onClick={doEnhance}>
                      {t("accEnhanceGo").replace("{cost}", enhanceCost(it.lv).toLocaleString()).replace("{rate}", String(Math.round(enhanceRate(it.lv) * 100)))}
                    </button>
                  </>
                ) : (
                  <p className="acc-empty">{t("accEnhanceMax")}</p>
                )}
              </>
            )}
            {it && mode === "reroll" && (
              <button type="button" className="primary" onClick={doReroll}>
                {t("accRerollGo").replace("{cost}", ACC_RULES.rerollCost.toLocaleString())}
              </button>
            )}
            {msg && <p className={`acc-msg ${msg.ok ? "ok" : "fail"}`}>{msg.text}</p>}
          </div>
        </div>
        <button type="button" className="ghost" onClick={onClose}>
          {t("accClose")}
        </button>
      </div>
    </div>
  );
}
