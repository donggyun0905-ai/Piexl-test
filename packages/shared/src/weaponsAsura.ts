// 아수라(실베르, 귀신의 주먹 6개를 부리는 싸움꾼): 무기는 맨손 하나. 누르면 바라보는 쪽 앞을 귀신 주먹으로 넓게 침 (피해는 약함)
// 전용 패시브 20개(분쇄·귀진·파동·아수라 각성·연발·악귀 등)는 itemsAsura · 계산은 sim/asura·asHit·asMoves·asAwake
import type { WeaponDef } from "./content";

export const ASURA_WEAPONS = {
  /** 아수라의 맨손: 앞을 귀신 주먹으로 넓게 침 (사거리 = 치는 거리) */
  asFist: { id: "asFist", kind: "asuraFist", damageMul: 1, attackSpeed: 1, range: 40, projectileSpeed: 4, exclusive: "asura" },
} as const satisfies Record<string, WeaponDef>;

/** 기본 펀치 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율) */
export const ASURA_FIST = {
  /** 치는 자리까지 거리 · 맞히는 반지름 (사거리 증가만큼 늘어남, 넓게) */
  reach: 22,
  r: 30,
  /** 피해 배율 (약하게) · 다시 치기까지 틱 (공격 속도로 짧아짐) */
  mul: 0.7,
  cd: 24,
};

/** 아수라 각성 수치: 각성 동안 누를 때마다 1·2타 → 1·2타 → 3타(바닥 연속 강타 3번) → 4타(기절) 차례로 · 그림은 모두 4칸 */
export const ASURA_AWAKE = {
  /** 각성 지속 틱 (10초) */
  ticks: 600,
  /** 1·2타: 치는 거리 · 반지름 · 피해 배율 · 걸리는 틱 (그림 4칸이 이어지게) */
  reach12: 30,
  r12: 42,
  mul12: 1.2,
  cd12: 16,
  /** 3타: 몸 둘레 반지름 · 한 번 피해 배율 · 내리치는 수 · 내리치는 간격(틱, 그림 4칸을 다시 처음부터) */
  r3: 58,
  mul3: 0.9,
  n3: 3,
  gap3: 8,
  /** 4타: 몸 둘레 반지름 · 피해 배율(크게) · 기절 틱(1.5초) · 걸리는 틱 */
  r4: 66,
  mul4: 3.2,
  stun4: 90,
  cd4: 20,
};
