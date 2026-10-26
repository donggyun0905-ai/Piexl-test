// 풋내기: 적을 쓰러뜨려 경험치를 모으고, 레벨이 오르면 받은 스탯 포인트를 원하는 능력치에 직접 찍음.
// 공용 무기·공용 패시브만 얻음 (loot). 찍은 스탯은 능력치 계산(items.recalcStats)에 더해짐
import { IMUGI } from "../weaponsImugi";
import { SAMYEOL } from "../weaponsSamyeol";
import { petCrit } from "./lobbyPet";
import { LOBBY_PETS } from "../petDefs";
import { SWARM } from "../swarmDefs";
import { imugiCrit } from "./imugiMods";
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import type { StatKey, StatMod } from "../stats";
import { recalcStats } from "./items";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, markCrit } from "./util";
import { extraOf } from "./baseStats";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 레벨이 오를 때 받는 포인트 · 회복(최대 체력 비율) */
  POINTS_PER_LEVEL: 1,
  LEVEL_HEAL: 0.1,
};
export { R as NOVICE_RULES };

/** 찍을 수 있는 능력치 (입력 statPick 1~9 = 이 순서) · 한 번 찍을 때 오르는 양 (mul은 배율, 치명타는 확률·배율에 더함) */
export type NoviceStat = StatKey | "critChance" | "critDamage";
export const NOVICE_STATS: readonly NoviceStat[] = ["damage", "attackSpeed", "maxHp", "moveSpeed", "range", "projectileSpeed", "luck", "critChance", "critDamage"];
export const NOVICE_STEP: Record<NoviceStat, { add?: number; mul?: number }> = {
  damage: { mul: 0.06 },
  attackSpeed: { mul: 0.05 },
  maxHp: { add: 12 },
  moveSpeed: { add: 0.04 },
  range: { mul: 0.06 },
  projectileSpeed: { mul: 0.08 },
  luck: { add: 1 },
  critChance: { add: 0.06 },
  critDamage: { add: 0.2 },
};
/** 치명타 기본 확률 · 기본 피해 배율 */
export const NOVICE_CRIT = 0.05;
export const NOVICE_CRIT_MUL = 1.5;
/** 레벨마다 저절로 오르는 양 (최대 체력 더하기 · 공격력 배율) */
export const NOVICE_GROWTH = { maxHp: 3, damage: 0.02 };

/** 적 하나가 주는 경험치 = 기본 체력 ÷ 10 (올림). 보스가 부른 적·허수아비는 0 */
export function expOf(e: EnemyState): number {
  if (e.noGold || e.kind === "dummy") return 0;
  return Math.ceil(ENEMIES[e.kind].hp / 10);
}

/** 다음 레벨까지 필요한 경험치 */
export const expToNext = (level: number) => 10 + 6 * (level - 1);

/** 쓰러뜨린 적의 경험치 받기 (풋내기만) */
export function gainExp(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "novice") return;
  p.lv ??= 1;
  // 광야의 새벽: 적이 아주 많아 경험치를 줄임
  p.exp = (p.exp ?? 0) + expOf(e) * (s.swarm ? SWARM.limits.noviceExp : 1);
  while (p.exp >= expToNext(p.lv)) {
    p.exp -= expToNext(p.lv);
    p.lv++;
    recalcStats(s);
    p.points = (p.points ?? 0) + R.POINTS_PER_LEVEL;
    p.hp = Math.min(p.stats.maxHp, p.hp + p.stats.maxHp * R.LEVEL_HEAL);
    addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 20, width: 1, follow: true });
  }
}

/** 스탯 포인트 하나를 찍음 (k = 1~7, NOVICE_STATS 순서) */
export function spendStat(s: RunState, k: number): void {
  const p = s.player;
  const stat = NOVICE_STATS[k - 1];
  if (!stat || (p.points ?? 0) <= 0) return;
  p.points = (p.points ?? 0) - 1;
  p.alloc = { ...p.alloc, [stat]: (p.alloc?.[stat] ?? 0) + 1 };
  recalcStats(s);
}

/** 레벨로 저절로 오른 것 + 찍은 스탯 → 능력치 변화 */
export function noviceMods(p: PlayerState): StatMod[] {
  const grown = (p.lv ?? 1) - 1;
  const growth: StatMod[] = grown > 0 ? [{ stat: "maxHp", add: NOVICE_GROWTH.maxHp * grown }, { stat: "damage", mul: 1 + NOVICE_GROWTH.damage * grown }] : [];
  if (!p.alloc) return growth;
  return growth.concat(NOVICE_STATS.flatMap((stat): StatMod[] => {
    const n = p.alloc?.[stat] ?? 0;
    if (!n || stat === "critChance" || stat === "critDamage") return [];
    const step = NOVICE_STEP[stat];
    return [step.mul ? { stat, mul: 1 + step.mul * n } : { stat, add: (step.add ?? 0) * n }];
  }));
}

/** 풋내기 치명타: 지금 확률 · 피해 배율 */
export function noviceCrit(p: PlayerState): { chance: number; mul: number } {
  return {
    chance: Math.min(1, NOVICE_CRIT + NOVICE_STEP.critChance.add! * (p.alloc?.critChance ?? 0)),
    mul: NOVICE_CRIT_MUL + NOVICE_STEP.critDamage.add! * (p.alloc?.critDamage ?? 0),
  };
}

/** 풋내기·이무기(용을 부른 뒤)가 주는 피해에 치명타 굴리기 (시드로만). 치명타면 배율을 곱한 피해, 아니면 그대로 */
export function rollCrit(s: RunState, e: EnemyState, dmg: number): { dmg: number; crit: boolean } {
  const p = s.player;
  // 풋내기 스탯 치명타 · 이무기는 용을 부른 수만큼 쌓인 치명타
  const wake = imugiCrit(p);
  // 병아리(로비 펫): 치명타 확률 +
  const pet = petCrit(s);
  const tang = p.characterId === "samyeol";
  // 기본 스탯 치명타 (모든 캐릭터, sim/baseStats)
  const ex = extraOf(p);
  if ((p.characterId !== "novice" && !tang && wake <= 0 && pet <= 0 && ex.critChance <= 0) || dmg <= 0) return { dmg, crit: false };
  p.critRolls = (p.critRolls ?? 0) + 1;
  // 사멸: 기본 치명타 20%
  const base = p.characterId === "novice" ? noviceCrit(p) : tang ? { chance: SAMYEOL.critChance, mul: SAMYEOL.critMul } : wake > 0 ? { chance: wake, mul: IMUGI.critMul } : { chance: 0, mul: ex.critChance > 0 ? ex.critDamage : LOBBY_PETS.chick.critMul };
  const c = { chance: base.chance + pet + ex.critChance, mul: base.mul };
  const crit = createRng(deriveSeed(s.seed, "ncrit", e.id, p.critRolls)).nextFloat() < c.chance;
  return { dmg: crit ? dmg * c.mul : dmg, crit };
}

/** 상태이상 피해의 치명타 (사멸만) */
export function dotCrit(s: RunState, e: EnemyState, amount: number): number {
  if (s.player.characterId !== "samyeol") return amount;
  // 상태이상 치명타는 2배 (보통 치명타 1.5배 + 0.5)
  const roll = rollCrit(s, e, amount);
  if (roll.crit) markCrit(s, e);
  return roll.crit ? amount * SAMYEOL.dotCritMul : amount;
}
