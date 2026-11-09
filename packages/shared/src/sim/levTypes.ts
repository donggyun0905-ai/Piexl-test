// 시즌 3 라스트 보스 레비아탄 상태 (sim/bossLeviathan·bossLevWhale·bossLevKing·levKit). 모두 선택 값 (예전 저장에는 없음)

/** 토네이도 (피해 없음, 휘감아 떠밀기) */
export interface LevTornado {
  x: number;
  y: number;
  vx: number;
  vy: number;
  until: number;
}

/** 썰물·밀물 (방 반쪽이 물에 잠김): 0 왼쪽 · 1 오른쪽 · 2 위 · 3 아래 · 잠기기 시작하는 틱 · 끝 틱 */
export interface LevTide {
  side: number;
  at: number;
  end: number;
  /** 두 번째 (반대쪽) */
  second?: boolean;
}

export interface LevEnemyState {
  /** 레비아탄 모습: 1 심해룡 · 2 고래 (레비아탄은 보이지 않는 지휘자) · 3 해왕 · 모습이 바뀌기 시작한 틱 */
  lhForm?: 1 | 2 | 3;
  lhShift?: number;
  /** 그림 칸 · 그 모습을 유지하는 틱 */
  lhPose?: number;
  lhPoseEnd?: number;
  /** 물속이라 숨을 쉬어야 함 (페이즈 1·궁극기) · 숨 최대(틱) · 자리마다 남은 숨 */
  lhWet?: boolean;
  lhAirMax?: number;
  lhAir?: number[];
  /** 비눗방울 [x, y, 사라지는 틱] (들어가면 숨이 참) */
  lhBubbles?: [number, number, number][];
  /** 토네이도 · 다음 토네이도 틱 */
  lhTorn?: LevTornado[];
  lhNextTorn?: number;
  /** 다음 바다 몬스터 · 다음 유령선 틱 · 유령선 나온 수 (왼쪽·오른쪽 번갈아) */
  lhNextFoe?: number;
  lhNextShip?: number;
  lhShips?: number;
  /** 물감옥 예고: 갇히는 틱 · 자리 */
  lhPrisonAt?: number;
  lhPrisonX?: number;
  lhPrisonY?: number;
  /** 거대 물구슬: 커지기 시작한 틱 · 남은 낙하 · 다음 낙하 틱 · 몇 번 썼는지 · 다음 물구슬 틱 */
  lhOrb?: number;
  lhDrops?: number;
  lhDropAt?: number;
  lhOrbs?: number;
  lhNextOrb?: number;
  /** 고래: 0 잠수 · 1 떠오르는 중 · 2 올라와 있음 · 3 잠기는 중 · 그 상태 시작 틱 · 떠오를 자리 */
  lhUp?: number;
  lhAt?: number;
  lhTx?: number;
  lhTy?: number;
  /** 남은 물 탄환 · 다음 사슬 팔 · 사슬 팔 그림자가 따라오기 시작한 틱 · 다음 물기둥 */
  lhSpray?: number;
  lhNextArm?: number;
  lhArmAt?: number;
  lhNextGeyser?: number;
  /** 해왕: 소용돌이 [x, y, 시작 틱, 끝 틱] · 썰물·밀물 · 다음 썰물·밀물 · 바다의 메아리 횟수 · 남은 삼지창 · 다음 삼지창 */
  lhVortex?: [number, number, number, number][];
  lhTide?: LevTide;
  lhNextTide?: number;
  lhEcho?: number;
  lhSpear?: number;
  lhNextSpear?: number;
  /** 해왕 궁극기 해일 승천: 시작 틱 · 지친 시간이 끝나는 틱 (받는 피해 늘어남) */
  lhUlt?: number;
  lhTired?: number;
  /** 레비아탄이 부른 유령 선장 (반투명으로 그림) */
  lhGhost?: boolean;
}
