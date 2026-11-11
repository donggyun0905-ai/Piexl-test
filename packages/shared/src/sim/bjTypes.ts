// 백인장 상태 타입 (sim/baekinjang·bjKit·bjDrones·bjVolley·bjProcs·bjSkills). 모두 선택 값 (예전 저장에는 없음)

/** 미니 창 드론: 자리 · 속도 · 다시 찌르기까지 틱 */
export interface BjDrone {
  x: number;
  y: number;
  vx: number;
  vy: number;
  cd: number;
}

export type BjVolleyKind = "flurry" | "spin" | "rain" | "needle" | "prison" | "reaper" | "end";

/** 나눠 때리는 기술 하나: 종류 · 자리 · 방향 · 반지름(거리) · 한 대 피해 · 남은 수 · 처음 수 · 간격 · 다음 틱 · 겨눈 적 */
export interface BjVolley {
  kind: BjVolleyKind;
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  dmg: number;
  left: number;
  n: number;
  every: number;
  next: number;
  id?: number;
}

/** 섬광 돌진베기: 방향 · 남은 틱 · 한 틱 거리 · 피해 · 맞힌 적 · 처음 자리 */
export interface BjRush {
  dx: number;
  dy: number;
  t: number;
  step: number;
  dmg: number;
  hit: number[];
  sx: number;
  sy: number;
}

export interface BaekinjangPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 벤 틱(그림) · 다음 콤보 차례(0 기본 · 1 난무 · 2 회전참 · 3 돌진베기) */
  bjCd?: number;
  bjRoom?: number;
  bjAtkAt?: number;
  bjStep?: number;
  /** 미니 창 드론 · 나눠 때리는 기술들 · 돌진베기 */
  bjDrones?: BjDrone[];
  bjVolleys?: BjVolley[];
  bjRush?: BjRush;
  /** 스킬 1~4 남은 대기 틱 */
  bjSkillCd?: number[];
  /** 연환: 공격이 빨라지는 마지막 틱 */
  bjHaste?: number;
  /** 확률 굴린 수 (시드) */
  bjRolls?: number;
}

export interface BaekinjangEnemyState {
  /** 적안 표식이 끝나는 틱 */
  bjMark?: number;
  /** 출혈 남은 틱 · 0.5초 피해 */
  bjBleed?: number;
  bjBleedDmg?: number;
  /** 죽음 상태이상 남은 틱 · 1초 피해 */
  bjDeath?: number;
  bjDeathDmg?: number;
  /** 종언의 붉은 날개 동안 쌓인 피해 */
  bjSum?: number;
}

/** 효과: 혈월 쌍검격 · 적색 난무 · 선혈 회전참 · 섬광 돌진베기 · 붉은 날개 폭우 · 추적 침격 · 관통 나선창 · 기계익 충격파 · 적안 표식 · 혈철 감옥 · 사신의 팔연참 · 종언의 붉은 날개 · 붉은 십자 · 붉은 레이저 선 · 드론 찌름 · 잔월(날아가는 검격) */
export type BaekinjangFx = "bjSlash" | "bjFlurry" | "bjSpin" | "bjDash" | "bjRain" | "bjNeedle" | "bjSpear" | "bjShock" | "bjEye" | "bjPrison" | "bjReaper" | "bjEnd" | "bjCross" | "bjLine" | "bjDroneHit" | "bjWane";
