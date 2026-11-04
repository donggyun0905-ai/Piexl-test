// 이클립스 상태 타입 (sim/eclipse·eclipseZone). 모두 선택 값 (예전 저장에는 없음)

/** 날아가는 검격 하나 (sun: 태양 직각 검격, 아니면 일식 초승달 참격) */
export interface EclipseCut {
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  max: number;
  sp: number;
  w: number;
  dmg: number;
  sun: boolean;
  /** 그리기용: 검격 모양 (태양 1~5타 · 크기 배율) */
  k: number;
  size: number;
  hit: number[];
}

/** 일식 낙하 뒤 가운데에 남는 블랙홀 */
export interface EclipseHole {
  x: number;
  y: number;
  t: number;
  max: number;
  r: number;
  pull: number;
  dmg: number;
}

export interface EclipsePlayerState {
  /** 일식(남자) 모습인지 · 게이지 · 바뀌는 중 남은 틱 */
  ecNight?: boolean;
  ecGauge?: number;
  ecShift?: number;
  /** 콤보 진행 (몇 번째 기술 · 다음 기술까지 틱) · 일식 낙하로 뛰어오른 남은 틱 */
  ecCombo?: { i: number; t: number };
  ecAir?: number;
  /** 날아가는 검격들 · 블랙홀 · 그림자 돌진(남은 틱·맞힌 적) */
  ecCuts?: EclipseCut[];
  ecHoles?: EclipseHole[];
  ecRush?: { t: number; dx: number; dy: number; dmg: number; hit: number[] };
  /** 헬리오스의 왕관 남은 틱 */
  ecCrownT?: number;
  /** 화면·소리용: 일식 낙하 수 · 바뀐 수 */
  ecSlams?: number;
  ecShifts?: number;
}
