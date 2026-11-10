// 네일러 상태 타입 (sim/nailer). 모두 선택 값 (예전 저장에는 없음)

/** 날아가는 못: 자리 · 빠르기 · 남은 틱 · 피해 배율 · 쫓는 적 id (못비) · 그림 (0 가벼움 · 1 빠름 · 2 연달아 · 3 못비) */
export interface NlNail {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  mul: number;
  tg?: number;
  k: number;
}

/** 2 붉은 실: 바닥에 박은 못 자리 · 노린 적 id · 남은 틱(2번을 누를 수 있는) · 단계 (0 돌진 중 · 1 기다림 · 2 돌아가는 중) */
export interface NlTie {
  ax: number;
  ay: number;
  id?: number;
  t: number;
  ph: number;
}

/** 3 저주의 도화선: 터질 적 id · 남은 틱 · 터뜨리는 못 수 */
export interface NlDet {
  id: number;
  t: number;
  n: number;
}

/** 4 심판의 못비: 노린 적 id · 남은 연타 · 다음까지 틱 · 서 있는 자리 */
export interface NlUlt {
  id: number;
  n: number;
  t: number;
  ax: number;
  ay: number;
}

export interface NailerPlayerState {
  /** 스킬 대기 틱 (넷) */
  nlCd?: number[];
  /** 1 못 던지기: 다음 단계 (0~2) · 다음 단계를 누를 수 있는 남은 틱 · 막는 틱 */
  nlStage?: number;
  nlStageT?: number;
  nlLock?: number;
  /** 1 못 던지기 3단계: 아직 안 나간 못 수 · 다음까지 틱 */
  nlBurst?: number;
  nlBurstT?: number;
  /** 날아가는 못 · 붉은 실 · 터질 도화선 · 못비 */
  nlShots?: NlNail[];
  nlTie?: NlTie;
  nlDets?: NlDet[];
  nlUlt?: NlUlt;
  /** 마지막 망치질 (그림) */
  nlLast?: number;
  /** 지금 방 ("층/방", 바뀌면 못·실을 거둠) */
  nlRoom?: string;
}

/** 적에게 박힌 못 수 (한도 없음, 체력 줄 위에 못 ×개수) */
export interface NailerEnemyState {
  nlNails?: number;
}

/** 효과: 망치 내려치기 (size = 거리) · 못이 박힘 · 붉은 실 망치 원 (size = 반지름) · 바닥에 박은 못 · 고정 못 다섯 · 도화선 터짐 (size = 못 수) · 못비 망치질 */
export type NailerFx = "nlSwingFx" | "nlStickFx" | "nlSmashFx" | "nlAnchorFx" | "nlPinFx" | "nlCurseFx" | "nlUltFx";
