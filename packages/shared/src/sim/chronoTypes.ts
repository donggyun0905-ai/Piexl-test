// 시간술사용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/**
 * 잔상 하나: at 틱이 되면 (x, y)에서 (fx, fy) 쪽으로 같은 공격을 mul 배율로 함
 * (tx, ty) 시한폭탄이 떨어질 자리 · target 예지가 노리는 적 · depth 몇 번째 잔상인지 · born 생긴 틱 (그리기용)
 */
export interface Echo {
  at: number;
  born: number;
  x: number;
  y: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  target: number;
  mul: number;
  depth: number;
}

/** 예지: at 틱에 그 적 자리에 떨어지는 낙뢰 */
export interface Foresight {
  at: number;
  target: number;
  x: number;
  y: number;
  dmg: number;
}

export interface ChronoPlayerState {
  echoes?: Echo[];
  foresights?: Foresight[];
}

export interface ChronoShotState {
  /** 맞은 적이 이만큼(틱) 느려짐 (모래시계·시간 감속) */
  slow?: number;
  /** 잔상이 쏜 탄 (영원: 맞히면 회복) */
  echo?: boolean;
}
