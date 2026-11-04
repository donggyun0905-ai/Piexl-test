// 펜리르 상태 타입 (sim/fenrir). 모두 선택 값 (예전 저장에는 없음)

/** 바닥을 그으며 나아가는 검기 하나 (big: 3타 지면 검기, 아니면 착지 검기) */
export interface FenrirWave {
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  max: number;
  sp: number;
  w: number;
  dmg: number;
  big: boolean;
  hit: number[];
}

/** 난도: 한 자리에서 남은 베기 · 다음 베기까지 · 한 번 피해 · 반지름 · 몇 번째 */
export interface FenrirFlurry {
  x: number;
  y: number;
  left: number;
  t: number;
  dmg: number;
  r: number;
  i: number;
}

export interface FenrirPlayerState {
  /** 콤보 진행 (몇 번째 기술 · 다음 기술까지 틱) · 천랑 낙인으로 뛰어오른 남은 틱 */
  fnCombo?: { i: number; t: number };
  fnAir?: number;
  /** 나아가는 검기들 · 난도 · 대지 가르기 균열(남은 틱) */
  fnWaves?: FenrirWave[];
  fnFlurry?: FenrirFlurry;
  fnCracks?: { x: number; y: number; t: number }[];
  /** 늙은 늑대의 지혜 남은 틱 · 사냥 본능 남은 틱 · 선왕의 광륜을 쓴 층 */
  fnWise?: number;
  fnHuntT?: number;
  fnHaloFloor?: number;
  /** 화면·소리용: 천랑 낙인 착지 수 */
  fnFalls?: number;
}
