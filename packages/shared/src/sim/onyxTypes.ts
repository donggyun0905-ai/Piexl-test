// 오닉스 상태 타입 (sim/onyx). 모두 선택 값 (예전 저장에는 없음)

export interface OnyxPlayerState {
  /** 비행 중 · 켜고 끄는 대기 · 다음 보석 반응까지 틱 · 광륜으로 묶인 틱 · 보석 꼬리까지 틱 · 수정 반격 대기 */
  oxFly?: boolean;
  oxToggle?: number;
  oxPulse?: number;
  oxCast?: number;
  oxTrail?: number;
  oxShardCd?: number;
  /** 화면·소리용: 보석이 반응한 수 · 공명 수 · 마지막으로 반응한 보석(비트, 1 << 보석 번호)과 그 틱 */
  oxGems?: number;
  oxResons?: number;
  oxLit?: number;
  oxLitAt?: number;
}
