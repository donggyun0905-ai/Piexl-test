// 원소술사(회전체)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface OrbitEnemyState {
  /** 회전체에 닿아 맞은 틱 (여러 구슬이 한꺼번에 때리지 않게, 공격 속도 간격마다 한 번) */
  orbHitTick?: number;
  /** 회전체에 닿아 틱 피해를 받은 틱 (0.15초마다) */
  orbDmgTick?: number;
  /** 은하수 안에서 쌓인 스택 (다 차면 빅뱅) */
  galaxy?: number;
}

export interface OrbitPlayerState {
  /** 회전체가 돈 각도 (길이 1인 [cos, sin], 삼각함수 없이 곱해서 돌림) */
  orbDir?: [number, number];
  /** 회전체마다 다시 때릴 수 있을 때까지 남은 틱 (은하수는 0번이 장판 간격) */
  orbCd?: number[];
  /** 트리거: 지금 장전된 구슬 수 · 다시 채울 때까지 남은 틱 */
  loaded?: number;
  reloadTicks?: number;
  /** 결벽증: 맞은 뒤 빨라진 남은 틱 */
  rushTicks?: number;
  /** 갓 핸드: 잡은 적 id (0 = 돌멩이) · 내려찍을 때까지 남은 틱 · 보스전이면 피해 2배 */
  handId?: number;
  handTicks?: number;
  /** 날아가 때리는 검·별: 회전체 번호 · 노리는 적 id · 날아간 틱 · 노리는 자리 · 때린 횟수 · 돌아오기 시작한 틱
   *  웨폰 마스터 검은 자유롭게 날아다님: 지금 자리(px·py) · 빠르기(vx·vy) · 마지막으로 꿰뚫은 적·틱 */
  flyers?: { i: number; id: number; t: number; x: number; y: number; n?: number; back?: number; px?: number; py?: number; vx?: number; vy?: number; lastId?: number; lastT?: number }[];
  /** 펫·전깃줄: 다음까지 남은 틱 */
  petCd?: number;
  wireCd?: number;
}

export interface OrbitShotState {
  /** 중력 안에 들어와 느려진 적 탄 */
  slowed?: boolean;
  /** 맞히면 이 상태이상 피해도 (원소술사 강철 출혈 · 트리거 폭풍, 탄 피해의 30%) */
  dot?: import("./types").DotKind;
}
