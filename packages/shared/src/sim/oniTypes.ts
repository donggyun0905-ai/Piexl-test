// 오니용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/** 바닥에 깔린 한파(빙각금봉)·서리(극한의 청전): 안에 2.5초 머문 적은 영령 (적마다 다시 쓰기 대기) */
export interface OniZone {
  x: number;
  y: number;
  r: number;
  ticks: number;
  kind: "frost" | "azure";
}

/** 적을 천천히 따라가며 빠르게 베는 폭풍 (풍신소환) */
export interface OniStorm {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  ticks: number;
  /** 한 번 벨 때 피해 · 다음 베기까지 */
  dmg: number;
  cd: number;
}

/** 해일 피해를 주변 적에게 나눠 주는 물보라 (류신금봉) */
export interface OniSplash {
  x: number;
  y: number;
  left: number;
  wait: number;
  dmg: number;
}

export interface OniPlayerState {
  /** 신인족 게이지(휘두른 횟수) · 신인족 남은 틱 */
  oGauge?: number;
  oGod?: number;
  /** 체력 재생력(5초마다 회복하는 양) · 추가 공격 효과 범위 배율 (공격 속도·사거리 아이템이 바뀐 것) */
  oRegen?: number;
  oReach?: number;
  oZones?: OniZone[];
  oStorms?: OniStorm[];
  oSplash?: OniSplash[];
  /** 한 번이라도 되살아남 (명계의 흑뢰봉·극한의 청전 조건) */
  revived?: boolean;
}

export interface OniEnemyState {
  /** 한파·서리 안에 머문 틱 · 영령 다시 쓰기까지 · 죽음 상태이상 남은 틱·1초 피해 */
  oChill?: number;
  oSpiritCd?: number;
  oDeath?: number;
  oDeathDmg?: number;
}
