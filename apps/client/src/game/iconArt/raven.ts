// 실베르 레이븐 아이콘: 흑백 체스 기물·금빛 빛 · 무기 1 (왕국의 창) · 전용 아이템 20
import type { Pen } from "./pen";

const GOLD = "#ffd040";
const PALE = "#fff2b8";
const WHITE = "#f4f2fa";
const SILVER = "#b8bcc8";
const BLACK = "#2a2834";
const DARK = "#14121a";

/** 폰 (아래 가운데 cx, by · col 몸 색) */
function pawn(g: Pen, cx: number, by: number, col = WHITE): Pen {
  return g.disc(cx, by - 5, 1, col).rect(cx - 1, by - 3, 3, 2, col).rect(cx - 2, by - 1, 5, 1, col).px(cx, by - 5, PALE);
}
/** 킹 (아래 가운데 cx, by) */
function king(g: Pen, cx: number, by: number, col = BLACK): Pen {
  return g.line(cx, by - 11, cx, by - 8, GOLD).line(cx - 1, by - 10, cx + 1, by - 10, GOLD).rect(cx - 2, by - 7, 5, 2, GOLD).rect(cx - 1, by - 5, 3, 4, col).rect(cx - 3, by - 1, 7, 1, GOLD);
}
/** 퀸 (아래 가운데 cx, by) */
function queen(g: Pen, cx: number, by: number, col = WHITE): Pen {
  return g.px(cx - 2, by - 9, GOLD).px(cx, by - 10, GOLD).px(cx + 2, by - 9, GOLD).rect(cx - 2, by - 8, 5, 2, GOLD).rect(cx - 1, by - 6, 3, 5, col).rect(cx - 3, by - 1, 7, 1, GOLD);
}
/** 룩 (아래 가운데 cx, by) */
function rook(g: Pen, cx: number, by: number, col = BLACK): Pen {
  return g.px(cx - 2, by - 8, SILVER).px(cx, by - 8, SILVER).px(cx + 2, by - 8, SILVER).rect(cx - 2, by - 7, 5, 1, SILVER).rect(cx - 1, by - 6, 3, 5, col).rect(cx - 3, by - 1, 7, 1, SILVER);
}
/** 나이트 머리 (아래 가운데 cx, by) */
function knight(g: Pen, cx: number, by: number, col = GOLD): Pen {
  return g.line(cx - 1, by - 9, cx + 2, by - 7, col).line(cx - 3, by - 6, cx + 2, by - 7, col).rect(cx - 1, by - 6, 3, 5, col).rect(cx - 3, by - 1, 7, 1, col).px(cx, by - 7, DARK);
}
/** 비숍 (아래 가운데 cx, by) */
function bishop(g: Pen, cx: number, by: number, col = WHITE): Pen {
  return g.px(cx, by - 10, SILVER).disc(cx, by - 7, 1, col).rect(cx - 1, by - 5, 3, 4, col).rect(cx - 3, by - 1, 7, 1, SILVER).px(cx + 1, by - 8, DARK);
}
/** 흑백 체스판 (x, y 왼쪽 위 · n칸 · 칸 크기 k) */
function board(g: Pen, x: number, y: number, n: number, k: number): Pen {
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g.rect(x + i * k, y + j * k, k, k, (i + j) % 2 ? BLACK : WHITE);
  return g;
}

export const RV_WEAPON_ART = {
  rvLance: (g: Pen) => g.line(2, 14, 12, 4, SILVER).line(11, 3, 14, 1, PALE).line(12, 5, 14, 3, GOLD).line(10, 2, 13, 5, GOLD).px(2, 14, DARK).px(7, 9, GOLD),
};

export const RV_PASSIVE_ART = {
  rvPawn: (g: Pen) => pawn(pawn(pawn(g, 3, 14, GOLD), 8, 14, GOLD), 13, 14, GOLD).line(1, 4, 14, 4, PALE).line(11, 2, 14, 4, PALE),
  rvKnight: (g: Pen) => knight(g, 10, 15).line(2, 3, 2, 9, PALE).line(2, 9, 6, 9, PALE).px(6, 8, GOLD),
  rvBishop: (g: Pen) => bishop(g, 8, 15).line(0, 0, 5, 5, GOLD).line(15, 0, 10, 5, GOLD).px(1, 1, PALE).px(14, 1, PALE),
  rvRook: (g: Pen) => rook(g, 7, 15).line(12, 5, 15, 5, PALE).line(12, 8, 15, 8, PALE).line(12, 11, 15, 11, PALE),
  rvQueen: (g: Pen) => queen(g, 8, 13).line(8, 0, 8, 2, GOLD).line(1, 7, 3, 7, GOLD).line(13, 7, 15, 7, GOLD).px(2, 1, PALE).px(14, 1, PALE).px(2, 13, PALE).px(14, 13, PALE),
  rvKing: (g: Pen) => king(g, 8, 13).line(3, 15, 13, 15, GOLD).line(1, 14, 3, 15, PALE).line(15, 14, 13, 15, PALE),
  rvBoard: (g: Pen) => board(g, 2, 2, 6, 2).line(6, 1, 6, 5, GOLD).line(10, 9, 10, 13, GOLD).px(6, 0, PALE).px(10, 8, PALE),
  rvMate: (g: Pen) => king(g.ring(8, 8, 7, GOLD), 8, 13).px(1, 8, PALE).px(15, 8, PALE).px(8, 0, PALE),
  rvPromote: (g: Pen) => queen(pawn(g, 3, 14, SILVER), 11, 14).line(5, 9, 8, 6, PALE).px(8, 5, GOLD),
  rvCastle: (g: Pen) => king(rook(g, 4, 15), 12, 15).line(5, 3, 11, 3, GOLD).px(10, 2, GOLD).px(10, 4, GOLD).ring(8, 9, 7, PALE),
  rvAssault: (g: Pen) => rook(bishop(knight(g, 3, 15), 8, 15), 13, 15).line(1, 2, 14, 2, GOLD),
  rvGrand: (g: Pen) => board(g, 0, 8, 8, 2).line(8, 0, 8, 15, GOLD).line(1, 4, 15, 4, GOLD).disc(8, 4, 1, PALE),
  rvEnPassant: (g: Pen) => pawn(pawn(g, 5, 14), 11, 9, GOLD).line(6, 8, 10, 4, PALE).px(10, 3, GOLD),
  rvGuard: (g: Pen) => pawn(pawn(rook(g, 8, 15), 3, 15, GOLD), 13, 15, GOLD).line(1, 2, 15, 2, PALE),
  rvIron: (g: Pen) => king(g, 8, 11).line(2, 14, 14, 14, GOLD).line(1, 12, 3, 14, PALE).line(15, 12, 13, 14, PALE).px(8, 15, PALE),
  rvRadiance: (g: Pen) => g.rect(3, 3, 2, 12, PALE).rect(8, 6, 2, 9, GOLD).rect(12, 9, 2, 6, GOLD).px(3, 1, WHITE).px(8, 4, WHITE).px(12, 7, WHITE),
  rvChain: (g: Pen) => g.ring(4, 8, 3, GOLD).ring(11, 8, 3, GOLD).line(7, 8, 8, 8, PALE).px(4, 8, WHITE).px(11, 8, WHITE).line(1, 14, 14, 14, SILVER),
  rvTempo: (g: Pen) => g.ring(8, 8, 6, SILVER).line(8, 8, 8, 4, GOLD).line(8, 8, 11, 9, GOLD).px(8, 1, PALE).px(15, 8, PALE).px(8, 15, PALE).px(1, 8, PALE),
  rvStale: (g: Pen) => king(queen(g, 4, 15), 12, 15).rect(7, 1, 2, 14, SILVER),
  rvGambit: (g: Pen) => pawn(g, 8, 15, GOLD).line(3, 4, 7, 4, WHITE).line(5, 2, 5, 6, WHITE).line(10, 3, 13, 6, PALE).line(13, 3, 10, 6, PALE),
};
