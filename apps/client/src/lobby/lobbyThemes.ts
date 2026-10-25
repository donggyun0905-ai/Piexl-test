// 로비 꾸밈 테마: 기본(오락실) + 스킨 8개 (수영복=해변 · 크리스마스 · 할로윈 · 학교 · 새해 · 일본풍 · 중국풍 · 미국풍)
import type { DecorKind } from "./lobbyItems";

export type LobbyTheme = "arcade" | "swim" | "xmas" | "halloween" | "school" | "newyear" | "japan" | "china" | "usa";
export const LOBBY_THEMES: readonly LobbyTheme[] = ["arcade", "swim", "xmas", "halloween", "school", "newyear", "japan", "china", "usa"];
/** 로비 스킨 가격 (만능 쿠폰) */
export const LOBBY_PRICE = 50;

export interface ThemeLook {
  /** 바닥 두 색(체크) · 벽 · 벽 윗단 · 벽 무늬 색 · 테두리 빛 */
  floorA: string;
  floorB: string;
  wall: string;
  wallTop: string;
  wallMark: string;
  glow: string;
  /** 꾸밈 자리마다 (lobbyMap.DECOR 순서, 자리가 더 많으면 처음부터 다시). 두 번째 자리는 캐릭터가 앉는 의자 (소파·벤치·선베드·부스) */
  decor: readonly DecorKind[];
  /** 벽 무늬 */
  wallDeco: "neon" | "waves" | "wreath" | "web" | "board" | "hanji" | "shoji" | "gold" | "stripes";
  /** 바닥 무늬 */
  floorDeco: "carpet" | "sand" | "snow" | "dark" | "wood" | "ondol" | "tatami" | "red" | "checker";
}

export const THEME_LOOK: Record<LobbyTheme, ThemeLook> = {
  arcade: { floorA: "#2a2240", floorB: "#241d38", wall: "#3a2d5a", wallTop: "#4a3a7a", wallMark: "#ff5ad0", glow: "#5ae0ff", wallDeco: "neon", floorDeco: "carpet",
    decor: ["fountain", "sofa", "plant", "plant", "plant", "vending", "sofa"] },
  swim: { floorA: "#f0d898", floorB: "#e8cc88", wall: "#2a90d0", wallTop: "#5ac0f0", wallMark: "#ffffff", glow: "#fff4a0", wallDeco: "waves", floorDeco: "sand",
    decor: ["palm", "deckchair", "crab", "shell", "towel", "ball", "umbrella"] },
  xmas: { floorA: "#8a5a3a", floorB: "#7a4e32", wall: "#2a6a3a", wallTop: "#3a8a4a", wallMark: "#d8283a", glow: "#ffe080", wallDeco: "wreath", floorDeco: "snow",
    decor: ["xtree", "bench", "gifts", "gifts", "candy", "gifts", "snowman"] },
  halloween: { floorA: "#2a1e30", floorB: "#241a2a", wall: "#3a2848", wallTop: "#4a3460", wallMark: "#ff8a1a", glow: "#9aff6a", wallDeco: "web", floorDeco: "dark",
    decor: ["cauldron", "bench", "pumpkin", "candle", "pumpkin", "candle", "tomb"] },
  school: { floorA: "#c8a070", floorB: "#b89060", wall: "#e8e0c8", wallTop: "#f4ecd8", wallMark: "#2a5a3a", glow: "#ffffff", wallDeco: "board", floorDeco: "wood",
    decor: ["desk", "bench", "globe", "books", "plant", "books", "desk"] },
  newyear: { floorA: "#e8c890", floorB: "#dcb878", wall: "#f4ecd8", wallTop: "#8a5a36", wallMark: "#e83a4a", glow: "#ffd040", wallDeco: "hanji", floorDeco: "ondol",
    decor: ["yut", "bench", "pouch", "kite", "pouch", "kite", "table"] },
  japan: { floorA: "#b8c878", floorB: "#a8b868", wall: "#f4f0e0", wallTop: "#5a4030", wallMark: "#c83a3a", glow: "#ffb0d0", wallDeco: "shoji", floorDeco: "tatami",
    decor: ["sakura", "bench", "stoneLantern", "bonsai", "stoneLantern", "bonsai", "torii"] },
  china: { floorA: "#8a2a2a", floorB: "#7a2424", wall: "#b03030", wallTop: "#5a1a1a", wallMark: "#f0c850", glow: "#ffd040", wallDeco: "gold", floorDeco: "red",
    decor: ["dragon", "bench", "redLantern", "vase", "redLantern", "vase", "vaseBig"] },
  usa: { floorA: "#f4f4f4", floorB: "#2a2a2a", wall: "#2a4ab0", wallTop: "#c83a3a", wallMark: "#ffffff", glow: "#ff5a6a", wallDeco: "stripes", floorDeco: "checker",
    decor: ["jukebox", "booth", "flag", "burger", "flag", "burger", "booth"] },
};
