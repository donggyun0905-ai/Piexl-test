// 이드라 아이콘: 가이아(세계수 가지) · 전용 아이템 20개 (잎·뿌리·대궁·단검·방패·채찍·꽃)
import { bow, Pen } from "./pen";

const LEAF = "#5ac84a";
const LEAF_D = "#2a8a3a";
const BARK = "#7a5a32";
const BARK_D = "#4a3420";
const BLOOM = "#ff8ac8";
const GOLD = "#ffd040";
const WH = "#ffffff";

function leaf(g: Pen, x: number, y: number, c = LEAF): void {
  g.rect(x, y, 2, 2, c).px(x + 2, y, c).px(x - 1, y + 1, LEAF_D);
}
function dagger(g: Pen, x: number, y: number): void {
  g.line(x, y + 6, x + 1, y + 5, BARK).line(x + 2, y + 4, x + 6, y, "#c8e8a0").px(x + 1, y + 3, LEAF);
}
function shield(g: Pen, c = BARK): void {
  g.disc(8, 8, 6, c).ring(8, 8, 6, BARK_D).disc(8, 8, 2, LEAF).px(8, 8, GOLD);
}
function whip(g: Pen, c = "#3a7a2a"): void {
  g.line(2, 14, 4, 12, BARK).line(4, 12, 9, 10, c).line(9, 10, 12, 5, c).line(12, 5, 14, 2, c);
  for (const [x, y] of [[6, 10], [10, 8], [13, 4]]) g.px(x!, y! - 1, "#c8e8a0");
}

export const IDRA_WEAPON_ART: Record<"gaia", (g: Pen) => void> = {
  gaia: (g) => {
    bow(g, 4, 8, 6, BARK);
    leaf(g, 9, 1);
    leaf(g, 11, 13);
    g.px(12, 7, GOLD).px(13, 8, LEAF).px(12, 9, BLOOM);
  },
};

export const IDRA_PASSIVE_ART = {
  idSprout: (g: Pen) => g.line(8, 15, 8, 7, LEAF_D).rect(4, 5, 4, 3, LEAF).rect(9, 3, 4, 3, LEAF).px(8, 6, LEAF),
  idSap: (g: Pen) => g.rect(3, 2, 4, 13, BARK).px(8, 6, GOLD).rect(8, 7, 3, 3, "#ffb040").px(9, 10, "#ffb040").px(9, 7, WH),
  idBreeze: (g: Pen) => g.line(2, 5, 11, 5, "#a8e8ff").line(4, 9, 14, 9, "#a8e8ff").line(2, 13, 9, 13, "#a8e8ff").px(12, 4, "#a8e8ff").px(10, 12, LEAF),
  idRoots: (g: Pen) => g.rect(6, 1, 4, 6, BARK).line(7, 7, 3, 14, BARK_D).line(8, 7, 8, 15, BARK_D).line(9, 7, 13, 14, BARK_D),
  idClover: (g: Pen) => g.disc(5, 5, 2, LEAF).disc(11, 5, 2, LEAF).disc(5, 10, 2, LEAF).disc(11, 10, 2, LEAF).line(8, 8, 11, 15, LEAF_D),
  idPetal: (g: Pen) => g.rect(3, 9, 10, 4, BLOOM).rect(3, 13, 11, 2, "#c84a8a").disc(5, 6, 2, "#ffc8e8").px(10, 7, "#ffc8e8"),
  idAcorn: (g: Pen) => g.rect(4, 3, 8, 4, BARK_D).px(8, 1, BARK_D).disc(8, 10, 4, "#c88a3a").px(7, 9, "#e8b060"),
  idDew: (g: Pen) => {
    leaf(g, 2, 10, LEAF);
    g.px(9, 3, "#8ad8ff").rect(8, 4, 3, 3, "#8ad8ff").px(9, 7, "#8ad8ff").px(8, 4, WH);
  },
  idSplitArrow: (g: Pen) => g.line(2, 8, 13, 8, "#b89a6a").line(6, 8, 13, 3, "#b89a6a").line(6, 8, 13, 13, "#b89a6a").px(14, 8, LEAF).px(14, 2, LEAF).px(14, 14, LEAF),
  idRootArrow: (g: Pen) => g.line(2, 6, 13, 6, "#b89a6a").px(14, 6, LEAF).line(9, 7, 7, 13, BARK_D).line(11, 7, 13, 14, BARK_D),
  idTwinStab: (g: Pen) => {
    dagger(g, 1, 8);
    dagger(g, 7, 3);
  },
  idBreaker: (g: Pen) => {
    dagger(g, 2, 6);
    g.rect(9, 9, 6, 6, BARK).line(9, 9, 14, 14, BARK_D).px(12, 8, GOLD);
  },
  idThornShield: (g: Pen) => {
    shield(g);
    for (const [x, y] of [[8, 0], [0, 8], [15, 8], [8, 15], [2, 2], [13, 13]]) g.px(x!, y!, LEAF);
  },
  idAncientWall: (g: Pen) => {
    shield(g, "#8a7a5a");
    g.rect(2, 13, 12, 2, "#6a6a72");
  },
  idLongWhip: (g: Pen) => whip(g),
  idBramble: (g: Pen) => {
    whip(g, "#2a5a2a");
    g.px(4, 4, "#8a3ac8").px(6, 3, "#8a3ac8").px(3, 7, "#8a3ac8");
  },
  idBloomSwap: (g: Pen) => g.disc(8, 8, 3, GOLD).disc(4, 5, 2, BLOOM).disc(12, 5, 2, BLOOM).disc(4, 11, 2, BLOOM).disc(12, 11, 2, BLOOM).px(8, 8, WH),
  idGaiaGrace: (g: Pen) => g.ring(8, 8, 6, LEAF).px(6, 7, "#ff6a8a").px(10, 7, "#ff6a8a").rect(5, 8, 7, 1, "#ff6a8a").rect(6, 9, 5, 1, "#ff6a8a").px(8, 10, "#ff6a8a"),
  idFourSeasons: (g: Pen) => g.rect(2, 2, 6, 6, "#ff8ac8").rect(8, 2, 6, 6, "#5ac84a").rect(2, 8, 6, 6, "#e8a040").rect(8, 8, 6, 6, "#e8f4ff"),
  idWorldHeart: (g: Pen) => {
    g.disc(8, 6, 5, LEAF).rect(7, 10, 2, 5, BARK).line(4, 15, 12, 15, BARK_D);
    g.px(7, 5, "#ff4a6a").px(9, 5, "#ff4a6a").rect(6, 6, 5, 1, "#ff4a6a").rect(7, 7, 3, 1, "#ff4a6a").px(8, 8, "#ff4a6a");
  },
};
