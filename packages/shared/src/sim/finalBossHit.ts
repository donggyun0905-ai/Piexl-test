// 최종보스 체력 비례 피해: 라스트 보스(시즌 1~3)·레이드 루시퍼와 싸우는 동안 맞는 피해에 내 최대 체력의 일정 비율을 더함
// (체력이 많은 탱커도 아프게. 지형·장판처럼 틱마다 닳는 피해(envDamage)에는 더하지 않음, 패왕전 제외)
import type { EnemyKind } from "../enemyDefs";
import type { RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 최종보스 전투에서 맞을 때마다 더하는 피해: 내 최대 체력의 비율 (0.05 = 5%) */
  MAX_HP_PCT: 0.05,
};
export { R as FINAL_BOSS_HIT_RULES };

/** 이 적이 살아 있으면 최종보스 전투 (라스트 보스와 몸 일부·부르는 짐승·레이드 루시퍼) */
const FINAL: ReadonlySet<EnemyKind> = new Set<EnemyKind>([
  "dragon", "godeater", "ruinblade", "chaosblade", "plight", "pdark",
  "umbra", "sandworm", "scorpion", "roc", "demigod", "sage",
  "cerberus", "cerbfist", "cerbflame", "cerbblade", "leviathan", "levwhale", "levking", "asmodeus",
  "lucifer",
]);

/** 지금 맞는 한 대에 더할 피해 (최종보스 전투가 아니면 0) */
export function finalBossExtra(s: RunState): number {
  if (s.pvp || R.MAX_HP_PCT <= 0) return 0;
  for (const e of s.enemies) if (e.hp > 0 && FINAL.has(e.kind)) return s.player.stats.maxHp * R.MAX_HP_PCT;
  return 0;
}
