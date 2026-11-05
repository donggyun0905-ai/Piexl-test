// 오르카 상태 타입 (sim/orca). 모두 선택 값 (예전 저장에는 없음)

/** 상어 기공파: 자리 · 헤엄 방향 · 남은 틱 · 남은 사냥 횟수 · 이미 문 적 · 크기 · 피해 배율 · 쫓는 적 */
export interface OcShark {
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  left: number;
  bit: number[];
  size: number;
  mul: number;
  prey?: number;
}

/** 소용돌이 장판: 자리 · 남은 틱 */
export interface OcPool {
  x: number;
  y: number;
  t: number;
}

/** 해방: 범고래 돌파 · 방향 · 남은 틱 · 부딪힌 적 */
export interface OcBreach {
  dx: number;
  dy: number;
  t: number;
  hit: number[];
}

export interface OrcaPlayerState {
  /** 다음 콤보 단계 (0~3) · 마지막으로 때린 뒤 틱 */
  ocStep?: number;
  ocGap?: number;
  /** 해방 게이지 (0~ORCA.tideMax) */
  ocTide?: number;
  /** 날아가는 상어들 · 소용돌이 장판 · 범고래 돌파 */
  ocSharks?: OcShark[];
  ocPools?: OcPool[];
  ocBreach?: OcBreach;
  /** 지난 틱에 대시 중이었는지 (대시 시작 알아채기) */
  ocDash?: boolean;
  /** 파도 타기 남은 틱 · 해방의 노래 남은 틱 */
  ocSurf?: number;
  ocFury?: number;
  /** 마지막으로 때린 콤보 단계 · 틱 (주먹 그림) */
  ocLast?: { k: number; t: number };
  /** 지금 방 ("층/방", 바뀌면 상어·장판을 거둠) */
  ocRoom?: string;
}

/** 효과: 물보라 잽 · 소용돌이 훅 · 물기둥 · 상어 물기 · 상어 터짐 · 해방 준비 · 범고래 돌파 · 큰 파도 */
export type OrcaFx = "ocSpray" | "ocWhirl" | "ocGeyser" | "ocBite" | "ocBurst" | "ocReady" | "ocBreach" | "ocWave";
