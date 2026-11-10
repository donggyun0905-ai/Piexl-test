// 쉐도잉(실베르, 그림을 그리는 정령 소녀): 무기는 마법 붓 하나. 누르고 있는 동안 마우스 자리(붓 끝)를 따라 바닥에 먹 획을 그려 공격
// 획에 닿은 적은 계속 피해 · 다 그린 획 모양에 따라 기술: 처음과 끝이 만나는 닫힌 원 = 봉인(안의 적 큰 피해·묶음) · 곧은 줄 = 일필 베기
// 잉크(100)를 써서 그리고 쉬면 다시 참 (공격 속도가 빠를수록 빨리 참). 계산은 sim/shadowing · 전용 패시브 20개는 itemsShadowing·sim/shadowingArts
import type { WeaponDef } from "./content";

export const SHADOWING_WEAPONS = {
  /** 마법 붓: 그리는 공격 하나뿐 (사거리 = 붓이 닿는 거리) */
  sdBrush: { id: "sdBrush", kind: "inkBrush", damageMul: 1, attackSpeed: 1, range: 150, projectileSpeed: 4, exclusive: "shadowing" },
} as const satisfies Record<string, WeaponDef>;

/** 쉐도잉 붓 수치 (시간은 틱(60 = 1초), 거리는 픽셀, 피해 배율은 공격력 × 배율) */
export const SHADOW_INK = {
  /** 붓이 닿는 가장 먼 거리 (사거리 증가만큼 늘어남) */
  reach: 150,
  /** 획 점 사이 가장 짧은 거리 · 한 획의 가장 많은 점 · 판 위에 남는 획 수 */
  seg: 6,
  maxPts: 80,
  maxStrokes: 8,
  /** 잉크 가득 · 1픽셀 그릴 때 드는 잉크 · 틱마다 차는 잉크 (공격 속도 배율) · 그리기를 멈추고 차기 시작할 때까지 틱 · 다시 그릴 수 있는 잉크 */
  ink: 100,
  cost: 0.3,
  refill: 0.5,
  refillDelay: 20,
  restart: 12,
  /** 획 굵기(절반) · 다 그린 뒤 남는 틱 · 같은 적을 다시 맞히기까지 틱 (공격 속도로 짧아짐) · 닿을 때 피해 배율 */
  width: 7,
  life: 120,
  hitCd: 20,
  inkMul: 0.6,
  /** 봉인: 처음과 끝 사이 이만큼 가까우면 닫힌 원 · 원 둘레가 이만큼 길어야 · 안의 적 피해 배율 · 묶는 틱 */
  closeDist: 30,
  minLoop: 90,
  sealMul: 2.5,
  sealStun: 30,
  /** 일필 베기: 곧은 정도(처음~끝 거리 ÷ 획 길이) · 가장 짧은 길이 · 피해 배율 · 베는 굵기(절반) */
  straight: 0.92,
  minLine: 50,
  slashMul: 1.8,
  slashW: 12,
  /** 자동 조준: 붓이 적 둘레를 도는 반지름 · 한 바퀴 틱 */
  autoR: 22,
  autoSpin: 48,
};
