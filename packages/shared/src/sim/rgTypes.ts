// 루주 상태 타입 (sim/rouge·rgSkills·rgRose). 적응력·대기·나눠 때리기는 느아르와 같은 칸(nrTypes)을 씀 · 모두 선택 값

/** 바닥의 혈장미 하나: 자리 · 사라지는 틱 */
export interface RgRose {
  x: number;
  y: number;
  until: number;
}

export interface RougePlayerState {
  /** 방의 혈장미 */
  rgRoses?: RgRose[];
}

export interface RougeEnemyState {
  /** 루주 출혈: 스택 · 끝나는 틱 · 스택 하나 피해 · 장례로 더 빨라지는 끝 틱 · 혈장미에 마지막으로 찔린 틱 · 장미 낙인 */
  rgBleed?: number;
  rgBleedEnd?: number;
  rgBleedDmg?: number;
  rgFast?: number;
  rgRoseAt?: number;
  rgMark?: number;
}

/** 효과: 적장미 쌍검격 · 혈염 난무 · 광란의 회전참 · 장미 가시 찌르기 · 혈화 개화 · 장미꽃잎 폭풍 · 선혈 가시숲 · 업화의 장미 · 혈영 돌진 · 혈화 만개 · 장미 낙인 · 낙인 폭발 · 광란의 혈검무 · 쌍검 혈월참 · 붉은 장미의 장례 · 진홍의 폭우 · 종언의 혈장미 · 터짐 · 장미 모임 */
export type RougeFx =
  | "rgX" | "rgFlame" | "rgSpin" | "rgThorn" | "rgBloom" | "rgPetal" | "rgForest" | "rgBlaze"
  | "rgRush" | "rgBloomBig" | "rgMark" | "rgMarkBoom" | "rgDance" | "rgMoon" | "rgFuneral" | "rgRain" | "rgEnd" | "rgBurst" | "rgGather";
