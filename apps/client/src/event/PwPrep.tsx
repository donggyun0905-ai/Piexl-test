// 패왕전 준비방: 무기 1개 · 패시브 10개(여러 번 가질 수 있는 것은 겹쳐서) · 사용 아이템 2개 고르기 (연습장 아이템 칸을 그대로 씀)
import { CHARACTERS, characterWeapons, PASSIVES, PW, pwCanStack, pwPassiveChoices, pwStackMax, USE_ITEM_IDS, type CharacterId, type PassiveDef, type PassiveId, type PwLoadout, type UseItemId, type WeaponId } from "@pixel-rogue/shared";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ItemIcon, type IconItem } from "../game/itemIcon";
import { ItemTip, tipPos, useCloseOutside, type TipPos } from "../game/ItemTip";
import { PracticeItems } from "../game/practice/PracticeItems";
import type { Group } from "../game/practice/practiceGroups";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";

interface Props {
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onStart: (lo: PwLoadout) => void;
  onBack: () => void;
}

type Tab = "weapon" | "passive" | "use";
type Tip = { item: IconItem } & TipPos;

function groupsFor(tab: Tab, c: CharacterId, weapon: WeaponId): Group<IconItem>[] {
  if (tab === "weapon") return [{ key: "mine", title: "practiceUsable", who: c, open: true, list: characterWeapons(c).map((id) => ({ kind: "weapon", id })) }];
  if (tab === "use") return [{ key: "use", title: "practiceUse", open: true, list: USE_ITEM_IDS.map((id) => ({ kind: "use", id })) }];
  const all = pwPassiveChoices(c, weapon);
  const own = all.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === c);
  const groups: Group<IconItem>[] = [];
  if (own.length) groups.push({ key: "mine", title: "practiceOnly", who: c, open: true, list: own.map((id) => ({ kind: "passive", id })) });
  groups.push({ key: "common", title: "practiceCommon", open: true, list: all.filter((id) => !own.includes(id)).map((id) => ({ kind: "passive", id })) });
  return groups;
}

export function PwPrep({ characterId, lang, t, onStart, onBack }: Props) {
  const [lo, setLo] = useState<PwLoadout>({ weapon: CHARACTERS[characterId].startWeapon, passives: [], uses: [] });
  const [tab, setTab] = useState<Tab>("weapon");
  const [query, setQuery] = useState("");
  const [tip, setTip] = useState<Tip | null>(null);
  const [note, setNote] = useState("");
  useCloseOutside(!!tip, ".practice-item", setTip, true);
  const groups = useMemo(() => groupsFor(tab, characterId, lo.weapon), [tab, characterId, lo.weapon]);

  const owned = (it: IconItem) =>
    it.kind === "weapon" ? (it.id === lo.weapon ? 1 : 0) : it.kind === "passive" ? lo.passives.filter((id) => id === it.id).length : lo.uses.filter((id) => id === it.id).length;

  const give = (it: IconItem) => {
    setNote("");
    if (it.kind === "weapon") {
      const weapon = it.id as WeaponId;
      // 무기를 바꾸면 그 무기에서 못 쓰는 패시브(무기 전용)는 뺌
      const ok = pwPassiveChoices(characterId, weapon);
      return setLo({ ...lo, weapon, passives: lo.passives.filter((id) => ok.includes(id)) });
    }
    if (it.kind === "passive") {
      const id = it.id as PassiveId;
      // 같은 패시브는 3개까지 (효과 아이템은 하나)
      const max = pwStackMax(id);
      if (lo.passives.length >= PW.passives) return setNote(t("pwFull"));
      if (lo.passives.filter((x) => x === id).length >= max) return setNote(t(max === 1 ? "practiceOnce" : "pwMax3"));
      return setLo({ ...lo, passives: [...lo.passives, id] });
    }
    if (lo.uses.length >= PW.uses) return setNote(t("pwFull"));
    // 사용 아이템은 서로 다른 것만
    if (lo.uses.includes(it.id as UseItemId)) return setNote(t("pwUseDiff"));
    setLo({ ...lo, uses: [...lo.uses, it.id as UseItemId] });
  };

  const remove = (it: IconItem) => {
    const drop = <T,>(list: T[], id: T) => {
      const i = list.lastIndexOf(id);
      return i < 0 ? list : [...list.slice(0, i), ...list.slice(i + 1)];
    };
    if (it.kind === "passive") setLo({ ...lo, passives: drop(lo.passives, it.id as PassiveId) });
    else if (it.kind === "use") setLo({ ...lo, uses: drop(lo.uses, it.id as UseItemId) });
  };

  const onTip = (item: IconItem | null, e?: ReactPointerEvent<HTMLElement>) => {
    if (!item || !e) return setTip(null);
    if (e.pointerType === "mouse") return setTip({ item, ...tipPos(e.clientX, e.clientY - 14, e.clientY + 22) });
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ item, ...tipPos(r.left + r.width / 2, r.top - 4, r.bottom + 4) });
  };

  const tabs: [Tab, string][] = [
    ["weapon", t("pwWeapon")],
    ["passive", t("pwPassives").replace("{n}", String(lo.passives.length)).replace("{max}", String(PW.passives))],
    ["use", t("pwUses").replace("{n}", String(lo.uses.length)).replace("{max}", String(PW.uses))],
  ];
  const chosen: IconItem[] = [{ kind: "weapon", id: lo.weapon }, ...lo.passives.map((id): IconItem => ({ kind: "passive", id })), ...lo.uses.map((id): IconItem => ({ kind: "use", id }))];

  return (
    <div className="pw-prep">
      <h2>
        {t("pwPrep")} · {t(characterId)}
      </h2>
      <p className="hint">{t("pwPrepHint").replace("{p}", String(PW.passives)).replace("{u}", String(PW.uses))}</p>
      <div className="pw-chosen">
        {chosen.map((it, i) => (
          <span key={`${it.kind}${it.id}${i}`} className={`pw-chosen-slot ${it.kind}`} title={itemName(it.kind, it.id, lang)}>
            <ItemIcon item={it} size={24} />
          </span>
        ))}
      </div>
      <div className="practice-row tabs">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" className={id === tab ? "on" : ""} onClick={() => (setTab(id), setTip(null))}>
            {label}
          </button>
        ))}
      </div>
      {tab === "passive" && <input className="practice-search" type="search" value={query} placeholder={t("practiceSearch")} onChange={(e) => setQuery(e.target.value)} />}
      <div className="practice-list pw-prep-list">
        <PracticeItems groups={groups} query={tab === "passive" ? query : ""} lang={lang} t={t} owned={owned} onGive={give} onRemove={remove} onTip={onTip} />
      </div>
      {note && <p className="pw-note">{note}</p>}
      <div className="modal-actions">
        <button type="button" className="ghost" onClick={onBack}>
          {t("back")}
        </button>
        <button type="button" className="ghost" onClick={() => setLo({ ...lo, passives: [], uses: [] })}>
          {t("pwEmpty")}
        </button>
        <button type="button" onClick={() => onStart(lo)}>
          {t("pwStart")}
        </button>
      </div>
      {tip && (
        <ItemTip pos={tip} icon={tip.item} name={itemName(tip.item.kind, tip.item.id, lang)} desc={itemDesc(tip.item.kind, tip.item.id, lang, t)}>
          {tip.item.kind === "passive" && <small className="practice-tip-stack">{t(pwCanStack(tip.item.id as PassiveId) ? "pwMax3" : "practiceOnce")}</small>}
        </ItemTip>
      )}
    </div>
  );
}
