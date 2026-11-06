// 미카엘라 상태 타입 (sim/michaela). 모두 선택 값 (예전 저장에는 없음)

/** 박힌 무기: 자리 · 종류(0 검 · 1 투창) · 다시 연쇄로 터질 수 있는 틱 */
export interface McBlade {
  x: number;
  y: number;
  k: number;
  cd?: number;
}

/** 하늘(포탈)에서 떨어지는 무기: 자리 · 남은 틱 · 종류 · 피해 배율 */
export interface McFall {
  x: number;
  y: number;
  t: number;
  k: number;
  mul: number;
}

/** 곧 터질 연쇄 폭발: 자리 · 남은 틱 · 피해 배율 */
export interface McChain {
  x: number;
  y: number;
  t: number;
  mul: number;
}

export interface MichaelaPlayerState {
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 · 마지막 공격(그림) */
  mcStep?: number;
  mcGap?: number;
  mcLast?: { k: number; t: number };
  /** 스킬 대기 틱 (넷) */
  mcCd?: number[];
  /** 들고 있는 무기 (0 검 · 1 투창) */
  mcHeld?: number;
  /** 콤보 · 남은 유지 틱 */
  mcCombo?: number;
  mcComboT?: number;
  /** 박힌 무기 · 떨어지는 무기 · 곧 터질 연쇄 */
  mcBlades?: McBlade[];
  mcFalls?: McFall[];
  mcChains?: McChain[];
  /** 무한의 무기고 남은 틱 */
  mcUlt?: number;
  /** 대시 중인지 (대시 시작을 한 번만 봄) */
  mcDash?: boolean;
  /** 지금 방 ("층/방", 바뀌면 무기를 거두고 새로 쏟아짐) */
  mcRoom?: string;
}

/** 효과: 검 베기 · 창 찌르기 · 투척 · 폭발 · 떨어지는 무기 · 포탈 · 바꿔 듦 · 순간 이동 · 무기고(머리 위 포탈) */
export type MichaelaFx = "mcSlashFx" | "mcThrustFx" | "mcThrowFx" | "mcBlastFx" | "mcFallFx" | "mcPortalFx" | "mcSwapFx" | "mcBlinkFx" | "mcUltFx";
