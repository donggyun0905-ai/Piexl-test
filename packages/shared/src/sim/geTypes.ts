// 기어스 상태 타입 (sim/gears·geKit·geBall·geProcs). 모두 선택 값 (예전 저장에는 없음)

/** 여러 번 나눠 때리는 공격: 자리 · 반지름(id가 있으면 그 적 한 명만) · 남은 수 · 간격 · 다음까지 틱 · 한 대 피해 · 기절 틱(첫 대) · 효과 */
export interface GeSeq {
  x: number;
  y: number;
  r: number;
  left: number;
  gap: number;
  t: number;
  dmg: number;
  id?: number;
  stun?: number;
  fx?: GearsFx;
}

/** 던진 방패: 자리 · 방향 · 지난 틱 · 지나가며 피해 · 맞힌 적 */
export interface GeThrow {
  x: number;
  y: number;
  dx: number;
  dy: number;
  age: number;
  dmg: number;
  hit: number[];
}

/** 이번 틱에 기어스가 준 한 대 (화면이 피해 숫자를 한 대마다 따로 띄움, 게임 계산에는 안 씀) */
export interface GeHitLog {
  id: number;
  amt: number;
  crit: boolean;
}

export interface GearsPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 친 틱(그림) · 친 수 · 확률 굴린 수(시드) */
  geCd?: number;
  geRoom?: string;
  geAtkAt?: number;
  geHits?: number;
  geRolls?: number;
  /** 구체: 켜짐 · 굴러가는 방향 · 켠 틱(그림) · 켜고 끄는 사이 남은 틱 · 지난 틱 대시 키 · 가속 구체 쌓임 · 마지막으로 부딪힌 틱(그림) */
  geBall?: boolean;
  geBallDx?: number;
  geBallDy?: number;
  geBallAt?: number;
  geToggle?: number;
  geDashKey?: boolean;
  geSpin?: number;
  /** 구체가 튕긴 수 (튕길수록 빨라짐, 풀면 0) */
  geBounce?: number;
  geBumpAt?: number;
  /** 구체 충격파 다시 쓰기까지 */
  geWaveCd?: number;
  /** 나눠 때리는 공격 · 던진 방패 */
  geSeqs?: GeSeq[];
  geThrows?: GeThrow[];
  /** 천상의 수호자 남은 틱 · 시작 틱(그림) */
  geGuard?: number;
  geGuardAt?: number;
  /** 반격 태세 남은 틱 · 지난 틱 보호막(육각 결정) */
  geRage?: number;
  geShieldPrev?: number;
  /** 이번 틱에 준 한 대 한 대 · 그 틱 (화면 피해 숫자용) */
  geLog?: GeHitLog[];
  geLogT?: number;
}

export interface GearsEnemyState {
  /** 구체에 마지막으로 맞은 틱 · 위성 방패에 마지막으로 맞은 틱 */
  geBallHit?: number;
  geOrbHit?: number;
}

/** 효과: 쌍방패 강타 · 쌍성 방패 · 연속 방패타 · 거울 반격 · 보호막 돔 · 대지 분쇄 · 방패 충격파 · 육각 방벽 · 방패 던지기 터짐 · 천상의 수호자 맞음 · 청뢰 폭풍 · 구체 부딪힘 · 육각 결정 · 반동 장갑 · 메아리 */
export type GearsFx = "geSlam" | "geTwin" | "geBarrage" | "geMirror" | "geDome" | "geQuake" | "geWave" | "geHex" | "geBoom" | "geGuardHit" | "geStorm" | "geBump" | "geCrystal" | "geRebound" | "geEcho";
