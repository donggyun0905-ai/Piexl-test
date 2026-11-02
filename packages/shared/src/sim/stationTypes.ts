// 상점 대신 나오는 작업대 상태 (sim/station): 아티팩터 제작대 · 추적자 튜닝소 · 단련의 방 기구 (sim/gym) · 시련의 방 비석·보상 상자 (sim/trial)

/** 작업대 종류 (바닥에 놓이는 물건 이름) */
export type StationKind = "bench" | "tune" | "gym" | "trial" | "boon" | "altar";

/** 작업대 앞에서 F: 창 열기·닫기 */
export type StationPrompt = { kind: "station"; station: StationKind; open: boolean; device?: number };

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

/** 상호작용 안내 (F·버튼): 작업대 · 잠긴 출구 · 계단 · 줍기·사기 · 협동 모이기·살리기 · 동료 먹이기 */
export type Prompt = StationPrompt
  | { kind: "none" }
  /** 잠긴 출구 (lane = 출구 줄) */
  | { kind: "flee"; lane: number; cost: number }
  | { kind: "stairs" }
  /** 바꾸기·고르기: 잠깐 서 있으면 가짐 (F·버튼은 바로) */
  | { kind: "pick"; pickupId: number }
  /** 상점 물건: F·버튼으로만 삼 (실수로 사지 않게) */
  | { kind: "buy"; pickupId: number; price: number }
  | { kind: "trash"; price: number; confirm: boolean } // 상점 휴지통 (confirm = 확인 대기)
  /** 협동: 출구·계단에 모두 모이기 기다림 · 쓰러진 친구 옆 (ready = 전투 끝, 회복약으로 일으킴) */
  | { kind: "gather"; have: number; need: number }
  | { kind: "revive"; ready: boolean }
  | { kind: "feed"; has: boolean }; // 다친 동료 옆 (sim/allies, has = 회복약이 있음)

