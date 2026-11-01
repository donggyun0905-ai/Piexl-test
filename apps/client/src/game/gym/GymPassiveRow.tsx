// 단련의 방 패시브 강화 한 줄: 오르는 능력치마다 '단계당 몫 · 지금 오른 몫' (sim/gym.gymPassiveStep과 같은 계산) · 깎는 몫·효과만 있는 패시브 안내
import { gymPassiveStep, PASSIVES, type PassiveDef, type PassiveId, type StatMod } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { itemName } from "../../i18n/items";
import { ItemIcon } from "../itemIcon";

const r2 = (v: number) => Math.round(v * 100) / 100;
/** 곱하기 몫은 %, 더하기 몫은 그 숫자 그대로 */
const amount = (m: StatMod, lv: number) => (m.mul !== undefined ? `+${r2((m.mul - 1) * lv * 100)}%` : `+${r2((m.add ?? 0) * lv)}`);

interface Props {
  id: PassiveId;
  lv: number;
  max: number;
  canUp: boolean;
  lang: Lang;
  t: (k: TextKey) => string;
  onUp: () => void;
}

export function GymPassiveRow({ id, lv, max, canUp, lang, t, onUp }: Props) {
  const mods = ((PASSIVES[id] as PassiveDef).mods ?? []) as readonly StatMod[];
  const steps = gymPassiveStep(id);
  const good = mods.some((m) => (m.add ?? 0) > 0 || (m.mul ?? 1) > 1);
  const bad = mods.some((m) => (m.add ?? 0) < 0 || (m.mul !== undefined && m.mul < 1));
  return (
    <div className="gym-row passive">
      <div className="gym-pinfo">
        <span className="gym-name">
          <ItemIcon item={{ kind: "passive", id }} size={18} /> {itemName("passive", id, lang)} <small>Lv {lv}/{max}</small>
        </span>
        {steps.map((m, k) => (
          <small key={k}>
            {t(`gymStat_${m.stat}` as TextKey)} · {t("gymPer")} {amount(m, 1)} · {t("gymNow")} {amount(m, lv)}
          </small>
        ))}
        {!good && <small className="gym-note">{t("gymPassivePlainNote")}</small>}
        {bad && <small className="gym-note">{t("gymPassiveBadNote")}</small>}
      </div>
      <button type="button" disabled={!canUp || lv >= max} onClick={onUp}>
        +
      </button>
    </div>
  );
}
