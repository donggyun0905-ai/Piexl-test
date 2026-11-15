// 세계 지도 들판을 떠도는 몬스터 무리 수치 (화면 계산 apps/client world/hunt/huntWander가 씀 · 관리자 '규칙 수치'에서 바꿈)
// 무리 자리·종류는 지역 시드로 정함 (지도 그림이 같으면 늘 같은 자리) · 종류는 그 나라 사냥터 몬스터
const R = {
  /** 걸을 수 있는 칸 1000개마다 무리 수 */
  PACKS_PER_1000: 5,
  /** 한 무리 몬스터 수 (최소 · 최대) */
  PACK_MIN: 2,
  PACK_MAX: 5,
  /** 무리가 돌아다니는 반지름 (칸) */
  PACK_RAD: 4,
  /** 마을·문·주민·이동석·입구·표지판에서 이 칸 수 안에는 무리를 두지 않음 */
  SAFE_TILES: 14,
  /** 무리끼리 떨어진 최소 칸 수 */
  PACK_GAP: 7,
  /** 그 나라 처음 자리에서 가장 먼 곳의 세기 배율 (체력·피해·권장 투력, 가까운 곳은 1) */
  FAR_MUL: 1.6,
  /** 잡힌 뒤 다시 나타나는 시간 (초) */
  RESPAWN: 40,
  /** 나에게서 이 칸 수 안의 몬스터만 움직임 (먼 곳은 멈춤, 계산 줄이기) */
  ACTIVE_TILES: 26,
};
export { R as WANDER_RULES };

/** 처음 자리에서 떨어진 몫(0 가까움 ~ 1 가장 멂) → 세기 배율 */
export const wanderMul = (far: number): number => 1 + (R.FAR_MUL - 1) * Math.max(0, Math.min(1, far));
