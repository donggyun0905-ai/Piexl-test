// 이안 상태 타입 (sim/ian). 모두 선택 값 (예전 저장에는 없음)

/** 인과의 실: 자리 · 방향 · 남은 거리 · 폭 · 맞은 적 */
export interface IaThread {
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
  w: number;
  hit: number[];
}

export interface IanPlayerState {
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 · 마지막 공격(그림) */
  iaStep?: number;
  iaGap?: number;
  iaLast?: { k: number; t: number };
  /** 스킬 대기 틱 (넷) */
  iaCd?: number[];
  /** 그림자 걸음 뒤: 다음 기본 공격이 급소 */
  iaAmbush?: boolean;
  /** 마지막으로 맞은 뒤 틱 (침묵의 서약) */
  iaCalm?: number;
  /** 인과율 속박 남은 틱 */
  iaLaw?: number;
  /** 날아가는 인과의 실 */
  iaThreads?: IaThread[];
  /** 지금 방 ("층/방", 바뀌면 실·인과율을 거둠) */
  iaRoom?: string;
}

export interface IanEnemyState {
  /** 기록 (0~5) · 속박 남은 틱 · 인과율 속박 중 쌓인 되돌릴 피해 */
  iaRec?: number;
  iaBind?: number;
  iaDebt?: number;
}

/** 효과: 펜 찌르기 · 실 휘감기 · 급소 · 기록 쌓임 · 속박 · 인과의 실 발사 · 그림자 걸음 잔상 · 그림자 찌르기 · 기록 집행 글자 · 인과율 속박 · 인과 되돌림 */
export type IanFx = "iaThrust" | "iaWhip" | "iaVital" | "iaRec" | "iaBind" | "iaThread" | "iaStep" | "iaStab" | "iaWrit" | "iaLaw" | "iaRebound";
