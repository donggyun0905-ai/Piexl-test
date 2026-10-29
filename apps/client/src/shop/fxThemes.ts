// 이벤트 상점 테마 효과 10세트 (벚꽃 · 뇌전 · 서리 · 화염 · 은하 · 사탕 · 8비트 · 그림자 · 리듬 · 숲): 세트마다 타격 · 대기 · 걸음 (앞 8세트는 데미지 스킨도)
// 칸마다 다른 세트를 섞어 낄 수 있음. 조각을 만드는 곳은 game/limited/themeFx, 그리기는 themeDraw, 숫자는 game/dmgSkins
export type FxThemeId = "sakura" | "thunder" | "frost" | "inferno" | "galaxy" | "candy" | "retro" | "shadow" | "rhythm" | "forest" | "victory";

/** 테마 조각 모양 (themeDraw) */
export type ThemeShape = "petal" | "bolt" | "flake" | "shard" | "flame" | "ember" | "star" | "heart" | "pix" | "mist" | "note" | "leaf" | "firefly" | "sprout" | "sparkle" | "dot";

export interface FxTheme {
  id: FxThemeId;
  /** 주 색 · 둘째 색 · 밝은 색 */
  colors: readonly [string, string, string];
  /** 맞힘: 튀는 조각 · 크게 남는 자국 */
  hit: { bits: ThemeShape; mark: ThemeShape };
  /** 가만히: 떠다니는 조각 · 발밑 빛 */
  idle: { bits: ThemeShape; glow: string };
  /** 걸음: 바닥에 남는 자국 · 살짝 튀는 조각 */
  walk: { print: ThemeShape; puff?: ThemeShape };
  /** 데미지 스킨: 글자 · 테두리 · 치명타 글자 · 치명타 장식 (없으면 데미지 스킨 없음) */
  dmg?: { fill: string; stroke: string; critFill: string; mark: ThemeShape };
}

export const FX_THEMES: readonly FxTheme[] = [
  { id: "sakura", colors: ["#ff9ac0", "#ffe0ec", "#ffffff"], hit: { bits: "petal", mark: "sparkle" }, idle: { bits: "petal", glow: "#ffb8d4" }, walk: { print: "petal", puff: "dot" }, dmg: { fill: "#ffd0e4", stroke: "#a0305a", critFill: "#ff5a9a", mark: "petal" } },
  { id: "thunder", colors: ["#ffe040", "#6ad8ff", "#ffffff"], hit: { bits: "sparkle", mark: "bolt" }, idle: { bits: "bolt", glow: "#fff27a" }, walk: { print: "bolt", puff: "sparkle" }, dmg: { fill: "#fff27a", stroke: "#2a3a8a", critFill: "#6ae8ff", mark: "bolt" } },
  { id: "frost", colors: ["#8ae0ff", "#e8fbff", "#ffffff"], hit: { bits: "shard", mark: "flake" }, idle: { bits: "flake", glow: "#bff0ff" }, walk: { print: "flake", puff: "dot" }, dmg: { fill: "#e0f8ff", stroke: "#2a6a9a", critFill: "#7ad8ff", mark: "flake" } },
  { id: "inferno", colors: ["#ff6a2a", "#ffc040", "#fff0a0"], hit: { bits: "ember", mark: "flame" }, idle: { bits: "ember", glow: "#ff8a3a" }, walk: { print: "flame", puff: "ember" }, dmg: { fill: "#ffb040", stroke: "#5a1000", critFill: "#ff4a1a", mark: "flame" } },
  { id: "galaxy", colors: ["#a08aff", "#5ae0ff", "#ffffff"], hit: { bits: "sparkle", mark: "star" }, idle: { bits: "star", glow: "#8a6aff" }, walk: { print: "star", puff: "sparkle" }, dmg: { fill: "#d8ccff", stroke: "#1e104a", critFill: "#ff8af0", mark: "star" } },
  { id: "candy", colors: ["#ff7ac8", "#7ae8ff", "#fff07a"], hit: { bits: "dot", mark: "heart" }, idle: { bits: "heart", glow: "#ffb0e0" }, walk: { print: "dot", puff: "heart" }, dmg: { fill: "#ffffff", stroke: "#e83a9a", critFill: "#ff7ac8", mark: "heart" } },
  { id: "retro", colors: ["#3ae86a", "#ffe040", "#ffffff"], hit: { bits: "pix", mark: "pix" }, idle: { bits: "pix", glow: "#3ae86a" }, walk: { print: "pix", puff: "pix" }, dmg: { fill: "#3ae86a", stroke: "#0a2a10", critFill: "#ffe040", mark: "pix" } },
  { id: "shadow", colors: ["#7a3ae8", "#2a1a3a", "#d8a8ff"], hit: { bits: "mist", mark: "shard" }, idle: { bits: "mist", glow: "#5a2a9a" }, walk: { print: "mist", puff: "mist" }, dmg: { fill: "#c8a0ff", stroke: "#12081e", critFill: "#ff4a8a", mark: "shard" } },
  { id: "rhythm", colors: ["#ff5ae0", "#5ae8ff", "#ffe85a"], hit: { bits: "note", mark: "note" }, idle: { bits: "note", glow: "#ff8af0" }, walk: { print: "note", puff: "sparkle" } },
  // 월드 워 리그 우승 한정 '승리': 금빛 훈장·붉은 견장·흰 망토 빛
  { id: "victory", colors: ["#ffd24a", "#d83a3a", "#fff8e0"], hit: { bits: "sparkle", mark: "star" }, idle: { bits: "star", glow: "#ffe07a" }, walk: { print: "star", puff: "sparkle" }, dmg: { fill: "#ffe07a", stroke: "#6a1010", critFill: "#ffffff", mark: "star" } },
  { id: "forest", colors: ["#6ad84a", "#c8f07a", "#fff4a0"], hit: { bits: "leaf", mark: "leaf" }, idle: { bits: "firefly", glow: "#9af07a" }, walk: { print: "sprout", puff: "leaf" } },
];

export const themeOf = (id: string | undefined): FxTheme | undefined => FX_THEMES.find((x) => x.id === id);
