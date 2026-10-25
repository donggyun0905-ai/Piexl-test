// 서기관(히든)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface ScribePlayerState {
  /** 지금까지 쏜 잉크 탄 수 (글자 주기 · 아카식 원본 글자 차례) */
  writes?: number;
  /** 서문: 처음 공격한 방 ("층/방") */
  scRoom?: string;
}

export interface ScribeEnemyState {
  /** 새겨진 기록 (잉크) 수 */
  ink?: number;
}
