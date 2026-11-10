// 조커 상태 타입 (sim/joker·jokerDraw). 모두 선택 값 (예전 저장에는 없음)

/** 판 위를 튕겨 다니는 카드 한 장 */
export interface JokerCard {
  /** 번호 (그리기·소리용) */
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 튕긴 횟수 (피해 = 처음 피해 + 튕긴 횟수 × 늘어나는 양) */
  n: number;
  /** 처음 고정 피해 (보통 4 · 에이스 16 · 분신은 원래 카드의 절반부터) */
  b: number;
  /** 무기 모양 0 = 카드 · 1 = 낫 · 2 = 장난감 총 탄 */
  w: number;
  /** 크기 (반지름) */
  r: number;
  /** 에이스 카드 (그리기) */
  ace?: boolean;
  /** 맞힌 적과 그 틱 ([적 id, 틱] 차례로, 같은 적은 hitCd 틱 뒤에 다시 맞음) */
  h: number[];
}

export interface JokerPlayerState {
  /** 판 위 카드 (오래된 것부터) · 다음 카드 번호 · 던진 수 · 카드가 있는 방 */
  jkCards?: JokerCard[];
  jkNext?: number;
  jkThrown?: number;
  jkRoom?: number;
  /** 지휘봉: 지난 틱 대시 중이었는지 · 다시 쓰기까지 틱 */
  jkDash?: boolean;
  jkRecallCd?: number;
  /** 카드뽑기 게이지 (맞힌 횟수) · 뽑은 횟수 (시드) */
  jkGauge?: number;
  jkDraws?: number;
  /** 섞는 중: 남은 틱 · 결과 (0 달 · 1 붉은 일식 · 2 세계수) · 달이면 히든 캐릭터 번호 (MOON_HEROES) */
  jkFlip?: { t: number; card: number; hero: number };
  /** 효과 중: 카드 (0 달 · 1 붉은 일식) · 남은 틱 · 달이면 히든 캐릭터 번호 */
  jkBuff?: { card: number; t: number; hero: number };
}

/** 효과: 카드가 벽에 튕김(size = 지금 피해) · 카드 사라짐 · 폭죽 · 뽑은 카드 뒤집힘(style = 카드) · 달의 힘(style = 히든 캐릭터 번호) · 세계수 회복 · 차원 균열 줄 */
export type JokerFx = "jkBounce" | "jkPop" | "jkFirework" | "jkReveal" | "jkMoon" | "jkTree" | "jkRift";
