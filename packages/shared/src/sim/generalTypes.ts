// 장수용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface GeneralPlayerState {
  /** 콤보의 다음 기술 순번 */
  gStep?: number;
  /** 묶음 끝에서 쉬는 남은 틱 (철벽진) · 함성 남은 틱 · 명장의 기세(다음 기술 2배) */
  gPause?: number;
  warCryTicks?: number;
  momentumReady?: boolean;
  /** 돌진 보호막 남은 틱 (끝나면 그만큼 보호막을 거둠) */
  gShieldTicks?: number;
}
