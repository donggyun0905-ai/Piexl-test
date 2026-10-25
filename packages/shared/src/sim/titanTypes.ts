// 거인용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface TitanPlayerState {
  /** 기계팔 에너지 (맞은 피해가 쌓임, 다 차면 다음 공격이 강타) */
  tEnergy?: number;
  /** 방벽 팔 막기 남은 틱 · 자이로 안정기 남은 틱 · 반격 코일 다시 쓰기까지 · 강타를 휘두른 뒤 그리기용 틱 */
  tBrace?: number;
  tGyro?: number;
  tCoil?: number;
  tSwing?: number;
  /** 패링 남은 틱 (대시 대신) · 드릴 강타 돌진 남은 틱 · 그동안 한 번 깎는 피해 */
  tParry?: number;
  tDrill?: number;
  tDrillDmg?: number;
}
