// 시즌 3 라스트 보스 아스모데우스의 화신체 상태 (sim/bossAsmo·bossAsmoLust·bossAsmoVoid·bossAsmoLord·asmoKit·asmoUlts). 모두 선택 값 (예전 저장에는 없음)

/** 불꽃 담 (선, 지나갈 수 없고 닿으면 피해): 시작 · 끝 · 생기는 틱 · 사라지는 틱 */
export type AsmoWall = [number, number, number, number, number, number];
/** 결정 창 벽 (원): x · y · 사라지는 틱 */
export type AsmoBlock = [number, number, number];

export interface AsmoEnemyState {
  /** 모습: 1 욕망(100~76줄) · 2 검은 해(75~51) · 3 강철 군주(50~0) */
  amForm?: 1 | 2 | 3;
  /** 그림 칸 · 그 칸을 유지하는 틱 */
  amPose?: number;
  amPoseEnd?: number;
  /** 궁극기: 1 검은 해의 탄생(75줄) · 2 군주의 강림(50줄) · 3 욕망의 끝(10줄) · 시작 틱 · 쓴 궁극기 수 · 지쳐 있는 끝 틱 */
  amUlt?: 1 | 2 | 3;
  amUltAt?: number;
  amUlts?: number;
  amTired?: number;
  /** 불꽃 담 · 결정 창 벽 */
  amWalls?: AsmoWall[];
  amBlocks?: AsmoBlock[];
  /** 따라오는 욕망의 구슬 [x, y, 터지는 틱] */
  amOrb?: [number, number, number];
  /** 다섯 구슬: 깜빡이는 순서 · 시작 틱 */
  amFive?: number[];
  amFiveAt?: number;
  /** 매혹의 눈 (눈이 빛나다 판정하는 틱) · 다음 */
  amCharmAt?: number;
  amNextCharm?: number;
  /** 욕망의 잔상: 끝 틱 · 자리마다 지난 자리 [x, y, x, y, …] · 다음 */
  amTrailEnd?: number;
  amTrail?: number[][];
  amNextTrail?: number;
  /** 두 빛의 바닥 (체스판): 시작 · 끝 · 바뀌는 간격 · 다음 */
  amChessAt?: number;
  amChessEnd?: number;
  amChessGap?: number;
  amNextChess?: number;
  /** 빨아들이기: 끝 틱 · 끌려가는 자리 */
  amSuckEnd?: number;
  amSuckX?: number;
  amSuckY?: number;
  /** 놓인 블랙홀 [x, y, 터지는 틱] */
  amHoles?: [number, number, number][];
  /** 단 하나의 빈자리 [x, y, 판정 틱] (두 번째는 대기) · 다음 */
  amSafe?: [number, number, number][];
  amNextSafe?: number;
  /** 굶주린 미니 블랙홀: 끝 틱 · 먹은 피해 · 먹기 전 체력 · 다음 */
  amEatEnd?: number;
  amEaten?: number;
  amHpWas?: number;
  amNextEat?: number;
  /** 보라 레이저: 남은 번 · 다음 줄기 틱 · 간격 · 다음 패턴 */
  amLasers?: number;
  amLaserAt?: number;
  amLaserGap?: number;
  amNextLaser?: number;
  /** 강철의 몸: 끝 틱 · 보스가 바라보는 쪽 · 다음 */
  amArmor?: number;
  amFaceX?: number;
  amFaceY?: number;
  amNextArmor?: number;
  /** 톱니 날 고리: 시작 틱 · 다음 */
  amSawAt?: number;
  amNextSaw?: number;
  /** 화신의 기억 (30줄·15줄): 쓴 수 */
  amMemory?: number;
}
