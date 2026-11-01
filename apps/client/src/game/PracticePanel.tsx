// 연습장 도구: 캐릭터 바꾸기 · 묶음별 아이템(찾기, 여러 번 얻기·하나 빼기) · 세기 고르고 적 부르기 · 방 시험(상점·단련의 방 등) · 초기화
import {
  ALL_CHARACTER_IDS,
  practiceCanStack,
  practiceClearEnemies,
  practiceGive,
  practiceRemovePassive,
  practiceRemoveUse,
  practiceReset,
  practiceRoom,
  practiceRoomOff,
  practiceSetFloor,
  practiceSpawn,
  practiceToggleDummy,
  type CharacterId,
  type RunState,
} from "@pixel-rogue/shared";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import type { IconItem } from "./itemIcon";
import { ItemTip, tipPos, useCloseOutside, type TipPos } from "./ItemTip";
import type { LoadoutView } from "./Loadout";
import { PracticeEnemies } from "./practice/PracticeEnemies";
import { passiveGroups, useGroups, weaponGroups } from "./practice/practiceGroups";
import { PracticeItems } from "./practice/PracticeItems";
import { PracticeRooms } from "./practice/PracticeRooms";

type Tab = "weapon" | "passive" | "use" | "enemy" | "room";

const TABS: { id: Tab; label: TextKey }[] = [
  { id: "weapon", label: "practiceWeapons" },
  { id: "passive", label: "practicePassives" },
  { id: "use", label: "practiceUse" },
  { id: "enemy", label: "practiceEnemies" },
  { id: "room", label: "practiceRooms" },
];

/** 아이템 설명 창 위치. PC는 마우스 위쪽, 모바일은 누른 칸 위쪽 (위가 좁으면 아래쪽) */
type PracticeTip = TipPos & { item: IconItem };

interface Props {
  run: () => RunState | null;
  loadout: LoadoutView | null;
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onCharacter: (id: CharacterId) => void;
}

export function PracticePanel({ run, loadout, characterId, lang, t, onCharacter }: Props) {
  const [tab, setTab] = useState<Tab>("weapon");
  const [open, setOpen] = useState(true);
  const [dummyOn, setDummyOn] = useState(true);
  const [tip, setTip] = useState<PracticeTip | null>(null);
  const [query, setQuery] = useState("");
  const [floor, setFloor] = useState(() => run()?.floor ?? 1);

  // 모바일: 아이템 칸 말고 다른 곳을 누르면 닫기
  useCloseOutside(!!tip, ".practice-item", setTip, true);

  const groups = useMemo(
    () => (tab === "weapon" ? weaponGroups(characterId) : tab === "passive" ? passiveGroups(characterId) : tab === "use" ? useGroups() : []),
    [tab, characterId],
  );

  const owned = (item: IconItem): number => {
    if (!loadout) return 0;
    if (item.kind === "weapon") return loadout.weaponId === item.id ? 1 : 0;
    if (item.kind === "use") return loadout.slots.filter((s) => s === item.id).length;
    return loadout.passives.filter((p) => p === item.id).length;
  };

  // 누르면 얻음: 여러 번 가질 수 있는 패시브는 하나 더, 한 번만 가질 수 있는 것은 가졌으면 뺌
  const give = (item: IconItem) => {
    const r = run();
    if (!r) return;
    if (item.kind === "passive" && owned(item) > 0 && !practiceCanStack(item.id)) practiceRemovePassive(r, item.id);
    else practiceGive(r, item);
  };
  const remove = (item: IconItem) => {
    const r = run();
    if (!r) return;
    if (item.kind === "passive") practiceRemovePassive(r, item.id);
    else if (item.kind === "use") practiceRemoveUse(r, item.id);
  };

  // PC: 마우스를 따라감 · 모바일: 누른 칸 위에 띄움 (누르면 아이템도 그대로 얻음)
  const onTip = (item: IconItem | null, e?: ReactPointerEvent<HTMLElement>) => {
    if (!item || !e) return setTip(null);
    if (e.pointerType === "mouse") return setTip({ item, ...tipPos(e.clientX, e.clientY - 14, e.clientY + 22) });
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ item, ...tipPos(r.left + r.width / 2, r.top - 4, r.bottom + 4) });
  };

  const chooseFloor = (f: number) => {
    const r = run();
    if (!r) return;
    practiceSetFloor(r, f);
    setFloor(r.floor);
  };

  if (!open) {
    return (
      <button type="button" className="practice-toggle" onClick={() => setOpen(true)}>
        {t("practicePanel")}
      </button>
    );
  }

  const n = tip ? owned(tip.item) : 0;
  const stack = tip?.item.kind === "passive" ? (practiceCanStack(tip.item.id) ? t("practiceStack") : t("practiceOnce")) : "";
  return (
    <aside className="practice-panel" aria-label={t("practicePanel")}>
      <div className="practice-head">
        <strong>{t("practicePanel")}</strong>
        <button type="button" onClick={() => (setOpen(false), setTip(null))} aria-label="close">
          ✕
        </button>
      </div>
      <details className="practice-chars">
        <summary>
          {t("practiceChar")}: <b>{t(characterId)}</b>
        </summary>
        <div className="practice-char-grid">
          {ALL_CHARACTER_IDS.map((id) => (
            <button key={id} type="button" className={id === characterId ? "on" : ""} onClick={() => onCharacter(id)}>
              {t(id)}
            </button>
          ))}
        </div>
      </details>
      <div className="practice-row">
        <button type="button" onClick={() => practiceReset(run()!)}>
          {t("practiceReset")}
        </button>
        <button type="button" onClick={() => practiceClearEnemies(run()!)}>
          {t("practiceClear")}
        </button>
        <button type="button" className={dummyOn ? "on" : ""} onClick={() => run() && setDummyOn(practiceToggleDummy(run()!))}>
          {t("enemyDummy")} {dummyOn ? t("on") : t("off")}
        </button>
      </div>
      <div className="practice-row tabs">
        {TABS.map((x) => (
          <button key={x.id} type="button" className={x.id === tab ? "on" : ""} onClick={() => (setTab(x.id), setTip(null))}>
            {t(x.label)}
          </button>
        ))}
      </div>
      {tab !== "enemy" && tab !== "room" && (
        <input className="practice-search" type="search" value={query} placeholder={t("practiceSearch")} onChange={(e) => setQuery(e.target.value)} />
      )}
      <div className="practice-list">
        {tab === "room" ? (
          <PracticeRooms t={t} onRoom={(k) => run() && (k ? practiceRoom(run()!, k) : practiceRoomOff(run()!))} />
        ) : tab === "enemy" ? (
          <PracticeEnemies floor={floor} t={t} onFloor={chooseFloor} onSpawn={(k) => run() && practiceSpawn(run()!, k)} />
        ) : (
          <PracticeItems groups={groups} query={query} lang={lang} t={t} owned={owned} onGive={give} onRemove={remove} onTip={onTip} />
        )}
      </div>
      <div className="practice-info">
        <small>{t(tab === "enemy" ? "practiceEnemyHint" : tab === "room" ? "practiceRoomHint" : "practiceHint")}</small>
      </div>
      {tip && (
        <ItemTip
          pos={tip}
          icon={tip.item}
          name={
            <>
              {itemName(tip.item.kind, tip.item.id, lang)}
              {n > 0 && ` (${t("practiceOwned")}${n > 1 ? ` ×${n}` : ""})`}
            </>
          }
          desc={itemDesc(tip.item.kind, tip.item.id, lang, t)}
        >
          {stack && <small className="practice-tip-stack">{stack}</small>}
        </ItemTip>
      )}
    </aside>
  );
}
