// 가브리엘 상태 타입 (sim/gabriel). 모두 선택 값 (예전 저장에는 없음)

/** 하늘에서 떨어지는 빛의 망치: 자리 · 남은 틱 · 반지름 · 피해 · 기절 틱 · 압박하는지 */
export interface GbDrop {
  x: number;
  y: number;
  t: number;
  r: number;
  dmg: number;
  stun: number;
  press: boolean;
}

export interface GabrielPlayerState {
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 · 마지막 공격(그림) */
  gbStep?: number;
  gbGap?: number;
  gbLast?: { k: number; t: number };
  /** 스킬 대기 틱 (넷) */
  gbCd?: number[];
  /** 불멸의 성벽 남은 틱 · 영역 가운데 */
  gbUlt?: number;
  gbZone?: { x: number; y: number; r: number };
  /** 궁극기로 준 보호막 가운데 아직 남은 양 (끝나면 천천히 줄어듦) */
  gbGrant?: number;
  /** 떨어지는 빛의 망치 */
  gbDrops?: GbDrop[];
  /** 지금 방 ("층/방", 바뀌면 망치·영역을 거둠) */
  gbRoom?: string;
}

export interface GabrielEnemyState {
  /** 압박 남은 틱 (느려짐) */
  gbPress?: number;
}

/** 효과: 망치 휘두르기 · 대지 강타 · 빛의 망치(그림) · 방패 돌진 · 중력 붕괴 · 성벽 · 불멸의 성벽 · 가시 방패 */
export type GabrielFx = "gbSwing" | "gbSlam" | "gbHammer" | "gbBash" | "gbWell" | "gbWall" | "gbUlt" | "gbThorn";
