// 상점 대신 나오는 작업대 상태 (sim/station): 아티팩터 제작대 · 추적자 튜닝소

/** 작업대 종류 (바닥에 놓이는 물건 이름) */
export type StationKind = "bench" | "tune";

/** 작업대 앞에서 F: 창 열기·닫기 */
export type StationPrompt = { kind: "station"; station: StationKind; open: boolean };

/** 작업대 결과 (창 연출·그림): 0 실패 · 1 성공 · 2 파괴 · 3 단계 떨어짐 */
export interface StationResult {
  op: number;
  ok: 0 | 1 | 2 | 3;
  /** 바뀐 뒤 패시브 (아티팩터) · 부위 (추적자) */
  id?: string;
  slot?: number;
  tick: number;
}

export interface StationPlayerState {
  /** 아티팩터: 자기 패시브 강화 단계 (패시브 id → 단계) */
  benchLv?: Record<string, number>;
  /** 작업대를 쓴 횟수 (랜덤 시드) · 마지막 결과 */
  stN?: number;
  stLast?: StationResult;
  /** 추적자 저격총: 부위마다 끼운 부품 번호 · 강화 단계 */
  trParts?: number[];
  trLv?: number[];
}
