// 히든 캐릭터 몰락한 왕 (fallenKing): 대검 콤보는 sim/kingBlade · 처치한 적의 영혼이 잘게 쪼개져 빛줄기로 몸에 들어옴 (p.fkSouls)
// 영혼 하나마다 공격력·최대 체력 + (악의 사도처럼 왼쪽 위 스택 창) · 전용 아이템 10 (itemsFallenKing)
import { FALLEN_KING as P } from "../content";
import { FALLEN_KING_PERKS as K } from "../itemsFallenKing";
import type { StatMod } from "../stats";
import { recalcStats } from "./items";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isFallenKing = (p: PlayerState) => p.characterId === "fallenKing";

/** 모은 영혼 수 */
export const kingSouls = (p: PlayerState) => p.fkSouls ?? 0;

/** 영혼 몫 능력치 (recalcStats) */
export function fallenKingMods(p: PlayerState): StatMod[] {
  const n = kingSouls(p);
  if (!isFallenKing(p) || !n) return [];
  return [
    { stat: "damage", add: n * P.soulDamage },
    { stat: "maxHp", add: n * P.soulHp },
  ];
}

/** 처치 (combat → hiddenPerks.relicKill): 영혼이 잘게 쪼개져 빛줄기로 날아옴 */
export function kingKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!isFallenKing(p) || e.kind === "dummy") return;
  p.fkSouls = kingSouls(p) + 1 + (hasPerk(p, "fkHarvest") ? K.fkHarvest.extra : 0);
  addEffect(s, { kind: "kgSoul", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 3, toX: p.x, toY: p.y - 10, maxTicks: P.fly, tint: "#6ad8ff" });
  recalcStats(s);
}

/** 받는 피해 배율 (classTaken): 왕의 위엄 */
export function fallenKingTaken(p: PlayerState): number {
  if (!isFallenKing(p) || !hasPerk(p, "fkMajesty")) return 1;
  const m = K.fkMajesty;
  return 1 - Math.min(m.max, Math.floor(kingSouls(p) / m.per) * m.cut);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetFallenKing(p: PlayerState): void {
  delete p.fkSouls;
  delete p.kgStep;
}
