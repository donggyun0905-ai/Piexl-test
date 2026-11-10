// '적 최대 체력의 %' 피해(출혈·역병·이무기 독·악의 사도 가면 등)의 기준 체력
// 레이드 적(루시퍼 248000 등)은 던전 라스트 보스 체력까지만 셈 → % 피해가 수십 배로 들어가 혼자 레이드를 끝내지 않게 (던전은 그대로)
import type { RaidFoeKind } from "../enemyDefsRaid";
import type { EnemyState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 레이드 적의 % 피해 기준 체력 상한 (던전 멸망의 용 체력과 같음) */
  RAID_CAP: 9600,
};
export { R as PCT_HP_RULES };

const RAID_FOES: readonly string[] = ["lucifer", "lucpillar", "lucflame", "lucshade", "lucsword", "lucchest"] satisfies RaidFoeKind[];

/** % 피해에 쓰는 최대 체력 */
export const pctHp = (e: EnemyState): number => (RAID_FOES.includes(e.kind) ? Math.min(e.maxHp, R.RAID_CAP) : e.maxHp);
