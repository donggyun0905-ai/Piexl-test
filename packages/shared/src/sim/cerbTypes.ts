// 시즌 3 라스트 보스 켈베로스 상태 (sim/bossCerberus·bossCerbTrio·cerbKit). 모두 선택 값 (예전 저장에는 없음)

/** 무너지는 바닥 (방을 6×4 구역으로): 구역이 무너지는 순서 · 남는 구역 · 시작 틱 · 다시 생기는 틱 */
export interface CerbFloor {
  order: number[];
  safe: number;
  at: number;
  end: number;
}

export interface CerbEnemyState {
  /** 켈베로스: 1 사슬에 묶인 지옥견 · 2 세 사람 (갈라지는 중에는 cbSplit) */
  cbPhase?: 1 | 2;
  /** 쉴드가 깨져 갈라지기 시작한 틱 */
  cbSplit?: number;
  /** 그림 칸 (0 서기 · 1~3 공격 모습) · 그 모습을 유지하는 틱 */
  cbPose?: number;
  cbPoseEnd?: number;
  /** 지금 공격하는 머리 (0 왼쪽 · 1 가운데 · 2 오른쪽, 그리기용 눈빛) */
  cbHead?: number;
  /** 용암 지대 칸 [열, 행, 너비, 높이]를 펼친 목록 · 부풀어 오른 틱(분출 예고 시작) · 분출이 끝나는 틱 · 분출 횟수 */
  cbLava?: number[];
  cbSwell?: number;
  cbErupt?: number;
  cbErupts?: number;
  /** 지옥불 브레스: 예고가 시작된 틱 · 브레스를 뿜는 틱 · 이번 브레스에 맞은 자리 */
  cbBreathWarn?: number;
  cbBreath?: number;
  cbBurned?: number[];
  /** 다음 지옥불 브레스 · 세 머리 동시 공격 · 용암 분출 (틱) */
  cbNextBreath?: number;
  cbNextTriple?: number;
  cbNextErupt?: number;
  /** 페이즈 2 큰 패턴 (무너지는 바닥 · 바위 비 · 빨아들이기): 다음 틱 · 몇 번째 */
  cbNextBig?: number;
  cbBig?: number;
  /** 무너지는 바닥 */
  cbFloor?: CerbFloor;
  /** 빨아들이기가 끝나는 틱 (염희) */
  cbPullEnd?: number;
  /** 시간차로 하나씩 나가는 남은 화염볼 · 그 간격 · 남은 검기 */
  cbFire?: number;
  cbFireGap?: number;
  cbQi?: number;
  /** 오른쪽 머리가 공격한 횟수 (몇 번째마다 전역 검기) · 갈라지며 끊긴 사슬 수 */
  cbRight?: number;
  cbCut?: number;
  /** 세 사람: 지금 돌고 있는 공격 (0~2) · 그 공격 안 몇 번째 */
  cbMove?: number;
  cbRep?: number;
}
