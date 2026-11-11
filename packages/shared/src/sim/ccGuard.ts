// 보스 상태이상 쿨타임: 기절·속박·공포·느려짐이 한 번 걸리면 1분 동안 다시 걸리지 않음 (계속 묶여 쉬워지지 않게)
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 보스에게 상태이상이 걸린 뒤 다시 걸릴 수 있을 때까지 (틱, 60 = 1초) */
  COOLDOWN: 3600,
};
export { R as CC_GUARD_RULES };

const KEYS = ["stunTicks", "rootTicks", "fearTicks", "sluggish"] as const;

/** 보스 틱 처음에: 걸린 중이면 더 늘지 않게 자르고, 쿨타임 중에 새로 걸리면 지움 */
export function bossCcGuard(s: RunState, e: EnemyState): void {
  const left = Math.max(0, (e.ccEnd ?? 0) - s.tick);
  if (left > 0) {
    for (const k of KEYS) if ((e[k] ?? 0) > left) e[k] = left;
    return;
  }
  let dur = 0;
  for (const k of KEYS) dur = Math.max(dur, e[k] ?? 0);
  if (dur <= 0) return;
  if (s.tick < (e.ccNext ?? 0)) {
    for (const k of KEYS) if (e[k]) e[k] = 0;
    return;
  }
  e.ccEnd = s.tick + dur;
  e.ccNext = s.tick + R.COOLDOWN;
}

/** 보스 스스로의 경직 (패턴의 일부): 쿨타임과 상관없이 걸리고 쿨타임도 새로 세지 않음 */
export function bossSelfStun(s: RunState, e: EnemyState, ticks: number): void {
  e.stunTicks = Math.max(e.stunTicks ?? 0, ticks);
  e.ccEnd = Math.max(e.ccEnd ?? 0, s.tick + 1 + ticks);
}
