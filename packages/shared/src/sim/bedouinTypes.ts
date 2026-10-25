// 베두인용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/** 던진 차크람: 날아가는 중 · 바닥에 떨어짐 · 혼자 돌아오는 중 */
export interface ThrownChakram {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  /** 날아갈 남은 틱 */
  left: number;
  mode: "fly" | "ground" | "back";
  /** 이번에 이미 맞힌 적 */
  hit: number[];
  r: number;
  mul: number;
  /** 벽에 튕길 수 있는 남은 수 (되튕김) */
  bounces: number;
  /** 벽에 한 번이라도 튕겼는지 (튕긴 뒤에는 날아가는 중에도 닿으면 잡음) */
  bounced?: boolean;
  /** 던진 방 ("층/방") · 바닥에서 돈 틱 (회오리 고리) */
  where: string;
  spin: number;
}

export interface BedouinPlayerState {
  /** 차크람을 손에 들고 있는지 (없으면 들고 있음) · 이번 차례에 회전 베기를 했는지 (했으면 다음은 던지기) */
  ckHeld?: boolean;
  ckSpun?: boolean;
  ck?: ThrownChakram;
  /** 던진 횟수 (사막의 왕) */
  ckThrows?: number;
  /** 모아 둔 대시 수 (신기루 걸음·축적) */
  dashCharges?: number;
  /** 모래 회오리 (모래 폭풍): 자리·남은 틱 */
  vortex?: { x: number; y: number; left: number };
  /** 잔상 고리: 차크람이 남긴 잔상 (자리·크기·남은 틱) */
  ghosts?: { x: number; y: number; r: number; left: number }[];
  /** 무희의 춤: 대시로 벤 적마다 남은 벰 수·다음까지 틱 */
  dance?: { id: number; left: number; wait: number }[];
}
