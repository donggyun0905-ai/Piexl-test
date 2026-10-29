// 패왕전 새 대결 유형 수치 (docs/PW_MODES.md). 계산은 sim/pwCapture
import { TICK_RATE } from "./constants";

/** 점령전 */
export const PW_CAP = {
  /** 우리 편만 구역에 있을 때 0 → 100%까지 걸리는 초 */
  fullSec: 70,
  /** 쓰러진 뒤 집에서 다시 태어나기까지 틱 */
  respawn: 6 * TICK_RATE,
  /** 버프 자리: F를 누르고 가만히 있어야 하는 틱 · 먹은 뒤 다시 생기는 틱 · 닿는 거리 */
  buffHold: 3 * TICK_RATE,
  buffBack: 60 * TICK_RATE,
  buffReach: 22,
  /** 버프: 남는 틱 · 공격력·공격 속도·이동 배율 · 1초마다 최대 체력 비율 회복 */
  buff: { t: 40 * TICK_RATE, dmg: 1.2, rate: 1.15, move: 1.1, regen: 0.012 },
  /** 점프대: 날아가는 틱 · 내린 뒤 다시 뛰지 않는 틱 */
  jumpTicks: 42,
  jumpRest: 50,
};
