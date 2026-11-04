// 풍류사 상태 타입 (sim/pungryu). 모두 선택 값 (예전 저장에는 없음)

export interface PungPlayerState {
  /** 구절에 지금까지 쓴 글자 수 · 마지막으로 쓴 틱 · 완성한 구절 수(서당 개 삼 년) */
  puStep?: number;
  puLast?: number;
  puVerses?: number;
  /** 하늘·땅 기둥 예약 (자리·남은 틱·반지름·피해) · 늦게 부는 뜨거운 바람 */
  puFalls?: { x: number; y: number; t: number; r: number; dmg: number; earth?: boolean }[];
  puHot?: { t: number; dx: number; dy: number; dmg: number };
  /** 해·달 구슬 남은 틱 · 비구름 남은 틱 · 곳간에 모은 피해 · 구절 피해(구슬·비) */
  puOrbs?: number;
  puRain?: number;
  puStore?: number;
  puPow?: number;
  /** 축지법: 대시 중이었는지 · 다음 글자 2배 남은 틱 */
  puDashing?: boolean;
  puQuick?: number;
  /** 분신(남은 틱·옆쪽 -1/1) · 둔갑술을 쓴 층 · 구름 자국 · 먹물 웅덩이 · 피리까지 틱 */
  puClones?: { t: number; side: number }[];
  puDisguised?: number;
  puTrail?: { x: number; y: number; t: number }[];
  puInks?: { x: number; y: number; t: number }[];
  puFlute?: number;
}

export interface PungEnemyState {
  /** 별 표식 남은 틱 · 이슬 수 · 서리 남은 틱 */
  puStar?: number;
  puDew?: number;
  puFrost?: number;
}
