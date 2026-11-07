// 블래스트·새벽의 성흔 상태 타입 (sim/blast·stigma). 모두 선택 값 (예전 저장에는 없음)

export interface DawnPlayerState {
  /** 성흔(달빛의 힘) 게이지 0~최대 · 달빛 각성 남은 틱 · 각성 전체 틱(화면 게이지용) */
  sgGauge?: number;
  sgAwake?: number;
  sgAwakeMax?: number;
  /** 블래스트: 다음 발 (0 첫 발 · 1 펌프 앞 발) · 공격할 수 있게 된 뒤 틱 */
  blStep?: number;
  blGap?: number;
}

/** 효과: 산탄 부채꼴 (size = 거리, arc = cos, style 1 = 각성) · 폭멸 (size = 반지름) · 각성 달빛 폭발 · 각성 중 몸 둘레 달빛 */
export type DawnFx = "blShotFx" | "blBurstFx" | "blAwakeFx" | "blMoonAura";
