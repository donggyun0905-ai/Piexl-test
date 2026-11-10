// 장비창 (레이드 창의 '장비창' 버튼): 반지 3·목걸이·귀걸이·브로치 칸(점선, 무엇을 끼는 칸인지 글자) · 가진 장신구 · 자세히 · 합계 · 세트
// 위쪽 승급·강화·재설정 버튼 → AccForge 창. Esc·바깥 누르면 닫힘
import { ACC_SLOTS, accOf, accTotals, canEquip, equip, equipped, isEquipped, setCounts, type AccItem } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../../i18n";
import { loadChips } from "../../lobby/chips";
import { AccForge, type ForgeMode } from "./AccForge";
import { AccIcon, AccInfo, SetInfo, StatLines } from "./AccParts";
import { iconStyle, useAccEsc, useBag } from "./accStore";

type T = (key: TextKey) => string;
const order = (a: AccItem, b: AccItem) => (b.legend !== undefined ? 1 : 0) - (a.legend !== undefined ? 1 : 0) || b.star - a.star || b.lv - a.lv || a.kind.localeCompare(b.kind) || a.set - b.set;

export function AccWindow({ t, onClose }: { t: T; onClose: () => void }) {
  const [bag, change] = useBag();
  const [pick, setPick] = useState<number | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [forge, setForge] = useState<ForgeMode | null>(null);
  const [note, setNote] = useState("");
  useAccEsc(onClose);
  const it = accOf(bag, pick);
  const worn = equipped(bag);
  const counts = setCounts(worn);
  const sets = counts.map((n, i) => ({ n, i })).filter((x) => x.n > 0);
  const kindTag = (k: string) => t(`accKind_${k}` as TextKey);

  /** 칸을 누름: 낀 것이 있으면 고르기 · 비었으면 이 칸에 낄 준비 */
  const onSlot = (i: number) => {
    const u = bag.slots[i];
    setSlot(i);
    setPick(u ?? null);
    setNote("");
  };
  const wear = () => {
    if (!it) return;
    const free = ACC_SLOTS.findIndex((k, i) => k === it.kind && bag.slots[i] === null);
    const at = slot !== null && ACC_SLOTS[slot] === it.kind ? slot : free >= 0 ? free : ACC_SLOTS.indexOf(it.kind);
    if (!canEquip(bag, at, it.uid)) return setNote(t("accSameEquipped"));
    change((b) => equip(b, at, it.uid));
    setNote("");
  };
  const takeOff = () => it && change((b) => equip(b, b.slots.indexOf(it.uid), null));
  const legSet = (set: number) => it && change((b) => (accOf(b, it.uid)!.legSet = set));

  return (
    <div className="acc-back" onClick={onClose}>
      <div className="acc-win" role="dialog" aria-label={t("accGear")} onClick={(e) => e.stopPropagation()}>
        <header className="acc-top">
          <div>
            <h2>{t("accGear")}</h2>
            <small>{t("accGearSub")}</small>
          </div>
          <div className="acc-tools">
            <span className="acc-chips">🪙 {t("accChips").replace("{n}", loadChips().toLocaleString())}</span>
            <button type="button" className="acc-tool promote" onClick={() => setForge("promote")}>
              ⬆ {t("accPromote")}
            </button>
            <button type="button" className="acc-tool enhance" onClick={() => setForge("enhance")}>
              ✦ {t("accEnhance")}
            </button>
            <button type="button" className="acc-tool reroll" onClick={() => setForge("reroll")}>
              ⟳ {t("accReroll")}
            </button>
            <button type="button" className="ghost" onClick={onClose}>
              {t("accClose")}
            </button>
          </div>
        </header>
        <div className="acc-body">
          <section className="acc-left">
            <div className="acc-slots">
              {ACC_SLOTS.map((k, i) => {
                const w = accOf(bag, bag.slots[i]);
                return (
                  <button key={i} type="button" className={`acc-slot ${k}${slot === i ? " sel" : ""}${w ? ` full s${w.star}` : ""}${w?.legend !== undefined ? " leg" : ""}`} onClick={() => onSlot(i)}>
                    {w ? <i style={iconStyle(w)} /> : <span>{kindTag(k)}</span>}
                    {w && w.lv > 0 && <b className="acc-lv">+{w.lv}</b>}
                    <small>{kindTag(k)}</small>
                  </button>
                );
              })}
            </div>
            <h4>{t("accTotal")}</h4>
            <StatLines t={t} tot={accTotals(worn)} />
            {sets.map((x) => (
              <SetInfo key={x.i} t={t} set={x.i} have={x.n} />
            ))}
          </section>
          <section className="acc-mid">
            <h4>{t("accBag")} ({bag.items.length})</h4>
            {bag.items.length === 0 && <p className="acc-empty">{t("accEmpty")}</p>}
            <div className="acc-grid">
              {[...bag.items].sort(order).map((x) => (
                <AccIcon key={x.uid} it={x} on={x.uid === pick} dim={slot !== null && ACC_SLOTS[slot] !== x.kind} onClick={() => (setPick(x.uid), setNote(""))} />
              ))}
            </div>
          </section>
          <section className="acc-right">
            {it ? (
              <>
                <AccInfo t={t} it={it} />
                {it.legend !== undefined && (
                  <div className="acc-legset">
                    <small>{t("accLegSet")}</small>
                    <div>
                      {counts.map((n, i) => (n > 0 && worn.some((w) => w.set === i) ? i : -1)).filter((i) => i >= 0).map((i) => (
                        <button key={i} type="button" className={it.legSet === i ? "on" : ""} onClick={() => legSet(i)}>
                          {t(`accSet${i}` as TextKey)}
                        </button>
                      ))}
                    </div>
                    {!worn.some((w) => w.set >= 0) && <small>{t("accLegNone")}</small>}
                  </div>
                )}
                <div className="acc-actions">
                  {isEquipped(bag, it.uid) ? (
                    <button type="button" onClick={takeOff}>
                      {t("accUnequip")}
                    </button>
                  ) : (
                    <button type="button" className="primary" onClick={wear}>
                      {t("accEquip")}
                    </button>
                  )}
                </div>
                {note && <p className="acc-note">{note}</p>}
              </>
            ) : (
              <p className="acc-empty">{t("accPick")}</p>
            )}
          </section>
        </div>
        {forge && <AccForge t={t} mode={forge} start={pick} onClose={() => setForge(null)} onChanged={() => change(() => {})} />}
      </div>
    </div>
  );
}
