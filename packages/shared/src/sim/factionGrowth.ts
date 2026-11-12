// 실베르 성장 (진영 특징, 로그만): 처음엔 약하지만 전용 패시브를 하나 가질 때마다 능력치가 더 오름 (수치 factionDefs.FACTION_GROWTH, items.recalcStats에서 씀)
import { FACTION_GROWTH as G } from "../factionDefs";
import { PASSIVES, type PassiveDef } from "../items";
import type { StatMod } from "../stats";
import { traitOf } from "./faction";
import type { RunState } from "./types";

/** 성장에 세는 패시브 수 (전용 패시브만 · 공용 패시브는 세지 않음) */
export const growthCount = (s: RunState) =>
  Math.min(G.cap, s.player.passives.filter((id) => (PASSIVES[id] as PassiveDef | undefined)?.exclusive).length);

/** 능력치를 다시 셀 때: 실베르면 패시브 수만큼 더 오름 */
export function growthMods(s: RunState): StatMod[] {
  if (traitOf(s) !== "silber") return [];
  const n = growthCount(s);
  if (n <= 0) return [];
  return [
    { stat: "maxHp", add: G.hp * n },
    { stat: "damage", mul: 1 + G.dmg * n },
    { stat: "attackSpeed", mul: 1 + G.atkSpd * n },
    { stat: "moveSpeed", mul: 1 + G.move * n },
    { stat: "projectileSpeed", mul: 1 + G.shot * n },
  ];
}
