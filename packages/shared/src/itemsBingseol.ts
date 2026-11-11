// 빙설 전용 아이템 10개: 하나하나가 얼음 칼날·얼음 영역에 새 기술을 더하고 능력치도 올림 (실베르답게 먹을수록 강해짐)
// 효과는 sim/bingseol·bsShots·bsArms·bsUlt. 수치는 BINGSEOL_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "bingseol" as const, effect: true as const });

export const BINGSEOL_PASSIVES = {
  /** 궁극기-빙설창: 공격마다 확률로 몸 위에 빙설창이 기를 모았다가 마우스 쪽으로 날아감 · 닿은 적마다 슬로우 모션 60연타 · 맵 끝까지 관통 */
  bsUlt: P("bsUlt", [{ stat: "damage", mul: 1.1 }]),
  /** 빙설무장-활: 공격마다 확률로 몸 좌우에 커다란 얼음 활을 세움 (맵에 둘까지) · 둘레 적에게 화살 */
  bsBow: P("bsBow", [{ stat: "range", mul: 1.06 }]),
  /** 빙설무장-창: 공격마다 높은 확률로 머리 위에 얼음 창 4~7개가 차례로 생겨 앞으로 날아감 (관통 없음) */
  bsLance: P("bsLance", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 얼음가루: 공격마다 얼음가루 3~5개가 영역 안에 흩날림 (맵에 30개까지) · 닿은 적에게 고정 피해 */
  bsDust: P("bsDust", [{ stat: "luck", add: 2 }]),
  /** 얼음가루(속): 얼음가루 5개가 생길 때마다 모여 유도 얼음이 되어 적에게 날아가 터짐 (3번 뒤 3초 쉼) */
  bsHoming: P("bsHoming", [{ stat: "damage", mul: 1.05 }]),
  /** 얼음가루(강): 얼음가루 10개가 생길 때마다 모여 급속 얼음이 되어 관통하며 날아감 (1번 뒤 5초 쉼) */
  bsRapid: P("bsRapid", [{ stat: "damage", mul: 1.06 }]),
  /** 빙격: 공격마다 확률로 앞에 얼음 빙각이 솟아 피해 · 구속 (보스는 오래 느려짐) */
  bsSpike: P("bsSpike", [{ stat: "maxHp", add: 15 }]),
  /** 영역강화: 영역 테두리에 눈 결정 벽 5개 · 방어력 · 닿은 적 피해 · 적 탄 막음 · 공격마다 확률로 얼음가루 1~3개 */
  bsWall: P("bsWall", [{ stat: "maxHp", add: 20 }]),
  /** 눈보라 확장: 얼음 영역이 넓어지고 영역 안 적에게 냉기 피해 */
  bsStorm: P("bsStorm", [{ stat: "range", mul: 1.05 }]),
  /** 쇄빙: 얼음 영역 안 적에게 주는 빙설의 피해가 커지고 얼음가루 피해도 커짐 */
  bsShatter: P("bsShatter", [{ stat: "damage", mul: 1.05 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀, 확률은 0~1) */
export const BINGSEOL_PERKS = {
  /**
   * 궁극기-빙설창: 공격마다 확률 · 기 모으는 틱 · 한 틱에 나아가는 거리 · 반지름
   * 적 하나에 멈춰 때리는 수 · 그 동안 틱(슬로우 모션) · 적 하나에 주는 피해 배율(모두 합쳐) · 보스 피해 배율 · 슬로우 동안 적 탄 빠르기
   */
  bsUlt: { chance: 0.03, charge: 180, speed: 6, r: 14, hits: 60, pause: 60, mul: 9, bossMul: 0.6, shotSlow: 0.25 },
  /** 빙설무장-활: 공격마다 확률 · 맵에 가장 많이 · 몸에서 떨어진 거리 · 서 있는 틱 · 몇 틱마다 화살 · 찾는 거리 · 화살 피해 배율 · 화살 빠르기 */
  bsBow: { chance: 0.12, max: 2, side: 24, life: 600, every: 30, dist: 170, mul: 0.8, speed: 6 },
  /** 빙설무장-창: 공격마다 확률 · 창 수(가장 적게·많게) · 하나씩 생기는 틱 · 다 생긴 뒤 첫 창이 날아가기까지 틱 · 한 개씩 연발로 쏘는 간격(틱) · 창 사이 거리 · 피해 배율 · 빠르기 · 반지름 */
  bsLance: { chance: 0.45, min: 4, max: 7, every: 4, wait: 8, gap: 6, space: 13, mul: 0.6, speed: 6, r: 5 },
  /** 얼음가루: 공격마다 생기는 수(가장 적게·많게) · 맵에 가장 많이 · 고정 피해 · 반지름 · 사는 틱 */
  bsDust: { min: 3, max: 5, cap: 30, dmg: 2, r: 3, life: 600 },
  /** 얼음가루(속): 모이는 얼음가루 수 · 연속 수 · 쉬는 틱 · 피해 배율 · 터지는 반지름 · 빠르기 · 찾는 거리 · 모이는 틱 */
  bsHoming: { need: 5, chain: 3, cd: 90, mul: 1.3, r: 22, speed: 4, dist: 220, gather: 14 },
  /** 얼음가루(강): 모이는 얼음가루 수 · 연속 수 · 쉬는 틱 · 피해 배율 · 빠르기 · 반지름 · 사는 틱 · 모이는 틱 */
  bsRapid: { need: 10, chain: 1, cd: 180, mul: 3.5, speed: 7, r: 8, life: 60, gather: 16 },
  /** 빙격: 공격마다 확률 · 솟는 거리(사거리만큼) · 반지름 · 피해 배율 · 구속 틱 · 보스 느려지는 틱 */
  bsSpike: { chance: 0.25, dist: 70, r: 66, mul: 1.6, stun: 60, bossSlow: 120 },
  /** 영역강화: 결정 수 · 방어력 · 도는 빠르기(틱마다 라디안) · 결정 반지름 · 몇 틱마다 피해 · 피해 배율 · 공격마다 얼음가루 확률 · 얼음가루 수(가장 적게·많게) */
  bsWall: { n: 5, defense: 10, spin: 0.012, r: 9, every: 45, mul: 0.5, dustChance: 0.4, dustMin: 1, dustMax: 3 },
  /** 눈보라 확장: 영역 크기 배율 · 몇 틱마다 냉기 피해 · 피해 배율 */
  bsStorm: { size: 1.3, every: 30, mul: 0.25 },
  /** 쇄빙: 영역 안 적에게 주는 피해 배율 · 얼음가루 고정 피해 배율 */
  bsShatter: { mul: 1.25, dust: 2 },
};
