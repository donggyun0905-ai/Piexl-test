// 이무기용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface ImugiPlayerState {
  /** 콤보 (층·단계를 넘어가도 이어짐, 108에서 용이 되고 20부터 다시) */
  imCombo?: number;
  /** 이번 판에 용을 부른 수 (영구 치명타 확률 +15%씩, 최대 72%) */
  imWakes?: number;
  /** 용이 된 몸(콤보 108) 남은 틱 */
  imForm?: number;
  /** 오라(콤보 72 이상)에 들어섰는지 (들어설 때 한 번 보호막) */
  imAura?: boolean;
  /** 부른 용: 머리 높이 · 빛깔 · 이번에 맞힌 적 · 남은 지나감 수(쌍룡) · 이번 지나감 피해 배율 */
  imUlt?: { y: number; color: string; hit: number[]; passes: number; mul: number };
  /** 맞힌 횟수 (승천·암룡 깨물기 순서) */
  imHits?: number;
  /** 청룡 번개: 적마다 남은 수·다음까지 틱 */
  imBolts?: { id: number; left: number; wait: number }[];
  /** 토룡 보호막 (보호막 중 이 무기로 생긴 양, 최대 20) · 비늘 방패로 생긴 양 */
  imEarth?: number;
  imGuard?: number;
}

export interface ImugiEnemyState {
  /** 풍룡 폭풍 남은 틱 · 사룡 독 남은 틱과 겹친 수 */
  imStorm?: number;
  imVenom?: number;
  imVenomStacks?: number;
  /** 독이 걸린 뒤 지난 틱 (1초마다 피해, 다시 맞아도 처음으로 돌아가지 않음) */
  imVenomT?: number;
  /** 화룡점정 번개: 남은 연속 타격 수 · 한 번 피해 (레이저처럼 와다다 나눠 들어감) */
  imZap?: number;
  imZapDmg?: number;
  /** 움직임·공격이 모두 느려짐 (토룡·교만) 남은 틱 */
  sluggish?: number;
}
