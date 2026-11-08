// 히든 아이템 아이콘 그림 (14×14 글자 판, 틀 안쪽 1칸부터). 글자 → 색은 아이템마다 pal, '.'은 빈칸 · 그리는 곳은 iconArt/hidden
export interface Grid {
  rows: readonly string[];
  pal: Readonly<Record<string, string>>;
}

/** 금기된 아티팩트: 금속 받침 위 깎인 결정 (c 몸 · l 밝은 면 · d 어두운 면 · s 반짝임) */
export const RELIC_ROWS = ["......kk......", ".s...kWck.....", "....kWlcck....", "...kWllccdk...", "..kWlllcccdk.s", "..klllccccdk..", "..kllcccccdk..", "...klccccdk...", "....klccdk....", ".....kcdk.....", "...mmmkkmmm...", "..mWmmmmmmnm..", "..nmmmmmmmnn..", "...nnnnnnnn..."];
export const RELIC_PAL = { k: "#140c20", W: "#ffffff", m: "#8a7a60", n: "#5a4a38" };

/** 주사위 (윗면 T · 앞면 F · 옆면 S · 점 r · 반짝임 y) */
const DICE_ROWS = ["....kkkkkkkkk.", "...kTTTTTTTkS.", "..kTTTrTTTkSS.", ".kkkkkkkkkSSS.", ".kFFFFFFFkSSS.", ".kFrFFFrFkSrS.", ".kFFFFFFFkSSS.", ".kFFFrFFFkSSk.", ".kFFFFFFFkSk..", ".kFrFFFrFkk...", ".kFFFFFFFk....", ".kkkkkkkkk....", "..y.......y...", "......y......."];

export const HIDDEN_GRIDS: Record<string, Grid> = {
  ifritClaw: {
    rows: ["....y...y.....", "...yo..yo..y..", "..yor.yor.yo..", "..Wr..Wr..Wo..", ".Wr..Wr..Wr...", ".Wr..Wr..Wr...", ".Wr..Wr..Wr...", ".rd..rd..rd...", ".dRRRdRRRdRR..", ".RRRRRRRRRRRd.", ".RgRRRgRRRgRd.", ".RRRRRRRRRRRd.", "..dRRRRRRRRd..", "...dddddddd..."],
    pal: { y: "#ffe060", o: "#ff8a30", r: "#e04a20", W: "#fff0d8", R: "#8a2a1a", d: "#4a1408", g: "#ffd040" },
  },
  sylphQuiver: {
    rows: ["..f..f..f.....", ".fFffFffFf....", "..S..S..S.....", ".gggggggggg...", ".gLGGGGGGGd.c.", ".gLGGyGGGGd..c", ".gLGyyyGGGd..c", ".gLGGyGGGGd.c.", ".gLGGGGGGGd...", ".gbbbbbbbbd.c.", ".gLGGGGGGGdc.c", ".gLGGGGGGGd..c", "..gGGGGGGd..c.", "...dddddd....."],
    pal: { f: "#c8fff0", F: "#6ad8a8", S: "#c8c8d8", g: "#2a6a4a", G: "#4aa878", L: "#8af0c0", d: "#1e4a34", y: "#ffe060", b: "#8a5a2a", c: "#c8fff0" },
  },
  gnomeHammer: {
    rows: ["..kkkkkkkkkk..", ".kLLLLLLLLLSk.", ".kLSSSSSSSSDk.", ".kLSySSSSySDk.", ".kLSSSyySSSDk.", ".kLSSSSSSSSDk.", ".kSDDDDDDDDDk.", "..kkkkwWkkkk..", "......wW......", "......wW......", "......wW......", ".....bbbb.....", "......wW......", "......kk......"],
    pal: { k: "#2a2018", L: "#c8b8a0", S: "#8a7a68", D: "#5a4a40", y: "#8af0a0", w: "#6a4a2a", W: "#a87a4a", b: "#e0b040" },
  },
  dryadOrb: {
    rows: [".l........l...", "lLl..kkk..lLl.", ".l..kGGGk..l..", "...kGWLGGk....", "..kGWLGGGgk...", "..kGLGGGGgk...", "..kGGGGGggk...", "..kgGGGgggk...", "...kggggk.....", "..lbkkkkbl....", ".lLbbbbbbLl...", "...bBbbBb.....", "....bbbb......", "...l.bb.l....."],
    pal: { l: "#5ad07a", L: "#a8f0b0", k: "#0e3a1e", G: "#3ab060", g: "#1a7a3a", W: "#ffffff", b: "#6a4a2a", B: "#a87a4a" },
  },
  aphroditeMirror: {
    rows: [".....rr.rr....", ".....rPrrr..P.", "......rrr.....", "....gggggg....", "...gGcccWcg...", "..gGcWcccccg..", "..gGWccccbcg..", "..gGcccccbcg..", "...gGcccbcg...", "....gggggg....", "......gG......", "......gG......", ".....gGGg.....", "....gggggg...."],
    pal: { r: "#ff5a8a", P: "#ffc8d8", g: "#b88a20", G: "#ffe080", c: "#c8f0ff", b: "#8ac8e8", W: "#ffffff" },
  },
  godShard: {
    rows: ["......W.......", "......y.......", ".W...kyk...W..", ".....kWyk.....", "....kWWyyk....", "...kWWyyyok...", "y.kWWyyyyook.y", "..kWyyyyyook..", "...kyyyyook...", "....kyyook....", ".....kyok.....", "......kk......", "......y.......", ".W....W....W.."],
    pal: { W: "#fffbe0", y: "#ffd040", o: "#e09020", k: "#8a5a10" },
  },
  aetherBomb: {
    rows: ["...........W..", "..........WsW.", "........bb.W..", "....kkkbbk....", "...kPPPPPPk...", "..kPLWPPPPpk..", "..kPWPPcPPpk..", ".kPPPPcccPPpk.", ".kPPPPPcPPPpk.", ".kPPPcPPPPppk.", "..kPPccPPppk..", "..kpPPPPpppk..", "...kppppppk...", "....kkkkkk...."],
    pal: { W: "#ffffff", s: "#ffd040", b: "#a8a0b0", k: "#1a0a30", P: "#6a3aa8", p: "#3a1a6a", L: "#b080ff", c: "#e0b0ff" },
  },
  forbiddenScroll: {
    rows: [".RrrrrrrrrrrR.", "RRRRRRRRRRRRRR", ".pPPPPPPPPPPp.", ".pPnnnPPnnnPp.", ".pPPPPPPPPPPp.", ".pPnnPooPnnPp.", ".pPPPoyyoPPPp.", ".pPnnoyyoPnnp.", ".pPPPPooPPPPp.", ".pPnnnPPnnnPp.", ".pPPPPPPPPPPp.", "RRRRRRRRRRRRRR", ".RrrrrrrrrrrR.", "..cc......cc.."],
    pal: { R: "#6a2a1a", r: "#a84a2a", p: "#c8b088", P: "#ecdcb0", n: "#6a4a3a", o: "#d82a2a", y: "#ffb060", c: "#8a8a9a" },
  },
  blizzardLance: {
    rows: ["..s....W....s.", "......WlW.....", "......lcb.....", "..W...lcb...W.", ".WlW..lcb..WlW", ".lcb..lcb..lcb", ".lcb..lcb..lcb", ".lcb..lcb..lcb", ".kgk..kgk..kgk", "..d....d....d.", "..d....d....d.", "fFfFfFfFfFfFfF", ".fFFfFFFfFFFf.", "..f...f...f..."],
    pal: { s: "#ffffff", W: "#ffffff", l: "#e8f8ff", c: "#9ad8ff", b: "#4a8ac8", k: "#2a4a7a", g: "#e0c060", d: "#4a6a9a", f: "#c8f0ff", F: "#7ab8e8" },
  },
  fallenWings: {
    rows: ["....yyyyyy....", "...y......y...", "....yyy.yy....", "WW..........WW", "WwW........WwW", ".WwW......WwW.", "WWwwW....WwwWW", ".WWwwWggWwwWW.", "..WWwWggWwWW..", "WWWwwWggWwwWWW", ".WWWwW..WwWWW.", "..WWw....wWW..", "...Ww....wW...", "....w....w...."],
    pal: { y: "#ffd060", W: "#fff6d8", w: "#d8c8a0", g: "#e0a030" },
  },
  petFlute: {
    rows: ["............bB", "...........bBb", "..n.......bBb.", "..nn.....bBb..", ".nn.....bkb...", ".n.....bBb....", "......bkb.....", ".....bBb...h.h", "....bkb....hhh", "...bBb......h.", "..gBb.........", ".gBg..........", "gBg...........", ".g............"],
    pal: { b: "#8a5a2a", B: "#c89a5a", k: "#2a1a0a", g: "#e0b040", n: "#c8f0ff", h: "#ff8ab8" },
  },
  // 귀환의 문: 돌 아치 안에 푸른 소용돌이
  portalGun: {
    rows: ["....kkkkkk....", "..kkSSSSSSkk..", ".kSSkkkkkkSSk.", ".kSkccccccKSk.", "kSkcCCCCCCcKSk", "kSkcCwwwwCcKSk", "kSkcCwWWwCcKSk", "kSkcCwWWwCcKSk", "kSkcCwwwwCcKSk", "kSkcCCCCCCcKSk", "kSkccccccccKSk", "kSSkkkkkkkkSSk", "kggggggggggggk", "kkkkkkkkkkkkkk"],
    pal: { k: "#1a1a2a", S: "#8a8aa0", K: "#5a5a70", c: "#2a4a9a", C: "#3a7ad0", w: "#6ad0ff", W: "#e8f8ff", g: "#6a6a80" },
  },
  fateDice: { rows: DICE_ROWS, pal: { k: "#6a5a48", T: "#fffaf0", F: "#f2ecdc", S: "#c8c0a8", r: "#e03a3a", y: "#ffe080" } },
  cursedDice: { rows: DICE_ROWS, pal: { k: "#8a3aa8", T: "#4a2a5a", F: "#2a1a30", S: "#140a18", r: "#ff3a5a", y: "#c060ff" } },
  terraform: {
    rows: [".....kkkk.....", "...kkoooOkk...", "..koogggooOk..", ".kooggGgoooOk.", ".kogggggsooOk.", "kooogggsssooOk", "koooogsssoooOk", "koooooossoogOk", "koggooooooggOk", ".kgggoooogggk.", ".kogggooggoOk.", "..koooooooOk..", "...kkoooOkk...", ".....kkkk....."],
    pal: { k: "#142a5a", o: "#3a7ad0", O: "#2a4a9a", g: "#5ab05a", G: "#a8f0a0", s: "#d8b060" },
  },
  crumblingCrown: {
    rows: ["..............", "..g...g...g...", ".gYg.gYg.gYg..", ".gYg.gYg.gYg..", ".gYYgYYYgYYg..", ".gYrYYgYYrYg..", ".gYYYYYYYYYg..", ".gRYYYvYYYRg..", ".gYYYYYYYYYg..", "..gYY.YYY.Yg..", "..ggg.gg..gg..", "....l....l....", "...l..l.....l.", ".............."],
    pal: { g: "#6a4a10", Y: "#e0b030", r: "#ff3a3a", R: "#8a1a1a", v: "#8aff6a", l: "#b8ff8a" },
  },
  dimensionGate: {
    rows: ["....kkkkkk....", "..kkSSSSSSkk..", ".kSSPppppPSSk.", ".kSPpvvvvpPSk.", "kSSPpvVVvpPSSk", "kSrPvVWWVvPrSk", "kSSPvVWWVvPSSk", "kSrPpvVVvpPrSk", "kSSPpvvvvpPSSk", "kSSPPppppPPSSk", "kSrPPPPPPPPrSk", "kSSSSSSSSSSSSk", "kDDDDDDDDDDDDk", "kkkkkkkkkkkkkk"],
    pal: { k: "#2a2a3a", S: "#8a8aa0", D: "#5a5a70", r: "#c8a8ff", P: "#8a5aff", p: "#6a3aff", v: "#3a1a8a", V: "#c060ff", W: "#ffffff" },
  },
};
