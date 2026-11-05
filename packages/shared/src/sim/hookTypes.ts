// 훅 상태 타입 (sim/hook). 모두 선택 값 (예전 저장에는 없음)

/** 걸린 적: 적 id · 걸린 자리 (튕겨 돌아갈 곳) */
export interface HkCaught {
  id: number;
  ox: number;
  oy: number;
}

/** 던진 갈고리: k 0 나감 · 1 감아 옴 · 2 밧줄 타기(벽) · 3 보스에게 끌려감 · 4 보스를 쏘고 튕겨 돌아옴
 *  갈고리 머리 자리 · 던진 방향 · 남은 거리·틱 · 걸린 적 · 보스 id · 돌아올 자리 */
export interface HkHook {
  k: 0 | 1 | 2 | 3 | 4;
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
  t: number;
  caught: HkCaught[];
  boss?: number;
  hx?: number;
  hy?: number;
}

/** 튕겨 날아가는 적: id · 한 틱 이동 · 남은 틱 · 난파 피해 */
export interface HkSlide {
  id: number;
  vx: number;
  vy: number;
  t: number;
  dmg: number;
}

export interface HookPlayerState {
  /** 던진 갈고리 · 튕겨 날아가는 적들 */
  hkHook?: HkHook;
  hkSlides?: HkSlide[];
  /** 쌍발 연사 둘째 발까지 틱 · 쏜 방향 */
  hkTap?: { t: number; dx: number; dy: number };
  /** 마지막으로 쏜 틱 (총 그림) */
  hkShot?: number;
  /** 지금 방 ("층/방", 바뀌면 갈고리를 거둠) */
  hkRoom?: string;
}

/** 효과: 산탄 발사 · 둘째 총열 · 갈고리 걸림 · 난파 · 밧줄 착지 · 번개 */
export type HookFx = "hkBlast" | "hkTap" | "hkGrab" | "hkWreck" | "hkLand" | "hkBolt";
