// 마젠타 상태 타입 (sim/magenta·mzSkills·mzHex). 적응력·대기·나눠 때리기는 느아르와 같은 칸(nrTypes)을 씀 · 모두 선택 값

/** 방의 향기 연기 하나: 자리 · 사라지는 틱 */
export interface MzScent {
  x: number;
  y: number;
  until: number;
}

/** 저주의 낙인: 낙인 찍힌 적 · 터지는 틱 · 피해 */
export interface MzBrand {
  id: number;
  at: number;
  dmg: number;
}

export interface MagentaPlayerState {
  /** 방의 향기 연기 · 터질 낙인 */
  mzScents?: MzScent[];
  mzBrands?: MzBrand[];
  /** 종언의 푸시아 성역: 저주를 터뜨리는 틱 */
  mzEndAt?: number;
}

export interface MagentaEnemyState {
  /** 저주 겹 수 · 마지막으로 저주가 쌓인 틱 · 매혹이 끝나는 틱 */
  mzHex?: number;
  mzHexAt?: number;
  mzCharm?: number;
}

/** 효과: 자홍 저주비 · 푸시아 만개 · 환영 꽃잎 파동 · 저주의 꽃가루 · 매혹의 시선 · 푸시아 환영분신 · 자홍 화산파 · 저주의 낙인 · 환상의 꽃감옥 · 악몽의 꽃밭 · 유혹의 소용돌이 · 독화 침식 · 환영 붕괴 · 영혼 유린 · 매혹의 강우 · 종언의 푸시아 성역 · 저주 터짐 · 향기 연기 · 매혹 */
export type MagentaFx =
  | "mzRain" | "mzBloom" | "mzWave" | "mzPollen" | "mzGaze" | "mzClone" | "mzVolcano" | "mzBrand"
  | "mzPrison" | "mzGarden" | "mzVortex" | "mzErode" | "mzCollapse" | "mzSoul" | "mzStorm" | "mzEnd" | "mzPop" | "mzScent" | "mzCharm";
