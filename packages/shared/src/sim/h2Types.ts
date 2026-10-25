// 시즌 2 헬리오스 캐릭터용 상태 타입 (역병의사 · 학살자). 모두 선택 값 (예전 저장에는 없음)

export interface PlagueRat {
  id: number;
  x: number;
  y: number;
  /** 남은 틱 · 달라붙은 적 (0 = 없음) · 다음 갉기까지 */
  t: number;
  on: number;
  cd: number;
}

export interface H2PlayerState {
  /** 역병의사: 모기떼 자리 · 연기 구역 · 쥐떼 · 다음 쥐 번호 */
  plSwarm?: { x: number; y: number; prevX: number; prevY: number };
  plClouds?: { x: number; y: number; r: number; t: number; dmg: number }[];
  plRats?: PlagueRat[];
  plRatId?: number;
  /** 학살자: 콤보 (남은 기술 차례 · 다음 기술까지 틱 · 피해) · 게이지 · 피의 학살 남은 틱 · 마지막 숨을 썼는지 */
  slCombo?: { i: number; t: number; dmg: number };
  slGauge?: number;
  slRage?: number;
  slSaved?: boolean;
  /** 이터: 먹은 적 수 · 늦게 들어가는 물기(적 번호·남은 틱·피해·물기인지) */
  eaEaten?: number;
  eaQueue?: { id: number; x: number; y: number; t: number; dmg: number; bite: boolean }[];
  /** 묵인: 천천히 차오를 회복약 · 요새 돌진 남은 틱 · 가시 갑옷 쿨 · 돌진 이어 가기(남은 연쇄·되돌아오기·피해) */
  mkPool?: number;
  mkGuard?: number;
  mkSpikeCd?: number;
  mkNext?: { chain: number; back: boolean; dmg: number; sx: number; sy: number };
  /** 사멸: 던진 침 수(독가스까지) · 독가스 · 잇따라 던질 침(남은 틱·각도) */
  smCount?: number;
  smGas?: { x: number; y: number; r: number; t: number; dmg: number }[];
  smQueue?: { t: number; a: number; dmg: number }[];
}

export interface H2EnemyState {
  /** 흑사병 남은 틱 · 1초마다 피해 · 이미 옮겼는지 */
  plague?: number;
  plagueDmg?: number;
  plSpread?: boolean;
  /** 사혈로 이미 회복했는지 */
  plBled?: boolean;
  /** 사멸 죽음: 남은 틱 · 1초마다 피해 */
  smDeath?: number;
  smDeathDmg?: number;
}
