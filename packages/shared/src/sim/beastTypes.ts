// 야수(고양이 수인)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { PetKind } from "../content";

/** 데리고 다니는 고양이 하나 */
export interface Pet {
  kind: PetKind;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  /** 다음 할퀴기까지 남은 틱 */
  cd: number;
  /** 바라보는 쪽 (그리기용, -1 왼쪽) */
  face: number;
}

export interface BeastPlayerState {
  pets?: Pet[];
  /** 생선 간식: 고양이가 빨라진 남은 틱 · 야성의 포효: 고양이 피해 증가 남은 틱 */
  frenzyTicks?: number;
  roarTicks?: number;
  /** 덮치기 호랑이 게이지(0~TIGER.full) · 호랑이로 변한 남은 틱 */
  tigerGauge?: number;
  tigerTicks?: number;
  /** 아홉 목숨을 쓴 층 */
  livesFloor?: number;
}

export interface BeastShotState {
  /** 헤어볼: 맞으면 둔화·불탐 */
  sticky?: boolean;
}
