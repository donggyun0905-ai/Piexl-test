// 격투가(콤보)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface BrawlPlayerState {
  /** 다음에 쓸 콤보 기술 번호 · 마지막 기술 뒤 지난 틱 · 끝까지 이어 간 콤보 수 (차력쇼) */
  comboStep?: number;
  comboIdle?: number;
  comboRuns?: number;
  /** 속도는 곧 힘: 이어 간 기술 수 */
  paceStack?: number;
  /** 존: 아주 빠르게 이어 갈 남은 기술 수 */
  zoneLeft?: number;
  /** 연속 공격: 남은 횟수 · 다음까지 틱 · 기술 번호 */
  flurryLeft?: number;
  /** 쌍광연격 별: 원 가운데 · 첫 점까지 [x, y] 차이 · 남은 찌르기 · 다음 찌르기까지 · 찌르기 피해 */
  starCx?: number;
  starCy?: number;
  starDx?: number;
  starDy?: number;
  starLeft?: number;
  starTimer?: number;
  starDmg?: number;
  flurryTimer?: number;
  flurryMove?: number;
  /** 모으기(킥·파동탄 난사): 남은 틱 · 기술 번호 */
  chargeTicks?: number;
  chargeMove?: number;
  /** 붙잡은 적 id */
  grabId?: number;
  /** 유도·종합격투기: 보스 앞에서 만들어 든 바위 (던질 때까지 무적) */
  rock?: boolean;
  /** 버티기(가라테) 남은 틱과 받은 피해 · 움직일 수 없는 남은 틱 */
  guardTicks?: number;
  guardTaken?: number;
  rootTicks?: number;
  /** 차력쇼: 버프 남은 틱 */
  buffTicks?: number;
  /** 이번 기술이 적을 맞혔는지 (안 맞으면 다음 기술로 넘어가지 않음) */
  comboHit?: boolean;
}

export interface BrawlEnemyState {
  /** 위압: 도망가는 남은 틱 */
  fearTicks?: number;
}
