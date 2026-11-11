// 빙설 상태 타입 (sim/bingseol·bsShots·bsArms·bsUlt). 모두 선택 값 (예전 저장에는 없음)

/**
 * 날아가는 것: 0 얼음 칼날 · 1 얼음 창(빙설무장-창) · 2 화살(활) · 3 유도 얼음 · 4 급속 얼음 · 5 눈덩이(지팡이)
 * age가 0보다 작으면 아직 안 나감 (창은 머리 위에서, 유도·급속 얼음은 얼음가루가 모이는 동안)
 */
export interface BsShot {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  dmg: number;
  kind: number;
  age: number;
  life: number;
  speed: number;
  /** 남은 관통 수 (0이면 처음 맞힌 적에서 사라짐) */
  pierce: number;
  /** 이미 맞힌 적 */
  hit: number[];
  /** 창: 머리 위 자리 (몸에서 떨어진 거리) · 처음 age · 처음부터 몇 틱 뒤에 생기는지 (차례로 생김) */
  ox?: number;
  oy?: number;
  t0?: number;
  at?: number;
}

/** 얼음가루 한 알 */
export interface BsDust {
  x: number;
  y: number;
  age: number;
}

/** 빙설무장-활: 서 있는 자리 · 왼쪽(-1)/오른쪽(1) · 남은 틱 · 다음 화살까지 · 마지막 화살 방향(그림) */
export interface BsBow {
  x: number;
  y: number;
  side: number;
  left: number;
  cd: number;
  ax: number;
  ay: number;
}

/** 궁극기 빙설창: t 지난 틱(기 모으기 → 날아감) · 자리 · 방향 · 멈춰 때리는 적 · 남은 멈춤 틱 · 때린 수 · 지나간 적 · 한 번 피해 */
export interface BsUlt {
  t: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  target: number;
  pause: number;
  hits: number;
  done: number[];
  dmg: number;
  /** 마지막으로 때린 적·틱 (화면이 60연타 피해 숫자를 하나씩 따로 띄움) */
  hitId?: number;
  hitAt?: number;
}

export interface BingseolPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 공격한 틱(그림) */
  bsCd?: number;
  bsRoom?: number;
  bsAtkAt?: number;
  /** 날아가는 것 · 얼음가루 · 활 · 궁극기 */
  bsShots?: BsShot[];
  bsDust?: BsDust[];
  bsBows?: BsBow[];
  bsUlt?: BsUlt;
  /** 궁극기 슬로우 동안 느리게 한 적 탄 */
  bsFrozen?: number[];
  /** 얼음가루가 생긴 수 (유도·급속 얼음 세기) · 연속 수 · 쉬는 틱 */
  bsMade5?: number;
  bsMade10?: number;
  bsChain5?: number;
  bsChain10?: number;
  bsRest5?: number;
  bsRest10?: number;
  /** 영역강화 결정이 도는 각도 */
  bsSpin?: number;
}

/** 효과: 베기(size 거리) · 찌르기 · 몸 둘레 원 · 눈덩이·유도 얼음 터짐 · 빙각 · 얼음가루 모임(toX·toY) · 궁극기 한 번 때림 · 활 세움 · 결정 피해 · 탄 막음 */
export type BingseolFx = "bsSlash" | "bsThrust" | "bsSpin" | "bsBurst" | "bsSpike" | "bsGather" | "bsUltHit" | "bsBowSet" | "bsWallHit" | "bsBlock";
