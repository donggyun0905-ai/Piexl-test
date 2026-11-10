// 쉐도잉 상태 타입 (sim/shadowing·shadowingArts·shadowingSpirits). 모두 선택 값 (예전 저장에는 없음)

/** 바닥에 그린 먹 획 하나 */
export interface InkStroke {
  /** 번호 (그리기·시드) */
  id: number;
  /** 점 [x0, y0, x1, y1, …] (그린 차례) */
  pts: number[];
  /** 그리는 중이면 -1 · 다 그렸으면 사라지는 틱 */
  end: number;
  /** 다 그렸을 때 모양: 0 그냥 획 · 1 봉인(닫힌 원) · 2 일필 베기(곧은 줄) */
  shape: number;
  /** 이 획에 쓴 잉크 · 대시(날개)로 그린 획 */
  ink: number;
  wing?: boolean;
  /** 맞힌 적과 그 틱 ([적 id, 틱] 차례로) */
  h: number[];
}

/** 날아가는 것 하나 (검기·학·유령·혜성·나비·용): row = 그림 줄 (render/shadowingArt.SD_FX) */
export interface InkSpirit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 남은 틱 · 피해 · 크기 · 그림 줄 */
  t: number;
  dmg: number;
  r: number;
  row: number;
  /** 가까운 적을 쫓아감 · 맞히면 사라짐(아니면 뚫고 지나감) · 터지는 반지름 */
  home?: boolean;
  once?: boolean;
  burst?: number;
  /** 용: 따라가는 획 점들과 지금 점 번호 */
  path?: number[];
  at?: number;
  /** 맞힌 적 id */
  h: number[];
}

/** 바닥에 남는 자리 (두루마리 용·연꽃·달·유성·소용돌이): row = 그림 줄 */
export interface InkZone {
  x: number;
  y: number;
  r: number;
  row: number;
  /** 지난 틱 · 끝나는 틱 (delay면 끝날 때 한 번 터짐) */
  age: number;
  life: number;
  dmg: number;
  /** 피해 간격 (없으면 끝날 때 한 번) · 묶는 틱 · 끌어당김 · 회복 · 불 */
  every?: number;
  stun?: number;
  pull?: number;
  heal?: number;
  burn?: boolean;
}

export interface ShadowingPlayerState {
  /** 판 위 획 (오래된 것부터) · 다음 번호 · 마친 획 수 · 획이 있는 방 */
  sdStrokes?: InkStroke[];
  sdNext?: number;
  sdDone?: number;
  sdRoom?: number;
  /** 잉크 · 다시 차기까지 틱 · 붓 끝 자리 (화면: 붓 커서) */
  sdInk?: number;
  sdWait?: number;
  sdBx?: number;
  sdBy?: number;
  /** 날아가는 것 · 바닥 자리 */
  sdSpirits?: InkSpirit[];
  sdZones?: InkZone[];
  /** 나비: 그린 거리 · 시계: 남은 틱·다시 쓰기까지 · 혜성 다시 쓰기까지 · 황금 문 남은 틱 · 지난 틱 대시 중이었는지 */
  sdFly?: number;
  sdClockT?: number;
  sdClockCd?: number;
  sdCometCd?: number;
  sdGateT?: number;
  sdDash?: boolean;
}

/** 효과: 그림 줄 한 번 터짐(style = 그림 줄, size = 반지름) · 봉인 번쩍(size = 반지름) · 일필 베기(toX·toY 끝) · 먹 번짐 */
export type ShadowingFx = "sdBurst" | "sdSeal" | "sdSlash" | "sdInk";

/** 그림 줄 번호 (화면 render/shadowingArt의 shadowingFx.webp 줄과 같게 · scripts/art/shadowing.py) */
export const SD_ROW = {
  sword: 0, scroll: 1, lotus: 2, crane: 3, sakura: 4, chain: 5, flame: 6, frost: 7, vortex: 8, moon: 9,
  star: 10, clock: 11, ghost: 12, thorn: 13, comet: 14, butterfly: 15, gate: 16, wings: 17, meteor: 18, dragon: 19, ink: 20,
} as const;
