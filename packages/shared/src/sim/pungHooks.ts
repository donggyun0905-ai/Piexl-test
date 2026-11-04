// 풍류사가 다른 계산 파일에 거는 작은 갈고리 (combat 지형 피해 · loot 돈·방 정리 · shop 가격 · classTaken 둔갑술)
import { PUNGRYU_PERKS as K } from "../itemsPungryu";
import { PUNGRYU as U } from "../weaponsPungryu";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

const isPu = (p: PlayerState) => p.characterId === "pungryu";

/** 구름 타기: 지형·지속 피해 배율 (오색 구름이면 없음) */
export const cloudEnv = (p: PlayerState) => (!isPu(p) ? 1 : hasPerk(p, "puCloud") ? 0 : U.cloudEnv);
/** 의적 주머니: 얻는 돈 배율 */
export const thiefGold = (p: PlayerState) => (hasPerk(p, "puThief") ? K.puThief.gold : 1);
/** 활빈당 깃발: 상점 가격 배율 */
export const bannerPrice = (p: PlayerState) => (hasPerk(p, "puBanner") ? K.puBanner.price : 1);
/** 활빈당 깃발: 방을 정리했을 때 회복할 양 */
export const bannerHeal = (p: PlayerState) => (hasPerk(p, "puBanner") ? p.stats.maxHp * K.puBanner.heal : 0);

/** 둔갑술: 체력이 30% 아래로 떨어질 피해를 층마다 한 번 허수아비로 둔갑해 피함 (받을 피해를 돌려줌) */
export function disguise(s: RunState, taken: number): number {
  const p = s.player;
  if (!hasPerk(p, "puDisguise") || p.puDisguised === s.floor || taken <= 0) return taken;
  if (p.hp - taken >= p.stats.maxHp * K.puDisguise.below) return taken;
  p.puDisguised = s.floor;
  p.invulnTicks = Math.max(p.invulnTicks, K.puDisguise.invuln);
  addEffect(s, { kind: "puDisguise", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 16, maxTicks: 40 });
  return 0;
}
