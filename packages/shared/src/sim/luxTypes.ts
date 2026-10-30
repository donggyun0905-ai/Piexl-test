// 빛의 사도(sim/lux) 상태: 기다리는 '+' 빛의 검 · 빛의 적 표시 · 빛의 칼날 탄
export interface LuxCross {
  /** 생기는 틱 · 자리 · 45° 돌림 · 팔 길이 · 피해 */
  at: number;
  x: number;
  y: number;
  rot: boolean;
  arm: number;
  dmg: number;
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
}

export interface LuxShotState {
  /** 빛의 칼날 (성장 단계 + 1) */
  lx?: number;
}
