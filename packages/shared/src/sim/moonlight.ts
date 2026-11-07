// 달빛 상태이상 (새벽의 성흔): 성흔 각성 중 모든 공격에 확정으로 1스택 (최대 5스택: 초승달 → 상현달 → 반달 → 하현달 → 보름달, 맞을 때마다 지속 시간 다시)
// 걸린 적: 맞을 때 스택만큼 확률로 약점 공격(받은 피해의 50%를 한 번 더, 흰 숫자·초승달 표시) · 주는 피해 약화(확률 없이, 몸 닿기·쏜 탄·장판·직접 공격)
import { createRng, deriveSeed } from "../rng";
import type { EnemyState, RunState } from "./types";
import { isAwake } from "./stigma";
import { hasPerk, markDot } from "./util";
import { BLAST_PERKS } from "../itemsBlast";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 최대 스택 (달의 5단계) */
  MAX: 5,
  /** 지속 틱 (5초, 새로 걸리면 다시) */
  TICKS: 300,
  /** 약점 공격 확률: 1스택(초승달) · 2스택(상현달) · 3스택(반달) · 4스택(하현달) · 5스택(보름달) */
  CHANCE_1: 0.05,
  CHANCE_2: 0.1,
  CHANCE_3: 0.15,
  CHANCE_4: 0.3,
  CHANCE_5: 0.5,
  /** 약점 공격: 받은 피해에 더하는 비율 (0.5 = 50% 더) */
  EXTRA: 0.5,
  /** 걸린 적이 주는 피해 배율 (0.8 = 20% 약해짐) */
  WEAKEN: 0.8,
};
export { R as MOON_RULES };

/** 지금 행동 중인 적 (sim/enemies가 돌 때만 · 그 적이 주는 피해에 약화를 붙임) */
let acting: EnemyState | null = null;
export const setActingFoe = (e: EnemyState | null) => {
  acting = e;
};

/** 이 적이 주는 피해 배율 (달빛이 걸려 있으면 약화) */
export const moonOut = (e: EnemyState | null | undefined = acting) => ((e?.moon ?? 0) > 0 ? R.WEAKEN : 1);

/** 달빛 걸기 (n스택) */
export function applyMoon(e: EnemyState, n = 1): void {
  if (e.hp <= 0 || n <= 0) return;
  e.moon = Math.min(R.MAX, (e.moon ?? 0) + n);
  e.moonT = R.TICKS;
}

/** n스택일 때 약점 공격 확률 */
export const chance = (n: number) => [0, R.CHANCE_1, R.CHANCE_2, R.CHANCE_3, R.CHANCE_4, R.CHANCE_5][Math.min(R.MAX, n)] ?? 0;

/** 맞힌 뒤 (baseStats.onHitExtra): 걸려 있으면 약점 공격 확률 · 성흔 각성 중이면 확정으로 달빛 */
export function moonHit(s: RunState, e: EnemyState, dmg: number): void {
  const n = e.moon ?? 0;
  if (n > 0 && e.hp > 0 && !e.immune && createRng(deriveSeed(s.seed, "moon", e.id, s.tick)).nextFloat() < chance(n)) {
    const extra = dmg * R.EXTRA;
    e.hp -= extra;
    markDot(s, e, "moon", extra);
  }
  if (isAwake(s.player)) applyMoon(e, 1 + (hasPerk(s.player, "blLunar") ? BLAST_PERKS.blLunar.more : 0));
}

/** 틱마다 (status.tickDots): 시간이 다 되면 풀림 */
export function moonTick(e: EnemyState): void {
  if ((e.moonT ?? 0) <= 0) return;
  if (--e.moonT! > 0) return;
  delete e.moon;
  delete e.moonT;
}
