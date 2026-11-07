// 헬피스트 상태 타입 (sim/hellfist). 모두 선택 값 (예전 저장에는 없음)

export interface HellfistPlayerState {
  /** 다음 박자 (0 찌르기 · 1 내려찍기 · 2 허공 긁기) · 마지막 공격 뒤 틱 · 마지막 박자(그림) */
  hfStep?: number;
  hfGap?: number;
  hfLast?: { k: number; t: number };
  /** 악마화 스택 · 마지막으로 맞힌 뒤 틱 */
  hfRage?: number;
  hfIdle?: number;
}

/** 효과: 찌르기 (size = 길이) · 내려찍기 (size = 거리, arc = cos) · 검지 가리킴 (나 → 적 줄) · 허공 검격 (size = 줄 수) · 적혈 각성 지옥불 폭발 */
export type HellfistFx = "hfJabFx" | "hfSmashFx" | "hfPointFx" | "hfClawFx" | "hfAwakeFx";
