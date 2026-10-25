// 레이저(기계공학자)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface LaserPlayerState {
  /** 마우스로 누른 곳까지 거리 (조준 입력 길이로 계산, 자동 조준이면 없음) */
  aimDist?: number;
  /** 계속 조사 중인 적 id, 조사한 틱 수, 마지막으로 쏜 틱 (집속 코일·과부하 방출) */
  beamTargetId?: number;
  beamTicks?: number;
  beamLast?: number;
  /** 과부하 방출이 이번 대상에게 터진 횟수 */
  overloadCount?: number;
  /** 과부하 리액터: 열 게이지(틱), 두 배 남은 틱, 과열로 못 쏘는 남은 틱 */
  heat?: number;
  boostTicks?: number;
  overheatTicks?: number;
  /** 포탑·해머·지뢰·위성 포: 다시 쓸 수 있을 때까지 쌓인 틱 (없으면 바로 쓸 수 있음) · 자기장: 펄스까지 모은 틱 */
  gearTicks?: number;
  /** 보호막: 체력보다 먼저 깎임 (에너지 회수) */
  shieldPts?: number;
}

export interface LaserEnemyState {
  /** 기계공학자: 쌓인 열(틱, 열 축적) · 장갑 용해 중첩 · 둔화 남은 틱 (기절은 EnemyState.stunTicks를 같이 씀) */
  heat?: number;
  melt?: number;
  slowTicks?: number;
}

/**
 * 바닥·공중의 장치 (방을 나가면 사라짐). 기계공학자: 레이저 포탑·지뢰·떨어지는 위성 포.
 * 의사(sim/medicGear): 날아가는 탄(주사기·바늘·알약)·마취 가스 장판·구급 키트(날아가는 중)·봉합 바늘·회복 알약·구급차
 */
export interface Device {
  id: number;
  kind: "turret" | "mine" | "strike" | "gas" | "medkit" | "needle" | "pill" | "ambulance" | "shot";
  x: number;
  y: number;
  /** 포탑: 다음 조사까지 남은 틱 · 지뢰: 땅에 떨어진 뒤 터질 수 있게 될 때까지 남은 틱 · 위성 포: 떨어질 때까지 남은 틱 */
  timer: number;
  /** 지뢰·위성 포가 터질 때 피해 */
  dmg?: number;
  /** 던진 포탑·지뢰: 날아가는 남은 틱과 떨어질 자리 (날아가는 동안은 작동 안 함) */
  fly?: number;
  toX?: number;
  toY?: number;
  /** 포탑·가스 장판·회복 알약: 사라질 때까지 남은 틱 */
  life?: number;
  /** 봉합 바늘: 꽂힌 적 id (그 적이 쓰러지면 0, 그 자리에 고정) */
  enemyId?: number;
  /** 의사 탄(shot): 주사기·봉합 바늘·알약 (날아가다 첫 적에 맞음, life = 남은 틱) */
  shot?: "syringe" | "needle" | "pill";
  /** 구급차·의사 탄: 한 틱에 움직이는 양. 구급차: 이번에 이미 친 적, 한 번 더 왕복하는지 */
  vx?: number;
  vy?: number;
  hitIds?: number[];
  back?: boolean;
}
