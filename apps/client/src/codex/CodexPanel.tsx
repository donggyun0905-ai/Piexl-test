// 도감: 적 · 보스 · 무기 · 패시브 · 사용 아이템. 만난 것만 보이고 나머지는 실루엣·물음표 (테스트 중에는 전부)
import { CHARACTERS, ENEMIES, PASSIVE_IDS, PASSIVES, USE_ITEM_IDS, WEAPON_IDS, WEAPONS, type CharacterId, type EnemyKind, type PassiveDef, type WeaponDef } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { enemyDesc, enemyName } from "../i18n/enemies";
import { itemDesc, itemName } from "../i18n/items";
import { ItemIcon } from "../game/itemIcon";
import { ENEMY_SPRITES } from "../game/sprites";
import { codexSeen, type CodexKind } from "./codexStore";
import { EnemyPortrait } from "./EnemyPortrait";

type Tab = "enemy" | "boss" | "weapon" | "passive" | "use";
const TABS: [Tab, TextKey][] = [
  ["enemy", "codexEnemies"],
  ["boss", "codexBosses"],
  ["weapon", "codexWeapons"],
  ["passive", "codexPassives"],
  ["use", "codexUses"],
];
const isBoss = (k: string) => !!ENEMIES[k as EnemyKind]?.boss || k === "ruinblade" || k === "chaosblade";
// 그림만 있는 것(되살린 검은 모습 `*_dark`·제천대성 근두운)은 도감에서 빼고 원래 몬스터·보스만
const ENEMY_LIST = ENEMY_SPRITES.filter((k) => k !== "dummy" && !k.endsWith("_dark") && k !== "sage_cloud");

/** 무기·패시브의 전용 캐릭터 (공용이면 undefined) */
const ownerOf = (tab: Tab, id: string): CharacterId | undefined =>
  tab === "weapon" ? (WEAPONS[id as keyof typeof WEAPONS] as WeaponDef).exclusive : tab === "passive" ? (PASSIVES[id as keyof typeof PASSIVES] as PassiveDef).exclusive : undefined;

export function CodexPanel({ lang, t }: { lang: Lang; t: (k: TextKey) => string }) {
  const [tab, setTab] = useState<Tab>("enemy");
  const [owner, setOwner] = useState<string>("all");
  const [pick, setPick] = useState<string | null>(null);
  const kind: CodexKind = tab === "boss" ? "enemy" : tab;
  const all: readonly string[] = tab === "enemy" ? ENEMY_LIST.filter((k) => !isBoss(k)) : tab === "boss" ? ENEMY_LIST.filter(isBoss) : tab === "weapon" ? WEAPON_IDS : tab === "passive" ? PASSIVE_IDS.filter((id) => !(PASSIVES[id] as PassiveDef).special) : USE_ITEM_IDS;
  const list = all.filter((id) => owner === "all" || (owner === "common" ? !ownerOf(tab, id) : ownerOf(tab, id) === owner));
  const seen = all.filter((id) => codexSeen(kind, id)).length;
  const enemy = tab === "enemy" || tab === "boss";
  const name = (id: string) => (enemy ? enemyName(id, lang) : itemName(tab as "weapon" | "passive" | "use", id, lang));
  const sel = pick && list.includes(pick) ? pick : null;
  const known = sel !== null && codexSeen(kind, sel);
  return (
    <div className="codex">
      <div className="codex-tabs">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={`small${tab === id ? " active" : ""}`} onClick={() => (setTab(id), setPick(null), setOwner("all"))}>
            {t(label)}
          </button>
        ))}
        <span className="codex-count">
          {seen} / {all.length}
        </span>
      </div>
      {(tab === "weapon" || tab === "passive") && (
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="all">{t("codexAllChars")}</option>
          <option value="common">{t("codexCommon")}</option>
          {Object.keys(CHARACTERS).map((c) => (
            <option key={c} value={c}>
              {t(c as TextKey)}
            </option>
          ))}
        </select>
      )}
      {sel && (
        <div className="codex-detail">
          {enemy ? <EnemyPortrait kind={sel} size={96} hidden={!known} /> : <ItemIcon item={{ kind: tab, id: sel } as never} size={64} />}
          <div>
            <strong>{known ? name(sel) : "???"}</strong>
            {known && ownerOf(tab, sel) && <small className="codex-owner"> · {t(ownerOf(tab, sel) as TextKey)}</small>}
            <p>{!known ? t(enemy ? "codexUnknown" : "codexUnknownItem") : enemy ? enemyDesc(sel, lang) : itemDesc(tab as "weapon" | "passive" | "use", sel, lang, t)}</p>
            {known && enemy && (
              <small>
                {t("codexHp")} {ENEMIES[sel as EnemyKind].hp.toLocaleString()} · {t("codexTouch")} {ENEMIES[sel as EnemyKind].contactDamage}
              </small>
            )}
          </div>
        </div>
      )}
      <p className="codex-hint">{t("codexHint")}</p>
      <div className={`codex-grid${enemy ? " enemies" : ""}`}>
        {list.map((id) => {
          const ok = codexSeen(kind, id);
          return (
            <button key={id} type="button" className={`codex-card${ok ? "" : " unknown"}${sel === id ? " active" : ""}`} title={ok ? name(id) : "???"} onClick={() => setPick(id)}>
              {enemy ? <EnemyPortrait kind={id} size={48} hidden={!ok} /> : ok ? <ItemIcon item={{ kind: tab, id } as never} size={32} /> : <span className="codex-q">?</span>}
              <small>{ok ? name(id) : "???"}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
