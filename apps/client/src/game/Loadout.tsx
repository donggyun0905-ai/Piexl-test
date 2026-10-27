import { NovicePanel, type NoviceView } from "./NovicePanel";
import { SkillButtons } from "./SkillButtons";
import type { PassiveId, UseItemId, WeaponId } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { useState, type MouseEvent } from "react";
import { itemDesc, itemName } from "../i18n/items";
import type { Controls } from "./controls";
import { ItemIcon } from "./itemIcon";
import { ItemTip, tipPos, useCloseOutside, type TipPos } from "./ItemTip";

export interface LoadoutView {
  weaponId: WeaponId;
  slots: (UseItemId | null)[];
  passives: PassiveId[];
  /** 풋내기 레벨·경험치·스탯 포인트 */
  novice?: NoviceView;
  /** 스킬이 있는 캐릭터(추적자): 스킬마다 남은 대기 0~1 */
  skills?: number[];
}

/** PC 사용 아이템 키 표시 (controls의 USE_KEYS와 같게) */
const USE_KEY_LABELS = ["Q", "E"];

/** 화면 바뀜 판단용 */
export function loadoutKey(v: LoadoutView): string {
  const n = v.novice ? `|${v.novice.lv},${v.novice.exp},${v.novice.points}` : "";
  return `${v.weaponId}|${v.slots.join(",")}|${v.passives.join(",")}${n}|${v.skills?.join(",") ?? ""}`;
}

interface Props {
  view: LoadoutView;
  lang: Lang;
  t: (key: TextKey) => string;
  touchMode: boolean;
  controls: () => Controls | null;
}

/** 설명 창: 무기 또는 패시브 · 위치 (아이콘 위쪽 가운데) */
type TipItem = { kind: "weapon"; id: WeaponId } | { kind: "passive"; id: PassiveId };
type LoadoutTip = TipPos & TipItem;

function tipAt(item: TipItem, el: HTMLElement): LoadoutTip {
  const r = el.getBoundingClientRect();
  return { ...item, ...tipPos(r.left + r.width / 2, r.top - 4, 0, false) };
}

/** 아래쪽 장비 줄: 무기 · 사용 아이템 2칸 · 패시브. PC는 칸을 눌러도 사용 (Q·E 키와 같음). 모바일은 오른쪽 아래 버튼으로 사용.
 *  무기·패시브 아이콘: PC는 마우스를 올리면, 모바일은 누르면 효과 설명 (다시 누르거나 다른 곳을 누르면 닫힘) */
export function Loadout({ view, lang, t, touchMode, controls }: Props) {
  const counts = new Map<PassiveId, number>();
  for (const id of view.passives) counts.set(id, (counts.get(id) ?? 0) + 1);
  const [tip, setTip] = useState<LoadoutTip | null>(null);

  // 모바일: 다른 곳을 누르면 닫기
  useCloseOutside(!!tip && touchMode, ".loadout-passive, .loadout-weapon-icon", setTip);

  // 가진 무기·패시브가 바뀌어 없어지면 닫기
  const shown = tip && (tip.kind === "weapon" ? tip.id === view.weaponId : counts.has(tip.id)) ? tip : null;
  const isOn = (item: TipItem) => shown?.kind === item.kind && shown.id === item.id;
  /** PC는 올리면, 모바일은 누르면 설명 */
  const tipProps = (item: TipItem) => ({
    onMouseEnter: (e: MouseEvent<HTMLElement>) => !touchMode && setTip(tipAt(item, e.currentTarget)),
    onMouseLeave: () => !touchMode && setTip(null),
    onClick: (e: MouseEvent<HTMLElement>) => touchMode && setTip(isOn(item) ? null : tipAt(item, e.currentTarget)),
  });
  const weapon: TipItem = { kind: "weapon", id: view.weaponId };

  return (
    <div className="loadout">
      {view.novice && <NovicePanel view={view.novice} t={t} controls={controls} />}
      {view.skills && <SkillButtons skills={view.skills} t={t} controls={controls} />}
      <span className="loadout-weapon">
        {t("weapon")}:{" "}
        <span className={`loadout-weapon-icon ${isOn(weapon) ? "on" : ""}`} {...tipProps(weapon)}>
          <ItemIcon item={weapon} size={24} />
        </span>{" "}
        <strong>{itemName("weapon", view.weaponId, lang)}</strong>
      </span>
      {!touchMode && (
        <span className="loadout-slots" aria-label={t("item")}>
          {view.slots.map((id, i) => (
            <button
              key={i}
              type="button"
              className={`slot ${id ? "filled" : ""}`}
              disabled={!id}
              onClick={() => controls()?.queueUse(i + 1)}
            >
              <kbd>{USE_KEY_LABELS[i]}</kbd> {id && <ItemIcon item={{ kind: "use", id }} size={20} />} {id ? itemName("use", id, lang) : t("empty")}
            </button>
          ))}
        </span>
      )}
      {counts.size > 0 && (
        <span className="loadout-passives">
          {t("passives")}:{" "}
          {[...counts].map(([id, n]) => (
            <span
              key={id}
              className={`loadout-passive ${isOn({ kind: "passive", id }) ? "on" : ""}`}
              aria-label={itemName("passive", id, lang)}
              {...tipProps({ kind: "passive", id })}
            >
              <ItemIcon item={{ kind: "passive", id }} size={22} />
              {n > 1 && <b>×{n}</b>}
            </span>
          ))}
        </span>
      )}
      {shown && (
        <ItemTip
          pos={shown}
          icon={shown.kind === "weapon" ? { kind: "weapon", id: shown.id } : { kind: "passive", id: shown.id }}
          name={<>{itemName(shown.kind, shown.id, lang)}{shown.kind === "passive" && (counts.get(shown.id) ?? 1) > 1 && ` ×${counts.get(shown.id)}`}</>}
          desc={itemDesc(shown.kind, shown.id, lang, t)}
        />
      )}
    </div>
  );
}
