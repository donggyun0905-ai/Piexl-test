// 작업대 결과 연출 (창 가운데): 성공 = 금빛 빛줄기가 돌며 새 아이템이 떠오름 · 실패 = 회색 연기가 피어오르며 흔들림
// · 파괴 = 아이템이 금이 가 산산조각 나며 파편이 튐 · 단계 하락 = 붉게 번쩍이며 아래로 떨어지는 화살표. 창을 다시 열면 지난 결과는 다시 안 나옴
import { TUNE_SLOTS, type StationResult } from "@pixel-rogue/shared";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { TUNE_SLOT_NAMES } from "../i18n/items/station";
import { ItemIcon } from "./itemIcon";

const SHOW_MS = 1600;
const LABEL: Record<StationResult["ok"], TextKey> = { 0: "stationFail", 1: "stationOk", 2: "stationBreak", 3: "stationDrop" };
const CLASS: Record<StationResult["ok"], string> = { 0: "fail", 1: "ok", 2: "break", 3: "drop" };

export function StationResultFx({ last, lang, t }: { last?: StationResult; lang: Lang; t: (key: TextKey) => string }) {
  // 창을 연 때 이미 있던 결과는 보여 주지 않음
  const seen = useRef(last?.tick ?? -1);
  const [shown, setShown] = useState<StationResult | null>(null);
  useEffect(() => {
    if (!last || last.tick === seen.current) return;
    seen.current = last.tick;
    setShown(last);
    const id = window.setTimeout(() => setShown(null), SHOW_MS);
    return () => window.clearTimeout(id);
  }, [last]);
  if (!shown) return null;
  const slot = shown.slot !== undefined ? TUNE_SLOTS[shown.slot]?.id : undefined;
  return (
    <div className={`station-result ${CLASS[shown.ok]}`} key={shown.tick} aria-live="polite">
      <div className="sr-rays" />
      <div className="sr-item">
        {shown.id ? <ItemIcon item={{ kind: "passive", id: shown.id as never }} size={48} /> : <span className="sr-part">⚙</span>}
        {shown.ok === 2 && (
          <span className="sr-shards">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} style={{ "--a": `${i * 45}deg` } as CSSProperties} />
            ))}
          </span>
        )}
      </div>
      <strong className="sr-label">{t(LABEL[shown.ok])}</strong>
      <small>{shown.id ? itemName("passive", shown.id, lang) : slot ? TUNE_SLOT_NAMES[slot]?.[lang] : ""}</small>
    </div>
  );
}
