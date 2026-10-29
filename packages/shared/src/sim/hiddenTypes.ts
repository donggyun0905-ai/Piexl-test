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
  /** 포탈건이 기억한 방 */
  portalMark?: { floor: number; room: number };
  /** 테라포밍: 이 층 보스를 바꿈 */
  terraBoss?: { floor: number; kind: string };
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
  /** 고르는 창이 열림 (저주받은 주사위 숫자 · 테라포밍 보스) */
  hdPick?: "curse" | "terra";
  /** 운명의 주사위 6이 나온 수 · 저주받은 주사위 보물 · 저주로 최대 체력 고정 */
  fateSix?: number;
  curseWin?: boolean;
  curseHp?: number;
  /** 블리자드 랜스: 다음에 날릴 수 있는 틱 · 날아가 있는 동안 (등 뒤 창 그림을 숨김) */
  lanceAt?: number;
  lanceOut?: number;
}
