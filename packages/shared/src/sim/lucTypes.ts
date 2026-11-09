// 레이드 보스 루시퍼 싸움 상태 (sim/lucifer·lucAttacks·lucPillars·lucDark). 모두 레이드 상태(s.raidBoss.fight)에 둠

/** 컷신 (전체 화면 그림, 그동안 모두 멈춤): 기둥 넷이 부서진 뒤 필살기 · 1→2페이즈 변신 · 2페이즈 필살기 · 쓰러짐 */
export type LucCut = "pillars" | "change" | "p2" | "death";

export interface LucFight {
  phase: 1 | 2;
  /** 다음 기본 공격 틱 · 지금까지 쓴 기본 공격 수 */
  nextAtk: number;
  atkN: number;
  /** 그림 칸 (0 서기 · 1~4 공격 모션) · 그 칸을 유지하는 끝 틱 */
  pose: number;
  poseEnd: number;
  /** 다음 석화의 빔 틱 (1분마다) · 부서진 기둥 수 */
  beamAt: number;
  down: number;
  /** 석화의 빔 지진파 [x, y, 반지름, 기다릴 틱, 맞은 자리 비트] */
  waves: number[][];
  /** 기둥이 부서져 기절한 동안 검기: 끝 틱 · 남은 번 · 다음 검기 판정 틱 · 방향(0 왼쪽 1 오른쪽 2 위) · 빈칸 [x, y, …] */
  stunEnd?: number;
  slashN?: number;
  slashAt?: number;
  slashSide?: number;
  safe?: number[];
  /** 별 고리 [x, y, 사라지는 틱] · 가시 고리 [자리, 떨어지는 틱, x, y, 멈춤 0/1] · X자 [x, y, 터지는 틱] · 보라 구 [x, y, 터지는 틱] */
  mines: number[][];
  crowns: number[][];
  xs: number[][];
  orbs: number[][];
  /** 어둠의 기둥 (기둥 둘이 부서진 뒤, 자리마다) [x, y, 내리치는 틱] */
  dark?: number[][];
  /** 흰색 돔 [x, y, 컷신 틱] · 돔 판정까지 끝났는지 */
  dome?: number[];
  domeDone?: boolean;
  /** 컷신 · 끝 틱 */
  cut?: LucCut;
  cutEnd?: number;
  /** 근접 견제(가까이 붙은 사람): 다음 틱 · 쓴 수 (sim/lucMelee) */
  nextMelee?: number;
  meleeN?: number;
  /** 다음 악마의 불길 틱 (1페이즈 30줄부터) */
  nextFlames?: number;
  /** 2페이즈 차례: 절망의 검 → 낙하 검 → 사슬 → 1대5 → 날개 → 하늘 탄막 (sim/lucPhase2) */
  p2?: "swords" | "rain" | "chain" | "open" | "wings" | "sky";
  /** 절망의 검마다 [검 id, 패턴, 쓰는 틱] · 맵 전체 기절 틱 · 가시 덩굴 [x, y, 반지름, 사라지는 틱] */
  swords?: number[][];
  stunAt?: number;
  vines?: number[][];
  /** 낙하 검: 남은 번 · 다음 틱 · 사슬 끝 틱 */
  rainN?: number;
  rainAt?: number;
  chainEnd?: number;
  /** 날개 [x, y] · 바닥이 꺼지는 틱 · 탄막 각도 */
  wings?: number[][];
  fallAt?: number;
  spin?: number;
  /** 숨는 돌기둥 [x, y, 남은 횟수, 다시 생기는 틱] (sim/lucCover) */
  covers?: number[][];
  /** 보상 방 상자가 열린 틱 (sim/raidReward) */
  opened?: number;
}

export interface LucPlayerState {
  /** 어둠의 세계에 빨려 감 (몬스터를 다 잡으면 돌아옴) */
  raidDark?: boolean;
  /** 치유 감소 50% 남은 틱 (sim/lucKit.lucStatus) */
  raidCut?: number;
  /** 날개를 달았음 (하늘 탄막에서 떨어지지 않음) */
  raidWing?: boolean;
  /** 레이드 결과표 (sim/raidStats): 준 피해 · 루시퍼에게 · 기둥·검·몬스터에게 · 받은 피해 · 회복 · 가장 큰 한 방 · 지난 틱 체력 */
  raidStat?: { dealt: number; boss: number; adds: number; taken: number; healed: number; max: number };
  raidHpWas?: number;
  /** 레이드 데스 카운트 · 쓰러진 틱 */
  raidDeaths?: number;
  raidDownAt?: number;
}
