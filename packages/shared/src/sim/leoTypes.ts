// 레오 상태 타입 (sim/leo). 모두 선택 값 (예전 저장에는 없음)

export interface LeoPlayerState {
  /** 공격 수(물기 차례) · 전하 · 보석 낙뢰까지 틱 · 뇌운까지 틱 · 갈기까지 틱 · 지난 틱 대시 · 갑주 방전 대기 · 사자후 낸 수 */
  leHits?: number;
  leVolt?: number;
  leGem?: number;
  leStorm?: number;
  leMane?: number;
  leDashing?: boolean;
  leArmorCd?: number;
  leRoars?: number;
}

export interface LeoEnemyState {
  /** 뇌인 겹 · 남은 틱 */
  leMark?: number;
  leMarkT?: number;
}
