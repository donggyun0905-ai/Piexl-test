// 라파엘 상태 타입 (sim/rafael). 모두 선택 값 (예전 저장에는 없음)

/** 폭풍 화살비: 자리 · 첫 화살까지 틱 · 남은 횟수 · 반지름 */
export interface RfStorm {
  x: number;
  y: number;
  t: number;
  n: number;
  r: number;
}

export interface RafaelPlayerState {
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 */
  rfStep?: number;
  rfGap?: number;
  /** 스킬 대기 틱 (넷) */
  rfCd?: number[];
  /** 표적 적 id (강한 순) · 다시 고를 틱 */
  rfMarks?: number[];
  rfMarkAt?: number;
  /** 바람 걸음 뒤 다음 공격이 저격 */
  rfEmp?: boolean;
  /** 폭풍 화살비 */
  rfStorms?: RfStorm[];
  /** 에테르 스코프 남은 틱 */
  rfScope?: number;
  /** 천공의 빛 화살 모으는 남은 틱 · 쏘는 방향 */
  rfCharge?: number;
  rfAim?: { x: number; y: number };
  /** 가만히 선 틱 · 지난 틱 자리 (숨 고르기) */
  rfStill?: number;
  rfLast?: { x: number; y: number };
  /** 지금 방 ("층/방", 바뀌면 화살비·표적을 거둠) */
  rfRoom?: string;
}

/** 효과: 화살(줄, style 0 화살 · 1 저격) · 돌풍 · 화살비 예고/떨어짐 · 스코프 · 모으기 · 천공의 빛 화살 · 끝 폭발 · 표적 맞힘 */
export type RafaelFx = "rfArrowFx" | "rfGustFx" | "rfStormFx" | "rfScopeFx" | "rfChargeFx" | "rfHeavenFx" | "rfBlastFx" | "rfMarkFx";
