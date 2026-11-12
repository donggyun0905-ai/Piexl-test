// 아리아 상태 타입 (sim/aria·arKit·arBurst·arFinale·arInstruments). 모두 선택 값 (예전 저장에는 없음)

/** 음표: 곧게 가는 자리(bx, by) · 방향 · 빠르기 · 둥실 폭 · 지난 틱 · 종류(0~7) · 반지름 · 피해 · 맞힌 적 · 남은 튕김 · 지금 자리(x, y) */
export interface ArNote {
  bx: number;
  by: number;
  dx: number;
  dy: number;
  spd: number;
  bob: number;
  age: number;
  kind: number;
  r: number;
  dmg: number;
  hit: number[];
  bounce: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
}

/** 악기 (kind 0 피아노 · 1 하프 · 2 호른 · 3 클라리넷): 자리 · 남은 틱 · 다음 연주까지 · 연주한 틱(그림) · 보는 쪽 */
export interface ArInst {
  kind: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  left: number;
  cd: number;
  playAt?: number;
  face: number;
}

/** 악기가 쏜 음표: 자리 · 방향 · 빠르기 · 피해 · 남은 틱 · 쫓는 적 · 종류(그림) · 출처 패시브 */
export interface ArShot {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  dx: number;
  dy: number;
  spd: number;
  dmg: number;
  left: number;
  tgt: number;
  kind: number;
  src: string;
}

/** 앙코르로 잠시 뒤 다시 터질 자리 */
export interface ArEcho {
  x: number;
  y: number;
  r: number;
  dmg: number;
  kind: number;
  t: number;
}

/** 영혼의 바이올린: 자리 · 다음 벰까지 · 벰이 남은 수·다음 벰까지 · 마지막으로 벤 틱(그림) */
export interface ArViolin {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  cd: number;
  hits: number;
  gap: number;
  swingAt?: number;
}

export interface AriaPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 공격한 틱(그림) */
  arCd?: number;
  arRoom?: number;
  arAtkAt?: number;
  /** 음표 · 악기 · 악기 음표 · 앙코르 · 바이올린 */
  arNotes?: ArNote[];
  arInst?: ArInst[];
  arShots?: ArShot[];
  arEchoes?: ArEcho[];
  arViolin?: ArViolin;
  /** 악보 완성: 남은 틱 · 다시 될 수 있는 틱 · 마지막 폭죽 틱(화면이 피해 숫자를 따로 띄움) */
  arFinale?: number;
  arFinaleReady?: number;
  arBoomAt?: number;
  /** 여덟 음표가 터진 수(그림·소리) · 확률을 굴린 수 */
  arBursts?: number;
  arRolls?: number;
}

export interface AriaEnemyState {
  /** 클라리넷 둘레에 있는 동안 (이 틱까지): 느려짐·공격 늦어짐·받는 피해 늘어남 */
  arLull?: number;
}

/** 효과: 여덟 음표 터짐(style 색) · 악보 완성 폭죽(style 색) · 앙코르 · 작은 북 울림 · 음표 맞음 · 바이올린 벰 · 악기 놓임(style 종류) · 악보 완성 시작 */
export type AriaFx = "arBurst" | "arBoom" | "arEncore" | "arEcho" | "arPop" | "arSweep" | "arPlace" | "arFinale";
