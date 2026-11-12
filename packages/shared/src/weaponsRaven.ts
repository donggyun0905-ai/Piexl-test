// 레이븐(실베르, 흑백 체스 왕국의 창기사): 무기는 왕국의 창 하나. 몸 왼쪽에 퀸, 오른쪽에 킹이 늘 떠 있음
// 누르면 킹이 앞으로 나와 바닥을 내려찍음 → 다음은 퀸이 앞으로 나와 빛기둥 → 다시 킹부터 (계속 번갈아)
// 기본 패시브 체크: 킹에게 맞은 적에 체크 표식 → 퀸의 빛기둥이 체크된 적을 맞히면 금빛 왕관이 터지며 큰 피해 (체크메이트)
// 전용 패시브 20은 itemsRaven · 계산은 sim/raven·rvProcs·rvUnits·rvSkills
import type { WeaponDef } from "./content";

export const RAVEN_WEAPONS = {
  /** 왕국의 창: 킹 내려찍기 ↔ 퀸 빛기둥을 번갈아 (사거리 = 빛기둥이 솟는 거리) */
  rvLance: { id: "rvLance", kind: "chessCourt", damageMul: 1, attackSpeed: 1, range: 64, projectileSpeed: 4, exclusive: "chessRaven" },
} as const satisfies Record<string, WeaponDef>;

/** 기본 공격 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율 · 거리는 사거리 증가만큼 늘어남) */
export const RV_ATTACK = {
  /** 킹 내려찍기: 찍는 자리까지 거리 · 반지름 · 피해 배율 */
  slamReach: 26,
  slamR: 30,
  slamMul: 1,
  /** 퀸 빛기둥: 솟는 자리까지 거리 · 반지름 · 피해 배율 */
  pillarReach: 64,
  pillarR: 22,
  pillarMul: 1.3,
  /** 다시 누르기까지 틱 (공격 속도로 짧아짐) */
  cd: 24,
  /** 킹·퀸이 몸 옆에 떠 있는 거리 (그림) */
  side: 17,
};

/** 기본 패시브 체크 수치 */
export const RV_CHECK = {
  /** 체크 표식이 남는 틱 */
  ticks: 240,
  /** 퀸이 체크를 터뜨릴 때 더하는 피해 배율 (체크메이트) */
  mul: 1.2,
};
