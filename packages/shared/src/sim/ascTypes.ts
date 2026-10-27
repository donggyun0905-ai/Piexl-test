// 아스칼론 시즌 2 캐릭터 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface AscPlayerState {
  /** 추적자: 스킬 셋 남은 대기 틱 · 암습 저격(남은 발·남은 틱·다음 발까지) · 강력한 한방 모으는 남은 틱 · 연발사격(남은 발·다음 발까지) · 마지막 저격 틱(반동) · 지난 틱 대시 */
  trCd?: number[];
  trAmbush?: { shots: number; t: number; gap: number };
  trCharge?: number;
  trBurst?: { left: number; gap: number };
  trShot?: number;
  trDash?: boolean;
  /** 이 틱에 누른 스킬 키 (0 = 없음, 1~3) */
  trKey?: number;
  /** 위장복 남은 틱 · 강력한 한방을 쓴 횟수 */
  trCamo?: number;
  trUsed?: number;
}

export interface AscEnemyState {
  /** 추적자 사냥감 표식 남은 틱 */
  trMarked?: number;
}

export interface ForgottenPlayerState {
  /** 잊혀진 자: 빛의 고리에 모인 처치 수 · 지난 틱까지 본 처치 수 · 신족 남은 틱 · 떨어지는 빛 십자가 · 공격 횟수(성흔) */
  fgRing?: number;
  fgSeen?: number;
  fgGod?: number;
  fgFalls?: { x: number; y: number; t: number; r: number; dmg: number; slow?: number }[];
  fgCount?: number;
}

export interface ForgottenEnemyState {
  /** 광휘 남은 틱 · 1초마다 피해 */
  fgRad?: number;
  fgRadDmg?: number;
}

export interface RemnantPlayerState {
  /** 잔영: 순간이동 남은 대기 · 뒤에서 친 것으로 세는 남은 틱 · 남긴 잔영(자리·남은 틱·피해) · 지난 틱 대시 · 지난 틱까지 본 처치 수 */
  rmBlink?: number;
  rmBack?: number;
  rmEchoes?: { x: number; y: number; t: number; dmg: number }[];
  rmDash?: boolean;
  rmSeen?: number;
  /** 그림자 상태 남은 틱 (투명·무적, 다음 공격이 뒤치기) */
  rmShade?: number;
}

export interface WandererPlayerState {
  /** 방랑객: 연참 남은 칼(남은 틱) · 무심의 원(자리·움직인 뒤 남은 틱) · 천검란 게이지 · 방 전체 폭풍 남은 횟수(다음까지 틱) · 마지막 공격 틱 · 지난 틱 대시(시작 자리) · 지난 틱까지 본 처치 수 */
  wdQueue?: number[];
  wdZone?: { x: number; y: number; linger: number };
  wdGauge?: number;
  wdTempest?: { left: number; gap: number };
  wdLast?: number;
  wdDash?: { x: number; y: number };
  wdSeen?: number;
}

export interface WandererEnemyState {
  /** 무심의 원이 이 적을 다시 벨 수 있는 틱 */
  wdCutT?: number;
}

export interface SilkPlayerState {
  /** 영사: 남은 실 · 장전 남은 틱 · 연사까지 센 실 · 실 연사(노리는 적·남은 수·다음까지 틱) · 남아 있는 실(하프 현: 양 끝·남은 틱) */
  skAmmo?: number;
  skReload?: number;
  skUsed?: number;
  skBurst?: { id: number; left: number; gap: number };
  skLines?: { x0: number; y0: number; x1: number; y1: number; t: number; dmg: number }[];
}

export interface SilkEnemyState {
  /** 영사 실 얽힘 */
  skStacks?: number;
  /** 영사 실 출혈 스택 (30이면 과다출혈) */
  skBleed?: number;
}

/** 아스칼론 캐릭터 상태 모음 (types에서 한 이름으로 씀) */
export interface AscalonPlayerState extends AscPlayerState, ForgottenPlayerState, RemnantPlayerState, WandererPlayerState, SilkPlayerState {}
export interface AscalonEnemyState extends AscEnemyState, ForgottenEnemyState, WandererEnemyState, SilkEnemyState {}
