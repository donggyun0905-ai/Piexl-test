// 오리(히든)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/** 줄지어 따라오는 새끼 오리 하나 */
export interface Duckling {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  /** 적 탄을 다시 막을 수 있기까지 남은 틱 */
  cd: number;
  /** 바라보는 쪽 (그리기용, -1 왼쪽) */
  face: number;
}

export interface DuckPlayerState {
  ducklings?: Duckling[];
  /** 지금까지 꽥 한 횟수 (큰 꽥 주기) */
  quacks?: number;
}
