// 래빗 상태 타입 (sim/rabbit·rabbitMarks·rabbitUlt). 모두 선택 값 (예전 저장에는 없음)

/** 땅울림 파동: 맵 끝까지 나아가며 닿은 적을 한 번씩 때림 */
export interface RabbitWave {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  dmg: number;
  /** 지나온 틱 (그림) · 이미 때린 적 */
  age: number;
  hit: number[];
  /** 맵 끝에서 마지막으로 찍음 (다음 쿵 때 사라짐) */
  end?: boolean;
}

/** 바닥에 놓인 것: 0 토끼인장(터지기 전) · 1 유령 망치(떨어지기 전) · 2 갈라진 땅 */
export interface RabbitMark {
  x: number;
  y: number;
  kind: number;
  age: number;
  life: number;
  r: number;
  dmg: number;
}

/** 슈퍼 럭키(초거대 망치): 지난 틱 · 나눠 때린 수 · 한 번 피해(공격력 기준) */
export interface RabbitUlt {
  t: number;
  hits: number;
  dmg: number;
}

export interface RabbitPlayerState {
  /** 다시 내리찍기까지 · 찍은 수(방울) · 쿵쿵쿵 쌓인 수 · 마지막으로 찍은 틱 · 대시 중이었는지 */
  rbCd?: number;
  rbSwings?: number;
  rbStack?: number;
  rbLast?: number;
  rbDash?: boolean;
  /** 파동 · 바닥 것 · 방 */
  rbWaves?: RabbitWave[];
  rbMarks?: RabbitMark[];
  rbRoom?: number;
  /** 럭키 피버 남은 틱 · 슈퍼 럭키 다시 쓰기까지 · 슈퍼 럭키 중 · 느리게 한 적 탄 · 홈런 수(판 전체) */
  rbFever?: number;
  rbUltCd?: number;
  rbUlt?: RabbitUlt;
  rbFrozen?: number[];
  rbHomers?: number;
}

/** 효과: 내리찍기(size 반지름, style 1 = 홈런) · 토끼인장 터짐 · 맵 밖으로 날아감(from = 적 종류) · 방울 · 별사탕(toX·toY) · 여진 · 초거대 망치 한 번 맞음 · 초거대 망치 시작 */
export type RabbitFx = "rbSlam" | "rbBunny" | "rbFly" | "rbBell" | "rbStar" | "rbAfter" | "rbUltHit" | "rbUlt";
