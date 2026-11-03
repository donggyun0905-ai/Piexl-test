// 숨은 시련 상태 (sim/hiddenTrial·hiddenForts·hiddenSea·hiddenKit): 4층부터 층마다 보통 전투방 하나가 몰래 시련이 됨

/** 1 우거진 하이오크 부락 · 2 어둠의 세계 · 3 공성전 · 4 안개숲 · 5 죽음의 바다 */
export type HiddenKind = 1 | 2 | 3 | 4 | 5;

/** 부서지는 구조물 (성벽·독가스 살포기·해적선): 여러 조각(fort 적)이 체력 하나를 나눠 씀 */
export interface HiddenFort {
  look: "wall" | "sprayer" | "ship";
  /** 남은 체력 · 최대 체력 */
  pool: number;
  max: number;
  /** 조각 적 id와 붙어 있는 자리 */
  ids: number[];
  xy: [number, number][];
  down?: boolean;
}

export interface HiddenTrialState {
  floor: number;
  room: number;
  kind: HiddenKind;
  /** 방에 들어가 시작함 · 깨서 끝남 */
  on?: boolean;
  done?: boolean;
  /** 지금 라운드(하이오크·어둠 1~3, 바다 2 = 배가 부서짐) · 다음 무리까지 틱 · 시작한 틱 */
  round: number;
  t: number;
  at: number;
  /** 화면 알림 (start · round2 · round3 · wall1 · wall2 · spray · gasOff · ship · shipDown · clear) */
  note?: { code: string; tick: number };
  forts?: HiddenFort[];
  /** 안개숲: 독가스가 없는 자리 [x, y, 반경] · 독가스가 걷히는 틱 */
  pockets?: [number, number, number][];
  gasOff?: number;
  /** 죽음의 바다: 남은 숨(틱) · 비눗방울 [x, y, 사라지는 틱] · 해적선이 나오는 틱 */
  breath?: number;
  bubbles?: [number, number, number][];
  shipAt?: number;
}

export interface HiddenTrialRunState {
  /** 이 층의 숨은 시련 (없으면 이 층에는 없음) */
  hidden?: HiddenTrialState;
}
