// 혼령 전용 아이템 10개: 하나하나가 연기 혼령(소환수)·구름에 새 기술·능력을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 효과는 sim/honryeong·hrBeasts·hrSpirits. 수치는 HONRYEONG_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "honryeong" as const, effect: true as const });

export const HONRYEONG_PASSIVES = {
  /** 혼-랑: 공격마다 확률로 혼령 늑대 둘 (체력 낮음·공격력 높음) */
  hrWolf: P("hrWolf", [{ stat: "damage", mul: 1.05 }]),
  /** 혼-범: 공격마다 확률로 혼령 범 하나 (체력·공격력 모두 높음) */
  hrTiger: P("hrTiger", [{ stat: "maxHp", add: 15 }]),
  /** 혼-효: 공격마다 확률로 혼령 부엉이를 그 자리에 앉힘 (맵에 둘까지·체력 없음) · 범위 안 적에게 날아 낙하 공격 → 그 자리에 다시 앉음 */
  hrOwl: P("hrOwl", [{ stat: "range", mul: 1.06 }]),
  /** 혼-룡: 공격마다 낮은 확률로 방을 덮는 거대한 연기 용이 왼쪽 끝에서 오른쪽 끝으로 지나가며 모든 적을 60번 때림 */
  hrDragon: P("hrDragon", [{ stat: "damage", mul: 1.1 }]),
  /** 혼-영: 공격마다 확률로 혼령 분신을 방 어딘가에 세움 (맵에 넷까지) · 적이 분신을 쫓음 · 쓰러지면 연기가 터져 피해 */
  hrDecoy: P("hrDecoy", [{ stat: "maxHp", add: 20 }]),
  /** 혼령사냥: 내가 은신하면 소환수도 은신 · 늑대 첫 타격 확정 치명타·출혈 · 범 1.5배 커지고 공격력·체력 늘어남 · 부엉이는 앉지 않고 계속 날며 공격 */
  hrHunt: P("hrHunt", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 혼-귀: 구름 안에 들어온 적이 확률로 공포에 질림 (보스 제외) */
  hrFear: P("hrFear", [{ stat: "luck", add: 2 }]),
  /** 짙은 연기: 은신 동안 혼령의 피해가 커지고 구름 안 적이 연기 피해를 받음 */
  hrThick: P("hrThick", [{ stat: "damage", mul: 1.05 }]),
  /** 혼의 계약: 소환 확률·소환수 공격력·체력이 늘어남 */
  hrPact: P("hrPact", [{ stat: "luck", add: 2 }]),
  /** 깊은 들숨: 은신 동안 체력이 천천히 회복 */
  hrBreath: P("hrBreath", [{ stat: "maxHp", add: 15 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀, 확률은 0~1) */
export const HONRYEONG_PERKS = {
  /** 혼-랑: 공격마다 확률 · 한 번에 부르는 수 · 맵에 가장 많이 · 체력 · 피해 배율 · 공격 간격 틱 · 걷는 빠르기 · 몸 반지름 · 적을 보는 거리 · 사는 틱 */
  hrWolf: { chance: 0.15, n: 2, max: 2, hp: 12, mul: 1.4, rate: 40, speed: 1.9, r: 6, sight: 160, life: 1200 },
  /** 혼-범: 공격마다 확률 · 맵에 가장 많이 · 체력 · 피해 배율 · 공격 간격 틱 · 걷는 빠르기 · 몸 반지름 · 적을 보는 거리 · 사는 틱 · 할퀴는 반지름 */
  hrTiger: { chance: 0.08, max: 1, hp: 90, mul: 2.4, rate: 55, speed: 1.4, r: 9, sight: 160, life: 1500, reach: 18 },
  /** 혼-효: 공격마다 확률 · 맵에 가장 많이 · 적을 찾는 거리(사거리만큼) · 낙하 피해 배율 · 낙하 반지름 · 다음 낙하까지 틱 · 날아가는 틱 */
  hrOwl: { chance: 0.1, max: 2, range: 110, mul: 1.5, r: 24, rate: 70, fly: 24 },
  /** 혼-룡: 공격마다 확률 · 때리는 수 · 몇 틱마다 한 번 · 적 하나에 주는 피해 배율(모두 합쳐) · 보스 피해 배율 */
  hrDragon: { chance: 0.03, hits: 60, every: 2, mul: 12, bossMul: 0.6 },
  /** 혼-영: 공격마다 확률 · 맵에 가장 많이 · 체력 · 서 있는 틱 · 터지는 반지름 · 터지는 피해 배율 */
  hrDecoy: { chance: 0.12, max: 4, hp: 20, life: 900, r: 36, mul: 2 },
  /** 혼령사냥: 늑대 첫 타격 치명타 배율 · 범 크기 배율 · 범 공격력 배율 · 범 체력 배율 · 부엉이 낙하 간격 틱 */
  hrHunt: { crit: 2, size: 1.5, mul: 1.5, hp: 1.5, owlRate: 30 },
  /** 혼-귀: 몇 틱마다 확인 · 공포 확률 · 공포 틱 */
  hrFear: { every: 30, chance: 0.2, ticks: 90 },
  /** 짙은 연기: 은신 동안 피해 배율 · 몇 틱마다 연기 피해 · 연기 피해 배율 */
  hrThick: { mul: 1.25, every: 30, dot: 0.2 },
  /** 혼의 계약: 소환 확률 배율 · 소환수 피해 배율 · 소환수 체력 배율 */
  hrPact: { chance: 1.5, mul: 1.3, hp: 1.3 },
  /** 깊은 들숨: 몇 틱마다 · 회복량 */
  hrBreath: { every: 120, heal: 1 },
};
