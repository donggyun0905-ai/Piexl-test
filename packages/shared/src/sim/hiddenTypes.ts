// 히든 상점(차원의 순례자)·히든 아이템 상태 (sim/pilgrim·hiddenPerks). 모두 선택 값 (예전 저장에는 없음)

/** 방에 와 있는 차원의 순례자: 방 · 포탈에서 나온 틱 · 물건을 펼쳤는지 */
export interface PilgrimState {
  room: number;
  t0: number;
  shown: boolean;
  /** 물건을 펼쳐 준 자리 (협동은 사람마다) */
  seats?: number[];
}

export interface HiddenRunState {
  /** 이 판에 히든 상점이 나올 수 있음 (혼자 하기·무한·협동, 화면이 판을 시작할 때 켬) */
  pilgrim?: boolean;
  /** 이 층에 와 있는 순례자 */
  pilgrimNpc?: PilgrimState;
  /** 이번 판 순례자를 만난 횟수 (로비 전시장 누적용) */
  pilgrimMet?: number;
}

/** 이프리트의 발톱: 겹친 화상 수 */
export interface HiddenEnemyState {
  ifrit?: number;
}

export interface HiddenPlayerState {
  /** 금기된 아티팩트: 색마다 쌓인 처치 수 */
  relics?: Record<string, number>;
  /** 떨어진 신의 파편: 얻은 힘 (0~9) */
  shardPick?: number;
}
