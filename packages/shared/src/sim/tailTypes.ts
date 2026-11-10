// 테일 상태 타입 (sim/tail). 모두 선택 값 (예전 저장에는 없음)

/** 상어 하나: k 0 삼키기 · 1 돌진 · 2 낙하 · 자리(목표) · 남은 틱 · 처음 틱 · 노리는 적 · 돌진 방향·속도 · 크기 · 피해 · 맞은 적 */
export interface TlShark {
  k: 0 | 1 | 2;
  x: number;
  y: number;
  t: number;
  t0: number;
  id: number;
  dx: number;
  dy: number;
  sp: number;
  r: number;
  dmg: number;
  hit: number[];
}

/** 마무리 물기 (물 상어가 되어 돌진 중): 노리는 적 · 남은 틱 · 방향 */
export interface TlBite {
  id: number;
  t: number;
  dx: number;
  dy: number;
}

export interface TailPlayerState {
  /** 다음에 칠 타 (0 1타 · 1 2타 · 2 3타) · 이어 칠 수 있는 남은 틱 */
  tlStep?: number;
  tlGap?: number;
  /** 다음 상어까지 틱 · 나와 있는 상어들 */
  tlCd?: number;
  tlSharks?: TlShark[];
  /** 마무리 물기 중 · 다시 쓰기까지 틱 */
  tlBite?: TlBite;
  tlBiteCd?: number;
  /** 지금 방 ("층/방", 바뀌면 상어가 사라짐) */
  tlRoom?: string;
}

/** 효과 (sim/tail·tailSea): 꼬리 위→아래·아래→위·내려치기 · 상어 삼키기·튀어나옴·잠수·낙하 · 번개 · 변신·돌진·씹기 */
export type TailFx = "tlDown" | "tlUp" | "tlSmash" | "tlMaw" | "tlLeap" | "tlSplash" | "tlSlam" | "tlBolt" | "tlMorph" | "tlDart" | "tlChomp";
