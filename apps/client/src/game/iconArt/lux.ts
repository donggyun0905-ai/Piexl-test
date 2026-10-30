// 빛의 사도(한정) 아이콘: 빛의 검 · 빛의 조각 · 전용 아이템 10 (주황 테두리·노란 가운데의 '+' 빛 · 검정 옷 · 흰빛)
import { type Pen } from "./pen";

const OR = "#ff8a1a";
const OR_D = "#c8500a";
const YE = "#ffe060";
const WH = "#fffbe8";
const BK = "#1a1622";
const BK_L = "#3a3046";
const SK = "#f4dcc8";

/** '+' 빛 (가운데 cx·cy, 팔 길이 a): 주황 테두리 · 노란 속 · 흰 가운데 */
function star(g: Pen, cx: number, cy: number, a: number): void {
  for (let i = -a; i <= a; i++) {
    const edge = Math.abs(i) >= a - 1;
    const w = Math.abs(i) <= 1 ? 2 : 1;
    for (let j = -w; j <= w; j++) {
      g.px(cx + i, cy + j, edge || Math.abs(j) === w ? OR : YE);
      g.px(cx + j, cy + i, edge || Math.abs(j) === w ? OR : YE);
    }
  }
  g.px(cx, cy, WH).px(cx + 1, cy, WH).px(cx, cy + 1, WH);
}

export const LX_WEAPON_ART = {
  luxBlade: (g: Pen) => {
    // 가늘고 긴 빛의 칼날 (대각선) · 십자 날밑 · 칼끝 반짝임
    for (let i = 0; i < 10; i++) g.px(4 + i, 11 - i, i > 7 ? WH : YE).px(5 + i, 11 - i, OR);
    g.line(2, 11, 6, 15, OR_D).px(4, 13, YE);
    g.line(1, 15, 3, 13, BK_L);
    g.px(14, 1, WH).px(13, 0, YE).px(15, 2, YE).px(12, 1, OR).px(14, 3, OR);
  },
};

export const LX_PASSIVE_ART = {
  lxShard: (g: Pen) => {
    // 빛나는 조각 (마름모) + 작은 반짝임
    for (let y = 0; y < 5; y++) g.line(8 - y, 3 + y, 8 + y, 3 + y, y < 2 ? WH : YE).line(8 - y, 12 - y, 8 + y, 12 - y, y < 1 ? OR_D : OR);
    g.px(3, 3, YE).px(13, 4, WH).px(12, 13, YE);
  },
  lxHalo: (g: Pen) => {
    g.ring(8, 8, 6, OR).ring(8, 8, 5, YE).px(8, 2, WH).px(3, 8, WH);
  },
  lxSwift: (g: Pen) => {
    // 흰 깃털 + 빛 줄
    g.line(4, 13, 12, 3, WH).line(5, 11, 9, 4, YE).line(7, 12, 12, 6, YE).px(12, 3, OR).line(1, 9, 4, 9, OR).line(2, 12, 5, 12, OR);
  },
  lxReach: (g: Pen) => {
    star(g, 11, 5, 3);
    g.line(1, 14, 8, 8, OR_D).px(3, 12, YE).px(6, 10, YE);
  },
  lxGrace: (g: Pen) => {
    // 검은 옷자락 · 빛 테두리
    g.rect(4, 3, 8, 10, BK).line(4, 13, 2, 15, BK).line(11, 13, 13, 15, BK).line(4, 3, 4, 13, OR).line(11, 3, 11, 13, OR).rect(7, 3, 2, 10, SK).px(7, 9, YE).px(8, 9, YE);
  },
  lxMore: (g: Pen) => {
    star(g, 6, 6, 4);
    star(g, 11, 11, 3);
  },
  lxQuick: (g: Pen) => {
    star(g, 9, 8, 4);
    g.line(0, 6, 3, 6, OR).line(0, 10, 3, 10, OR).line(1, 8, 4, 8, YE);
  },
  lxWide: (g: Pen) => {
    star(g, 8, 8, 6);
  },
  lxPierce: (g: Pen) => {
    g.rect(6, 3, 4, 10, BK_L).line(0, 8, 15, 8, YE).line(0, 7, 15, 7, OR).px(15, 8, WH).px(14, 7, WH);
  },
  lxJudge: (g: Pen) => {
    star(g, 8, 8, 5);
    g.ring(8, 8, 7, OR_D);
  },
  lxTattoo: (g: Pen) => {
    // 배 가운데 빛의 문신 (피부 위 작은 '+'와 광채)
    g.rect(3, 2, 10, 12, SK).rect(3, 2, 2, 12, BK).rect(11, 2, 2, 12, BK);
    star(g, 8, 8, 3);
  },
};
