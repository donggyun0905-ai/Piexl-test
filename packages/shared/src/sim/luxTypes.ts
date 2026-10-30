// 빛의 사도(sim/lux) 상태: 기다리는 '+' 빛의 검 · 빛의 적 표시
export interface LuxCross {
  /** 생기는 틱 · 자리 · 45° 돌림 · 팔 길이 · 피해 · 붉은 검(꿰뚫는 빛의 두 번째 검) · 평타 검(코드 그림, 꿰뚫는 빛 없음) */
  at: number;
  x: number;
  y: number;
  rot: boolean;
  arm: number;
  dmg: number;
  red?: boolean;
  plain?: boolean;
}

export interface LuxPlayerState {
  lxQ?: LuxCross[];
  /** 지난번 성장 단계 (커지는 순간 효과) */
  lxStage?: number;
}

export interface LuxEnemyState {
  /** 떨어진 빛의 힘을 얻은 적 (쓰러지면 빛의 조각) · 빛을 훔친 그림자(1대1) */
  lux?: boolean;
  luxDuel?: boolean;
  /** 강한 적 방(주황 방)의 정예: 크고 단단함 (sim/rooms.spawnEnemies) */
  champ?: boolean;
}
