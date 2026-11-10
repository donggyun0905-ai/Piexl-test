// 세레나 상태 타입 (sim/serena). 모두 선택 값 (예전 저장에는 없음)

export interface SerenaPlayerState {
  /** 다음 기본 공격 단계 (0~2) · 마지막 공격 뒤 틱 */
  snStep?: number;
  snGap?: number;
  /** 스킬 대기 틱 (넷) */
  snCd?: number[];
  /** 환혹의 회오리 남은 휘젓기 · 다음 휘젓기까지 틱 */
  snWhirl?: number;
  snWhirlAt?: number;
  /** 환혹의 스텝 남은 돌진 · 지금 돌진 차례(0 / · 1 - · 2 \\, 그림) */
  snDash?: number;
  snDashK?: number;
  /** 환혹의 무도 남은 틱 */
  snUlt?: number;
  /** 신기루 베일 남은 틱 (주는 피해 증가) */
  snMirage?: number;
  /** 지금 방 ("층/방", 바뀌면 회오리를 거둠) */
  snRoom?: string;
}

export interface SerenaEnemyState {
  /** 가시 개수 · 가시가 남는 틱 · 다음 가시 피해 틱 */
  snThorns?: number;
  snThornT?: number;
  snThornAt?: number;
  /** 마비 남은 틱 (느려짐 · 받는 피해 증가) */
  snNumb?: number;
  /** 도는 사슬 채찍에 다시 맞을 수 있는 틱 */
  snOrbAt?: number;
  /** 매혹 남은 틱 (멈춘 채 세레나에게 끌려옴 · 받는 피해 증가) */
  snCharm?: number;
}

/** 효과: 채찍 휘두르기 · 환혹의 회오리 · 사슬 맞힘(빛) · 환혹의 스텝 · 매혹 · 맹독 비수 · 환혹의 무도 · 마비 · 가시 꽃망울 */
export type SerenaFx = "snWhipFx" | "snWhirlFx" | "snHitFx" | "snDashFx" | "snCharmFx" | "snKnifeFx" | "snUltFx" | "snNumbFx" | "snBloomFx";
