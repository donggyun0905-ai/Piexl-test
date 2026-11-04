// 아스칼론 레오 아이콘: 뇌전 발톱 무기 1 · 전용 아이템 10 (금빛 갈기 · 파란 보석 · 노란 번개)
import { type Pen } from "./pen";

const MANE = "#ffc820";
const MANE2 = "#e89a10";
const FUR = "#f4ecdc";
const BOLT = "#fff27a";
const BOLT2 = "#ffd020";
const GEM = "#3a6aff";
const GEM2 = "#a8c8ff";
const ARMOR = "#2a3a9a";
const K = "#3a2a1a";

/** 번개 한 줄기 (위 → 아래 꺾임) */
function zap(g: Pen, x: number, y: number, h = 6): void {
  g.line(x, y, x - 2, y + h / 2, BOLT2).line(x - 2, y + h / 2, x + 1, y + h / 2, BOLT2).line(x + 1, y + h / 2, x - 1, y + h, BOLT2);
  g.px(x, y, BOLT).px(x - 1, y + h / 2, BOLT).px(x - 1, y + h, "#ffffff");
}

/** 마름모 보석 */
function gem(g: Pen, cx: number, cy: number, r = 2): void {
  for (let k = 0; k <= r; k++) g.line(cx - (r - k), cy - k, cx + (r - k), cy - k, GEM).line(cx - (r - k), cy + k, cx + (r - k), cy + k, GEM);
  g.px(cx, cy - r + 1, GEM2).px(cx - 1, cy, GEM2).px(cx, cy - r, "#ffffff");
}

/** 사자 얼굴 (갈기 둘레 · 이마 보석) */
function face(g: Pen, roar = false): void {
  g.disc(8, 8, 6, MANE).disc(8, 8, 5, MANE2).disc(8, 9, 4, MANE).rect(5, 7, 6, 6, FUR).rect(6, 13, 4, 1, FUR);
  g.px(6, 9, K).px(9, 9, K).rect(7, 11, 2, 1, "#c86a5a");
  if (roar) g.rect(6, 11, 4, 2, "#a82a2a").px(6, 11, "#ffffff").px(9, 11, "#ffffff");
  gem(g, 8, 6, 1);
}

export const LE_WEAPON_ART = {
  leClaw: (g: Pen) => {
    // 발톱 세 줄 할퀸 자국 + 번개
    for (let i = 0; i < 3; i++) g.line(3 + i * 3, 2 + i, 7 + i * 3, 13 - i, i === 1 ? BOLT : BOLT2).px(7 + i * 3, 13 - i, "#ffffff");
    g.rect(1, 11, 4, 4, MANE).px(2, 10, FUR).px(4, 10, FUR).px(1, 15, MANE2);
  },
};

export const LE_PASSIVE_ART = {
  leMane: (g: Pen) => {
    g.disc(8, 8, 6, MANE).disc(8, 8, 3, MANE2);
    zap(g, 3, 1, 6);
    zap(g, 13, 8, 6);
    g.px(8, 2, BOLT).px(2, 12, BOLT);
  },
  leSky: (g: Pen) => {
    gem(g, 8, 11, 3);
    zap(g, 5, 0, 6);
    zap(g, 12, 0, 6);
  },
  leRoar: (g: Pen) => {
    face(g, true);
    g.ring(8, 9, 7, BOLT2).px(1, 4, BOLT).px(14, 4, BOLT);
  },
  lePounce: (g: Pen) => {
    g.line(1, 13, 6, 8, BOLT2).line(2, 14, 7, 9, BOLT).line(6, 8, 9, 4, BOLT2);
    g.rect(9, 3, 5, 4, MANE).rect(10, 7, 3, 3, FUR).px(14, 4, K).px(13, 10, FUR).px(10, 10, FUR);
  },
  leChain: (g: Pen) => {
    g.disc(3, 3, 1, BOLT2).disc(12, 7, 1, BOLT2).disc(5, 13, 1, BOLT2);
    g.line(3, 3, 7, 6, BOLT).line(7, 6, 12, 7, BOLT).line(12, 7, 8, 10, BOLT).line(8, 10, 5, 13, BOLT).px(7, 6, "#ffffff").px(8, 10, "#ffffff");
  },
  leStorm: (g: Pen) => {
    g.rect(2, 3, 12, 3, "#5a5a7a").rect(4, 2, 7, 1, "#7a7a9a").rect(3, 6, 10, 1, "#3a3a5a");
    zap(g, 6, 7, 6);
    zap(g, 11, 7, 5);
  },
  lePride: (g: Pen) => {
    face(g);
    g.px(2, 2, BOLT).px(13, 2, BOLT).px(1, 8, BOLT2).px(14, 8, BOLT2);
  },
  leFang: (g: Pen) => {
    g.rect(2, 4, 12, 2, "#c86a5a").rect(2, 10, 12, 2, "#c86a5a");
    for (let i = 0; i < 3; i++) g.line(3 + i * 4, 6, 4 + i * 4, 9, "#ffffff").px(4 + i * 4, 9, BOLT);
    zap(g, 13, 1, 4);
  },
  leArmor: (g: Pen) => {
    g.rect(3, 3, 10, 10, ARMOR).rect(3, 3, 10, 1, MANE).rect(3, 12, 10, 1, MANE).rect(3, 3, 1, 10, MANE).rect(12, 3, 1, 10, MANE);
    gem(g, 8, 8, 2);
    g.px(1, 6, BOLT).px(14, 10, BOLT).px(2, 13, BOLT2);
  },
  leKing: (g: Pen) => {
    face(g);
    g.rect(4, 0, 8, 2, BOLT2).px(4, 0, BOLT).px(8, 0, BOLT).px(11, 0, BOLT).px(8, 1, GEM);
  },
};
