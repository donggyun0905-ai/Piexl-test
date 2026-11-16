// 성탄 눈꽃(시즌 4 크리스마스 한정 스킨) 색과 그림 조각 (글자 지도 → 픽셀, tigerArt.drawMap으로 그림)
export const RED = "#e8344a";
export const SNOW = "#f4f8ff";
export const PINE = "#2fa860";
export const STAR = "#ffd860";
export const ICE = "#bfe6ff";
export const NIGHT = "#1a2238";

/** 눈꽃 (작은 것 · 큰 것) */
export const FLAKE = [
  ["o.o", ".o.", "o.o"],
  ["o.o.o", ".ooo.", "ooOoo", ".ooo.", "o.o.o"],
];
/** 눈 위 장화 발자국 (위가 걷는 쪽) */
export const BOOT = [".oo.", "oooo", "oooo", ".oo.", "....", ".oo.", ".oo."];
/** 선물 상자 (b 상자 · r 리본) */
export const GIFT = ["..r.r..", "...r...", "bbbrbbb", "bbbrbbb", "rrrrrrr", "bbbrbbb", "bbbrbbb"];
/** 머리 위에 흔들리는 금종 (y 금 · d 그림자 · r 리본 · k 추) */
export const BELL = ["r...r", ".rrr.", "..y..", ".yyy.", ".yyd.", "yyyyd", "yyyyd", ".ddd.", "..k.."];
export const BELL_COLORS: Record<string, string> = { r: RED, y: STAR, d: "#c89a30", k: "#7a5a20" };
/** 작은 성탄 나무 (g 잎 · G 그늘 · t 줄기 · s 별, 불빛은 그릴 때) */
export const TREE = [
  "....s....", "...sss...", "....g....", "...ggg...", "..gGgGg..", "...ggg...", "..gggGg..", ".gGgggGg.",
  "..gggggg.", ".ggGgggGg", "gggggGggg", "....t....", "....t....",
];
export const TREE_COLORS: Record<string, string> = { g: PINE, G: "#1f7a44", t: "#7a4a2a", s: STAR };
