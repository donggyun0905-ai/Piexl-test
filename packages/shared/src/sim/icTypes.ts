// 인시전 상태 타입 (sim/incision). 모두 선택 값 (예전 저장에는 없음)

/** 곧 터질 공격: 종류 (0 피의 길 · 1 갈라진 땅) · 자리 (피의 길은 x0,y0 → x,y) · 남은 틱 · 피해 배율 · 폭(반)/반지름 · 다음 베기까지 틱 (갈라진 땅) */
export interface IcZone {
  k: number;
  x0: number;
  y0: number;
  x: number;
  y: number;
  t: number;
  mul: number;
  r: number;
  next?: number;
}

/** 날아가는 초승달: 자리 · 빠르기 · 남은 틱 · 이미 벤 적 id */
export interface IcWave {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  hit: number[];
}

/** 도살 도약: 출발 (x0,y0) → 착지 (x,y) · 남은 틱 · 전체 틱 · 피해 배율 · 노린 적 id · 연속 도약인지 */
export interface IcLeap {
  x0: number;
  y0: number;
  x: number;
  y: number;
  t: number;
  max: number;
  mul: number;
  tg: number;
  second?: boolean;
}

export interface IncisionPlayerState {
  /** 다음 박자 (0 오른 베기 · 1 왼 베기 · 2 교차 · 3 회오리) · 공격할 수 있게 된 뒤 쉰 틱 · 마지막 박자 (그리기·자세) */
  icStep?: number;
  icGap?: number;
  icLast?: { k: number; t: number };
  /** 도륙 콤보 · 마지막으로 맞힌 뒤 틱 · 다음 도살 도약 콤보 · 도약 준비됨 · 지난 틱 체력 (맞으면 콤보 잃음) */
  icCombo?: number;
  icIdle?: number;
  icNextLeap?: number;
  icLeapReady?: boolean;
  icHp?: number;
  /** 날고 있는 도약 */
  icLeap?: IcLeap;
  /** 날아가는 초승달 */
  icWaves?: IcWave[];
  /** 피의 길·갈라진 땅 */
  icZones?: IcZone[];
  /** 피의 소용돌이 남은 틱 · 다음 베기까지 틱 */
  icVortex?: number;
  icVortexT?: number;
  /** 지난 틱에 대시 중이었는지 · 대시 시작 자리 · 이번 대시에 벤 적 id와 벤 수 · 다음 벨 틱 */
  icDash?: boolean;
  icDashX?: number;
  icDashY?: number;
  icDashHit?: Record<number, number>;
  icDashT?: number;
  /** 지금 방 ("층/방", 바뀌면 남은 공격을 거둠) */
  icRoom?: string;
}

/** 효과: 1·2타 베기 (사용자 그림 초승달, flip = 왼 도끼 · size = 거리) · 교차 (X자) · 회오리 (몸 둘레) · 돌진 연참 · 도약 뜀/착지 · 광란 각성 (쌍도끼 강타)
 * 날아가는 초승달 · 도륙 폭발 · 피의 길 (toX,toY) · 갈라진 땅 · 학살 · 콤보 단계 오름 */
export type IncisionFx =
  | "icSlashFx"
  | "icCrossFx"
  | "icWhirlFx"
  | "icRushFx"
  | "icJumpFx"
  | "icLandFx"
  | "icAwakeFx"
  | "icBurstFx"
  | "icTrailFx"
  | "icQuakeFx"
  | "icCarnageFx"
  | "icTierFx";
