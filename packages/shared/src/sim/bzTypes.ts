// 블루 플레임 상태 타입 (sim/blueFlame). 모두 선택 값 (예전 저장에는 없음)

/** 곧 들어갈 공격: 나간 자리 → 떨어질 자리 · 남은 틱 · 전체 틱 · 종류 (0 불꽃 감옥 · 1 불꽃 기둥 · 2 화살 · 3 날개 화살비 · 4 각성 거대한 화살) · 피해 배율 · 반지름 · 쫓는 적 id (화살) */
export interface BzStrike {
  x0: number;
  y0: number;
  x: number;
  y: number;
  t: number;
  T: number;
  k: number;
  mul: number;
  r: number;
  tg?: number;
}

export interface BlueFlamePlayerState {
  /** 곧 들어갈 공격들 */
  bzStrikes?: BzStrike[];
  /** 푸른 날개: 남은 틱 (날개·머리 위 활이 떠 있음) · 아직 안 쏜 화살비 수 */
  bzWing?: number;
  bzRain?: number;
  /** 열화상 각성 중인지 (끝나는 틱에 몸이 다시 보이고 잠깐 무적) */
  bzUlt?: boolean;
  /** 지금 방 ("층/방", 바뀌면 공격을 거둠) */
  bzRoom?: string;
}

/** 청염 상태이상: 남은 틱 · 한 번 피해 (적 머리 위 푸른 불꽃 표시) */
export interface BlueFlameEnemyState {
  bzFlameT?: number;
  bzFlameDmg?: number;
}

/** 효과: 활 쏘기 (dir 쪽, 사용자 그림 8프레임) · 불꽃 감옥 (size = 반지름) · 불꽃 기둥 · 화살 박힘 · 각성 폭격 · 각성 시작 · 푸른 날개 (follow) · 화살비 떨어짐 */
export type BlueFlameFx = "bzBowFx" | "bzPrisonFx" | "bzPillarFx" | "bzArrowFx" | "bzBombFx" | "bzAwakeFx" | "bzWingFx" | "bzRainFx";
