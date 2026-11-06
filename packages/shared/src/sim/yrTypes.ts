// 유리엘 상태 타입 (sim/yuriel). 모두 선택 값 (예전 저장에는 없음)

/** 결계: 가운데 · 반지름 · 남은 틱 */
export interface YrWard {
  x: number;
  y: number;
  r: number;
  t: number;
}

/** 던진 집행의 철퇴: 떨어질 자리 · 남은 틱 · 반지름 */
export interface YrMace {
  x: number;
  y: number;
  t: number;
  r: number;
}

export interface YurielPlayerState {
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 · 마지막 공격(그림) */
  yrStep?: number;
  yrGap?: number;
  yrLast?: { k: number; t: number };
  /** 스킬 대기 틱 (넷) */
  yrCd?: number[];
  /** 수호 결계 */
  yrWard?: YrWard;
  /** 날아가는 집행의 철퇴 */
  yrMace?: YrMace;
  /** 성녀의 단죄: 내리꽂히기까지 남은 틱 · 성녀 강림 남은 틱 */
  yrUlt?: number;
  yrSaint?: number;
  /** 지금 방 ("층/방", 바뀌면 결계·철퇴를 거둠) */
  yrRoom?: string;
}

export interface YurielEnemyState {
  /** 쌓인 단죄 (가득 차면 정화의 빛) */
  yrSin?: number;
}

/** 효과: 철퇴 휘두르기 · 사슬 한 바퀴 · 정화의 빛 터짐 · 1 정화의 빛 · 2 철퇴 던지기 · 철퇴 떨어짐 · 3 수호 결계 · 4 모으기 · 4 내리꽂힘 · 회복 */
export type YurielFx = "yrSwingFx" | "yrSpinFx" | "yrPurgeFx" | "yrLightFx" | "yrMaceFx" | "yrSlamFx" | "yrWardFx" | "yrUltFx" | "yrHolyFx" | "yrHealFx";
