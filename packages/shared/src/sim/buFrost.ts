// 블뢰 빙결 (얼음마녀 기본 패시브): 서리 피해(상태이상 · 1.5배) · 얼리기(보스는 못 얼림 · 녹은 뒤 잠시 다시 안 얼음)
// nrKit.nrHit가 on.frost일 때 부름 (서로 불러오는 순환을 피해 nrKit을 불러오지 않음)
import { BU_SNOW as W } from "../itemsBleu";
import { bjAlive } from "./bjKit";
import type { HitOn } from "./nrTypes";
import { logDmg, muteDot } from "./dmgSrc";
import { stun } from "./s2Kit";
import { dotDamage } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

/** 얼리기: 다시 얼릴 수 있을 때만 · 보스·허수아비는 멈추지 않음(그림만) */
export function buFreeze(s: RunState, e: EnemyState, ticks: number): void {
  if (ticks <= 0 || (e.buIceOk ?? 0) > s.tick) return;
  stun(e, ticks);
  e.buIce = s.tick + ticks;
  e.buIceOk = s.tick + ticks + W.refreeze;
}

/** 빙결 한 대: 가디언 방패가 있으면 한 칸 깨고 끝 · 서리 피해 (얼음마녀 배율, 피해 출처는 지금 기술) + 얼리기 · 준 피해 */
export function buFrostHit(s: RunState, e: EnemyState, dmg: number, on: HitOn): number {
  if (!bjAlive(e) || dmg <= 0) return 0;
  if (e.immune) {
    e.blockTick = s.tick;
    return 0;
  }
  if ((e.shield ?? 0) > 0) {
    e.shield = (e.shield ?? 0) - 1;
    e.hitFlash = 3;
    addEffect(s, { kind: "hit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.shield === 0 ? 7 : 3, maxTicks: 8 });
    return 0;
  }
  const hp = e.hp;
  muteDot(() => dotDamage(s, e, "frost", dmg * W.frostMul));
  const dealt = hp - Math.max(0, e.hp);
  logDmg(s, e, dealt);
  if (on.freeze) buFreeze(s, e, on.freeze);
  return dealt;
}
