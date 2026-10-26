// 모든 캐릭터 공통 추가 기본 스탯 (캐릭터 표 CHARACTERS에 있음, 관리자 '캐릭터'에서 캐릭터마다 바꿈. 처음 값은 지금 게임과 같게 0 · 치명타 피해 150%)
// 치명타 확률·치명타 피해 · 방어력(받는 피해 100/(100+방어력)) · 피해 감소(%) · 회피(확률) · 재생력(10초마다 회복) · 흡혈(준 피해의 %)
// 예리함(맞힐 때 확률로 적 방어 -25%(받는 피해 +25%) + 출혈) · 상태이상 강화(상태이상 피해 +%) · 돈 획득(+%)
import { CHARACTERS, type ExtraStats } from "../characters";
import { createRng, deriveSeed } from "../rng";
import { healPlayer } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 예리함: 적이 받는 피해 + · 그 시간(틱) */
  SHARP_DEF: 0.25,
  SHARP_TICKS: 180,
  /** 재생력은 이 틱마다 (재생력/10만큼, 곧 10초에 재생력만큼) */
  REGEN_EVERY: 60,
  /** 피해 감소 최대 (90%) */
  REDUCTION_MAX: 0.9,
};
export { R as BASE_STATS_RULES };

/** 지금 캐릭터의 추가 기본 스탯 */
export const extraOf = (p: PlayerState): ExtraStats => CHARACTERS[p.characterId] as unknown as ExtraStats;

const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 회피: 확률로 피해를 받지 않음 */
export function dodged(s: RunState): boolean {
  const d = extraOf(s.player).dodge;
  if (d <= 0 || roll(s, "dodge", 0) >= d) return false;
  addEffect(s, { kind: "ring", x: s.player.x, y: s.player.y, dirX: 0, dirY: 0, size: 10, maxTicks: 10 });
  return true;
}

/** 방어력·피해 감소로 줄인 받는 피해 */
export function extraTaken(p: PlayerState, taken: number): number {
  const ex = extraOf(p);
  if (ex.defense > 0) taken *= 100 / (100 + ex.defense);
  if (ex.reduction > 0) taken *= 1 - Math.min(R.REDUCTION_MAX, ex.reduction);
  return taken;
}

/** 예리함이 걸린 적이 더 받는 피해 */
export const sharpBonus = (s: RunState, e: EnemyState) => ((e.sharpT ?? 0) > s.tick ? R.SHARP_DEF : 0);

/** 적을 맞힌 뒤: 흡혈 · 예리함 (확률로 방어 깎기 + 출혈) */
export function onHitExtra(s: RunState, e: EnemyState, dmg: number): void {
  const ex = extraOf(s.player);
  if (dmg <= 0) return;
  if (ex.lifesteal > 0) healPlayer(s, dmg * ex.lifesteal);
  if (ex.sharpness > 0 && e.hp > 0 && roll(s, "sharp", e.id) < ex.sharpness) {
    e.sharpT = s.tick + R.SHARP_TICKS;
    applyBleed(e);
  }
}

/** 상태이상 피해 배율 · 돈 획득 배율 */
export const statusMul = (p: PlayerState) => 1 + extraOf(p).statusPower;
export const goldMul = (p: PlayerState) => 1 + extraOf(p).goldGain;

/** 틱마다: 재생력 · 예리함 출혈 (거너는 총에서 이미 출혈을 셈) */
export function extraTick(s: RunState): void {
  const p = s.player;
  const ex = extraOf(p);
  if (ex.regen > 0 && s.tick % R.REGEN_EVERY === 0 && p.hp > 0) healPlayer(s, (ex.regen / 10) * (R.REGEN_EVERY / 60));
  if (ex.sharpness > 0 && weaponOf(p).kind !== "gun") updateBleed(s);
}
