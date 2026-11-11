// 백령 상태 타입 (sim/baekryeong·baekSlash·baekSword·baekSoul). 모두 선택 값 (예전 저장에는 없음)

/** 날아가는 것: 0 유령팔 에너지 참격 · 1 망령(혼령참). age가 0보다 작으면 아직 안 나감(이연참) */
export interface BaekShot {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  dmg: number;
  kind: number;
  age: number;
  life: number;
  speed: number;
  /** 이미 맞힌 적 */
  hit: number[];
}

/** 위백도 검무 소용돌이: 적 하나를 따라가며 몇 틱마다 추가 피해 */
export interface BaekWhirl {
  id: number;
  x: number;
  y: number;
  left: number;
  age: number;
  r: number;
  dmg: number;
}

/** 대태도: 0 하늘에서 떨어지는 중((진)대태도·랑, age가 life가 되면 쾅) · 1 꽂혀서 번개((진)대태도-백) */
export interface BaekSword {
  x: number;
  y: number;
  kind: number;
  age: number;
  life: number;
  r: number;
  dmg: number;
}

export interface BaekPlayerState {
  /** 다시 베기까지 · 대시 중이었는지 · 방 · 마지막으로 유령팔이 벤 틱(그림) */
  byCd?: number;
  byDash?: boolean;
  byRoom?: number;
  byArmAt?: number;
  /** 영혼 게이지: 지금 칸에 쌓인 영혼 · 다 찬 칸 수 */
  bySouls?: number;
  byLv?: number;
  /** 참격·망령 · 소용돌이 · 대태도 · 처치한 적(자리·id·종류, 다음 틱에 영혼으로) */
  byShots?: BaekShot[];
  byWhirls?: BaekWhirl[];
  bySwords?: BaekSword[];
  byKills?: [number, number, number, string][];
}

/** 효과: 대태도 베기(size 거리) · 소용돌이 한 번 · 대태도 쾅 · 번개(toX·toY) · 유령 걸음 혼불 · 혼등(toX·toY) · 영혼이 몸으로(toX·toY) · 게이지 한 칸 참 */
export type BaekFx = "bySlash" | "byWhirl" | "byGreat" | "byBolt" | "byStep" | "byWisp" | "bySoul" | "byLevel";
