// 악마의 거래 아이콘 (14×14 글자 판, hiddenGrids와 같은 방식, 핏빛 틀은 hidden.hiddenFrame): 악마의 피 · 사탄의 가면 · 붉은 반점 · 누군가의 절규 · 뒤집어진 십자가 · 그림 리퍼
import type { Grid } from "./hiddenGrids";

export const DEVIL_GRIDS: Record<string, Grid> = {
  devilBlood: {
    rows: ["......k.......", ".....kRk......", ".....kRk......", "....kRRRk.....", "....kRWRk.....", "...kRWRRRk....", "...kRWRRRk....", "..kRRRRRRdk...", "..kRRRRRRdk...", "..kRRRRRddk...", "...kRRRddk....", "....kkkkk.....", "..r.......r...", "....r...r....."],
    pal: { k: "#2a0408", R: "#d01828", W: "#ff8a8a", d: "#7a0a12", r: "#ff3a3a" },
  },
  devilMask: {
    rows: [".h........h...", ".hh......hh...", "..hh....hh....", "...kkkkkkk....", "..kMMMMMMMk...", ".kMMMMMMMMMk..", ".kMeeMMMeeMk..", ".kMeEMMMEeMk..", ".kMMMMmMMMMk..", ".kMMMMmMMMMk..", "..kMtttttMk...", "..kMtMtMtMk...", "...kMMMMMk....", "....kkkkk....."],
    pal: { h: "#c8b8a8", k: "#08060a", M: "#2a2228", m: "#4a3a48", e: "#5a0a10", E: "#ff2a3a", t: "#e8e0d0" },
  },
  devilSpots: {
    rows: ["..............", "...kkk..kkk...", "..kSSSkkSSSk..", ".kSrSSSSSSrSk.", ".kSSSSrSSSSSk.", ".kSrSSSSSrSSk.", ".kSSSSSSSSSSk.", "..kSSrSSSrSk..", "...kSSSSSSk...", "....kSrSSk....", ".....kSSk.....", "......kk......", "..b........b..", "....b....b...."],
    pal: { k: "#08060a", S: "#2a1a22", r: "#e02a3a", b: "#1a1018" },
  },
  devilScream: {
    rows: ["..b.......b...", ".b..kkkkk..b..", "...kFFFFFk....", "..kFFFFFFFk...", ".kFFkkFkkFFk..", ".kFFkWFkWFFk..", ".kFFFFFFFFFk..", ".kFFFkkkFFFk..", ".kFFkoookFFk..", ".kFFkoookFFk..", ".kFFkoookFFk..", "..kFFkkkFFk...", "b..kFFFFFk..b.", "....kkkkk....."],
    pal: { k: "#0a1430", F: "#7a9ad8", W: "#ffffff", o: "#060a18", b: "#4a9aff" },
  },
  devilCross: {
    rows: ["......kk......", ".....kRRk.....", ".....kRRk.....", ".....kRRk.....", ".....kRRk.....", ".....kRRk.....", ".....kRRk.....", ".....kRRk.....", "..kkkkRRkkkk..", ".kRRRRRRRRRRk.", ".kRRRRRRRRRRk.", "..kkkkRRkkkk..", ".....kRRk.....", "......kk......"],
    pal: { k: "#2a0408", R: "#c01828" },
  },
  devilReaper: {
    rows: [".kkkkkkk......", "kBBBBBBBkk....", ".kkkkkBBBBk...", "......kkBBk...", "........kWk...", "........kwk...", ".......kwk....", ".......kwk....", "......kwk.....", "......kwk.....", ".....kwk......", ".....kwk......", "....kwk.......", "....kk........"],
    pal: { k: "#06040a", B: "#3a3448", W: "#c8c0e0", w: "#5a3a2a" },
  },
};
