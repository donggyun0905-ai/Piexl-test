// 미카엘라 상태 타입 (sim/michaela). 모두 선택 값 (예전 저장에는 없음)
import type { McMove } from "../michaelaWeaponMoves";

/** 박힌 무기: 자리 · 그림 무기 번호(michaelaWeaponList) · 종류(0 검 · 1 투창) · 속성(0~7) */
export interface McBlade {
  x: number;
  y: number;
  w?: number;
  k: number;
  v?: number;
}

/** 하늘(포탈)에서 떨어지는 무기: 자리 · 남은 틱 · 그림 무기 번호 · 종류 · 속성 · 피해 배율 */
export interface McFall {
  x: number;
  y: number;
  t: number;
  w: number;
  k: number;
  v: number;
  mul: number;
}

/** 곧 터질 일제 폭파: 자리 · 남은 틱 · 속성 · 피해 배율 */
export interface McChain {
  x: number;
  y: number;
  t: number;
  v: number;
  mul: number;
}

/** 곧 나갈 무기 기술: 남은 틱 · 기술 · 피해 배율 */
export interface McQueued {
  t: number;
  m: McMove;
  mul: number;
}

export interface MichaelaPlayerState {
  /** 곧 나갈 무기 기술 (무기에 닿았을 때 둘 · 회오리 이어 치기) */
  mcQueue?: McQueued[];
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 · 마지막 공격(그림) */
  mcStep?: number;
  mcGap?: number;
  mcLast?: { k: number; t: number };
  /** 스킬 대기 틱 (넷) */
  mcCd?: number[];
  /** 들고 있는 무기: 그림 무기 번호 · 종류 (0 검 · 1 투창) · 속성 (0~7) */
  mcWeapon?: number;
  mcHeld?: number;
  mcElem?: number;
  /** 콤보 · 남은 유지 틱 */
  mcCombo?: number;
  mcComboT?: number;
  /** 박힌 무기 · 떨어지는 무기 · 곧 터질 일제 폭파 */
  mcBlades?: McBlade[];
  mcFalls?: McFall[];
  mcChains?: McChain[];
  /** 2 칼날 교대 뒤 남은 틱 (이 안에 그 무기 기술로 잡으면 2번 대기 초기화) */
  mcShiftT?: number;
  /** 무한의 무기고 남은 틱 */
  mcUlt?: number;
  /** 대시 중인지 (대시 시작을 한 번만 봄) */
  mcDash?: boolean;
  /** 지금 방 ("층/방", 바뀌면 무기를 거두고 새로 쏟아짐) */
  mcRoom?: string;
}

/** 효과: 무기 기술 (style = 기술 번호(MC_MOVE_IDS) × 64 + 그림 무기 번호) · 투척·떨어지는 무기·바꿔 듦·순간 이동 (style = 그림 무기 번호) · 일제 폭파 폭발 (style = 속성) · 포탈 · 무기고(머리 위 포탈) · 자전 번개 */
export type MichaelaFx = "mcMoveFx" | "mcThrowFx" | "mcBlastFx" | "mcFallFx" | "mcPortalFx" | "mcSwapFx" | "mcBlinkFx" | "mcUltFx" | "mcBoltFx";
