import { NovicePanel, type NoviceView } from "./NovicePanel";
import { SkillButtons } from "./SkillButtons";
import { PwSkillBar, type PwSkillView } from "./PwSkillBar";
import { SellBar } from "./SellBar";
import { HiddenPicker } from "./HiddenPicker";
import { StationWindow } from "./StationWindow";
import type { StationView } from "./stationView";
import type { CharacterId, PassiveId, UseItemId, WeaponId } from "@pixel-rogue/shared";
import { CHAR_DESC } from "../select/charDesc";
import type { Lang, TextKey } from "../i18n";
import { useState, type MouseEvent } from "react";
import { itemDesc, itemName } from "../i18n/items";
import type { Controls } from "./controls";
import { ItemIcon } from "./itemIcon";
import { ItemTip, tipPos, useCloseOutside, type TipPos } from "./ItemTip";
import { keyLabel, useSettings } from "../settings";

export interface LoadoutView {
  weaponId: WeaponId;
  slots: (UseItemId | null)[];
  passives: PassiveId[];
  /** 풋내기 레벨·경험치·스탯 포인트 */
  novice?: NoviceView;
  /** 스킬이 있는 캐릭터(추적자): 스킬마다 남은 대기 0~1 */
  skills?: number[];
  /** 패왕전 스킬 칸 */
  pw?: PwSkillView;
  /** 상점 휴지통 판매 창이 열려 있을 때: 팔면 받는 돈 (sellCodes 순서: 무기 · 사용 아이템 2칸 · 패시브 순서, 0원 = 못 팜) */
  sell?: number[];
  /** 작업대 창이 열려 있을 때 (아티팩터 제작대 · 추적자 튜닝소) */
  station?: StationView;
  /** 히든 아이템 고르는 창 (저주받은 주사위 · 테라포밍) */
  hdPick?: "curse" | "terra";
}

/** PC 사용 아이템 키 표시 (controls의 USE_KEYS와 같게) */

/** 화면 바뀜 판단용 */
export function loadoutKey(v: LoadoutView): string {
  const n = v.novice ? `|${v.novice.lv},${v.novice.exp},${v.novice.points}` : "";
  const pw = v.pw ? `|${v.pw.cds.join(",")}|${v.pw.armed}|${v.pw.silenced}` : "";
  return `${v.weaponId}|${v.slots.join(",")}|${v.passives.join(",")}${n}|${v.skills?.join(",") ?? ""}|${v.sell?.join(",") ?? ""}${pw}|${v.station ? JSON.stringify(v.station) : ""}|${v.hdPick ?? ""}`;
}

interface Props {
  view: LoadoutView;
  /** 로그: 맨 왼쪽 P 칸에 이 캐릭터의 기본 능력 설명 (패왕전은 PwSkillBar의 P) */
  character?: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  touchMode: boolean;
  controls: () => Controls | null;
}

/** 설명 창: 무기 또는 패시브 · 위치 (아이콘 위쪽 가운데) */
type TipItem = { kind: "weapon"; id: WeaponId } | { kind: "passive"; id: PassiveId } | { kind: "base"; id: "base" };
type LoadoutTip = TipPos & TipItem;

function tipAt(item: TipItem, el: HTMLElement): LoadoutTip {
  const r = el.getBoundingClientRect();
  return { ...item, ...tipPos(r.left + r.width / 2, r.top - 4, 0, false) };
}

const BASE: TipItem = { kind: "base", id: "base" };

/** 아래쪽 장비 줄: 무기 · 사용 아이템 2칸 · 패시브. PC는 칸을 눌러도 사용 (Q·E 키와 같음). 모바일은 오른쪽 아래 버튼으로 사용.
 *  무기·패시브 아이콘: PC는 마우스를 올리면, 모바일은 누르면 효과 설명 (다시 누르거나 다른 곳을 누르면 닫힘) */
export function Loadout({ view, character, lang, t, touchMode, controls }: Props) {
  const counts = new Map<PassiveId, number>();
  for (const id of view.passives) counts.set(id, (counts.get(id) ?? 0) + 1);
  const [tip, setTip] = useState<LoadoutTip | null>(null);
  const useKeys = useSettings().useKeys;

  // 모바일: 다른 곳을 누르면 닫기
  useCloseOutside(!!tip && touchMode, ".loadout-passive, .loadout-weapon-icon, .pw-skill-passive", setTip);

  // 가진 무기·패시브가 바뀌어 없어지면 닫기
  const shown = tip && (tip.kind === "base" || (tip.kind === "weapon" ? tip.id === view.weaponId : counts.has(tip.id))) ? tip : null;
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
      {view.sell && <SellBar view={view} lang={lang} t={t} controls={controls} />}
      {view.station && <StationWindow view={view.station} lang={lang} t={t} controls={controls} />}
      {view.hdPick && <HiddenPicker pick={view.hdPick} lang={lang} t={t} controls={controls} />}
      {view.skills && <SkillButtons skills={view.skills} t={t} controls={controls} />}
      {view.pw && <PwSkillBar view={view.pw} t={t} touchMode={touchMode} controls={controls} />}
      {!view.pw && character && (
        <span className={`pw-skill pw-skill-passive ${isOn(BASE) ? "on" : ""}`} {...tipProps(BASE)}>
          P
        </span>
      )}
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
              <kbd>{keyLabel(useKeys[i] ?? "")}</kbd> {id && <ItemIcon item={{ kind: "use", id }} size={20} />} {id ? itemName("use", id, lang) : t("empty")}
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
      {shown?.kind === "base" && character && <ItemTip pos={shown} icon={null} name={t("pwSkPassive")} desc={t(CHAR_DESC[character])} />}
      {shown && shown.kind !== "base" && (
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
