// 기간토마키아 창: 상자 창(누르면 고르고, Shift+누르기·가져가기로 배낭에 · Esc 닫기) · 배낭 창(B: 금고 넣고 빼기·버리기 · 조합대에서 전설 장비 제작)
// 누른 것은 controls.queueMenu → 입력 menu → sim/pwGiga.gigaMenu
import { GIGA_MENU, PW_LEGEND, type PlayerState, type PwLoot } from "@pixel-rogue/shared";
import { useState, type MouseEvent } from "react";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { gearItem, gearLines, gearName } from "./pwGearView";

type Send = (code: number) => void;
const LEGENDS = Object.keys(PW_LEGEND);

/** 물건 이름 · 설명 · 그림 (장비 · u: 사용 아이템 · g: 상점 물건) */
function info(id: string, lang: Lang, t: (k: TextKey) => string) {
  if (id.startsWith("g:")) return { name: t(`pwGoods_${id.slice(2)}` as TextKey), desc: t("pwGigaGoodsDesc"), icon: null };
  if (id.startsWith("u:")) return { name: itemName("use", id.slice(2), lang), desc: t("pwGigaUseDesc"), icon: { kind: "use", id: id.slice(2) } as never };
  return { name: gearName(id, lang), desc: gearLines(id, t).join(" · "), icon: gearItem(id, lang) };
}

function Cell({ id, lang, t, on, onClick }: { id: string; lang: Lang; t: (k: TextKey) => string; on?: boolean; onClick: (e: MouseEvent) => void }) {
  const it = info(id, lang, t);
  return (
    <button type="button" className={`pw-gw-cell${on ? " on" : ""}${PW_LEGEND[id] ? " legend" : ""}`} onClick={onClick} title={`${it.name}\n${it.desc}`}>
      {it.icon ? <ItemIcon item={it.icon} size={36} /> : <span className="pw-gw-goods">🎁</span>}
      <small>{it.name}</small>
    </button>
  );
}

export function GigaBox({ loot, full, lang, t, send, onClose }: { loot: PwLoot; full: boolean; lang: Lang; t: (k: TextKey) => string; send: Send; onClose: () => void }) {
  const [sel, setSel] = useState(0);
  const take = (k: number) => send(GIGA_MENU.take + k);
  const pick = loot.items[sel] ?? loot.items[0];
  const it = pick ? info(pick, lang, t) : null;
  return (
    <div className="pw-gw box" role="dialog" aria-label={t("pwGigaBox")}>
      <header>
        <b>{t("pwGigaBox")}</b>
        <small>{t("pwGigaBoxHint")}</small>
        <button type="button" className="ghost" onClick={onClose}>
          ✕
        </button>
      </header>
      <div className="pw-gw-grid">
        {loot.items.map((id, k) => (
          <Cell key={`${id}${k}`} id={id} lang={lang} t={t} on={k === sel} onClick={(e) => (e.shiftKey ? take(k) : setSel(k))} />
        ))}
      </div>
      {it && (
        <div className="pw-gw-info">
          <b>{it.name}</b>
          <small>{it.desc}</small>
        </div>
      )}
      {full && <p className="pw-shop-away">{t("pwGigaFull")}</p>}
      <div className="pw-gw-act">
        <button type="button" className="primary" disabled={!pick || full} onClick={() => take(Math.min(sel, loot.items.length - 1))}>
          {t("pwGigaTake")}
        </button>
        <button type="button" disabled={full} onClick={() => loot.items.forEach((_, k) => take(loot.items.length - 1 - k))}>
          {t("pwGigaTakeAll")}
        </button>
      </div>
    </div>
  );
}

export function GigaBag({ p, craft, gold, lang, t, send, onClose }: { p: PlayerState; craft: string[]; gold: number; lang: Lang; t: (k: TextKey) => string; send: Send; onClose: () => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const bag = p.pwBag ?? [];
  const id = sel === 99 ? p.pwVault : sel !== null ? bag[sel] : undefined;
  const it = id ? info(id, lang, t) : null;
  const have = new Map<string, number>();
  for (const x of bag) have.set(x, (have.get(x) ?? 0) + 1);
  return (
    <div className="pw-gw bag" role="dialog" aria-label={t("pwGigaBag")}>
      <header>
        <b>{t("pwGigaBag")}</b>
        <span className="pw-shop-gold">🪙 {gold}</span>
        <small>{t("pwGigaBagHint")}</small>
        <button type="button" className="ghost" onClick={onClose}>
          ✕
        </button>
      </header>
      <div className="pw-gw-grid bag-grid">
        <div className={`pw-gw-slot vault${sel === 99 ? " on" : ""}`} title={t("pwGigaVault")}>
          <em className="pw-gw-tag">🔒 {t("pwGigaVaultTag")}</em>
          {p.pwVault ? <Cell id={p.pwVault} lang={lang} t={t} on={sel === 99} onClick={() => setSel(99)} /> : <span className="pw-gw-empty" />}
        </div>
        {Array.from({ length: 9 }, (_, k) => (
          <div key={k} className="pw-gw-slot">
            {bag[k] ? <Cell id={bag[k]!} lang={lang} t={t} on={sel === k} onClick={(e) => (e.shiftKey ? send(GIGA_MENU.vault + k) : setSel(k))} /> : <span className="pw-gw-empty" />}
          </div>
        ))}
      </div>
      <p className="pw-gw-note">{t("pwGigaVault")}</p>
      {it && id && (
        <div className="pw-gw-info">
          <b>{it.name}</b>
          <small>{it.desc}</small>
          <span className="pw-gw-act">
            <button type="button" onClick={() => (send(GIGA_MENU.vault + (sel === 99 ? bag.length : sel!)), setSel(null))}>
              {t(sel === 99 ? "pwGigaFromVault" : "pwGigaToVault")}
            </button>
            <button type="button" className="danger" onClick={() => (send(GIGA_MENU.drop + sel!), setSel(null))}>
              {t("pwGigaDrop")}
            </button>
          </span>
        </div>
      )}
      <h4>🔨 {t("pwGigaCraftTable")}</h4>
      <div className="pw-gw-craft">
        {LEGENDS.map((lid) => {
          const leg = PW_LEGEND[lid]!;
          const ok = craft.includes(lid);
          const need = Object.entries(leg.need ?? {});
          return (
            <button key={lid} type="button" className={`pw-shop-item legend${ok ? "" : " dim"}`} disabled={!ok || !!p.pwCraft} onClick={() => (send(GIGA_MENU.craft + LEGENDS.indexOf(lid)), onClose())}>
              <ItemIcon item={gearItem(lid, lang)} size={32} />
              <span>
                <b>{gearName(lid, lang)}</b>
                <small>
                  {need.map(([m, n]) => `${(have.get(m) ?? 0) >= n ? "✓" : "·"} ${gearName(m, lang)}${n > 1 ? ` ×${n}` : ""}`).join("  ")}
                </small>
              </span>
              <em>🪙 {leg.cost}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
