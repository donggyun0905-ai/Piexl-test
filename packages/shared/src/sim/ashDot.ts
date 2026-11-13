// 아슈바르 상태이상 한 대 (블뢰 빙결 · 존 번개 같이 씀): 무적이면 막힘 · 가디언 방패가 있으면 한 칸 깨고 끝 · 아니면 상태이상 피해 (피해 출처는 지금 기술)
// nrKit을 불러오지 않음 (서로 불러오는 순환을 피함)
import { bjAlive } from "./bjKit";
import { logDmg, muteDot } from "./dmgSrc";
import { dotDamage } from "./status";
import type { DotKind, EnemyState, RunState } from "./types";
import { addEffect } from "./util";

/** 준 피해 (막히면 0) */
export function ashDot(s: RunState, e: EnemyState, kind: DotKind, dmg: number): number {
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
  muteDot(() => dotDamage(s, e, kind, dmg));
  const dealt = hp - Math.max(0, e.hp);
  logDmg(s, e, dealt);
  return dealt;
}
