// 히든 아이템 셋째 묶음 아이콘 (14×14 글자 판, hiddenGrids와 같은 방식): 거짓된 용사 · 순례자의 월계선 · 큐피트의 정령
import type { Grid } from "./hiddenGrids";

export const HIDDEN_GRIDS2: Record<string, Grid> = {
  /** 거짓된 용사: 금이 간 낡은 방패 위 나무 검 (풋내기의 용사 흉내) */
  falseHero: {
    rows: ["...........ww.", "..........wWw.", ".........wWw..", "..kkkkkkwWw...", ".kSSSSSwWwk...", ".kSsYYSWwSk...", ".kSYyyYbSSk...", ".kSYyxbbYSk...", ".kSsYbbYsSk...", "..kSbbxSSk....", "..bbkSSSk.....", ".bb..kkk......", "bb............", ".............."],
    pal: { k: "#2a2a3a", S: "#8a94a8", s: "#5a6272", Y: "#e0b030", y: "#ffe080", x: "#1a1a2a", w: "#c89a5a", W: "#f0d0a0", b: "#8a5a2a" },
  },
  /** 순례자의 월계선: 돛에 월계 문양을 단 거대한 나무 방주 · 아래 차원의 물결 */
  laurelShip: {
    rows: ["......k.......", ".....kWk......", "....kWWWk.....", "...kWgWWWk....", "..kWWgggWWk...", "..kWWWgWWWk...", "......k.......", "kbbbbbbbbbbbbk", ".kBbbbbbbbbBk.", "..kBBBBBBBBk..", "...kkkkkkkk...", ".vVv..vVv..vV.", "v...vv...vv...", ".............."],
    pal: { k: "#3a2414", W: "#f4ead0", g: "#5ab05a", b: "#a8743e", B: "#74481f", v: "#8a5aff", V: "#c8a8ff" },
  },
  /** 큐피트의 정령: 작은 날개를 단 빛나는 하트 정령 · 둘레 마법 빛 */
  cupidSpirit: {
    rows: ["..............", ".s..........s.", "..WW.kk.kk.WW.", ".WWwkrrkrrkwWW", ".Wwkrpprrrrkw.", "..kRrppprrrrk.", "..kRrrrrrrrrk.", "...kRrrrrrrk..", "....kRrrrrk...", ".....kRrrk....", "......kRk.....", ".......k......", ".s.........s..", ".............."],
    pal: { k: "#5a0a2a", r: "#ff5a8a", R: "#c82a5a", p: "#ffd0e0", W: "#ffffff", w: "#d8e8ff", s: "#ffe080" },
  },
};
