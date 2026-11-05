// 탈라시아 리바이어 아이콘: 창끝에 박힌 힘의 보석 무기 10 · 전용 아이템 20 (창 10 · 고래 10)
import { star, type Pen } from "./pen";

const GOLD = "#ffc850";
const SEA = "#2a8ae8";
const DEEP = "#1a4aa8";
const CYAN = "#5ae0ff";
const FOAM = "#e8faff";
const BELLY = "#bfeeff";

/** 금빛 창 자루 (왼쪽 아래 → 보석 자리) */
function shaft(g: Pen): void {
  g.line(1, 14, 7, 8, GOLD).px(2, 14, "#a07a2a").px(4, 12, "#a07a2a");
}

/** 보석 (가운데 cx·cy, 마름모 크기 r): 테두리 · 색 · 반짝임 */
function gem(g: Pen, c: string, hi: string, cx = 10, cy = 6, r = 4): void {
  shaft(g);
  for (let d = -r; d <= r; d++) {
    const w = r - Math.abs(d);
    g.line(cx - w, cy + d, cx + w, cy + d, c);
  }
  g.px(cx, cy - r, "#0a2a5a").px(cx - r, cy, "#0a2a5a").px(cx + r, cy, "#0a2a5a").px(cx, cy + r, "#0a2a5a");
  g.px(cx - 1, cy - 2, hi).px(cx - 2, cy - 1, hi).px(cx - 1, cy - 1, FOAM);
}

/** 작은 고래 (머리 x0 쪽 오른쪽, 세로 y): 등 · 흰 배 · 꼬리 · 눈 */
function whale(g: Pen, x0 = 3, y = 8, c = SEA): void {
  g.rect(x0 + 1, y - 2, 8, 4, c).rect(x0 + 2, y - 3, 6, 1, c).rect(x0 + 2, y + 1, 7, 1, BELLY);
  g.px(x0 + 9, y - 1, c).px(x0 + 9, y, c);
  g.px(x0, y - 1, c).px(x0 - 1, y - 2, c).px(x0 - 1, y + 1, c).px(x0 - 2, y - 3, c).px(x0 - 2, y + 2, c);
  g.px(x0 + 7, y - 1, "#0a1a3a").px(x0 + 6, y - 2, FOAM);
}

export const LV_WEAPON_ART = {
  lvAqua: (g: Pen) => gem(g, "#5ad8f0", "#c8f8ff"),
  lvSapphire: (g: Pen) => {
    gem(g, "#2a5ae8", "#8ab0ff");
    g.line(9, 13, 15, 13, CYAN).px(12, 12, FOAM);
  },
  lvTopaz: (g: Pen) => {
    gem(g, "#ffc83a", "#fff0a0");
    g.line(15, 9, 13, 12, "#fff07a").line(13, 12, 15, 13, "#fff07a");
  },
  lvCoral: (g: Pen) => {
    gem(g, "#ff7a8a", "#ffd0d8");
    g.px(14, 11, "#ff7a8a").px(13, 12, "#ff7a8a").px(15, 12, "#ff7a8a").px(14, 13, "#ff9aaa");
  },
  lvMoon: (g: Pen) => {
    gem(g, "#d8e8ff", "#ffffff");
    g.px(13, 12, "#9ab8ff").px(14, 11, "#9ab8ff").px(14, 13, "#9ab8ff");
  },
  lvAbyss: (g: Pen) => {
    gem(g, "#1a2a6a", "#5a7aff");
    g.ring(10, 6, 5, "#3a5aff");
  },
  lvIce: (g: Pen) => {
    gem(g, "#a8f0ff", "#ffffff");
    g.px(14, 10, FOAM).px(13, 11, CYAN).px(15, 11, CYAN).px(14, 12, FOAM);
  },
  lvTwin: (g: Pen) => {
    shaft(g);
    g.disc(8, 5, 2, "#f0f0ff").disc(12, 8, 2, "#f0f0ff").px(7, 4, "#fff").px(11, 7, "#fff").px(9, 6, "#c8c8e8").px(13, 9, "#c8c8e8");
  },
  lvGale: (g: Pen) => {
    gem(g, "#5ae8b0", "#c8fff0");
    g.line(11, 12, 15, 12, FOAM).line(12, 14, 15, 14, CYAN);
  },
  lvKing: (g: Pen) => {
    gem(g, "#3a6aff", "#9ad8ff", 10, 6, 5);
    g.px(10, 6, "#ffc850").px(10, 5, "#0a1a3a").px(10, 7, "#0a1a3a");
  },
};

export const LV_PASSIVE_ART = {
  // ── 창 10 ──
  lvCrest: (g: Pen) => {
    for (let x = 1; x < 15; x++) g.px(x, 9 - Math.round(Math.sin((x / 14) * Math.PI) * 5), CYAN);
    g.line(2, 12, 14, 12, SEA).px(8, 4, FOAM).px(9, 4, FOAM);
  },
  lvSpiral: (g: Pen) => g.ring(8, 8, 6, SEA).ring(8, 8, 4, CYAN).ring(8, 8, 2, FOAM),
  lvBreaker: (g: Pen) => {
    g.line(2, 14, 8, 3, CYAN).line(8, 3, 14, 14, CYAN).line(4, 14, 8, 6, FOAM).line(8, 6, 12, 14, FOAM);
  },
  lvSurf: (g: Pen) => {
    g.line(2, 12, 13, 9, GOLD).line(1, 14, 15, 14, SEA).line(3, 13, 14, 13, CYAN);
    g.px(9, 7, "#ffd8b0").rect(8, 8, 2, 2, "#5ab0ff");
  },
  lvCurrent: (g: Pen) => {
    for (let i = 0; i < 3; i++) g.line(2, 4 + i * 4, 12, 4 + i * 4, i === 1 ? CYAN : SEA).px(13, 4 + i * 4, FOAM).px(12, 3 + i * 4, FOAM);
  },
  lvAnchorless: (g: Pen) => {
    g.rect(3, 10, 10, 2, "#a07a3a").rect(4, 12, 8, 1, "#7a5a2a").line(8, 2, 8, 10, "#d8c8a8");
    g.rect(9, 3, 4, 5, FOAM).px(6, 3, CYAN).px(5, 5, CYAN);
  },
  lvSalt: (g: Pen) => {
    g.line(2, 6, 13, 6, FOAM).line(4, 9, 15, 9, CYAN).line(1, 12, 11, 12, FOAM);
    g.px(13, 5, "#ffffff").px(6, 10, "#ffffff");
  },
  lvShell: (g: Pen) => {
    g.disc(8, 9, 5, "#ffd8b8").ring(8, 9, 5, "#d89a7a").line(8, 4, 8, 14, "#d89a7a").line(4, 7, 12, 11, "#e8b090");
    g.px(8, 2, "#ffb8a0").px(7, 3, "#ffb8a0").px(9, 3, "#ffb8a0");
  },
  lvFlag: (g: Pen) => {
    g.line(3, 2, 3, 15, "#d8c8a8").rect(4, 2, 9, 6, SEA).rect(4, 4, 9, 2, FOAM).px(13, 3, SEA).px(13, 6, SEA);
  },
  lvSpray: (g: Pen) => {
    shaft(g);
    g.line(8, 7, 11, 4, "#5ad8f0").px(12, 3, FOAM);
    g.px(13, 6, CYAN).px(14, 4, FOAM).px(11, 1, CYAN).px(14, 1, FOAM).px(12, 7, FOAM);
  },
  // ── 고래 10 ──
  lvCall: (g: Pen) => {
    whale(g, 4, 10);
    g.ring(13, 3, 2, CYAN).px(13, 3, FOAM);
  },
  lvSong: (g: Pen) => {
    whale(g, 3, 11);
    g.px(11, 2, FOAM).px(11, 3, FOAM).px(11, 4, FOAM).px(10, 4, FOAM).px(12, 2, FOAM).px(14, 5, CYAN).px(14, 6, CYAN).px(13, 6, CYAN);
  },
  lvCalf: (g: Pen) => {
    whale(g, 3, 6);
    g.rect(9, 11, 4, 2, "#7ac8ff").px(13, 11, "#7ac8ff").px(8, 11, "#7ac8ff").px(7, 10, "#7ac8ff").px(7, 13, "#7ac8ff").px(12, 11, "#0a1a3a");
  },
  lvBlowhole: (g: Pen) => {
    whale(g, 3, 12);
    g.line(8, 9, 8, 3, CYAN).px(6, 2, FOAM).px(10, 2, FOAM).px(7, 1, CYAN).px(9, 1, CYAN).px(5, 4, FOAM).px(11, 4, FOAM);
  },
  lvBaleen: (g: Pen) => {
    g.rect(2, 4, 12, 3, DEEP);
    for (let x = 3; x < 14; x += 2) g.line(x, 7, x, 12, "#e8d8a8");
    g.line(2, 13, 14, 13, SEA);
  },
  lvPod: (g: Pen) => {
    whale(g, 3, 4, DEEP);
    whale(g, 5, 9);
    whale(g, 3, 14, "#5ab0ff");
  },
  lvWhite: (g: Pen) => {
    whale(g, 3, 9, "#f0f8ff");
    g.px(10, 8, "#0a1a3a");
    star(g, 13, 3, "#c8f0ff");
  },
  lvAmber: (g: Pen) => {
    g.disc(8, 9, 5, "#d8a040").disc(7, 8, 3, "#f0c860").px(6, 6, "#fff0b0").px(5, 7, "#fff0b0");
    g.px(12, 3, FOAM).px(13, 2, CYAN);
  },
  lvDeep: (g: Pen) => {
    g.rect(0, 0, 16, 16, "#0a1a4a");
    whale(g, 4, 9, "#2a5ab8");
    g.px(3, 3, CYAN).px(7, 2, CYAN).px(12, 4, CYAN).px(2, 14, SEA).px(14, 14, SEA);
  },
  lvKingWhale: (g: Pen) => {
    whale(g, 3, 10);
    g.px(6, 5, GOLD).px(8, 4, GOLD).px(10, 5, GOLD).rect(6, 6, 5, 1, GOLD).px(8, 5, "#ff5a6a");
  },
};
