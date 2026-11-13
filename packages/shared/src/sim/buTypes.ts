// 블뢰 상태 타입 (sim/bleu·buSkills·buFrost). 적응력·대기·나눠 때리기는 느아르와 같은 칸(nrTypes)을 씀 · 모두 선택 값

/** 방의 눈결정 하나: 자리 · 사라지는 틱 */
export interface BuFlake {
  x: number;
  y: number;
  until: number;
}

/** 날아가는 서리 결정탄: 자리 · 방향 · 남은 거리 · 피해 */
export interface BuBolt {
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
  dmg: number;
}

export interface BleuPlayerState {
  /** 방의 눈결정 · 날아가는 결정탄 · 종언의 영구동토 얼음 시계가 끝나는 틱 */
  buFlakes?: BuFlake[];
  buBolts?: BuBolt[];
  buEndAt?: number;
}

export interface BleuEnemyState {
  /** 빙결: 얼어 있는 끝 틱(그림) · 다시 얼릴 수 있는 틱 */
  buIce?: number;
  buIceOk?: number;
}

/** 효과: 결정탄 터짐 · 빙결의 파동 · 빙정 폭발 · 영구빙벽 · 영혼 늑대 · 영혼 매 · 영혼 사슴 · 영혼 군단 · 영원의 설원 · 빙시계의 태엽 · 백랑의 포효 · 절대 영도 · 영겁의 시간감옥 · 시간 동결 · 종언의 영구동토 · 빙창의 폭우 · 얼음 터짐 · 눈결정 생김 */
export type BleuFx =
  | "buBolt" | "buWave" | "buBurst" | "buWall" | "buWolf" | "buHawk" | "buDeer" | "buLegion"
  | "buField" | "buClock" | "buHowl" | "buZero" | "buPrison" | "buStop" | "buEnd" | "buRain" | "buPop" | "buFlake";
