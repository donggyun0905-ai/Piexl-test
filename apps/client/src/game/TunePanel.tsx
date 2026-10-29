// 추적자 튜닝소 창: 위에 저격총 그림(SniperSvg)이 창 가득, 부위를 누르면 아래에 그 부위 부품 목록 · 강화 단추
// 부품 끼우기 = 골드 · 강화 = 골드 + 확률 (실패하면 한 단계 내려감)
import { menuCode, TUNE, TUNE_OP, TUNE_SLOTS } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { TUNE_PART_NAMES, TUNE_SLOT_NAMES, tuneFxText } from "../i18n/items/station";
import { SniperSvg } from "./SniperSvg";
import type { StationView } from "./stationView";

interface Props {
  view: StationView;
  lang: Lang;
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

export function TunePanel({ view, lang, t, send }: Props) {
  const [picked, setPicked] = useState(-1);
  const slots = view.slots ?? [];
  const cur = slots[picked];
  const def = TUNE_SLOTS[picked];
  const grow = (lv: number) => 1 + TUNE.lvStep * lv;
  return (
    <div className="tune-panel">
      <SniperSvg parts={slots.map((x) => x.part)} levels={slots.map((x) => x.lv)} picked={picked} onPick={setPicked} />
      {!cur || !def ? (
        <p className="bench-hint">{t("tunePick")}</p>
      ) : (
        <div className="tune-detail">
          <b>
            {TUNE_SLOT_NAMES[def.id]?.[lang]} {cur.lv > 0 ? `+${cur.lv}` : ""}
          </b>
          <div className="tune-parts">
            {def.parts.map((part, k) => {
              const on = cur.part === k;
              return (
                <button key={part.id} type="button" className={`tune-part ${on ? "on" : ""}`} disabled={on || view.gold < cur.swapCost} onClick={() => send(menuCode(TUNE_OP.swap, picked, k))}>
                  <span>{TUNE_PART_NAMES[part.id]?.[lang] ?? part.id}</span>
                  <small>{tuneFxText(part.fx, lang, on ? grow(cur.lv) : 1)}</small>
                  <em>{on ? t("tuneOn") : t("tuneEquip").replace("{price}", String(cur.swapCost))}</em>
                </button>
              );
            })}
          </div>
          <button type="button" className="bench-go" disabled={cur.max || view.gold < cur.upCost} onClick={() => send(menuCode(TUNE_OP.up, picked))}>
            {cur.max
              ? t("tuneMax")
              : t("tuneUpBtn")
                  .replace("{lv}", String(cur.lv))
                  .replace("{next}", String(cur.lv + 1))
                  .replace("{chance}", String(Math.round(cur.chance * 100)))
                  .replace("{price}", String(cur.upCost))}
          </button>
          <small className="bench-hint">{t("tuneUpHint")}</small>
        </div>
      )}
    </div>
  );
}
