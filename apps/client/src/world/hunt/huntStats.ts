// 지도 전투의 내 능력치: 걷는 캐릭터 기본값 + 낀 레이드 장신구 (레이드와 같은 길: sim/accStats accMods·accExtras·accDash, docs/WORLD_MAP.md RPG 방향)
import { accDash, accExtras, accMods, CHARACTERS, type AccTotals, type CharacterDef, type CharacterId, type PlayerState } from "@pixel-rogue/shared";
import { myAccTotals } from "../../event/acc/accStore";

export interface HuntStats {
  maxHp: number;
  /** 한 번 휘두를 때 피해 (치명타 전) */
  dmg: number;
  /** 다시 휘두르기 시간 배율 (작을수록 빠름) · 닿는 거리 배율 · 걷기 속도 배율 · 대시 재사용 배율 */
  gapMul: number;
  reachMul: number;
  moveMul: number;
  dashMul: number;
  crit: number;
  critDmg: number;
  /** 받는 피해 배율 (방어력 100/(100+방어) × 받는 피해 ±) · 절반 확률 */
  taken: number;
  half: number;
  /** 1초 회복 · 준 피해 중 회복 몫 */
  regen: number;
  lifesteal: number;
}

const mod = (mods: ReturnType<typeof accMods>, stat: string, base: number): number => {
  const m = mods.find((x) => x.stat === stat);
  return m ? (base + (m.add ?? 0)) * (m.mul ?? 1) : base;
};

export function huntStats(who: CharacterId, acc: AccTotals | undefined = myAccTotals()): HuntStats {
  const c: CharacterDef = CHARACTERS[who];
  // 장신구 효과는 PlayerState.acc만 읽음
  const p = { acc } as PlayerState;
  const mods = accMods(p);
  const ex = accExtras(p) ?? {};
  const v = (k: keyof AccTotals) => acc?.[k] ?? 0;
  return {
    maxHp: Math.round(mod(mods, "maxHp", c.fixedHp ?? c.maxHp)),
    dmg: mod(mods, "damage", c.damage) * (1 + v("dmg")),
    gapMul: 1 / mod(mods, "attackSpeed", 1),
    // 사거리 +는 기본 사거리 100 기준 몫으로
    reachMul: mod(mods, "range", 100) / 100,
    moveMul: 1 + (mod(mods, "moveSpeed", c.moveSpeed) - c.moveSpeed) / c.moveSpeed,
    dashMul: accDash(p),
    crit: Math.min(1, ex.critChance ?? 0),
    critDmg: 1.5 + (ex.critDamage ?? 0),
    taken: (100 / (100 + Math.max(0, ex.defense ?? 0))) * Math.max(0.1, 1 + v("taken")),
    half: v("half"),
    regen: (ex.regen ?? 0) / 10,
    lifesteal: ex.lifesteal ?? 0,
  };
}
