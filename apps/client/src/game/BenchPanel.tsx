// 아티팩터 거대한 제작대 창: 강화 · 교체 · 튜닝 탭. 내 패시브 카드를 골라 단추를 누름
// 강화 탭은 자기 패시브 하나(강화) 또는 일반 패시브 둘(합치기)을 고름
import { BENCH_OP, menuCode } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { ItemIcon } from "./itemIcon";
import type { StationView } from "./stationView";

const fmt = (v: number) => String(Math.round(v * 100) / 100);
const statKey = (k: string) => `bs${k[0]!.toUpperCase()}${k.slice(1)}` as TextKey;

type Tab = "up" | "swap" | "tune";
const TABS: { tab: Tab; label: TextKey; hint: TextKey }[] = [
  { tab: "up", label: "benchUp", hint: "benchUpHint" },
  { tab: "swap", label: "benchSwap", hint: "benchSwapHint" },
  { tab: "tune", label: "benchTune", hint: "benchTuneHint" },
];

interface Props {
  view: StationView;
  lang: Lang;
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

export function BenchPanel({ view, lang, t, send }: Props) {
  const [tab, setTab] = useState<Tab>("up");
  const [picked, setPicked] = useState<number[]>([]);
  const items = view.items ?? [];
  const costs = view.costs ?? [0, 0, 0, 0];
  // 고른 카드가 없어졌으면(바뀜·부서짐) 다시 고르게
  const sel = picked.filter((i) => items[i]);
  const one = sel.length === 1 ? items[sel[0]!] : undefined;
  const fuse = tab === "up" && sel.length === 2 && sel.every((i) => items[i]!.can[3]);

  const pick = (i: number) => {
    const it = items[i]!;
    // 강화 탭: 일반 패시브는 둘까지 (합치기), 자기 패시브는 하나
    if (tab === "up" && !it.own) {
      const normals = sel.filter((k) => !items[k]!.own);
      setPicked(normals.includes(i) ? normals.filter((k) => k !== i) : [...normals, i].slice(-2));
      return;
    }
    setPicked(sel.length === 1 && sel[0] === i ? [] : [i]);
  };
  const opIndex = tab === "up" ? 0 : tab === "swap" ? 1 : 2;
  const op = tab === "up" ? BENCH_OP.up : tab === "swap" ? BENCH_OP.swap : BENCH_OP.tune;
  const ready = fuse ? view.gold >= costs[3] : !!one && one.can[opIndex] && view.gold >= costs[opIndex];
  const doIt = () => {
    if (!ready) return;
    send(fuse ? menuCode(BENCH_OP.fuse, sel[0]!, sel[1]!) : menuCode(op, sel[0]!));
    setPicked([]);
  };
  const label = fuse ? t("benchFuse").replace("{price}", String(costs[3])) : t("benchDo").replace("{op}", t(TABS[opIndex]!.label)).replace("{price}", String(costs[opIndex]));

  return (
    <div className="bench-panel">
      <nav className="bench-tabs">
        {TABS.map((x) => (
          <button
            key={x.tab}
            type="button"
            className={tab === x.tab ? "on" : ""}
            onClick={() => {
              setTab(x.tab);
              setPicked([]);
            }}
          >
            {t(x.label)}
          </button>
        ))}
      </nav>
      <p className="bench-hint">{t(TABS[opIndex]!.hint)}</p>
      <div className="bench-cards">
        {items.map((it, i) => {
          const usable = tab === "up" ? it.can[0] || it.can[3] : it.can[opIndex];
          return (
            <button
              key={`${i}:${it.id}`}
              type="button"
              disabled={!usable}
              title={itemDesc("passive", it.id, lang, t)}
              className={`bench-card ${it.own ? "own" : ""} ${it.hidden ? "hidden" : ""} ${sel.includes(i) ? "on" : ""}`}
              onClick={() => pick(i)}
            >
              <ItemIcon item={{ kind: "passive", id: it.id }} size={44} />
              <span>{itemName("passive", it.id, lang)}</span>
              <small>
                {it.hidden ? t("benchHidden") : it.own ? t("benchOwn") : ""}
                {it.lv > 0 ? ` ${t("benchLvTag").replace("{lv}", String(it.lv))}` : ""}
              </small>
              {it.stats.length > 0 && (
                <ul className="bench-stats">
                  {it.stats.map(([k, a, b]) => (
                    <li key={k}>
                      {t(statKey(k))} {fmt(a)} → <b>{fmt(b)}</b>
                    </li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>
      <button type="button" className="bench-go" disabled={!ready} onClick={doIt}>
        {sel.length === 0 ? t("benchPick") : label}
      </button>
    </div>
  );
}
