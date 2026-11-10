// 레이드 장신구 효과 (수치 accDefs·합계 accRules.accTotals, PlayerState.acc는 레이드 시작 때 사람마다 넣음)
// 능력치(station.stationMods) · 추가 스탯(baseStats.extraOf) · 주는 피해(raidTune.raidDmgMul) · 받는 피해 · 대시 재사용(bedouin.dashCooldownMul) · 맞힐 때(약점·추가 공격) · 사용 아이템 쿨타임 초기화
// · 부활 · 죽을 피해에 버티기 · 5초마다 회복 · 상태이상 제거
import { ACC_RULES as A } from "../accDefs";
import type { AccTotals } from "../accRules";
import type { ExtraStats } from "../characters";
import { createRng, deriveSeed } from "../rng";
import type { StatMod } from "../stats";
import { healPlayer } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, markDot } from "./util";

/** 장신구 효과가 있는 사람의 상태 */
export interface AccPlayerState {
  /** 장착한 장신구 능력치 합계 (레이드만) */
  acc?: AccTotals;
  /** 부활을 썼음 · 버티기 끝 틱 · 버티기를 쓴 목숨 (데스 수) */
  accRevived?: boolean;
  accHoldEnd?: number;
  accHoldLife?: number;
}

const v = (p: PlayerState, k: keyof AccTotals) => p.acc?.[k] ?? 0;
const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, "acc", tag, s.tick, n, s.seat ?? 0)).nextFloat();

/** 능력치 (station.stationMods → recalcStats) */
export function accMods(p: PlayerState): StatMod[] {
  if (!p.acc) return [];
  return [
    { stat: "damage", add: v(p, "atk"), mul: 1 + v(p, "atkPct") },
    { stat: "attackSpeed", mul: 1 + v(p, "aspd") },
    { stat: "maxHp", add: v(p, "hp") },
    { stat: "range", add: v(p, "range"), mul: 1 + v(p, "rangePct") },
    { stat: "moveSpeed", add: v(p, "move") },
  ];
}

/** 추가 스탯 (baseStats.extraOf) */
export function accExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (!p.acc) return null;
  return { defense: v(p, "def"), regen: v(p, "regen"), lifesteal: v(p, "lifesteal"), sharpness: v(p, "sharp"), critChance: v(p, "crit"), critDamage: v(p, "critDmg") };
}

/** 주는 피해 배율 (raidTune.raidDmgMul → combat.damageEnemy) */
export const accDealt = (s: RunState) => 1 + v(s.player, "dmg");

/** 받는 피해 배율 (classTaken): 받는 피해 ± · 확률로 절반 */
export function accTaken(s: RunState): number {
  const p = s.player;
  if (!p.acc) return 1;
  const half = v(p, "half") > 0 && roll(s, "half", 0) < v(p, "half") ? 0.5 : 1;
  return Math.max(0.1, 1 + v(p, "taken")) * half;
}

/** 대시 재사용 시간 배율 (bedouin.dashCooldownMul) */
export const accDash = (p: PlayerState) => Math.max(0.2, 1 - v(p, "dash"));

/** 맞힌 뒤 (baseStats.onHitExtra): 약점 공격(피해 50% 더) · 추가 공격 30% · 추가 피해 15% */
export function accOnHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  if (!p.acc || e.hp <= 0 || e.immune) return;
  let more = 0;
  if (v(p, "weak") > 0 && roll(s, "weak", e.id) < v(p, "weak")) more += dmg * A.weakMul;
  if (v(p, "extra") > 0 && roll(s, "extra", e.id) < v(p, "extra")) more += dmg * A.extraMul;
  if (v(p, "extra15") > 0 && roll(s, "extra15", e.id) < v(p, "extra15")) more += dmg * A.extra15Mul;
  if (more <= 0) return;
  e.hp -= more;
  markDot(s, e, "moon", more);
}

/** 사용 아이템을 쓴 뒤 (raidPrep.spendUse): 확률로 쿨타임 바로 끝 (얼음 세계 빼고) */
export function accItemReset(s: RunState, item: string): boolean {
  const c = v(s.player, "itemReset");
  return c > 0 && item !== "frost" && roll(s, "item", 0) < c;
}

/** 죽을 피해를 받았을 때 (run.checkDeath): 버티기(목숨마다 한 번, 체력 1로 3초) · 부활(판에 한 번). 살렸으면 true */
export function accSave(s: RunState): boolean {
  const p = s.player;
  if (!p.acc || p.hp > 0) return false;
  const life = p.raidDeaths ?? 0;
  if (s.tick < (p.accHoldEnd ?? -1)) {
    p.hp = 1;
    return true;
  }
  if (v(p, "undying") > 0 && p.accHoldLife !== life) {
    p.accHoldLife = life;
    p.accHoldEnd = s.tick + A.holdTicks;
    p.hp = 1;
    addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 18, maxTicks: 30 });
    return true;
  }
  if (v(p, "revive") > 0 && !p.accRevived) {
    p.accRevived = true;
    p.hp = Math.ceil(p.stats.maxHp * Math.min(1, v(p, "revive")));
    p.invulnTicks = 120;
    addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 24, maxTicks: 24 });
    return true;
  }
  return false;
}

/** 틱마다 (baseStats.extraTick): 5초마다 최대 체력 % 회복 · 1초마다 확률로 상태이상 제거 */
export function accTick(s: RunState): void {
  const p = s.player;
  if (!p.acc || p.hp <= 0) return;
  if (v(p, "heal5") > 0 && s.tick % A.healEvery === 0) healPlayer(s, p.stats.maxHp * v(p, "heal5"));
  if (v(p, "cleanse") > 0 && s.tick % A.cleanseEvery === 0 && afflicted(p) && roll(s, "cleanse", 0) < v(p, "cleanse")) {
    cleanse(p);
    addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 14, maxTicks: 14 });
  }
}

const afflicted = (p: PlayerState) => (p.rootTicks ?? 0) > 0 || (p.chainTicks ?? 0) > 0 || (p.darkTicks ?? 0) > 0 || (p.mirrorTicks ?? 0) > 0 || (p.blindTicks ?? 0) > 0 || (p.netStun ?? 0) > 0 || (p.raidCut ?? 0) > 0;

/** 몸에 걸린 상태이상 걷어내기 (묶임·사슬·어둠·거울·깜깜함·그물·치유 감소) */
function cleanse(p: PlayerState): void {
  p.rootTicks = 0;
  p.chainTicks = 0;
  p.darkStacks = 0;
  p.darkTicks = 0;
  p.mirrorTicks = 0;
  p.blindTicks = 0;
  p.netStun = 0;
  p.raidCut = 0;
}
