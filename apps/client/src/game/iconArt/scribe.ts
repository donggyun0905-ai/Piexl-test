// 서기관(히든) 아이콘: 무기 10개(펜·붓·두루마리·책) · 전용 아이템 10개 (잉크·종이·도장)
import { K, Pen } from "./pen";

const INK = "#2a1e48";
const VIO = "#b89aff";
const PAPER = "#f2e6cc";
const PAPER_D = "#c8b088";
const GOLD = "#ffd040";
const WH = "#ffffff";

/** 펼친 책 (표지 색 c, 페이지에 글자 줄) */
function book(g: Pen, c: string, mark?: string): void {
  g.rect(1, 4, 14, 10, c).rect(2, 3, 5, 10, PAPER).rect(9, 3, 5, 10, PAPER).rect(7, 3, 2, 11, PAPER_D);
  for (const y of [5, 7, 9, 11]) g.rect(3, y, 3, 1, INK).rect(10, y, 3, 1, INK);
  if (mark) g.rect(10, 5, 3, 3, mark);
}

/** 두루마리 (가로) */
function scroll(g: Pen, band: string): void {
  g.rect(3, 4, 10, 8, PAPER).rect(2, 3, 2, 10, PAPER_D).rect(12, 3, 2, 10, PAPER_D).rect(3, 7, 10, 2, band);
}

export const SCRIBE_WEAPON_ART: Record<"quillPen" | "inkBrush" | "sealScroll" | "thunderTome" | "frostCodex" | "flameTablet" | "chronicle" | "starScripture" | "oblivionPage" | "akashicOrigin", (g: Pen) => void> = {
  quillPen: (g) => {
    g.line(3, 13, 12, 2, WH).line(4, 13, 13, 3, "#e0d8f0").line(6, 10, 12, 4, "#c8c0e0").line(2, 14, 3, 13, INK).px(2, 15, VIO);
  },
  inkBrush: (g) => {
    g.line(4, 12, 11, 3, "#8a5a2a").line(5, 12, 12, 4, "#6a4020").rect(2, 12, 3, 3, INK).px(1, 14, INK).px(4, 15, VIO);
  },
  sealScroll: (g) => {
    scroll(g, "#c8283a");
    g.disc(8, 8, 2, "#e84a4a").px(8, 8, GOLD);
  },
  thunderTome: (g) => {
    book(g, "#3a3a6a");
    g.line(11, 4, 10, 8, GOLD).line(10, 8, 12, 8, GOLD).line(12, 8, 10, 12, GOLD);
  },
  frostCodex: (g) => {
    book(g, "#3a6a9a");
    g.line(11, 5, 11, 11, "#c8f0ff").line(9, 8, 13, 8, "#c8f0ff").px(11, 8, WH);
  },
  flameTablet: (g) => {
    g.rect(3, 3, 10, 11, "#8a6a4a").rect(4, 4, 8, 9, "#b88a5a").rect(6, 8, 4, 4, "#ff6a2a").rect(7, 6, 2, 3, "#ffb040").px(7, 5, "#ffe08a");
  },
  chronicle: (g) => {
    book(g, "#6a3a1a", VIO);
    g.ring(11, 6, 2, GOLD);
  },
  starScripture: (g) => {
    book(g, "#1a1440");
    g.px(11, 5, GOLD).px(10, 6, GOLD).px(12, 6, GOLD).px(11, 7, GOLD).px(11, 6, WH).px(4, 10, "#fff4c0");
  },
  oblivionPage: (g) => {
    g.rect(4, 2, 9, 12, "#3a3048").rect(5, 3, 7, 10, "#6a5a7a");
    for (const y of [5, 7, 9]) g.rect(6, y, 5, 1, "#1a1020");
    g.disc(8, 11, 2, "#1a1020").px(8, 11, VIO);
  },
  akashicOrigin: (g) => {
    book(g, "#4a2a8a", GOLD);
    g.ring(8, 8, 6, VIO).px(8, 1, WH).px(8, 15, WH).px(1, 8, WH).px(15, 8, WH);
  },
};

export const SCRIBE_PASSIVE_ART: Record<"inkWell" | "thickNib" | "footnote" | "preface" | "parchment" | "sealStamp" | "shorthand" | "censor" | "revision" | "forbiddenBook", (g: Pen) => void> = {
  inkWell: (g) => g.rect(4, 7, 8, 7, "#3a3058").rect(6, 5, 4, 2, "#5a4a7a").rect(5, 9, 6, 3, INK).line(9, 1, 11, 5, WH),
  thickNib: (g) => g.line(3, 13, 11, 5, "#8a8aa0").line(4, 13, 12, 5, "#c8c8d8").rect(10, 3, 4, 4, GOLD).px(3, 14, INK),
  footnote: (g) => g.rect(3, 2, 10, 12, PAPER).rect(4, 4, 7, 1, INK).rect(4, 6, 7, 1, INK).rect(4, 11, 4, 1, VIO).px(9, 10, VIO),
  preface: (g) => g.rect(3, 2, 10, 12, PAPER).rect(5, 4, 6, 3, "#c8283a").rect(4, 9, 8, 1, INK).rect(4, 11, 6, 1, INK),
  parchment: (g) => g.rect(3, 3, 10, 10, "#e8d4a8").rect(2, 2, 2, 12, PAPER_D).rect(12, 2, 2, 12, PAPER_D).ring(8, 8, 3, "#6ad8ff"),
  sealStamp: (g) => g.rect(5, 2, 6, 6, "#8a5a2a").rect(4, 8, 8, 3, "#c8283a").rect(5, 12, 6, 2, "#e84a4a").px(7, 12, PAPER),
  shorthand: (g) => g.line(2, 12, 6, 4, WH).line(7, 12, 11, 4, WH).line(12, 12, 14, 8, VIO).px(2, 13, INK).px(7, 13, INK),
  censor: (g) => g.rect(3, 3, 10, 10, PAPER).rect(4, 6, 8, 2, K).rect(4, 9, 6, 2, K).line(2, 2, 13, 13, "#e84a4a"),
  revision: (g) => g.rect(2, 3, 8, 10, PAPER_D).rect(6, 4, 8, 10, PAPER).rect(8, 7, 4, 1, INK).rect(8, 9, 4, 1, INK).px(13, 4, GOLD),
  forbiddenBook: (g) => {
    book(g, "#1a1020");
    g.line(1, 8, 15, 8, "#8a1a3a").rect(7, 7, 2, 3, GOLD);
  },
};



