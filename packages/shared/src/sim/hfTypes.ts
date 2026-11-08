// 헬피스트 상태 타입 (sim/hellfist). 모두 선택 값 (예전 저장에는 없음)

/** 2타로 갈라진 땅: 내려찍은 자리(나) · 방향 · 거리 · 부채꼴 cos · 생긴 틱 (모양 씨앗) */
export interface HfCrack {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  cos: number;
  t: number;
}

export interface HellfistPlayerState {
  /** 다음 박자 (0 후리기 · 1 내려찍기 · 2 균열 파쇄) · 마지막 공격 뒤 틱 · 마지막 박자(그림, 3 = 허공검격) */
  hfStep?: number;
  hfGap?: number;
  hfLast?: { k: number; t: number };
  /** 악마화 스택 · 마지막으로 맞힌 뒤 틱 */
  hfRage?: number;
  hfIdle?: number;
  /** 2타로 갈라진 땅 (3타가 깨뜨리거나 시간이 지나면 사라짐) */
  hfCrack?: HfCrack;
}

/** 효과: 후리기 (size = 거리, arc = cos) · 내려찍기 (size = 거리, arc = cos) · 균열 파쇄 (나 자리·방향, size = 거리, arc = cos, width = 균열 모양 씨앗) · 허공검격 X자 (size = 줄 수, width = 크기) · 적혈 각성 지옥불 폭발 */
export type HellfistFx = "hfJabFx" | "hfSmashFx" | "hfShatterFx" | "hfClawFx" | "hfAwakeFx";
