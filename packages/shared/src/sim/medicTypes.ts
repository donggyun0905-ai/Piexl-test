// 의사용 상태 타입. 모두 선택 값 (예전 저장에는 없음). 보호막은 LaserPlayerState.shieldPts를 같이 씀

export interface MedicPlayerState {
  /** 공격 회복: 1초 구간 시작 틱과 그 구간에 회복한 양 (초당 상한) */
  leechTick?: number;
  leechSum?: number;
  /** 체력이 가득 찬 채로 지난 틱 (건강 검진) */
  fullTicks?: number;
  /** 맞은 뒤 이동 속도 증가 남은 틱 (의사 가운) */
  gownTicks?: number;
  /** 항체 반응: 모아 둔 반사 피해, 마지막으로 터진 틱 */
  antiStore?: number;
  antiLast?: number;
  /** 회복 + 표시를 마지막으로 띄운 틱 (너무 자주 안 띄우게) */
  plusTick?: number;
  /** 수혈 튜브가 꽂힌 적 id */
  tubeTargetId?: number;
}

export interface MedicEnemyState {
  /** 붕대 채찍 속박: 움직이지 못함 (공격은 함) */
  rootTicks?: number;
}
