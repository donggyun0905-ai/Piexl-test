// 아수라 상태 타입 (sim/asura·asHit·asMoves·asAwake). 모두 선택 값 (예전 저장에는 없음)

/** 분쇄로 나눠 때리는 남은 피해: 적 · 한 대 피해 · 남은 수 · 방향 */
export interface AsSplit {
  id: number;
  dmg: number;
  left: number;
  dx: number;
  dy: number;
}

/** 연발 연속 펀치: 자리 · 방향 · 반지름 · 한 대 피해 · 남은 수 · 처음 수(그림 차례) */
export interface AsRapid {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  dmg: number;
  left: number;
  n: number;
}

/** 육비 난무: 날아가는 귀신 주먹 */
export interface AsFist {
  x: number;
  y: number;
  dx: number;
  dy: number;
  age: number;
  dmg: number;
}

/** 파동을 기다리는 공격: 칠 틱 · 자리 · 방향 · 크기 배율 */
export interface AsWave {
  at: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
}

/** 이번 틱에 아수라가 준 한 대 (화면이 피해 숫자를 한 대마다 따로 띄움, 게임 계산에는 안 씀) */
export interface AsHitLog {
  id: number;
  amt: number;
  crit: boolean;
}

export interface AsuraPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 친 틱(그림) · 친 수(그림 칸 고르기) */
  asCd?: number;
  asRoom?: number;
  asAtkAt?: number;
  asHits?: number;
  /** 나눠 때리는 피해 · 연속 펀치 · 날아가는 주먹 · 기다리는 파동 */
  asSplit?: AsSplit[];
  asRapids?: AsRapid[];
  asFists?: AsFist[];
  asWaves?: AsWave[];
  /** 아수라 각성 남은 틱 · 처음 틱(그림) · 각성 공격 차례(0·1 = 1·2타, 2 = 3타, 3 = 4타) · 3타 남은 내리치기 · 다음 내리치기까지 */
  asAwake?: number;
  asAwakeAt?: number;
  asStep?: number;
  asPound?: number;
  asPoundCd?: number;
  /** 수라장 쌓임 · 마지막으로 맞힌 틱 */
  asFury?: number;
  asFuryAt?: number;
  /** 귀신 걸음: 다음 주먹이 크게 · 지난 틱에 대시 중이었는지 */
  asStepBig?: boolean;
  asDash?: boolean;
  /** 이번 틱에 준 한 대 한 대 · 그 틱 (화면 피해 숫자용) */
  asLog?: AsHitLog[];
  asLogT?: number;
  /** 악귀·각성 확률 굴린 수 (시드) */
  asRolls?: number;
}

export interface AsuraEnemyState {
  /** 귀진 표식이 붙어 있는 마지막 틱 (영역 안에 있으면 이번 틱) */
  asMark?: number;
}

/** 효과: 기본 펀치 · 연속 펀치 · 파동 · 악귀 터짐 · 각성 1·2타 · 3타 · 4타 · 육비 난무 맞음 */
export type AsuraFx = "asPunch" | "asRapid" | "asWave" | "asDemon" | "asAwk12" | "asAwk3" | "asAwk4" | "asFistHit";
