// 실버불렛 상태 타입 (sim/silverBullet). 모두 선택 값 (예전 저장에는 없음)

/** 날아가는 은탄: 자리 · 빠르기 · 남은 틱 · 피해 배율 · 그림 (0 오른손 · 1 왼손 · 2 대시 · 3 연사 · 4 활 가운데 · 5 활 양끝 유도) · 쫓는 적 id · 유도 꺾임 · 더 뚫는 수 · 이미 맞힌 적 */
export interface SbShot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  mul: number;
  k: number;
  tg?: number;
  turn?: number;
  pierce?: number;
  hit?: number[];
}

/** 날아가는 성수 폭탄: 던진 자리 → 떨어질 자리 · 남은 틱 · 전체 틱 · 피해 배율 */
export interface SbBomb {
  x0: number;
  y0: number;
  x: number;
  y: number;
  t: number;
  T: number;
  mul: number;
}

export interface SilverBulletPlayerState {
  /** 날아가는 은탄 · 성수 폭탄 */
  sbShots?: SbShot[];
  sbBombs?: SbBomb[];
  /** 왼손 총이 쏠 때까지 틱 (0이면 없음) · 기본 공격 횟수 (성수 폭탄·세 번째 총성) */
  sbLeft?: number;
  sbCount?: number;
  /** 연사: 노린 적 id · 남은 틱 */
  sbBarrage?: { id: number; t: number };
  /** 은빛 활 일제 사격 남은 틱 (몸 고정) */
  sbUlt?: number;
  /** 지난 틱에 대시 중이었는지 · 장애물을 넘는 중인 틱 */
  sbDash?: boolean;
  sbVault?: number;
  /** 지금 방 ("층/방", 바뀌면 탄·폭탄을 거둠) */
  sbRoom?: string;
}

/** 적에게 박힌 은탄 마크 수 (체력 줄 위에 은탄 ×개수, 연사가 시작되면 0) */
export interface SilverBulletEnemyState {
  sbMarks?: number;
}

/** 효과: 총구 불꽃 (style 0 오른손 · 1 왼손) · 은탄 맞음 · 성수 폭탄 터짐 (size = 반지름) · 연사 시작 (적 자리) · 흰 활 ) (follow, 일제 사격 동안) · 각성 달빛 폭발 · 장애물 넘기 · 은빛 파열 */
export type SilverBulletFx = "sbMuzzleFx" | "sbHitFx" | "sbBombFx" | "sbBarrageFx" | "sbBowFx" | "sbAwakeFx" | "sbVaultFx" | "sbBurstFx";
