// 광야의 새벽: 무기 레벨·각성·패시브 레벨 → 능력치 변화 (items.recalcStats에서 더함)
import { PASSIVES, type PassiveId } from "../items";
import type { StatMod } from "../stats";
import { SWARM } from "../swarmDefs";
import type { PlayerState } from "./types";

export function swarmMods(p: PlayerState): StatMod[] {
  const out: StatMod[] = [];
  const up = (p.svLv ?? 1) - 1;
  if (up > 0) {
    const k = SWARM.weaponLv;
    out.push({ stat: "damage", mul: 1 + k.damage * up }, { stat: "attackSpeed", mul: 1 + k.attackSpeed * up }, { stat: "range", mul: 1 + k.range * up });
  }
  if (p.svEvo) {
    const e = SWARM.evo;
    out.push({ stat: "damage", mul: e.damage }, { stat: "attackSpeed", mul: e.attackSpeed }, { stat: "range", mul: e.range });
  }
  // 패시브 2~5레벨: 능력치 패시브는 그 능력치를 레벨만큼 더, 모든 패시브는 피해 조금 +
  for (const [id, lv] of Object.entries(p.svPass ?? {})) {
    for (let i = 1; i < lv; i++) out.push(...PASSIVES[id as PassiveId].mods);
    if (lv > 1) out.push({ stat: "damage", mul: 1 + SWARM.passiveLv * (lv - 1) });
  }
  if (p.svMight) out.push({ stat: "damage", mul: 1 + SWARM.maxed.might * p.svMight });
  return out;
}
