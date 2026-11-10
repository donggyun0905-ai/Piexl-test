// 루나틱 상태 타입 (sim/lunatic). 모두 선택 값 (예전 저장에는 없음)

/** 곧 들어갈 공격: 종류 (0 달빛 베기 · 1 초승달 비 · 2 잔상 찌르기) · 자리 (잔상은 x0,y0 → x,y) · 남은 틱 · 피해 배율 · 반지름(잔상은 폭) · 노린 적 id (달빛 베기) · 이어진 베기인지 */
export interface LnStrike {
  k: number;
  x0: number;
  y0: number;
  x: number;
  y: number;
  t: number;
  mul: number;
  r: number;
  tg?: number;
  chain?: boolean;
}

/** 월광 검기: 자리 · 빠르기 · 남은 틱 · 이미 벤 적 id */
export interface LnWave {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  hit: number[];
}

export interface LunaticPlayerState {
  /** 곧 들어갈 공격들 (달빛 베기·초승달 비·잔상) */
  lnStrikes?: LnStrike[];
  /** 날아가는 월광 검기 */
  lnWaves?: LnWave[];
  /** 다음 월광 표적까지 틱 */
  lnMarkT?: number;
  /** 찌른 수 (삼연 찌르기·초승달 회전 베기) */
  lnCount?: number;
  /** 지난 틱에 대시 중이었는지 · 대시 시작 자리 · 이번 대시에 찌른 적 id */
  lnDash?: boolean;
  lnDashX?: number;
  lnDashY?: number;
  lnDashHit?: number[];
  /** 지금 방 ("층/방", 바뀌면 공격을 거둠) */
  lnRoom?: string;
}

/** 월광 표적(머리 위 조준점) 남은 틱 · 마지막 달빛 베기 틱 (각성 중 너무 자주 안 터지게) */
export interface LunaticEnemyState {
  lnMark?: number;
  lnSlashAt?: number;
}

/** 효과: 찌르기 (dir 쪽, size = 길이, 사용자 그림 8프레임) · 달빛 베기 (사용자 그림 8프레임, size = 반지름) · 대시 찌르기 (follow) · 각성 · 초승달 회전 베기 · 초승달 비 · 잔상 찌르기 (toX,toY) · 표적 생김 */
export type LunaticFx = "lnThrustFx" | "lnSlashFx" | "lnDashFx" | "lnAwakeFx" | "lnCrescentFx" | "lnRainFx" | "lnAfterFx" | "lnMarkFx";
