// 벨벳 티타임(시즌 5 메이드·바니 한정 스킨) 색과 그림 조각 (글자 지도 → 픽셀, tigerArt.drawMap으로 그림)
export const ROSE = "#e8406a";
export const BLUSH = "#ffb0c8";
export const CREAM = "#fff4e8";
export const GILT = "#f0c860";
export const PLUM = "#3a1830";
export const INKM = "#241826";

/** 하트 (작은 것 · 큰 것) */
export const HEART = [
  ["o.o", "ooo", ".o."],
  [".o.o.", "ooooo", "ooooo", ".ooo.", "..o.."],
];
/** 구두 굽 자국 (위가 걷는 쪽: 앞코 · 굽) */
export const HEEL = [".oo.", "oooo", "oooo", ".oo.", "....", "..o.", "..o."];
/** 찻잔과 받침 (c 잔 · g 금테 · t 차) */
export const CUP = [".ggggg..", ".cttttc.", ".cccccgg", ".ccccc.g", "..ccc.g.", "gggggggg"];
/** 리본 (r 리본 · d 그늘 · k 매듭) */
export const BOW = ["rr...rr", "rrr.rrr", "rrdkdrr", "rr...rr", "r.....r"];
export const BOW_COLORS: Record<string, string> = { r: ROSE, d: "#b02a50", k: GILT };
