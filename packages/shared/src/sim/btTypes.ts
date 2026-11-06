// 베아트리스 상태 타입 (sim/beatrice). 모두 선택 값 (예전 저장에는 없음)

/** 처단: 맞힐 적 · 남은 X자 수 · 다음 X자까지 틱 · 피해 배율 */
export interface BtExec {
  id: number;
  left: number;
  gap: number;
  mul: number;
}

/** 태양의 낙인 검기: 자리 · 방향 · 남은 거리 · 폭 · 맞은 적 */
export interface BtWave {
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
  w: number;
  hit: number[];
}

export interface BeatricePlayerState {
  /** 다음 기본 베기 단계 (0~2) · 마지막으로 벤 뒤 틱 · 마지막 베기(그림) */
  btStep?: number;
  btGap?: number;
  btLast?: { k: number; t: number };
  /** 스킬 대기 틱 (넷) */
  btCd?: number[];
  /** 태양 검날 남은 틱 · 자애 남은 틱 · 자애 뒤 회복 불가 남은 틱 */
  btSolar?: number;
  btGrace?: number;
  btNoHeal?: number;
  /** 일식의 춤 뒤 강화 베기 남은 수 · 다음 강화 베기까지 틱 (0이면 다음 기본 공격에) */
  btTwin?: number;
  btTwinGap?: number;
  /** 처단 중인 것들 · 날아가는 낙인 검기 */
  btExecs?: BtExec[];
  btWaves?: BtWave[];
  /** 처단으로 지운 악 (심판까지) · 심판 예고 남은 틱 */
  btPurged?: number;
  btJudge?: number;
  /** 백은의 갑주: 맞은 뒤 재생력 더함 남은 틱 */
  btSilverT?: number;
  /** 지금 방 ("층/방", 바뀌면 처단·검기를 거둠) */
  btRoom?: string;
}

export interface BeatriceEnemyState {
  /** 악 (0~10) · 화상 겹 · 화상 남은 틱 */
  btEvil?: number;
  btBurn?: number;
  btBurnT?: number;
}

/** 효과: 베기 · X자 터짐 · 강화 쌍검 베기 · 처단 X자 · 심판 예고 · 심판 · 낙인 검기 · 태양 검날 켬 · 자애 · 화상 불티 · 악 쌓임 · 홍염 */
export type BeatriceFx = "btSlash" | "btCross" | "btTwin" | "btExec" | "btJudgeWarn" | "btJudge" | "btBrand" | "btSolar" | "btGrace" | "btBurn" | "btEvil" | "btFlare";
