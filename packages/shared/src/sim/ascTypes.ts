// 아스칼론 시즌 2 캐릭터 상태 타입. 모두 선택 값 (예전 저장에는 없음)

export interface AscPlayerState {
  /** 추적자: 스킬 셋 남은 대기 틱 · 암습 저격(남은 발·남은 틱·다음 발까지) · 강력한 한방 모으는 남은 틱 · 연발사격(남은 발·다음 발까지) · 마지막 저격 틱(반동) · 지난 틱 대시 */
  trCd?: number[];
  trAmbush?: { shots: number; t: number; gap: number };
  trCharge?: number;
  trBurst?: { left: number; gap: number };
  trShot?: number;
  trDash?: boolean;
  /** 이 틱에 누른 스킬 키 (0 = 없음, 1~3) */
  trKey?: number;
}

export interface AscEnemyState {
  /** 추적자 사냥감 표식 남은 틱 */
  trMarked?: number;
}

export interface ForgottenPlayerState {
  /** 잊혀진 자: 빛의 고리에 모인 처치 수 · 지난 틱까지 본 처치 수 · 신족 남은 틱 · 떨어지는 빛 십자가 · 공격 횟수(성흔) */
  fgRing?: number;
  fgSeen?: number;
  fgGod?: number;
  fgFalls?: { x: number; y: number; t: number; r: number; dmg: number; slow?: number }[];
  fgCount?: number;
}

export interface ForgottenEnemyState {
  /** 광휘 남은 틱 · 1초마다 피해 */
  fgRad?: number;
  fgRadDmg?: number;
}
