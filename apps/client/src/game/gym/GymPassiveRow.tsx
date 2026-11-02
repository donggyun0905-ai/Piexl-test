// 단련의 방 패시브 강화 한 줄: 오르는 능력치마다 '단계당 몫 · 지금 오른 몫' (sim/gym.gymPassiveStep) · 효과 수치마다 '원래 → 지금' (sim/gymPerks) · 깎는 몫 안내
import { fxKeys, fxScale, gymPassiveStep, PASSIVES, type PassiveDef, type PassiveId, type StatMod } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { itemName } from "../../i18n/items";
import { ItemIcon } from "../itemIcon";

const r2 = (v: number) => Math.round(v * 100) / 100;
/** 단계 하나로 바뀌는 몫 (+10% · −9.1%) */
const pct = (d: number) => `${d >= 0 ? "+" : "−"}${Math.abs(Math.round(d * 1000) / 10)}%`;
/** 효과 수치 이름 → 글자 키 (없는 이름은 '효과 수치') */
const FX_NAME: Record<string, TextKey> = {
  damage: "gymFxDamage", dmg: "gymFxDamage", mul: "gymFxMul", boss: "gymFxBoss", heal: "gymFxHeal", chance: "gymFxChance", crit: "gymFxChance",
  r: "gymFxRange", radius: "gymFxRange", reach: "gymFxRange", range: "gymFxRange", area: "gymFxRange", width: "gymFxRange", blast: "gymFxRange",
  splash: "gymFxDamage", push: "gymFxPush", pull: "gymFxPush", shield: "gymFxShield", regen: "gymFxHeal", hp: "gymFxShield", add: "gymFxAmount",
  extra: "gymFxAmount", stun: "gymFxStun", n: "gymFxCount", hits: "gymFxCount", shots: "gymFxCount", bounces: "gymFxCount", pierce: "gymFxCount",
  charges: "gymFxCount", every: "gymFxEvery", cd: "gymFxCd", cooldown: "gymFxCd", delay: "gymFxEvery", cost: "gymFxCost", taken: "gymFxTaken",
};
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
  const fx = fxKeys(id);
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
        {fx.map(([k, v]) => (
          <small key={k}>
            {t(FX_NAME[k] ?? "gymFxAmount")} · {r2(v)} → {r2(fxScale(k, v, lv, id))} ({t("gymPer")} {pct(fxScale(k, v, 1, id) / v - 1)})
          </small>
        ))}
        {bad && <small className="gym-note">{t("gymPassiveBadNote")}</small>}
      </div>
      <button type="button" disabled={!canUp || lv >= max} onClick={onUp}>
        +
      </button>
    </div>
  );
}
