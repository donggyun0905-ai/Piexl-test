// 토르켄 상태 타입 (sim/thorken). 모두 선택 값 (예전 저장에는 없음)

/** 철구공 휘두르기 하나: 남은 틱 · 처음·끝 각도 · 사슬 길이 · 이번에 맞은 적 */
export interface TkSweep {
  t: number;
  a0: number;
  a1: number;
  r: number;
  hit: number[];
}

/** 소용돌이·태풍 (자리 · 남은 틱 · 다음 때리기까지 틱 · 반지름) */
export interface TkVortex {
  x: number;
  y: number;
  t: number;
  cd: number;
  r: number;
}

export interface ThorPlayerState {
  /** 철구공: 0 손에 · 1 날아가는 중 · 2 사슬 끝에 나가 있음 · 3 감아 들이는 중 · 자리 */
  tkMode?: number;
  tkBx?: number;
  tkBy?: number;
  /** 던지기: 출발·도착 자리 · 남은 틱 */
  tkFly?: { x0: number; y0: number; x1: number; y1: number; t: number };
  /** 감아 들이기: 남은 틱 · 돌아오며 맞은 적 */
  tkRet?: { t: number; hit: number[] };
  /** 지금 휘두르는 중 · 다음 휘두르는 쪽(1/-1) · 휘두른 수(간헐천) */
  tkSweep?: TkSweep;
  tkDir?: number;
  tkSwings?: number;
  /** 폭풍 게이지 · 태풍 · 소용돌이들 */
  tkGauge?: number;
  tkStorm?: TkVortex;
  tkWhirls?: TkVortex[];
  /** 대시 중이었는지 · 순풍의 돛 남은 틱 */
  tkDashing?: boolean;
  tkSail?: number;
  /** 지금 방 ("층/방", 바뀌면 철구공을 다시 손에) */
  tkRoom?: string;
}
