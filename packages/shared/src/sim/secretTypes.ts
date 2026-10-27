// 시즌 2 히든 캐릭터(에테르 광부·운명의 여행자·제우스) 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/** 땅에 남는 것: 자리 · 남은 틱 (피해는 놓을 때 정함) */
export interface GroundMark {
  x: number;
  y: number;
  t: number;
  dmg?: number;
  /** 갈라짐 끝 자리 · 이미 맞은 적(구덩이에 빠진 보스) */
  tx?: number;
  ty?: number;
  hit?: number[];
  /** 범위 · 종류 (운명의 여행자 화살비·운석·목마) */
  r?: number;
  kind?: string;
}

export interface MinerPlayerState {
  /** 에테르 광부: 광산 붕괴까지 모인 원석 · 이번 판 캔 원석 · 에테르 결정 · 땅 갈라짐 · 떨어지는 바위 · 다이너마이트 · 구덩이 */
  mnOre?: number;
  mnTotal?: number;
  mnNodes?: GroundMark[];
  mnCracks?: GroundMark[];
  mnRocks?: GroundMark[];
  mnBombs?: GroundMark[];
  mnPits?: GroundMark[];
  /** 땅굴(대시) 중 · 카나리아 다시 울 수 있는 틱 · 지난 틱 체력 */
  mnBurrow?: boolean;
  mnCanaryT?: number;
  mnHp?: number;
}

export interface MinerEnemyState {
  /** 보석으로 굳은 틱까지 */
  mnGemT?: number;
}

export interface VoyagerFateState {
  /** 운명 칸(0~35) · 주사위 눈(하나 또는 둘) · 세기(눈의 합) · 버프 두 배(같은 눈) */
  i: number;
  dice: number[];
  pips: number;
  blessed?: boolean;
}

export interface VoyagerPlayerState {
  /** 운명의 여행자: 모래시계(찬 틱) · 지금 운명 · 바로 전 운명(운명 붙잡기) · 몇 번째 뒤집힘 · 모은 틱 · 첫 발(first 버프) */
  vyGlass?: number;
  vyFate?: VoyagerFateState;
  vyPrev?: VoyagerFateState;
  vyFlips?: number;
  vyCharge?: number;
  vyFirst?: boolean;
  /** 잇따라 쏠 화살(남은 틱) · 떨어질 화살비·운석·목마 · 능력마다 다음까지 틱 · 지난 틱까지 본 처치 수 */
  vyVolley?: { t: number; mul: number }[];
  vyMarks?: GroundMark[];
  vyCd?: Record<string, number>;
  vySeen?: number;
}

export interface VoyagerEnemyState {
  /** 운명의 여행자 버프로 더 아픈 틱까지 · 더 받는 비율 */
  vyShredT?: number;
  vyShred?: number;
}

/** 시즌 2 히든 캐릭터 상태 모음 (types에서 한 이름으로 씀) */
export interface SecretPlayerState extends MinerPlayerState, VoyagerPlayerState {}
export interface SecretEnemyState extends MinerEnemyState, VoyagerEnemyState {}
