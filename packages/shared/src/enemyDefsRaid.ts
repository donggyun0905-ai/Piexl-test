// 이벤트 '레이드' 적 수치 (ENEMIES에 펼쳐 넣음, 계산은 sim/lucifer*)
// 기둥·불길·검·상자도 boss: 보스가 아닌 적에게만 걸리는 처형·즉사·밀림·느림이 걸리지 않게 (2026-11-10 사용자 제보: 즉사가 걸림)
import type { EnemyDef } from "./enemyDefs";

/** 루시퍼 · 석화의 기둥 · 악마의 불길 · 어둠의 세계 몬스터 */
export type RaidFoeKind = "lucifer" | "lucpillar" | "lucflame" | "lucshade" | "lucsword" | "lucchest";

export const RAID_ENEMIES: Record<RaidFoeKind, EnemyDef> = {
  /** 레이드 보스 루시퍼: 체력 = 1페이즈 44000 + 2페이즈 44000 (페이즈마다 체력 줄 ×99), 움직이지 않음 (2페이즈는 sim/lucifer가 움직임) */
  lucifer: { kind: "lucifer", hp: 88000, radius: 40, speed: 0, contactDamage: 30, gold: 0, boss: true },
  /** 석화의 기둥 (1페이즈 4개): 유저 한 명씩 맡아 아주 느리게 따라감 · 1분마다 석화의 빔 */
  lucpillar: { kind: "lucpillar", hp: 10000, radius: 36, speed: 0.1, contactDamage: 0, gold: 0, boss: true },
  /** 악마의 불길 (1페이즈 체력 30줄부터 30초마다 4마리): 어둠 화살 · 어둠 화살비 */
  lucflame: { kind: "lucflame", hp: 1400, radius: 14, speed: 0.35, contactDamage: 14, gold: 0, boss: true },
  /** 어둠의 세계 몬스터 (빨려 간 사람만 보고 싸움) */
  lucshade: { kind: "lucshade", hp: 260, radius: 9, speed: 0.75, contactDamage: 0, gold: 0 },
  /** 절망의 검 (2페이즈 4개): 유저 한 명씩 맡아 느리게 다가오며 빛나면 맵 곳곳에 패턴 (sim/lucSwords) */
  /** 보상 방의 큰 상자 (때려서 엶, 공격하지 않음) */
  lucchest: { kind: "lucchest", hp: 30000, radius: 30, speed: 0, contactDamage: 0, gold: 0, boss: true },
  lucsword: { kind: "lucsword", hp: 10000, radius: 34, speed: 0.12, contactDamage: 20, gold: 0, boss: true },
};
