// 리바이어 상태 타입 (sim/levia). 모두 선택 값 (예전 저장에는 없음)

/** 고래 대돌격 하나 (투사체처럼 날아가는 고래): 자리 · 방향 · 남은 틱 · 속도 · 몸 크기 · 피해 · 맞은 적 · 아기 고래 · 다음 웅덩이까지 */
export interface LvWhale {
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  sp: number;
  r: number;
  dmg: number;
  hit: number[];
  calf?: boolean;
  pool?: number;
}

/** 해류 웅덩이 (자리 · 남은 틱 · 다음 때리기까지 · 반지름) */
export interface LvPool {
  x: number;
  y: number;
  t: number;
  cd: number;
  r: number;
}

export interface LeviaPlayerState {
  /** 다음에 칠 타 (0 1타 · 1 2타 찌르기 · 2 3타 회전 · 3 4타 돌진) · 이어 칠 수 있는 남은 틱 */
  lvStep?: number;
  lvGap?: number;
  /** 고래가 안 나온 횟수 (확률이 오름) · 흰 고래로 오른 확률 */
  lvMiss?: number;
  lvWhite?: number;
  /** 4타 돌진 중 (1 = 고래 없이 · 2 = 고래와 같이) */
  lvRush?: number;
  /** 날아가는 고래들 · 해류 웅덩이 */
  lvWhales?: LvWhale[];
  lvPools?: LvPool[];
  /** 용연향 남은 틱 · 대시 중이었는지 · 닻 없는 배 남은 틱 */
  lvHaste?: number;
  lvDashing?: boolean;
  lvFree?: number;
  /** 지금 방 ("층/방", 바뀌면 고래·웅덩이 사라짐) */
  lvRoom?: string;
}
