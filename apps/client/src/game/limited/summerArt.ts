// 여름 파도 그림 조각 (글자 지도 → 픽셀, tigerArt.drawMap으로 그림): 맨발 자국 · 갈매기 · 대기 장면의 떠다니는 여름 물건 · 파라솔 · 비치 타월
/** 맨발 자국 (위가 걷는 쪽) */
/** 물 발자국: 푸른 물빛 + 밝은 물기 */
export const FOOT = [".lo..", "loo..", ".loo.", ".ooo.", ".ooo.", "..oo."];
export const FOOT_COLORS: Record<string, string> = { o: "#3ab0e8", l: "#9ae8ff" };

/** 갈매기 (오른쪽을 봄): 날개 위 · 아래 */
export const GULL = [
  ["w.......w", "ww.....ww", ".wwwwwww.", "...wwkwo.", "....ww..."],
  [".........", ".........", "wwwwwwwww", "w..wwkwo.", "....ww..."],
];
export const GULL_COLORS: Record<string, string> = { w: "#f8f8ff", k: "#1e1c2c", o: "#ffb040" };

/** 대기 때 둘레를 둥실 도는 여름 물건 6가지: 비치볼 · 수박 · 아이스크림 · 게 · 불가사리 · 선글라스 */
export const FLOATS: readonly (readonly string[])[] = [
  ["..rrww..", ".rrrwww.", "rrrrwwwb", "yyyywwbb", "yyyyybbb", "yyyyybbb", ".yyyybb.", "..yybb.."],
  ["gggggggg", "GrrrrrrG", ".rrkrrr.", ".rrrrkr.", "..rkrr..", "...rr..."],
  ["..pppp..", ".pPppPp.", ".pppppp.", "..cccc..", "..cwcc..", "...cc...", "...cc...", "....c..."],
  ["R......R", "RR....RR", ".RRRRRR.", "RRkRRkRR", ".RRRRRR.", "R.R..R.R"],
  ["...Y...", "...Y...", "YYYYYYY", ".YYOYY.", "..YYY..", ".YY.YY.", "YY...YY"],
  ["kkkk.kkkk", "kbbk.kbbk", "kbbkkkbbk", ".kk...kk."],
];
export const FLOAT_COLORS: Record<string, string> = {
  r: "#ff4a5a", w: "#ffffff", b: "#3a8aff", y: "#ffd040",
  g: "#2a8a3a", G: "#6ac84a", k: "#1e1c2c",
  p: "#ffb0d0", P: "#ff7ab0", c: "#e8a858",
  R: "#ff6a4a", Y: "#ffb040", O: "#ff7a2a",
};

/** 파라솔 (23×14, 위 천 + 기둥): 빨강·흰 줄 */
export const PARASOL = [
  ".........rrwwrr........",
  "......rrrrwwwwrrrr.....",
  "....rrrrrwwwwwwrrrrr...",
  "..rrrrrrwwwwwwwwrrrrrr.",
  ".rrrrrrwwwwwwwwwwrrrrrr",
  "rRRRRRWWWWWWWWWWWRRRRRR",
  "r.R.R.W.W.W.W.W.W.R.R.R",
  "...........p...........",
  "...........p...........",
  "...........p...........",
  "...........p...........",
  "...........p...........",
  "...........p...........",
  "...........p...........",
];
export const PARASOL_COLORS: Record<string, string> = { r: "#ff5a6a", R: "#c83a4a", w: "#fff4f0", W: "#d8d0d0", p: "#e8d8c0" };
