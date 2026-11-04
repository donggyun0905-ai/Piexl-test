// 빌드 세트 효과: 가진 패시브 꼬리표(itemsTags) + 제단 증강 성좌 꼬리표를 세어 2 · 4 · 6개마다 단계 (수치 buildSetDefs)
// 단계는 능력치를 다시 셀 때(items.recalcStats → buildSetMods) p.setTiers에 넣어 둠 → 아래 계산은 그것만 읽음
// 여기는 능력치·배율 (추가 기본 스탯·피해·회복·대시·받는 피해), 맞힐 때·처치·틱마다 효과는 buildSetFx
// 패왕전·광야의 새벽은 꺼짐 (밸런스 따로)
import { ALTAR_TAGS, BUILD_SETS as B, SET_STEPS } from "../buildSetDefs";
import type { ExtraStats } from "../characters";
import { ITEM_TAGS, type ItemTag } from "../itemsTags";
import { passiveTagAt } from "./retag";
import type { StatMod } from "../stats";
import { raiseShield } from "./imugiMods";
import type { AwakenPlayerState } from "./buildAwaken";
import type { EnemyState, PlayerState, RunState } from "./types";
import { STILL_TICKS } from "./util";

export interface BuildSetPlayerState extends AwakenPlayerState {
  /** 꼬리표마다 세트 단계 0~3 (ITEM_TAGS 차례, 능력치를 다시 셀 때 정함, 세트가 꺼진 모드는 없음) */
  setTiers?: number[];
  /** 죽음 6: 쌓인 영혼 수 · 끝나는 틱 */
  setSouls?: number;
  setSoulT?: number;
  /** 단단함 6: 보호막을 다시 쓰기까지 남은 틱 · 바람 6: 대시가 끝난 틱 · 지난 틱 대시 중이었는지 */
  setShieldCd?: number;
  setDashEnd?: number;
  setWasDash?: boolean;
  /** 얼음 6: 잇따라 맞힌 적 id · 맞힌 수 (다 차면 빙결) */
  setFrost?: [number, number];
}

/** 이 모드에서 세트 효과가 켜지는지 */
export const setsOn = (s: RunState): boolean => !s.pvp && !s.swarm;

/** 꼬리표마다 가진 수 (패시브 + 가진 패시브에 붙은 제단 증강의 성좌 꼬리표) */
export function tagCounts(p: PlayerState): Record<ItemTag, number> {
  const out = Object.fromEntries(ITEM_TAGS.map((t) => [t, 0])) as Record<ItemTag, number>;
  // 대장간에서 바꾼 꼬리표가 먼저 · 무기는 대장간에서 꼬리표를 붙였을 때만 (sim/forge)
  p.passives.forEach((_, k) => {
    const t = passiveTagAt(p, k);
    if (t) out[t]++;
  });
  const wt = p.forge?.[p.weaponId]?.tag;
  if (wt) out[wt]++;
  for (const aug of p.augments ?? []) {
    if (!aug.alt || !p.passives.includes(aug.passive)) continue;
    for (const t of ALTAR_TAGS[aug.alt]) out[t]++;
    if (aug.pick) out[aug.pick]++;
  }
  return out;
}

/** 가진 수 → 단계 (0 · 2개 1 · 4개 2 · 6개 3 · 8개 4 = 각성 증강) */
export const tierOf = (n: number): number => (n >= SET_STEPS.four ? 4 : n >= SET_STEPS.three ? 3 : n >= SET_STEPS.two ? 2 : n >= SET_STEPS.one ? 1 : 0);

/** 꼬리표의 지금 단계 */
export const tier = (p: PlayerState, tag: ItemTag): number => p.setTiers?.[ITEM_TAGS.indexOf(tag)] ?? 0;

/** 능력치를 다시 셀 때: 단계를 정하고 세트가 주는 능력치 변화 */
export function buildSetMods(s: RunState): StatMod[] {
  const p = s.player;
  if (!setsOn(s)) {
    p.setTiers = undefined;
    return [];
  }
  const n = tagCounts(p);
  p.setTiers = ITEM_TAGS.map((t) => tierOf(n[t]));
  const mods: StatMod[] = [];
  if (tier(p, "wind") >= 1) mods.push({ stat: "moveSpeed", add: B.wind.move2 });
  if (tier(p, "luck") >= 2) mods.push({ stat: "luck", add: B.luck.luck4 });
  return mods;
}

/** 추가 기본 스탯 몫 (baseStats.extraOf) */
export function setExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (!p.setTiers?.some((t) => t > 0)) return null;
  const t = (tag: ItemTag) => tier(p, tag);
  const low = p.hp < p.stats.maxHp * B.blood.low6;
  return {
    defense: (t("earth") >= 1 ? B.earth.def2 : 0) + (t("tough") >= 1 ? B.tough.def2 : 0),
    reduction: t("tough") >= 2 ? B.tough.cut4 : 0,
    critChance: (t("sharp") >= 1 ? B.sharp.crit2 : 0) + (t("sharp") >= 3 ? B.sharp.crit6 : 0) + (t("luck") >= 3 ? B.luck.crit6 : 0),
    critDamage: t("sharp") >= 2 ? B.sharp.critDmg4 : 0,
    dodge: t("luck") >= 3 ? B.luck.dodge6 : 0,
    lifesteal: (t("blood") >= 1 ? B.blood.leech2 : 0) + (t("blood") >= 3 && low ? B.blood.leech6 : 0),
    goldGain: t("luck") >= 1 ? B.luck.gold2 : 0,
  };
}

/** 적에게 주는 피해 배율 (combat.damageEnemy) */
export function setDmgMul(s: RunState, e: EnemyState): number {
  const p = s.player;
  if (!p.setTiers) return 1;
  let mul = 1;
  const ice = tier(p, "ice");
  if (ice >= 2 && (e.slowTicks ?? 0) > 0) mul += B.ice.dmg4;
  const dark = tier(p, "dark");
  if (dark >= 1 && p.hp < p.stats.maxHp * B.dark.low) mul += dark >= 2 ? B.dark.dmg4 : B.dark.dmg2;
  if (tier(p, "death") >= 1 && e.hp < e.maxHp * B.death.low2) mul += B.death.dmg2;
  if (tier(p, "death") >= 3 && (p.setSoulT ?? 0) > s.tick) mul += B.death.soul6 * (p.setSouls ?? 0);
  if (tier(p, "light") >= 3 && p.hp >= p.stats.maxHp) mul += B.light.full6;
  if (tier(p, "wind") >= 3 && s.tick - (p.setDashEnd ?? -1e9) <= B.wind.after6) mul += B.wind.dmg6;
  return mul;
}

/** 화상 피해 배율 · 중독 피해 배율 (status.tickDots) */
export const setBurnMul = (p: PlayerState): number => (tier(p, "fire") >= 1 ? 1 + B.fire.burn2 : 1);
export const setPoisonMul = (p: PlayerState): number => (tier(p, "poison") >= 2 ? 1 + B.poison.dmg4 : 1);

/** 회복량 배율 (heal.heal) */
export const setHealMul = (p: PlayerState): number => (tier(p, "light") >= 1 ? 1 + B.light.heal2 : 1);

/** 대시 대기 시간 배율 (bedouin.dashCooldownMul) */
export const setDashMul = (p: PlayerState): number => (tier(p, "wind") >= 2 ? B.wind.dash4 : 1);

/** 받는 피해 (baseStats.extraTaken): 대지 6 가만히 서 있으면 줄임 · 단단함 6 맞으면 보호막 (다시 쓰는 시간은 틱마다 줄어듦) */
export function setTaken(p: PlayerState, taken: number): number {
  if (!p.setTiers || taken <= 0) return taken;
  if (tier(p, "earth") >= 3 && p.stillTicks >= STILL_TICKS) taken *= 1 - B.earth.still6;
  if (tier(p, "tough") >= 3 && (p.setShieldCd ?? 0) <= 0) {
    raiseShield(p, p.stats.maxHp * B.tough.shield6, p.stats.maxHp * B.tough.shield6);
    p.setShieldCd = B.tough.cd6;
  }
  return taken;
}
