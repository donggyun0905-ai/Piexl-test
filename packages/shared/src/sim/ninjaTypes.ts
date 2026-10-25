// 닌자용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/**
 * 그림자 하나. strike 적 뒤에서 베기 · cross X자 베기 · spike 땅에서 가시 · dash 환영진(원 위 한 점에서 가운데로 돌진) · smoke 연막 구름
 * (x, y) 지금 자리 · (sx, sy) 돌진 시작 자리 · (tx, ty) 노리는 자리 · t 지난 틱 · life 사라지는 틱
 */
export interface Shade {
  kind: "strike" | "cross" | "spike" | "dash" | "smoke";
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  t: number;
  life: number;
  dmg: number;
  /** 노리는 적 id (없으면 0) · 이미 벤 적 · 몇 번째로 옮겨 붙은 그림자인지 (그림자 연쇄) */
  target: number;
  hitIds: number[];
  chain: number;
}

export interface NinjaPlayerState {
  shades?: Shade[];
  /** 그림자 질주: 공격 속도가 빨라진 남은 틱 */
  kageTicks?: number;
}

export interface NinjaEnemyState {
  /** 닌자 표식 수 (다 차면 그림자가 나오고 0으로) */
  marks?: number;
}

export interface NinjaShotState {
  /** 맞으면 표식 · 독(0.5초마다 이만큼) · 그림자 꿰매기(맞은 적이 잠깐 묶임) */
  mark?: boolean;
  venom?: number;
  pin?: boolean;
}
