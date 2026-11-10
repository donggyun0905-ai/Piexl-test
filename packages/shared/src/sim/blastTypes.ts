// 블래스트·새벽의 성흔 상태 타입 (sim/blast·stigma). 모두 선택 값 (예전 저장에는 없음)

export interface DawnPlayerState {
  /** 성흔(달빛의 힘) 게이지 0~최대 · 달빛 각성 남은 틱 · 각성 전체 틱(화면 게이지용) */
  sgGauge?: number;
  sgAwake?: number;
  sgAwakeMax?: number;
  /** 블래스트: 탄창 남은 탄 (없으면 가득) · 쏜 보통 탄 수 (critEvery마다 치명타) · 장전 중 틱 · 파란 탄 (대시 슬로우모션) */
  blAmmo?: number;
  blShots?: number;
  blLoad?: number;
  blBlue?: number;
  /** 슬로우모션 남은 틱 · 다시 쓰기까지 틱 · 느리게 한 적 탄 · 대시 중인지 (시작을 한 번만 봄) */
  blSlow?: number;
  blSlowCd?: number;
  blFrozen?: number[];
  blDash?: boolean;
}

/** 달빛 상태이상 (sim/moonlight): 스택 1~5 · 남은 틱 */
export interface DawnEnemyState {
  moon?: number;
  moonT?: number;
}

/** 효과: 산탄 부채꼴 (size = 거리, arc = cos, style 비트: 1 = 각성 · 2 = 치명타 탄 · 4 = 파란 탄) · 폭멸 (size = 반지름) · 각성 달빛 폭발 · 각성 중 몸 둘레 달빛 · 한 발 장전 · 대시 슬로우모션 시작 */
export type DawnFx = "blShotFx" | "blBurstFx" | "blAwakeFx" | "blMoonAura" | "blLoadFx" | "blSlowFx";
