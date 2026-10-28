// 타워 디펜스 옆 칸: 세울 캐릭터 목록 · 고른 타워 정보(능력치·무기·패시브)·레벨 올리기 후보·팔기
import { characterOpen } from "../characterGoals";
import { CHARACTER_IDS, nextUpgrade, rebuildLeft, repairCost, TD_RULES, towerCost, upgradeCost, type CharacterId, type TdState, type TdTower } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { ItemIcon, type IconItem } from "../game/itemIcon";
import { TdPortrait } from "./TdScreen";

interface Props {
  td: TdState;
  lang: Lang;
  t: (key: TextKey) => string;
  placing: CharacterId | null;
  selected: TdTower | null;
  onPlacing: (id: CharacterId | null) => void;
  onClose: () => void;
  onUpgrade: (choice: string) => void;
  onRepair: () => void;
  onSell: () => void;
}

const fmt = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n)));

export function TdPanel(props: Props) {
  return props.selected ? <TowerInfo {...props} tower={props.selected} /> : <BuildList {...props} />;
}

function BuildList({ td, t, placing, onPlacing }: Props) {
  const cost = towerCost(td);
  return (
    <div className="td-build">
      <p className="hint">{placing ? t("tdPlacing") : t("tdBuildHint")}</p>
      <div className="td-chars">
        {CHARACTER_IDS.map((id) => {
          // 캐릭터마다 타워 하나 · 부서지면 재건축이 끝날 때까지 못 세움
          const placed = td.towers.some((x) => x.character === id);
          const wait = rebuildLeft(td, id);
          return (
            <button
              key={id}
              type="button"
              className={`td-char ${placing === id ? "selected" : ""} ${wait > 0 ? "rebuild" : ""}`}
              disabled={(td.run.gold < cost && placing !== id) || !characterOpen(id) || placed || wait > 0}
              onClick={() => onPlacing(placing === id ? null : id)}
            >
              <TdPortrait id={id} />
              <span>{t(id as TextKey)}</span>
              <small className="td-cost">{placed ? t("tdPlaced") : wait > 0 ? t("tdRebuild").replace("{s}", String(wait)) : `${cost}G`}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TowerInfo({ td, lang, t, tower, onClose, onUpgrade, onRepair, onSell }: Props & { tower: TdTower }) {
  const fix = repairCost(tower);
  const p = tower.atk[0]!.p;
  const up = nextUpgrade(td, tower);
  const cost = upgradeCost(tower);
  const afford = td.run.gold >= cost;
  const title = up.kind === "weapon" ? t("tdUpWeapon") : up.kind === "passive" ? t("tdUpPassive") : up.kind === "second" ? t("tdUpSecond") : t("tdMax");
  return (
    <div className="td-tower">
      <header>
        <TdPortrait id={tower.character} size={40} />
        <div>
          <strong>{t(tower.character as TextKey)}</strong>
          <span className="td-lv">Lv {tower.level}</span>
        </div>
        <button type="button" className="ghost small" onClick={onClose} aria-label={t("close")}>
          ✕
        </button>
      </header>
      <div className="td-hp" title={t("tdHp")}>
        <span style={{ width: `${Math.max(0, (tower.hp / tower.maxHp) * 100)}%` }} />
        <b>
          {Math.ceil(tower.hp)} / {tower.maxHp}
        </b>
      </div>
      <button type="button" className="td-repair outline" disabled={fix <= 0 || td.run.gold < fix} onClick={onRepair}>
        {fix > 0 ? t("tdRepair").replace("{g}", String(fix)) : t("tdFull")}
      </button>
      <dl className="td-stats">
        <dt>{t("statDamage")}</dt>
        <dd>{p.stats.damage.toFixed(1)}</dd>
        <dt>{t("statAttackSpeed")}</dt>
        <dd>{p.stats.attackSpeed.toFixed(2)}</dd>
        <dt>{t("statRange")}</dt>
        <dd>{Math.round(p.stats.range)}</dd>
        <dt>{t("tdDamageDealt")}</dt>
        <dd>{fmt(tower.dmg)}</dd>
        <dt>{t("tdKills")}</dt>
        <dd>{tower.kills}</dd>
      </dl>
      <div className="td-gear">
        {tower.atk.map((a) => (
          <span key={a.p.weaponId} className="td-gear-weapon" title={itemName("weapon", a.p.weaponId, lang)}>
            <ItemIcon item={{ kind: "weapon", id: a.p.weaponId }} size={28} />
          </span>
        ))}
        {p.passives.map((id) => (
          <span key={id} title={`${itemName("passive", id, lang)} — ${itemDesc("passive", id, lang, t)}`}>
            <ItemIcon item={{ kind: "passive", id }} size={22} />
          </span>
        ))}
      </div>
      <h4>
        {title}
        {up.kind !== "max" && <span className={afford ? "td-cost" : "td-cost short"}>{cost}G</span>}
      </h4>
      {up.kind !== "max" && (
        <div className={`td-options ${up.kind}`}>
          {up.options.map((id) => {
            const kind = up.kind === "passive" ? "passive" : "weapon";
            const current = kind === "weapon" && id === p.weaponId;
            return (
              <button key={id} type="button" className={`td-option ${current ? "current" : ""}`} disabled={!afford} onClick={() => onUpgrade(id)}>
                <ItemIcon item={{ kind, id } as IconItem} size={28} />
                <span className="td-option-text">
                  <strong>{itemName(kind, id, lang)}</strong>
                  <small>{itemDesc(kind, id, lang, t)}</small>
                </span>
              </button>
            );
          })}
        </div>
      )}
      <button type="button" className="td-sell outline" onClick={onSell}>
        {t("tdSell").replace("{g}", String(Math.floor(tower.spent * TD_RULES.sellRate)))}
      </button>
    </div>
  );
}
