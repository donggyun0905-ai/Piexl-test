// 미류 상태 타입 (sim/miryu). 모두 선택 값 (예전 저장에는 없음)

/** 물길: 흐르는 차례대로 놓인 점들 (처음 → 끝 쪽으로 흐름) · 남은 틱 · 처음 틱 · 폭 · 둥근 물길(와류, 안으로 빨아들임) 가운데 */
export interface MrStream {
  pts: [number, number][];
  t: number;
  t0: number;
  w: number;
  ring?: [number, number];
}

/** 되돌리는 물칼날: 자리 · 방향 · 남은 거리 · 피해 배율 · 맞은 적 · 쫓아감 */
export interface MrBlade {
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
  mul: number;
  hit: number[];
  seek?: boolean;
}

/** 천류 해방 해룡: 지나갈 길 · 지금 자리 · 다음 점 · 방향 · 크기 · 벤 적과 다시 벨 수 있는 틱 · 지나온 자리(몸통 그리기) */
export interface MrDragon {
  path: [number, number][];
  x: number;
  y: number;
  i: number;
  dx: number;
  dy: number;
  size: number;
  hit: [number, number][];
  body: [number, number][];
}

export interface MiryuPlayerState {
  /** 다음 베기 단계 (0~2) · 마지막으로 벤 뒤 틱 */
  mrStep?: number;
  mrGap?: number;
  /** 해류 게이지 (0~MIRYU.flowMax) */
  mrFlow?: number;
  /** 물길 · 되돌리는 물칼날 · 해룡 */
  mrStreams?: MrStream[];
  mrBlades?: MrBlade[];
  mrDragon?: MrDragon;
  /** 모은 물방울 (흘린 적 탄) · 흘리기가 남은 틱 */
  mrDrops?: number;
  mrGuard?: number;
  /** 대시 시작 자리 (지난 틱에 대시 중이었는지 겸함) */
  mrDash?: [number, number];
  /** 걸어온 길 (무형) */
  mrTrail?: [number, number][];
  /** 마지막으로 벤 단계 · 틱 · 휩쓴 쪽(1·-1) (칼 그림) */
  mrLast?: { k: number; t: number; side: number };
  /** 지금 방 ("층/방", 바뀌면 물길·해룡을 거둠) */
  mrRoom?: string;
}

/** 효과: 휩쓸기 · 일섬 · 회오리 베기 · 휘는 칼날 · 탄 흘림 · 물칼날 되돌림 · 물칼날 맞음 · 게이지 가득 · 해룡 해방 · 폭포 · 물길 터짐(폭포·얼음) · 물길 탐 */
export type MiryuFx = "mrCut" | "mrFlash" | "mrWhirl" | "mrBend" | "mrCatch" | "mrLoose" | "mrSlice" | "mrReady" | "mrRelease" | "mrFall" | "mrBurst" | "mrShatter";
