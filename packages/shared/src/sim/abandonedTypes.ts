// 버려진 자들용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

import type { TagSpecialKind } from "../weaponsAbandoned";

/** 나와 있지 않은 두 아이: 곁에서 따로 싸움 (근접은 다가감 go → 휘두름 hit → 물러남 back, 총은 거리를 두고 쏨) */
export interface TagKid {
  /** 0 P1 · 1 P2 · 2 P3 */
  m: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  /** 바라보는 쪽 (-1 왼쪽) */
  face: number;
  act: "go" | "hit" | "back";
  /** 이 행동 남은 틱 · 총: 다음 사격까지 · 총: 두 발 중 몇 번째 */
  t: number;
  cd: number;
  pair: number;
  /** 그리기: 방금 휘두름·쏨 남은 틱 · 특수기 중 투명 · 뛰어오른 높이 */
  swing: number;
  hide?: boolean;
  z?: number;
}

/** 진행 중인 특수기 연출 (두 아이가 정해진 대로 움직이며 정해진 틱에 공격) */
export interface TagShow {
  kind: TagSpecialKind;
  alt: boolean;
  /** 지난 틱 · 전체 틱 · 피해(공격력 × 배율) */
  t: number;
  len: number;
  dmg: number;
  /** 노리는 자리 (eid 적이 살아 있으면 그 적을 따라감) · 시작 때 노린 방향 */
  tx: number;
  ty: number;
  eid: number;
  dx: number;
  dy: number;
  /** 그림자 베기: 차례로 벨 적들 */
  ids: number[];
}

export interface AbandonedPlayerState {
  /** 지금 나와 있는 아이 (0 P1 · 1 P2 · 2 P3) */
  abM?: number;
  /** 아이마다 다음 콤보 순번 (교대해도 기억) */
  abStep?: number[];
  /** 조합 단계(0~2) · 이번 단계에서 맞춘 순서 수 · 틀려서 처음으로 돌아간 뒤 남은 틱(✕ 표시) · 이번 단계 특수기 씀 · 이번 차례에 친 수 */
  abStage?: number;
  abPos?: number;
  abMiss?: number;
  abDone?: boolean;
  abSeg?: number;
  /** 막기 남은 틱 · 셋이서 하나 남은 틱 */
  abGuard?: number;
  abBuff?: number;
  abKids?: TagKid[];
  abShow?: TagShow;
  /** 스스로 교대 (타워 디펜스 타워·광야의 새벽 두 번째 무기처럼 탭을 누를 수 없을 때) */
  abAuto?: boolean;
}
