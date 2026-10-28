// 패왕전 역할군 상성 (pwRoles, 수치는 PW.roles · 관리자 '패왕전 수치 · 규칙'에서 바꿈)
// 전사: 마법사·암살자에게 받는 피해 감소 · 원딜: 전사에게 주는 피해 증가 · 마법사: 암살자에게 주는 피해 증가
// 암살자: 원딜·마법사에게 주는 피해 증가 · 서포터: 회복량 증가. 바로 맞히는 피해에만 (지속 피해는 그대로)
import { PW } from "../paewangDefs";
import { pwRoleOf } from "../pwRoles";
import { allPlayers } from "./party";
import { passiveHitMul } from "./pwPassive";
import type { EnemyState, RunState } from "./types";

/** 지금 자리(s.player)가 그림자 적 e(상대 사람)를 때릴 때 배율. 사람이 아닌 것(소환물 등)은 1 */
export function roleDmgMul(s: RunState, e: EnemyState): number {
  const pv = s.pvp;
  if (!pv) return 1;
  const j = pv.proxies.indexOf(e);
  const target = j >= 0 ? allPlayers(s)[j] : undefined;
  if (!target) return 1;
  const atk = pwRoleOf(s.player.characterId);
  const def = pwRoleOf(target.characterId);
  const R = PW.roles;
  let m = 1;
  if (def === "warrior" && (atk === "mage" || atk === "assassin")) m *= R.warriorTaken;
  if (atk === "ranged" && def === "warrior") m *= R.rangedVsWarrior;
  if (atk === "mage" && def === "assassin") m *= R.mageVsAssassin;
  if (atk === "assassin" && (def === "ranged" || def === "mage")) m *= R.assassinVsRangedMage;
  // 패왕전 전용 패시브 (pwPassive)
  return m * passiveHitMul(s, e, j, target);
}

/** 지금 자리(s.player)가 하는 회복 배율 (서포터) */
export const roleHealMul = (s: RunState): number => (s.pvp && pwRoleOf(s.player.characterId) === "support" ? PW.roles.supportHeal : 1);
