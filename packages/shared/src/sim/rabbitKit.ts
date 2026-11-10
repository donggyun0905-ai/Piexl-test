// 래빗 공용 도우미 (sim/rabbit·rabbitMarks·rabbitUlt가 같이 씀): 망치 크기·확률 배율·범위 피해
import { RABBIT_PERKS as K } from "../itemsRabbit";
import { RABBIT_HAMMER as H } from "../weaponsRabbit";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

type P = RunState["player"];

export const isRabbit = (p: P) => p.characterId === "rabbit";
/** 망치 크기 배율 (사거리 증가·긴 귀·왕망치) */
export const hammerSize = (p: P) => reachOf(p) * (hasPerk(p, "rbEars") ? K.rbEars.size : 1) * (hasPerk(p, "rbMega") ? K.rbMega.size : 1);
/** 내리찍는 자리까지 거리 (사거리 증가·긴 귀) */
export const hammerReach = (p: P) => H.reach * reachOf(p) * (hasPerk(p, "rbEars") ? K.rbEars.size : 1);
/** 망치 피해 배율 (왕망치) */
export const megaMul = (p: P) => (hasPerk(p, "rbMega") ? K.rbMega.mul : 1);
/** 확률 배율 (네잎클로버) */
export const luckMul = (p: P) => (hasPerk(p, "rbClover") ? K.rbClover.mul : 1);

/** 범위 피해 (밀지 않음) + 터지는 그림 · 묶음·느려짐 · 맞힌 적 */
export function rbArea(s: RunState, x: number, y: number, r: number, dmg: number, fx: "rbBunny" | "rbBell" | "rbAfter" | "rbSlam", opt: { stun?: number; slow?: number; style?: number } = {}): EnemyState[] {
  const hit: EnemyState[] = [];
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemyLite(s, e, dmg, d[0], d[1]);
    if (opt.stun) e.stunTicks = Math.max(e.stunTicks ?? 0, opt.stun);
    if (opt.slow) e.slowTicks = Math.max(e.slowTicks ?? 0, opt.slow);
    hit.push(e);
  }
  addEffect(s, { kind: fx, x, y, dirX: 0, dirY: 0, size: r, style: opt.style ?? 0, maxTicks: fx === "rbSlam" ? 24 : 30 });
  return hit;
}
