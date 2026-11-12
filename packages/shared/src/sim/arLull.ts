// 아리아 클라리넷 둘레 효과 (classTaken·enemies가 부름, 가벼운 것만 불러옴): 받는 피해 늘어남 · 공격 늦어짐 (느려짐은 sim/arInstruments가 slowTicks로)
import { ARIA_PERKS as K } from "../itemsAria";
import type { EnemyState, RunState } from "./types";

/** 클라리넷 둘레에 있는 적인지 */
export const arLulled = (s: RunState, e: EnemyState) => (e.arLull ?? 0) > s.tick;

/** 클라리넷 둘레 적이 받는 피해 배율 (classTaken) */
export const arTaken = (s: RunState, e: EnemyState) => (arLulled(s, e) ? K.arClarinet.taken : 1);

/** 클라리넷 둘레 적의 공격 준비를 늦춤 (enemies: 몇 틱마다 준비 한 틱 되돌림) */
export function arLag(s: RunState, e: EnemyState): void {
  if (arLulled(s, e) && e.timer > 1 && s.tick % K.arClarinet.lag === 0) e.timer++;
}
