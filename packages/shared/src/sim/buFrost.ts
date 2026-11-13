// 블뢰 빙결 (얼음마녀 기본 패시브): 서리 피해(상태이상 · 1.5배) · 얼리기(보스는 못 얼림 · 녹은 뒤 잠시 다시 안 얼음)
// nrKit.nrHit가 on.frost일 때 부름 (서로 불러오는 순환을 피해 nrKit을 불러오지 않음)
import { BU_SNOW as W } from "../itemsBleu";
import { bjAlive } from "./bjKit";
import type { HitOn } from "./nrTypes";
import { stun } from "./s2Kit";
import { dotDamage } from "./status";
import type { EnemyState, RunState } from "./types";

/** 얼리기: 다시 얼릴 수 있을 때만 · 보스·허수아비는 멈추지 않음(그림만) */
export function buFreeze(s: RunState, e: EnemyState, ticks: number): void {
  if (ticks <= 0 || (e.buIceOk ?? 0) > s.tick) return;
  stun(e, ticks);
  e.buIce = s.tick + ticks;
  e.buIceOk = s.tick + ticks + W.refreeze;
}

/** 빙결 한 대: 서리 피해 (얼음마녀 배율) + 얼리기 · 준 피해 */
export function buFrostHit(s: RunState, e: EnemyState, dmg: number, on: HitOn): number {
  if (!bjAlive(e)) return 0;
  const hp = e.hp;
  dotDamage(s, e, "frost", dmg * W.frostMul);
  if (on.freeze) buFreeze(s, e, on.freeze);
  return hp - Math.max(0, e.hp);
}
