// 패왕전 성장 대결 능력치 합: 장비(pwShop) + 중첩 + 조건 효과(녹색·포탈건·왕관·큐피트 느려짐) + 증강 (pwRules.PW_AUGS)
// 결과는 pwGrow.growStats(체력·공격·속도·사거리)와 baseStats.extraOf(방어력·재생력·치명타·흡혈·예리함)가 씀
import type { ExtraStats } from "../characters";
import { PW_AUGS, PW_GROW, type PwAugId } from "../pwRules";
import { PW_GEAR_FX as F, pwGearDef, type PwGearStat } from "../pwShop";
import type { PlayerState } from "./types";

export type GearSum = Required<PwGearStat> & { hpMul: number; skillCd: number; lifesteal: number; sharpness: number };

const ZERO = (): GearSum => ({
  hp: 0, dmg: 0, dmgMul: 0, rate: 0, range: 0, rangeMul: 0, move: 0, shot: 0, crit: 0, critDmg: 0, def: 0, regen: 0,
  dashCut: 0, skillDmg: 0, skillHeal: 0, maxLv: 0, hpMul: 1, skillCd: 1, lifesteal: 0, sharpness: 0,
});

/** 지금 쌓인 칸 수 */
export const stk = (p: PlayerState, id: string): number => p.pwStk?.[id]?.[0] ?? 0;
const fx = (p: PlayerState, k: string): number => p.pwFx?.[k] ?? 0;

/** 장비·중첩·증강을 모두 더한 값 (장비 이동 속도 더하기는 최대 PW_GROW.moveMax) */
export function gearSum(p: PlayerState): GearSum {
  const out = ZERO();
  const add = (st: PwGearStat) => {
    for (const [k, v] of Object.entries(st)) if (typeof v === "number" && k !== "cost" && k in out) (out as Record<string, number>)[k] = (out as Record<string, number>)[k]! + v;
  };
  for (const id of p.pwGear ?? []) {
    const def = pwGearDef(id);
    if (def) add(def);
  }
  out.dmgMul += stk(p, "relicRed") * F.relicRed.dmgMul;
  out.rate += stk(p, "relicBlue") * F.relicBlue.rate;
  out.crit += stk(p, "relicGold") * F.relicGold.crit;
  out.critDmg += stk(p, "relicPrism") * F.relicPrism.critDmg;
  out.def += stk(p, "relicSilver") * F.relicSilver.def;
  out.regen += stk(p, "relicSilver") * F.relicSilver.regen;
  out.hp += stk(p, "relicWhite") * F.relicWhite.hp;
  out.move += stk(p, "godShard") * F.godShard.move;
  // 운명의 주사위: 공격력·방어력·재생력·공격 속도 중 하나씩
  const fd = F.fateDice;
  out.dmg += fx(p, "fate0") * fd.dmg;
  out.def += fx(p, "fate1") * fd.def;
  out.regen += fx(p, "fate2") * fd.regen;
  out.rate += fx(p, "fate3") * fd.rate;
  if (fx(p, "green")) out.regen += F.relicGreen.regen;
  out.move += fx(p, "portal");
  // 바스러져가는 왕관: 잃은 체력 비율만큼
  const low = fx(p, "crown");
  out.dmgMul += low * F.crumblingCrown.dmg;
  out.rate += low * F.crumblingCrown.rate;
  out.move += low * F.crumblingCrown.move;
  for (const id of (p.pwAug ?? []) as PwAugId[]) {
    const a: Record<string, number> = PW_AUGS[id] ?? {};
    out.lifesteal += a.lifesteal ?? 0;
    out.sharpness += a.sharpness ?? 0;
    out.crit += a.critChance ?? 0;
    out.critDmg += a.critDamage ?? 0;
    out.def += a.defense ?? 0;
    out.regen += a.regen ?? 0;
    out.dmgMul += (a.dmgMul ?? 1) - 1;
    out.rate += (a.rateMul ?? 1) - 1;
    out.move += a.move ?? 0;
    out.hpMul *= a.hpMul ?? 1;
    out.skillCd *= a.skillCd ?? 1;
    out.skillDmg += (a.skillDmg ?? 1) - 1;
    out.dashCut += a.dashCut ?? 0;
  }
  out.move = Math.min(PW_GROW.moveMax, out.move);
  // 큐피트의 정령에 맞아 느려짐 (상한과 따로)
  out.move -= fx(p, "cupid") * F.cupidSpirit.slow;
  out.dashCut = Math.min(PW_GROW.dashCutMax, out.dashCut);
  return out;
}

/** 추가 기본 스탯으로 더하는 몫 (baseStats.extraOf) · 레벨마다 방어력 */
export function growExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (p.pwLv === undefined) return null;
  const g = gearSum(p);
  return { critChance: g.crit, critDamage: g.critDmg, defense: g.def + PW_GROW.perLv.def * (p.pwLv - 1), regen: g.regen, lifesteal: g.lifesteal, sharpness: g.sharpness };
}

/** 스킬 피해 · 스킬 대기 · 스킬 치유 배율 (성장 대결이 아니면 1) */
export const growSkillDmg = (p: PlayerState): number => (p.pwLv === undefined ? 1 : 1 + gearSum(p).skillDmg);
export const growSkillCd = (p: PlayerState): number => (p.pwLv === undefined ? 1 : gearSum(p).skillCd);
export const growSkillHeal = (p: PlayerState): number => (p.pwLv === undefined ? 1 : 1 + gearSum(p).skillHeal);

/** 받는 회복 배율: 이프리트·저주받은 주사위 치유 감소 */
export const growHealMul = (p: PlayerState, tick: number): number => (fx(p, "antiUntil") > tick ? 1 - fx(p, "antiCut") : 1);
