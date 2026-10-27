// 한 틱 입력 타입·도우미 (types에서 다시 내보냄)

// ───────── 입력 ─────────

/**
 * 한 틱 동안의 입력. 기록·재생하기 쉽게 정수로 담는다.
 * move: -100~100 (조이스틱은 중간 값), aim: -1000~1000 (방향 ±100 × 거리 단계 1~10.
 * 거리 단계 = 누른 곳까지 거리 ÷ AIM_DIST_STEP, 조이스틱은 10 = 멀리. 방향만 쓰는 곳에서는 길이 상관없음)
 */
export interface TickInput {
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  attack: boolean;
  /** 이번 틱에 대시를 눌렀는지 (누른 순간만 true) */
  dash: boolean;
  /** 이번 틱에 상호작용(F·버튼)을 눌렀는지 (누른 순간만 true) */
  interact: boolean;
  /** 이번 틱에 쓴 사용 아이템 칸: 0 = 안 씀, 1·2 = 그 칸 (누른 순간만) */
  useSlot: number;
  /** 이번 틱에 클릭한 층 보상: 0 = 안 누름, 1~3 = 지금 방 보상 중 몇 번째 (누른 순간만) */
  pickChoice: number;
  /** 풋내기 스탯 찍기: 0 = 안 찍음, 1~7 = 그 능력치 (누른 순간만, sim/novice) */
  statPick: number;
  /** 추적자 스킬 키: 0 = 안 누름, 1~3 = 그 스킬 (누른 순간만, sim/tracker) */
  skill: number;
  /** 상점에서 판 장비: 없음·0 = 안 팜, 1·2 = 사용 아이템 칸, 3~ = 패시브 (3 = 첫째, 누른 순간만, sim/shop) */
  sell?: number;
  autoAim: boolean;
}

export const EMPTY_INPUT: TickInput = {
  moveX: 0,
  moveY: 0,
  aimX: 0,
  aimY: 0,
  attack: false,
  dash: false,
  interact: false,
  useSlot: 0,
  pickChoice: 0,
  statPick: 0,
  skill: 0,
  autoAim: false,
};

/** 조준 거리 단계 하나의 게임 픽셀 (기계공학자 지뢰·위성 포·포탑이 누른 곳에 떨어지게). 단계가 굵어야 입력 기록이 짧음 */
export const AIM_DIST_STEP = 12;
export const AIM_DIST_MAX = 10;

/** 실수 값 → 입력용 정수 (범위 제한 + 반올림) */
export function quantize(v: number, limit: number): number {
  const q = Math.round(v * limit);
  return q > limit ? limit : q < -limit ? -limit : q;
}
